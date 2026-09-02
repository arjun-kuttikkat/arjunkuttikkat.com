import Link from "next/link";
import { BlogCard } from "./blog/blog-card";
import { getPublishedPostsMeta } from "../lib/blogs/meta";
import { textLink } from "./ui/button-styles";

const HOMEPAGE_BLOG_LIMIT = 6;

export function BlogsSection() {
  const published = getPublishedPostsMeta();
  const posts = published.slice(0, HOMEPAGE_BLOG_LIMIT);
  if (posts.length === 0) return null;

  return (
    <section id="blogs" className="px-6 pb-28 pt-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.08em] text-zinc-400">Writing</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Latest posts
            </h2>
          </div>
          <Link href="/blogs" className={`${textLink} shrink-0`}>
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
