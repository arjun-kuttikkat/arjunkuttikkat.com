"use client";

import { useEffect, useState } from "react";

export function BlogProgressBar() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scroll = el.scrollTop;
      const height = el.scrollHeight - el.clientHeight;
      const next = height > 0 ? Math.min(1, Math.max(0, scroll / height)) : 0;
      setP(next);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[96] h-[2px] bg-transparent"
      aria-hidden
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-cyan-400/90 via-cyan-300/70 to-fuchsia-400/75 transition-[transform] duration-150 ease-out will-change-transform"
        style={{ transform: `scaleX(${p})` }}
      />
    </div>
  );
}
