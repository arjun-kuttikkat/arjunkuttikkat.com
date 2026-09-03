import { edgazeLinks } from "./edgaze";
import type { StackGroup } from "./technologies";

/**
 * Where a project actually stands. Rendered verbatim, so wording is deliberately plain.
 * - live: shipped and in use
 * - beta: shipped publicly, still being developed
 * - hackathon: built for a hackathon, not deployed
 * - prototype: research / exploration, not deployed
 */
export type ProjectState = "live" | "beta" | "hackathon" | "prototype";

export const projectStateLabel: Record<ProjectState, string> = {
  live: "Live",
  beta: "Public beta",
  hackathon: "Hackathon build",
  prototype: "Prototype",
};

export type ProjectLink = {
  label: string;
  href: string;
  /** primary = the main destination (site, product). source = code. */
  kind: "primary" | "source" | "docs" | "other";
};

export type ProjectAccent = "cyan" | "fuchsia" | "amber" | "orange" | "teal" | "violet";
export type ProjectVisualTheme =
  | "editorial"
  | "workflow"
  | "compass"
  | "route"
  | "resolver"
  | "signal";

export type SnapshotItem = { label: string; value: string };

export type Project = {
  slug: string;
  name: string;
  /** One sentence. What it is, no adjectives. Used in the hero and for SEO. */
  summary: string;
  /** Short line under the name on index surfaces. */
  tagline: string;
  /** The whole page in a few lines. Rendered in the TL;DR box under the hero. */
  tldr: string[];
  category: string;
  state: ProjectState;
  /** Plain-language note next to the state, e.g. "since Feb 2026" or "not deployed". */
  stateNote: string;
  year: string;
  role: string;
  /** People I built it with, if any. */
  team?: string;
  /** Event / context line, e.g. hackathon name. */
  context?: string;
  snapshot: SnapshotItem[];
  stack: StackGroup[];
  links: ProjectLink[];
  /** Optional context shown directly under the hero actions. */
  sourceNote?: string;
  accent: ProjectAccent;
  featured: boolean;
  order: number;
  homeOrder: number;
  logo: string;
  visualTheme: ProjectVisualTheme;
  surfaceClass: string;
  hoverAuraA: string;
  hoverAuraB: string;
  hoverGlow: string;
  homeTeaser: string;
};

export const projects: Project[] = [
  {
    slug: "edgaze",
    name: "Edgaze",
    summary:
      "Edgaze lets creators turn AI workflows into products other people can run and pay for: on the web, through an API, or from an AI agent.",
    tagline: "Runnable AI workflows, sold per run.",
    tldr: [
      "Creators publish AI workflows as products other people can run and pay for per use, instead of selling prompt packs and instructions buyers have to rebuild.",
      "Build the graph in Workflow Studio, publish it, and Edgaze turns it into a product page with its own input form, price, and run button.",
      "The same published workflow is one product in three places: the marketplace, a REST API, and an MCP client used by agents.",
      "The hard part is after Run: every run is a record that keeps status, output, usage, and billing in agreement, and each publish is an immutable version so updates never change a past purchase.",
      "Four layers underneath — product, platform, runtime, providers — with eleven independently monitored services on a public status page.",
      "Live and operating in production, with per-run billing and creator payouts in place. The platform is now focused on acquiring creators and buyers.",
    ],
    category: "AI infrastructure",
    state: "live",
    stateNote: "operating in production",
    year: "2025 to present",
    role: "Founder",
    context: "Edge Platforms, Inc.",
    snapshot: [
      {
        label: "What it does",
        value:
          "Creators build a workflow graph in Workflow Studio and publish it. Buyers run it from a product page, a REST API, or an MCP client, and pay per run.",
      },
      {
        label: "Who it is for",
        value:
          "Creators who want to sell an outcome instead of a prompt; developers and agents that need a workflow as a callable unit.",
      },
      {
        label: "What I build",
        value:
          "The product end to end: Studio, execution runtime, public API and MCP server, billing and payouts, documentation.",
      },
      {
        label: "Status",
        value:
          "Live in production. Per-run billing and creator payouts are active. Eleven services are monitored on a public status page.",
      },
    ],
    stack: [
      {
        title: "Interface",
        note: "Marketplace, product pages, Workflow Studio.",
        items: ["nextjs", "react", "typescript", "tailwind", "reactflow"],
      },
      {
        title: "Application",
        note: "App, REST API, and MCP server all deploy to Vercel.",
        items: ["nodejs", "vercel", "zod"],
      },
      {
        title: "Execution",
        note: "Durable orchestration, workers, and run events.",
        items: ["temporal", "azureContainerApps", "redis"],
      },
      {
        title: "Data and identity",
        note: "Managed databases, auth, and storage.",
        items: ["supabase", "azurePostgres", "azureRedis"],
      },
      {
        title: "Models",
        note: "Hosted, creator-connected, or buyer BYOK keys.",
        items: ["openai", "anthropic", "gemini", "kimi", "deepseek"],
      },
      {
        title: "Cloud",
        note: "Azure hosts platform-funded model capacity and managed services.",
        items: ["azure"],
      },
      {
        title: "Payments",
        note: "Wallet and bundle checkout, creator payouts.",
        items: ["stripe", "stripeConnect"],
      },
      {
        title: "Distribution",
        note: "The same published workflow, three callers.",
        items: ["openapi", "mcp", "sse", "webhooks"],
      },
      {
        title: "Analytics",
        items: [
          "posthog",
          "mixpanel",
          "vercelAnalytics",
          "speedInsights",
          "googleTagManager",
          "googleAds",
        ],
      },
      {
        title: "Security and delivery",
        items: ["cloudflare", "github"],
      },
    ],
    links: [
      { label: "Visit Edgaze", href: edgazeLinks.home, kind: "primary" },
      { label: "View documentation", href: edgazeLinks.docs, kind: "docs" },
      {
        label: "Explore public projects",
        href: "https://github.com/edgaze-ai",
        kind: "source",
      },
    ],
    sourceNote:
      "The core Edgaze platform is proprietary and closed source. Public work includes the OpenAPI specification and MCP manifests, with more coming soon.",
    accent: "fuchsia",
    featured: true,
    order: 1,
    homeOrder: 2,
    logo: "/edgaze-mark.png",
    visualTheme: "workflow",
    hoverGlow: "group-hover:drop-shadow-[0_0_24px_rgba(232,121,249,0.6)]",
    surfaceClass:
      "bg-gradient-to-br from-cyan-400/28 via-zinc-950 via-45% to-fuchsia-500/26",
    hoverAuraA: "bg-fuchsia-400/10",
    hoverAuraB: "bg-cyan-400/10",
    homeTeaser: "Marketplace and runtime for AI workflows. Build, publish, run per use.",
  },
  {
    slug: "arjunkuttikkat-com",
    name: "arjunkuttikkat.com",
    summary:
      "The site you are reading: a public record of what I build, how the products work, and what I learned making them.",
    tagline: "The site you are reading.",
    tldr: [
      "The site is open source under the MIT License, so its implementation and history can be inspected on GitHub.",
      "This site exists so the work has one legible record instead of being rebuilt from links and messages in every conversation.",
      "Project pages are records, not summaries: each one gets its own story and length, so a platform and a weekend prototype are not flattened into the same template.",
      "Design rules are few: Inter everywhere, colour kept to the edges of a black surface, motion only on entry, and real screenshots instead of invented diagrams.",
      "Next.js App Router, prerendered at build time. Projects are typed data, posts are MDX validated with Zod, and one newsletter endpoint is the only dynamic route.",
      "Deployed continuously, MIT licensed, and rewritten whenever the status of the work changes.",
    ],
    category: "Personal site",
    state: "live",
    stateNote: "deployed continuously",
    year: "2025 to present",
    role: "Design and engineering",
    snapshot: [
      {
        label: "What it does",
        value:
          "Project records, blog posts from MDX, a newsletter signup backed by Brevo, RSS, sitemap, and JSON-LD for every page.",
      },
      {
        label: "Why it exists",
        value:
          "One link that answers what I am building without a call. Every project page is written as a record, not a pitch.",
      },
      {
        label: "Rendering",
        value:
          "Next.js App Router. Every route is prerendered at build time. The newsletter endpoint is the only dynamic route.",
      },
      {
        label: "Source",
        value:
          "MIT licensed. Content lives in the repo: projects in TypeScript, posts in MDX.",
      },
    ],
    stack: [
      { title: "Framework", items: ["nextjs", "react", "typescript"] },
      { title: "Interface", items: ["tailwind", "framer"] },
      {
        title: "Content",
        items: ["mdx", "zod"],
        note: "remark-gfm, rehype-slug, autolinked headings, Shiki highlighting through rehype-pretty-code.",
      },
      { title: "Newsletter", items: ["brevo"] },
      { title: "Delivery", items: ["vercel", "github"] },
    ],
    links: [
      { label: "Visit site", href: "https://arjunkuttikkat.com", kind: "primary" },
      {
        label: "View on GitHub",
        href: "https://github.com/arjun-kuttikkat/arjunkuttikkat.com",
        kind: "source",
      },
    ],
    accent: "cyan",
    featured: false,
    order: 2,
    homeOrder: 1,
    logo: "/logo.png",
    visualTheme: "editorial",
    hoverGlow: "group-hover:drop-shadow-[0_0_22px_rgba(34,211,238,0.55)]",
    surfaceClass: "bg-gradient-to-br from-cyan-300/10 via-black to-black",
    hoverAuraA: "bg-cyan-400/10",
    hoverAuraB: "bg-sky-300/10",
    homeTeaser: "This site. Next.js, MDX, static generation.",
  },
  {
    slug: "compass",
    name: "Compass",
    summary:
      "Compass is a browser-based codebase explorer that maps files, dependencies, architecture roles, and change impact without uploading the repository.",
    tagline: "Understand an unfamiliar codebase without uploading it.",
    tldr: [
      "Huaicheng Su's earlier JetBrains dependency-visualisation plugin became a broader browser-first explorer during the Collabute × TheBlock hackathon.",
      "Open a local repository and Compass turns its files and internal dependencies into an interactive graph, with architecture roles, isolated files, and a recommended reading order.",
      "The path is open, map, explore, ask: local parsing builds the structure before the developer follows change impact or asks a grounded question.",
      "Selecting a file exposes its role, dependencies, dependents, and transitive change impact, with a file-scoped assistant grounded in that context.",
      "Source stays on the machine. Collaboration publishes a derived digest of paths, identifiers, roles, packages, and dependency edges rather than repository contents.",
      "The browser analyzer, Convex collaboration layer, grounded AI tools, and external dependency intelligence form three distinct layers.",
      "Vite, D3, Web Workers, Convex, Groq, Context.dev, npm, PyPI, and OSV keep the implementation focused on analysis and exploration.",
      "Released under the MIT License after the August 2026 hackathon; functional and public, but not operated as a commercial product.",
    ],
    category: "Developer tools",
    state: "hackathon",
    stateNote: "public open-source build",
    year: "Aug 2026",
    role: "Builder",
    team: "with Huaicheng Su",
    context: "Collabute × TheBlock",
    snapshot: [
      {
        label: "What it does",
        value:
          "Maps a local repository as files and dependency edges, then exposes architecture roles, reading order, isolated files, and transitive change impact.",
      },
      {
        label: "Languages",
        value: "Java, Kotlin, JavaScript, TypeScript, and Python.",
      },
      {
        label: "Privacy model",
        value:
          "Analysis happens in the browser. Shared projects store derived structure rather than source contents.",
      },
      {
        label: "Result",
        value:
          "A functional public hackathon build with the analyzer, collaborative backend, dependency intelligence, tests, and an MIT licence.",
      },
    ],
    stack: [
      {
        title: "Interface",
        note: "Browser application and graph exploration.",
        items: ["javascript", "vite", "d3"],
      },
      {
        title: "Analysis",
        note: "Local parsing and dependency mapping stay off the main UI thread.",
        items: ["webWorkers", "java", "kotlin", "typescript", "python"],
      },
      {
        title: "Backend",
        note: "Realtime shared state and server-side actions.",
        items: ["convex"],
      },
      {
        title: "AI",
        note: "Repository taxonomy, file summaries, and grounded codebase questions.",
        items: ["groq", "gptOss"],
      },
      {
        title: "Dependency intelligence",
        note: "Package versions, advisories, and migration context.",
        items: ["contextDev", "npmRegistry", "pypi", "osv"],
      },
      { title: "Deployment", items: ["vercel", "github"] },
    ],
    links: [
      {
        label: "Open Compass",
        href: "https://compass-edgaze.vercel.app/",
        kind: "primary",
      },
      {
        label: "View source",
        href: "https://github.com/arjun-kuttikkat/compass",
        kind: "source",
      },
    ],
    sourceNote: "Open source under the MIT License.",
    accent: "orange",
    featured: false,
    order: 3,
    homeOrder: 3,
    logo: "/favicon.svg",
    visualTheme: "compass",
    hoverGlow: "group-hover:drop-shadow-[0_0_22px_rgba(232,115,31,0.6)]",
    surfaceClass: "bg-gradient-to-br from-orange-400/14 via-black to-zinc-950",
    hoverAuraA: "bg-orange-400/12",
    hoverAuraB: "bg-amber-300/8",
    homeTeaser: "Local dependency maps, change impact, and grounded codebase Q&A.",
  },
  {
    slug: "aura",
    name: "Aura",
    summary:
      "An Android marketplace prototype on Solana where an in-person sale is enforced by escrow, co-presence checks, an NFC-signed handover, and an on-chain receipt.",
    tagline: "Peer-to-peer sales without trusting the other person.",
    tldr: [
      "Marketplace sales break where the software stops: two people leave the app to meet, and nothing can verify the item, the money, or the handover.",
      "Aura splits trust three ways — the phone guides the exchange, Solana holds the money, and a secure NFC tag proves the physical object was there.",
      "Four steps: the seller records the item, the buyer locks funds in an Anchor escrow, both devices confirm co-presence, and the tap releases escrow and mints an on-chain receipt.",
      "The handover had to be provable. An NTAG 424 DNA tag signs a fresh message on every tap and the backend verifies it, so a screenshot or replay cannot stand in for the tap.",
      "Kotlin and Compose on Android, Anchor and Metaplex on Solana, Supabase Edge Functions for verification.",
      "A complete hackathon prototype from the Monolith Solana Mobile Hackathon, built with Wasif Waseem and Huaicheng Su. Not deployed, no users.",
    ],
    category: "Mobile / commerce",
    state: "hackathon",
    stateNote: "not deployed",
    year: "2026",
    role: "Builder",
    team: "with Wasif Waseem and Huaicheng Su",
    context: "Monolith Solana Mobile Hackathon",
    snapshot: [
      {
        label: "What it does",
        value:
          "A buyer locks funds in escrow before meeting. At the meetup both devices verify presence, the item's NFC tag signs the handover, and settlement releases funds and mints a receipt.",
      },
      {
        label: "Why",
        value:
          "Marketplace meetups still run on screenshots and trust. Aura tests whether each step can be verified instead.",
      },
      {
        label: "What we built",
        value:
          "Kotlin app with Compose, Anchor programs for escrow and settlement, a Supabase backend that verifies NFC proofs.",
      },
      {
        label: "Result",
        value:
          "Working end-to-end demo of listing → escrow → handover → receipt. Not a shipped consumer product.",
      },
    ],
    stack: [
      { title: "Mobile", items: ["kotlin", "compose", "android"] },
      { title: "Chain", items: ["solana", "anchor", "metaplex", "helius"] },
      {
        title: "Backend",
        items: ["supabase"],
        note: "Edge Functions verify NFC payloads and coordinate settlement so keys never reach the client.",
      },
      { title: "Hardware & vision", items: ["nfc", "mlkit"] },
    ],
    links: [
      {
        label: "View on GitHub",
        href: "https://github.com/arjun-kuttikkat/Aura",
        kind: "source",
      },
    ],
    accent: "amber",
    featured: false,
    order: 4,
    homeOrder: 4,
    logo: "/aura.png",
    visualTheme: "route",
    hoverGlow: "group-hover:drop-shadow-[0_0_22px_rgba(251,191,36,0.55)]",
    surfaceClass: "bg-gradient-to-br from-amber-300/10 via-black to-black",
    hoverAuraA: "bg-amber-400/10",
    hoverAuraB: "bg-orange-400/10",
    homeTeaser: "Escrow, NFC handover proof, on-chain receipt. Solana hackathon.",
  },
  {
    slug: "autoresolve",
    name: "AutoResolve",
    summary:
      "A customer-side email agent that watches a support thread, tracks the case, sends guarded follow-ups, and hands back to a human when a reply needs judgment.",
    tagline: "An agent that chases your support case for you.",
    tldr: [
      "A week spent chasing OpenAI support showed the problem was not difficulty, it was follow-through: companies run agents on their queue, customers still work theirs by hand.",
      "AutoResolve gives the customer an agent inside the existing Gmail thread, so neither side has to adopt a new tool.",
      "The loop: connect Gmail and state the objective, a worker tracks the case, routine turns get drafted and sent, and anything sensitive is handed back.",
      "The hard parts were knowing when not to send — refunds, account access, money, policy — and keeping a structured case record so a long thread is not read as a new conversation each time.",
      "Next.js front end, Node workers on a Redis queue, PostgreSQL for case state, the Gmail API for the thread, all in Docker.",
      "Third place in 48 hours at the AI Agent Innovation Hackathon, built with Huaicheng Su. Never run on a real inbox.",
    ],
    category: "Automation",
    state: "hackathon",
    stateNote: "48-hour build, not deployed",
    year: "2026",
    role: "Builder",
    team: "with Huaicheng Su",
    context: "AI Agent Innovation Hackathon · 3rd place",
    snapshot: [
      {
        label: "What it does",
        value:
          "Connect Gmail, describe the dispute. The agent monitors the thread, drafts replies from the case state, sends within rules, and pauses on sensitive turns.",
      },
      {
        label: "Why",
        value:
          "A week spent chasing OpenAI support over a small issue. The work was not hard; it was follow-through.",
      },
      {
        label: "What we built",
        value:
          "Next.js front end, Node workers on a Redis queue, Postgres case state, Gmail API thread monitoring and sending, all run locally in Docker.",
      },
      {
        label: "Result",
        value:
          "3rd place. Validated the customer-side angle; never deployed to real inboxes.",
      },
    ],
    stack: [
      { title: "Interface", items: ["nextjs", "react", "typescript"] },
      { title: "Workers & data", items: ["nodejs", "postgresql", "redis"] },
      { title: "Integration", items: ["gmail"] },
      { title: "Local infrastructure", items: ["docker"] },
    ],
    links: [
      {
        label: "View on GitHub",
        href: "https://github.com/arjun-kuttikkat/AutoResolve",
        kind: "source",
      },
    ],
    accent: "teal",
    featured: false,
    order: 5,
    homeOrder: 5,
    logo: "/Autoresolve.png",
    visualTheme: "resolver",
    hoverGlow: "group-hover:drop-shadow-[0_0_22px_rgba(45,212,191,0.55)]",
    surfaceClass: "bg-gradient-to-br from-teal-300/10 via-black to-black",
    hoverAuraA: "bg-teal-400/10",
    hoverAuraB: "bg-cyan-300/10",
    homeTeaser: "Gmail agent for support disputes. 3rd place, 48 hours.",
  },
  {
    slug: "health-signal",
    name: "Health Signal",
    summary:
      "A prototype that turns post-surgery home reports (pain, temperature, medication, symptoms) into a timeline and flags deviation from expected recovery.",
    tagline: "Recovery data as a timeline, not a dashboard.",
    tldr: [
      "After surgery the monitoring continues but the interpretation stops, so patients dismiss real change or worry about normal variation.",
      "Health Signal keeps a calm recovery timeline between patient and clinician, and leads with a plain-language summary rather than a dashboard.",
      "Short daily check-ins on pain, temperature, medication, and symptoms become one continuous history compared against the shape recovery should take.",
      "The design problem was where to place the boundary between normal variation and meaningful change: an alert can be technically correct and still harmful.",
      "Mobile-first Next.js for input and summaries, Python for the time-series processing and deviation logic. No production infrastructure by choice.",
      "A research prototype from Future Hack in Dubai Knowledge Park / DIAC. Not deployed, and not a clinical system.",
    ],
    category: "Health",
    state: "prototype",
    stateNote: "research build, not deployed",
    year: "2026",
    role: "Builder",
    context: "Future Hack · Dubai Knowledge Park / DIAC, with Smart Salem and Mediclinic",
    snapshot: [
      {
        label: "What it does",
        value:
          "Patients log a few values a day on their phone. The system keeps a continuous timeline and compares change against an expected recovery curve rather than fixed thresholds.",
      },
      {
        label: "Why",
        value:
          "After discharge, monitoring continues but interpretation stops. Patients under- or over-react to normal variation.",
      },
      {
        label: "What I built",
        value:
          "Mobile-first Next.js input and summary views; Python processing for the time-series and deviation logic.",
      },
      {
        label: "Result",
        value:
          "Research prototype shown at Future Hack. Not deployed and not a clinical system.",
      },
    ],
    stack: [
      { title: "Interface", items: ["nextjs", "react", "typescript"] },
      {
        title: "Analysis",
        items: ["python"],
        note: "Time-series processing and deviation-from-expected detection.",
      },
    ],
    links: [],
    accent: "violet",
    featured: false,
    order: 6,
    homeOrder: 6,
    logo: "/healthsignal.png",
    visualTheme: "signal",
    hoverGlow: "group-hover:drop-shadow-[0_0_22px_rgba(129,140,248,0.55)]",
    surfaceClass: "bg-gradient-to-r from-black via-zinc-950 to-black",
    hoverAuraA: "bg-indigo-400/10",
    hoverAuraB: "bg-violet-400/10",
    homeTeaser: "Post-surgery timeline with deviation flags. Health hackathon.",
  },
];

const HOME_BENTO_SLUGS = [
  "arjunkuttikkat-com",
  "aura",
  "autoresolve",
  "edgaze",
  "compass",
  "health-signal",
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
