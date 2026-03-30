import {
  absoluteImageUrl,
  absoluteUrl,
  contactEmail,
  defaultOgImagePath,
  siteDescription,
  siteName,
  siteUrl
} from "../../lib/site";

export function SiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": absoluteUrl("/#person"),
        name: siteName,
        url: siteUrl,
        image: absoluteImageUrl(defaultOgImagePath),
        description: siteDescription,
        jobTitle: "Founder, Edgaze",
        email: `mailto:${contactEmail}`
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: siteUrl,
        name: siteName,
        description: siteDescription,
        inLanguage: "en-US",
        publisher: {
          "@id": absoluteUrl("/#person")
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
