export const TERMINAL_VERSION = "1.2.0";
export const TERMINAL_USER = "visitor";
export const TERMINAL_HOST = "arjunkuttikkat";

export type TerminalContext = "home" | "route";

/** Blog metadata the terminal needs. Built on the server, passed down as props. */
export type TermPost = {
  slug: string;
  title: string;
  date: string;
  readTimeMinutes: number;
  description: string;
};

export type LineTone = "default" | "dim" | "accent" | "ok" | "warn" | "err" | "bold";

export type TermLine =
  | string
  | {
      text: string;
      tone?: LineTone;
      /** Internal route or external URL. Rendered as a link when present. */
      href?: string;
      /** Leading key printed in the label colour, e.g. `state     ` before a value. */
      label?: string;
    };

/** One row of an interactive `menu` block. Choosing it runs `command`. */
export type MenuItem = {
  label: string;
  hint?: string;
  command: string;
};

export type TermBlock =
  | { id: string; kind: "banner" }
  | { id: string; kind: "system"; text: string }
  | { id: string; kind: "cmd"; prompt: string; text: string }
  | { id: string; kind: "out"; lines: TermLine[] }
  | { id: string; kind: "err"; text: string }
  | { id: string; kind: "neofetch"; rows: Array<[string, string]> }
  /** Block-letter heading; `text` is the plain fallback when the glyphs will not fit. */
  | { id: string; kind: "figlet"; text: string }
  /** Horizontal rule, optionally labelled: `── Stack ─────`. */
  | { id: string; kind: "rule"; label?: string }
  /** A full blog post fetched on the client and rendered from Markdown. */
  | { id: string; kind: "article"; slug: string; status: "loading" | "ready" | "error"; lines: TermLine[] }
  /**
   * A cursor-driven list. While it is the active block the window moves
   * `selected` with the arrow keys and narrows `items` by `filter`; Enter (or a
   * tap) runs the item's command and freezes the block with `done` set.
   */
  | {
      id: string;
      kind: "menu";
      items: MenuItem[];
      selected: number;
      filter: string;
      done?: "chosen" | "cancelled";
    };

export type TermEffect =
  | { type: "clear" }
  | { type: "cwd"; cwd: string }
  | { type: "navigate"; href: string }
  | { type: "open"; href: string }
  | { type: "prompt_email" }
  /** Fetch `/blogs/<slug>/md` and render it as an `article` block. */
  | { type: "read_post"; slug: string }
  | { type: "exit" };

export type TermEnv = {
  context: TerminalContext;
  cwd: string;
  posts: TermPost[];
  history: string[];
  startedAt: number;
};

export type CommandResult = {
  blocks: TermBlock[];
  effects?: TermEffect[];
};

/**
 * Where the terminal was opened from. The window starts in `cwd` and runs
 * `command` as if the visitor had typed it, so every web page has a twin.
 */
export type TermEntry = {
  /** Web path the visitor came from; `exit` returns here. */
  path: string;
  cwd: string;
  command?: string;
};
