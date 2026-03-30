import Link from "next/link";

export function BlogPromoCard() {
  return (
    <aside className="group/promo my-14 rounded-2xl border border-white/[0.09] bg-gradient-to-br from-cyan-400/[0.05] via-transparent to-fuchsia-400/[0.04] px-6 py-6 sm:px-8 sm:py-7">
      <p className="max-w-xl text-[0.95rem] leading-relaxed text-zinc-400">
        If you want to turn scattered AI prompts into workflows people can open, run, and pay for, that
        is what I am building with{" "}
        <span className="font-medium text-zinc-200">Edgaze</span>.
      </p>
      <Link
        href="/projects/edgaze"
        className="mt-4 inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-cyan-200/90 transition-colors hover:text-cyan-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
      >
        View Edgaze
        <span
          aria-hidden
          className="transition-transform duration-300 group-hover/promo:translate-x-1"
        >
          →
        </span>
      </Link>
    </aside>
  );
}
