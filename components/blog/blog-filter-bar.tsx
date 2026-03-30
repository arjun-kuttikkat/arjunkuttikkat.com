"use client";

export type BlogFilter =
  | { kind: "all" }
  | { kind: "category"; value: string }
  | { kind: "tag"; value: string };

type BlogFilterBarProps = {
  categories: string[];
  tags: string[];
  filter: BlogFilter;
  onChange: (f: BlogFilter) => void;
};

function pillActive(active: boolean) {
  return active
    ? "border-cyan-400/40 bg-cyan-400/[0.08] text-zinc-50"
    : "border-white/[0.1] bg-[#08080a]/60 text-zinc-400 hover:border-white/[0.14] hover:text-zinc-200";
}

export function BlogFilterBar({ categories, tags, filter, onChange }: BlogFilterBarProps) {
  return (
    <div className="mb-10 space-y-4">
      <div>
        <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-zinc-600">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onChange({ kind: "all" })}
            className={`rounded-full border px-3.5 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.08em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45 ${pillActive(filter.kind === "all")}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChange({ kind: "category", value: c })}
              className={`rounded-full border px-3.5 py-1.5 text-[0.72rem] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45 ${pillActive(filter.kind === "category" && filter.value === c)}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      {tags.length ? (
        <div>
          <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Tags
          </p>
          <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onChange({ kind: "tag", value: t })}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-[0.72rem] text-zinc-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45 ${pillActive(filter.kind === "tag" && filter.value === t)}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
