import type { TermLine } from "./types";

/**
 * Turn the Markdown served at `/blogs/<slug>/md` into terminal lines. This is a
 * deliberately small renderer: headings, paragraphs, quotes, lists, code fences,
 * links and the two MDX components posts use (`BlogImage`, `Callout`). Lines are
 * not hard-wrapped; the terminal wraps them to its own width.
 */

const RULE: TermLine = { text: "─".repeat(48), tone: "dim" };

function attr(tag: string, name: string): string | undefined {
  const m = tag.match(new RegExp(`${name}=(?:"([^"]*)"|'([^']*)'|\\{"([^"]*)"\\})`));
  return m?.[1] ?? m?.[2] ?? m?.[3];
}

/** Strip inline emphasis and code, and pull links out so they can be listed after the line. */
function inline(text: string): { text: string; links: string[] } {
  const links: string[] = [];
  const out = text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, (_m, alt: string) => `▣ ${alt}`)
    .replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_m, label: string, url: string) => {
      links.push(url);
      return `${label} ↗`;
    })
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(^|[^*\w])\*(?!\s)(.+?)\*(?!\w)/g, "$1$2")
    .replace(/(^|[^_\w])_(?!\s)(.+?)_(?!\w)/g, "$1$2")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, "");
  return { text: out, links };
}

function linkLines(links: string[]): TermLine[] {
  return links.map((href) => ({ text: `  ↗ ${href}`, href, tone: "dim" as const }));
}

/** Collapse the MDX components into single-line markers before line parsing. */
function preprocess(md: string): string {
  return md
    .replace(/<BlogImage\b([\s\S]*?)\/>/g, (_m, attrs: string) => {
      const caption = attr(attrs, "caption") ?? attr(attrs, "alt") ?? "image";
      return `\n@@IMAGE ${caption}\n`;
    })
    .replace(/<Callout\b([^>]*)>([\s\S]*?)<\/Callout>/g, (_m, attrs: string, inner: string) => {
      const title = attr(attrs, "title");
      const body = inner
        .trim()
        .split("\n")
        .map((l) => l.trim())
        .join(" ");
      return `\n@@CALLOUT ${title ?? ""}\n${body}\n@@ENDCALLOUT\n`;
    })
    .replace(/<\/?[A-Za-z][^>]*>/g, "");
}

export function markdownToLines(md: string): TermLine[] {
  const lines = preprocess(md).split("\n");
  const out: TermLine[] = [];
  let paragraph: string[] = [];
  let inCode = false;
  let inCallout = false;

  const flush = () => {
    if (!paragraph.length) return;
    const { text, links } = inline(paragraph.join(" "));
    out.push(inCallout ? { text: `┃ ${text}` } : text, ...linkLines(links));
    paragraph = [];
  };
  const blank = () => {
    const last = out[out.length - 1];
    if (last !== undefined && (typeof last === "string" ? last : last.text) !== "") out.push("");
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");

    if (line.startsWith("```")) {
      flush();
      inCode = !inCode;
      if (inCode) blank();
      continue;
    }
    if (inCode) {
      out.push({ text: `  ${raw}`, tone: "dim" });
      continue;
    }

    if (line === "") {
      flush();
      blank();
      continue;
    }
    if (line.startsWith("@@IMAGE ")) {
      flush();
      blank();
      out.push({ text: `▣ ${line.slice(8)}`, tone: "dim" });
      blank();
      continue;
    }
    if (line.startsWith("@@CALLOUT")) {
      flush();
      blank();
      inCallout = true;
      const title = line.slice(9).trim();
      if (title) out.push({ text: `┃ ${title}`, tone: "bold" });
      continue;
    }
    if (line === "@@ENDCALLOUT") {
      flush();
      inCallout = false;
      blank();
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      flush();
      blank();
      const { text, links } = inline(heading[2]);
      out.push({ text, tone: "bold" }, ...linkLines(links));
      if (heading[1].length <= 2) out.push({ text: "─".repeat(Math.min(48, Math.max(8, text.length))), tone: "dim" });
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      flush();
      blank();
      out.push(RULE);
      blank();
      continue;
    }
    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      flush();
      const { text, links } = inline(quote[1]);
      out.push({ text: `│ ${text}`, tone: "dim" }, ...linkLines(links));
      continue;
    }
    const bullet = line.match(/^\s*[-*+]\s+(.*)$/);
    if (bullet) {
      flush();
      const { text, links } = inline(bullet[1]);
      out.push(`  • ${text}`, ...linkLines(links));
      continue;
    }
    const ordered = line.match(/^\s*(\d+)[.)]\s+(.*)$/);
    if (ordered) {
      flush();
      const { text, links } = inline(ordered[2]);
      out.push(`  ${ordered[1]}. ${text}`, ...linkLines(links));
      continue;
    }
    paragraph.push(line.trim());
  }
  flush();

  while (out.length && (typeof out[0] === "string" ? out[0] : out[0].text) === "") out.shift();
  while (out.length && (typeof out[out.length - 1] === "string" ? out[out.length - 1] : (out[out.length - 1] as { text: string }).text) === "") out.pop();
  return out;
}

/**
 * The per-post Markdown route starts with `# Title` and a bullet list of
 * metadata. Split that off so the article can print its own masthead.
 */
export function parsePostMarkdown(md: string): {
  title: string;
  meta: Record<string, string>;
  body: string;
} {
  const lines = md.split("\n");
  let i = 0;
  let title = "";
  const meta: Record<string, string> = {};
  if (lines[0]?.startsWith("# ")) {
    title = lines[0].slice(2).trim();
    i = 1;
  }
  while (i < lines.length && lines[i].trim() === "") i++;
  while (i < lines.length) {
    const m = lines[i].match(/^- ([A-Za-z]+): (.*)$/);
    if (!m) break;
    meta[m[1].toLowerCase()] = m[2];
    i++;
  }
  return { title, meta, body: lines.slice(i).join("\n") };
}

export function articleLines(slug: string, md: string): TermLine[] {
  const { title, meta, body } = parsePostMarkdown(md);
  const byline = [meta.date, meta.author, meta.tags].filter(Boolean).join(" · ");
  return [
    { text: title, tone: "bold" },
    ...(byline ? [{ text: byline, tone: "dim" as const }] : []),
    RULE,
    "",
    ...markdownToLines(body),
    "",
    RULE,
    { text: `Read on the web → /blogs/${slug}`, href: `/blogs/${slug}` },
    { text: `Plain Markdown  → /blogs/${slug}/md`, href: `/blogs/${slug}/md` },
    { text: "blogs to list every post · open blogs for the index", tone: "dim" },
  ];
}
