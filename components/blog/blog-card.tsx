"use client";

import Image from "next/image";
import Link from "next/link";
import type { BlogPostMeta } from "../../lib/blogs/types";
import { BlogDateLine } from "./blog-date";

type BlogCardProps = {
  post: BlogPostMeta;
};

export function BlogCard({ post }: BlogCardProps) {
  const excerpt = post.excerpt ?? post.description;

  return (
    <article>
      <Link
        href={`/blogs/${post.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#08080a]/70 transition-[border-color,box-shadow,transform] duration-300 hover:border-white/[0.13] hover:shadow-[0_20px_56px_rgba(0,0,0,0.38)] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
      >
        <div className="relative aspect-[16/9] bg-[#0c0c0f]">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={`Cover image for ${post.title}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.04),transparent_48%),radial-gradient(ellipse_at_80%_0%,rgba(34,211,238,0.08),transparent_55%)]" />
          )}
        </div>
        <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            {post.category}
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-blog-serif)] text-lg font-medium leading-snug tracking-[-0.02em] text-white sm:text-[1.15rem]">
            {post.title}
          </h2>
          <p className="mt-2 line-clamp-3 flex-1 text-[0.88rem] leading-relaxed text-zinc-500">
            {excerpt}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-4 text-[0.72rem] text-zinc-500">
            <BlogDateLine date={post.date} updatedAt={post.updatedAt} />
            <span className="text-zinc-600" aria-hidden>
              ·
            </span>
            <span>{post.readTimeMinutes} min</span>
          </div>
          {post.tags.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded border border-white/[0.07] px-2 py-0.5 text-[0.62rem] uppercase tracking-[0.1em] text-zinc-500"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
