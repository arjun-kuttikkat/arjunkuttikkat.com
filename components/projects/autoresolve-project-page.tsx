"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Footer } from "../footer";
import { Navbar } from "../navbar";
import type { Project } from "../../lib/projects";
import { ProjectDetailAurora } from "./project-detail-aurora";

type AutoresolveProjectPageProps = {
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
    eyebrow: "Origin",
    title: "The friction came from delay and follow-through, not complexity.",
    body:
      "AutoResolve started from a real frustration, not a theoretical problem. I had to spend a full week dealing with OpenAI support just to get a relatively simple issue fixed. The process was slow, repetitive, and unnecessarily exhausting. Every update required another email, more waiting, more checking, and more uncertainty about whether anything was actually moving forward. That experience made one thing obvious. A huge amount of support friction does not come from complexity. It comes from delay, inconsistency, and the lack of persistent follow through.",
    delay: 0.02
  },
  {
    eyebrow: "Intent",
    title: "An email agent that stays on the case so the customer does not have to.",
    body:
      "AutoResolve was built to attack that exact gap. Instead of leaving a customer stuck manually following up, checking inboxes, and rewriting the same context again and again, the system acts as an email agent that stays on the case continuously. It keeps track of the conversation, monitors for replies, sends follow ups when needed, and responds instantly within defined boundaries. The goal is not to replace the human user. The goal is to make sure the user is no longer carrying the full operational burden of getting a dispute resolved.",
    align: "right",
    delay: 0.05
  },
  {
    eyebrow: "Pattern",
    title: "Most dispute handling repeats the same shapes.",
    body:
      "At its core, AutoResolve is designed around the idea that a large percentage of support and dispute handling follows repeated patterns. Customers ask similar questions, support teams respond with similar templates, cases get delayed in similar ways, and escalation points often follow recognizable structures. Once that pattern is clear, there is no reason the customer should have to manually manage every step of the process. The system can track the case, understand where it stands, and decide whether to respond automatically, escalate, or wait for human input.",
    delay: 0.08
  },
  {
    eyebrow: "Mechanism",
    title: "Continuous monitoring, instant drafts, hard stops when judgment matters.",
    body:
      "The way AutoResolve works is simple in concept but powerful in execution. A user connects their email and gives the system the dispute context. From that point onward, the agent watches the conversation continuously, keeps track of what has already been said, and reacts in real time when a new reply arrives. If a response is required, it drafts and sends it instantly based on the existing thread, the customer’s objective, and the rules defined for that case. If a situation crosses a safety threshold or becomes too sensitive, the system does not act blindly. It pauses, alerts the user, and routes the decision back to a human.",
    align: "right",
    delay: 0.11
  },
  {
    eyebrow: "Control",
    title: "Human in the loop is what makes it credible instead of reckless.",
    body:
      "That human in the loop design is a core part of the system. AutoResolve is not trying to automate recklessly. Disputes can involve money, policy interpretation, refunds, account access, and sensitive personal context. In those cases, speed matters, but control matters more. The system is designed to automate obvious, repetitive follow through while preserving human oversight when judgment is needed. That balance is what makes the product credible instead of dangerous.",
    delay: 0.14
  },
  {
    eyebrow: "Safety",
    title: "Built to behave safely on the customer side.",
    body:
      "A major part of the build was making the system behave safely on the customer side. That meant introducing verification layers, guardrails around sending behavior, and alerting systems that prevent the agent from operating like an uncontrolled autoresponder. It continuously tracks the state of a case, watches for important changes, and ensures that actions stay aligned with the original objective instead of drifting into generic reply behavior. The result is an agent that feels less like a chatbot and more like a persistent operator working on behalf of the user.",
    align: "right",
    delay: 0.17
  },
  {
    eyebrow: "Inversion",
    title: "Automation built for the customer, not the queue.",
    body:
      "From a product perspective, AutoResolve explores a shift that is likely to become increasingly important. Most support automation today is built for companies, not customers. Businesses use AI to reduce load, shorten queues, and deflect repetitive issues. The customer is still left doing the manual labor of chasing responses, keeping records, and managing escalation. AutoResolve flips that. It gives the customer their own system, one that operates with persistence and speed even when the support organization on the other side does not.",
    delay: 0.2
  },
  {
    eyebrow: "Hackathon",
    title: "Built in two days around a use case people actually feel.",
    body:
      "The project was built in collaboration with Huaicheng Su in just two days and went on to win 3rd place at the AI Agent Innovation Hackathon. What made it compelling was not just the use of an agent, but the clarity of the use case. This was not an abstract demo about AI handling tasks. It was a direct response to a frustrating, familiar workflow that millions of people deal with and almost nobody has meaningfully fixed.",
    align: "right",
    delay: 0.23
  },
  {
    eyebrow: "Engineering",
    title: "Orchestration, inbox truth, and local infrastructure for a serious prototype.",
    body:
      "Technically, AutoResolve was built as a modern full stack system focused on orchestration, inbox monitoring, state tracking, and controlled automated response generation. The product layer was built with the standard web stack around Next.js, React, and TypeScript, while the backend logic handled email processing, queue based task execution, and persistent case management. Since the project was not deployed, the infrastructure was handled locally through Docker, with Redis used for coordination and stateful background processing. Gmail API integration formed a critical layer of the system because the product depended on continuous thread monitoring, real time context awareness, and safe outbound replies. The architecture was built around reliability and control rather than flashy demos.",
    delay: 0.26
  },
  {
    eyebrow: "Proof",
    title: "Customer-side agents are overdue.",
    body: [
      "What AutoResolve proves is that customer side agents are not just possible, they are overdue. There is no reason dispute handling should still depend on a person manually checking their inbox every few hours, rewriting the same context, and hoping the next reply moves things forward. A persistent, well designed agent can do that work faster, more consistently, and with far less friction, while still keeping the human in control when it actually matters.",
      "AutoResolve is not being presented as a finished company or a deployed product. It was a hackathon build. But it surfaced a very real insight. There is a large category of painful, repetitive support workflows where the customer is doing far too much manual work, and that is exactly the kind of problem an agent should be handling."
    ],
    align: "right",
    delay: 0.29
  }
];

const stackGroups = [
  {
    title: "Application",
    items: ["Next.js", "React", "TypeScript"]
  },
  {
    title: "Runtime & data",
    items: ["Node.js", "PostgreSQL", "Redis"]
  },
  {
    title: "Infrastructure",
    items: ["Docker"]
  },
  {
    title: "Integrations & orchestration",
    items: ["Gmail API", "Authentication layer", "Queue based orchestration"]
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

function AutoresolveEdges() {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent" />
      <div className="pointer-events-none absolute inset-y-10 left-0 w-px bg-gradient-to-b from-transparent via-white/14 to-transparent" />
      <div className="pointer-events-none absolute inset-y-10 right-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute -right-14 top-10 h-32 w-32 rounded-full bg-teal-400/[0.09] blur-3xl" />
      <div className="pointer-events-none absolute -left-12 bottom-8 h-28 w-28 rounded-full bg-cyan-400/[0.07] blur-3xl" />
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
      <AutoresolveEdges />
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

export function AutoresolveProjectPage({ project }: AutoresolveProjectPageProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <main className="relative min-h-screen overflow-hidden pt-20 sm:pt-24">
      <ProjectDetailAurora mode="accent" accent="teal" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[6] h-[46rem] bg-[radial-gradient(72rem_30rem_at_14%_8%,rgba(45,212,191,0.11),transparent_58%),radial-gradient(64rem_26rem_at_88%_0%,rgba(34,211,238,0.08),transparent_56%)]"
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
              <AutoresolveEdges />
              <div className="relative z-10">
                <div className="relative h-24 w-24 sm:h-28 sm:w-28">
                  <Image
                    src={project.logo}
                    alt={`${project.name} logo`}
                    fill
                    sizes="112px"
                    className="object-contain p-[10%]"
                    priority
                  />
                </div>

                <h1 className="mt-7 text-[2.85rem] font-semibold tracking-[-0.055em] text-white sm:text-[3.6rem] lg:text-[4rem]">
                  AutoResolve
                </h1>

                <p className="mt-4 max-w-2xl text-pretty text-[1.1rem] font-medium leading-[1.5] text-teal-100/95 sm:text-[1.28rem]">
                  A customer side dispute agent for unresolved support cases.
                </p>

                <p className="mt-8 max-w-[44rem] text-pretty text-[1.04rem] leading-[1.95] text-zinc-300 sm:text-[1.12rem]">
                  Support friction often looks like a hard problem on paper, but in practice it is often slow follow-through and scattered context. AutoResolve is built to carry the operational load of dispute threads so persistence, timing, and alignment with the user’s objective do not depend on manual inbox babysitting.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.018))] px-6 py-7 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:px-8 sm:py-8"
            >
              <AutoresolveEdges />
              <div className="relative z-10 flex h-full flex-col">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">Operating mode</p>
                <div className="mt-7 space-y-4 rounded-[1.6rem] border border-teal-400/15 bg-black/30 px-5 py-6 sm:px-6">
                  <p className="text-pretty text-[0.98rem] leading-[1.85] text-zinc-300 sm:text-[1.03rem]">
                    Watch the thread continuously. Draft and send within guardrails. Pause and hand back when the case crosses sensitivity or policy judgment. Track state so the agent cannot drift into generic noise.
                  </p>
                  <p className="text-pretty text-[0.9rem] leading-[1.75] text-zinc-500">
                    AI Agent Innovation Hackathon · 3rd place · built with Huaicheng Su in 48 hours
                  </p>
                </div>
                <p className="mt-7 text-pretty text-[0.98rem] leading-[1.88] text-zinc-300 sm:mt-8 sm:text-[1.03rem]">
                  The product bet is not “more AI.” It is persistent case ownership on the customer side.
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

            <motion.section {...sectionReveal(reduced, 0.32)} className={panelClassName("right")}>
              <AutoresolveEdges />
              <div className="relative z-10">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">Stack</p>
                <h2 className="mt-4 text-balance text-[1.65rem] font-semibold tracking-[-0.035em] text-white sm:text-[2rem]">
                  Web surface, durable state, and email-native orchestration.
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
                            className="rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.02))] px-4 py-2.5 text-[0.86rem] font-medium text-zinc-200 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_0_24px_rgba(45,212,191,0.06)] backdrop-blur-md"
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

            <motion.section {...sectionReveal(reduced, 0.35)} className={panelClassName("left")}>
              <AutoresolveEdges />
              <div className="relative z-10">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">Closing</p>
                <h2 className="mt-4 max-w-3xl text-balance text-[1.65rem] font-semibold tracking-[-0.035em] text-white sm:text-[2rem]">
                  What happens when the customer gets the agent instead of the company.
                </h2>
                <div className="mt-6 max-w-[42rem] space-y-6">
                  <p className={bodyClass}>
                    AutoResolve was built fast, under pressure, and around a problem that came from lived frustration rather than abstract ideation.
                  </p>
                  <p className={bodyClass}>
                    It explored a simple but important shift. What happens when the customer gets the agent instead of the company.
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
