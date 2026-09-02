"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { textLink } from "./ui/button-styles";

export function AboutSection() {
  return (
    <section id="about" className="px-6 pb-24 pt-8 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto grid w-full max-w-6xl gap-10 border-t border-white/[0.08] pt-14 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:pt-16"
      >
        <div className="flex items-start gap-6 md:block">
          <div className="w-28 shrink-0 md:w-[13rem]">
            <div className="aspect-square overflow-hidden rounded-full border border-white/15 bg-zinc-900 p-1.5 md:p-2">
              <div className="relative h-full w-full overflow-hidden rounded-full">
                <Image
                  src="/arjun-hero.webp"
                  alt="Arjun Kuttikkat"
                  fill
                  sizes="(max-width: 768px) 112px, 208px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <div className="md:mt-6">
            <p className="text-xs font-medium tracking-[0.08em] text-zinc-400">About</p>
            <p className="mt-2 text-[0.95rem] leading-[1.6] text-zinc-300">
              Founder of Edgaze. Robotics and AI student in Dubai, from Kerala.
            </p>
          </div>
        </div>
        <div>
          <p className="max-w-3xl text-pretty text-lg leading-relaxed text-zinc-200 sm:text-xl">
            I grew up in a small town in Kerala and started building early. Most of it
            failed: five YouTube channels, no traction. At 18 I moved to Dubai,
            incorporated Edge Platforms, Inc., and started Edgaze. It is live and
            operating in production, and acquiring creators and buyers is most of what I
            do now.
          </p>
          <Link href="/about" className={`${textLink} mt-6`}>
            Read more
            <span aria-hidden>→</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
