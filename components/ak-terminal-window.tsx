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
import type {
  TermBlock,
  TermEnv,
  TermLine,
  TermPost,
  TerminalContext,
} from "../lib/terminal/types";
import { TERMINAL_USER } from "../lib/terminal/types";
import { trackEvent } from "../lib/analytics";
import { TrafficLights } from "./terminal/traffic-lights";

type InputMode = "command" | "newsletter_email";

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

/**
 * The AK monogram everywhere, except on the dedicated /terminal page where the
 * full name is printed when it fits on one line. Fit is measured with a hidden
 * copy so the decision follows real glyph width, not a column estimate.
 */
function Banner({ variant, compact }: { variant: "ak" | "full"; compact?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLPreElement>(null);
  const [fits, setFits] = useState(false);
  const measure = variant === "full" && !compact;

  useLayoutEffect(() => {
    if (!measure) return;
    const host = hostRef.current;
    const probe = probeRef.current;
    if (!host || !probe) return;
    const ro = new ResizeObserver(() => {
      setFits(probe.scrollWidth <= host.clientWidth);
    });
    ro.observe(host);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <div ref={hostRef} className="relative min-w-0">
      <pre
        className={bannerClass(compact)}
        style={{ letterSpacing: "0.02em" }}
        aria-hidden
      >
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

const toneClass: Record<NonNullable<Exclude<TermLine, string>["tone"]>, string> = {
  default: "text-[#d6d6d6]",
  dim: "text-[#8a8a8a]",
  accent: "text-cyan-300/90",
  ok: "text-[#7ed491]",
  warn: "text-[#f0c15c]",
  err: "text-[#ff8a7a]",
  bold: "text-[#f2f2f2] font-semibold",
};

function isExternal(href: string) {
  return /^(https?:|mailto:)/.test(href);
}

function OutLine({ line }: { line: TermLine }) {
  const l = typeof line === "string" ? { text: line } : line;
  const cls = `whitespace-pre-wrap break-words ${TEXT} ${toneClass[l.tone ?? "default"]}`;
  if (!l.href) return <p className={cls}>{l.text || "\u00a0"}</p>;
  const linkCls = `${cls} block w-fit max-w-full underline decoration-white/25 decoration-dotted underline-offset-[3px] transition-colors hover:text-white hover:decoration-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35`;
  return isExternal(l.href) ? (
    <a
      href={l.href}
      target={l.href.startsWith("mailto:") ? undefined : "_blank"}
      rel="noopener noreferrer"
      className={linkCls}
    >
      {l.text}
    </a>
  ) : (
    <Link href={l.href} className={linkCls}>
      {l.text}
    </Link>
  );
}

function Block({ block, banner }: { block: TermBlock; banner: "ak" | "full" }) {
  switch (block.kind) {
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
          <span className="text-[#9a9a9a]">{block.prompt} </span>
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
        <div>
          {block.lines.map((line, i) => (
            <OutLine key={`${block.id}-${i}`} line={line} />
          ))}
        </div>
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
}: AKTerminalWindowProps) {
  const router = useRouter();
  const windowRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const pendingRef = useRef(false);
  const draftRef = useRef("");

  const [blocks, setBlocks] = useState<TermBlock[]>(() => bootBlocks(context));
  const [input, setInput] = useState("");
  const [caret, setCaret] = useState(0);
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(true);
  const [mode, setMode] = useState<InputMode>("command");
  const [cwd, setCwd] = useState(HOME);
  const [history, setHistory] = useState<string[]>([]);
  const [histPos, setHistPos] = useState<number | null>(null);
  const [size, setSize] = useState({ cols: 80, rows: 24 });
  const [startedAt, setStartedAt] = useState(0);

  const prompt = mode === "command" ? promptFor(cwd) : "Email:";

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

  useEffect(() => {
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
    if (context === "route") router.push("/");
    else onClose?.();
  }, [context, onClose, router]);

  const commit = useCallback(
    async (raw: string) => {
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

      push({
        id: nextId("cmd"),
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
          case "exit":
            window.setTimeout(leave, 320);
            break;
        }
      }
      if (result.blocks.length) push(...result.blocks);
    },
    [context, cwd, env, history, leave, mode, push, router]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const ctrl = e.ctrlKey && !e.metaKey && !e.altKey;

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
            : "h-full flex-1 px-4 py-4 sm:px-6 sm:py-5",
          TEXT,
        ].join(" ")}
      >
        <div className="space-y-2">
          {blocks.map((b) => (
            <Block key={b.id} block={b} banner={context === "route" ? "full" : "ak"} />
          ))}

          <div className="relative flex min-w-0 flex-wrap items-baseline">
            <span
              className="shrink-0 select-none whitespace-pre text-[#9a9a9a]"
              aria-hidden
            >
              {prompt}{" "}
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
            onZoom={() => (onFullscreen ? onFullscreen() : router.push("/terminal"))}
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
