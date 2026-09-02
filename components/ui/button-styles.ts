/**
 * Site-wide CTA hierarchy. Three levels only:
 *   primary   — one per view, gradient border treatment already used by the hero
 *   secondary — neutral outline
 *   text      — inline link with arrow
 */
const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507]";

export const buttonPrimary = `${base} border border-cyan-300/50 bg-gradient-to-r from-cyan-300/22 to-fuchsia-300/22 px-5 py-2.5 text-white hover:border-cyan-200/80 hover:from-cyan-300/36 hover:to-fuchsia-300/36`;

export const buttonSecondary = `${base} border border-white/20 bg-white/[0.02] px-5 py-2.5 text-zinc-100 hover:border-white/40 hover:text-white`;

export const buttonSmall = `${base} border border-white/16 bg-white/[0.03] px-4 py-2 text-[0.8125rem] text-zinc-200 hover:border-white/30 hover:text-white`;

export const textLink =
  "inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-zinc-300 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45";
