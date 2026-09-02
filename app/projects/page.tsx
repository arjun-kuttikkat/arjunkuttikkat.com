import type { Metadata } from "next";
import { Navbar } from "../../components/navbar";
import { ProjectsShowcase } from "../../components/projects/projects-showcase";
import { JsonLd } from "../../components/seo/json-ld";
import { buildBreadcrumb, homeCrumb } from "../../lib/seo/breadcrumbs";
import { organizationId, personId, websiteId } from "../../lib/seo/entity";
import { getProjectsSorted } from "../../lib/projects";
import { absoluteUrl, defaultOgImage, siteName, siteKeywords } from "../../lib/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects I'm building or have explored: AI workflows, this site, mobile commerce, automation, and health data.",
  alternates: {
    canonical: "/projects"
  },
  keywords: [...siteKeywords, "projects", "case studies", "AI products"],
  openGraph: {
    title: `Projects | ${siteName}`,
    description:
      "Projects I'm building or have explored: AI workflows, this site, mobile commerce, automation, and health data.",
    url: "/projects",
    type: "website",
    images: [defaultOgImage]
  },
  twitter: {
    card: "summary_large_image",
    title: `Projects | ${siteName}`,
    description:
      "Projects I'm building or have explored: AI workflows, this site, mobile commerce, automation, and health data.",
    images: [defaultOgImage.url]
  }
};

export default function ProjectsPage() {
  const list = getProjectsSorted();

  const breadcrumb = buildBreadcrumb([
    homeCrumb(),
    { name: "Projects", path: "/projects" }
  ]);

  // CollectionPage + ItemList marks /projects as a hub page and lists every
  // project, which helps Google relate the project detail pages to the index
  // and treat the index as a sitelink candidate.
  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/projects"),
    name: "Projects",
    description:
      "Projects I'm building or have explored: AI workflows, this site, mobile commerce, automation, and health data.",
    url: absoluteUrl("/projects"),
    isPartOf: { "@id": websiteId },
    author: { "@id": personId },
    publisher: { "@id": organizationId },
    inLanguage: "en-US",
    hasPart: list.map((p) => ({
      "@type": "CreativeWork",
      name: p.name,
      url: absoluteUrl(`/projects/${p.slug}`),
      description: p.summary
    }))
  };

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={collectionPage} />
      <main className="relative h-[100dvh] overflow-hidden">
        <Navbar />
        <div className="h-full touch-pan-y overflow-x-hidden overflow-y-auto overscroll-y-none snap-y snap-mandatory scroll-py-0 motion-reduce:snap-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <ProjectsShowcase projects={list} />
        </div>
      </main>
    </>
  );
}
