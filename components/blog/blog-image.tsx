"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type BlogImageProps = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
};

export function BlogImage({ src, alt, caption, width = 1200, height = 675 }: BlogImageProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <figure className="my-10">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block w-full overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0c] text-left shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-[border-color,box-shadow] duration-300 hover:border-white/16 hover:shadow-[0_24px_72px_rgba(0,0,0,0.42)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
        aria-label={`Enlarge image: ${alt}`}
      >
        <span className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 768px) 100vw, 720px"
          className="h-auto w-full object-cover"
          priority={false}
        />
      </button>
      {caption ? (
        <figcaption className="mt-3 text-center text-[0.85rem] leading-snug text-zinc-400">
          {caption}
        </figcaption>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/88 p-6 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={close}
        >
          <button
            type="button"
            className="absolute right-5 top-5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium tracking-[0.12em] text-zinc-100 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
          >
            Close
          </button>
          <div
            className="relative max-h-[85vh] max-w-[min(92vw,1100px)]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="h-auto max-h-[85vh] w-full rounded-lg object-contain"
            />
          </div>
        </div>
      ) : null}
    </figure>
  );
}
