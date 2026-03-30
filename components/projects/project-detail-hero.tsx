"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Project } from "../../lib/projects";
import { accentText } from "./accent-styles";

type ProjectDetailHeroProps = {
  project: Project;
  /** Extra content below the intro (e.g. Edgaze workflow diagram). */
  bottomSlot?: ReactNode;
};

const bodyClass =
  "text-pretty text-[1.0625rem] leading-[1.75] text-zinc-200 sm:text-[1.125rem] sm:leading-[1.72]";

export function ProjectDetailHero({ project, bottomSlot }: ProjectDetailHeroProps) {
  const logoPadding = project.slug === "arjunkuttikkat-com" ? "p-[6%]" : "p-[12%]";

  return (
    <div className="relative z-10 px-6 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative h-24 w-24 sm:h-28 sm:w-28"
        >
          <Image
            src={project.logo}
            alt={`${project.name} logo`}
            fill
            className={`object-contain ${logoPadding} ${project.hoverGlow}`}
            sizes="112px"
            priority
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
          className="mt-8 text-pretty text-3xl font-semibold tracking-[-0.035em] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.4)] sm:text-4xl"
        >
          {project.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
          className={`mt-4 max-w-md text-pretty text-lg font-medium leading-snug sm:text-xl ${accentText[project.accent]}`}
        >
          {project.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.11, ease: "easeOut" }}
          className={`${bodyClass} mt-8 max-w-[40rem] text-zinc-200`}
        >
          {project.shortDescription}
        </motion.p>

        {bottomSlot ? <div className="mt-14 w-full sm:mt-16">{bottomSlot}</div> : null}
      </div>
    </div>
  );
}
