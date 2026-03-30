import "server-only";

import fs from "fs";
import matter from "gray-matter";
import { compileBlogMdx } from "./compile-mdx";
import { extractTocHeadings } from "./headings";
import { findFilePathBySlug, parseBlogFile } from "./meta";

export async function getCompiledPostBySlug(slug: string) {
  const filePath = findFilePathBySlug(slug);
  if (!filePath) return undefined;
  const raw = fs.readFileSync(filePath, "utf8");
  const meta = parseBlogFile(filePath, raw);
  const { content } = matter(raw);
  const toc = extractTocHeadings(content);
  const mdx = await compileBlogMdx(content);
  return { ...meta, content: mdx, rawBody: content, toc };
}
