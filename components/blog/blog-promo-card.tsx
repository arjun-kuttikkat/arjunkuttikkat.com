import Link from "next/link";

export function BlogPromoCard() {
  return (
    <aside className="group/promo my-14 flex flex-col gap-3 border-y border-white/[0.08] py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
      <p className="max-w-xl text-[0.95rem] leading-relaxed text-zinc-400">
        Most of these posts come from building{" "}
        <span className="font-medium text-zinc-200">Edgaze</span>, a marketplace and hosted runtime
        for AI workflows.
      </p>
      <Link
        href="/projects/edgaze"
        className="inline-flex shrink-0 items-center gap-2 text-[0.72rem] font-semibold tracking-[0.16em] text-zinc-300 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
      >
        View project
        <span aria-hidden className="transition-transform duration-300 group-hover/promo:translate-x-1">
          →
        </span>
      </Link>
    </aside>
  );
}
