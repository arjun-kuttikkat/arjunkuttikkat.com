import Link from "next/link";
import Image from "next/image";
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
        className="text-[0.68rem] font-semibold tracking-[0.08em] text-zinc-500"
      >
        Related
      </h2>
      <ul className="mt-6 space-y-3">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blogs/${p.slug}`}
              className="group flex items-start gap-4 rounded-xl border border-white/[0.06] bg-[#08080a]/35 p-3 transition-[border-color,background-color,transform] duration-200 hover:border-white/[0.12] hover:bg-[#0b0b0f]/55 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
            >
              <div className="relative mt-0.5 h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/[0.08] bg-[#0c0c0f]">
                {p.coverImage ? (
                  <Image
                    src={p.coverImage}
                    alt={`Cover image for ${p.title}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="56px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(34,211,238,0.12),transparent_55%),radial-gradient(ellipse_at_80%_60%,rgba(232,121,249,0.08),transparent_50%)]" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.68rem] font-semibold tracking-[0.16em] text-zinc-500">
                  <span>{p.category}</span>
                  <span className="text-zinc-600" aria-hidden>
                    ·
                  </span>
                  <span className="text-zinc-500">{p.readTimeMinutes} min</span>
                </div>
                <div className="mt-1 font-[family-name:var(--font-blog-serif)] text-[0.98rem] font-medium leading-snug text-zinc-200 transition-colors group-hover:text-white">
                  {p.title}
                </div>
                <p className="mt-1 line-clamp-2 text-[0.82rem] leading-relaxed text-zinc-500">
                  {p.excerpt ?? p.description}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
