"use client";

import { useEffect, useMemo } from "react";
import type { TocItem } from "../../lib/blogs/types";
import { setTocActiveId } from "./blog-toc-store";

export function BlogTocTracker({ items }: { items: TocItem[] }) {
  const ids = useMemo(() => items.map((i) => i.id), [items]);

  useEffect(() => {
    if (!ids.length) {
      setTocActiveId(null);
      return;
    }

    setTocActiveId(ids[0] ?? null);

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => n !== null);

    if (!elements.length) {
      setTocActiveId(ids[0] ?? null);
      return;
    }

    const pickFromScroll = () => {
      const offset = 120;
      let current = ids[0] ?? null;
      for (const el of elements) {
        const top = el.getBoundingClientRect().top;
        if (top <= offset) current = el.id;
      }
      setTocActiveId(current);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) {
          const best = visible.reduce((acc, e) =>
            e.intersectionRatio > acc.intersectionRatio ? e : acc
          );
          setTocActiveId(best.target.id);
          return;
        }
        pickFromScroll();
      },
      {
        root: null,
        rootMargin: "-38% 0px -52% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 1]
      }
    );

    elements.forEach((el) => observer.observe(el));
    pickFromScroll();
    window.addEventListener("scroll", pickFromScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", pickFromScroll);
    };
  }, [ids]);

  return null;
}
