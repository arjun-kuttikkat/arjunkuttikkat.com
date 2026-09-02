import type { BlogPostMeta } from "./types";

function scoreRelated(a: BlogPostMeta, b: BlogPostMeta): number {
  if (a.slug === b.slug) return -Infinity;
  let score = 0;
  if (a.category === b.category) score += 4;
  const tagSet = new Set(a.tags.map((t) => t.toLowerCase()));
  for (const t of b.tags) {
    if (tagSet.has(t.toLowerCase())) score += 3;
  }
  return score;
}

export function getRelatedPosts(
  current: BlogPostMeta,
  all: BlogPostMeta[],
  limit = 3
): BlogPostMeta[] {
  const scored = all
    .filter((p) => p.slug !== current.slug && p.published)
    .map((p) => ({ post: p, score: scoreRelated(current, p) }))
    .filter(({ score }) => score > 0)
    .sort((x, y) => {
      if (y.score !== x.score) return y.score - x.score;
      return new Date(y.post.date).getTime() - new Date(x.post.date).getTime();
    })
    .map(({ post }) => post);

  if (scored.length >= limit) return scored.slice(0, limit);

  const fallback = all
    .filter((p) => p.slug !== current.slug && p.published)
    .sort((x, y) => new Date(y.date).getTime() - new Date(x.date).getTime())
    .filter((p) => !scored.some((s) => s.slug === p.slug));

  return [...scored, ...fallback].slice(0, limit);
}

/**
 * Posts that relate to a project by tag. A post matches when one of its tags
 * contains the project name (case-insensitive) — e.g. posts tagged "Edgaze"
 * belong to the Edgaze project. No fallback to recent posts: a hackathon
 * project with no matching writing should show nothing, not unrelated posts.
 */
export function getRelatedPostsForProject(
  projectName: string,
  all: BlogPostMeta[],
  limit = 3
): BlogPostMeta[] {
  const needle = projectName.trim().toLowerCase();
  if (!needle) return [];
  return all
    .filter((p) => p.published)
    .filter((p) => p.tags.some((t) => t.toLowerCase().includes(needle)))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
