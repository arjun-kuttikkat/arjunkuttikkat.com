"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { entryFor } from "../../lib/terminal/entry";
import type { TermPost } from "../../lib/terminal/types";
import { AKTerminalWindow } from "../ak-terminal-window";

/**
 * The full-screen terminal. `?from=<path>` (set by the mode toggle) picks the
 * page twin to boot into; without it the terminal starts at ~ with no command.
 */
export function TerminalRoute({ posts }: { posts: TermPost[] }) {
  const params = useSearchParams();
  const from = params.get("from");
  const entry = useMemo(() => entryFor(from, posts), [from, posts]);

  return (
    <AKTerminalWindow
      key={entry?.path ?? "root"}
      context="route"
      posts={posts}
      chrome={false}
      autoFocus
      className="flex-1"
      entry={entry}
    />
  );
}
