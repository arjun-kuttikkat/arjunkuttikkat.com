"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { NewsletterSignup } from "./newsletter-signup";

const sectionEase = [0.22, 1, 0.36, 1] as const;

const topics = [
  "What shipped on Edgaze and what it changed",
  "What broke once people used it, and the fix",
  "Distribution attempts, including the ones that did nothing",
  "Decisions I would make differently"
];

const facts = [
  { label: "Frequency", value: "Occasional. Only when there is something to report." },
  { label: "From", value: "newsletters@arjunkuttikkat.com" },
  { label: "Delivery", value: "Brevo. One click to unsubscribe." }
];

/** Same ambient treatment as the home `Hero` section: soft blurs, grid, line. */
function NewsletterAmbient() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 opacity-95"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 70% 55% at 18% 18%, rgba(34,211,238,0.10), transparent 62%)",
            "radial-gradient(ellipse 62% 52% at 86% 22%, rgba(244,114,182,0.10), transparent 60%)",
            "radial-gradient(ellipse 60% 50% at 28% 28%, rgba(255,255,255,0.06), transparent 64%)",
            "linear-gradient(to right, rgba(255,255,255,0.028) 1px, transparent 1px)",
            "linear-gradient(to bottom, rgba(255,255,255,0.022) 1px, transparent 1px)"
          ].join(","),
          backgroundSize: ["auto", "auto", "auto", "62px 62px", "62px 62px"].join(","),
          maskImage: "radial-gradient(ellipse 80% 65% at 45% 32%, black, transparent)"
        }}
      />
      <div className="absolute left-[4%] top-[-12%] h-[130%] w-px rotate-[18deg] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
    </div>
  );
}

export function NewsletterLanding() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="relative min-h-screen overflow-x-hidden text-zinc-100">
      <NewsletterAmbient />
      <Navbar />

      <section className="relative px-6 pb-20 pt-36 sm:pb-24 sm:pt-44 lg:px-10 lg:pt-48">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: sectionEase }}
          className="mx-auto w-full max-w-6xl"
        >
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-20">
            <div>
              <p className="text-xs font-medium tracking-[0.08em] text-zinc-400">Newsletter</p>
              <h1 className="mt-4 max-w-[12ch] text-pretty text-[clamp(2.5rem,7vw,4.75rem)] font-semibold leading-[1] tracking-[-0.04em] text-white">
                Notes from building Edgaze.
              </h1>
              <p className="mt-7 max-w-[34rem] text-pretty text-lg leading-[1.65] text-zinc-300 sm:text-xl sm:leading-[1.6]">
                An email when something happened that changed how I build, sell, or run{" "}
                <Link
                  href="/projects/edgaze"
                  className="text-white underline decoration-cyan-400/40 underline-offset-[5px] transition-colors hover:decoration-cyan-300/70"
                >
                  Edgaze
                </Link>
                . Not on a schedule.
              </p>

              <ul className="mt-10 max-w-[34rem] divide-y divide-white/[0.08] border-y border-white/[0.08]">
                {topics.map((t) => (
                  <li key={t} className="py-3.5 text-[0.95rem] leading-[1.6] text-zinc-300">
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:pt-12">
              <div className="relative">
                <div
                  className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-[radial-gradient(ellipse_70%_65%_at_50%_35%,rgba(255,255,255,0.07),transparent_68%)] blur-2xl sm:-inset-5"
                  aria-hidden
                />
                <div className="relative rounded-[1.5rem] border border-white/[0.09] bg-white/[0.03] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.42)] backdrop-blur-none sm:rounded-[1.75rem] sm:p-7 sm:backdrop-blur-xl">
                  <NewsletterSignup variant="premium" signupLocation="newsletter_page" />
                </div>
              </div>

              <dl className="mt-8 divide-y divide-white/[0.08] border-y border-white/[0.08]">
                {facts.map((f) => (
                  <div key={f.label} className="grid gap-x-6 py-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
                    <dt className="text-[0.8125rem] text-zinc-500">{f.label}</dt>
                    <dd className="text-[0.875rem] leading-[1.55] text-zinc-300">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
