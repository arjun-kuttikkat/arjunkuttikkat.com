import { AKTerminalWindow } from "../../components/ak-terminal-window";
import type { Metadata } from "next";
import { defaultOgImage, siteName, siteKeywords } from "../../lib/site";

export const metadata: Metadata = {
  title: "Terminal",
  description:
    "A small command surface for the curious: a terminal-style route with limited commands, real typing, and a quick way to explore the site.",
  alternates: {
    canonical: "/terminal"
  },
  keywords: [...siteKeywords, "terminal", "interactive terminal", "command surface"],
  openGraph: {
    title: `Terminal | ${siteName}`,
    description:
      "A small command surface for the curious: a terminal-style route with limited commands, real typing, and a quick way to explore the site.",
    url: "/terminal",
    type: "website",
    images: [defaultOgImage]
  },
  twitter: {
    card: "summary_large_image",
    title: `Terminal | ${siteName}`,
    description:
      "A small command surface for the curious: a terminal-style route with limited commands, real typing, and a quick way to explore the site.",
    images: [defaultOgImage.url]
  }
};

export default function TerminalPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden pt-20 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_65%)]" />
        <div className="absolute inset-x-0 top-1/2 h-[min(46rem,140%)] -translate-y-1/2 bg-[radial-gradient(ellipse_58%_48%_at_50%_50%,rgba(34,211,238,0.08),transparent_62%),radial-gradient(ellipse_52%_42%_at_38%_56%,rgba(232,121,249,0.065),transparent_58%)] opacity-95" />
      </div>

      <section className="px-6 pb-14 sm:pb-16 lg:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <AKTerminalWindow context="route" className="w-full" />
        </div>
      </section>
    </main>
  );
}

