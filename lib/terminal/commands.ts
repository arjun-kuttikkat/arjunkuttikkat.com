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
import { projectStateLabel, projects } from "../projects";
import { contactEmail, siteUrl } from "../site";
import { buildFs, columns, findFile, HOME, resolvePath, type FsDir } from "./fs";
import {
  TERMINAL_HOST,
  TERMINAL_USER,
  TERMINAL_VERSION,
  type CommandResult,
  type TermBlock,
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

function listDir(dir: FsDir, long: boolean): TermLine[] {
  const entries = [
    ...dir.dirs.map((d) => ({ name: `${d}/`, dir: true })),
    ...dir.files.map((f) => ({ name: f.name, dir: false })),
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
      (e) =>
        `${e.dir ? "drwxr-xr-x" : "-rw-r--r--"}  1 ${TERMINAL_USER}  staff   ${date}  ${e.name}`
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
        ...group("About", [
          "whois",
          "current",
          "projects",
          "project",
          "blogs",
          "blog",
          "stack",
          "edgaze",
        ]),
        ...group("Reach", ["socials", "email", "newsletter", "open"]),
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
          "version",
          "banner",
          "exit",
        ]),
        {
          text: "Tab completes commands and paths. ↑ ↓ walk history. Ctrl+L clears, Ctrl+C cancels.",
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
    name: "whois",
    aliases: ["about", "who"],
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
        { text: "More: cat about.txt · open about", tone: "dim" },
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
    run: () =>
      out([
        { text: "Projects", tone: "bold" },
        ...[...projects]
          .sort((a, b) => a.order - b.order)
          .map((p) => ({
            text: `  ${p.slug.padEnd(20)}${projectStateLabel[p.state].toLowerCase().padEnd(16)}${p.tagline}`,
            href: `/projects/${p.slug}`,
          })),
        "",
        {
          text: "project <slug> for details · open <slug> to visit the page",
          tone: "dim",
        },
      ]),
  },
  {
    name: "project",
    usage: "project <slug>",
    description: "Details of one project",
    run: (args, _e, fs) => {
      if (!args[0]) return err("usage: project <slug>   (try: projects)");
      const f = findFile(fs, `${HOME}/projects`, args[0]);
      if (!f)
        return err(`project: '${args[0]}' not found. Run 'projects' to list slugs.`);
      return out(f.lines());
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
        return out([{ text: "No published posts yet.", tone: "dim" }]);
      return out([
        { text: `Posts (${env.posts.length})`, tone: "bold" },
        ...env.posts.map((p) => ({
          text: `  ${p.date.padEnd(12)}${p.title}  ${`· ${p.readTimeMinutes} min`}`,
          href: `/blogs/${p.slug}`,
        })),
        "",
        { text: "blog <slug> for the summary · open blogs for the index", tone: "dim" },
      ]);
    },
  },
  {
    name: "blog",
    aliases: ["post"],
    usage: "blog <slug>",
    description: "Summary of one post",
    run: (args, _e, fs) => {
      if (!args[0]) return err("usage: blog <slug>   (try: blogs)");
      const f = findFile(fs, `${HOME}/blogs`, args[0]);
      if (!f)
        return err(
          `blog: '${args[0]}' not found. Run 'blogs' or 'ls blogs' to list slugs.`
        );
      return out(f.lines());
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
        return out([
          { text: "Edgaze", tone: "bold" },
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
    run: () => ({
      blocks: [
        { id: id("out"), kind: "out", lines: ["Email address (Ctrl+C to cancel):"] },
      ],
      effects: [{ type: "prompt_email" }],
    }),
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
      return err(
        `open: nothing matches '${target}'. Run 'open' for the list of targets.`
      );
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
      const long = args.some((a) => a.startsWith("-") && a.includes("l"));
      const paths = args.filter((a) => !a.startsWith("-"));
      const target = resolvePath(env.cwd, paths[0]);
      const dir = fs[target];
      if (dir) return out(listDir(dir, long));
      const file = findFile(fs, env.cwd, paths[0] ?? "");
      if (file) return out([file.name]);
      return err(`ls: ${paths[0]}: No such file or directory`);
    },
    complete: completePath,
  },
  {
    name: "cd",
    usage: "cd [dir]",
    description: "Change directory",
    run: (args, env, fs) => {
      const target = resolvePath(env.cwd, args[0] ?? HOME);
      if (!fs[target]) {
        return findFile(fs, env.cwd, args[0] ?? "")
          ? err(`cd: not a directory: ${args[0]}`)
          : err(`cd: no such file or directory: ${args[0]}`);
      }
      return { blocks: [], effects: [{ type: "cwd", cwd: target }] };
    },
    complete: (p, env, fs) => completePath(p, env, fs).filter((s) => s.endsWith("/")),
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
        if (!f) return err(`cat: ${a}: No such file or directory`);
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
  const cmd = find(name);
  if (!cmd) return err(`zsh: command not found: ${name}`);
  return cmd.run(args, env, buildFs(env.posts));
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
export function bootBlocks(context: TermEnv["context"]): TermBlock[] {
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
      text: "Type 'help' to see available commands. Tab completes.",
    },
    ...(context === "route"
      ? [
          {
            id: "boot-exit",
            kind: "system" as const,
            text: "Type 'exit' to return to the site.",
          },
        ]
      : []),
    { id: "boot-space", kind: "system", text: "" },
  ];
}

export const SUGGESTIONS = [
  "help",
  "whois arjun",
  "current",
  "projects",
  "blogs",
  "neofetch",
  "open edgaze",
  "newsletter",
  "clear",
] as const;

export { buildFs, HOME };
