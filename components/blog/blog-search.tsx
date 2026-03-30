"use client";

type BlogSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function BlogSearch({ value, onChange }: BlogSearchProps) {
  return (
    <div className="mb-6">
      <label htmlFor="blog-search" className="sr-only">
        Search posts
      </label>
      <div className="relative">
        <span
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
          aria-hidden
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M16.5 16.5 21 21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <input
          id="blog-search"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search titles, excerpts, tags…"
          autoComplete="off"
          className="w-full rounded-xl border border-white/[0.1] bg-[#08080a]/90 py-3.5 pl-12 pr-4 text-[0.95rem] text-zinc-100 placeholder:text-zinc-600 outline-none transition-[border-color,box-shadow] focus:border-cyan-400/35 focus:ring-1 focus:ring-cyan-400/25"
        />
      </div>
    </div>
  );
}
