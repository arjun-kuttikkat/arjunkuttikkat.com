import { projects } from "../projects";
import { HOME } from "./fs";
import type { TermEntry, TermPost } from "./types";

/**
 * Map a web path to the terminal state that mirrors it. Returns undefined for
 * paths with no twin (or nothing to run), so the terminal boots as usual.
 */
export function entryFor(from: string | null | undefined, posts: TermPost[]): TermEntry | undefined {
  if (!from || !from.startsWith("/") || from.startsWith("//")) return undefined;
  const path = from.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  const [, section, slug] = path.split("/");

  if (path === "/") return { path, cwd: HOME, command: "home" };
  if (path === "/about") return { path, cwd: HOME, command: "about" };
  if (path === "/newsletter") return { path, cwd: HOME, command: "newsletter" };
  if (section === "projects") {
    const project = slug ? projects.find((p) => p.slug === slug) : undefined;
    if (slug && !project) return undefined;
    return {
      path,
      cwd: `${HOME}/projects`,
      command: project ? `project ${project.slug}` : "projects",
    };
  }
  if (section === "blogs") {
    const post = slug ? posts.find((p) => p.slug === slug) : undefined;
    if (slug && !post) return undefined;
    return { path, cwd: `${HOME}/blogs`, command: post ? `read ${post.slug}` : "blogs" };
  }
  return undefined;
}
