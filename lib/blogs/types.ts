import type { ReactElement } from "react";

export type TocItem = {
  id: string;
  text: string;
  depth: 2 | 3;
};

export type BlogPostMeta = {
  title: string;
  description: string;
  slug: string;
  date: string;
  updatedAt?: string;
  coverImage?: string;
  tags: string[];
  category: string;
  featured: boolean;
  published: boolean;
  author: string;
  authorRole?: string;
  readingBadge?: string;
  excerpt?: string;
  /** minutes, computed */
  readTimeMinutes: number;
  /** source path for errors */
  sourcePath: string;
};

export type BlogPostCompiled = BlogPostMeta & {
  content: ReactElement;
  rawBody: string;
  toc: TocItem[];
};
