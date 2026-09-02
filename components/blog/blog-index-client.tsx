"use client";

import { useMemo, useState } from "react";
import type { BlogPostMeta } from "../../lib/blogs/types";
import { BlogCard } from "./blog-card";
import { BlogFilterBar, type BlogFilter } from "./blog-filter-bar";
import { BlogSearch } from "./blog-search";

type BlogIndexClientProps = {
  posts: BlogPostMeta[];
};

export function BlogIndexClient({ posts }: BlogIndexClientProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<BlogFilter>({ kind: "all" });

  const categories = useMemo(
    () => [...new Set(posts.map((p) => p.category))].sort((a, b) => a.localeCompare(b)),
    [posts]
  );

  const tags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [posts]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (filter.kind === "category" && p.category !== filter.value) return false;
      if (
        filter.kind === "tag" &&
        !p.tags.some((t) => t.toLowerCase() === filter.value.toLowerCase())
      ) {
        return false;
      }
      if (!needle) return true;
      const blob = [p.title, p.description, p.excerpt ?? "", ...p.tags].join(" ").toLowerCase();
      return blob.includes(needle);
    });
  }, [posts, query, filter]);

  return (
    <section aria-label="All posts">
      <BlogSearch value={query} onChange={setQuery} />
      <BlogFilterBar categories={categories} tags={tags} filter={filter} onChange={setFilter} />

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/[0.12] bg-[#08080a]/40 px-6 py-14 text-center">
          <p className="text-[0.95rem] text-zinc-400">
            Nothing matches that search or filter yet. Try a different keyword or clear filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter({ kind: "all" });
            }}
            className="mt-5 text-[0.72rem] font-semibold tracking-[0.14em] text-cyan-300/90 transition-colors hover:text-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
          >
            Reset
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
