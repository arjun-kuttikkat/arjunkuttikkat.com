"use client";

import type { BlogPostMeta } from "../../lib/blogs/types";
import dynamic from "next/dynamic";

const AboutPageClient = dynamic(
  () =>
    import("./about-page-client").then((mod) => mod.AboutPageClient),
  { ssr: false },
);

export function AboutPageClientLoader({ recentPosts }: { recentPosts: BlogPostMeta[] }) {
  return <AboutPageClient recentPosts={recentPosts} />;
}

