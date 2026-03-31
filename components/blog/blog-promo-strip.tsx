import Image from "next/image";
import { LeavingSiteLink } from "../leaving-site-link";

type BlogPromoStripProps = {
  showEdgazeMark?: boolean;
};

export function BlogPromoStrip({ showEdgazeMark = false }: BlogPromoStripProps) {
  return (
    <div className="mb-10 flex flex-col gap-3 rounded-lg border border-white/[0.07] bg-[#08080a]/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex items-start gap-3 sm:items-center">
        {showEdgazeMark ? (
          <span className="relative mt-0.5 h-8 w-8 shrink-0 overflow-hidden rounded-md border border-white/10 bg-black/40 sm:mt-0">
            <Image
              src="/edgaze-mark.png"
              alt="Edgaze"
              width={32}
              height={32}
              className="object-contain p-0.5"
            />
          </span>
        ) : null}
        <p className="text-[0.88rem] leading-snug text-zinc-400 sm:text-[0.9rem]">
          Some of my workflow experiments and monetizable AI builds live on{" "}
          <span className="text-zinc-200">Edgaze</span>—where I package ideas so people can actually
          run them.
        </p>
      </div>
      <LeavingSiteLink
        href="https://edgaze.ai"
        className="shrink-0 self-start rounded-md border border-white/14 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-zinc-100 transition-colors hover:border-cyan-400/35 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45 sm:self-center"
      >
        Explore Edgaze
      </LeavingSiteLink>
    </div>
  );
}
