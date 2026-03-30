import { getPublishedPostsMeta } from "../lib/blogs/meta";
import { getAllProjectSlugs } from "../lib/projects";
import { absoluteUrl, siteUrl } from "../lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries = getPublishedPostsMeta().map((p) => ({
    url: absoluteUrl(`/blogs/${p.slug}`),
    lastModified: new Date(p.updatedAt ?? p.date),
    changeFrequency: "monthly" as const,
    priority: 0.72
  }));

  const projectEntries = getAllProjectSlugs().map((slug) => ({
    url: absoluteUrl(`/projects/${slug}`),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.64
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: absoluteUrl("/blogs"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: absoluteUrl("/projects"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.82
    },
    {
      url: absoluteUrl("/newsletter"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.78
    },
    {
      url: absoluteUrl("/about"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85
    },
    {
      url: absoluteUrl("/terminal"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.62
    },
    ...projectEntries,
    ...blogEntries
  ];
}
