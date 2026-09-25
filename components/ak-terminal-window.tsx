"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  bootBlocks,
  complete,
  execute,
  HOME,
  lastLoginLine,
  promptFor,
  SUGGESTIONS,
} from "../lib/terminal/commands";
import { figlet } from "../lib/terminal/figlet";
import { articleLines } from "../lib/terminal/markdown";
import type {
  TermBlock,
  TermEntry,
  TermEnv,
  TermLine,
  TermPost,
  TerminalContext,
} from "../lib/terminal/types";
import { TERMINAL_USER } from "../lib/terminal/types";
import { trackEvent } from "../lib/analytics";
import { readLastWebPath } from "./mode-toggle";
import { TrafficLights } from "./terminal/traffic-lights";

type InputMode = "command" | "newsletter_email" | "menu";

type MenuBlock = Extract<TermBlock, { kind: "menu" }>;

/** Items still visible under the menu's filter, with their original indices. */
function visibleMenuItems(menu: MenuBlock) {
  const q = menu.filter.trim().toLowerCase();
  return menu.items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !q || `${item.label} ${item.hint ?? ""}`.toLowerCase().includes(q));
}

const TERMINAL_FONT =
  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

const TEXT = "text-[13px] leading-[1.55] sm:text-[13.5px] sm:leading-[1.55]";

let uid = 0;
const nextId = (p: string) => `${p}-${Date.now().toString(36)}-${(uid++).toString(36)}`;

type ApiOk = { ok: true; state: "subscribed" | "already_subscribed"; message?: string };
type ApiErr = { ok: false; code?: string; error?: string };

async function subscribeNewsletter(
  email: string,
  signupLocation: "footer" | "newsletter_page"
) {
  const res = await fetch("/api/newsletter/subscribe", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, signupLocation }),
  });
  let data: ApiOk | ApiErr | null = null;
  try {
    data = (await res.json()) as ApiOk | ApiErr;
  } catch {
    data = null;
  }
  if (!res.ok || !data || !data.ok) {
    const e = data && !data.ok ? data : null;
    return {
      ok: false as const,
      message: e?.error ?? "Could not subscribe. Try again in a moment.",
    };
  }
  return {
    ok: true as const,
    state: data.state,
    message:
      data.message ??
      (data.state === "already_subscribed" ? "Already subscribed." : "Subscribed."),
  };
}

const AK_BANNER = [
  " █████╗ ██╗  ██╗",
  "██╔══██╗██║ ██╔╝",
  "███████║█████╔╝ ",
  "██╔══██║██╔═██╗ ",
  "██║  ██║██║  ██╗",
  "╚═╝  ╚═╝╚═╝  ╚═╝",
];

// Same block font as AK_BANNER, spelling the full name. Used only when a line fits without wrapping.
const FULL_BANNER = [
  " █████╗ ██████╗      ██╗██╗   ██╗███╗   ██╗   ██╗  ██╗██╗   ██╗████████╗████████╗██╗██╗  ██╗██╗  ██╗ █████╗ ████████╗",
  "██╔══██╗██╔══██╗     ██║██║   ██║████╗  ██║   ██║ ██╔╝██║   ██║╚══██╔══╝╚══██╔══╝██║██║ ██╔╝██║ ██╔╝██╔══██╗╚══██╔══╝",
  "███████║██████╔╝     ██║██║   ██║██╔██╗ ██║   █████╔╝ ██║   ██║   ██║      ██║   ██║█████╔╝ █████╔╝ ███████║   ██║   ",
  "██╔══██║██╔══██╗██   ██║██║   ██║██║╚██╗██║   ██╔═██╗ ██║   ██║   ██║      ██║   ██║██╔═██╗ ██╔═██╗ ██╔══██║   ██║   ",
  "██║  ██║██║  ██║╚█████╔╝╚██████╔╝██║ ╚████║   ██║  ██╗╚██████╔╝   ██║      ██║   ██║██║  ██╗██║  ██╗██║  ██║   ██║   ",
  "╚═╝  ╚═╝╚═╝  ╚═╝ ╚════╝  ╚═════╝ ╚═╝  ╚═══╝   ╚═╝  ╚═╝ ╚═════╝    ╚═╝      ╚═╝   ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ",
];

const bannerClass = (compact?: boolean) =>
  `whitespace-pre font-semibold text-[#d6d6d6] ${compact ? "text-[11px] leading-[1.1]" : "text-[12px] leading-[1.1] sm:text-[14px]"}`;

/** Gradient text for block letters: the banner stays near-white, page headings take the site accents. */
const gradientText = (from: string, to: string): React.CSSProperties => ({
  backgroundImage: `linear-gradient(135deg, ${from}, ${to})`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  letterSpacing: "0.02em",
});
const BANNER_GRADIENT = gradientText("#f4f4f5", "#a5b4bd");
const HEADING_GRADIENT = gradientText("#67e8f9", "#c084fc");

/** True while the hidden probe's natural width fits inside the host. */
function useFits(
  hostRef: React.RefObject<HTMLDivElement | null>,
  probeRef: React.RefObject<HTMLPreElement | null>,
  enabled: boolean
) {
  const [fits, setFits] = useState(false);
  useLayoutEffect(() => {
    if (!enabled) return;
    const host = hostRef.current;
    const probe = probeRef.current;
    if (!host || !probe) return;
    const ro = new ResizeObserver(() => {
      setFits(probe.scrollWidth <= host.clientWidth);
    });
    ro.observe(host);
    return () => ro.disconnect();
  }, [enabled, hostRef, probeRef]);
  return fits;
}

/**
 * The AK monogram everywhere, except on the dedicated /terminal page where the
 * full name is printed when it fits on one line. Fit is measured with a hidden
 * copy so the decision follows real glyph width, not a column estimate.
 */
function Banner({ variant, compact }: { variant: "ak" | "full"; compact?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLPreElement>(null);
  const measure = variant === "full" && !compact;
  const fits = useFits(hostRef, probeRef, measure);

  return (
    <div ref={hostRef} className="relative min-w-0">
      <pre className={bannerClass(compact)} style={BANNER_GRADIENT} aria-hidden>
        {(measure && fits ? FULL_BANNER : AK_BANNER).join("\n")}
      </pre>
      {measure ? (
        <pre
          ref={probeRef}
          className={`pointer-events-none invisible absolute left-0 top-0 ${bannerClass(false)}`}
          style={{ letterSpacing: "0.02em" }}
          aria-hidden
        >
          {FULL_BANNER[0]}
        </pre>
      ) : null}
    </div>
  );
}

/**
 * A page heading in the banner's block font. When the glyph rows would wrap
 * (narrow window, long name) it degrades to a plain bold heading instead.
 */
function Figlet({ text }: { text: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLPreElement>(null);
  const rows = useMemo(() => figlet(text), [text]);
  const widest = useMemo(() => rows.reduce((a, b) => (b.length > a.length ? b : a), ""), [rows]);
  const fits = useFits(hostRef, probeRef, rows.some((r) => r.trim().length > 0));

  return (
    <div ref={hostRef} className="relative min-w-0 py-1">
      {fits ? (
        <pre className={bannerClass(true)} style={HEADING_GRADIENT} aria-label={text}>
          {rows.join("\n")}
        </pre>
      ) : (
        <p className={`${TEXT} font-semibold uppercase tracking-[0.18em]`} style={HEADING_GRADIENT}>
          {text}
        </p>
      )}
      <pre
        ref={probeRef}
        className={`pointer-events-none invisible absolute left-0 top-0 ${bannerClass(true)}`}
        style={{ letterSpacing: "0.02em" }}
        aria-hidden
      >
        {widest}
      </pre>
    </div>
  );
}

function Rule({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 py-0.5" aria-hidden>
      {label ? <span className={`${TEXT} shrink-0 text-cyan-300/70`}>── {label}</span> : null}
      <span className="h-px flex-1 bg-cyan-300/15" />
    </div>
  );
}

const toneClass: Record<NonNullable<Exclude<TermLine, string>["tone"]>, string> = {
  default: "text-[#d6d6d6]",
  dim: "text-[#8a8a8a]",
  accent: "text-cyan-300/90",
  ok: "text-[#7ed491]",
  warn: "text-[#f0c15c]",
  err: "text-[#ff8a7a]",
  bold: "text-[#f2f2f2] font-semibold",
};

/** Labelled rules (`── Stack ───`) coming from the command engine as plain lines. */
const RULE_LINE = /^── (.+?) ─+$/;

function isExternal(href: string) {
  return /^(https?:|mailto:)/.test(href);
}

/** zsh-style prompt: green user@host, blue path, grey `%`. Other prompts (`Email:`) print as-is. */
function Prompt({ text }: { text: string }) {
  const m = text.match(/^(\S+@\S+) (\S+) %$/);
  if (!m) return <span className="text-[#9a9a9a]">{text}</span>;
  return (
    <>
      <span className="text-[#7ed491]">{m[1]}</span>
      <span className="text-[#9a9a9a]"> </span>
      <span className="text-[#7cb8ff]">{m[2]}</span>
      <span className="text-[#9a9a9a]"> %</span>
    </>
  );
}

function OutLine({ line }: { line: TermLine }) {
  const l = typeof line === "string" ? { text: line } : line;
  const rule = !l.href && !l.label && l.tone === "dim" ? l.text.match(RULE_LINE) : null;
  if (rule) return <Rule label={rule[1]} />;
  const cls = `whitespace-pre-wrap break-words ${TEXT} ${toneClass[l.tone ?? "default"]}`;
  const body = (
    <>
      {l.label ? <span className="text-[#8fd3f4]/80">{l.label}</span> : null}
      {l.text || (l.label ? "" : "\u00a0")}
    </>
  );
  if (!l.href) return <p className={cls}>{body}</p>;
  const linkCls = `${cls} block w-fit max-w-full underline decoration-white/25 decoration-dotted underline-offset-[3px] transition-colors hover:text-white hover:decoration-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35`;
  return isExternal(l.href) ? (
    <a
      href={l.href}
      target={l.href.startsWith("mailto:") ? undefined : "_blank"}
      rel="noopener noreferrer"
      className={linkCls}
    >
      {body}
    </a>
  ) : (
    <Link href={l.href} className={linkCls}>
      {body}
    </Link>
  );
}

type MenuHandlers = {
  activeId: string | null;
  onHover: (id: string, index: number) => void;
  onChoose: (id: string, index: number) => void;
};

/**
 * fzf-style picker. The cursor row is highlighted; on pointer devices a hover
 * moves the cursor and a click chooses, so it works the same on a phone.
 */
function Menu({ block, handlers }: { block: MenuBlock; handlers: MenuHandlers }) {
  const active = handlers.activeId === block.id && !block.done;
  const visible = visibleMenuItems(block);
  const width = Math.max(...block.items.map((i) => i.label.length)) + 2;
  return (
    <div className={`my-1 max-w-[100ch] ${block.done === "cancelled" ? "opacity-60" : ""}`}>
      {block.filter ? (
        <p className={`${TEXT} text-[#8a8a8a]`}>
          <span className="text-cyan-300/80">/ </span>
          {block.filter}
          {active ? <span className="ml-px inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-[#d0d0d0]" /> : null}
        </p>
      ) : null}
      {visible.length === 0 ? (
        <p className={`${TEXT} text-[#8a8a8a]`}>  no matches</p>
      ) : (
        <ul role="listbox" aria-label="Choose an item" aria-activedescendant={`${block.id}-${block.selected}`}>
          {visible.map(({ item, index }) => {
            const current = index === block.selected;
            const chosen = block.done === "chosen" && current;
            const muted = block.done === "chosen" && !current;
            return (
              <li key={index} id={`${block.id}-${index}`} role="option" aria-selected={current}>
                <button
                  type="button"
                  tabIndex={-1}
                  disabled={!!block.done}
                  onMouseEnter={() => active && handlers.onHover(block.id, index)}
                  onClick={() => active && handlers.onChoose(block.id, index)}
                  style={{ "--menu-col": `${width}ch` } as React.CSSProperties}
                  className={[
                    "flex w-full flex-wrap items-baseline rounded-[4px] px-1.5 py-[3px] text-left",
                    "break-words",
                    TEXT,
                    current && active ? "bg-cyan-300/[0.09] text-white" : "",
                    chosen ? "text-white" : "",
                    muted ? "text-[#6f6f6f]" : "",
                    !current && !block.done ? "text-[#c8c8c8]" : "",
                    active ? "cursor-pointer" : "cursor-default",
                  ].join(" ")}
                >
                  <span className={`w-[2ch] shrink-0 ${chosen ? "text-[#7ed491]" : "text-cyan-300"}`}>
                    {current ? "❯" : " "}
                  </span>
                  <span className={`min-w-0 sm:min-w-(--menu-col) ${current && !muted ? "font-semibold" : ""}`}>
                    {item.label}
                  </span>
                  {item.hint ? (
                    <span className="basis-full pl-[2ch] text-[#8a8a8a] sm:basis-auto sm:pl-0">{item.hint}</span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <p className={`${TEXT} mt-1 text-[#6f6f6f]`}>
        {block.done === "cancelled" ? (
          "cancelled"
        ) : block.done === "chosen" ? (
          `${visible.length === block.items.length ? block.items.length : visible.length}/${block.items.length}`
        ) : (
          <>
            <span className="[@media(hover:none)]:hidden">↑ ↓ move · ⏎ open · type to filter · esc cancel</span>
            <span className="[@media(hover:hover)]:hidden">tap a row to open it</span>
          </>
        )}
      </p>
    </div>
  );
}

function Block({
  block,
  banner,
  menu,
}: {
  block: TermBlock;
  banner: "ak" | "full";
  menu: MenuHandlers;
}) {
  switch (block.kind) {
    case "menu":
      return <Menu block={block} handlers={menu} />;
    case "banner":
      return (
        <div className="py-1">
          <Banner variant={banner} />
        </div>
      );
    case "system":
      return <p className={`${TEXT} text-[#8f8f8f]`}>{block.text || "\u00a0"}</p>;
    case "cmd":
      return (
        <p className={`whitespace-pre-wrap break-words ${TEXT} text-[#ececec]`}>
          <Prompt text={block.prompt} />{" "}
          {block.text}
        </p>
      );
    case "err":
      return <p className={`whitespace-pre-wrap ${TEXT} text-[#ff8a7a]`}>{block.text}</p>;
    case "neofetch":
      return (
        <div className="flex flex-col gap-3 py-1 sm:flex-row sm:items-start sm:gap-8">
          <Banner variant="ak" compact />
          <div className="min-w-0">
            {block.rows.map(([k, v]) => (
              <p
                key={k}
                className={`whitespace-pre-wrap break-words ${TEXT} text-[#d6d6d6]`}
              >
                <span className="font-semibold text-cyan-300/90">{k}</span>
                <span className="text-[#8a8a8a]">: </span>
                {v}
              </p>
            ))}
            <div className="mt-2 flex gap-1" aria-hidden>
              {[
                "#1c1c1e",
                "#ff5f57",
                "#febc2e",
                "#28c840",
                "#22d3ee",
                "#e879f9",
                "#d6d6d6",
                "#ffffff",
              ].map((c) => (
                <span
                  key={c}
                  className="h-3 w-5 rounded-[2px]"
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>
      );
    case "out":
      return (
        <div className="max-w-[100ch]">
          {block.lines.map((line, i) => (
            <OutLine key={`${block.id}-${i}`} line={line} />
          ))}
        </div>
      );
    case "figlet":
      return <Figlet text={block.text} />;
    case "rule":
      return <Rule label={block.label} />;
    case "article":
      if (block.status === "loading")
        return <p className={`${TEXT} text-[#8f8f8f]`}>Fetching ~/blogs/{block.slug}.md…</p>;
      if (block.status === "error")
        return (
          <p className={`whitespace-pre-wrap ${TEXT} text-[#ff8a7a]`}>
            read: could not load {block.slug}. Try &apos;open {block.slug}&apos; to read it on the web.
          </p>
        );
      return (
        <article className="max-w-[80ch]">
          {block.lines.map((line, i) => (
            <OutLine key={`${block.id}-${i}`} line={line} />
          ))}
        </article>
      );
  }
}

function FolderIcon() {
  return (
    <svg width="16" height="13" viewBox="0 0 16 13" aria-hidden className="shrink-0">
      <path
        d="M1 2.2A1.2 1.2 0 0 1 2.2 1h3.6l1.4 1.5h6.6A1.2 1.2 0 0 1 15 3.7v7.1a1.2 1.2 0 0 1-1.2 1.2H2.2A1.2 1.2 0 0 1 1 10.8z"
        fill="#3fa9f5"
      />
      <path
        d="M1 4.2h14v6.6a1.2 1.2 0 0 1-1.2 1.2H2.2A1.2 1.2 0 0 1 1 10.8z"
        fill="#5fc0ff"
      />
    </svg>
  );
}

export type AKTerminalWindowProps = {
  context: TerminalContext;
  posts?: TermPost[];
  className?: string;
  showSuggestions?: boolean;
  /** Render without the macOS title bar (the full-screen route). */
  chrome?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onFullscreen?: () => void;
  /** Focus the input as soon as the window mounts. */
  autoFocus?: boolean;
  /** Web page this terminal mirrors: start in its directory and run its command. */
  entry?: TermEntry;
};

export function AKTerminalWindow({
  context,
  posts = [],
  className,
  showSuggestions,
  chrome = true,
  onClose,
  onMinimize,
  onFullscreen,
  autoFocus,
  entry,
}: AKTerminalWindowProps) {
  const router = useRouter();
  const windowRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const pendingRef = useRef(false);
  const draftRef = useRef("");
  const entryRanRef = useRef(false);

  const [blocks, setBlocks] = useState<TermBlock[]>(() => bootBlocks(context, entry));
  const [input, setInput] = useState("");
  const [caret, setCaret] = useState(0);
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(true);
  const [mode, setMode] = useState<InputMode>("command");
  const [menuId, setMenuId] = useState<string | null>(null);
  const [cwd, setCwd] = useState(entry?.cwd ?? HOME);
  const [history, setHistory] = useState<string[]>([]);
  const [histPos, setHistPos] = useState<number | null>(null);
  const [size, setSize] = useState({ cols: 80, rows: 24 });
  const [startedAt, setStartedAt] = useState(0);

  const prompt = mode === "newsletter_email" ? "Email:" : promptFor(cwd);

  const env = useMemo<TermEnv>(
    () => ({ context, cwd, posts, history, startedAt }),
    [context, cwd, posts, history, startedAt]
  );

  // Window "activation" follows the pointer like macOS: click inside = active, click anywhere else = inactive.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      setActive(!!windowRef.current?.contains(e.target as Node));
    };
    document.addEventListener("pointerdown", onDown, true);
    return () => document.removeEventListener("pointerdown", onDown, true);
  }, []);

  // The login line depends on the clock, so it is added after hydration.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setStartedAt(Date.now());
      setBlocks((prev) =>
        prev.some((b) => b.id === "boot-login")
          ? prev
          : [{ id: "boot-login", kind: "system", text: lastLoginLine() }, ...prev]
      );
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  // cols × rows for the title bar, from the real character cell and viewport.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    const m = measureRef.current;
    if (!el || !m) return;
    const update = () => {
      // offsetWidth ignores CSS transforms, so the minimize/restore animation cannot skew the count.
      const cw = m.offsetWidth / 20;
      const lh = parseFloat(getComputedStyle(m).lineHeight) || 20;
      const style = getComputedStyle(el);
      const w =
        el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const h =
        el.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      if (cw > 0 && lh > 0)
        setSize({
          cols: Math.max(1, Math.floor(w / cw)),
          rows: Math.max(1, Math.floor(h / lh)),
        });
    };
    update();
    let alive = true;
    document.fonts?.ready.then(() => alive && update());
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, []);

  // Long page-style output (an article, a project record) is read from the top, so a
  // block can ask to be scrolled into view instead of the prompt.
  const scrollTargetRef = useRef<string | null>(null);
  useEffect(() => {
    const target = scrollTargetRef.current;
    if (target) {
      scrollTargetRef.current = null;
      const el = scrollRef.current;
      const node = el?.querySelector<HTMLElement>(`[data-block-id="${target}"]`);
      if (el && node) {
        requestAnimationFrame(() => {
          el.scrollTop = Math.max(0, node.offsetTop - el.offsetTop - 8);
        });
        return;
      }
    }
    scrollToBottom();
  }, [blocks, input, scrollToBottom]);

  const syncCaret = () => {
    const el = inputRef.current;
    if (el) setCaret(el.selectionStart ?? el.value.length);
  };

  const setLine = (value: string) => {
    setInput(value);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.setSelectionRange(value.length, value.length);
      setCaret(value.length);
    });
  };

  const push = useCallback(
    (...b: TermBlock[]) => setBlocks((prev) => [...prev, ...b]),
    []
  );

  const leave = useCallback(() => {
    if (context === "route")
      router.push(entry?.path ?? readLastWebPath(), { transitionTypes: ["to-web"] });
    else onClose?.();
  }, [context, entry?.path, onClose, router]);

  /** `read <slug>`: fetch the post's Markdown and swap the placeholder for the article. */
  const readPost = useCallback(async (slug: string) => {
    const blockId = nextId("article");
    let anchorId = blockId;
    setBlocks((prev) => {
      anchorId = prev[prev.length - 1]?.id ?? blockId;
      return [...prev, { id: blockId, kind: "article", slug, status: "loading", lines: [] }];
    });
    let next: TermBlock;
    try {
      const res = await fetch(`/blogs/${slug}/md`);
      if (!res.ok) throw new Error(String(res.status));
      next = { id: blockId, kind: "article", slug, status: "ready", lines: articleLines(slug, await res.text()) };
    } catch {
      next = { id: blockId, kind: "article", slug, status: "error", lines: [] };
    }
    scrollTargetRef.current = anchorId;
    setBlocks((prev) => prev.map((b) => (b.id === blockId ? next : b)));
  }, []);

  const commit = useCallback(
    async (raw: string, opts?: { anchor?: boolean }) => {
      if (pendingRef.current) return;
      const trimmed = raw.trim();
      setHistPos(null);
      setLine("");

      if (mode === "newsletter_email") {
        push({ id: nextId("cmd"), kind: "cmd", prompt: "Email:", text: trimmed });
        if (!trimmed) {
          setMode("command");
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
          push({
            id: nextId("err"),
            kind: "err",
            text: `newsletter: '${trimmed}' does not look like an email address.`,
          });
          setMode("command");
          return;
        }
        pendingRef.current = true;
        push({ id: nextId("sys"), kind: "system", text: "Subscribing…" });
        const result = await subscribeNewsletter(
          trimmed,
          context === "route" ? "newsletter_page" : "footer"
        );
        pendingRef.current = false;
        trackEvent("newsletter_subscribe", {
          location: "terminal",
          result: result.ok ? result.state : "error",
        });
        push(
          result.ok
            ? {
                id: nextId("out"),
                kind: "out",
                lines: [
                  {
                    text:
                      result.state === "already_subscribed"
                        ? "Already on the list. Nothing to do."
                        : "Subscribed. Welcome aboard.",
                    tone: "ok",
                  },
                ],
              }
            : { id: nextId("err"), kind: "err", text: `newsletter: ${result.message}` }
        );
        setMode("command");
        return;
      }

      const cmdId = nextId("cmd");
      if (opts?.anchor) scrollTargetRef.current = cmdId;
      push({
        id: cmdId,
        kind: "cmd",
        prompt: promptFor(cwd),
        text: raw.trimEnd(),
      });
      if (!trimmed) return;
      setHistory((h) => (h[h.length - 1] === trimmed ? h : [...h, trimmed]));

      // Command name only: arguments can carry emails or other personal text.
      trackEvent("terminal_command", { command: trimmed.split(/\s+/)[0].slice(0, 64), context });
      const result = execute(raw, { ...env, history: [...history, trimmed] });
      for (const effect of result.effects ?? []) {
        switch (effect.type) {
          case "clear":
            setBlocks([]);
            return;
          case "cwd":
            setCwd(effect.cwd);
            break;
          case "prompt_email":
            setMode("newsletter_email");
            break;
          case "open":
            trackEvent("outbound_click", { href: effect.href, location: "terminal" });
            if (effect.href.startsWith("mailto:")) window.location.href = effect.href;
            else window.open(effect.href, "_blank", "noopener,noreferrer");
            break;
          case "navigate":
            window.setTimeout(() => router.push(effect.href), 260);
            break;
          case "read_post":
            if (result.blocks.length) push(...result.blocks);
            void readPost(effect.slug);
            return;
          case "exit":
            window.setTimeout(leave, 320);
            break;
        }
      }
      if (result.blocks.length) push(...result.blocks);
      const menu = result.blocks.find((b): b is MenuBlock => b.kind === "menu");
      if (menu) {
        setMenuId(menu.id);
        setMode("menu");
      }
    },
    [context, cwd, env, history, leave, mode, push, readPost, router]
  );

  const updateMenu = useCallback((id: string, fn: (m: MenuBlock) => MenuBlock) => {
    setBlocks((prev) => prev.map((b) => (b.id === id && b.kind === "menu" ? fn(b) : b)));
  }, []);

  const moveMenu = useCallback(
    (id: string, delta: number) =>
      updateMenu(id, (m) => {
        const visible = visibleMenuItems(m);
        if (!visible.length) return m;
        const pos = Math.max(0, visible.findIndex((v) => v.index === m.selected));
        const next = (pos + delta + visible.length) % visible.length;
        return { ...m, selected: visible[next].index };
      }),
    [updateMenu]
  );

  const filterMenu = useCallback(
    (id: string, filter: string) =>
      updateMenu(id, (m) => {
        const next = { ...m, filter };
        const visible = visibleMenuItems(next);
        const stillVisible = visible.some((v) => v.index === m.selected);
        return { ...next, selected: stillVisible ? m.selected : (visible[0]?.index ?? m.selected) };
      }),
    [updateMenu]
  );

  const cancelMenu = useCallback(
    (id: string) => {
      updateMenu(id, (m) => ({ ...m, done: "cancelled" }));
      setMenuId(null);
      setMode("command");
    },
    [updateMenu]
  );

  const chooseMenu = useCallback(
    (id: string, index: number) => {
      let command: string | undefined;
      setBlocks((prev) =>
        prev.map((b) => {
          if (b.id !== id || b.kind !== "menu" || b.done) return b;
          command = b.items[index]?.command;
          return { ...b, selected: index, done: "chosen" };
        })
      );
      setMenuId(null);
      setMode("command");
      inputRef.current?.focus({ preventScroll: true });
      // The block update above is applied before the timeout fires, so the command
      // is committed against the frozen menu.
      window.setTimeout(() => {
        if (command) void commitRef.current(command, { anchor: true });
      }, 0);
    },
    []
  );

  const menuHandlers = useMemo<MenuHandlers>(
    () => ({
      activeId: mode === "menu" ? menuId : null,
      onHover: (id, index) => updateMenu(id, (m) => ({ ...m, selected: index })),
      onChoose: chooseMenu,
    }),
    [chooseMenu, menuId, mode, updateMenu]
  );

  // Opened from a web page: run that page's command once, after the login line is in place.
  const commitRef = useRef(commit);
  commitRef.current = commit;
  useEffect(() => {
    if (!entry?.command || entryRanRef.current) return;
    const command = entry.command;
    const t = window.setTimeout(() => {
      entryRanRef.current = true;
      void commitRef.current(command, { anchor: true });
    }, 60);
    return () => window.clearTimeout(t);
  }, [entry?.command]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const ctrl = e.ctrlKey && !e.metaKey && !e.altKey;

    if (mode === "menu" && menuId) {
      if (e.metaKey) return; // browser shortcuts (⌘R, ⌘L…) pass through
      const menu = blocks.find((b): b is MenuBlock => b.id === menuId && b.kind === "menu");
      if (!menu) {
        setMode("command");
        return;
      }
      e.preventDefault();
      const filtering = menu.filter.length > 0;
      if (e.key === "ArrowDown" || e.key === "Tab" || (ctrl && e.key === "n") || (!filtering && e.key === "j"))
        return moveMenu(menuId, 1);
      if (e.key === "ArrowUp" || (ctrl && e.key === "p") || (!filtering && e.key === "k"))
        return moveMenu(menuId, -1);
      if (e.key === "Enter") return chooseMenu(menuId, menu.selected);
      if (e.key === "Escape" || (ctrl && (e.key === "c" || e.key === "C")) || (!filtering && e.key === "q"))
        return cancelMenu(menuId);
      if (ctrl && (e.key === "l" || e.key === "L")) {
        setBlocks([]);
        setMenuId(null);
        setMode("command");
        return;
      }
      if (e.key === "Backspace") return filterMenu(menuId, menu.filter.slice(0, -1));
      if (e.key.length === 1 && !ctrl && !e.altKey) return filterMenu(menuId, menu.filter + e.key);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      void commit(input);
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      if (mode !== "command") return;
      const { candidates, replaceFrom } = complete(input, env);
      if (candidates.length === 0) return;
      if (candidates.length === 1) {
        const c = candidates[0];
        const filled = input.slice(0, replaceFrom) + c + (c.endsWith("/") ? "" : " ");
        setLine(filled);
        return;
      }
      let common = candidates[0];
      for (const c of candidates)
        while (!c.startsWith(common)) common = common.slice(0, -1);
      if (common.length > input.length - replaceFrom) {
        setLine(input.slice(0, replaceFrom) + common);
        return;
      }
      push(
        { id: nextId("cmd"), kind: "cmd", prompt: promptFor(cwd), text: input },
        { id: nextId("out"), kind: "out", lines: [candidates.join("  ")] }
      );
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (mode !== "command" || history.length === 0) return;
      if (histPos === null) draftRef.current = input;
      const next = histPos === null ? history.length - 1 : Math.max(0, histPos - 1);
      setHistPos(next);
      setLine(history[next] ?? "");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (mode !== "command" || histPos === null) return;
      const next = histPos + 1;
      if (next >= history.length) {
        setHistPos(null);
        setLine(draftRef.current);
        return;
      }
      setHistPos(next);
      setLine(history[next] ?? "");
      return;
    }
    if (ctrl && (e.key === "l" || e.key === "L")) {
      e.preventDefault();
      setBlocks([]);
      return;
    }
    if (ctrl && (e.key === "c" || e.key === "C")) {
      e.preventDefault();
      push({ id: nextId("cmd"), kind: "cmd", prompt, text: `${input}^C` });
      setLine("");
      setMode("command");
      setMenuId(null);
      setHistPos(null);
      pendingRef.current = false;
      return;
    }
    if (ctrl && (e.key === "u" || e.key === "U")) {
      e.preventDefault();
      setLine("");
      return;
    }
    if (ctrl && (e.key === "d" || e.key === "D") && input === "" && mode === "command") {
      e.preventDefault();
      push(
        { id: nextId("cmd"), kind: "cmd", prompt, text: "" },
        { id: nextId("sys"), kind: "system", text: "[Process completed]" }
      );
      window.setTimeout(leave, 320);
    }
  };

  const focusInput = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest("a, button, input")) return;
    // Let the visitor select output text; only refocus on a plain click.
    if (window.getSelection()?.toString()) return;
    e.preventDefault();
    inputRef.current?.focus({ preventScroll: true });
  };

  const before = input.slice(0, caret);
  const at = input.charAt(caret) || "\u00a0";
  const after = input.slice(caret + 1);
  const cursorSolid = focused && active;

  const body = (
    <div
      role="document"
      tabIndex={-1}
      onMouseDown={focusInput}
      className={`relative flex min-h-0 flex-1 cursor-text flex-col text-[#e8e8e8] ${
        chrome ? "bg-[linear-gradient(180deg,#1f1f1f_0%,#191919_100%)]" : "bg-[#101010]"
      }`}
      style={{ fontFamily: TERMINAL_FONT }}
    >
      <span
        ref={measureRef}
        aria-hidden
        className={`pointer-events-none absolute -left-[9999px] top-0 select-none whitespace-pre ${TEXT}`}
      >
        MMMMMMMMMMMMMMMMMMMM
      </span>

      <div
        ref={scrollRef}
        className={[
          "overflow-y-auto overflow-x-hidden [scrollbar-color:rgba(255,255,255,0.18)_transparent] [scrollbar-width:thin]",
          chrome
            ? "h-[min(30rem,62vh)] min-h-[20rem] px-3.5 py-3 sm:px-4 sm:py-3.5"
            : "h-full flex-1 px-4 pb-4 pt-16 sm:px-6 sm:pb-5 sm:pt-[4.25rem]",
          TEXT,
        ].join(" ")}
      >
        <div className="space-y-2">
          {blocks.map((b) => (
            <div key={b.id} data-block-id={b.id}>
              <Block block={b} banner={context === "route" ? "full" : "ak"} menu={menuHandlers} />
            </div>
          ))}

          <div
            className={`relative flex min-w-0 flex-wrap items-baseline ${mode === "menu" ? "h-0 overflow-hidden opacity-0" : ""}`}
          >
            <span className="shrink-0 select-none whitespace-pre" aria-hidden>
              <Prompt text={prompt} />{" "}
            </span>
            <span
              className="min-w-0 whitespace-pre-wrap break-all text-[#ececec]"
              aria-hidden
            >
              {before}
              <span
                className={[
                  "inline-block min-w-[0.6em] -mb-[0.15em] align-baseline",
                  cursorSolid
                    ? "bg-[#d0d0d0] text-[#161616]"
                    : "text-[#ececec] shadow-[inset_0_0_0_1px_#8a8a8a]",
                ].join(" ")}
              >
                {at}
              </span>
              {after}
            </span>
            <input
              ref={inputRef}
              type="text"
              inputMode={mode === "newsletter_email" ? "email" : "text"}
              autoComplete="off"
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              enterKeyHint="send"
              value={input}
              onChange={(e) => {
                setHistPos(null);
                setInput(e.target.value);
                setCaret(e.target.selectionStart ?? e.target.value.length);
              }}
              onKeyDown={onKeyDown}
              onKeyUp={syncCaret}
              onSelect={syncCaret}
              onFocus={() => {
                setFocused(true);
                setActive(true);
                syncCaret();
              }}
              onBlur={() => setFocused(false)}
              className="absolute inset-0 h-full w-full cursor-text border-0 bg-transparent p-0 text-transparent caret-transparent opacity-0 outline-none"
              aria-label={
                mode === "newsletter_email" ? "Email address" : "Terminal input"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (!chrome) {
    return (
      <div ref={windowRef} className={`flex h-full min-h-0 flex-col ${className ?? ""}`}>
        {body}
      </div>
    );
  }

  const title = `${TERMINAL_USER} — -zsh — ${size.cols}×${size.rows}`;

  return (
    <div className={className}>
      <div
        ref={windowRef}
        className={[
          "flex flex-col overflow-hidden rounded-[11px] transition-shadow duration-300",
          active
            ? "shadow-[0_0_0_0.5px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.09)_inset,0_28px_70px_-8px_rgba(0,0,0,0.78),0_10px_24px_-10px_rgba(0,0,0,0.6)]"
            : "shadow-[0_0_0_0.5px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06)_inset,0_16px_40px_-10px_rgba(0,0,0,0.6)]",
        ].join(" ")}
      >
        <div
          className="relative flex h-[28px] shrink-0 select-none items-center border-b border-black/60 px-2.5"
          style={{
            background: active
              ? "linear-gradient(180deg, #3a3a3c 0%, #323234 60%, #2e2e30 100%)"
              : "linear-gradient(180deg, #2c2c2e 0%, #28282a 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
          onDoubleClick={onMinimize}
        >
          <TrafficLights
            active={active}
            onClose={() => onClose?.()}
            onMinimize={() => onMinimize?.()}
            onZoom={() =>
              onFullscreen
                ? onFullscreen()
                : router.push("/terminal", { transitionTypes: ["to-terminal"] })
            }
          />
          <div className="pointer-events-none absolute inset-x-[84px] top-0 flex h-full items-center justify-center">
            <div
              className={`flex min-w-0 items-center gap-1.5 text-[13px] font-semibold tracking-[-0.005em] ${active ? "text-[#b6b6b6]" : "text-[#6f6f71]"}`}
            >
              <FolderIcon />
              <span className="truncate">{title}</span>
            </div>
          </div>
        </div>

        {body}
      </div>

      {showSuggestions ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium tracking-[0.08em] text-zinc-500">
            Try
          </span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                inputRef.current?.focus({ preventScroll: true });
                setHistPos(null);
                setLine(s);
              }}
              className="rounded-full border border-white/[0.1] bg-white/[0.02] px-3 py-1.5 text-[11px] font-medium tracking-wide text-zinc-400 transition-colors hover:border-white/[0.16] hover:bg-white/[0.04] hover:text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/30 sm:text-xs"
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
