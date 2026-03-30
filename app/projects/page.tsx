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
    <main className="relative h-[100dvh] overflow-hidden">
      <Navbar />
      <div className="h-full touch-pan-y overflow-x-hidden overflow-y-auto overscroll-y-none snap-y snap-mandatory scroll-py-0 motion-reduce:snap-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <ProjectsShowcase projects={list} />
      </div>
    </main>
  );
}
