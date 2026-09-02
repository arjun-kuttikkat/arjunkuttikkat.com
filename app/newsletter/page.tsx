import type { Metadata } from "next";
import { NewsletterLanding } from "../../components/newsletter-landing";
import { JsonLd } from "../../components/seo/json-ld";
import { buildBreadcrumb, homeCrumb } from "../../lib/seo/breadcrumbs";
import { defaultOgImage, siteName } from "../../lib/site";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Occasional notes from building Edgaze: what shipped, what broke, what changed. No schedule.",
  alternates: { canonical: "/newsletter" },
  openGraph: {
    title: `Newsletter | ${siteName}`,
    description:
      "Occasional notes from building Edgaze: what shipped, what broke, what changed. No schedule.",
    url: "/newsletter",
    type: "website",
    images: [defaultOgImage]
  },
  twitter: {
    card: "summary_large_image",
    title: `Newsletter | ${siteName}`,
    description:
      "Occasional notes from building Edgaze: what shipped, what broke, what changed. No schedule.",
    images: [defaultOgImage.url]
  }
};

export default function NewsletterPage() {
  const breadcrumb = buildBreadcrumb([
    homeCrumb(),
    { name: "Newsletter", path: "/newsletter" }
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <NewsletterLanding />
    </>
  );
}
