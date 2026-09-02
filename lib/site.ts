export const siteUrl = "https://arjunkuttikkat.com";
export const siteName = "Arjun Kuttikkat";
export const siteTitle = "Arjun Kuttikkat | Founder, Edgaze";
export const siteDescription = "Founder of Edgaze. Building products people use.";
export const siteLocale = "en_US";
/**
 * Social/OG portrait. JPEG rather than PNG: the source is a fully opaque photo,
 * and every social scraper handles JPEG (WebP support is inconsistent).
 */
export const defaultOgImagePath = "/arjun-og.jpg";
export const contactEmail = "hello@arjunkuttikkat.com";

/** Favicon and app icons, generated from the circular portrait. */
export const iconPaths = {
  icon192: "/icon-192.png",
  icon512: "/icon-512.png",
  appleTouch: "/apple-touch-icon.png"
} as const;

export const siteKeywords = [
  "Arjun Kuttikkat",
  "Edgaze",
  "AI workflows",
  "AI product execution",
  "founder",
  "distribution",
  "internet products"
];

/** Must match the real pixel dimensions of `defaultOgImagePath`. */
export const defaultOgImage = {
  url: defaultOgImagePath,
  width: 1200,
  height: 1200,
  alt: `${siteName} — Founder of Edgaze`
} as const;

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const resolved = new URL(path, siteUrl).toString();
  // `new URL("/", siteUrl)` yields a trailing slash, but the canonical tags and
  // the sitemap both emit the bare origin. Normalise the root to one spelling so
  // breadcrumbs, canonicals and the sitemap never disagree about the homepage.
  return resolved === `${siteUrl}/` ? siteUrl : resolved;
}

export function absoluteImageUrl(path = defaultOgImagePath): string {
  return absoluteUrl(path);
}
