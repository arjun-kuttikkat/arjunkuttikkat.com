"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "../../lib/projects";
import { getProjectsHomeBento } from "../../lib/projects";
import { arTitleCard } from "./archive-typography";
import { ProjectLogo } from "./project-logo";

const bentoProjects = getProjectsHomeBento();

function gridPlacement(slug: string): string {
  switch (slug) {
    case "arjunkuttikkat-com":
      return "order-2 md:order-none md:col-start-1 md:row-start-1";
    case "aura":
      return "order-3 md:order-none md:col-start-1 md:row-start-2";
    case "autoresolve":
      return "order-4 md:order-none md:col-start-1 md:row-start-3";
    case "edgaze":
      return "order-1 md:order-none md:col-start-2 md:row-start-1 md:row-span-2";
    case "health-signal":
      return "order-5 md:order-none md:col-start-2 md:row-start-3";
    default:
      return "";
  }
}

const PROJECTS_HEADLINE = "One live product, this site, and three hackathon builds.";

function SubtleTypeHeadline({ className }: { className: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.35 });
  const reduceMotion = useReducedMotion() ?? false;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    if (count >= PROJECTS_HEADLINE.length) return;
    const t = window.setTimeout(() => setCount((c) => c + 1), 42);
    return () => clearTimeout(t);
  }, [inView, count, reduceMotion]);

  const done = reduceMotion || count >= PROJECTS_HEADLINE.length;
  const visible = reduceMotion ? PROJECTS_HEADLINE : PROJECTS_HEADLINE.slice(0, count);

  return (
    <div ref={containerRef} className="relative">
      <h2 className={`${className} invisible select-none`} aria-hidden>
        {PROJECTS_HEADLINE}
      </h2>
      <h2 className={`${className} absolute inset-0`} aria-label={PROJECTS_HEADLINE}>
        <span>{visible}</span>
        {!done ? (
          <span
            className="ml-px inline-block h-[0.82em] w-px translate-y-[0.06em] bg-zinc-500/50 align-baseline motion-safe:animate-[type-caret_1.1s_ease-in-out_infinite]"
            aria-hidden
          />
        ) : null}
      </h2>
    </div>
  );
}

/** Real Workflow Studio fragment, faded into the card. Replaces the earlier decorative pills. */
function EdgazeStudioFragment() {
  return (
    <div
      className="pointer-events-none absolute inset-x-5 bottom-0 top-[46%] z-0 overflow-hidden rounded-t-md border-x border-t border-white/[0.1] opacity-90 transition-[opacity,transform] duration-500 group-hover/edgaze:-translate-y-1 group-hover/edgaze:opacity-100 sm:inset-x-7 md:top-[38%]"
      aria-hidden
    >
      <Image
        src="/projects/edgaze/studio.webp"
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 560px"
        className="origin-top scale-[1.18] object-cover object-[50%_30%]"
      />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#07070b] via-[#07070b]/70 to-transparent" />
    </div>
  );
}

function ProjectArticle({ project, index }: { project: Project; index: number }) {
  const isEdgaze = project.slug === "edgaze";
  const placement = gridPlacement(project.slug);
  const groupName = isEdgaze ? "group/edgaze" : "group";

  const minHeights = isEdgaze
    ? "min-h-[22rem] md:min-h-0 md:h-full"
    : "min-h-[10.5rem] md:min-h-0";

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`block h-full min-h-0 ${placement} focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507]`}
    >
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, delay: index * 0.05, ease: "easeOut" }}
        whileHover={{ y: isEdgaze ? -5 : -3 }}
        className={`${groupName} relative flex h-full ${minHeights} flex-col overflow-hidden rounded-xl border border-white/[0.1] ${isEdgaze ? "" : "bg-black/70"} p-6 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-white/[0.18] sm:p-7 ${project.surfaceClass} ${isEdgaze ? "hover:border-cyan-300/30 hover:shadow-[0_0_52px_-14px_rgba(34,211,238,0.18),0_0_48px_-16px_rgba(232,121,249,0.2)]" : ""}`}
      >
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${isEdgaze ? "opacity-50 group-hover/edgaze:opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        >
          <div
            className={`absolute -left-20 -top-20 h-64 w-64 rounded-full blur-3xl ${project.hoverAuraA} ${isEdgaze ? "transition-transform duration-500 group-hover/edgaze:scale-110" : "transition-transform duration-500 group-hover:scale-105"}`}
          />
          <div
            className={`absolute -bottom-20 -right-20 h-64 w-64 rounded-full blur-3xl ${project.hoverAuraB} ${isEdgaze ? "transition-transform duration-500 group-hover/edgaze:scale-110" : "transition-transform duration-500 group-hover:scale-105"}`}
          />
        </div>

        {isEdgaze ? <EdgazeStudioFragment /> : null}

        <div className="relative z-10 flex flex-1 flex-col">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div
              className={`relative shrink-0 ${isEdgaze ? "h-14 w-14" : "h-12 w-12 sm:h-[3.25rem] sm:w-[3.25rem]"}`}
            >
              <ProjectLogo
                project={project}
                className="h-full w-full"
                imageClassName={`object-contain ${project.hoverGlow} ${isEdgaze ? "transition-all duration-300 group-hover/edgaze:drop-shadow-[0_0_24px_rgba(232,121,249,0.65)]" : ""}`}
                sizes={isEdgaze ? "56px" : "52px"}
              />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <h3 className={`${arTitleCard} text-lg leading-snug text-white sm:text-xl`}>
                {project.name}
              </h3>
              <p
                className={`mt-2 text-pretty text-sm leading-relaxed text-zinc-400 sm:text-[0.9375rem] sm:leading-relaxed ${isEdgaze ? "group-hover/edgaze:text-zinc-300" : "group-hover:text-zinc-300"}`}
              >
                {project.homeTeaser}
              </p>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="px-6 pb-24 pt-4 sm:pb-28 lg:px-10 lg:pb-32">
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12 flex flex-col gap-6 sm:mb-14 sm:flex-row sm:items-end sm:justify-between lg:mb-16"
        >
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-medium tracking-[0.08em] text-zinc-400">
              Projects
            </p>
            <SubtleTypeHeadline
              className={`${arTitleCard} text-[1.75rem] leading-[1.12] tracking-[-0.03em] text-white sm:text-3xl sm:leading-[1.1] lg:text-[2.125rem]`}
            />
          </div>
          <Link
            href="/projects"
            className="inline-flex shrink-0 items-center gap-1.5 text-[0.875rem] font-medium text-zinc-300 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
          >
            View all projects
            <span aria-hidden>→</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-[1fr_1fr_1fr] md:gap-4 md:min-h-[min(36rem,70vh)] lg:gap-5">
          {bentoProjects.map((project, index) => (
            <ProjectArticle key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
