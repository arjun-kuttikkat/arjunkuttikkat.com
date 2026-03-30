import type { ReactNode } from "react";
import type { TocItem } from "../../lib/blogs/types";
import { BlogTocDesktopPanel, BlogTocMobilePanel } from "./blog-toc-panels";
import { BlogTocTracker } from "./blog-toc-tracker";

type BlogArticleReadingLayoutProps = {
  toc: TocItem[];
  article: ReactNode;
};

/**
 * Server layout: MDX `article` is never nested under a Client Component parent.
 * TOC UI is client-only; `BlogTocTracker` is a sibling so Turbopack does not pull
 * `next-mdx-remote` / `jsx-runtime.cjs` (`require`) into the browser bundle.
 */
export function BlogArticleReadingLayout({ toc, article }: BlogArticleReadingLayoutProps) {
  if (!toc.length) {
    return <div className="blog-article">{article}</div>;
  }

  return (
    <>
      <BlogTocTracker items={toc} />
      <div className="lg:grid lg:grid-cols-[minmax(0,42rem)_minmax(0,220px)] lg:gap-x-12 xl:grid-cols-[minmax(0,46rem)_minmax(0,220px)] xl:gap-x-16">
        <div className="min-w-0">
          <BlogTocMobilePanel items={toc} />
          <div className="blog-article">{article}</div>
        </div>
        <BlogTocDesktopPanel items={toc} />
      </div>
    </>
  );
}
