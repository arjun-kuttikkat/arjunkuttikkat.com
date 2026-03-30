import { Footer } from "../components/footer";
import { Hero } from "../components/hero";
import { Navbar } from "../components/navbar";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { defaultOgImage, siteKeywords, siteTitle } from "../lib/site";

const ProjectsSection = dynamic(() =>
  import("../components/projects-section").then((mod) => mod.ProjectsSection)
);
const HomeTerminalSection = dynamic(() =>
  import("../components/home-terminal-section").then((mod) => mod.HomeTerminalSection)
);
const AboutSection = dynamic(() =>
  import("../components/about-section").then((mod) => mod.AboutSection)
);
const BlogsSection = dynamic(() =>
  import("../components/blogs-section").then((mod) => mod.BlogsSection)
);

export const metadata: Metadata = {
  title: {
    absolute: siteTitle
  },
  description:
    "Founder of Edgaze. Projects, writing, and experiments around AI workflows, distribution, and products built for real use.",
  alternates: {
    canonical: "/"
  },
  keywords: [...siteKeywords, "AI workflows", "founder website", "Edgaze founder"],
  openGraph: {
    title: siteTitle,
    description:
      "Founder of Edgaze. Projects, writing, and experiments around AI workflows, distribution, and products built for real use.",
    url: "/",
    type: "website",
    images: [defaultOgImage]
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description:
      "Founder of Edgaze. Projects, writing, and experiments around AI workflows, distribution, and products built for real use.",
    images: [defaultOgImage.url]
  }
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden pt-20 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_65%)]" />
      </div>
      <Navbar />
      <Hero />
      <ProjectsSection />
      <HomeTerminalSection />
      <AboutSection />
      <BlogsSection />
      <Footer />
    </main>
  );
}
