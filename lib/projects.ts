export type ProjectStatus = "Live" | "Building" | "Exploring";

export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectAccent = "cyan" | "fuchsia" | "amber" | "teal" | "violet";
export type ProjectVisualTheme = "editorial" | "workflow" | "route" | "resolver" | "signal";

export type Project = {
  slug: string;
  name: string;
  shortDescription: string;
  tagline: string;
  category: string;
  status: ProjectStatus;
  year: string;
  role: string;
  overview: string;
  problem: string;
  solution: string;
  outcome: string;
  tech: string[];
  links: ProjectLink[];
  accent: ProjectAccent;
  featured: boolean;
  order: number;
  homeOrder: number;
  logo: string;
  motif: string;
  archiveSummary: string;
  visualTheme: ProjectVisualTheme;
  surfaceClass: string;
  hoverAuraA: string;
  hoverAuraB: string;
  hoverGlow: string;
  homeTeaser: string;
  /** Shown on the full-screen projects page (e.g. Hackathon project). */
  tags?: string[];
};

export const projects: Project[] = [
  {
    slug: "edgaze",
    name: "Edgaze",
    tagline: "Turn AI workflows into real, executable products.",
    shortDescription:
      "Edgaze is the execution infrastructure I am building to turn AI workflows into something that can actually be used, shared, and paid for with structure, traceability, and reliability.",
    category: "AI / Creator",
    status: "Building",
    year: "2025 — present",
    role: "Founder",
    overview:
      "Edgaze is the system I am building to turn AI workflows into something that can actually be used, shared, and paid for in a consistent way.",
    problem:
      "Most AI workflows exist as chats, scattered prompts, or documents that break the moment someone tries to reuse them.",
    solution:
      "Edgaze treats workflows as systems with defined inputs, controlled execution, and runnable surfaces that can be shared, distributed, and monetized.",
    outcome:
      "Under active development with strong validation through direct outreach and real conversations, while reliability is improved continuously across a large surface area.",
    tech: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Stripe",
      "Vercel",
      "Execution Engine",
      "Streaming Architecture",
      "Model Abstraction Layer"
    ],
    links: [],
    accent: "fuchsia",
    featured: true,
    order: 1,
    homeOrder: 2,
    logo: "/edgaze-mark.png",
    motif: "workflow",
    archiveSummary:
      "Edgaze is the execution infrastructure I am building to package, run, distribute, and monetize AI workflows as real products.",
    visualTheme: "workflow",
    hoverGlow: "group-hover:drop-shadow-[0_0_24px_rgba(232,121,249,0.6)]",
    surfaceClass:
      "bg-gradient-to-br from-cyan-400/28 via-zinc-950 via-45% to-fuchsia-500/26",
    hoverAuraA: "bg-fuchsia-400/10",
    hoverAuraB: "bg-cyan-400/10",
    homeTeaser: "Execution infrastructure for AI workflows."
  },
  {
    slug: "arjunkuttikkat-com",
    name: "arjunkuttikkat.com",
    tagline: "My corner of the internet.",
    shortDescription:
      "My corner of the internet, built to present what I am actually building with clarity and intent.",
    category: "Personal site",
    status: "Live",
    year: "2025 — present",
    role: "Founder",
    overview:
      "My corner of the internet, built to present what I am actually building with clarity and intent.",
    problem:
      "Context was scattered across links, messages, and half-updated write-ups, which made real work feel fragmented.",
    solution:
      "A single surface where projects, writing, and updates are structured for fast understanding, then deeper reading when it matters.",
    outcome:
      "Live. This is the default link I send when someone wants a clear view of what I’m doing without back-and-forth context building.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vercel"],
    links: [{ label: "Live site", href: "https://arjunkuttikkat.com" }],
    accent: "cyan",
    featured: false,
    order: 2,
    homeOrder: 1,
    logo: "/logo.png",
    motif: "editorial",
    archiveSummary:
      "A single, deliberate surface for projects and writing—built for clarity, credibility, and fast understanding.",
    visualTheme: "editorial",
    hoverGlow: "group-hover:drop-shadow-[0_0_22px_rgba(34,211,238,0.55)]",
    surfaceClass: "bg-gradient-to-br from-cyan-300/10 via-black to-black",
    hoverAuraA: "bg-cyan-400/10",
    hoverAuraB: "bg-sky-300/10",
    homeTeaser: "A deliberate surface for clarity and intent."
  },
  {
    slug: "aura",
    name: "Aura",
    tagline: "The Physical to Digital Marketplace",
    shortDescription:
      "A Solana mobile marketplace exploration that replaces blind trust in peer-to-peer meetups with verification, escrow, NFC handover proofs, and on-chain receipts.",
    category: "Mobile / Commerce",
    status: "Exploring",
    year: "2026",
    role: "Builder",
    tags: ["Hackathon project"],
    overview:
      "Aura explores verifiable physical commerce: escrow on Solana, device-level checks at meetup, NFC-signed handover, and on-chain ownership records—built for the Monolith Solana Mobile Hackathon.",
    problem:
      "In-person peer-to-peer trade still depends on screenshots, vague chats, and trust at the exchange, with weak guarantees on authenticity, funds, and proof of handover.",
    solution:
      "A prototype flow that binds listings, escrow, presence, NFC cryptographic proof, and settlement so outcomes are enforced by the system rather than assumed between people.",
    outcome:
      "Working hackathon prototype with Wasif Waseem and Huaicheng Su, demonstrating end-to-end verified exchange—not a shipped consumer product.",
    tech: [
      "Kotlin",
      "Android Compose",
      "Solana",
      "Anchor",
      "Metaplex",
      "Supabase",
      "Edge Functions",
      "Helius RPC",
      "NFC NTAG 424 DNA",
      "Google ML Kit"
    ],
    links: [],
    accent: "amber",
    featured: false,
    order: 3,
    homeOrder: 3,
    logo: "/aura.png",
    motif: "exchange",
    archiveSummary:
      "Verifiable peer-to-peer commerce on Solana: escrow, NFC handover proofs, and on-chain receipts instead of blind trust at the meetup.",
    visualTheme: "route",
    hoverGlow: "group-hover:drop-shadow-[0_0_22px_rgba(251,191,36,0.55)]",
    surfaceClass: "bg-gradient-to-br from-amber-300/10 via-black to-black",
    hoverAuraA: "bg-amber-400/10",
    hoverAuraB: "bg-orange-400/10",
    homeTeaser: "Verification-first marketplace for physical exchange."
  },
  {
    slug: "autoresolve",
    name: "AutoResolve",
    tagline: "A customer side dispute agent for unresolved support cases.",
    shortDescription:
      "A customer-side email agent that keeps disputes moving: continuous thread monitoring, guarded replies, follow-through, and human handoff when judgment matters—3rd place at the AI Agent Innovation Hackathon.",
    category: "Automation",
    status: "Exploring",
    year: "2026",
    role: "Builder",
    tags: ["Hackathon project"],
    overview:
      "AutoResolve is a hackathon prototype that acts as a persistent email agent for support disputes: it watches Gmail threads, tracks case state, sends follow-ups within guardrails, and pauses for human input when sensitivity thresholds are crossed.",
    problem:
      "Support and dispute resolution often stall on delay, inconsistency, and manual follow-through, not on intrinsic complexity—customers end up carrying the operational burden.",
    solution:
      "An orchestrated agent that monitors the inbox continuously, drafts context-aware replies, uses queues and case state for control, and routes decisions back to the user when automation would be reckless.",
    outcome:
      "Built in 48 hours with Huaicheng Su; 3rd place at the AI Agent Innovation Hackathon. Not deployed; validated the customer-side agent wedge.",
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Gmail API",
      "Authentication layer",
      "Queue based orchestration"
    ],
    links: [],
    accent: "teal",
    featured: false,
    order: 4,
    homeOrder: 4,
    logo: "/Autoresolve.png",
    motif: "branching",
    archiveSummary:
      "Customer-side dispute agent: Gmail-native monitoring, queue orchestration, guarded automation—with human handoff when it matters.",
    visualTheme: "resolver",
    hoverGlow: "group-hover:drop-shadow-[0_0_22px_rgba(45,212,191,0.55)]",
    surfaceClass: "bg-gradient-to-br from-teal-300/10 via-black to-black",
    hoverAuraA: "bg-teal-400/10",
    hoverAuraB: "bg-cyan-300/10",
    homeTeaser: "Persistent email agent for customer-side disputes."
  },
  {
    slug: "health-signal",
    name: "Health Signal",
    tagline: "Post surgery monitoring, structured into signals that can actually be acted on.",
    shortDescription:
      "Exploration of post-surgery home monitoring as legible timelines and deviation-based signals—Next.js plus Python time-series thinking—built for Future Hack with Smart Salem and Mediclinic.",
    category: "Health",
    status: "Exploring",
    year: "2026",
    role: "Builder",
    tags: ["Hackathon project"],
    overview:
      "Health Signal prototypes how continuous recovery data becomes calm summaries and clinically meaningful signals: timelines, noise-aware extraction, and presentation that reduces anxiety rather than adding dashboards.",
    problem:
      "After discharge, patients have unstructured streams of symptoms and vitals with little help interpreting what matters, which drives under-reaction or panic.",
    solution:
      "Structured timelines, deviation-from-expected recovery, and careful signal extraction so patients and clinicians get actionable clarity without drowning in raw points.",
    outcome:
      "Research prototype only—not deployed. Developed at Future Hack (Dubai Knowledge Park / DIAC) with Smart Salem and Mediclinic.",
    tech: ["Next.js", "React", "TypeScript", "Python", "Time series processing", "Mobile first web architecture"],
    links: [],
    accent: "violet",
    featured: false,
    order: 5,
    homeOrder: 5,
    logo: "/healthsignal.png",
    motif: "signal",
    archiveSummary:
      "Post-surgery monitoring as better signals: timelines, deviation detection, and calm summaries—not more raw data.",
    visualTheme: "signal",
    hoverGlow: "group-hover:drop-shadow-[0_0_22px_rgba(129,140,248,0.55)]",
    surfaceClass: "bg-gradient-to-r from-black via-zinc-950 to-black",
    hoverAuraA: "bg-indigo-400/10",
    hoverAuraB: "bg-violet-400/10",
    homeTeaser: "Recovery monitoring as legible, actionable signals."
  }
];

const HOME_BENTO_SLUGS = [
  "arjunkuttikkat-com",
  "aura",
  "autoresolve",
  "edgaze",
  "health-signal"
] as const;

export function getProjectsHomeBento(): Project[] {
  return HOME_BENTO_SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter(
    (p): p is Project => p != null
  );
}

export function getProjectsSorted(): Project[] {
  return [...projects].sort((a, b) => a.order - b.order);
}

export function getProjectsHomeOrder(): Project[] {
  return [...projects].sort((a, b) => a.homeOrder - b.homeOrder);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

export function getRelatedProjects(slug: string, count = 3): Project[] {
  const current = getProjectBySlug(slug);
  if (!current) return getProjectsSorted().slice(0, count);

  const others = projects.filter((p) => p.slug !== slug);
  const sameCategory = others.filter((p) => p.category === current.category);
  const featuredFirst = others.filter((p) => p.featured);
  const merged = [...sameCategory, ...featuredFirst, ...others];
  const seen = new Set<string>();
  const unique: Project[] = [];
  for (const p of merged) {
    if (!seen.has(p.slug)) {
      seen.add(p.slug);
      unique.push(p);
    }
  }
  return unique.slice(0, count);
}
