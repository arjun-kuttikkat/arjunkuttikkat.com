"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { aboutClosingLine, aboutParagraphs } from "../../lib/about-content";
import type { BlogPostMeta } from "../../lib/blogs/types";
import { BlogCard } from "../blog/blog-card";
import { CalendlyBookButton } from "./calendly-book-button";

const easeOut = [0.22, 1, 0.36, 1] as const;

type AboutPageClientProps = {
  recentPosts: BlogPostMeta[];
};

export function AboutPageClient({ recentPosts }: AboutPageClientProps) {
  const reduceMotion = useReducedMotion();

  const stagger = reduceMotion ? 0 : 0.05;
  const childDuration = reduceMotion ? 0.01 : 0.52;

  return (
    <div className="relative">
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute -left-40 top-32 h-[28rem] w-[28rem] rounded-full bg-cyan-400/12 blur-[120px]"
          animate={
            reduceMotion
              ? undefined
              : { opacity: [0.28, 0.42, 0.28], x: [0, 12, 0], y: [0, -8, 0] }
          }
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -right-32 top-[18rem] h-[22rem] w-[22rem] rounded-full bg-fuchsia-500/10 blur-[100px]"
          animate={
            reduceMotion
              ? undefined
              : { opacity: [0.22, 0.38, 0.22], scale: [1, 1.06, 1] }
          }
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <motion.header
        className="relative mx-auto max-w-2xl px-4 sm:px-6 sm:pt-1"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: easeOut }}
      >
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:gap-10 sm:text-left">
          <motion.div
            className="relative shrink-0"
            whileHover={reduceMotion ? undefined : { scale: 1.02 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
          >
            <div className="relative h-[7.25rem] w-[7.25rem] sm:h-40 sm:w-40">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-300/35 via-white/15 to-fuchsia-300/35 p-[2px] shadow-[0_0_48px_-8px_rgba(34,211,238,0.25)]">
                <div className="relative h-full w-full overflow-hidden rounded-full bg-zinc-950 p-1.5">
                  <div className="relative h-full w-full overflow-hidden rounded-full">
                    <Image
                      src="/arjun-hero.webp"
                      alt="Arjun Kuttikkat"
                      fill
                        sizes="(max-width: 640px) 116px, 160px"
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="min-w-0 flex-1">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-cyan-300/75">
              About
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-blog-serif)] text-[1.75rem] font-medium leading-[1.1] tracking-[-0.035em] text-white sm:mt-3 sm:text-[2.35rem] sm:leading-[1.08] sm:tracking-[-0.04em]">
              Arjun Kuttikkat
            </h1>
            <p className="mt-3 text-[0.9375rem] leading-[1.55] text-zinc-400 sm:mt-4 sm:text-[1.02rem] sm:leading-relaxed">
              Founder, builder, and student of Robotics and AI, focused on infrastructure that holds up
              in the real world.
            </p>
          </div>
        </div>
      </motion.header>

      <motion.article
        className="mx-auto mt-6 max-w-2xl px-4 sm:mt-12 sm:px-6"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.08 }}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: stagger, delayChildren: 0.06 }
          }
        }}
      >
        {aboutParagraphs.map((text, i) => (
          <motion.p
            key={i}
            variants={{
              hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: childDuration, ease: easeOut }
              }
            }}
            className="mb-5 text-[1rem] leading-[1.62] text-zinc-300 last:mb-0 sm:mb-7 sm:text-[1.06rem] sm:leading-[1.78]"
          >
            {text}
          </motion.p>
        ))}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: reduceMotion ? 0 : 12 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: childDuration, ease: easeOut }
            }
          }}
          className="mt-8 border-l-2 border-cyan-400/45 pl-4 font-[family-name:var(--font-blog-serif)] text-[1.2rem] font-medium leading-snug tracking-[-0.03em] text-white sm:mt-12 sm:pl-6 sm:text-[1.55rem]"
        >
          {aboutClosingLine}
        </motion.p>
      </motion.article>

      <motion.section
        className="mx-auto mt-14 max-w-6xl px-4 sm:mt-28 sm:px-6"
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65, ease: easeOut }}
      >
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.1] bg-gradient-to-br from-[#0a0a0d] via-[#070708] to-[#0c0a10] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.5)] sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-[80px]" aria-hidden />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-cyan-400/10 blur-[90px]" aria-hidden />

          <div className="relative grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:items-center">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Edgaze
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-blog-serif)] text-[1.35rem] font-medium leading-tight tracking-[-0.03em] text-white sm:mt-3 sm:text-[1.75rem]">
                Building for creators who care about execution
              </h2>
              <p className="mt-3 text-[0.9375rem] leading-[1.55] text-zinc-400 sm:mt-4 sm:text-[0.98rem] sm:leading-relaxed">
                Edgaze is where the product work lives: distribution, systems, and the path from
                interest to something people rely on. If you want context before we talk, start here.
              </p>
              <Link
                href="/projects/edgaze"
                className="mt-5 inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-cyan-300/90 transition-colors hover:text-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45 sm:mt-7"
              >
                Explore Edgaze
                <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="relative rounded-2xl border border-white/[0.08] bg-black/35 p-5 backdrop-blur-md sm:p-8">
              <motion.div
                aria-hidden
                className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: easeOut, delay: 0.15 }}
              />
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-fuchsia-300/75">
                Creators
              </p>
              <p className="mt-3 text-[0.9375rem] leading-[1.55] text-zinc-200 sm:mt-4 sm:text-[1.02rem] sm:leading-relaxed">
                If you are a creator and would like to build with Edgaze, book a call and walk
                through what you are making, where you want leverage, and whether we should work
                together.
              </p>
              <CalendlyBookButton className="mt-5 w-full rounded-xl border border-[#0069ff]/50 bg-[#0069ff] px-6 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_16px_48px_rgba(0,105,255,0.3)] transition-all duration-300 hover:border-[#4d94ff] hover:bg-[#1a7cff] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0069ff]/55 sm:mt-8 sm:w-auto">
                Book a creator call
              </CalendlyBookButton>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="mx-auto mt-12 max-w-6xl px-4 pb-20 sm:mt-24 sm:px-6 sm:pb-28"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: easeOut }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div>
            <p className="text-[0.6875rem] font-medium tracking-wide text-zinc-500">Blogs</p>
            <h2 className="mt-2 font-[family-name:var(--font-blog-serif)] text-2xl font-medium tracking-[-0.03em] text-white sm:text-[1.85rem]">
              Recent posts
            </h2>
            <p className="mt-2 max-w-md text-[0.95rem] text-zinc-500">
              Longer notes on building, leverage, and what actually ships.
            </p>
          </div>
          <Link
            href="/blogs"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/12 bg-white/[0.03] px-4 py-2.5 text-[0.8125rem] font-semibold text-zinc-200 transition-all hover:border-white/22 hover:bg-white/[0.06] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
          >
            View all blogs
            <span aria-hidden>→</span>
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-white/[0.12] bg-[#08080a]/40 px-5 py-8 text-center text-[0.9375rem] text-zinc-500 sm:mt-10 sm:px-6 sm:py-12 sm:text-[0.95rem]">
            New posts land on the blogs page as they are ready.
            <Link
              href="/blogs"
              className="mt-3 block text-[0.8125rem] font-semibold text-cyan-300/90 hover:text-cyan-200"
            >
              Open blogs →
            </Link>
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {recentPosts.map((post, idx) => (
              <motion.div
                key={post.slug}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, ease: easeOut, delay: idx * 0.06 }}
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}
