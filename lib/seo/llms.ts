import "server-only";

import { getPostRawBody } from "../blogs/meta";
import { getPublishedPostsMeta } from "../blogs/meta";
import { getProjectsSorted } from "../projects";
import { siteDescription, siteName, siteUrl } from "../site";

/**
 * Builders for the llmstxt.org convention.
 *
 * `/llms.txt` is a short discovery file: who the site is about, what is here,
 * and links (HTML + per-post markdown) an LLM can follow. `/llms-full.txt` is
 * the same content concatenated into one file so a single fetch ingests the
 * whole site. Both are plain Markdown served as text/markdown.
 */

function postUrl(slug: string): string {
  return `${siteUrl}/blogs/${slug}`;
}

function postMdUrl(slug: string): string {
  return `${siteUrl}/blogs/${slug}/md`;
}

function projectUrl(slug: string): string {
  return `${siteUrl}/projects/${slug}`;
}

/**
 * The discovery overview. Follows the llmstxt.org shape:
 *   # Title
 *   > description
 *   ## Section
 *   - [text](url): optional detail
 */
export function buildLlmsTxt(): string {
  const posts = getPublishedPostsMeta();
  const projects = getProjectsSorted();

  const aboutBlock = [
    "## About",
    `- [About](${siteUrl}/about): Background on Arjun Kuttikkat — Kerala, Dubai, Edge Platforms, Inc., and building Edgaze.`,
    ""
  ].join("\n");

  const projectsBlock = [
    "## Projects",
    ...projects.map(
      (p) =>
        `- [${p.name}](${projectUrl(p.slug)}): ${p.summary}`
    ),
    ""
  ].join("\n");

  const writingBlock = [
    "## Writing",
    ...posts.map(
      (p) =>
        `- [${p.title}](${postUrl(p.slug)}): ${p.excerpt ?? p.description} (also available as Markdown: ${postMdUrl(p.slug)})`
    ),
    ""
  ].join("\n");

  const otherBlock = [
    "## Other",
    `- [Newsletter](${siteUrl}/newsletter): Occasional notes on building Edgaze.`,
    `- [Terminal](${siteUrl}/terminal): Interactive terminal-style route for exploring the site.`,
    `- [RSS feed](${siteUrl}/feed.xml): Atom/RSS feed of all posts.`,
    `- [Sitemap](${siteUrl}/sitemap.xml): XML sitemap of all indexable pages.`,
    ""
  ].join("\n");

  const fullBlock = [
    "## Full content",
    `- [Complete site content as Markdown](${siteUrl}/llms-full.txt): Every project summary and every published post body in one file.`
  ].join("\n");

  return [
    `# ${siteName}`,
    "",
    `> ${siteDescription} ${siteName} is the founder of Edgaze, a marketplace and hosted runtime for AI workflows. This site is a public record of the products being built, how they work, and what was learned making them.`,
    "",
    aboutBlock,
    projectsBlock,
    writingBlock,
    otherBlock,
    fullBlock,
    ""
  ].join("\n");
}

/**
 * The full site content as one Markdown document. Each project is summarised
 * (name, summary, tagline, state, links) and each published post is included
 * verbatim (frontmatter as a metadata block, then the raw Markdown body).
 */
export function buildLlmsFullTxt(): string {
  const posts = getPublishedPostsMeta();
  const projects = getProjectsSorted();

  const projectSections = projects.map((p) => {
    return [
      `## ${p.name}`,
      "",
      `- Summary: ${p.summary}`,
      `- Tagline: ${p.tagline}`,
      `- Category: ${p.category}`,
      `- State: ${p.state}`,
      `- Year: ${p.year}`,
      `- Page: ${projectUrl(p.slug)}`,
      "",
      "### TL;DR",
      "",
      ...p.tldr.map((point) => `- ${point}`),
      ""
    ].join("\n");
  });

  const postSections = posts.map((p) => {
    const body = getPostRawBody(p.slug) ?? "";
    return [
      `## ${p.title}`,
      "",
      `- URL: ${postUrl(p.slug)}`,
      `- Date: ${p.date}${p.updatedAt ? ` (updated ${p.updatedAt})` : ""}`,
      `- Author: ${p.author}${p.authorRole ? `, ${p.authorRole}` : ""}`,
      `- Tags: ${p.tags.join(", ")}`,
      `- Description: ${p.description}`,
      "",
      body.trim(),
      ""
    ].join("\n");
  });

  return [
    `# ${siteName} — full content`,
    "",
    `> ${siteDescription}`,
    "",
    `Site: ${siteUrl}`,
    "",
    "# Projects",
    "",
    ...projectSections,
    "# Writing",
    "",
    ...postSections,
    ""
  ].join("\n");
}

/** A single post rendered as standalone Markdown for the per-post route. */
export function buildPostMarkdown(slug: string): string | undefined {
  const posts = getPublishedPostsMeta();
  const meta = posts.find((p) => p.slug === slug);
  if (!meta) return undefined;
  const body = getPostRawBody(slug);
  if (body == null) return undefined;

  return [
    `# ${meta.title}`,
    "",
    `- URL: ${postUrl(slug)}`,
    `- Date: ${meta.date}${meta.updatedAt ? ` (updated ${meta.updatedAt})` : ""}`,
    `- Author: ${meta.author}${meta.authorRole ? `, ${meta.authorRole}` : ""}`,
    `- Tags: ${meta.tags.join(", ")}`,
    `- Description: ${meta.description}`,
    "",
    body.trim(),
    ""
  ].join("\n");
}
