import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "../lib/site";

/**
 * LLM crawlers the site explicitly welcomes. `Allow: /` for `*` already permits
 * every crawler; listing the well-known training/retrieval bots is an explicit
 * signal that this site opts in to LLM crawling and indexing.
 */
const llmCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "CCBot",
  "Google-Extended",
  "meta-externalagent",
  "Amazonbot",
  "Applebot-Extended",
  "cohere-ai",
  "YouBot",
  "Diffbot"
] as const;

export default function robots(): MetadataRoute.Robots {
  const rules: MetadataRoute.Robots["rules"] = [
    { userAgent: "*", allow: "/" },
    ...llmCrawlers.map((userAgent) => ({ userAgent, allow: "/" as const }))
  ];

  return {
    rules,
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl
  };
}
