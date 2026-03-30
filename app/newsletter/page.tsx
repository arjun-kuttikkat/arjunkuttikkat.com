import type { Metadata } from "next";
import { NewsletterLanding } from "../../components/newsletter-landing";
import { defaultOgImage, siteName } from "../../lib/site";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Execution notes, distribution reality, and product decisions from the field. Occasional, high signal email when something is worth sending.",
  alternates: { canonical: "/newsletter" },
  openGraph: {
    title: `Newsletter | ${siteName}`,
    description:
      "Execution notes and distribution reality from building products, including Edgaze when it matters. No cadence for its own sake.",
    url: "/newsletter",
    type: "website",
    images: [defaultOgImage]
  },
  twitter: {
    card: "summary_large_image",
    title: `Newsletter | ${siteName}`,
    description:
      "Execution notes and distribution reality from building products. Occasional email, founder written, worth the interruption.",
    images: [defaultOgImage.url]
  }
};

export default function NewsletterPage() {
  return <NewsletterLanding />;
}
