import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projectPages } from "../../../components/projects/pages";
import { JsonLd } from "../../../components/seo/json-ld";
import { buildBreadcrumb, homeCrumb } from "../../../lib/seo/breadcrumbs";
import { organizationId, personId, websiteId } from "../../../lib/seo/entity";
import { getPublicImageSize } from "../../../lib/seo/image-size";
import { getAllProjectSlugs, getProjectBySlug, projectStateLabel } from "../../../lib/projects";
import { absoluteUrl, defaultOgImage, siteKeywords, siteName } from "../../../lib/site";
import { stackTechnologyNames } from "../../../lib/technologies";

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
  const keywords = [...siteKeywords, project.category, ...stackTechnologyNames(project.stack)];
  // Real pixel size of the logo, so previews are not laid out against a guess.
  const logoSize = project.logo ? getPublicImageSize(project.logo) : undefined;

  return {
    title: project.name,
    description: project.summary,
    alternates: {
      canonical
    },
    keywords,
    openGraph: {
      title: `${project.name} | ${siteName}`,
      description: project.summary,
      url: canonical,
      type: "website",
      siteName,
      images: [
        project.logo
          ? { url: image, ...(logoSize ?? {}), alt: `${project.name} logo` }
          : defaultOgImage
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | ${siteName}`,
      description: project.summary,
      images: [image]
    }
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const Page = project ? projectPages[project.slug] : undefined;
  if (!project || !Page) notFound();

  const projectUrl = absoluteUrl(`/projects/${project.slug}`);
  const logoSize = project.logo ? getPublicImageSize(project.logo) : undefined;

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${projectUrl}#project`,
    name: project.name,
    description: project.summary,
    abstract: project.tagline,
    url: projectUrl,
    genre: project.category,
    creativeWorkStatus: projectStateLabel[project.state],
    keywords: stackTechnologyNames(project.stack).join(", "),
    dateCreated: project.year,
    inLanguage: "en-US",
    // Reference the site's Person entity by @id so the creator consolidates
    // with the homepage Person (knowledge panel, entity trust).
    creator: { "@id": personId },
    author: { "@id": personId },
    publisher: { "@id": organizationId },
    isPartOf: { "@id": absoluteUrl("/projects") },
    ...(project.logo
      ? {
          image: {
            "@type": "ImageObject",
            url: absoluteUrl(project.logo),
            contentUrl: absoluteUrl(project.logo),
            ...(logoSize ?? {})
          }
        }
      : {})
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": projectUrl,
    url: projectUrl,
    name: project.name,
    description: project.summary,
    isPartOf: { "@id": websiteId },
    inLanguage: "en-US",
    about: { "@id": personId },
    mainEntity: { "@id": `${projectUrl}#project` }
  };

  const breadcrumb = buildBreadcrumb([
    homeCrumb(),
    { name: "Projects", path: "/projects" },
    { name: project.name }
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }} />
      <JsonLd data={breadcrumb} />
      <JsonLd data={webPage} />
      <Page project={project} />
    </>
  );
}
