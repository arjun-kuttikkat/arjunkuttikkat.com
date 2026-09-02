import Link from "next/link";
import type { BlogPostMeta } from "../../lib/blogs/types";
import { textLink } from "../ui/button-styles";
import { Wide, eyebrow } from "./detail/primitives";

type RelatedPostsProps = {
  posts: BlogPostMeta[];
};

/**
 * "Related writing" on a project page. Mirrors RelatedProjects: a clean Wide
 * list with divide-y, no cards or pills. Only renders when there are posts
 * whose tags match the project, so hackathon projects with no matching writing
 * show nothing.
 */
export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-white/[0.08] py-16 sm:py-20">
      <Wide>
        <div className="flex items-end justify-between gap-6">
          <p className={eyebrow}>Related writing</p>
          <Link href="/blogs" className={textLink}>
            View all posts
            <span aria-hidden>→</span>
          </Link>
        </div>
        <ul className="mt-6 divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blogs/${p.slug}`}
                className="group grid gap-x-8 gap-y-1 py-5 sm:grid-cols-[14rem_minmax(0,1fr)_auto] sm:items-baseline focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
              >
                <span className="text-[1.05rem] font-semibold tracking-[-0.015em] text-white">{p.title}</span>
                <span className="text-[0.95rem] leading-[1.55] text-zinc-400 transition-colors group-hover:text-zinc-200">
                  {p.excerpt ?? p.description}
                </span>
                <span className="hidden text-[0.8125rem] text-zinc-500 sm:block">
                  {p.readTimeMinutes} min
                  <span aria-hidden className="ml-3 inline-block transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Wide>
    </section>
  );
}
