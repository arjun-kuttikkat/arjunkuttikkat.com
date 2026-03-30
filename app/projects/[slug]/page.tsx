import { Footer } from "../../../components/footer";
import { Navbar } from "../../../components/navbar";
import { AutoresolveProjectPage } from "../../../components/projects/autoresolve-project-page";
import { HealthSignalProjectPage } from "../../../components/projects/health-signal-project-page";
import { AuraProjectPage } from "../../../components/projects/aura-project-page";
import { EdgazeProjectPage } from "../../../components/projects/edgaze-project-page";
import { SiteProjectPage } from "../../../components/projects/site-project-page";
import { ProjectDetailAurora } from "../../../components/projects/project-detail-aurora";
import { ProjectDetailHero } from "../../../components/projects/project-detail-hero";
import { ProjectDetailSections } from "../../../components/projects/project-detail-sections";
import { RelatedProjects } from "../../../components/projects/related-projects";
import {
  getAllProjectSlugs,
  getProjectBySlug,
  getRelatedProjects
} from "../../../lib/projects";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  absoluteUrl,
  defaultOgImage,
  siteName,
  siteKeywords
} from "../../../lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    return { title: "Project" };
  }

  const canonical = `/projects/${project.slug}`;
  const image = project.logo || defaultOgImage.url;
  const keywords = [...siteKeywords, project.category, ...project.tech, ...(project.tags ?? [])];

  return {
    title: project.name,
    description: project.shortDescription,
    alternates: {
      canonical
    },
    keywords,
    openGraph: {
      title: `${project.name} | ${siteName}`,
      description: project.shortDescription,
      url: canonical,
      type: "website",
      siteName,
      images: [
        project.logo
          ? { url: image, width: 1200, height: 1200, alt: `${project.name} logo` }
          : defaultOgImage
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | ${siteName}`,
      description: project.shortDescription,
      images: [image]
    }
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const related = getRelatedProjects(project.slug, 3);
  const projectUrl = absoluteUrl(`/projects/${project.slug}`);
  const projectImage = project.logo ? absoluteUrl(project.logo) : undefined;
  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.shortDescription,
    url: projectUrl,
    genre: project.category,
    keywords: [...project.tech, ...(project.tags ?? [])].join(", "),
    creator: {
      "@type": "Person",
      name: siteName
    },
    ...(projectImage ? { image: projectImage } : {})
  };
  const jsonLdScript = (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
    />
  );

  if (project.slug === "edgaze") {
    return (
      <>
        {jsonLdScript}
        <EdgazeProjectPage project={project} />
      </>
    );
  }

  if (project.slug === "arjunkuttikkat-com") {
    return (
      <>
        {jsonLdScript}
        <SiteProjectPage project={project} />
      </>
    );
  }

  if (project.slug === "aura") {
    return (
      <>
        {jsonLdScript}
        <AuraProjectPage project={project} />
      </>
    );
  }

  if (project.slug === "autoresolve") {
    return (
      <>
        {jsonLdScript}
        <AutoresolveProjectPage project={project} />
      </>
    );
  }

  if (project.slug === "health-signal") {
    return (
      <>
        {jsonLdScript}
        <HealthSignalProjectPage project={project} />
      </>
    );
  }

  return (
    <>
      {jsonLdScript}
      <main className="relative min-h-screen pt-20 sm:pt-24">
        <ProjectDetailAurora mode="accent" accent={project.accent} />
        <div className="relative z-10">
          <Navbar projectNav={{ title: project.name }} />
          <ProjectDetailHero
            project={project}
          />
          <ProjectDetailSections project={project} />
          <RelatedProjects projects={related} />
          <Footer />
        </div>
      </main>
    </>
  );
}
