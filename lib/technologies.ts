import type { ComponentType, SVGProps } from "react";
import {
  SiAndroid,
  SiGoogleads,
  SiGoogleanalytics,
  SiGoogletagmanager,
  SiMixpanel,
  SiAnthropic,
  SiBrevo,
  SiCloudflare,
  SiDocker,
  SiFramer,
  SiGithub,
  SiGmail,
  SiGoogle,
  SiGooglegemini,
  SiJetpackcompose,
  SiKotlin,
  SiMdx,
  SiModelcontextprotocol,
  SiNextdotjs,
  SiNfc,
  SiNodedotjs,
  SiOpenai,
  SiOpenapiinitiative,
  SiPostgresql,
  SiPosthog,
  SiPython,
  SiReact,
  SiRedis,
  SiSolana,
  SiStripe,
  SiSupabase,
  SiTailwindcss,
  SiTemporal,
  SiTypescript,
  SiVercel,
  SiXyflow,
  SiZod
} from "react-icons/si";
import { AzureIcon } from "../components/icons/azure-icon";
import { CloudflareLogo } from "../components/icons/cloudflare-logo";
import { DeepSeekIcon } from "../components/icons/deepseek-icon";
import { KimiIcon } from "../components/icons/kimi-icon";
import { MicrosoftLogo } from "../components/icons/microsoft-logo";
import { PostHogLogo } from "../components/icons/posthog-logo";

export type TechIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type Technology = {
  id: string;
  name: string;
  /** Simple Icons component, or a local SVG with the same 24×24 viewBox. Absent = wordmark fallback. */
  icon?: TechIcon;
  website: string;
  /**
   * Optical size correction. Simple Icons share a 24px box but differ in visual mass
   * (a thin wordmark reads smaller than a filled square). 1 = default.
   */
  scale?: number;
  /** Brand colour used only on hover; the resting state is monochrome. */
  brand?: string;
};

const define = <T extends Record<string, Omit<Technology, "id">>>(t: T) =>
  Object.fromEntries(Object.entries(t).map(([id, v]) => [id, { id, ...v }])) as {
    [K in keyof T]: Technology;
  };

export const technologies = define({
  nextjs: { name: "Next.js", icon: SiNextdotjs, website: "https://nextjs.org", brand: "#ffffff" },
  react: { name: "React", icon: SiReact, website: "https://react.dev", brand: "#61dafb" },
  typescript: {
    name: "TypeScript",
    icon: SiTypescript,
    website: "https://www.typescriptlang.org",
    scale: 0.92,
    brand: "#3178c6"
  },
  nodejs: { name: "Node.js", icon: SiNodedotjs, website: "https://nodejs.org", brand: "#5fa04e" },
  python: { name: "Python", icon: SiPython, website: "https://www.python.org", brand: "#3776ab" },
  tailwind: {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    website: "https://tailwindcss.com",
    brand: "#06b6d4"
  },
  framer: {
    name: "Framer Motion",
    icon: SiFramer,
    website: "https://motion.dev",
    scale: 0.88,
    brand: "#ffffff"
  },
  mdx: { name: "MDX", icon: SiMdx, website: "https://mdxjs.com", scale: 1.05, brand: "#fcb32c" },
  zod: { name: "Zod", icon: SiZod, website: "https://zod.dev", brand: "#3e67b1" },
  reactflow: {
    name: "React Flow",
    icon: SiXyflow,
    website: "https://reactflow.dev",
    scale: 0.92,
    brand: "#ff0072"
  },
  postgresql: {
    name: "PostgreSQL",
    icon: SiPostgresql,
    website: "https://www.postgresql.org",
    brand: "#4169e1"
  },
  supabase: { name: "Supabase", icon: SiSupabase, website: "https://supabase.com", brand: "#3fcf8e" },
  redis: { name: "Redis Streams", icon: SiRedis, website: "https://redis.io", brand: "#ff4438" },
  vercel: { name: "Vercel", icon: SiVercel, website: "https://vercel.com", scale: 0.9, brand: "#ffffff" },
  cloudflare: {
    name: "Cloudflare Turnstile",
    icon: SiCloudflare,
    website: "https://www.cloudflare.com/products/turnstile/",
    scale: 1.08,
    brand: "#f38020"
  },
  azure: { name: "Microsoft Azure", icon: AzureIcon, website: "https://azure.microsoft.com", brand: "#0078d4" },
  azureContainerApps: {
    name: "Azure Container Apps",
    icon: AzureIcon,
    website: "https://azure.microsoft.com/products/container-apps",
    brand: "#0078d4"
  },
  azurePostgres: {
    name: "Azure Database for PostgreSQL",
    icon: SiPostgresql,
    website: "https://azure.microsoft.com/products/postgresql",
    brand: "#4169e1"
  },
  azureRedis: {
    name: "Azure Cache for Redis",
    icon: SiRedis,
    website: "https://azure.microsoft.com/products/cache",
    brand: "#ff4438"
  },
  temporal: {
    name: "Temporal",
    icon: SiTemporal,
    website: "https://temporal.io",
    scale: 0.9,
    brand: "#6c49e0"
  },
  deepseek: {
    name: "DeepSeek",
    icon: DeepSeekIcon,
    website: "https://www.deepseek.com",
    scale: 0.95,
    brand: "#4d6bfe"
  },
  kimi: {
    name: "Kimi (Moonshot AI)",
    icon: KimiIcon,
    website: "https://www.moonshot.ai",
    scale: 0.92,
    brand: "#1a1a1a"
  },
  docker: { name: "Docker", icon: SiDocker, website: "https://www.docker.com", scale: 1.08, brand: "#2496ed" },
  github: { name: "GitHub", icon: SiGithub, website: "https://github.com", brand: "#ffffff" },
  stripe: { name: "Stripe", icon: SiStripe, website: "https://stripe.com", scale: 0.95, brand: "#635bff" },
  stripeConnect: {
    name: "Stripe Connect",
    icon: SiStripe,
    website: "https://stripe.com/connect",
    scale: 0.95,
    brand: "#635bff"
  },
  posthog: { name: "PostHog", icon: SiPosthog, website: "https://posthog.com", scale: 1.05, brand: "#f9bd2b" },
  brevo: { name: "Brevo", icon: SiBrevo, website: "https://www.brevo.com", brand: "#0b996e" },
  openai: { name: "OpenAI", icon: SiOpenai, website: "https://openai.com", brand: "#ffffff" },
  anthropic: { name: "Anthropic", icon: SiAnthropic, website: "https://www.anthropic.com", scale: 0.9, brand: "#d4a27f" },
  gemini: {
    name: "Google Gemini",
    icon: SiGooglegemini,
    website: "https://deepmind.google/technologies/gemini/",
    brand: "#8e75b2"
  },
  mcp: {
    name: "Model Context Protocol",
    icon: SiModelcontextprotocol,
    website: "https://modelcontextprotocol.io",
    brand: "#ffffff"
  },
  openapi: {
    name: "OpenAPI 3.1",
    icon: SiOpenapiinitiative,
    website: "https://www.openapis.org",
    brand: "#6ba539"
  },
  vercelAnalytics: { name: "Vercel Analytics", icon: SiVercel, website: "https://vercel.com/analytics", scale: 0.9, brand: "#ffffff" },
  speedInsights: { name: "Vercel Speed Insights", icon: SiVercel, website: "https://vercel.com/docs/speed-insights", scale: 0.9, brand: "#ffffff" },
  mixpanel: { name: "Mixpanel", icon: SiMixpanel, website: "https://mixpanel.com", scale: 1.05, brand: "#7856ff" },
  googleTagManager: {
    name: "Google Tag Manager",
    icon: SiGoogletagmanager,
    website: "https://tagmanager.google.com",
    scale: 0.95,
    brand: "#8ab4f8"
  },
  googleAds: { name: "Google Ads", icon: SiGoogleads, website: "https://ads.google.com", scale: 0.95, brand: "#4285f4" },
  googleAnalytics: {
    name: "Google Analytics",
    icon: SiGoogleanalytics,
    website: "https://analytics.google.com",
    scale: 0.95,
    brand: "#e37400"
  },
  sse: { name: "Server-Sent Events", website: "https://developer.mozilla.org/docs/Web/API/Server-sent_events" },
  webhooks: { name: "Signed webhooks", website: "https://www.edgaze.ai/docs/api/webhooks" },
  kotlin: { name: "Kotlin", icon: SiKotlin, website: "https://kotlinlang.org", scale: 0.86, brand: "#7f52ff" },
  android: { name: "Android", icon: SiAndroid, website: "https://developer.android.com", brand: "#34a853" },
  compose: {
    name: "Jetpack Compose",
    icon: SiJetpackcompose,
    website: "https://developer.android.com/compose",
    brand: "#4285f4"
  },
  solana: { name: "Solana", icon: SiSolana, website: "https://solana.com", scale: 0.92, brand: "#9945ff" },
  anchor: { name: "Anchor", website: "https://www.anchor-lang.com" },
  metaplex: { name: "Metaplex", website: "https://www.metaplex.com" },
  helius: { name: "Helius RPC", website: "https://www.helius.dev" },
  nfc: { name: "NFC · NTAG 424 DNA", icon: SiNfc, website: "https://www.nxp.com/products/NTAG424DNA", scale: 1.05, brand: "#002e5f" },
  mlkit: { name: "Google ML Kit", icon: SiGoogle, website: "https://developers.google.com/ml-kit", scale: 0.9, brand: "#4285f4" },
  gmail: { name: "Gmail API", icon: SiGmail, website: "https://developers.google.com/gmail/api", scale: 0.95, brand: "#ea4335" }
});

export type StartupProgram = {
  id: "microsoftStartups" | "posthogStartups" | "cloudflareStartups";
  label: string;
  href: string;
  icon: TechIcon;
  /**
   * Intrinsic aspect ratio of the mark (width / height), taken from its viewBox.
   * Logos are rendered at a shared height, so the width follows from this.
   */
  aspect: number;
  /** Extra props for the mark, e.g. a dark-surface fill override. */
  iconProps?: Record<string, string>;
};

/**
 * Startup programs backing Edgaze. Logos are the official marks with their brand
 * colours baked in, so they are never recoloured.
 */
export const startupPrograms: StartupProgram[] = [
  {
    id: "microsoftStartups",
    label: "Microsoft for Startups",
    href: "https://www.microsoft.com/en-us/startups",
    icon: MicrosoftLogo,
    aspect: 1
  },
  {
    id: "posthogStartups",
    label: "PostHog for Startups",
    href: "https://posthog.com/startups",
    icon: PostHogLogo,
    aspect: 52 / 28,
    // The head of the mark ships as #111 and would disappear on the black surface.
    iconProps: { markFill: "#fafafa" }
  },
  {
    id: "cloudflareStartups",
    label: "Cloudflare for Startups",
    href: "https://www.cloudflare.com/startups/",
    icon: CloudflareLogo,
    aspect: 341 / 156
  }
];

export type TechId = keyof typeof technologies;

export type StackGroup = {
  title: string;
  items: TechId[];
  /** Optional one-liner shown under the group title when it adds information. */
  note?: string;
};

export function getTechnology(id: TechId): Technology {
  return technologies[id];
}

export function stackTechnologyNames(groups: StackGroup[]): string[] {
  return [...new Set(groups.flatMap((g) => g.items))].map((id) => technologies[id].name);
}
