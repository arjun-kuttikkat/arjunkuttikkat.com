"use client";

type ShowcaseProgressProps = {
  current: number;
  total: number;
};

export function ShowcaseProgress({ current, total }: ShowcaseProgressProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-center gap-1.5" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-white/70" : "w-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>
      <p className="text-[0.6875rem] font-medium tracking-[0.14em] text-zinc-600">
        {current + 1} / {total}
      </p>
    </div>
  );
}
