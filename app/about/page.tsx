import { Footer } from "../../components/footer";
import { Navbar } from "../../components/navbar";
import { AboutPageClient } from "../../components/about/about-page-client";
import { JsonLd } from "../../components/seo/json-ld";
import { buildBreadcrumb, homeCrumb } from "../../lib/seo/breadcrumbs";
import {
  organizationId,
  personId,
  primaryImageId,
  websiteId,
} from "../../lib/seo/entity";
import { getPublishedPostsMeta } from "../../lib/blogs/meta";
import type { Metadata } from "next";
import { absoluteUrl, defaultOgImage, siteName } from "../../lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Background on Arjun Kuttikkat: growing up in Kerala, failed early projects, moving to Dubai, and building Edgaze.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About | ${siteName}`,
    description:
      "Background on Arjun Kuttikkat: growing up in Kerala, failed early projects, moving to Dubai, and building Edgaze.",
    url: "/about",
    type: "profile",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `About | ${siteName}`,
    description:
      "Background on Arjun Kuttikkat: growing up in Kerala, failed early projects, moving to Dubai, and building Edgaze.",
    images: [defaultOgImage.url],
  },
};

export default function AboutPage() {
  const published = getPublishedPostsMeta();
  const recentPosts = published.slice(0, 3);

  const breadcrumb = buildBreadcrumb([homeCrumb(), { name: "About", path: "/about" }]);

  /**
   * ProfilePage is Google's dedicated structured-data type for a page that *is*
   * a person's profile. `mainEntity` points at the site-wide Person node, which
   * marks /about as the canonical page for the entity — the strongest signal a
   * personal site can send for a knowledge panel.
   */
  const profilePage = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": absoluteUrl("/about"),
    url: absoluteUrl("/about"),
    name: `About ${siteName}`,
    isPartOf: { "@id": websiteId },
    primaryImageOfPage: { "@id": primaryImageId },
    inLanguage: "en-US",
    about: { "@id": personId },
    mainEntity: { "@id": personId },
    publisher: { "@id": organizationId },
  };

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={profilePage} />
      <main className="relative min-h-screen overflow-x-hidden pt-28 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_50%_-10%,rgba(34,211,238,0.09),transparent_58%)]" />
        </div>
        <Navbar />
        <AboutPageClient recentPosts={recentPosts} />
        <Footer />
      </main>
    </>
  );
}
