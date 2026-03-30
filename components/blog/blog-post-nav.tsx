import Link from "next/link";
import type { BlogPostMeta } from "../../lib/blogs/types";

type BlogPostNavProps = {
  prev?: BlogPostMeta;
  next?: BlogPostMeta;
};

export function BlogPostNav({ prev, next }: BlogPostNavProps) {
  if (!prev && !next) return null;

  return (
    <nav
      className="mt-14 border-t border-white/[0.08] pt-10"
      aria-label="Adjacent posts"
    >
      {next ? (
        <Link
          href={`/blogs/${next.slug}`}
          className="group block rounded-xl border border-white/[0.07] bg-[#08080a]/50 px-4 py-4 transition-colors hover:border-white/[0.12] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
        >
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Next
          </span>
          <span className="mt-2 block font-[family-name:var(--font-blog-serif)] text-base font-medium text-zinc-200 transition-colors group-hover:text-white">
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
