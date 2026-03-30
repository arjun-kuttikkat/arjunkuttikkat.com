import Link from "next/link";
import { BlogCard } from "./blog/blog-card";
import { getPublishedPostsMeta } from "../lib/blogs/meta";

const HOMEPAGE_BLOG_LIMIT = 6;

export function BlogsSection() {
  const published = getPublishedPostsMeta();
  const posts = published.slice(0, HOMEPAGE_BLOG_LIMIT);
  if (posts.length === 0) return null;

  return (
    <section id="blogs" className="px-6 pb-28 pt-4 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide text-zinc-400">Blogs</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Latest writing
            </h2>
          </div>
          <Link
            href="/blogs"
            className="inline-flex shrink-0 items-center gap-2 text-[0.8125rem] font-semibold text-cyan-300/90 transition-colors hover:text-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
          >
            View all posts
            <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
