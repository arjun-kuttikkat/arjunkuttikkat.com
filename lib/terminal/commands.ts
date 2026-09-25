import { socialLinks } from "../data";
import {
  EDGAZE_URL,
  edgazeApi,
  edgazeBilling,
  edgazeLinks,
  edgazeMcp,
  edgazeMonitoredServices,
  edgazeState,
  edgazeTimeline,
} from "../edgaze";
import { aboutClosingLine, aboutParagraphs } from "../about-content";
import { projectStateLabel, projects } from "../projects";
import { contactEmail, siteUrl } from "../site";
import { stackTechnologyNames } from "../technologies";
import { figlet } from "./figlet";
import { buildFs, columns, findDir, findFile, HOME, resolvePath, type FsDir, type FsFile } from "./fs";
import {
  TERMINAL_HOST,
  TERMINAL_USER,
  TERMINAL_VERSION,
  type CommandResult,
  type MenuItem,
  type TermBlock,
  type TermEntry,
  type TermEnv,
  type TermLine,
} from "./types";

type Command = {
  name: string;
  aliases?: string[];
  usage: string;
  description: string;
  /** Hidden commands run but are left out of `help`. */
  hidden?: boolean;
  run: (args: string[], env: TermEnv, fs: Record<string, FsDir>) => CommandResult;
  complete?: (partial: string, env: TermEnv, fs: Record<string, FsDir>) => string[];
};

let seq = 0;
const id = (p: string) => `${p}-${Date.now().toString(36)}-${(seq++).toString(36)}`;

const out = (lines: TermLine[]): CommandResult => ({
  blocks: [{ id: id("out"), kind: "out", lines }],
});
const err = (text: string): CommandResult => ({
  blocks: [{ id: id("err"), kind: "err", text }],
});
const nothing = (): CommandResult => ({ blocks: [] });
/** A page-style result: block-letter heading, then the body lines. */
const page = (heading: string, lines: TermLine[], extra: Partial<CommandResult> = {}): CommandResult => ({
  blocks: [
    { id: id("fig"), kind: "figlet", text: heading },
    { id: id("out"), kind: "out", lines },
    ...(extra.blocks ?? []),
  ],
  ...(extra.effects ? { effects: extra.effects } : {}),
});
/** Directories that have a page twin; `cd` into one prints it. */
const DIR_COMMANDS: Record<string, string> = {
  [`${HOME}/projects`]: "projects",
  [`${HOME}/blogs`]: "blogs",
  [HOME]: "home",
};

/**
 * `cd`: forgiving resolution (cwd, then ~), `-` for the previous directory, and
 * entering a directory prints its page the way the web route would.
 */
function enterDir(input: string | undefined, env: TermEnv, fs: Record<string, FsDir>): CommandResult {
  const raw = input === "-" ? (env.prevCwd ?? HOME) : (input ?? HOME);
  const target = findDir(fs, env.cwd, raw);
  if (!target) {
    // `cd projects/edgaze`: a project or post is a file, but the visitor means "go there". Go there.
    const file = findFile(fs, env.cwd, raw);
    if (file) return openFile(file, env, fs);
    return withSuggestions(`cd: no such file or directory: ${raw}`, raw, env, fs, { dirs: true, files: true });
  }
  const effects: CommandResult["effects"] = [{ type: "cwd", cwd: target }];
  const twin = DIR_COMMANDS[target];
  if (!twin) return { blocks: [], effects };
  const res = find(twin)!.run([], { ...env, cwd: target }, fs);
  return { blocks: res.blocks, effects: [...effects, ...(res.effects ?? [])] };
}

/** Open a file the way its page would: project record, full post, or plain contents. Also moves into its directory. */
function openFile(file: FsFile, env: TermEnv, fs: Record<string, FsDir>): CommandResult {
  const project = file.href?.match(/^\/projects\/([^/]+)$/)?.[1];
  const post = file.href?.match(/^\/blogs\/([^/]+)$/)?.[1];
  const dir = project ? `${HOME}/projects` : post ? `${HOME}/blogs` : env.cwd;
  const res = project
    ? find("project")!.run([project], env, fs)
    : post
      ? find("read")!.run([post], env, fs)
      : out(file.lines());
  const effects = dir !== env.cwd ? [{ type: "cwd" as const, cwd: dir }, ...(res.effects ?? [])] : res.effects;
  return { blocks: res.blocks, ...(effects?.length ? { effects } : {}) };
}

type SuggestScope = { commands?: boolean; dirs?: boolean; files?: boolean; projects?: boolean; posts?: boolean };

/** Damerau–Levenshtein distance (swapped letters count once), for "did you mean". */
function distance(a: string, b: string): number {
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
        m[i][j] = Math.min(m[i][j], m[i - 2][j - 2] + 1);
    }
  return m[a.length][b.length];
}

/**
 * An error, followed by a picker of the closest things the visitor might have
 * meant. Nothing typed into this terminal should end in a red line and silence.
 */
function withSuggestions(
  message: string,
  typed: string,
  env: TermEnv,
  fs: Record<string, FsDir>,
  scope: SuggestScope,
  rest = ""
): CommandResult {
  const q = typed.toLowerCase().replace(/^~\//, "").replace(/\/$/, "");
  const last = (q.split("/").pop() ?? q).replace(/\.(md|txt)$/, "");
  const tolerance = Math.max(1, Math.floor(last.length / 3));
  const near = (s: string) => {
    const t = s.toLowerCase().replace(/\.(md|txt)$/, "");
    if (!last) return undefined;
    if (t.includes(last) || last.includes(t)) return 0;
    const d = distance(last, t);
    return d <= tolerance ? d : undefined;
  };
  const found: Array<{ score: number; item: MenuItem }> = [];
  const add = (score: number | undefined, item: MenuItem) => {
    if (score !== undefined && !found.some((f) => f.item.command === item.command)) found.push({ score, item });
  };
  if (scope.commands)
    for (const c of commands.filter((c) => !c.hidden))
      add(near(c.name), { label: `${c.name}${rest ? ` ${rest}` : ""}`, hint: c.description, command: `${c.name}${rest ? ` ${rest}` : ""}` });
  if (scope.dirs) for (const d of fs[HOME].dirs) add(near(d), { label: `${d}/`, hint: "directory", command: `cd ${d}` });
  if (scope.files || scope.projects)
    for (const p of projects)
      add(Math.min(near(p.slug) ?? 99, near(p.name) ?? 99) < 99 ? Math.min(near(p.slug) ?? 99, near(p.name) ?? 99) : undefined, {
        label: p.name,
        hint: "project",
        command: `project ${p.slug}`,
      });
  if (scope.files || scope.posts)
    for (const p of env.posts)
      add(Math.min(near(p.slug) ?? 99, near(p.title) ?? 99) < 99 ? Math.min(near(p.slug) ?? 99, near(p.title) ?? 99) : undefined, {
        label: p.title,
        hint: "post",
        command: `read ${p.slug}`,
      });
  if (scope.files)
    for (const f of fs[HOME].files.filter((f) => !f.hidden)) add(near(f.name), { label: f.name, hint: "file", command: `cat ${f.name}` });

  const items = found.sort((a, b) => a.score - b.score).slice(0, 6).map((f) => f.item);
  const blocks: TermBlock[] = [{ id: id("err"), kind: "err", text: message }];
  if (items.length) {
    blocks.push(
      { id: id("out"), kind: "out", lines: [{ text: "did you mean:", tone: "dim" }] },
      { id: id("menu"), kind: "menu", items, selected: 0, filter: "" }
    );
  } else {
    blocks.push({ id: id("out"), kind: "out", lines: [{ text: "try: cd projects · cd blogs · about · help", tone: "dim" }] });
  }
  return { blocks };
}

/**
 * zsh AUTO_CD and then some: a bare directory name changes into it, a project
 * or post slug opens it, a file name prints it. Used when no command matches.
 */
function autoJump(name: string, env: TermEnv, fs: Record<string, FsDir>): CommandResult | undefined {
  const key = name.toLowerCase().replace(/\/$/, "");
  if (findDir(fs, env.cwd, key)) return enterDir(key, env, fs);
  if (projects.some((p) => p.slug === key)) return find("project")!.run([key], env, fs);
  if (env.posts.some((p) => p.slug === key)) return find("read")!.run([key], env, fs);
  const file = findFile(fs, env.cwd, name);
  if (file) return out(file.lines());
  return undefined;
}

/** The same short pointers everywhere a visitor might wonder what to do next. */
const NUDGES: TermLine[] = [
  { label: "  cd projects   ", text: "browse the projects", tone: "default" },
  { label: "  cd blogs      ", text: "read a post here", tone: "default" },
  { label: "  about         ", text: "who is behind this", tone: "default" },
  { label: "  newsletter    ", text: "subscribe from the terminal", tone: "default" },
  { text: "  help for everything else · exit to go back", tone: "dim" },
];

const rule = (label?: string): TermLine => ({
  text: label ? `── ${label} ${"─".repeat(Math.max(4, 36 - label.length))}` : "─".repeat(40),
  tone: "dim",
});

export function promptFor(cwd: string): string {
  return `${TERMINAL_USER}@${TERMINAL_HOST} ${cwd} %`;
}

/** Short paths a visitor can `open` by name. */
const OPEN_TARGETS: Record<string, { href: string; label: string }> = {
  home: { href: "/", label: "arjunkuttikkat.com" },
  projects: { href: "/projects", label: "Projects" },
  blogs: { href: "/blogs", label: "Blogs" },
  blog: { href: "/blogs", label: "Blogs" },
  about: { href: "/about", label: "About" },
  newsletter: { href: "/newsletter", label: "Newsletter" },
  terminal: { href: "/terminal", label: "Full screen terminal" },
  rss: { href: "/feed.xml", label: "RSS feed" },
  edgaze: { href: EDGAZE_URL, label: "Edgaze" },
  marketplace: { href: edgazeLinks.marketplace, label: "Edgaze marketplace" },
  studio: { href: edgazeLinks.builder, label: "Edgaze Workflow Studio" },
  docs: { href: edgazeLinks.docs, label: "Edgaze documentation" },
  api: { href: edgazeLinks.api, label: "Edgaze API docs" },
  mcp: { href: edgazeLinks.mcp, label: "Edgaze MCP docs" },
  status: { href: edgazeLinks.status, label: "status.edgaze.ai" },
  github: { href: socialLinks.find((s) => s.label === "GitHub")!.href, label: "GitHub" },
  linkedin: {
    href: socialLinks.find((s) => s.label === "LinkedIn")!.href,
    label: "LinkedIn",
  },
  x: { href: socialLinks.find((s) => s.label === "X")!.href, label: "X" },
  twitter: { href: socialLinks.find((s) => s.label === "X")!.href, label: "X" },
  youtube: {
    href: socialLinks.find((s) => s.label === "YouTube")!.href,
    label: "YouTube",
  },
  email: { href: `mailto:${contactEmail}`, label: contactEmail },
};

const isExternal = (href: string) => /^(https?:|mailto:)/.test(href);

function openResult(href: string, label: string): CommandResult {
  const external = isExternal(href);
  return {
    blocks: [
      {
        id: id("out"),
        kind: "out",
        lines: [
          {
            text: `${external ? "Opening" : "Navigating to"} ${label} → ${href}`,
            href,
            tone: "accent",
          },
        ],
      },
    ],
    effects: [external ? { type: "open", href } : { type: "navigate", href }],
  };
}

function formatMacDate(d: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const pad = (n: number) => String(n).padStart(2, "0");
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";
  return `${days[d.getDay()]} ${months[d.getMonth()]} ${String(d.getDate()).padStart(2, " ")} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${tz} ${d.getFullYear()}`;
}

/** `Last login: Wed Sep  2 11:01:19 on ttys006` */
export function lastLoginLine(d = new Date()): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const pad = (n: number) => String(n).padStart(2, "0");
  const tty = `ttys${String(d.getSeconds() % 10).padStart(3, "0")}`;
  return `Last login: ${days[d.getDay()]} ${months[d.getMonth()]} ${String(d.getDate()).padStart(2, " ")} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} on ${tty}`;
}

function formatUptime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  if (m > 0) return `${m} min${m === 1 ? "" : "s"} ${sec}s`;
  return `${sec} secs`;
}

function listDir(dir: FsDir, long: boolean, all = false): TermLine[] {
  const entries = [
    ...dir.dirs.map((d) => ({ name: `${d}/`, dir: true })),
    ...dir.files.filter((f) => all || !f.hidden).map((f) => ({ name: f.name, dir: false })),
  ];
  if (!long)
    return columns(
      entries.map((e) => e.name),
      3
    ).map((l) => ({ text: l }));
  const date = "Sep  2 2026";
  return [
    `total ${entries.length}`,
    ...entries.map(
      (e): TermLine => ({
        label: `${e.dir ? "drwxr-xr-x" : "-rw-r--r--"}  1 ${TERMINAL_USER}  staff   ${date}  `,
        text: e.name,
        tone: e.dir ? "accent" : "default",
      })
    ),
  ];
}

const commands: Command[] = [
  {
    name: "help",
    aliases: ["?", "commands"],
    usage: "help [command]",
    description: "List commands, or show usage for one",
    run: (args) => {
      if (args[0]) {
        const c = find(args[0]);
        if (!c) return err(`help: no help topics match '${args[0]}'`);
        return out([
          { text: c.usage, tone: "bold" },
          `    ${c.description}`,
          ...(c.aliases?.length
            ? [{ text: `    aliases: ${c.aliases.join(", ")}`, tone: "dim" as const }]
            : []),
        ]);
      }
      const visible = commands.filter((c) => !c.hidden);
      const width = Math.max(...visible.map((c) => c.usage.length)) + 3;
      const group = (title: string, names: string[]): TermLine[] => [
        { text: title, tone: "bold" },
        ...names.map((n) => {
          const c = find(n)!;
          return `  ${c.usage.padEnd(width)}${c.description}`;
        }),
        "",
      ];
      return out([
        ...group("Pages", ["home", "about", "projects", "project", "blogs", "read", "newsletter"]),
        ...group("About", ["whois", "current", "blog", "stack", "edgaze"]),
        ...group("Reach", ["socials", "email", "open"]),
        ...group("Files", ["ls", "cd", "pwd", "cat", "tree"]),
        ...group("Shell", [
          "clear",
          "history",
          "echo",
          "date",
          "uptime",
          "whoami",
          "hostname",
          "uname",
          "neofetch",
          "figlet",
          "version",
          "banner",
          "exit",
        ]),
        {
          text: "Tab completes commands and paths. ↑ ↓ walk history. Ctrl+L clears, Ctrl+C cancels.",
          tone: "dim",
        },
        {
          text: "Shortcuts: a directory or slug on its own jumps to it (edgaze, blogs, compass). cd works from anywhere.",
          tone: "dim",
        },
      ]);
    },
    complete: (p) =>
      commands.filter((c) => !c.hidden && c.name.startsWith(p)).map((c) => c.name),
  },
  {
    name: "man",
    hidden: true,
    usage: "man <command>",
    description: "Alias of help",
    run: (args) =>
      args[0]
        ? find("help")!.run(args, dummyEnv, {})
        : err("What manual page do you want?\nFor example, try 'man ls'."),
    complete: (p) => commands.filter((c) => c.name.startsWith(p)).map((c) => c.name),
  },
  {
    name: "home",
    aliases: ["index", "start"],
    usage: "home",
    description: "Where to go from here",
    run: (_a, env) =>
      out([
        { text: "Arjun Kuttikkat", tone: "bold" },
        { text: `Founder of Edgaze · ${projects.length} projects · ${env.posts.length} posts`, tone: "dim" },
        "",
        ...NUDGES,
      ]),
  },
  {
    name: "about",
    aliases: ["bio", "story"],
    usage: "about",
    description: "The about page, in full",
    run: () =>
      page("About", [
        { text: "Arjun Kuttikkat", tone: "bold" },
        { text: "Founder, Edgaze (Edge Platforms, Inc.) · Robotics and AI, University of Birmingham Dubai", tone: "dim" },
        "",
        ...aboutParagraphs.flatMap((p) => [p, ""]),
        { text: aboutClosingLine, tone: "dim" },
        "",
        rule(),
        { text: "Full page → /about", href: "/about" },
        { text: "projects · blogs · socials · newsletter", tone: "dim" },
      ]),
  },
  {
    name: "whois",
    aliases: ["who"],
    usage: "whois [arjun]",
    description: "Who Arjun is, in four lines",
    run: (args) => {
      if (args[0] && args[0] !== "arjun")
        return err(`whois: no match for "${args.join(" ")}"`);
      return out([
        { text: "Arjun Kuttikkat", tone: "bold" },
        "Founder, Edgaze (Edge Platforms, Inc.)",
        "Building a marketplace and hosted runtime where AI workflows are built, published, and run per use.",
        "Robotics and AI student at University of Birmingham Dubai.",
        "",
        { text: "More: about · cat about.txt · open about", tone: "dim" },
      ]);
    },
  },
  {
    name: "current",
    aliases: ["now", "focus"],
    usage: "current",
    description: "What is being worked on right now",
    run: (_a, env, fs) => out(findFile(fs, HOME, "current.txt")!.lines()),
  },
  {
    name: "projects",
    aliases: ["pj", "work"],
    usage: "projects",
    description: "Every project record",
    run: () => {
      const sorted = [...projects].sort((a, b) => a.order - b.order);
      return page("Projects", [{ text: `${sorted.length} projects · pick one`, tone: "dim" }], {
        blocks: [
          {
            id: id("menu"),
            kind: "menu",
            selected: 0,
            filter: "",
            items: sorted.map((p) => ({
              label: p.name,
              hint: projectStateLabel[p.state].toLowerCase(),
              command: `project ${p.slug}`,
            })),
          },
        ],
      });
    },
  },
  {
    name: "project",
    usage: "project <slug>",
    description: "One project, as a page",
    run: (args, env, fs) => {
      if (!args[0]) return err("usage: project <slug>   (try: projects)");
      const slug = args[0].replace(/\.md$/, "").toLowerCase();
      const p = projects.find((x) => x.slug === slug);
      if (!p) return withSuggestions(`project: '${args[0]}' not found`, slug, env, fs, { projects: true });
      const fact = (k: string, v: string): TermLine => ({ label: `  ${k.padEnd(10)}`, text: v });
      const primary = p.links.find((l) => l.kind === "primary");
      const linkWidth = Math.max(12, ...p.links.map((l) => l.label.length)) + 2;
      return page(p.name, [
        { text: p.tagline, tone: "dim" },
        "",
        p.summary,
        "",
        rule("Facts"),
        fact("state", `${projectStateLabel[p.state]} · ${p.stateNote}`),
        fact("year", p.year),
        fact("role", p.role),
        ...(p.team ? [fact("team", p.team)] : []),
        ...(p.context ? [fact("context", p.context)] : []),
        fact("category", p.category),
        "",
        rule("Snapshot"),
        ...p.snapshot.flatMap((s) => [{ text: `  ${s.label}`, tone: "bold" as const }, `  ${s.value}`, ""]),
        rule("TL;DR"),
        ...p.tldr.map((t, i) => `  ${String(i + 1).padStart(2)}. ${t}`),
        "",
        rule("Stack"),
        ...p.stack.flatMap((g) => [
          { text: `  ${g.title}`, tone: "bold" as const },
          ...(g.note ? [{ text: `  ${g.note}`, tone: "dim" as const }] : []),
          `  ${stackTechnologyNames([g]).join(" · ")}`,
          "",
        ]),
        rule("Links"),
        ...p.links.map((l) => ({ label: `  ${l.label.padEnd(linkWidth)}`, text: l.href, href: l.href })),
        { label: `  ${"Project page".padEnd(linkWidth)}`, text: `/projects/${p.slug}`, href: `/projects/${p.slug}` },
        "",
        {
          text: `open ${p.slug} for the web page${primary ? ` · open ${primary.href} for the product` : ""} · projects for the rest`,
          tone: "dim",
        },
      ]);
    },
    complete: (p) => projects.map((x) => x.slug).filter((s) => s.startsWith(p)),
  },
  {
    name: "blogs",
    aliases: ["posts", "writing"],
    usage: "blogs",
    description: "Published posts, newest first",
    run: (_a, env) => {
      if (env.posts.length === 0)
        return page("Blogs", [{ text: "No published posts yet.", tone: "dim" }]);
      return page("Blogs", [{ text: `${env.posts.length} posts · newest first · pick one to read it here`, tone: "dim" }], {
        blocks: [
          {
            id: id("menu"),
            kind: "menu",
            selected: 0,
            filter: "",
            items: env.posts.map((p) => ({
              label: p.title,
              hint: `${p.date} · ${p.readTimeMinutes} min`,
              command: `read ${p.slug}`,
            })),
          },
        ],
      });
    },
  },
  {
    name: "blog",
    aliases: ["post"],
    usage: "blog <slug>",
    description: "Summary of one post",
    run: (args, env, fs) => {
      if (!args[0]) return err("usage: blog <slug>   (try: blogs)");
      const f = findFile(fs, `${HOME}/blogs`, args[0]);
      if (!f) return withSuggestions(`blog: '${args[0]}' not found`, args[0], env, fs, { posts: true });
      return out(f.lines());
    },
    complete: (p, env) => env.posts.map((x) => x.slug).filter((s) => s.startsWith(p)),
  },
  {
    name: "read",
    aliases: ["view", "show"],
    usage: "read <slug>",
    description: "Read a whole post in the terminal",
    run: (args, env, fs) => {
      if (!args[0]) return err("usage: read <slug>   (try: blogs)");
      const slug = args[0].replace(/^(~\/)?blogs\//, "").replace(/\.md$/, "").toLowerCase();
      const post = env.posts.find((p) => p.slug === slug);
      if (!post) return withSuggestions(`read: '${args[0]}' not found`, slug, env, fs, { posts: true });
      return { blocks: [], effects: [{ type: "read_post", slug: post.slug }] };
    },
    complete: (p, env) => env.posts.map((x) => x.slug).filter((s) => s.startsWith(p)),
  },
  {
    name: "stack",
    aliases: ["tech", "skills"],
    usage: "stack",
    description: "Technologies used across projects",
    run: (_a, _e, fs) => out(findFile(fs, HOME, "stack.txt")!.lines()),
  },
  {
    name: "edgaze",
    usage: "edgaze [topic]",
    description: "Edgaze facts: timeline, billing, services, api, mcp",
    run: (args) => {
      const sub = args[0];
      if (!sub) {
        return page("Edgaze", [
          "A marketplace and hosted runtime where AI workflows are built, published with a price per run,",
          "and executed by people, backends, and agents.",
          "",
          `state      ${edgazeState.label} since ${edgazeState.since}`,
          `company    ${edgazeState.company}`,
          `services   ${edgazeMonitoredServices.length} monitored on ${edgazeLinks.status.replace("https://", "")}`,
          `api        ${edgazeApi.baseUrl}`,
          `mcp        ${edgazeMcp.server}`,
          "",
          {
            text: "edgaze timeline · edgaze billing · edgaze services · edgaze api · edgaze mcp",
            tone: "dim",
          },
          { text: "open edgaze · open docs · open status · project edgaze", tone: "dim" },
        ]);
      }
      if (sub === "timeline") {
        return out([
          { text: "Timeline", tone: "bold" },
          ...edgazeTimeline.flatMap((t) => [
            `  ${t.date.padEnd(14)}${t.title}`,
            { text: `  ${"".padEnd(14)}${t.note}`, tone: "dim" as const },
          ]),
        ]);
      }
      if (sub === "billing") {
        return out([
          { text: "Billing (from public docs)", tone: "bold" },
          ...edgazeBilling.map((b) => `  ${b.label.padEnd(22)}${b.value}`),
        ]);
      }
      if (sub === "services" || sub === "status") {
        return out([
          {
            text: `Monitored services (${edgazeMonitoredServices.length})`,
            tone: "bold",
          },
          ...edgazeMonitoredServices.map((s) => `  ● ${s}`),
          "",
          { text: `Live status → ${edgazeLinks.status}`, href: edgazeLinks.status },
        ]);
      }
      if (sub === "api") {
        return out([
          { text: "Public API", tone: "bold" },
          `  base   ${edgazeApi.baseUrl}`,
          `  auth   ${edgazeApi.auth}`,
          `  scopes ${edgazeApi.scopes.join(", ")}`,
          "",
          ...edgazeApi.endpoints.map(
            (e) => `  ${e.method.padEnd(5)} ${e.path.padEnd(34)}${e.note}`
          ),
          "",
          { text: `OpenAPI → ${edgazeApi.openapi}`, href: edgazeApi.openapi },
          { text: `Docs    → ${edgazeLinks.api}`, href: edgazeLinks.api },
        ]);
      }
      if (sub === "mcp") {
        return out([
          { text: "MCP server", tone: "bold" },
          `  ${edgazeMcp.server}`,
          "",
          ...edgazeMcp.tools.map((t) => `  ${t.name.padEnd(16)}${t.note}`),
          "",
          `  clients: ${edgazeMcp.clients.join(", ")}`,
          { text: `Docs → ${edgazeLinks.mcp}`, href: edgazeLinks.mcp },
        ]);
      }
      return err(
        `edgaze: unknown topic '${sub}'. Try timeline, billing, services, api, mcp.`
      );
    },
    complete: (p) =>
      ["timeline", "billing", "services", "api", "mcp"].filter((s) => s.startsWith(p)),
  },
  {
    name: "status",
    hidden: true,
    usage: "status",
    description: "Alias of edgaze services",
    run: () => find("edgaze")!.run(["services"], dummyEnv, {}),
  },
  {
    name: "socials",
    aliases: ["links", "contact", "social"],
    usage: "socials",
    description: "Where to find Arjun",
    run: (_a, _e, fs) => out(findFile(fs, HOME, "links.txt")!.lines()),
  },
  {
    name: "email",
    aliases: ["mail"],
    usage: "email",
    description: "Contact address",
    run: () =>
      out([{ text: contactEmail, href: `mailto:${contactEmail}`, tone: "accent" }]),
  },
  {
    name: "newsletter",
    aliases: ["subscribe"],
    usage: "newsletter",
    description: "Subscribe from the terminal",
    run: () =>
      page(
        "Newsletter",
        [
          "Occasional notes from building Edgaze: what shipped, what broke, what changed. No schedule.",
          { text: "One email address, nothing else. Unsubscribe from any issue.", tone: "dim" },
          "",
          "Email address (Ctrl+C to cancel):",
        ],
        { effects: [{ type: "prompt_email" }] }
      ),
  },
  {
    name: "open",
    aliases: ["go", "visit"],
    usage: "open <target>",
    description: "Open a page, project, post, file, or link",
    run: (args, env, fs) => {
      const target = args[0];
      if (!target)
        return err(
          `usage: open <target>\ntargets: ${Object.keys(OPEN_TARGETS).join(", ")}, any project or post slug, any file`
        );
      const key = target.toLowerCase();
      if (OPEN_TARGETS[key])
        return openResult(OPEN_TARGETS[key].href, OPEN_TARGETS[key].label);
      const project = projects.find((p) => p.slug === key);
      if (project) return openResult(`/projects/${project.slug}`, project.name);
      const post = env.posts.find((p) => p.slug === key);
      if (post) return openResult(`/blogs/${post.slug}`, post.title);
      const file = findFile(fs, env.cwd, target);
      if (file?.href) return openResult(file.href, file.name);
      if (file) return err(`open: ${file.name} has no page. Try 'cat ${file.name}'.`);
      if (/^https?:\/\//.test(target)) return openResult(target, target);
      const pages = Object.entries(OPEN_TARGETS)
        .filter(([k]) => k.includes(key) || key.includes(k) || distance(k, key) <= Math.max(1, Math.floor(key.length / 3)))
        .map(([k, v]) => ({ label: v.label, hint: v.href, command: `open ${k}` }));
      const res = withSuggestions(`open: nothing matches '${target}'`, target, env, fs, { files: true });
      const menu = res.blocks.find((b): b is Extract<TermBlock, { kind: "menu" }> => b.kind === "menu");
      if (menu) menu.items = [...pages, ...menu.items].slice(0, 6);
      else if (pages.length)
        res.blocks.splice(1, 1, { id: id("out"), kind: "out", lines: [{ text: "did you mean:", tone: "dim" }] }, { id: id("menu"), kind: "menu", items: pages.slice(0, 6), selected: 0, filter: "" });
      return res;
    },
    complete: (p, env, fs) => {
      const keys = [
        ...Object.keys(OPEN_TARGETS),
        ...projects.map((x) => x.slug),
        ...env.posts.map((x) => x.slug),
      ];
      return [
        ...new Set([...keys.filter((k) => k.startsWith(p)), ...completePath(p, env, fs)]),
      ];
    },
  },
  {
    name: "ls",
    aliases: ["dir", "ll"],
    usage: "ls [-l] [path]",
    description: "List directory contents",
    run: (args, env, fs) => {
      const flags = args.filter((a) => a.startsWith("-")).join("");
      const long = flags.includes("l");
      const all = flags.includes("a");
      const paths = args.filter((a) => !a.startsWith("-"));
      const target = findDir(fs, env.cwd, paths[0]);
      const dir = target ? fs[target] : undefined;
      if (dir && target)
        return out([
          ...listDir(dir, long, all),
          "",
          target === HOME
            ? { text: "cd projects · cd blogs · cat about.txt", tone: "dim" as const }
            : { text: `${DIR_COMMANDS[target]} to pick one · cat <file> to read it`, tone: "dim" as const },
        ]);
      const file = findFile(fs, env.cwd, paths[0] ?? "");
      if (file) return out([file.name]);
      return withSuggestions(`ls: ${paths[0]}: No such file or directory`, paths[0] ?? "", env, fs, { dirs: true, files: true });
    },
    complete: completePath,
  },
  {
    name: "cd",
    usage: "cd [dir]",
    description: "Change directory and open it (projects, blogs, ~, -)",
    run: (args, env, fs) => enterDir(args[0], env, fs),
    complete: (p, env, fs) => {
      const here = completePath(p, env, fs).filter((s) => s.endsWith("/"));
      // From inside a directory, sibling directories still complete (`cd pro<Tab>` in ~/blogs).
      const top = fs[HOME].dirs.filter((d) => d.startsWith(p) && !p.includes("/")).map((d) => `${d}/`);
      return [...new Set([...here, ...top])];
    },
  },
  {
    name: "pwd",
    usage: "pwd",
    description: "Print working directory",
    run: (_a, env) => out([env.cwd.replace(HOME, `/Users/${TERMINAL_USER}`)]),
  },
  {
    name: "cat",
    aliases: ["less", "more", "head", "tail", "bat"],
    usage: "cat <file>",
    description: "Print a file",
    run: (args, env, fs) => {
      if (!args[0]) return err("usage: cat <file>");
      const results: TermLine[] = [];
      for (const a of args) {
        if (fs[resolvePath(env.cwd, a)]) return err(`cat: ${a}: Is a directory`);
        const f = findFile(fs, env.cwd, a);
        if (!f) return withSuggestions(`cat: ${a}: No such file or directory`, a, env, fs, { files: true });
        results.push(...f.lines());
      }
      return out(results);
    },
    complete: completePath,
  },
  {
    name: "tree",
    usage: "tree",
    description: "Show the whole filesystem",
    run: (_a, _e, fs) => {
      const root = fs[HOME];
      const lines: TermLine[] = ["~"];
      const dirs = root.dirs;
      dirs.forEach((d, i) => {
        const last = i === dirs.length - 1 && root.files.length === 0;
        lines.push(`${last ? "└── " : "├── "}${d}/`);
        const sub = fs[`${HOME}/${d}`];
        sub.files.forEach((f, j) => {
          const fl = j === sub.files.length - 1;
          lines.push({
            text: `${last ? "    " : "│   "}${fl ? "└── " : "├── "}${f.name}`,
            href: f.href,
          });
        });
      });
      root.files.forEach((f, i) => {
        const last = i === root.files.length - 1;
        lines.push(`${last ? "└── " : "├── "}${f.name}`);
      });
      const count = dirs.length;
      const files =
        root.files.length + dirs.reduce((n, d) => n + fs[`${HOME}/${d}`].files.length, 0);
      lines.push("", { text: `${count} directories, ${files} files`, tone: "dim" });
      return out(lines);
    },
  },
  {
    name: "clear",
    aliases: ["cls"],
    usage: "clear",
    description: "Clear the screen",
    run: () => ({ blocks: [], effects: [{ type: "clear" }] }),
  },
  {
    name: "history",
    usage: "history",
    description: "Commands typed this session",
    run: (_a, env) =>
      env.history.length
        ? out(env.history.map((h, i) => `  ${String(i + 1).padStart(3)}  ${h}`))
        : out([{ text: "No history yet.", tone: "dim" }]),
  },
  {
    name: "echo",
    usage: "echo <text>",
    description: "Print text",
    run: (args, env) =>
      out([
        args
          .join(" ")
          .replace(/^(["'])(.*)\1$/, "$2")
          .replace(/\$USER/g, TERMINAL_USER)
          .replace(/\$HOME/g, `/Users/${TERMINAL_USER}`)
          .replace(/\$PWD/g, env.cwd.replace(HOME, `/Users/${TERMINAL_USER}`))
          .replace(/\$SHELL/g, "/bin/zsh"),
      ]),
  },
  {
    name: "date",
    usage: "date",
    description: "Current date and time",
    run: () => out([formatMacDate(new Date())]),
  },
  {
    name: "uptime",
    usage: "uptime",
    description: "How long this session has been open",
    run: (_a, env) => {
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      return out([
        `${pad(d.getHours())}:${pad(d.getMinutes())}  up ${formatUptime(Date.now() - env.startedAt)}, 1 user, load averages: 0.42 0.38 0.35`,
      ]);
    },
  },
  {
    name: "whoami",
    usage: "whoami",
    description: "Print the current user",
    run: () => out([TERMINAL_USER]),
  },
  {
    name: "hostname",
    usage: "hostname",
    description: "Print the host name",
    run: () => out([`${TERMINAL_HOST}.com`]),
  },
  {
    name: "uname",
    usage: "uname [-a]",
    description: "System information",
    run: (args) =>
      out([
        args.includes("-a")
          ? `Darwin ${TERMINAL_HOST}.com 25.5.0 Darwin Kernel Version 25.5.0: Next.js 16 · React 19 · Tailwind 4 arm64`
          : "Darwin",
      ]),
  },
  {
    name: "neofetch",
    aliases: ["fetch", "sysinfo"],
    usage: "neofetch",
    description: "Site summary next to the banner",
    run: (_a, env) => ({
      blocks: [
        {
          id: id("nf"),
          kind: "neofetch",
          rows: [
            ["OS", "arjunkuttikkat.com 2026"],
            ["Host", siteUrl.replace("https://", "")],
            ["Kernel", `terminal ${TERMINAL_VERSION}`],
            ["Uptime", formatUptime(Date.now() - env.startedAt)],
            ["Shell", "zsh 5.9"],
            ["Owner", "Arjun Kuttikkat"],
            ["Company", edgazeState.company],
            [
              "Product",
              `Edgaze · ${edgazeState.label.toLowerCase()} since ${edgazeState.since}`,
            ],
            ["Projects", String(projects.length)],
            ["Posts", String(env.posts.length)],
            ["Stack", "Next.js, React, TypeScript, Tailwind"],
            ["Font", "Inter, SF Mono"],
          ],
        },
      ],
    }),
  },
  {
    name: "version",
    aliases: ["--version", "-v"],
    usage: "version",
    description: "Terminal version",
    run: () =>
      out([
        `arjunkuttikkat terminal ${TERMINAL_VERSION}`,
        {
          text: "zsh-compatible surface · commands are local, nothing is executed on a server",
          tone: "dim",
        },
      ]),
  },
  {
    name: "banner",
    usage: "banner",
    description: "Print the AK banner again",
    run: () => ({ blocks: [{ id: id("banner"), kind: "banner" }] }),
  },
  {
    name: "figlet",
    aliases: ["big"],
    usage: "figlet <text>",
    description: "Print text in the banner's block font",
    run: (args) => {
      const text = args.join(" ").replace(/^(["'])(.*)\1$/, "$2").trim();
      if (!text) return err("usage: figlet <text>");
      if (!figlet(text).some((r) => r.trim()))
        return err("figlet: nothing printable (letters, digits, - and . only)");
      return { blocks: [{ id: id("fig"), kind: "figlet", text: text.slice(0, 24) }] };
    },
  },
  {
    name: "exit",
    aliases: ["quit", "logout", ":q"],
    usage: "exit",
    description: "Leave the terminal",
    run: () => ({
      blocks: [{ id: id("sys"), kind: "system", text: "[Process completed]" }],
      effects: [{ type: "exit" }],
    }),
  },
  // Easter eggs. Hidden from help, but they answer like a real shell would.
  {
    name: "sudo",
    hidden: true,
    usage: "sudo",
    description: "",
    run: (args) =>
      err(
        args.length
          ? `${TERMINAL_USER} is not in the sudoers file. This incident will be reported.`
          : "usage: sudo command"
      ),
  },
  {
    name: "rm",
    hidden: true,
    usage: "rm",
    description: "",
    run: (args) =>
      args.join(" ").includes("-rf")
        ? err("rm: read-only file system. Nice try.")
        : err("rm: read-only file system"),
  },
  {
    name: "touch",
    hidden: true,
    usage: "touch",
    description: "",
    run: () => err("touch: read-only file system"),
  },
  {
    name: "mkdir",
    hidden: true,
    usage: "mkdir",
    description: "",
    run: () => err("mkdir: read-only file system"),
  },
  {
    name: "vim",
    aliases: ["vi", "nvim", "nano", "emacs"],
    hidden: true,
    usage: "vim",
    description: "",
    run: () =>
      out([
        {
          text: "No editor here. Everything is read-only; try 'cat <file>'.",
          tone: "dim",
        },
      ]),
  },
  {
    name: "ping",
    hidden: true,
    usage: "ping",
    description: "",
    run: (args) =>
      out([
        `PING ${args[0] ?? "arjunkuttikkat.com"}: 56 data bytes`,
        "64 bytes: icmp_seq=0 ttl=57 time=12.4 ms",
        "64 bytes: icmp_seq=1 ttl=57 time=11.9 ms",
        "--- ping statistics ---",
        "2 packets transmitted, 2 packets received, 0.0% packet loss",
      ]),
  },
  {
    name: "git",
    hidden: true,
    usage: "git",
    description: "",
    run: (args) => {
      const gh = socialLinks.find((s) => s.label === "GitHub")!.href;
      if (args[0] === "status")
        return out(["On branch main", "nothing to commit, working tree clean"]);
      return out([{ text: `Source lives on GitHub: ${gh}`, href: gh }]);
    },
  },
  {
    name: "npm",
    aliases: ["pnpm", "yarn", "bun", "node"],
    hidden: true,
    usage: "npm",
    description: "",
    run: () =>
      out([
        "> next build",
        "",
        {
          text: "✓ Compiled successfully. This site is prerendered at build time.",
          tone: "ok",
        },
      ]),
  },
  {
    name: "hello",
    aliases: ["hi", "hey"],
    hidden: true,
    usage: "hello",
    description: "",
    run: () => out(["Hello. Type 'help' to see what this terminal can do."]),
  },
  {
    name: "fortune",
    hidden: true,
    usage: "fortune",
    description: "",
    run: (_a, env) => {
      const pick = FORTUNES[Math.floor((Date.now() / 1000 + env.history.length) % FORTUNES.length)];
      return out([pick, { text: "— from the posts and the .plan. Run it again.", tone: "dim" }]);
    },
  },
  {
    name: "cowsay",
    aliases: ["moo"],
    hidden: true,
    usage: "cowsay <text>",
    description: "",
    run: (args) => {
      const text = (args.join(" ").replace(/^(["'])(.*)\1$/, "$2") || "Ship the thing.").slice(0, 60);
      const bar = "-".repeat(text.length + 2);
      return out([
        ` ${bar}`,
        `< ${text} >`,
        ` ${bar}`,
        "        \\   ^__^",
        "         \\  (oo)\\_______",
        "            (__)\\       )\\/\\",
        "                ||----w |",
        "                ||     ||",
      ]);
    },
  },
  {
    name: "sl",
    hidden: true,
    usage: "sl",
    description: "",
    run: () =>
      out([
        { text: "You typed sl. That is ls backwards. Here is your train.", tone: "dim" },
        "      ====        ________                ___________",
        "  _D _|  |_______/        \\__I_I_____===__|_________|",
        "   |(_)---  |   H\\________/ |   |        =|___ ___|",
        "   /     |  |   H  |  |     |   |         ||_| |_||",
        "  |      |  |   H  |__--------------------| [___] |",
        "  | ________|___H__/__|_____/[][]~\\_______|       |",
        "  |/ |   |-----------I_____I [][] []  D   |=======|__",
        "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__",
        " |/-=|___|=    ||    ||    ||    |_____/~\\___/",
        "  \\_/      \\O=====O=====O=====O_/      \\_/",
      ]),
  },
  {
    name: "yes",
    hidden: true,
    usage: "yes",
    description: "",
    run: (args) => out([...Array(8).fill(args[0] ?? "y"), { text: "^C  (ok, that is enough)", tone: "dim" }]),
  },
  {
    name: "finger",
    hidden: true,
    usage: "finger",
    description: "",
    run: (_a, _e, fs) =>
      out([
        `Login: arjun               Name: Arjun Kuttikkat`,
        `Directory: /Users/arjun    Shell: /bin/zsh`,
        `Office: Dubai              Company: ${edgazeState.company}`,
        "Plan:",
        ...findFile(fs, HOME, ".plan")!.lines().slice(2),
      ]),
  },
  {
    name: "coffee",
    aliases: ["brew"],
    hidden: true,
    usage: "coffee",
    description: "",
    run: () =>
      out([
        "      ( (",
        "       ) )",
        "    ........",
        "    |      |]",
        "    \\      /",
        "     `----'",
        { text: "418 I'm a teapot. Most of this site was built on the stuff anyway.", tone: "dim" },
      ]),
  },
  {
    name: "zuck",
    aliases: ["zuckerberg", "meta"],
    hidden: true,
    usage: "zuck",
    description: "",
    run: (_a, env) => {
      const post = env.posts.find((p) => /stupid/i.test(p.title));
      return out([
        "Seventy-seven billion dollars and a low-resolution Eiffel Tower.",
        ...(post
          ? [{ text: `read ${post.slug}   — there is a whole post about it`, tone: "accent" as const }]
          : []),
      ]);
    },
  },
];

const FORTUNES = [
  "Effort does not compensate for direction. You can execute well and still end up nowhere.",
  "Until money flows, none of this is real.",
  "A workflow that is not discoverable might as well not exist.",
  "Persistence does not turn a bad thesis into a good one.",
  "Starting something when nobody knows who you are feels terrifying, but reputationally it is cheap.",
  "Ship the thing. Talk to the people using it. Fix what they hit. Repeat.",
  "Interest is the easy part. The work is turning it into repeated usage.",
  "You do not wait until everything is perfect. You build, you break, you fix, and you keep going.",
];

const dummyEnv: TermEnv = {
  context: "home",
  cwd: HOME,
  posts: [],
  history: [],
  startedAt: 0,
};

function find(name: string): Command | undefined {
  return commands.find((c) => c.name === name || c.aliases?.includes(name));
}

/** True when `name` is a command or alias (pickers use this to tell a command from a filter). */
export function isCommand(name: string): boolean {
  return find(name.toLowerCase()) !== undefined;
}

function completePath(
  partial: string,
  env: TermEnv,
  fs: Record<string, FsDir>
): string[] {
  const slash = partial.lastIndexOf("/");
  const dirPart = slash === -1 ? "" : partial.slice(0, slash + 1);
  const filePart = slash === -1 ? partial : partial.slice(slash + 1);
  const dir = fs[resolvePath(env.cwd, dirPart || undefined)];
  if (!dir) return [];
  return [
    ...dir.dirs.filter((d) => d.startsWith(filePart)).map((d) => `${dirPart}${d}/`),
    ...dir.files
      .filter((f) => f.name.startsWith(filePart))
      .map((f) => `${dirPart}${f.name}`),
  ];
}

export function tokenize(raw: string): string[] {
  return raw.trim().match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) ?? [];
}

export function execute(raw: string, env: TermEnv): CommandResult {
  const tokens = tokenize(raw);
  if (tokens.length === 0) return nothing();
  const [name, ...args] = tokens;
  const fs = buildFs(env.posts);
  const cmd = find(name);
  if (cmd) return cmd.run(args, env, fs);
  const jump = args.length === 0 ? autoJump(name, env, fs) : undefined;
  if (jump) return jump;
  return withSuggestions(
    `zsh: command not found: ${name}`,
    name,
    env,
    fs,
    { commands: true, dirs: true, files: true },
    args.join(" ")
  );
}

/** Tab completion. Returns the candidates for the last token of `raw`. */
export function complete(
  raw: string,
  env: TermEnv
): { candidates: string[]; replaceFrom: number } {
  const endsWithSpace = /\s$/.test(raw);
  const tokens = tokenize(raw);
  const fs = buildFs(env.posts);
  if (tokens.length === 0 || (tokens.length === 1 && !endsWithSpace)) {
    const p = tokens[0] ?? "";
    const names = commands
      .filter((c) => !c.hidden && c.name.startsWith(p))
      .map((c) => c.name);
    return { candidates: names, replaceFrom: raw.length - p.length };
  }
  const cmd = find(tokens[0]);
  const partial = endsWithSpace ? "" : tokens[tokens.length - 1];
  const candidates = cmd?.complete ? cmd.complete(partial, env, fs) : [];
  return { candidates, replaceFrom: raw.length - partial.length };
}

/** Boot output without the clock-dependent login line, so server and client render the same markup. */
export function bootBlocks(context: TermEnv["context"], entry?: TermEntry): TermBlock[] {
  return [
    { id: "boot-banner", kind: "banner" },
    {
      id: "boot-site",
      kind: "system",
      text: `arjunkuttikkat.com · terminal ${TERMINAL_VERSION}`,
    },
    {
      id: "boot-hint",
      kind: "system",
      text: "cd projects · cd blogs · about · newsletter — or 'help'. Tab completes.",
    },
    ...(context === "route"
      ? [
          {
            id: "boot-exit",
            kind: "system" as const,
            text: entry
              ? `Opened from ${entry.path} · working directory ${entry.cwd} · 'exit' returns there.`
              : "Type 'exit' to return to the site.",
          },
        ]
      : []),
    { id: "boot-space", kind: "system", text: "" },
  ];
}

export const SUGGESTIONS = [
  "help",
  "home",
  "about",
  "projects",
  "project edgaze",
  "blogs",
  "neofetch",
  "newsletter",
  "clear",
] as const;

export { buildFs, HOME };
