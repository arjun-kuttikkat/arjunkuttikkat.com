import "server-only";

import { getPublishedPostsMeta } from "../blogs/load";
import type { TermPost } from "./types";

/** Serialisable slice of post metadata for the client-side terminal. */
export function getTerminalPosts(): TermPost[] {
  return getPublishedPostsMeta().map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    readTimeMinutes: p.readTimeMinutes,
    description: p.description,
  }));
}
