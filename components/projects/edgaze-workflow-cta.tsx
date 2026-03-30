"use client";

/** Primary contact CTA with controlled hover: slight lift + stronger glow, no bounce. */
export function EdgazeWorkflowCta() {
  return (
    <a
      href="mailto:hello@arjunkuttikkat.com"
      className="group relative mt-12 inline-flex items-center justify-center rounded-full border border-fuchsia-300/40 bg-fuchsia-500/[0.09] px-7 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgb(255_255_255/0.04),0_12px_40px_-16px_rgb(0_0_0/0.65)] transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out hover:-translate-y-px hover:border-fuchsia-300/60 hover:bg-fuchsia-500/[0.14] hover:shadow-[0_0_32px_-8px_rgb(217_70_239/0.42),0_14px_44px_-14px_rgb(0_0_0/0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-400/80"
    >
      Discuss Edgaze
    </a>
  );
}
