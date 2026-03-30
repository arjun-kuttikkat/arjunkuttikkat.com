import path from "path";

export const BLOG_CONTENT_DIR = path.join(
  /* turbopackIgnore: true */ process.cwd(),
  "content",
  "blogs"
);
