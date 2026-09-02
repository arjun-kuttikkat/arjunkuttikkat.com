import { buildPostMarkdown } from "../../../../lib/seo/llms";
import { getPublishedSlugs } from "../../../../lib/blogs/load";
import { notFound } from "next/navigation";
import type { NextRequest } from "next/server";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getPublishedSlugs().map((slug) => ({ slug }));
}

type Context = { params: Promise<{ slug: string }> };

/**
 * `/blogs/[slug]/md` — a single post as clean Markdown (frontmatter stripped,
 * metadata block prepended). Lets an LLM fetch one post without the page chrome.
 */
export async function GET(_request: NextRequest, { params }: Context) {
  const { slug } = await params;
  const markdown = buildPostMarkdown(slug);
  if (!markdown) notFound();

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex, follow",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
