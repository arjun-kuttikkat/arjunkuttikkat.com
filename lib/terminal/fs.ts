import { aboutClosingLine, aboutParagraphs } from "../about-content";
import { socialLinks } from "../data";
import { edgazeState, edgazeTimeline } from "../edgaze";
import { projectStateLabel, projects, type Project } from "../projects";
import { contactEmail } from "../site";
import { stackTechnologyNames } from "../technologies";
import type { TermLine, TermPost } from "./types";

/**
 * A tiny read-only filesystem rooted at ~ so ls / cd / cat / open behave like a shell.
 * Directories hold either static files or one file per project / post.
 */
export type FsFile = {
  name: string;
  /** Route the file "opens" to, when there is a page for it. */
  href?: string;
  /** External URL, when the file is really a link. */
  external?: string;
  lines: () => TermLine[];
};

export type FsDir = {
  name: string;
  files: FsFile[];
  dirs: string[];
};

export const HOME = "~";

function wrap(text: string, width = 78): string[] {
  const words = text.split(" ");
  const out: string[] = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > width) {
      out.push(line);
      line = w;
    } else {
      line = (line + " " + w).trim();
    }
  }
  if (line) out.push(line);
  return out;
}

function projectFile(p: Project): FsFile {
  return {
    name: `${p.slug}.md`,
    href: `/projects/${p.slug}`,
    lines: () => [
      { text: `# ${p.name}`, tone: "bold" },
      { text: `${p.tagline}`, tone: "dim" },
      "",
      ...wrap(p.summary),
      "",
      `state     ${projectStateLabel[p.state]} (${p.stateNote})`,
      `year      ${p.year}`,
      `role      ${p.role}`,
      ...(p.team ? [`team      ${p.team}`] : []),
      ...(p.context ? [`context   ${p.context}`] : []),
      ...wrap(`stack     ${stackTechnologyNames(p.stack).join(", ")}`).map((l, i) =>
        i === 0 ? l : `          ${l}`
      ),
      "",
      { text: "## TL;DR", tone: "bold" },
      ...p.tldr.flatMap((t) => wrap(`- ${t}`)),
      "",
      { text: "## Links", tone: "bold" },
      ...p.links.map((l) => ({ text: `${l.label.padEnd(20)} ${l.href}`, href: l.href })),
      {
        text: `${"Project page".padEnd(20)} /projects/${p.slug}`,
        href: `/projects/${p.slug}`,
      },
    ],
  };
}

function postFile(post: TermPost): FsFile {
  return {
    name: `${post.slug}.md`,
    href: `/blogs/${post.slug}`,
    lines: () => [
      { text: `# ${post.title}`, tone: "bold" },
      { text: `${post.date} · ${post.readTimeMinutes} min read`, tone: "dim" },
      "",
      ...wrap(post.description),
      "",
      { text: `Read post → /blogs/${post.slug}`, href: `/blogs/${post.slug}` },
      { text: `Markdown  → /blogs/${post.slug}/md`, href: `/blogs/${post.slug}/md` },
    ],
  };
}

export function buildFs(posts: TermPost[]): Record<string, FsDir> {
  const root: FsDir = {
    name: HOME,
    dirs: ["projects", "blogs"],
    files: [
      {
        name: "README.md",
        lines: () => [
          { text: "# arjunkuttikkat.com", tone: "bold" },
          "",
          "Personal site of Arjun Kuttikkat, founder of Edgaze.",
          "Project records, writing, and notes from building it.",
          "",
          "Directories",
          "  projects/   one file per project record",
          "  blogs/      one file per published post",
          "",
          "Files",
          "  about.txt   who Arjun is",
          "  current.txt what is being worked on right now",
          "  links.txt   where to find him",
          "  stack.txt   technologies used across projects",
          "",
          "Try: cat about.txt · ls projects · open projects/edgaze.md · neofetch",
        ],
      },
      {
        name: "about.txt",
        href: "/about",
        lines: () => [
          { text: "Arjun Kuttikkat", tone: "bold" },
          { text: "Founder, Edgaze (Edge Platforms, Inc.)", tone: "dim" },
          "",
          ...aboutParagraphs.flatMap((p) => [...wrap(p), ""]),
          { text: aboutClosingLine, tone: "dim" },
          "",
          { text: "Full page → /about", href: "/about" },
        ],
      },
      {
        name: "current.txt",
        lines: () => [
          { text: "Current focus", tone: "bold" },
          "",
          `Edgaze is ${edgazeState.label.toLowerCase()} (since ${edgazeState.since}).`,
          ...edgazeTimeline.map((t) => `  ${t.date.padEnd(14)} ${t.title}`),
          "",
          "  - Runtime reliability: 11 services monitored on status.edgaze.ai",
          "  - Distribution: REST API, MCP server, creator onboarding",
          "  - Target: 100k GMV before the end of 2026",
          "",
          { text: edgazeState.note, tone: "dim" },
        ],
      },
      {
        name: "links.txt",
        lines: () => [
          { text: "Links", tone: "bold" },
          "",
          ...socialLinks.map((s) => ({
            text: `${s.label.padEnd(10)} ${s.href}`,
            href: s.href,
          })),
          {
            text: `${"Email".padEnd(10)} ${contactEmail}`,
            href: `mailto:${contactEmail}`,
          },
        ],
      },
      {
        name: "stack.txt",
        lines: () => {
          const all = [
            ...new Set(projects.flatMap((p) => stackTechnologyNames(p.stack))),
          ].sort((a, b) => a.localeCompare(b));
          return [
            {
              text: `Technologies used across ${projects.length} projects`,
              tone: "bold",
            },
            "",
            ...columns(all, 3),
          ];
        },
      },
    ],
  };

  const projectsDir: FsDir = {
    name: "projects",
    dirs: [],
    files: [...projects].sort((a, b) => a.order - b.order).map(projectFile),
  };

  const blogsDir: FsDir = {
    name: "blogs",
    dirs: [],
    files: posts.map(postFile),
  };

  return {
    [HOME]: root,
    [`${HOME}/projects`]: projectsDir,
    [`${HOME}/blogs`]: blogsDir,
  };
}

/** Lay items out in N columns, like `ls` does. */
export function columns(items: string[], cols: number): string[] {
  if (items.length === 0) return [];
  const width = Math.max(...items.map((i) => i.length)) + 2;
  const rows = Math.ceil(items.length / cols);
  const out: string[] = [];
  for (let r = 0; r < rows; r++) {
    let line = "";
    for (let c = 0; c < cols; c++) {
      const item = items[c * rows + r];
      if (item !== undefined) line += item.padEnd(width);
    }
    out.push(line.trimEnd());
  }
  return out;
}

/** Resolve a user-typed path against cwd. Returns a normalised "~/..." path. */
export function resolvePath(cwd: string, input: string | undefined): string {
  if (input === undefined || input === "") return cwd;
  if (input === "~" || input === "/" || input === "$HOME") return HOME;
  let base: string[];
  let rest: string;
  if (input.startsWith("~/")) {
    base = [];
    rest = input.slice(2);
  } else if (input.startsWith("/")) {
    base = [];
    rest = input.slice(1);
  } else {
    base = cwd === HOME ? [] : cwd.slice(2).split("/");
    rest = input;
  }
  for (const seg of rest.split("/")) {
    if (!seg || seg === ".") continue;
    if (seg === "..") base.pop();
    else base.push(seg);
  }
  return base.length ? `${HOME}/${base.join("/")}` : HOME;
}

export function splitPath(path: string): { dir: string; file: string } {
  const i = path.lastIndexOf("/");
  if (i === -1) return { dir: HOME, file: path === HOME ? "" : path };
  return { dir: path.slice(0, i) || HOME, file: path.slice(i + 1) };
}

export function findFile(
  fs: Record<string, FsDir>,
  cwd: string,
  input: string
): FsFile | undefined {
  const full = resolvePath(cwd, input);
  const { dir, file } = splitPath(full);
  const d = fs[dir];
  if (!d) return undefined;
  return d.files.find(
    (f) => f.name === file || f.name === `${file}.md` || f.name === `${file}.txt`
  );
}
