"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Footer } from "../footer";
import { Navbar } from "../navbar";
import type { Project } from "../../lib/projects";
import { ProjectDetailAurora } from "./project-detail-aurora";

type HealthSignalProjectPageProps = {
  project: Project;
};

type ParagraphSectionProps = {
  eyebrow: string;
  title: string;
  body: string | string[];
  align?: "left" | "right";
  delay?: number;
};

const sections: ParagraphSectionProps[] = [
  {
    eyebrow: "Gap",
    title: "After surgery, monitoring continues but structured oversight stops.",
    body:
      "Health Signal was built around a very specific problem that becomes obvious the moment someone leaves a hospital after surgery. Monitoring does not stop, but structured oversight does. Patients are sent home with instructions, symptoms to watch for, and vague thresholds of concern, but there is no continuous system that translates daily condition into something clinically meaningful without overwhelming them.",
    delay: 0.02
  },
  {
    eyebrow: "Interpretation",
    title: "The hard part is not collection. It is meaning under stress.",
    body:
      "Health data in this phase is constant but unstructured. Pain levels fluctuate, temperature changes, medication timing shifts, and small signals appear that may or may not matter. The problem is not lack of data. The problem is interpretation. Patients either ignore early signals or overreact to normal variation because there is no clear way to understand what is actually happening.",
    align: "right",
    delay: 0.05
  },
  {
    eyebrow: "North star",
    title: "Legible, calm signals—not another dashboard of raw numbers.",
    body:
      "Health Signal was built to explore how post surgery monitoring could be structured into something legible, calm, and clinically useful. Instead of presenting raw data points, the system focuses on extracting patterns and converting them into signals that reflect actual change. The goal is not to track everything. The goal is to highlight what matters at the right time.",
    delay: 0.08
  },
  {
    eyebrow: "Layer",
    title: "An intermediate translation between patient experience and clinical sense-making.",
    body:
      "The core idea is simple but difficult to execute properly. A patient should not have to interpret medical data on their own, and a doctor should not have to sift through unstructured logs to understand a patient’s condition. There needs to be an intermediate layer that translates continuous input into meaningful summaries, timelines, and alerts that align with how humans actually process information under stress.",
    align: "right",
    delay: 0.11
  },
  {
    eyebrow: "Timelines",
    title: "Continuous narrative and deviation from expected recovery.",
    body:
      "Health Signal approaches this through structured timelines that organize patient data into a continuous narrative instead of isolated entries. Inputs such as pain levels, temperature readings, medication adherence, and symptom reports are tracked over time and analyzed for deviation rather than absolute value. This allows the system to detect patterns that would otherwise be missed when looking at individual data points.",
    delay: 0.14
  },
  {
    eyebrow: "Extraction",
    title: "Filter noise without blunting early warning.",
    body:
      "A major focus of the system is signal extraction. Not every change matters, and not every spike indicates risk. The system is designed to filter noise and surface only those patterns that suggest meaningful deviation from expected recovery. This reduces panic while still preserving sensitivity to early warning signs. The balance between over alerting and under alerting is critical, and much of the exploration in this project was centered around finding that balance.",
    align: "right",
    delay: 0.17
  },
  {
    eyebrow: "Presentation",
    title: "Clarity over density when the context is recovery.",
    body:
      "Another key aspect is how information is presented. In a post surgery context, clarity is more important than detail. Health Signal avoids dense dashboards and instead prioritizes readable summaries that communicate status at a glance. The intention is that both patients and clinicians can understand the current state without needing to interpret raw data manually.",
    delay: 0.2
  },
  {
    eyebrow: "Context",
    title: "Grounded in real healthcare expectations, not a sandbox idea.",
    body:
      "This project was developed as part of the Future Hack held at Dubai Knowledge Park and Dubai International Academic City in collaboration with Smart Salem and Mediclinic. The environment added a layer of seriousness to the problem because it was not being explored in isolation. It was grounded in real healthcare contexts and expectations.",
    align: "right",
    delay: 0.23
  },
  {
    eyebrow: "Build",
    title: "Web-first patient input, Python-side pattern thinking.",
    body:
      "From a technical standpoint, Health Signal was built as a web based system using a modern full stack approach. The frontend layer was developed with Next.js and TypeScript, focusing on responsive, mobile friendly interaction since most patient input would happen on personal devices. The backend logic explored time series handling and pattern detection using Python, allowing the system to process continuous health data and identify deviations over time. The architecture was designed to remain lightweight but flexible, since the goal was exploration rather than deployment.",
    delay: 0.26
  },
  {
    eyebrow: "Scope",
    title: "Prototype and research, not a shipped clinical system.",
    body:
      "The project was not deployed as a production system. It remained in the stage of research and working prototypes. The focus was on understanding how data should be structured, what kind of signals are actually useful, and how information should be presented in a way that reduces anxiety instead of increasing it.",
    align: "right",
    delay: 0.29
  },
  {
    eyebrow: "Insight",
    title: "Monitoring is a communication problem as much as a data problem.",
    body: [
      "What Health Signal ultimately highlights is that health monitoring is not just a data problem. It is a communication problem. The challenge is not collecting more information, but deciding what to show, when to show it, and how to make it understandable in moments where clarity matters most.",
      "This project stands as an exploration into how post surgery care can be extended beyond the hospital without overwhelming the patient or losing clinical relevance. It does not attempt to replace medical professionals. It attempts to support them by making patient data more structured, interpretable, and actionable."
    ],
    delay: 0.32
  }
];

const stackGroups = [
  {
    title: "Product surface",
    items: ["Next.js", "React", "TypeScript", "Mobile first web architecture"]
  },
  {
    title: "Signal & analysis",
    items: ["Python", "Time series processing"]
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

function HealthSignalEdges() {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent" />
      <div className="pointer-events-none absolute inset-y-10 left-0 w-px bg-gradient-to-b from-transparent via-white/14 to-transparent" />
      <div className="pointer-events-none absolute inset-y-10 right-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute -right-14 top-10 h-32 w-32 rounded-full bg-violet-400/[0.09] blur-3xl" />
      <div className="pointer-events-none absolute -left-12 bottom-8 h-28 w-28 rounded-full bg-indigo-400/[0.07] blur-3xl" />
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

const bodyClass =
  "text-pretty text-[1.02rem] leading-[1.92] text-zinc-300 sm:text-[1.1rem]";

function ParagraphSection({ eyebrow, title, body, align = "left", delay = 0 }: ParagraphSectionProps) {
  const reduced = useReducedMotion() ?? false;
  const paragraphs = Array.isArray(body) ? body : [body];

  return (
    <motion.section {...sectionReveal(reduced, delay)} className={panelClassName(align)}>
      <HealthSignalEdges />
      <div className="relative z-10">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">{eyebrow}</p>
        <h2 className="mt-4 max-w-3xl text-balance text-[1.65rem] font-semibold tracking-[-0.035em] text-white sm:text-[2rem]">
          {title}
        </h2>
        <div className="mt-6 max-w-[42rem] space-y-6">
          {paragraphs.map((para, i) => (
            <p key={i} className={bodyClass}>
              {para}
            </p>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export function HealthSignalProjectPage({ project }: HealthSignalProjectPageProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <main className="relative min-h-screen overflow-hidden pt-20 sm:pt-24">
      <ProjectDetailAurora mode="accent" accent="violet" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[6] h-[46rem] bg-[radial-gradient(72rem_30rem_at_14%_8%,rgba(139,92,246,0.10),transparent_58%),radial-gradient(64rem_26rem_at_88%_0%,rgba(129,140,248,0.09),transparent_56%)]"
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
              <HealthSignalEdges />
              <div className="relative z-10">
                <div className="relative h-24 w-24 sm:h-28 sm:w-28">
                  <Image
                    src={project.logo}
                    alt={`${project.name} logo`}
                    fill
                    sizes="112px"
                    className="object-contain p-[11%]"
                    priority
                  />
                </div>

                <h1 className="mt-7 text-[2.55rem] font-semibold tracking-[-0.05em] text-white sm:text-[3.25rem] lg:text-[3.65rem]">
                  Health Signal
                </h1>

                <p className="mt-4 max-w-2xl text-pretty text-[1.08rem] font-medium leading-[1.52] text-violet-100/95 sm:text-[1.26rem]">
                  Post surgery monitoring, structured into signals that can actually be acted on.
                </p>

                <p className="mt-8 max-w-[44rem] text-pretty text-[1.04rem] leading-[1.95] text-zinc-300 sm:text-[1.12rem]">
                  The exploration centers on one question: how to turn continuous home recovery data into calm, interpretable signals so patients are not left guessing and clinicians are not buried in unstructured logs.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.018))] px-6 py-7 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:px-8 sm:py-8"
            >
              <HealthSignalEdges />
              <div className="relative z-10 flex h-full flex-col">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">Signal design</p>
                <div className="mt-7 space-y-4 rounded-[1.6rem] border border-violet-400/15 bg-black/30 px-5 py-6 sm:px-6">
                  <p className="text-pretty text-[0.98rem] leading-[1.85] text-zinc-300 sm:text-[1.03rem]">
                    Timelines over isolated readings. Deviation from expected recovery over raw thresholds. Summaries at a glance instead of dense dashboards—so the system communicates when stress is already high.
                  </p>
                  <p className="text-pretty text-[0.9rem] leading-[1.75] text-zinc-500">
                    Future Hack · Dubai Knowledge Park and DIAC · Smart Salem · Mediclinic
                  </p>
                </div>
                <p className="mt-7 text-pretty text-[0.98rem] leading-[1.88] text-zinc-300 sm:mt-8 sm:text-[1.03rem]">
                  In health-adjacent work, the bar is not how much data you show. It is how little you can show while still being useful.
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

            <motion.section {...sectionReveal(reduced, 0.35)} className={panelClassName("right")}>
              <HealthSignalEdges />
              <div className="relative z-10">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">Stack</p>
                <h2 className="mt-4 text-balance text-[1.65rem] font-semibold tracking-[-0.035em] text-white sm:text-[2rem]">
                  Mobile-first capture with time-series reasoning behind it.
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
                            className="rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.02))] px-4 py-2.5 text-[0.86rem] font-medium text-zinc-200 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_0_24px_rgba(139,92,246,0.07)] backdrop-blur-md"
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

            <motion.section {...sectionReveal(reduced, 0.38)} className={panelClassName("left")}>
              <HealthSignalEdges />
              <div className="relative z-10">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">Closing</p>
                <h2 className="mt-4 max-w-3xl text-balance text-[1.65rem] font-semibold tracking-[-0.035em] text-white sm:text-[2rem]">
                  When the context is health, more data is not better.
                </h2>
                <div className="mt-6 max-w-[42rem] space-y-6">
                  <p className={bodyClass}>
                    Health Signal was not built to be a finished product. It was built to understand how sensitive systems like healthcare monitoring should be designed.
                  </p>
                  <p className={bodyClass}>It reinforced one thing clearly.</p>
                  <p className={bodyClass}>
                    When the context is health, more data is not better. Better signals are.
                  </p>
                </div>
              </div>
            </motion.section>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
