import { buildLlmsFullTxt } from "../../lib/seo/llms";

export const dynamic = "force-static";

/**
 * `/llms-full.txt` — the entire site content as one Markdown document: every
 * project summary and every published post body. A single fetch ingests the
 * whole site, which is what most LLM tooling prefers.
 */
export function GET() {
  return new Response(buildLlmsFullTxt(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex, follow",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
