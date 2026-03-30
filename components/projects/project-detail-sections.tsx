"use client";

import { motion } from "framer-motion";
import type { Project } from "../../lib/projects";
import { accentText } from "./accent-styles";

const edgazeEase = [0.22, 1, 0.36, 1] as const;

/** Mount-only motion avoids scroll-linked IntersectionObservers (jank while scrolling). */
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: "easeOut" as const }
});

const edgazeSection = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.52, delay, ease: edgazeEase }
});

const edgazeHeading = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.48, delay: delay + 0.04, ease: edgazeEase }
});

const edgazeBody = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: delay + 0.14, ease: edgazeEase }
});

const sectionTitle = "text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl";

const body =
  "text-pretty text-[1.0625rem] leading-[1.75] text-zinc-200 sm:text-[1.125rem] sm:leading-[1.72] max-w-[42rem]";

type ProjectDetailSectionsProps = {
  project: Project;
  /** Edgaze: calmer staggered fade + slide for heading then copy. */
  scrollVariant?: "default" | "edgaze";
};

export function ProjectDetailSections({ project, scrollVariant = "default" }: ProjectDetailSectionsProps) {
  const stackLine = project.tech.join(" · ");
  const isEdgaze = scrollVariant === "edgaze";

  return (
    <div className="mx-auto max-w-xl px-6 pb-20 sm:px-8 sm:pb-28">
      {isEdgaze ? (
        <>
          <motion.section {...edgazeSection(0)} className="border-t border-white/10 pt-16 sm:pt-20">
            <motion.h2 {...edgazeHeading(0)} className={sectionTitle}>
              Overview
            </motion.h2>
            <motion.div {...edgazeBody(0)} className="mt-6">
              <p className={body}>{project.overview}</p>
            </motion.div>
          </motion.section>

          <motion.section {...edgazeSection(0.02)} className="mt-16 border-t border-white/10 pt-16 sm:mt-20 sm:pt-20">
            <motion.h2 {...edgazeHeading(0.02)} className={sectionTitle}>
              Background
            </motion.h2>
            <motion.div {...edgazeBody(0.02)} className="mt-6 space-y-6">
              <p className={body}>{project.problem}</p>
              <p className={body}>{project.solution}</p>
            </motion.div>
          </motion.section>

          <motion.section {...edgazeSection(0.04)} className="mt-16 border-t border-white/10 pt-16 sm:mt-20 sm:pt-20">
            <motion.h2 {...edgazeHeading(0.04)} className={sectionTitle}>
              Where it stands
            </motion.h2>
            <motion.div {...edgazeBody(0.04)} className="mt-6">
              <p className={body}>{project.outcome}</p>
            </motion.div>
          </motion.section>

          <motion.section {...edgazeSection(0.06)} className="mt-16 border-t border-white/10 pt-16 sm:mt-20 sm:pt-20">
            <motion.h2 {...edgazeHeading(0.06)} className={sectionTitle}>
              Stack
            </motion.h2>
            <motion.div {...edgazeBody(0.06)} className="mt-6">
              <p className={body}>{stackLine}</p>
            </motion.div>
          </motion.section>
        </>
      ) : (
        <>
          <motion.section {...fade(0)} className="border-t border-white/10 pt-16 sm:pt-20">
            <h2 className={sectionTitle}>Overview</h2>
            <p className={`${body} mt-6`}>{project.overview}</p>
          </motion.section>

          <motion.section {...fade(0.03)} className="mt-16 border-t border-white/10 pt-16 sm:mt-20 sm:pt-20">
            <h2 className={sectionTitle}>Background</h2>
            <p className={`${body} mt-6`}>{project.problem}</p>
            <p className={`${body} mt-6`}>{project.solution}</p>
          </motion.section>

          <motion.section {...fade(0.05)} className="mt-16 border-t border-white/10 pt-16 sm:mt-20 sm:pt-20">
            <h2 className={sectionTitle}>Where it stands</h2>
            <p className={`${body} mt-6`}>{project.outcome}</p>
          </motion.section>

          <motion.section {...fade(0.07)} className="mt-16 border-t border-white/10 pt-16 sm:mt-20 sm:pt-20">
            <h2 className={sectionTitle}>Stack</h2>
            <p className={`${body} mt-6`}>{stackLine}</p>
          </motion.section>
        </>
      )}

      {project.links.length > 0 ? (
        <motion.section
          {...(isEdgaze ? edgazeSection(0.08) : fade(0.09))}
          className="mt-16 border-t border-white/10 pt-16 sm:mt-20 sm:pt-20"
        >
          {isEdgaze ? (
            <>
              <motion.h2 {...edgazeHeading(0.08)} className={sectionTitle}>
                Links
              </motion.h2>
              <motion.ul {...edgazeBody(0.08)} className="mt-6 flex flex-col gap-4">
                {project.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 text-[1.0625rem] font-medium transition-opacity hover:opacity-90 ${accentText[project.accent]}`}
                    >
                      {link.label}
                      <span aria-hidden>↗</span>
                    </a>
                  </li>
                ))}
              </motion.ul>
            </>
          ) : (
            <>
              <h2 className={sectionTitle}>Links</h2>
              <ul className="mt-6 flex flex-col gap-4">
                {project.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 text-[1.0625rem] font-medium transition-opacity hover:opacity-90 ${accentText[project.accent]}`}
                    >
                      {link.label}
                      <span aria-hidden>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </motion.section>
      ) : null}
    </div>
  );
}
