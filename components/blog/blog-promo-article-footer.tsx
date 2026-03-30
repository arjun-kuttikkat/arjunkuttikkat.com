import Link from "next/link";

export function BlogPromoArticleFooter() {
  return (
    <footer className="mt-14 border-t border-white/[0.07] pt-10">
      <p className="max-w-xl text-[0.92rem] leading-relaxed text-zinc-500">
        Building AI workflows that people can actually open, run, and pay for? That is the problem
        space behind{" "}
        <Link
          href="/projects/edgaze"
          className="font-medium text-zinc-300 underline decoration-white/15 underline-offset-[0.2em] transition-colors hover:text-white hover:decoration-cyan-400/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
        >
          Edgaze
        </Link>
        .
      </p>
    </footer>
  );
}
