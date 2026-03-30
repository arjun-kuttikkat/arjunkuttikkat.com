export const siteUrl = "https://arjunkuttikkat.com";
export const siteName = "Arjun Kuttikkat";
export const siteTitle = "Arjun Kuttikkat | Founder, Edgaze";
export const siteDescription = "Founder of Edgaze. Building products people use.";
export const siteLocale = "en_US";
export const defaultOgImagePath = "/arjun.png";
export const defaultIconPath = "/arjun-circle.png";
export const contactEmail = "hello@arjunkuttikkat.com";

export const siteKeywords = [
  "Arjun Kuttikkat",
  "Edgaze",
  "AI workflows",
  "AI product execution",
  "founder",
  "distribution",
  "internet products"
];

export const defaultOgImage = {
  url: defaultOgImagePath,
  width: 1200,
  height: 1200,
  alt: siteName
} as const;

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return new URL(path, siteUrl).toString();
}

export function absoluteImageUrl(path = defaultOgImagePath): string {
  return absoluteUrl(path);
}
