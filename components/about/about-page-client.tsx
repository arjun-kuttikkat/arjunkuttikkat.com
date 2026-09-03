"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { aboutClosingLine, aboutParagraphs } from "../../lib/about-content";
import type { BlogPostMeta } from "../../lib/blogs/types";
import { BlogCard } from "../blog/blog-card";
import { LeavingSiteLink } from "../leaving-site-link";
import { buttonPrimary, textLink } from "../ui/button-styles";
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
        initial={false}
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
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="min-w-0 flex-1">
            <p className="text-[0.68rem] font-semibold tracking-[0.08em] text-cyan-300/75">
              About
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-blog-serif)] text-[1.75rem] font-medium leading-[1.1] tracking-[-0.035em] text-white sm:mt-3 sm:text-[2.35rem] sm:leading-[1.08] sm:tracking-[-0.04em]">
              Arjun Kuttikkat
            </h1>
            <p className="mt-3 text-[0.9375rem] leading-[1.55] text-zinc-400 sm:mt-4 sm:text-[1.02rem] sm:leading-relaxed">
              Founder of Edgaze. Robotics and AI student at University of Birmingham
              Dubai. Based in Dubai, from Kerala.
            </p>
          </div>
        </div>
      </motion.header>

      <motion.article
        className="mx-auto mt-6 max-w-2xl px-4 sm:mt-12 sm:px-6"
        initial={false}
        whileInView="show"
        viewport={{ once: true, amount: 0.08 }}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: stagger, delayChildren: 0.06 },
          },
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
                transition: { duration: childDuration, ease: easeOut },
              },
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
              transition: { duration: childDuration, ease: easeOut },
            },
          }}
          className="mt-8 border-l-2 border-cyan-400/45 pl-4 font-[family-name:var(--font-blog-serif)] text-[1.2rem] font-medium leading-snug tracking-[-0.03em] text-white sm:mt-12 sm:pl-6 sm:text-[1.55rem]"
        >
          {aboutClosingLine}
        </motion.p>
      </motion.article>

      <motion.section
        className="mx-auto mt-14 max-w-2xl px-4 sm:mt-24 sm:px-6"
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65, ease: easeOut }}
      >
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-6 sm:px-8 sm:py-8">
          <p className="text-[0.68rem] font-semibold tracking-[0.08em] text-zinc-500">
            Edgaze
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-blog-serif)] text-[1.35rem] font-medium leading-tight tracking-[-0.03em] text-white sm:text-[1.65rem]">
            Book a call
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-[1.55] text-zinc-400 sm:mt-4 sm:text-[0.98rem] sm:leading-relaxed">
            Edgaze is a live marketplace and hosted runtime for AI workflows. If you
            want to publish something on it, or just see whether it fits, book a
            15-minute intro.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <CalendlyBookButton className={buttonPrimary}>
              Book a call
            </CalendlyBookButton>
            <Link href="/projects/edgaze" className={textLink}>
              View project
              <span aria-hidden>→</span>
            </Link>
            <LeavingSiteLink href="https://edgaze.ai" className={textLink}>
              Visit Edgaze
              <span aria-hidden>↗</span>
            </LeavingSiteLink>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="mx-auto mt-12 max-w-6xl px-4 pb-20 sm:mt-24 sm:px-6 sm:pb-28"
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: easeOut }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div>
            <p className="text-[0.6875rem] font-medium tracking-wide text-zinc-500">
              Blogs
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-blog-serif)] text-2xl font-medium tracking-[-0.03em] text-white sm:text-[1.85rem]">
              Recent posts
            </h2>
            <p className="mt-2 max-w-md text-[0.95rem] text-zinc-500">
              Longer notes on building Edgaze and getting it used.
            </p>
          </div>
          <Link
            href="/blogs"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/12 bg-white/[0.03] px-4 py-2.5 text-[0.8125rem] font-semibold text-zinc-200 transition-all hover:border-white/22 hover:bg-white/[0.06] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
          >
            View all posts
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
              View all posts →
            </Link>
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {recentPosts.map((post, idx) => (
              <motion.div
                key={post.slug}
                initial={false}
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
