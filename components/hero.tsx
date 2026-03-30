"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { LeavingSiteLink } from "./leaving-site-link";

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.5 },
  transition: { duration: 0.5, ease: "easeOut" as const }
};

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden px-6 pb-28 pt-16 sm:pb-40 sm:pt-28 lg:px-10"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[2%] top-[8%] h-[28rem] w-[36rem] max-w-[95vw] rounded-full bg-[radial-gradient(ellipse_72%_58%_at_50%_45%,rgba(34,211,238,0.07),rgba(232,121,249,0.05)_42%,transparent_68%)] blur-[100px]" />
        <div className="absolute left-[-12%] top-4 h-[38rem] w-[38rem] rounded-full bg-cyan-400/10 blur-[130px]" />
        <div className="absolute right-[-10%] top-12 h-[32rem] w-[32rem] rounded-full bg-fuchsia-500/8 blur-[120px]" />
        <div className="absolute left-[8%] top-20 h-[26rem] w-[26rem] rounded-full bg-white/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:62px_62px] [mask-image:radial-gradient(ellipse_80%_65%_at_45%_32%,black,transparent)]" />
        <div className="absolute left-[4%] top-[-12%] h-[130%] w-px rotate-[18deg] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-[0.88fr_1.12fr] md:items-start">
        <div className="relative space-y-8 md:pt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-6 top-[2.5rem] h-[20rem] w-[min(32rem,calc(100%+3rem))] rounded-full bg-[radial-gradient(ellipse_70%_55%_at_48%_42%,rgba(255,255,255,0.055),rgba(34,211,238,0.04)_38%,transparent_72%)] blur-[72px] md:-left-10 md:top-[3rem]"
          />
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="relative max-w-xl text-pretty text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.85rem] lg:leading-[1.06]"
          >
            <span className="block">
              Most AI workflows never get used
            </span>
            <span className="mt-3 block text-[1.35rem] font-medium leading-snug tracking-[-0.015em] text-zinc-400 sm:mt-3.5 sm:text-2xl lg:text-[1.65rem]">
              I’m building what makes them runnable, usable, and worth paying for
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="max-w-[30rem] text-base leading-relaxed text-zinc-300 sm:text-lg"
          >
            AI workflows, monetization, distribution, and internet products
            built for real use.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="flex flex-wrap items-center gap-4 pt-1"
          >
            <LeavingSiteLink
              href="https://edgaze.ai"
              className="rounded-full border border-cyan-300/50 bg-gradient-to-r from-cyan-300/22 to-fuchsia-300/22 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-cyan-200/80 hover:from-cyan-300/38 hover:to-fuchsia-300/38"
            >
              Explore Edgaze
            </LeavingSiteLink>
            <Link
              href="/projects"
              className="rounded-full border border-white/20 bg-white/[0.02] px-5 py-2.5 text-sm font-semibold text-zinc-100 transition-colors hover:border-white/40 hover:text-white"
            >
              View Projects
            </Link>
          </motion.div>

        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-sm md:mr-[-4.5rem] md:mt-[84px] md:max-w-[28rem]"
        >
          <div className="absolute -inset-20 bg-[radial-gradient(circle_at_45%_35%,rgba(34,211,238,0.24),transparent_52%),radial-gradient(circle_at_75%_65%,rgba(232,121,249,0.2),transparent_48%)] blur-2xl" />
          <div className="relative mx-auto aspect-[4/5] w-[19rem] overflow-hidden rounded-[2.6rem] bg-transparent sm:w-[22.8rem]">
            <div className="pointer-events-none absolute inset-0 rounded-[2.4rem] ring-1 ring-white/12" />
            <div className="pointer-events-none absolute left-[7%] top-[4%] h-[92%] w-[88%] rounded-[2.2rem] bg-[linear-gradient(140deg,rgba(255,255,255,0.13),rgba(255,255,255,0)_38%)]" />
            <div className="absolute inset-2 overflow-hidden rounded-[2.3rem]">
              <Image
                src="/arjun-hero.webp"
                alt="Arjun Kuttikkat"
                fill
                sizes="(max-width: 768px) min(90vw, 23rem), (max-width: 1024px) 22.8rem, 28rem"
                className="scale-[1.13] object-cover object-[center_22%]"
                priority
                loading="eager"
              />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
