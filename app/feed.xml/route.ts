import { getPublishedPostsMeta } from "../../lib/blogs/meta";
import {
  absoluteImageUrl,
  absoluteUrl,
  contactEmail,
  siteDescription,
  siteTitle,
  siteUrl
} from "../../lib/site";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function imageMimeType(imageUrl: string): string {
  if (imageUrl.endsWith(".png")) return "image/png";
  if (imageUrl.endsWith(".webp")) return "image/webp";
  if (imageUrl.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}

export function GET() {
  const posts = getPublishedPostsMeta();
  const latestDate = posts[0]?.updatedAt ?? posts[0]?.date ?? new Date().toISOString();

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blogs/${post.slug}`);
      const coverImage = post.coverImage ? absoluteImageUrl(post.coverImage) : undefined;

      return [
        "<item>",
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${url}</link>`,
        `<guid>${url}</guid>`,
        `<pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
        `<description>${escapeXml(post.description)}</description>`,
        coverImage
          ? `<enclosure url="${coverImage}" type="${imageMimeType(coverImage)}" />`
          : "",
        "</item>"
      ]
        .filter(Boolean)
        .join("");
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>en-us</language>
    <managingEditor>${contactEmail} (${escapeXml(siteTitle)})</managingEditor>
    <lastBuildDate>${new Date(latestDate).toUTCString()}</lastBuildDate>
    <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
