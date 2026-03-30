"use client";

import { useCallback, useState } from "react";

type BlogShareBarProps = {
  url: string;
  title: string;
};

export function BlogShareBar({ url, title }: BlogShareBarProps) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [url]);

  const enc = encodeURIComponent;
  const xHref = `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`;
  const liHref = `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`;

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.08] pt-8">
      <span className="mr-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Share
      </span>
      <button
        type="button"
        onClick={() => void copy()}
        className="rounded-lg border border-white/12 bg-white/[0.03] px-3 py-1.5 text-[0.72rem] font-medium text-zinc-200 transition-colors hover:border-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
      >
        {copied ? "Link copied" : "Copy link"}
      </button>
      <a
        href={xHref}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-white/12 bg-white/[0.03] px-3 py-1.5 text-[0.72rem] font-medium text-zinc-200 transition-colors hover:border-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
      >
        X
      </a>
      <a
        href={liHref}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-white/12 bg-white/[0.03] px-3 py-1.5 text-[0.72rem] font-medium text-zinc-200 transition-colors hover:border-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
      >
        LinkedIn
      </a>
    </div>
  );
}
