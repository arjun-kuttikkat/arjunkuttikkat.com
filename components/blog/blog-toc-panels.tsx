"use client";

import { useSyncExternalStore } from "react";
import type { TocItem } from "../../lib/blogs/types";
import {
  getTocActiveServerSnapshot,
  getTocActiveSnapshot,
  subscribeTocActive
} from "./blog-toc-store";

function TocList({
  items,
  activeId
}: {
  items: TocItem[];
  activeId: string | null;
}) {
  return (
    <ul className="space-y-1 border-l border-white/[0.08]">
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block border-l-2 py-1.5 text-[0.82rem] leading-snug transition-colors duration-200 focus:outline-none focus-visible:text-white focus-visible:ring-2 focus-visible:ring-cyan-400/40 ${
                item.depth === 3 ? "pl-7" : "pl-4"
              } ${
                active
                  ? "-ml-px border-cyan-400/70 text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-200"
              }`}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function BlogTocMobilePanel({ items }: { items: TocItem[] }) {
  const activeId = useSyncExternalStore(
    subscribeTocActive,
    getTocActiveSnapshot,
    getTocActiveServerSnapshot
  );

  if (!items.length) return null;

  return (
    <details className="mb-10 rounded-xl border border-white/10 bg-[#08080a]/90 lg:hidden">
      <summary className="cursor-pointer list-none px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-zinc-300 outline-none transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-3">
          On this page
          <span className="text-zinc-500" aria-hidden>
            +
          </span>
        </span>
      </summary>
      <div className="border-t border-white/[0.06] px-2 py-3">
        <nav aria-label="On this page">
          <TocList items={items} activeId={activeId} />
        </nav>
      </div>
    </details>
  );
}

export function BlogTocDesktopPanel({ items }: { items: TocItem[] }) {
  const activeId = useSyncExternalStore(
    subscribeTocActive,
    getTocActiveSnapshot,
    getTocActiveServerSnapshot
  );

  if (!items.length) return null;

  return (
    <aside className="relative hidden min-w-0 lg:block">
      <div className="sticky top-28">
        <nav aria-label="On this page" className="text-sm">
          <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            On this page
          </p>
          <TocList items={items} activeId={activeId} />
        </nav>
      </div>
    </aside>
  );
}
