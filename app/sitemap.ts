import { getPublishedPostsMeta } from "../lib/blogs/meta";
import { getAllProjectSlugs } from "../lib/projects";
import { absoluteImageUrl, absoluteUrl, siteUrl } from "../lib/site";
import type { MetadataRoute } from "next";

/**
 * Sitemap.
 *
 * `lastModified` uses real content dates, never `new Date()`. A build-time
 * "now" changes on every deploy, which trains Google to ignore the field and
 * dilutes crawl priority. Instead the homepage and index pages take the
 * newest blog-post date as a proxy for site-wide content freshness, blog
 * posts use their own frontmatter dates, and project pages share the same
 * site-freshness date (projects have no per-page date field yet).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedPostsMeta();
  const newestPostDate = posts.reduce<Date | null>((latest, p) => {
    const d = new Date(p.updatedAt ?? p.date);
    if (!latest || d > latest) return d;
    return latest;
  }, null);
  const siteFreshness = newestPostDate ?? new Date("2026-04-01");

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: absoluteUrl(`/blogs/${p.slug}`),
    lastModified: new Date(p.updatedAt ?? p.date),
    changeFrequency: "monthly",
    priority: 0.72,
    ...(p.coverImage ? { images: [absoluteImageUrl(p.coverImage)] } : {})
  }));

  const projectEntries: MetadataRoute.Sitemap = getAllProjectSlugs().map((slug) => ({
    url: absoluteUrl(`/projects/${slug}`),
    lastModified: siteFreshness,
    changeFrequency: "monthly",
    priority: 0.64
  }));

  return [
    {
      url: siteUrl,
      lastModified: siteFreshness,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: absoluteUrl("/blogs"),
      lastModified: siteFreshness,
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: absoluteUrl("/projects"),
      lastModified: siteFreshness,
      changeFrequency: "monthly",
      priority: 0.82
    },
    {
      url: absoluteUrl("/about"),
      lastModified: siteFreshness,
      changeFrequency: "monthly",
      priority: 0.85
    },
    {
      url: absoluteUrl("/newsletter"),
      lastModified: siteFreshness,
      changeFrequency: "monthly",
      priority: 0.78
    },
    {
      url: absoluteUrl("/terminal"),
      lastModified: siteFreshness,
      changeFrequency: "monthly",
      priority: 0.62
    },
    ...projectEntries,
    ...blogEntries
  ];
}
