"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useId, useRef } from "react";
import { AKTerminalWindow } from "./ak-terminal-window";
import { arTitleCard } from "./projects/archive-typography";

export function HomeTerminalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const labelId = useId();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.92", "end 0.08"],
  });

  const scaleRaw = useTransform(
    scrollYProgress,
    [0, 0.42, 0.58, 1],
    [0.965, 1, 1, 0.972],
  );
  const clarityRaw = useTransform(
    scrollYProgress,
    [0, 0.38, 0.62, 1],
    [0.88, 1, 1, 0.9],
  );

  const scale = useSpring(scaleRaw, {
    stiffness: 120,
    damping: 24,
    mass: 0.35,
  });
  const clarity = useSpring(clarityRaw, {
    stiffness: 100,
    damping: 22,
    mass: 0.32,
  });

  return (
    <section
      ref={sectionRef}
      id="terminal"
      aria-labelledby={labelId}
      className="relative px-6 pb-24 pt-10 sm:pb-28 sm:pt-12 lg:px-10 lg:pb-32"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[min(42rem,120%)] -translate-y-1/2 bg-[radial-gradient(ellipse_55%_45%_at_50%_50%,rgba(34,211,238,0.07),transparent_62%),radial-gradient(ellipse_50%_40%_at_40%_55%,rgba(232,121,249,0.06),transparent_58%)] opacity-90"
        aria-hidden
      />

      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10 max-w-3xl sm:mb-12"
        >
          <p
            id={labelId}
            className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400"
          >
            Terminal
          </p>
          <h2
            className={`${arTitleCard} text-[1.65rem] leading-[1.12] tracking-[-0.03em] text-white sm:text-3xl sm:leading-[1.1] lg:text-[2.05rem]`}
          >
            A small command surface for the curious.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-[0.9375rem]">
            Use the terminal to explore my projects, background, and links with
            simple built in commands.
          </p>
        </motion.div>

        <motion.div
          style={{
            scale: reduceMotion ? 1 : scale,
            opacity: reduceMotion ? 1 : clarity,
          }}
          className="mx-auto w-full will-change-transform"
        >
          <AKTerminalWindow context="home" showSuggestions className="w-full" />
        </motion.div>

      </div>
    </section>
  );
}
