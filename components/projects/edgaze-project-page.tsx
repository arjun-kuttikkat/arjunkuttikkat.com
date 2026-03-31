"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Footer } from "../footer";
import { LeavingSiteLink } from "../leaving-site-link";
import { Navbar } from "../navbar";
import type { Project } from "../../lib/projects";
import { EdgazeWorkflowBackdrop } from "./edgaze-workflow-backdrop";
import { EdgazeWorkflowDiagram } from "./edgaze-workflow-diagram";
import { ProjectDetailAurora } from "./project-detail-aurora";

type EdgazeProjectPageProps = {
  project: Project;
};

type ParagraphSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  align?: "left" | "right";
  delay?: number;
};

const EDGAZE_HREF = "https://edgaze.ai";

const sections: ParagraphSectionProps[] = [
  {
    eyebrow: "The problem",
    title: "Workflows still live in the wrong format.",
    body:
      "The problem is not that workflows do not exist. The problem is that they are trapped in formats that were never meant for execution. A good workflow today is usually a sequence of steps written in text, passed around as screenshots or long documents, and dependent on how well the next person interprets it. Even when the logic is strong, the outcome is inconsistent because the system around it is weak. There is no standard way to package it, no reliable way to run it, and no real way to distribute it as a product.",
    delay: 0.02
  },
  {
    eyebrow: "The shift",
    title: "Edgaze moves workflows from content to execution.",
    body:
      "Edgaze shifts workflows from content to systems. It is not a prompt library and it is not a wrapper around existing chat behavior. Instead of describing what to do, a workflow is built as something that actually runs. Inputs are defined, steps are structured, and outputs are generated through controlled execution. The user is not following instructions manually. The system handles execution end to end. That changes the nature of the workflow itself, from something that needs interpretation to something that can be run with confidence.",
    align: "right",
    delay: 0.05
  },
  {
    eyebrow: "How it works",
    title: "The workflow is a directed system, not a loose sequence.",
    body:
      "At the core of Edgaze is a node-based workflow builder and execution engine where workflows are structured as directed flows and every step is responsible for processing explicit inputs before passing explicit outputs forward. Each node performs a specific operation, whether that is interacting with a model, transforming data, or applying logic, and the flow between nodes is visible rather than implied. Conditions, branching, and validations exist inside the system to control execution paths and prevent bad state from moving downstream. Every run is traceable from start to finish, with full visibility into each step, each input, and each output, which makes the system technical enough to be reliable while still remaining legible to the person using it.",
    delay: 0.08
  },
  {
    eyebrow: "Execution and reliability",
    title: "The hard part is making forward execution dependable.",
    body:
      "Execution is designed to move forward rather than collapse into looping chaos. Once a step completes, its output is fixed for that run and it does not silently change underneath the rest of the workflow. Failures can be retried with context, but successful steps remain stable so the execution path stays understandable. Gating logic exists to prevent invalid paths from running at all, which matters more as workflows become denser and more conditional. Reliability is still one of the hardest parts of the system and it is being worked on actively, because getting something to run once is easy compared with building something people can trust repeatedly.",
    align: "right",
    delay: 0.11
  },
  {
    eyebrow: "Distribution",
    title: "A workflow should open like a product, not a document.",
    body:
      "Distribution is part of the system itself, not something added after the workflow already exists. A workflow built on Edgaze becomes a shareable, runnable surface that someone can open immediately. The goal is that a person lands on a link, provides input, and runs the workflow without setup, configuration, or needing to understand the implementation behind it. That is what turns a workflow into a real product instead of content that still needs explanation before it can be used.",
    delay: 0.14
  },
  {
    eyebrow: "Monetization",
    title: "Value is tied to execution, not static files.",
    body:
      "Monetization is built into the system from the beginning. Instead of selling prompts, screenshots, or static documents, creators can put a price on workflows that people actually run and earn from real usage. Edgaze handles the infrastructure around payments, access, and usage so creators can stay focused on building the workflow itself. That makes the business model closer to software than downloadable content, which is the only direction that makes sense if workflows are going to become durable products.",
    align: "right",
    delay: 0.17
  },
  {
    eyebrow: "Current stage",
    title: "The system is still under active construction.",
    body:
      "Right now the system is in an active build phase and the surface area is large. Making workflows run is only one part of the challenge. Making them reliable across real conditions is significantly harder, which is why the work is iterative, pressure-driven, and continuous. There has already been strong validation through direct outreach and real conversations with creators, and there are people waiting for the system to reach a more stable level. The question is no longer whether this should exist. The question is whether it can be executed at the level people will depend on.",
    delay: 0.2
  }
];

const stackGroups = [
  {
    title: "Core Platform",
    items: ["Next.js", "React", "TypeScript", "Node.js"]
  },
  {
    title: "Data & Backend",
    items: ["PostgreSQL", "Supabase", "Edge Functions"]
  },
  {
    title: "Execution & Workflow Engine",
    items: ["Custom execution engine", "React Flow", "Streaming architecture"]
  },
  {
    title: "Payments & Identity",
    items: ["Stripe", "Stripe Connect", "Auth system"]
  },
  {
    title: "Infrastructure & Deployment",
    items: ["Vercel", "GitHub", "CI pipelines"]
  },
  {
    title: "Analytics & Monitoring",
    items: ["Mixpanel", "Vercel Analytics"]
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

function PanelEdges() {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent" />
      <div className="pointer-events-none absolute inset-y-10 left-0 w-px bg-gradient-to-b from-transparent via-white/14 to-transparent" />
      <div className="pointer-events-none absolute inset-y-10 right-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute -right-12 top-8 h-28 w-28 rounded-full bg-fuchsia-400/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute -left-12 bottom-6 h-24 w-24 rounded-full bg-cyan-400/[0.06] blur-3xl" />
    </>
  );
}

function ParagraphSection({
  eyebrow,
  title,
  body,
  align = "left",
  delay = 0
}: ParagraphSectionProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.section {...sectionReveal(reduced, delay)} className={panelClassName(align)}>
      <PanelEdges />
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

export function EdgazeProjectPage({ project }: EdgazeProjectPageProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <main className="relative min-h-screen overflow-hidden">
      <ProjectDetailAurora mode="edgaze" />
      <EdgazeWorkflowBackdrop />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[6] h-[46rem] bg-[radial-gradient(70rem_28rem_at_18%_8%,rgba(34,211,238,0.08),transparent_62%),radial-gradient(64rem_26rem_at_84%_0%,rgba(232,121,249,0.09),transparent_58%)]"
      />

      <div className="relative z-10">
        <Navbar projectNav={{ title: project.name }} />

        <section className="px-6 pb-10 pt-28 sm:px-8 sm:pb-14 sm:pt-32">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(22rem,0.88fr)] lg:items-stretch">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.02))] px-6 py-8 shadow-[0_32px_120px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:px-8 sm:py-10 lg:px-10 lg:py-12"
            >
              <PanelEdges />
              <div className="relative z-10">
                <div className="relative h-24 w-24 sm:h-28 sm:w-28">
                  <Image
                    src={project.logo}
                    alt={`${project.name} logo`}
                    fill
                    sizes="112px"
                    className="object-contain p-[12%]"
                    priority
                  />
                </div>

                <h1 className="mt-7 text-[3.3rem] font-semibold tracking-[-0.07em] text-white sm:text-[4.6rem] lg:text-[5.2rem]">
                  Edgaze
                </h1>

                <p className="mt-4 max-w-2xl text-pretty text-[1.2rem] font-medium leading-[1.45] text-zinc-100 sm:text-[1.45rem]">
                  Turn AI workflows into real, executable products.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <LeavingSiteLink
                    href={EDGAZE_HREF}
                    className="inline-flex items-center justify-center rounded-full border border-cyan-300/35 bg-[linear-gradient(130deg,rgba(34,211,238,0.16),rgba(232,121,249,0.12))] px-5 py-2.5 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_60px_rgba(0,0,0,0.38)] transition-all hover:border-cyan-200/55 hover:bg-[linear-gradient(130deg,rgba(34,211,238,0.22),rgba(232,121,249,0.16))] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
                    leavingText="Visit Edgaze to see workflows as products."
                  >
                    Visit Edgaze
                  </LeavingSiteLink>
                  <a
                    href={EDGAZE_HREF}
                    className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-5 py-2.5 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-zinc-200 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35"
                    target="_blank"
                    rel="noreferrer"
                  >
                    edgaze.ai
                  </a>
                </div>

                <p className="mt-8 max-w-[44rem] text-pretty text-[1.04rem] leading-[1.95] text-zinc-300 sm:text-[1.12rem]">
                  Edgaze is the system I am building to turn AI workflows into something that can
                  actually be used, shared, and paid for in a consistent way. Right now most
                  workflows exist as conversations, scattered prompts, or documents that break the
                  moment someone tries to reuse them. They are not structured, not reliable, and
                  not designed for real execution. Edgaze is being built as infrastructure that
                  gives workflows a real surface where they can run, not just be explained.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }
              }
              className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.018))] px-6 py-7 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:px-8 sm:py-8"
            >
              <PanelEdges />
              <div className="relative z-10 flex h-full flex-col">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">
                  Runtime surface
                </p>
                <div className="mt-7 rounded-[1.6rem] border border-white/10 bg-black/24 px-4 py-6 sm:px-6">
                  <EdgazeWorkflowDiagram />
                </div>
                <p className="mt-7 text-pretty text-[0.98rem] leading-[1.88] text-zinc-300 sm:mt-8 sm:text-[1.03rem]">
                  The system is being shaped around explicit flow, visible state, and traceable
                  runs so that the behavior of a workflow can be inspected as a system rather than
                  guessed from a prompt.
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
              <PanelEdges />
              <div className="relative z-10">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">
                  Stack
                </p>
                <h2 className="mt-4 text-balance text-[1.65rem] font-semibold tracking-[-0.035em] text-white sm:text-[2rem]">
                  The product surface is supported by a compact but deliberate stack.
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
              <PanelEdges />
              <div className="relative z-10">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">
                  Direction
                </p>
                <h2 className="mt-4 max-w-3xl text-balance text-[1.65rem] font-semibold tracking-[-0.035em] text-white sm:text-[2rem]">
                  This is being built toward scale, not polish theater.
                </h2>
                <p className="mt-6 max-w-[42rem] text-pretty text-[1.02rem] leading-[1.92] text-zinc-300 sm:text-[1.1rem]">
                  This is not finished. It is being built in real time with real constraints and
                  real feedback. The goal is simple and difficult at the same time: make workflows
                  usable, make them reliable, and make them something other systems and creators can
                  build on top of. The long-term direction is to make Edgaze part of the
                  infrastructure people rely on when AI workflows need to be executed, distributed,
                  and trusted at scale.
                </p>
              </div>
            </motion.section>
          </div>
        </section>

        <section className="px-6 pb-20 sm:px-8 sm:pb-24">
          <div className="mx-auto max-w-6xl">
            <motion.div
              {...sectionReveal(reduced, 0.29)}
              className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.02))] px-6 py-8 shadow-[0_32px_120px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:px-8 sm:py-10"
            >
              <PanelEdges />
              <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">
                    Link
                  </p>
                  <h2 className="mt-3 text-balance text-[1.5rem] font-semibold tracking-[-0.035em] text-white sm:text-[1.8rem]">
                    Explore Edgaze directly.
                  </h2>
                  <p className="mt-3 max-w-[44rem] text-pretty text-[0.98rem] leading-[1.85] text-zinc-300 sm:text-[1.04rem]">
                    If you want to see where this is heading, jump to the live Edgaze surface.
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-3">
                  <LeavingSiteLink
                    href={EDGAZE_HREF}
                    className="inline-flex items-center justify-center rounded-full border border-cyan-300/35 bg-[linear-gradient(130deg,rgba(34,211,238,0.16),rgba(232,121,249,0.12))] px-5 py-2.5 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-white transition-all hover:border-cyan-200/55 hover:bg-[linear-gradient(130deg,rgba(34,211,238,0.22),rgba(232,121,249,0.16))] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
                    leavingText="Visit Edgaze to run workflows, not read them."
                  >
                    Visit Edgaze
                  </LeavingSiteLink>
                  <a
                    href={EDGAZE_HREF}
                    className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-5 py-2.5 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-zinc-200 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35"
                    target="_blank"
                    rel="noreferrer"
                  >
                    edgaze.ai
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
