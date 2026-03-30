"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { NewsletterSignup } from "./newsletter-signup";

const sectionEase = [0.22, 1, 0.36, 1] as const;

function SectionReveal({
  children,
  className = "",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 0.68, ease: sectionEase, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const previewCards = [
  {
    kicker: "Sometimes",
    title: "Validating before building",
    sample:
      "Sometimes it’s about validating before building.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    kicker: "Sometimes",
    title: "What breaks when users show up",
    sample:
      "Sometimes it’s what breaks when users show up.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    )
  },
  {
    kicker: "Sometimes",
    title: "Distribution that didn’t work at all",
    sample:
      "Sometimes it’s distribution that didn’t work at all.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    kicker: "Sometimes",
    title: "Interest didn’t turn into usage",
    sample:
      "Sometimes it’s where interest didn’t turn into actual usage.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )
  },
  {
    kicker: "No forced structure",
    title: "I write what’s worth writing",
    sample:
      "I don’t force structure. I write what’s worth writing.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

/** Same ambient treatment as the home `Hero` section: soft blurs, grid, line. Site body `#050507` + global radials show through. */
function NewsletterAmbient() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
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

function EditorialTile({
  card,
  index,
  featured = false
}: {
  card: (typeof previewCards)[number];
  index: number;
  featured?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.58, ease: sectionEase, delay: index * 0.07 }}
      whileHover={
        reduce
          ? undefined
          : { y: -6, transition: { duration: 0.4, ease: sectionEase } }
      }
      className={`group relative overflow-hidden rounded-[1.35rem] border border-white/[0.09] bg-[linear-gradient(152deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_16px_44px_rgba(0,0,0,0.36)] sm:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_70px_rgba(0,0,0,0.4)] backdrop-blur-none sm:backdrop-blur-xl transition-[border-color,box-shadow] duration-500 group-hover:border-cyan-300/35 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_0_1px_rgba(34,211,238,0.12),0_28px_70px_rgba(0,0,0,0.42)] sm:group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_0_1px_rgba(34,211,238,0.12),0_32px_90px_rgba(0,0,0,0.45),0_0_60px_rgba(34,211,238,0.1),0_0_80px_rgba(244,114,182,0.06)] ${
        featured ? "md:col-span-2 md:min-h-[17rem] lg:min-h-[18rem]" : "min-h-[15.5rem] sm:min-h-[16rem]"
      }`}
    >
      <div
        className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.22),transparent_68%)] opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.2),transparent_72%)] opacity-50 blur-3xl transition-opacity duration-500 group-hover:opacity-90"
        aria-hidden
      />
      <div className={`relative flex h-full flex-col p-8 sm:p-9 ${featured ? "md:flex-row md:items-stretch md:gap-10" : ""}`}>
        <div
          className={`flex shrink-0 items-center justify-center rounded-2xl border border-white/[0.12] bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-500 group-hover:border-cyan-300/30 group-hover:text-white ${
            featured ? "h-16 w-16 md:h-[4.5rem] md:w-[4.5rem]" : "mb-6 h-14 w-14"
          }`}
        >
          {card.icon}
        </div>
        <div className={`min-w-0 flex-1 ${featured ? "md:pt-1" : ""}`}>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-cyan-300/90">{card.kicker}</p>
          <h3
            className={`mt-3 font-semibold tracking-tight text-white ${
              featured ? "text-2xl leading-[1.15] sm:text-[1.85rem] lg:text-[2.1rem]" : "text-xl leading-snug sm:text-[1.4rem]"
            }`}
          >
            {card.title}
          </h3>
          <p
            className={`mt-5 text-pretty leading-relaxed text-zinc-400 transition-colors duration-300 group-hover:text-zinc-300 ${
              featured ? "max-w-2xl text-base sm:text-lg" : "text-[0.9375rem] sm:text-base"
            }`}
          >
            {card.sample}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export function NewsletterLanding() {
  const reduceMotion = useReducedMotion();
  const [first, ...restCards] = previewCards;

  return (
    <main className="relative min-h-screen overflow-x-hidden text-zinc-100">
      <NewsletterAmbient />

      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-[min(92svh,58rem)] flex-col items-center justify-center px-4 pb-20 pt-36 sm:px-6 sm:pb-28 sm:pt-44 lg:px-10 lg:pb-32 lg:pt-48">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 36 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: sectionEase }}
          className="relative z-[1] mx-auto flex w-full max-w-[76rem] flex-col items-center text-center"
        >
          <h1 className="max-w-[min(54rem,100%)] text-pretty text-[clamp(2.65rem,9.2vw,5.85rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-white">
            Work that held up.
          </h1>
          <p className="mx-auto mt-8 max-w-[min(38rem,100%)] text-pretty text-lg leading-[1.7] text-zinc-300 sm:mt-9 sm:text-xl sm:leading-[1.68] lg:max-w-[42rem] lg:text-[1.3rem] lg:leading-[1.65]">
            I build things, put them out, and see what actually happens.
            <br />
            <br />
            When something works or breaks in a way that teaches me something useful, I write about it here. Execution, distribution, and the parts that don’t go the way I expected.
            <br />
            <br />
            <Link
              href="/projects/edgaze"
              className="text-white underline decoration-cyan-400/40 underline-offset-[5px] transition-colors hover:decoration-cyan-300/70"
            >
              Edgaze
            </Link>{" "}
            shows up only when it matters.
          </p>

          {/* Form anchor */}
          <div className="relative mt-12 w-full max-w-[min(52rem,100%)] sm:mt-14 lg:mt-16 lg:max-w-[56rem]">
            <div
              className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-[radial-gradient(ellipse_70%_65%_at_50%_35%,rgba(255,255,255,0.08),transparent_68%)] blur-2xl sm:-inset-5 sm:rounded-[2.25rem]"
              aria-hidden
            />
            <div className="relative rounded-[1.55rem] border border-white/[0.09] bg-white/[0.03] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.42)] sm:shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-none sm:backdrop-blur-xl sm:rounded-[1.75rem] sm:p-7 lg:p-9">
              <NewsletterSignup variant="premium" signupLocation="newsletter_page" />
              <p className="mx-auto mt-7 max-w-lg text-center text-[0.8125rem] leading-relaxed text-zinc-500 sm:text-sm">
                From <span className="text-zinc-400">newsletters@arjunkuttikkat.com</span>
                <span className="text-zinc-600">. </span>Hosted on Brevo. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Continuous atmosphere stripe */}
      <div className="pointer-events-none relative h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden />

      {/* Why */}
      <section className="relative py-20 sm:py-28 lg:py-36">
        <div className="relative mx-auto grid w-full max-w-[76rem] gap-12 px-4 sm:gap-16 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.2fr)] lg:gap-20 lg:px-10">
          <SectionReveal className="lg:pt-2">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-pink-300/90">The point</p>
            <h2 className="mt-4 max-w-[14ch] text-[clamp(2.25rem,4.5vw,3.5rem)] font-semibold leading-[1.08] tracking-tight text-white">
              Why this exists
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-zinc-500">
              Most newsletters are written to keep a cadence going. This one isn’t.
              <br />
              <br />
              If you get an email from me, it means something actually happened that changed how I’d build or approach something. That’s the only filter.
              <br />
              <br />
              I’m not trying to sound smart or summarize ideas. I’m writing things I wish I had known a week earlier.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.06}>
            <div className="relative rounded-[1.35rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_100%)] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_54px_rgba(0,0,0,0.36)] sm:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_28px_80px_rgba(0,0,0,0.4)] backdrop-blur-none sm:backdrop-blur-md sm:p-10 lg:p-12">
              <div
                className="pointer-events-none absolute -right-20 top-1/2 h-[120%] w-48 -translate-y-1/2 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.04),transparent)] blur-2xl"
                aria-hidden
              />
              <div className="relative space-y-7 text-base leading-[1.78] text-zinc-300 sm:text-[1.0625rem] sm:leading-[1.75]">
                <p>
                  Email on a fixed cadence trains readers to skim. I refuse that trade. If my name hits your inbox, it means I sat down because there was a concrete
                  thread worth pulling, something that changed how I would ship, sell, or scope the next sprint.
                </p>
                <p>
                  Expect validation discipline before code, postmortems when users expose blind spots, and distribution notes grounded in attempts, not theory. When{" "}
                  <Link href="/projects/edgaze" className="text-white underline decoration-white/25 underline-offset-4 hover:decoration-cyan-400/50">
                    Edgaze
                  </Link>{" "}
                  matters to the story, it is in. When it does not, it stays out. No standing ovation section.
                </p>
                <p className="text-zinc-400">
                  If you want hype without stakes, unsubscribe. If you want a founder still filing receipts from the arena, stay.
                </p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Editorial tiles */}
      <section className="relative py-20 sm:py-28 lg:py-36">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden />
        <div className="relative mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-10">
          <SectionReveal className="max-w-3xl">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-cyan-300/90">What you&apos;ll get</p>
            <h2 className="mt-4 text-[clamp(2.1rem,4vw,3.25rem)] font-semibold tracking-tight text-white">
              What shows up here
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              Notes from building and trying to get real usage
              <br />
              Things that worked and why
              <br />
              Things that failed once people actually used them
              <br />
              Gaps between what people say and what they do
              <br />
              Decisions I would redo differently
              <br />
              <br />
              No templates. No recycled advice. Just what happened and what I took from it.
            </p>
          </SectionReveal>

          <div className="mt-14 grid gap-6 sm:gap-8 md:grid-cols-2">
            <EditorialTile card={first} index={0} featured />
            {restCards.map((card, i) => (
              <EditorialTile key={card.title} card={card} index={i + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Founder promise */}
      <section className="relative py-20 sm:py-28 lg:py-36">
        <div className="relative mx-auto max-w-[min(48rem,100%)] px-4 sm:px-6 lg:px-10">
          <SectionReveal>
            <div className="relative px-2 sm:px-4">
              <div
                className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-[radial-gradient(ellipse_at_50%_40%,rgba(255,255,255,0.06),transparent_68%)] blur-3xl"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.09] bg-[linear-gradient(165deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] px-8 py-14 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_22px_70px_rgba(0,0,0,0.38)] sm:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_32px_100px_rgba(0,0,0,0.4)] backdrop-blur-none sm:backdrop-blur-xl sm:rounded-[1.65rem] sm:px-12 sm:py-16">
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(ellipse_80%_100%_at_50%_0%,rgba(255,255,255,0.06),transparent_55%)]"
                  aria-hidden
                />
                <blockquote className="relative mx-auto max-w-[36rem] text-[clamp(1.5rem,3.8vw,2.15rem)] font-semibold leading-[1.2] tracking-tight text-white">
                  I don’t send often.
                  <br />
                  <br />
                  If there’s nothing useful to say, you won’t hear from me. If that changes, you should unsubscribe.
                </blockquote>
                <p className="relative mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Arjun</p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative pb-28 pt-6 sm:pb-36 sm:pt-10">
        <div className="relative mx-auto w-full max-w-[76rem] px-4 sm:px-6 lg:px-10">
          <SectionReveal>
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-white/[0.02] sm:rounded-[2rem]">
              <div
                className="pointer-events-none absolute left-1/2 top-0 h-[min(70%,24rem)] w-[min(120%,48rem)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_0%,rgba(34,211,238,0.07),rgba(244,114,182,0.06)_45%,transparent_68%)] blur-3xl"
                aria-hidden
              />
              <div className="relative border-t border-white/[0.06] bg-white/[0.02] px-6 py-14 backdrop-blur-none sm:backdrop-blur-2xl sm:px-12 sm:py-16 lg:px-16 lg:py-20">
                <div className="mx-auto max-w-3xl text-center">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-pink-300/90">Last step</p>
                  <h2 className="mt-5 text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.1] tracking-tight text-white">
                    If this sounds useful, stay.
                  </h2>
                  <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                    If not, no hard feelings.
                    <br />
                    <br />
                    Arjun
                  </p>
                </div>
                <div className="relative mx-auto mt-12 w-full max-w-[min(52rem,100%)] lg:mt-14 lg:max-w-[56rem]">
                  <div className="relative rounded-[1.5rem] border border-white/[0.09] bg-white/[0.03] p-5 backdrop-blur-none sm:backdrop-blur-xl sm:p-7 lg:p-8">
                    <NewsletterSignup variant="premium" signupLocation="newsletter_page" />
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
