import type { ReactNode } from "react";
import type { TocItem } from "../../lib/blogs/types";
import { BlogTocMobilePanel } from "./blog-toc-panels";
import { BlogTocTracker } from "./blog-toc-tracker";

type BlogArticleReadingLayoutProps = {
  toc: TocItem[];
  article: ReactNode;
};

/**
 * Server layout: MDX `article` is never nested under a Client Component parent.
 * TOC UI is client-only; `BlogTocTracker` is a sibling so Turbopack does not pull
 * `next-mdx-remote` / `jsx-runtime.cjs` (`require`) into the browser bundle.
 * The article is one centered column; the desktop TOC is rendered by the page as
 * a rail absolutely positioned to the right of this column.
 */
export function BlogArticleReadingLayout({ toc, article }: BlogArticleReadingLayoutProps) {
  if (!toc.length) {
    return <div className="blog-article">{article}</div>;
  }

  return (
    <>
      <BlogTocTracker items={toc} />
      <BlogTocMobilePanel items={toc} />
      <div className="blog-article">{article}</div>
    </>
  );
}
