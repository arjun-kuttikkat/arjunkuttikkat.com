import "server-only";

import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import type { Heading } from "mdast";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import type { TocItem } from "./types";

export function extractTocHeadings(markdown: string): TocItem[] {
  const tree = remark().use(remarkGfm).parse(markdown);
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];

  visit(tree, "heading", (node: Heading) => {
    if (node.depth !== 2 && node.depth !== 3) return;
    const text = toString(node).trim();
    if (!text) return;
    const id = slugger.slug(text);
    items.push({ id, text, depth: node.depth as 2 | 3 });
  });

  return items;
}
