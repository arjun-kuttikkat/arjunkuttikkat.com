import type { ReactNode } from "react";
import { getPublishedPostsMeta } from "../../../lib/blogs/meta";
import { getRelatedPostsForProject } from "../../../lib/blogs/related";
import { getRelatedProjects, type Project } from "../../../lib/projects";
import { Footer } from "../../footer";
import { Navbar } from "../../navbar";
import { RelatedPosts } from "../related-posts";
import { RelatedProjects } from "../related-projects";
import { Tldr } from "./primitives";
import { ProjectBackdrop } from "./project-backdrop";
import { ProjectHero } from "./project-hero";

/** Common frame for every project page. Black backdrop, nav, hero, TL;DR, chapters, related, footer. */
export function ProjectPageShell({ project, children }: { project: Project; children: ReactNode }) {
  const related = getRelatedProjects(project.slug, 3);
  // Cross-link project pages to matching blog posts. Strengthens the internal
  // link graph and gives high-priority project pages a path to discover posts.
  const relatedPosts = getRelatedPostsForProject(project.name, getPublishedPostsMeta(), 3);

  return (
    <main className="relative min-h-screen overflow-x-hidden pt-24 sm:pt-28">
      <ProjectBackdrop accent={project.accent} />
      <Navbar projectNav={{ title: project.name }} />
      <ProjectHero project={project} />
      <Tldr points={project.tldr} />
      {children}
      <RelatedPosts posts={relatedPosts} />
      <RelatedProjects projects={related} />
      <Footer />
    </main>
  );
}
