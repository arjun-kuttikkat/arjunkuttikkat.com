"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function AboutSection() {
  return (
    <section id="about" className="px-6 pb-28 pt-16 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto grid w-full max-w-6xl gap-7 rounded-[2rem] border border-white/10 bg-zinc-950/70 p-7 sm:p-9 md:grid-cols-[0.8fr_1.2fr]"
      >
        <div className="max-w-[14rem]">
          <div className="aspect-square overflow-hidden rounded-full border border-white/15 bg-zinc-900 p-2">
            <div className="relative h-full w-full overflow-hidden rounded-full">
              <Image
                src="/arjun-hero.webp"
                alt="Founder portrait"
                fill
                sizes="(max-width: 768px) 40vw, 224px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
        <div className="md:pt-4">
          <p className="mb-3 text-xs font-medium tracking-wide text-zinc-400">About</p>
          <p className="max-w-3xl text-lg leading-relaxed text-zinc-200 sm:text-xl">
            I grew up in a small town in Kerala and decided early I was not
            going to follow the normal path, so I started building instead and
            most of it failed, five YouTube channels with no traction and no
            signal, until I pushed hard enough to send over 700 messages in a
            single week just to see if anything I was doing actually mattered,
            the response proved there was real demand, but it also exposed a
            much harder problem that I am now dealing with…
          </p>
          <Link
            href="/about"
            className="mt-6 inline-flex items-center gap-2 text-[0.8125rem] font-semibold text-cyan-300/90 transition-colors hover:text-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
          >
            Read the full story
            <span aria-hidden>→</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
