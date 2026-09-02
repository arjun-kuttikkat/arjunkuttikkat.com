import Image from "next/image";
import type { ReactNode } from "react";
import { Reveal } from "./reveal";

/* ------------------------------------------------------------------------------------------------
 * Measures. One centered column for reading, a wider one for figures.
 * Typography is Inter throughout; hierarchy comes from size, weight, and colour only.
 * ---------------------------------------------------------------------------------------------- */

const READ = "mx-auto w-full max-w-[42rem]";
const WIDE = "mx-auto w-full max-w-[64rem]";

export const eyebrow = "text-[0.75rem] font-medium tracking-[0.06em] text-zinc-500";
export const lead = "text-pretty text-[1.15rem] leading-[1.7] text-zinc-300 sm:text-[1.3rem] sm:leading-[1.65]";
export const body = "text-pretty text-[1.0625rem] leading-[1.85] text-zinc-400 sm:text-[1.125rem]";
export const strong = "text-zinc-200";
/** Inline technical token — still Inter, distinguished by weight and colour, not a second typeface. */
export const token = "font-medium text-zinc-200";

export function Read({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`${READ} px-6 sm:px-8 ${className}`}>{children}</div>;
}

export function Wide({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`${WIDE} px-6 sm:px-8 ${className}`}>{children}</div>;
}

/* ------------------------------------------------------------------------------------------------
 * Section — a chapter. Eyebrow, title, then prose. Always centered, always the same rhythm.
 * ---------------------------------------------------------------------------------------------- */

export function Section({
  eyebrow: label,
  title,
  children,
  className = ""
}: {
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-16 sm:py-20 lg:py-24 ${className}`}>
      {label || title ? (
        <Read>
          <Reveal>
            {label ? <p className={eyebrow}>{label}</p> : null}
            {title ? (
              <h2 className="mt-4 text-pretty text-[1.9rem] font-semibold leading-[1.15] tracking-[-0.035em] text-white sm:text-[2.35rem] sm:leading-[1.12]">
                {title}
              </h2>
            ) : null}
          </Reveal>
        </Read>
      ) : null}
      <div className={label || title ? "mt-8 sm:mt-10" : ""}>{children}</div>
    </section>
  );
}

/** Body paragraph inside the reading column. */
export function P({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <Read className={className}>
      <Reveal>
        <p className={body}>{children}</p>
      </Reveal>
    </Read>
  );
}

/** Opening paragraph of a chapter — one step larger and lighter than body. */
export function Lead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <Read className={className}>
      <Reveal>
        <p className={lead}>{children}</p>
      </Reveal>
    </Read>
  );
}

/** A pulled-out sentence between paragraphs. Used sparingly, once or twice per page. */
export function Pull({ children }: { children: ReactNode }) {
  return (
    <Read className="my-14 sm:my-16">
      <Reveal>
        <p className="border-l border-white/20 pl-6 text-pretty text-[1.35rem] font-medium leading-[1.45] tracking-[-0.025em] text-white sm:pl-8 sm:text-[1.6rem]">
          {children}
        </p>
      </Reveal>
    </Read>
  );
}

/**
 * TL;DR — a solid black box directly under the hero. One line per chapter of the page,
 * so someone who will not read the whole record still gets the whole record.
 */
export function Tldr({ points }: { points: ReadonlyArray<string> }) {
  return (
    <Read className="pt-6 sm:pt-8">
      <Reveal>
        <div className="rounded-xl border border-white/[0.09] bg-black p-6 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.9)] sm:p-8">
          <p className={eyebrow}>TL;DR</p>
          <ul className="mt-5 space-y-3.5">
            {points.map((point) => (
              <li key={point} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-x-3">
                <span aria-hidden className="mt-[0.8em] h-px w-2.5 bg-zinc-600" />
                <span className="text-pretty text-[1rem] leading-[1.7] text-zinc-400">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Read>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Figure — real screenshots. Full-width inside the wide column, caption in the reading column.
 * ---------------------------------------------------------------------------------------------- */

type FigureProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: ReactNode;
  priority?: boolean;
  /** Show a region: wrapper takes `aspect`, image scales by `zoom` around `focus`. */
  crop?: { aspect: string; focus?: string; zoom?: number };
  sizes?: string;
  className?: string;
};

export function Figure({ src, alt, width, height, caption, priority, crop, sizes, className = "" }: FigureProps) {
  const frame =
    "overflow-hidden rounded-xl border border-white/[0.09] bg-[#0a0a0c] shadow-[0_40px_120px_-50px_rgba(0,0,0,0.9)]";

  return (
    <Wide className={`my-12 sm:my-16 ${className}`}>
      <Reveal>
        <figure>
          {crop ? (
            <div className={`${frame} relative`} style={{ aspectRatio: crop.aspect }}>
              <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes ?? "(max-width: 1024px) 100vw, 1024px"}
                priority={priority}
                className="object-cover"
                style={{
                  objectPosition: crop.focus ?? "50% 0%",
                  transform: crop.zoom ? `scale(${crop.zoom})` : undefined,
                  transformOrigin: crop.focus ?? "50% 0%"
                }}
              />
            </div>
          ) : (
            <div className={frame}>
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                sizes={sizes ?? "(max-width: 1024px) 100vw, 1024px"}
                priority={priority}
                className="h-auto w-full"
              />
            </div>
          )}
          {caption ? (
            <figcaption className="mx-auto mt-4 w-full max-w-[42rem] px-6 text-[0.875rem] leading-[1.65] text-zinc-500 sm:px-8">
              {caption}
            </figcaption>
          ) : null}
        </figure>
      </Reveal>
    </Wide>
  );
}

/** Two screenshots side by side on desktop, stacked on mobile. */
export function FigurePair({ children }: { children: ReactNode }) {
  return <div className="grid gap-0 sm:gap-0 lg:grid-cols-2 lg:[&>div]:my-0 lg:[&>div]:px-0">{children}</div>;
}

/* ------------------------------------------------------------------------------------------------
 * Structured lists. All centered in the reading column, all built from rows of type.
 * ---------------------------------------------------------------------------------------------- */

/** Label / value rows. Label above value on mobile, beside it from `sm`. */
export function Facts({ items }: { items: ReadonlyArray<{ label: string; value: ReactNode }> }) {
  return (
    <Read>
      <Reveal>
        <dl className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {items.map((item) => (
            <div key={item.label} className="grid gap-x-8 gap-y-1.5 py-5 sm:grid-cols-[9.5rem_minmax(0,1fr)]">
              <dt className="text-[0.875rem] leading-[1.6] text-zinc-500">{item.label}</dt>
              <dd className="text-pretty text-[1rem] leading-[1.7] text-zinc-300">{item.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Read>
  );
}

/** Numbered chapters within a chapter — hard parts, decisions. */
export function Numbered({ items }: { items: ReadonlyArray<{ title: string; body: ReactNode }> }) {
  return (
    <Read>
      <ol className="space-y-12">
        {items.map((item, i) => (
          <li key={item.title}>
            <Reveal>
              <p className="text-[0.8125rem] font-medium tabular-nums tracking-[0.12em] text-zinc-600">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-pretty text-[1.3rem] font-semibold leading-[1.3] tracking-[-0.025em] text-white sm:text-[1.45rem]">
                {item.title}
              </h3>
              <div className={`mt-4 ${body}`}>{item.body}</div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Read>
  );
}

/** An ordered sequence: numbered rail, title, one line each. Used for flows and lifecycles. */
export function Sequence({ steps }: { steps: ReadonlyArray<{ title: string; detail: string }> }) {
  return (
    <Read>
      <Reveal>
        <ol className="relative space-y-8 border-l border-white/[0.12] pl-7 sm:pl-8">
          {steps.map((step, i) => (
            <li key={step.title} className="relative">
              <span
                aria-hidden
                className="absolute -left-[calc(1.75rem+3.5px)] top-[0.6rem] h-[6px] w-[6px] rounded-full bg-zinc-500 sm:-left-[calc(2rem+3.5px)]"
              />
              <p className="text-[0.8125rem] font-medium tabular-nums tracking-[0.12em] text-zinc-600">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1.5 text-[1.0625rem] font-semibold tracking-[-0.015em] text-white">{step.title}</h3>
              <p className="mt-1.5 text-pretty text-[1rem] leading-[1.75] text-zinc-400">{step.detail}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </Read>
  );
}

/**
 * Architecture: layers stacked vertically down the centre with a connector between them.
 * Reads as one diagram on every screen size instead of four columns that collapse.
 */
export type ArchLayer = { title: string; note?: string; nodes: ReadonlyArray<{ name: string; detail?: string }> };

export function Architecture({ layers }: { layers: ArchLayer[] }) {
  return (
    <Read>
      <Reveal>
        <ol className="space-y-3">
          {layers.map((layer, i) => (
            <li key={layer.title}>
              {i > 0 ? (
                <div className="flex justify-center py-3" aria-hidden>
                  <svg width="10" height="16" viewBox="0 0 10 16" fill="none" className="text-zinc-700">
                    <path d="M5 0v12M1 8.5 5 13l4-4.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ) : null}
              <div className="rounded-xl border border-white/[0.09] bg-white/[0.02] px-5 py-5 sm:px-7 sm:py-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <p className="text-[0.875rem] font-semibold tracking-[-0.01em] text-white">{layer.title}</p>
                  {layer.note ? <p className="text-[0.8125rem] text-zinc-500">{layer.note}</p> : null}
                </div>
                <ul className="mt-4 divide-y divide-white/[0.06]">
                  {layer.nodes.map((node) => (
                    <li key={node.name} className="grid gap-x-6 gap-y-0.5 py-2.5 first:pt-0 last:pb-0 sm:grid-cols-[11rem_minmax(0,1fr)]">
                      <p className="text-[0.95rem] font-medium text-zinc-200">{node.name}</p>
                      {node.detail ? <p className="text-[0.9rem] leading-[1.6] text-zinc-500">{node.detail}</p> : null}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </Read>
  );
}

/** Reference rows: an identifier and what it does. Inter, aligned, no badges. */
export function Reference({
  rows,
  title
}: {
  rows: ReadonlyArray<{ key: string; keyPrefix?: string; note: string }>;
  title?: string;
}) {
  return (
    <Read>
      <Reveal>
        {title ? <p className={`${eyebrow} mb-4`}>{title}</p> : null}
        <ul className="divide-y divide-white/[0.07] border-y border-white/[0.08]">
          {rows.map((row) => (
            <li
              key={`${row.keyPrefix ?? ""}${row.key}`}
              className="grid gap-x-6 gap-y-1 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] sm:items-baseline"
            >
              <p className="text-[0.95rem] font-medium tracking-[-0.005em] text-zinc-100">
                {row.keyPrefix ? (
                  <span className="mr-2.5 inline-block w-[3rem] text-[0.75rem] font-semibold tracking-[0.06em] text-zinc-500">
                    {row.keyPrefix}
                  </span>
                ) : null}
                {row.key}
              </p>
              <p className="text-[0.9rem] leading-[1.6] text-zinc-500">{row.note}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </Read>
  );
}

/** Dated entries, newest last. */
export function Timeline({ items }: { items: ReadonlyArray<{ date: string; title: string; note: string }> }) {
  return (
    <Read>
      <Reveal>
        <ol className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {items.map((item) => (
            <li key={item.date} className="grid gap-x-8 gap-y-1 py-5 sm:grid-cols-[9.5rem_minmax(0,1fr)]">
              <p className="text-[0.875rem] tabular-nums text-zinc-500">{item.date}</p>
              <div>
                <p className="text-[1rem] font-medium text-white">{item.title}</p>
                <p className="mt-1 text-[0.95rem] leading-[1.65] text-zinc-500">{item.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </Read>
  );
}
