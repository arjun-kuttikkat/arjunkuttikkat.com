import type { BlogPostMeta } from "./types";

export function pickFeaturedPost(posts: BlogPostMeta[]): BlogPostMeta | undefined {
  if (!posts.length) return undefined;
  const featured = posts.filter((p) => p.featured);
  if (featured.length) {
    return [...featured].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }
  return posts[0];
}
