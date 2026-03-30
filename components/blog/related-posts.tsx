import Link from "next/link";
import type { BlogPostMeta } from "../../lib/blogs/types";

type RelatedPostsProps = {
  posts: BlogPostMeta[];
};

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts.length) return null;

  return (
    <section className="mt-16 border-t border-white/[0.08] pt-12" aria-labelledby="related-heading">
      <h2
        id="related-heading"
        className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-zinc-500"
      >
        Related
      </h2>
      <ul className="mt-6 space-y-4">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blogs/${p.slug}`}
              className="group block rounded-lg border border-transparent px-0 py-1 transition-colors hover:border-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
            >
              <span className="font-[family-name:var(--font-blog-serif)] text-base font-medium text-zinc-200 transition-colors group-hover:text-white">
                {p.title}
              </span>
              <span className="mt-1 block text-[0.78rem] text-zinc-500">{p.category}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
