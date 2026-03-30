"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
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

const PROJECTS_HEADLINE =
  "Products built with distribution, monetization, and real use in mind.";

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

function EdgazeWorkflowVisual({ boosted }: { boosted: boolean }) {
  const d = boosted ? 7 : 14;
  const d2 = boosted ? 5.5 : 11;
  const d3 = boosted ? 6.2 : 12.5;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 top-[42%] z-0 overflow-hidden rounded-b-xl opacity-90 transition-opacity duration-300 group-hover/edgaze:opacity-100 md:top-[40%]"
      aria-hidden
    >
      <svg
        className="absolute inset-0 h-full w-full text-fuchsia-400/35"
        viewBox="0 0 400 140"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <path
          d="M 32 88 C 90 28, 150 28, 200 70 C 250 112, 310 112, 368 52"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeDasharray="6 10"
          className="[animation:edgaze-flow-dash_2.8s_linear_infinite]"
        />
        <path
          d="M 48 115 L 200 72 L 352 100"
          stroke="url(#edgaze-home-flow-grad)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="4 8"
          opacity={0.5}
          className="[animation:edgaze-flow-dash_3.4s_linear_infinite_reverse]"
        />
        <defs>
          <linearGradient id="edgaze-home-flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(192 132 252)" stopOpacity={0.2} />
            <stop offset="50%" stopColor="rgb(232 121 249)" stopOpacity={0.55} />
            <stop offset="100%" stopColor="rgb(34 211 238)" stopOpacity={0.25} />
          </linearGradient>
        </defs>
        <circle
          cx="32"
          cy="88"
          r="5"
          fill="rgb(24 24 27)"
          stroke="rgb(232 121 249 / 0.55)"
          strokeWidth="1.25"
          className="[animation:edgaze-node-pulse_2.4s_ease-in-out_infinite]"
        />
        <circle
          cx="200"
          cy="70"
          r="5.5"
          fill="rgb(24 24 27)"
          stroke="rgb(34 211 238 / 0.45)"
          strokeWidth="1.25"
          className="[animation:edgaze-node-pulse_2.4s_ease-in-out_infinite_0.5s]"
        />
        <circle
          cx="368"
          cy="52"
          r="5"
          fill="rgb(24 24 27)"
          stroke="rgb(232 121 249 / 0.55)"
          strokeWidth="1.25"
          className="[animation:edgaze-node-pulse_2.4s_ease-in-out_infinite_1s]"
        />
      </svg>

      <motion.span
        className="absolute left-[6%] top-[58%] max-w-[9rem] truncate rounded-full border border-fuchsia-400/30 bg-zinc-950/85 px-2.5 py-1 text-[10px] font-medium tracking-wide text-fuchsia-100/90 shadow-[0_0_24px_rgba(232,121,249,0.12)] backdrop-blur-sm"
        animate={{
          left: ["6%", "44%", "82%", "44%", "6%"],
          top: ["58%", "28%", "52%", "78%", "58%"],
        }}
        transition={{ duration: d, repeat: Infinity, ease: "easeInOut" }}
      >
        Workflow
      </motion.span>
      <motion.span
        className="absolute left-[78%] top-[42%] max-w-[8rem] truncate rounded-full border border-cyan-400/25 bg-zinc-950/85 px-2.5 py-1 text-[10px] font-medium tracking-wide text-cyan-100/85 shadow-[0_0_20px_rgba(34,211,238,0.1)] backdrop-blur-sm"
        animate={{
          left: ["78%", "40%", "12%", "48%", "78%"],
          top: ["42%", "18%", "62%", "72%", "42%"],
        }}
        transition={{ duration: d2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        Route
      </motion.span>
      <motion.span
        className="absolute left-[38%] top-[72%] max-w-[8rem] truncate rounded-full border border-fuchsia-400/22 bg-zinc-950/80 px-2.5 py-1 text-[10px] font-medium tracking-wide text-zinc-200/90 shadow-[0_0_18px_rgba(255,255,255,0.06)] backdrop-blur-sm"
        animate={{
          left: ["38%", "68%", "52%", "22%", "38%"],
          top: ["72%", "58%", "32%", "48%", "72%"],
        }}
        transition={{ duration: d3, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
      >
        Publish flow
      </motion.span>
    </div>
  );
}

function ProjectArticle({
  project,
  index,
  edgazeHovered,
  onEdgazeHover,
}: {
  project: Project;
  index: number;
  edgazeHovered: boolean;
  onEdgazeHover: (v: boolean) => void;
}) {
  const isEdgaze = project.slug === "edgaze";
  const isSiteProject = project.slug === "arjunkuttikkat-com";
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
        onHoverStart={() => isEdgaze && onEdgazeHover(true)}
        onHoverEnd={() => isEdgaze && onEdgazeHover(false)}
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

        {isEdgaze ? <EdgazeWorkflowVisual boosted={edgazeHovered} /> : null}

        <div className="relative z-10 flex flex-1 flex-col">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div
              className={
                isSiteProject
                  ? "relative shrink-0 h-12 w-12 sm:h-[3.25rem] sm:w-[3.25rem]"
                  : `relative shrink-0 overflow-hidden rounded-xl bg-black/50 ring-1 ring-inset ring-white/[0.1] ${isEdgaze ? "h-14 w-14" : "h-12 w-12 sm:h-[3.25rem] sm:w-[3.25rem]"}`
              }
            >
              <ProjectLogo
                project={project}
                className={
                  isSiteProject
                    ? "h-full w-full"
                    : "h-full w-full rounded-xl border-0 bg-transparent"
                }
                imageClassName={`object-contain p-0.5 ${project.hoverGlow} ${isEdgaze ? "transition-all duration-300 group-hover/edgaze:drop-shadow-[0_0_24px_rgba(232,121,249,0.65)]" : ""}`}
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
  const [edgazeHovered, setEdgazeHovered] = useState(false);

  return (
    <section id="projects" className="px-6 py-24 sm:py-28 lg:px-10 lg:py-32">
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12 max-w-3xl sm:mb-14 lg:mb-16"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">Projects</p>
          <SubtleTypeHeadline
            className={`${arTitleCard} text-[1.75rem] leading-[1.12] tracking-[-0.03em] text-white sm:text-3xl sm:leading-[1.1] lg:text-[2.125rem]`}
          />
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-[1fr_1fr_1fr] md:gap-4 md:min-h-[min(36rem,70vh)] lg:gap-5">
          {bentoProjects.map((project, index) => (
            <ProjectArticle
              key={project.slug}
              project={project}
              index={index}
              edgazeHovered={edgazeHovered}
              onEdgazeHover={setEdgazeHovered}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
