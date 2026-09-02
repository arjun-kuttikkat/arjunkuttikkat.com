import Image from "next/image";
import Link from "next/link";
import { edgazeLinks, edgazeStages } from "../../lib/edgaze";
import { LeavingSiteLink } from "../leaving-site-link";
import { arTitleCard } from "../projects/archive-typography";
import { Reveal } from "../projects/detail/reveal";
import { buttonPrimary, textLink } from "../ui/button-styles";

/**
 * "Inside Edgaze" — one product surface, then the four stages a workflow moves through.
 * Static today; `edgazeStages` in lib/edgaze.ts is the seam where live data can replace it.
 */
export function InsideEdgazeSection() {
  return (
    <section id="edgaze" aria-labelledby="inside-edgaze-title" className="relative px-6 pb-24 pt-6 sm:pb-28 lg:px-10 lg:pb-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[30%] -z-10 h-[40rem] bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(232,121,249,0.05),transparent_62%),radial-gradient(ellipse_50%_40%_at_30%_40%,rgba(34,211,238,0.045),transparent_60%)]"
      />

      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="mb-3 text-xs font-medium tracking-[0.08em] text-zinc-400">Building now</p>
          <h2
            id="inside-edgaze-title"
            className={`${arTitleCard} max-w-3xl text-[1.75rem] leading-[1.12] tracking-[-0.03em] text-white sm:text-3xl sm:leading-[1.1] lg:text-[2.125rem]`}
          >
            Inside Edgaze
          </h2>
          <p className="mt-5 max-w-[38rem] text-pretty text-[1.05rem] leading-[1.75] text-zinc-400 sm:text-[1.125rem]">
            A published workflow is one unit. It is built on a canvas, executed by a hosted runtime, sold per run on a
            marketplace, and callable from a backend or an agent at the same price.
          </p>
        </Reveal>

        <Reveal className="mt-12 sm:mt-14">
          <figure>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/[0.09] bg-[#0a0a0c] shadow-[0_50px_130px_-60px_rgba(0,0,0,0.95)] sm:aspect-[21/9]">
              <Image
                src="/projects/edgaze/studio.webp"
                alt="Edgaze Workflow Studio with a simple three-block workflow on the canvas. Block library on the left, inspector on the right."
                fill
                sizes="(max-width: 1024px) 100vw, 1152px"
                className="object-cover object-[50%_36%] sm:object-[50%_30%]"
              />
              <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            <figcaption className="mt-4 text-[0.875rem] leading-[1.6] text-zinc-500">
              Workflow Studio. A template on the canvas: Input → LLM Chat → Output.
            </figcaption>
          </figure>
        </Reveal>

        <Reveal className="mt-14 sm:mt-16">
          <ol className="grid gap-y-10 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-8">
            {edgazeStages.map((stage, i) => (
              <li key={stage.id} className="relative border-t border-white/[0.12] pt-5">
                <span aria-hidden className="absolute -top-[3px] left-0 h-[5px] w-[5px] rounded-full bg-zinc-400" />
                <p className="text-[0.75rem] font-medium tracking-[0.16em] text-zinc-500">
                  <span className="tabular-nums text-zinc-600">{String(i + 1).padStart(2, "0")}</span>
                  <span className="ml-3 text-zinc-400">{stage.label}</span>
                </p>
                <h3 className="mt-3 text-[1.1rem] font-semibold tracking-[-0.015em] text-white">{stage.title}</h3>
                <p className="mt-2.5 text-pretty text-[0.95rem] leading-[1.7] text-zinc-400">{stage.detail}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-4">
          <LeavingSiteLink href={edgazeLinks.home} className={buttonPrimary}>
            Visit Edgaze
          </LeavingSiteLink>
          <Link href="/projects/edgaze" className={textLink}>
            View project
            <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
