/**
 * Static facts about Edgaze used across the site.
 *
 * Everything here is taken from public Edgaze surfaces (edgaze.ai/docs, status.edgaze.ai,
 * the Edgaze MCP server) as of September 2026. It is deliberately a plain data module so a
 * later live integration (API / status feed) can replace individual fields without touching
 * the components that render them.
 */

export const EDGAZE_URL = "https://edgaze.ai";

export const edgazeLinks = {
  home: EDGAZE_URL,
  marketplace: `${EDGAZE_URL}/marketplace`,
  builder: `${EDGAZE_URL}/builder`,
  templates: `${EDGAZE_URL}/templates`,
  docs: `${EDGAZE_URL}/docs`,
  api: `${EDGAZE_URL}/docs/api`,
  mcp: `${EDGAZE_URL}/docs/mcp`,
  changelog: `${EDGAZE_URL}/docs/changelog`,
  creators: `${EDGAZE_URL}/creators`,
  status: "https://status.edgaze.ai",
  profile: `${EDGAZE_URL}/profile/arjun_kuttikkat`,
  blogs: `${EDGAZE_URL}/blogs`,
} as const;

/** Product surfaces linked from the site footer. */
export const edgazeFooterLinks = [
  { label: "Marketplace", href: edgazeLinks.marketplace },
  { label: "Workflow Studio", href: edgazeLinks.builder },
  { label: "Documentation", href: edgazeLinks.docs },
  { label: "API reference", href: edgazeLinks.api },
  { label: "Status", href: edgazeLinks.status },
] as const;

/** Workflow Studio blocks documented at edgaze.ai/docs/builder/nodes/*. */
export const edgazeBlocks = [
  { name: "Workflow Input", kind: "io" },
  { name: "Workflow Form", kind: "io" },
  { name: "Workflow Output", kind: "io" },
  { name: "LLM Chat", kind: "model" },
  { name: "LLM Image", kind: "model" },
  { name: "LLM Embeddings", kind: "model" },
  { name: "HTTP Request", kind: "tool" },
  { name: "Web Scrape", kind: "tool" },
  { name: "YouTube Transcript", kind: "tool" },
  { name: "JSON Parse", kind: "data" },
  { name: "Template", kind: "data" },
  { name: "Merge", kind: "data" },
  { name: "Merge Objects", kind: "data" },
  { name: "Map", kind: "control" },
  { name: "Loop", kind: "control" },
  { name: "Condition", kind: "control" },
  { name: "Delay", kind: "control" },
  { name: "Run Another Workflow", kind: "control" },
] as const;

export const edgazeBlockKinds: Record<(typeof edgazeBlocks)[number]["kind"], string> = {
  io: "Input / output",
  model: "Models",
  tool: "Tools",
  data: "Data",
  control: "Control flow",
};

export type EdgazeStage = {
  id: "build" | "execute" | "distribute" | "integrate";
  label: string;
  title: string;
  /** One factual sentence. Rendered on the homepage; no bullet lists. */
  detail: string;
  href: string;
};

/** The four stages a workflow moves through. Order matters — rendered as a flow. */
export const edgazeStages: EdgazeStage[] = [
  {
    id: "build",
    label: "Build",
    title: "Workflow Studio",
    detail: `A node-based canvas with ${edgazeBlocks.length} block types, templates, Composer for AI-assisted edits, and a vault for provider keys.`,
    href: edgazeLinks.builder,
  },
  {
    id: "execute",
    label: "Execute",
    title: "Hosted runtime",
    detail:
      "An execution engine and workers run the graph. Every run is version-pinned and persisted with a durable event log.",
    href: `${EDGAZE_URL}/docs/managed-execution`,
  },
  {
    id: "distribute",
    label: "Distribute",
    title: "Marketplace",
    detail:
      "Publishing creates a product page with a price per run. Buyers pay from a wallet or bundle; creators keep 80% of margin.",
    href: edgazeLinks.marketplace,
  },
  {
    id: "integrate",
    label: "Run from anywhere",
    title: "API and MCP",
    detail:
      "The same published workflow runs from a backend over REST, with SSE and signed webhooks, or from an agent over MCP.",
    href: edgazeLinks.api,
  },
];

/** Run lifecycle as exposed by the public API event log. */
export const edgazeRunEvents = [
  {
    event: "run.queued",
    note: "First durable acceptance marker. POST /runs has returned 202.",
  },
  {
    event: "run.preparing",
    note: "Inputs validated against the published envelope; version pinned.",
  },
  { event: "run.started", note: "Graph execution begins on the workers." },
  {
    event: "node.output.delta",
    note: "Sanitized per-node progress, streamed over SSE or read from the event log.",
  },
  {
    event: "run.completed",
    note: "Terminal. Displayed price settles from wallet or bundle.",
  },
  {
    event: "run.failed / run.cancelled",
    note: "Terminal. Margin is released; nothing is charged to the buyer.",
  },
] as const;

export const edgazeRunStatuses = [
  "pending",
  "running",
  "completed",
  "failed",
  "cancelled",
] as const;

export const edgazeApi = {
  baseUrl: "https://api.edgaze.ai/v1",
  auth: "Authorization: Bearer edgaze_sk_live_…",
  scopes: ["run:execute", "run:read", "workflow:write"],
  endpoints: [
    { method: "GET", path: "/workflows", note: "List catalog workflows" },
    {
      method: "GET",
      path: "/workflows/{id}",
      note: "Input schema, price, credential mode",
    },
    {
      method: "GET",
      path: "/workflows/{id}/versions",
      note: "Immutable versions and pins",
    },
    {
      method: "POST",
      path: "/workflows/{id}/accept-update",
      note: "Re-pin a buyer to the active version",
    },
    { method: "POST", path: "/runs", note: "Start a run · 202 · Idempotency-Key" },
    { method: "GET", path: "/runs", note: "Run history for the account" },
    { method: "GET", path: "/runs/{id}", note: "Status, outputs, charge" },
    { method: "GET", path: "/runs/{id}/events", note: "Durable ordered event log" },
    {
      method: "GET",
      path: "/runs/{id}/stream",
      note: "SSE · resumable with Last-Event-ID",
    },
    {
      method: "POST",
      path: "/runs/{id}/cancel",
      note: "Cancel an in-flight run · idempotent",
    },
  ],
  webhooks: {
    events: ["run.completed", "run.failed", "run.cancelled"],
    signature: "edgaze-signature: t=…,v1=…  (HMAC-SHA256 over `{timestamp}.{body}`)",
    delivery:
      "Best-effort single delivery, 5 s timeout, reject signatures older than 5 minutes.",
  },
  openapi: "https://api.edgaze.ai/v1/openapi",
} as const;

export const edgazeMcp = {
  server: "https://mcp.edgaze.ai",
  tools: [
    { name: "edgaze_catalog", note: "Categories and published counts" },
    { name: "edgaze_search", note: "Find workflows by what they do" },
    { name: "edgaze_inspect", note: "Input schema, price, demo availability" },
    { name: "edgaze_run", note: "Start a run with a max_cost_usd ceiling" },
    { name: "edgaze_watch", note: "Cursor-based output until terminal" },
  ],
  clients: [
    "Cursor",
    "Claude Code",
    "Claude",
    "ChatGPT",
    "Codex",
    "VS Code",
    "Windsurf",
    "OpenCode",
  ],
} as const;

/** Numbers stated in public billing docs. */
export const edgazeBilling = [
  {
    label: "Buyer funding",
    value: "Wallet (min. $10 top-up) or 5/10-run bundles pinned to one workflow version",
  },
  {
    label: "Creator earnings",
    value: "80% of margin per successful run; platform keeps 20% of margin",
  },
  {
    label: "Compute",
    value:
      "Estimated at publish time and added to the displayed price, separate from margin",
  },
  {
    label: "Clearing and payout",
    value: "Pending → available over 7 days, weekly payout once available ≥ $25",
  },
  { label: "Margin limits", value: "$0.05 to $50.00 per run" },
  {
    label: "Failed runs",
    value: "Not charged. Margin released; ordinary compute absorbed by Edgaze",
  },
  {
    label: "Credential modes",
    value:
      "Edgaze-hosted · creator-connected keys · buyer BYOK ($0.002 orchestration fee)",
  },
  {
    label: "Edgaze Plus",
    value:
      "$20 / month: Composer, BYOK, private and unlisted workflows, failover control",
  },
  {
    label: "Payment rails",
    value: "Stripe for checkout, Stripe Connect for creator onboarding and payouts",
  },
] as const;

/** Model providers named in the public model catalog. */
export const edgazeModelProviders = [
  {
    name: "OpenAI",
    note: "GPT-5.6 tiers (Terra, Sol, Luna), OpenAI Image 1.5, embeddings",
  },
  { name: "Anthropic", note: "Claude Opus 5, Claude Sonnet 5" },
  { name: "Google", note: "Gemini text and image models" },
  {
    name: "Azure-hosted capacity",
    note: "GPT-5.6 tiers, Kimi K2.6, DeepSeek V4 Pro for platform-funded runs",
  },
] as const;

/** Components on the public status page (status.edgaze.ai). */
export const edgazeMonitoredServices = [
  "Marketing site",
  "Web app",
  "Public API",
  "MCP server",
  "Execution engine",
  "Execution workers",
  "Redis Streams",
  "Marketplace",
  "Payments / billing",
  "Run integrity",
  "Money integrity",
] as const;

export const edgazeTimeline = [
  {
    date: "Feb 15, 2026",
    title: "Public launch",
    note: "Marketplace, workflow builder, accounts, docs, and creator publishing opened.",
  },
  {
    date: "Mar 15, 2026",
    title: "Per-run billing",
    note: "Wallet-funded runs, version-pinned bundles, creator margin earnings, Stripe Connect payouts.",
  },
  {
    date: "Jul 19, 2026",
    title: "Runtime contract",
    note: "Canonical public run state, resumable SSE streaming, explicit credential modes. Prompt Studio retired.",
  },
] as const;

export const edgazeState = {
  label: "Live",
  since: "February 2026",
  company: "Edge Platforms, Inc.",
  note: "Operating in production and actively acquiring creators and buyers. Incidents are posted publicly on the status page.",
} as const;
