"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Footer } from "../footer";
import { Navbar } from "../navbar";
import type { Project } from "../../lib/projects";
import { ProjectDetailAurora } from "./project-detail-aurora";

type AuraProjectPageProps = {
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
    eyebrow: "The gap",
    title: "Peer-to-peer marketplaces still leave trust to chance.",
    body:
      "Aura was built to explore a very specific problem that most peer-to-peer marketplaces ignore. Trust in physical transactions is still broken. Buying and selling in person relies on screenshots, vague conversations, and blind trust at the moment of exchange. There is no reliable way to verify authenticity before a meetup, no guarantee that funds are protected, and no proof of ownership once the transaction is complete.",
    delay: 0.02
  },
  {
    eyebrow: "The thesis",
    title: "Replace interpersonal trust with verification.",
    body:
      "Aura was built to challenge that model directly. Instead of relying on trust between two individuals, the system replaces trust with verification. Every step in a transaction is designed to be backed by cryptographic proof, on-chain settlement, and real-world validation.",
    align: "right",
    delay: 0.05
  },
  {
    eyebrow: "Origin",
    title: "Built to prove physical commerce can match on-chain certainty.",
    body:
      "This project was developed as part of the Monolith Solana Mobile Hackathon with the goal of proving that real-world commerce can operate with the same level of certainty as decentralized finance. The idea was simple but difficult to execute. A physical exchange should not depend on belief. It should depend on systems that guarantee the outcome.",
    delay: 0.08
  },
  {
    eyebrow: "Core",
    title: "A mobile marketplace where the listing and the deal are enforced.",
    body:
      "At its core, Aura is a mobile marketplace built for Solana where transactions are secured through a combination of hardware verification, smart contracts, and on-chain identity. A listing is not just an image and a price. It becomes a verified digital representation of a physical item. A transaction is not just an agreement between two people. It becomes a sequence of enforced steps that ensure both parties are protected from start to finish.",
    align: "right",
    delay: 0.11
  },
  {
    eyebrow: "Flow",
    title: "From listing to meetup, ambiguity is designed out.",
    body: [
      "The flow of a transaction in Aura is designed to remove ambiguity completely. A seller lists an item using a native mobile capture flow that focuses on real-world detail rather than generic images. A buyer discovers the listing and commits funds directly into an on-chain escrow contract. This immediately removes payment risk and ensures that both sides are locked into the transaction before meeting.",
      "When both parties meet, the system verifies physical presence and identity before allowing the transaction to proceed. This is not a symbolic check. It uses device-level capabilities and real-time validation to ensure that the buyer and seller are actually present at the same location. The item itself is also reverified against its original record to prevent substitution or bait-and-switch behavior."
    ],
    delay: 0.14
  },
  {
    eyebrow: "Handover",
    title: "Payment follows cryptographic proof of the exchange.",
    body: [
      "The most critical step is the handover. Instead of relying on verbal confirmation or trust, Aura uses NFC-based cryptographic verification. A secure tag attached to the item produces a signed payload that proves physical interaction at the moment of exchange. This proof is verified before any funds are released. The result is a transaction where payment only happens if the system confirms that the handover has actually occurred.",
      "Once the exchange is complete, ownership is recorded on-chain through a digital receipt. This is not just a confirmation message. It is a permanent record that ties the transaction, the asset, and the participants together. Disputes that are common in traditional marketplaces simply do not exist in this model because the system enforces the outcome."
    ],
    align: "right",
    delay: 0.17
  },
  {
    eyebrow: "Trust surface",
    title: "Reputation and engagement tied to verified, physical behavior.",
    body: [
      "Beyond transactions, Aura introduces a reputation layer that is earned through verified activity. Instead of arbitrary ratings, trust is built through completed exchanges and consistent behavior. This reputation is visible and directly tied to a user’s history, making it harder to manipulate and more meaningful over time.",
      "The system also explores how engagement can be tied to real-world behavior. Users interact with the platform through actions that require physical presence, making it difficult to fake activity through bots or scripted behavior. This creates a marketplace where both trust and participation are grounded in real-world interaction rather than purely digital signals."
    ],
    delay: 0.2
  },
  {
    eyebrow: "Engineering",
    title: "Full-stack mobile, chain, and backend without a single trusted layer.",
    body: [
      "From a technical standpoint, Aura is built as a full-stack mobile system with deep integration across hardware, blockchain, and backend infrastructure. The Android application is developed using Kotlin and modern UI systems, designed to handle complex flows like wallet connections, NFC interactions, and real-time verification. The blockchain layer is built on Solana using smart contracts to manage escrow and settlement. Backend systems handle verification, orchestration, and secure communication between components without exposing sensitive keys or logic to the client.",
      "The architecture is designed around the idea that no single layer should be trusted on its own. The mobile client handles interaction and user experience. The blockchain enforces financial guarantees. The backend verifies proofs and coordinates execution. Together, they create a system where each layer reinforces the others."
    ],
    align: "right",
    delay: 0.23
  },
  {
    eyebrow: "Prototype",
    title: "A proof focused on the hardest parts, not a polished consumer app.",
    body: [
      "Aura was not built as a polished consumer product. It was built as a proof of what is possible when physical and digital systems are combined correctly. The focus was on solving the hardest parts of the problem, not simplifying them for presentation. That includes secure escrow, cryptographic verification, and enforcing real-world actions through software.",
      "The project was developed in collaboration with Wasif Waseem and Huaicheng Su, with each of us focusing on different parts of the system across mobile development, blockchain integration, and backend infrastructure. The result was a working prototype that demonstrates a fully verifiable physical transaction flow from listing to settlement."
    ],
    delay: 0.26
  },
  {
    eyebrow: "Outcome",
    title: "Marketplaces can evolve when outcomes are guaranteed, not hoped for.",
    body: [
      "What Aura proves is not just that secure peer-to-peer commerce is possible, but that it can be designed in a way where trust is no longer a requirement. Every critical step can be verified, enforced, and recorded.",
      "This project stands as an exploration of how marketplaces can evolve when systems are built to guarantee outcomes instead of relying on users to behave correctly."
    ],
    align: "right",
    delay: 0.29
  }
];

const stackGroups = [
  {
    title: "Mobile",
    items: ["Kotlin", "Android Compose"]
  },
  {
    title: "Blockchain",
    items: ["Solana", "Anchor", "Metaplex"]
  },
  {
    title: "Backend & RPC",
    items: ["Supabase", "Edge Functions", "Helius RPC"]
  },
  {
    title: "Hardware & ML",
    items: ["NFC NTAG 424 DNA", "Google ML Kit"]
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

function AuraEdges() {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent" />
      <div className="pointer-events-none absolute inset-y-10 left-0 w-px bg-gradient-to-b from-transparent via-white/14 to-transparent" />
      <div className="pointer-events-none absolute inset-y-10 right-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute -right-14 top-10 h-32 w-32 rounded-full bg-amber-400/[0.09] blur-3xl" />
      <div className="pointer-events-none absolute -left-12 bottom-8 h-28 w-28 rounded-full bg-orange-400/[0.07] blur-3xl" />
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
      <AuraEdges />
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

export function AuraProjectPage({ project }: AuraProjectPageProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <main className="relative min-h-screen overflow-hidden pt-20 sm:pt-24">
      <ProjectDetailAurora mode="accent" accent="amber" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[6] h-[46rem] bg-[radial-gradient(72rem_30rem_at_14%_8%,rgba(251,191,36,0.11),transparent_58%),radial-gradient(64rem_26rem_at_88%_0%,rgba(251,146,60,0.09),transparent_56%)]"
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
              <AuraEdges />
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

                <h1 className="mt-7 text-[3.1rem] font-semibold tracking-[-0.065em] text-white sm:text-[4rem] lg:text-[4.4rem]">
                  Aura
                </h1>

                <p className="mt-4 max-w-2xl text-pretty text-[1.15rem] font-medium leading-[1.5] text-amber-50/95 sm:text-[1.35rem]">
                  The Physical to Digital Marketplace
                </p>

                <p className="mt-8 max-w-[44rem] text-pretty text-[1.04rem] leading-[1.95] text-zinc-300 sm:text-[1.12rem]">
                  Aura explores what happens when in-person commerce is held to the same standard as on-chain systems: cryptographic proof, enforced steps, and settlement that does not depend on blind trust at the handoff.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.018))] px-6 py-7 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:px-8 sm:py-8"
            >
              <AuraEdges />
              <div className="relative z-10 flex h-full flex-col">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">Enforced path</p>
                <div className="mt-7 space-y-4 rounded-[1.6rem] border border-amber-400/15 bg-black/30 px-5 py-6 sm:px-6">
                  <p className="text-pretty text-[0.98rem] leading-[1.85] text-zinc-300 sm:text-[1.03rem]">
                    Listing capture, escrow commitment, co-presence checks, NFC-signed handover, then on-chain receipt. Each gate exists so the next step cannot pretend to have happened.
                  </p>
                  <p className="text-pretty text-[0.9rem] leading-[1.75] text-zinc-500">
                    Monolith Solana Mobile Hackathon · Kotlin · Solana · NFC
                  </p>
                </div>
                <p className="mt-7 text-pretty text-[0.98rem] leading-[1.88] text-zinc-300 sm:mt-8 sm:text-[1.03rem]">
                  The product question is not whether people will trust each other. It is whether the system can make trust optional.
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
              <AuraEdges />
              <div className="relative z-10">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">Stack</p>
                <h2 className="mt-4 text-balance text-[1.65rem] font-semibold tracking-[-0.035em] text-white sm:text-[2rem]">
                  Technologies used across mobile, chain, and orchestration.
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
                            className="rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.02))] px-4 py-2.5 text-[0.86rem] font-medium text-zinc-200 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_0_24px_rgba(251,191,36,0.06)] backdrop-blur-md"
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
              <AuraEdges />
              <div className="relative z-10">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">Closing</p>
                <h2 className="mt-4 max-w-3xl text-balance text-[1.65rem] font-semibold tracking-[-0.035em] text-white sm:text-[2rem]">
                  What if physical exchange did not require trust at all?
                </h2>
                <div className="mt-6 max-w-[42rem] space-y-6">
                  <p className={bodyClass}>
                    Aura is not a finished product and was never intended to be one. It is a deep technical exploration into what happens when real-world transactions are treated with the same rigor as on-chain systems.
                  </p>
                  <p className={bodyClass}>
                    It answers a simple question with a serious implementation. What if physical exchange did not require trust at all.
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
