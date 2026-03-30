"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Footer } from "../footer";
import { Navbar } from "../navbar";
import type { Project } from "../../lib/projects";
import { ProjectDetailAurora } from "./project-detail-aurora";

type SiteProjectPageProps = {
  project: Project;
};

type ParagraphSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  align?: "left" | "right";
  delay?: number;
};

const sections: ParagraphSectionProps[] = [
  {
    eyebrow: "Intent",
    title: "A corner of the internet with one job: clarity.",
    body:
      "arjunkuttikkat.com is my corner of the internet, built to present what I am actually building with clarity and intent. This is not a portfolio. It is the place I send people when they want to understand what I am working on, how I think about products, and what exists beyond short messages or surface-level introductions. Everything here is deliberate, from the structure and hierarchy to the writing itself, because the point is to make the work land cleanly without extra explanation.",
    delay: 0.02
  },
  {
    eyebrow: "The problem",
    title: "Context was always being rebuilt from scratch.",
    body:
      "The problem was obvious. Every conversation required context, and that context was scattered. A project link here, a half-updated write-up there, something buried in messages. Even when the work was real, the representation felt fragmented, and fragmentation makes everything look weaker than it is. There was no single place that held the work with enough structure to be trustworthy at a glance.",
    align: "right",
    delay: 0.05
  },
  {
    eyebrow: "The system",
    title: "Everything lives in one surface, not a dozen places.",
    body:
      "This site fixes that by bringing everything into one system. Projects, writing, and updates are structured so someone can land here and immediately understand what I am building, then go deeper if they want. It is designed to remove friction. No searching, no guessing, and no unnecessary layers between the work and the person looking at it. The goal is to compress time-to-understanding without compressing the substance.",
    delay: 0.08
  },
  {
    eyebrow: "Design",
    title: "Credibility comes from hierarchy, not decoration.",
    body:
      "The design is built to feel intentional and credible. It carries visual weight, sharp typography, and controlled motion that guides attention instead of distracting from it. Every section is placed to support clarity, not aesthetic theater, and the interface is tuned to feel calm, premium, and precise. The goal is not to impress with visuals alone. It is to make the work itself read better and feel more dependable.",
    align: "right",
    delay: 0.11
  },
  {
    eyebrow: "Engineering",
    title: "Fast, stable, and flexible as the work evolves.",
    body:
      "Under the hood, it is built to stay fast and stable while supporting flexibility as things evolve. Next.js with TypeScript provides structure, Tailwind gives precise control over the interface, Framer Motion is used only where interaction adds meaning, and Vercel keeps deployment clean. The stack is chosen for control and speed, not for show, because the job of the site is to stay reliable while the content and projects change underneath it.",
    delay: 0.14
  },
  {
    eyebrow: "Now",
    title: "It stays current because it reflects what is happening now.",
    body:
      "This is not a static site. It changes as the work changes. Projects are refined, replaced, or removed. Writing only goes up when there is something real to say. The site is meant to reflect what is happening now, not what looked good in the past, which is why it is structured like a living surface instead of a permanent archive of highlights.",
    align: "right",
    delay: 0.17
  },
  {
    eyebrow: "Use",
    title: "The default link I send, because it works under pressure.",
    body:
      "This is the default link I send now. Whether it is a founder, investor, collaborator, or someone coming from a random message, this is the fastest way to understand what I am doing without wasting time. If someone leaves with a clear understanding in under a minute, it is doing exactly what it was built for.",
    delay: 0.2
  }
];

const stackGroups = [
  {
    title: "Core Framework",
    items: ["Next.js", "React", "TypeScript"]
  },
  {
    title: "UI & Motion",
    items: ["Tailwind CSS", "Framer Motion"]
  },
  {
    title: "Content",
    items: ["MDX pipeline", "Syntax highlighting", "Structured metadata"]
  },
  {
    title: "Deployment",
    items: ["Vercel", "Edge-friendly build", "Continuous deployment"]
  }
] as const;

function sectionReveal(reduced: boolean, delay = 0) {
  if (reduced) {
    return {
      initial: false,
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.2 },
      transition: { duration: 0 }
    };
  }

  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: {
      duration: 0.68,
      delay,
      ease: [0.22, 1, 0.36, 1] as const
    }
  };
}

function panelClassName(align: "left" | "right" = "left") {
  return [
    "group relative overflow-hidden rounded-[2rem] border border-white/10",
    "bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]",
    "px-6 py-7 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl",
    "sm:px-8 sm:py-9",
    align === "right" ? "ml-auto max-w-[49rem]" : "max-w-[52rem]"
  ].join(" ");
}

function SiteEdges() {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent" />
      <div className="pointer-events-none absolute inset-y-10 left-0 w-px bg-gradient-to-b from-transparent via-white/14 to-transparent" />
      <div className="pointer-events-none absolute inset-y-10 right-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute -right-14 top-10 h-32 w-32 rounded-full bg-cyan-400/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute -left-12 bottom-8 h-24 w-24 rounded-full bg-sky-300/[0.06] blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(255 255 255 / 0.45) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(255 255 255 / 0.45) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px"
        }}
      />
    </>
  );
}

function ParagraphSection({ eyebrow, title, body, align = "left", delay = 0 }: ParagraphSectionProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.section {...sectionReveal(reduced, delay)} className={panelClassName(align)}>
      <SiteEdges />
      <div className="relative z-10">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">{eyebrow}</p>
        <h2 className="mt-4 max-w-3xl text-balance text-[1.65rem] font-semibold tracking-[-0.035em] text-white sm:text-[2rem]">
          {title}
        </h2>
        <p className="mt-6 max-w-[42rem] text-pretty text-[1.02rem] leading-[1.92] text-zinc-300 sm:text-[1.1rem]">
          {body}
        </p>
      </div>
    </motion.section>
  );
}

export function SiteProjectPage({ project }: SiteProjectPageProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <main className="relative min-h-screen overflow-hidden pt-20 sm:pt-24">
      <ProjectDetailAurora mode="accent" accent="cyan" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[6] h-[46rem] bg-[radial-gradient(74rem_30rem_at_18%_6%,rgba(34,211,238,0.10),transparent_60%),radial-gradient(62rem_24rem_at_86%_-4%,rgba(56,189,248,0.08),transparent_58%)]"
      />

      <div className="relative z-10">
        <Navbar projectNav={{ title: project.name }} />

        <section className="px-6 pb-10 pt-12 sm:px-8 sm:pb-14 sm:pt-16">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(22rem,0.88fr)] lg:items-stretch">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.02))] px-6 py-8 shadow-[0_32px_120px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:px-8 sm:py-10 lg:px-10 lg:py-12"
            >
              <SiteEdges />
              <div className="relative z-10">
                <div className="relative h-24 w-24 sm:h-28 sm:w-28">
                  <Image
                    src={project.logo}
                    alt={`${project.name} logo`}
                    fill
                    sizes="112px"
                    className="object-contain p-[4%]"
                    priority
                  />
                </div>

                <h1 className="mt-7 text-balance text-[2.6rem] font-semibold tracking-[-0.065em] text-white sm:text-[3.2rem] lg:text-[3.5rem]">
                  arjunkuttikkat.com
                </h1>

                <p className="mt-4 max-w-2xl text-pretty text-[1.1rem] font-medium leading-[1.55] text-zinc-100 sm:text-[1.25rem]">
                  My corner of the internet, built to present what I am actually building with clarity and intent.
                </p>

                <p className="mt-8 max-w-[44rem] text-pretty text-[1.04rem] leading-[1.95] text-zinc-300 sm:text-[1.12rem]">
                  This is the place I send people when they want to understand what I am working on, how I think about products, and what exists beyond short messages or surface-level introductions. The point is to carry the work with enough structure and visual weight that it reads as real, not scattered, and to make understanding fast without making the work feel simplified.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.018))] px-6 py-7 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:px-8 sm:py-8"
            >
              <SiteEdges />
              <div className="relative z-10 flex h-full flex-col">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">Structure</p>
                <div className="mt-7 rounded-[1.6rem] border border-white/10 bg-black/24 px-5 py-6 sm:px-6">
                  <p className="text-pretty text-[0.98rem] leading-[1.85] text-zinc-300 sm:text-[1.03rem]">
                    The interface is built to reduce friction under real usage: projects are legible first, writing is optional depth, and updates only exist when there is something concrete. The job is not to decorate the work, but to make it easier to understand and easier to trust.
                  </p>
                </div>
                <p className="mt-7 text-pretty text-[0.98rem] leading-[1.88] text-zinc-300 sm:mt-8 sm:text-[1.03rem]">
                  When someone arrives from a DM, an intro, or a cold link, the structure does the work the conversation used to do.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-6 pb-24 sm:px-8 sm:pb-32">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:gap-10">
            {sections.map((section) => (
              <ParagraphSection key={section.title} {...section} />
            ))}

            <motion.section {...sectionReveal(reduced, 0.23)} className={panelClassName("right")}>
              <SiteEdges />
              <div className="relative z-10">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">Stack</p>
                <h2 className="mt-4 text-balance text-[1.65rem] font-semibold tracking-[-0.035em] text-white sm:text-[2rem]">
                  The stack is chosen for control, speed, and stability.
                </h2>
                <div className="mt-9 grid gap-6 sm:gap-7">
                  {stackGroups.map((group) => (
                    <div
                      key={group.title}
                      className="rounded-[1.6rem] border border-white/10 bg-white/[0.02] px-5 py-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)] backdrop-blur-md sm:px-6 sm:py-6"
                    >
                      <p className="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-zinc-400">
                        {group.title}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {group.items.map((item) => (
                          <motion.span
                            key={item}
                            whileHover={reduced ? undefined : { y: -2 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.02))] px-4 py-2.5 text-[0.86rem] font-medium text-zinc-200 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_0_24px_rgba(34,211,238,0.05)] backdrop-blur-md"
                          >
                            {item}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            <motion.section {...sectionReveal(reduced, 0.26)} className={panelClassName("left")}>
              <SiteEdges />
              <div className="relative z-10">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">Closing</p>
                <h2 className="mt-4 max-w-3xl text-balance text-[1.65rem] font-semibold tracking-[-0.035em] text-white sm:text-[2rem]">
                  If it reduces explanation time, it is doing the job.
                </h2>
                <p className="mt-6 max-w-[42rem] text-pretty text-[1.02rem] leading-[1.92] text-zinc-300 sm:text-[1.1rem]">
                  The site is built to work under the most common constraint: someone has limited time and needs a fast, accurate understanding. If the work reads clearly, if the structure holds, and if the experience feels calm and credible, then the system is doing exactly what it was built for.
                </p>
              </div>
            </motion.section>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}

