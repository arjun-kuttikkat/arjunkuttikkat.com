"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Project } from "../../lib/projects";
import { accentText } from "./accent-styles";

type RelatedProjectsProps = {
  projects: Project[];
  /** Edgaze detail: subtle lift + soft glow on row hover. */
  variant?: "default" | "edgaze";
};

export function RelatedProjects({ projects, variant = "default" }: RelatedProjectsProps) {
  if (projects.length === 0) return null;

  const rowClass =
    variant === "edgaze"
      ? "group block rounded-lg py-6 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-px hover:shadow-[0_0_28px_-12px_rgb(217_70_239/0.22)]"
      : "block py-6 transition-colors hover:text-white";

  return (
    <section className="border-t border-white/10 px-6 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-xl">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          className="text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl"
        >
          Related projects
        </motion.h2>
        <ul className="mt-10 flex flex-col divide-y divide-white/10">
          {projects.map((p, i) => (
            <motion.li
              key={p.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/projects/${p.slug}`} className={rowClass}>
                <span className="block text-lg font-semibold text-white">{p.name}</span>
                <span className={`mt-2 block text-[1.0625rem] leading-snug ${accentText[p.accent]}`}>
                  {p.tagline}
                </span>
                <span className="mt-2 block text-[0.9375rem] leading-relaxed text-zinc-200">{p.shortDescription}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
