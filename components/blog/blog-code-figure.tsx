"use client";

import { useCallback, useRef, useState, type ElementRef } from "react";

type BlogCodeFigureProps = React.ComponentPropsWithoutRef<"figure">;

export function BlogCodeFigure({ children, className, ...rest }: BlogCodeFigureProps) {
  const rootRef = useRef<ElementRef<"figure">>(null);
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    const pre = rootRef.current?.querySelector("pre");
    if (!pre) return;
    const text = pre.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  return (
    <figure
      ref={rootRef}
      className={`group/code relative my-8 ${className ?? ""}`}
      {...rest}
    >
      <div className="pointer-events-none absolute right-3 top-3 z-10 opacity-0 transition-opacity duration-200 group-hover/code:pointer-events-auto group-hover/code:opacity-100">
        <button
          type="button"
          onClick={() => void copy()}
          className="pointer-events-auto rounded-md border border-white/14 bg-[#0c0c0f]/95 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-zinc-200 shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-colors hover:border-white/22 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {children}
    </figure>
  );
}
