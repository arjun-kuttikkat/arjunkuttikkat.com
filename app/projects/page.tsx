import type { Metadata } from "next";
import { Navbar } from "../../components/navbar";
import { ProjectsShowcase } from "../../components/projects/projects-showcase";
import { getProjectsSorted } from "../../lib/projects";
import { defaultOgImage, siteName, siteKeywords } from "../../lib/site";

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

  return (
    <main className="relative flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden pt-20 sm:pt-24">
      <Navbar />
      <div className="min-h-0 flex-1 touch-pan-y overflow-x-hidden overflow-y-auto overscroll-y-contain scroll-auto snap-y snap-proximity motion-reduce:snap-none sm:snap-mandatory [scrollbar-gutter:stable]">
        <ProjectsShowcase projects={list} />
      </div>
    </main>
  );
}
