import Image from "next/image";
import Link from "next/link";
import type { BlogPostMeta } from "../../lib/blogs/types";
import { BlogDateLine } from "./blog-date";

type FeaturedPostProps = {
  post: BlogPostMeta;
};

export function FeaturedPost({ post }: FeaturedPostProps) {
  const excerpt = post.excerpt ?? post.description;

  return (
    <article className="group mb-16">
      <Link
        href={`/blogs/${post.slug}`}
        className="block rounded-2xl border border-white/[0.09] bg-[#070708]/80 p-1 shadow-[0_24px_80px_rgba(0,0,0,0.35)] transition-[border-color,box-shadow,transform] duration-500 ease-out hover:border-white/[0.14] hover:shadow-[0_32px_96px_rgba(0,0,0,0.42)] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
      >
        <div className="grid gap-0 overflow-hidden rounded-[0.95rem] lg:grid-cols-[1.15fr_1fr]">
          <div className="relative aspect-[16/10] min-h-[200px] bg-[#0c0c0f] lg:aspect-auto lg:min-h-[320px]">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={`Cover image for ${post.title}`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 55vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(34,211,238,0.12),transparent_55%),radial-gradient(ellipse_at_80%_60%,rgba(232,121,249,0.08),transparent_50%)]" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent lg:bg-gradient-to-r" />
          </div>
          <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10">
            <p className="text-[0.65rem] font-semibold tracking-[0.08em] text-cyan-300/80">
              Featured
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-blog-serif)] text-[1.65rem] font-medium leading-tight tracking-[-0.03em] text-white transition-colors group-hover:text-white sm:text-[1.85rem]">
              {post.title}
            </h2>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-zinc-400 sm:text-[1.02rem]">
              {excerpt}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-[0.75rem] text-zinc-500">
              <BlogDateLine date={post.date} updatedAt={post.updatedAt} />
              <span className="text-zinc-600" aria-hidden>
                ·
              </span>
              <span>{post.readTimeMinutes} min read</span>
              {post.readingBadge ? (
                <>
                  <span className="text-zinc-600" aria-hidden>
                    ·
                  </span>
                  <span className="rounded-md border border-white/10 px-2 py-0.5 text-[0.65rem] tracking-[0.12em] text-zinc-400">
                    {post.readingBadge}
                  </span>
                </>
              ) : null}
            </div>
            <span className="mt-8 inline-flex w-fit items-center gap-2 text-[0.72rem] font-semibold tracking-[0.14em] text-zinc-200 transition-colors group-hover:text-white">
              Read post
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
