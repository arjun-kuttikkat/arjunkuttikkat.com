import { buildLlmsTxt } from "../../lib/seo/llms";

export const dynamic = "force-static";

/**
 * `/llms.txt` — llmstxt.org discovery file. A short Markdown overview of the
 * site that an LLM can read to understand what is here and where to fetch each
 * piece (HTML pages, per-post Markdown, and the full-content file).
 */
export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      // Alternate machine-readable formats are not meant to compete with the
      // canonical HTML pages in search results, so keep them out of the index
      // while leaving them fully fetchable by LLM crawlers (allowed in robots).
      "X-Robots-Tag": "noindex, follow",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
