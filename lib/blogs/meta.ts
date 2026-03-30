import "server-only";

import fs from "fs";
import matter from "gray-matter";
import path from "path";
import type { ZodError } from "zod";
import { blogFrontmatterSchema } from "./schema";
import { estimateReadTimeMinutes } from "./read-time";
import { BLOG_CONTENT_DIR } from "./paths";
import type { BlogPostMeta } from "./types";

function assertBlogDir(): void {
  if (!fs.existsSync(BLOG_CONTENT_DIR)) {
    const msg = `Blog content directory missing: ${BLOG_CONTENT_DIR}`;
    if (process.env.NODE_ENV === "development") {
      throw new Error(`[blog] ${msg}`);
    }
  }
}

function formatZodError(err: ZodError, filePath: string): string {
  return err.issues
    .map((i) => `${filePath}: ${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("\n");
}

export function parseBlogFile(filePath: string, raw: string): BlogPostMeta {
  const { data, content } = matter(raw);
  const parsed = blogFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    const detail = formatZodError(parsed.error, filePath);
    const msg = `[blog] Invalid frontmatter in ${filePath}:\n${detail}`;
    if (process.env.NODE_ENV === "development") {
      throw new Error(msg);
    }
    throw new Error(msg);
  }

  const fm = parsed.data;
  const readTimeMinutes = estimateReadTimeMinutes(content);

  return {
    title: fm.title,
    description: fm.description,
    slug: fm.slug,
    date: fm.date,
    updatedAt: fm.updatedAt,
    coverImage: fm.coverImage,
    tags: fm.tags,
    category: fm.category,
    featured: fm.featured,
    published: fm.published,
    author: fm.author,
    authorRole: fm.authorRole,
    readingBadge: fm.readingBadge,
    excerpt: fm.excerpt,
    readTimeMinutes,
    sourcePath: filePath
  };
}

export function getAllBlogFiles(): string[] {
  assertBlogDir();
  if (!fs.existsSync(BLOG_CONTENT_DIR)) return [];
  return fs
    .readdirSync(BLOG_CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.join(BLOG_CONTENT_DIR, f));
}

export function getAllPostsMeta(): BlogPostMeta[] {
  const files = getAllBlogFiles();
  const posts: BlogPostMeta[] = [];
  const slugs = new Map<string, string>();

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, "utf8");
    const meta = parseBlogFile(filePath, raw);
    const existing = slugs.get(meta.slug);
    if (existing) {
      throw new Error(
        `[blog] Duplicate slug "${meta.slug}" in ${filePath} and ${existing}`
      );
    }
    slugs.set(meta.slug, filePath);
    posts.push(meta);
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPublishedPostsMeta(): BlogPostMeta[] {
  return getAllPostsMeta().filter((p) => p.published);
}

/** Resolve file by frontmatter `slug` (filename may differ). */
export function findFilePathBySlug(slug: string): string | undefined {
  for (const filePath of getAllBlogFiles()) {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);
    if (typeof data.slug === "string" && data.slug === slug) {
      return filePath;
    }
  }
  return undefined;
}

export function getPostMetaBySlug(slug: string): BlogPostMeta | undefined {
  const filePath = findFilePathBySlug(slug);
  if (!filePath) return undefined;
  const raw = fs.readFileSync(filePath, "utf8");
  return parseBlogFile(filePath, raw);
}

export function getPublishedSlugs(): string[] {
  return getPublishedPostsMeta().map((p) => p.slug);
}

/** Newest first (same as index). Previous = older, Next = newer. */
export function getAdjacentPublishedPosts(slug: string): {
  prev?: BlogPostMeta;
  next?: BlogPostMeta;
} {
  const sorted = [...getPublishedPostsMeta()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const idx = sorted.findIndex((p) => p.slug === slug);
  if (idx === -1) return {};
  return {
    prev: sorted[idx + 1],
    next: sorted[idx - 1]
  };
}
