"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PROMPT = "visitor@arjunkuttikkat ~ %";
const EDGAZE_URL = "https://edgaze.ai";
const TERMINAL_VERSION = "1.0.0";

type TerminalContext = "home" | "route";
type InputMode = "command" | "newsletter_email";

type LogBlock =
  | { id: string; kind: "system"; text: string }
  | { id: string; kind: "banner" }
  | { id: string; kind: "cmd"; text: string }
  | { id: string; kind: "out"; lines: string[] }
  | { id: string; kind: "err"; text: string }
  | {
      id: string;
      kind: "launch";
      message: string;
      href: string;
      linkLabel: string;
    };

function bootBlocks(): LogBlock[] {
  return [
    {
      id: "banner",
      kind: "banner",
    },
    {
      id: "boot",
      kind: "system",
      text: "Welcome to my personal portfolio",
    },
    {
      id: "ver",
      kind: "system",
      text: `Version ${TERMINAL_VERSION}`,
    },
    {
      id: "spacer",
      kind: "system",
      text: "",
    },
    {
      id: "hint",
      kind: "system",
      text: "Type 'help' to see available commands",
    },
    {
      id: "spacer-2",
      kind: "system",
      text: "",
    },
  ];
}

const SUGGESTIONS = [
  "help",
  "whois arjun",
  "current",
  "projects",
  "open edgaze",
  "newsletter",
  "clear",
] as const;

function parseCommand(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

type ApiOk = {
  ok: true;
  state: "subscribed" | "already_subscribed";
  message?: string;
};

type ApiErr = {
  ok: false;
  code?: string;
  error?: string;
};

function runCommand(cmd: string): LogBlock[] {
  const c = parseCommand(cmd);
  if (!c) return [];

  if (c === "help") {
    return [
      {
        id: `out-${Date.now()}`,
        kind: "out",
        lines: [
          "Available commands:",
          "  help",
          "  whois arjun",
          "  current",
          "  projects",
          "  open edgaze",
          "  newsletter",
          "  clear",
        ],
      },
    ];
  }

  if (c === "whois arjun") {
    return [
      {
        id: `out-${Date.now()}`,
        kind: "out",
        lines: [
          "Arjun Kuttikkat",
          "Founder building Edgaze.",
          "I work on AI workflows, execution, and distribution — turning flows into products people can run and pay for.",
        ],
      },
    ];
  }

  if (c === "current") {
    return [
      {
        id: `out-${Date.now()}`,
        kind: "out",
        lines: [
          "Current focus",
          "  - Fixing workflow execution speed end to end",
          "  - Improving reliability before pushing scale",
          "  - Onboarding serious creators with real workloads",
          "  - Pushing toward first meaningful GMV",
        ],
      },
    ];
  }

  if (c === "projects") {
    return [
      {
        id: `out-${Date.now()}`,
        kind: "out",
        lines: [
          "Active / notable",
          "  Edgaze      — package and monetize AI workflows",
          "  Aura        — mobile exploration around trustable exchange",
          "  AutoResolve — resolver-style product surface (building)",
        ],
      },
    ];
  }

  if (c === "open edgaze") {
    return [
      {
        id: `launch-${Date.now()}`,
        kind: "launch",
        message: "Launching Edgaze…",
        href: EDGAZE_URL,
        linkLabel: "Open edgaze.ai",
      },
    ];
  }

  return [
    {
      id: `err-${Date.now()}`,
      kind: "err",
      text: `command not found: ${c}`,
    },
  ];
}

async function subscribeNewsletter(email: string, signupLocation: "footer" | "newsletter_page") {
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

  if (!res.ok || !data || !("ok" in data) || !data.ok) {
    const err = data && "ok" in data ? (data as ApiErr) : null;
    return {
      ok: false as const,
      message: err?.error ?? "Could not subscribe. Try again in a moment.",
    };
  }

  const ok = data as ApiOk;
  return {
    ok: true as const,
    state: ok.state,
    message: ok.message ?? (ok.state === "already_subscribed" ? "Already subscribed." : "Subscribed."),
  };
}

function TrafficLights() {
  return (
    <div className="flex items-center gap-[0.42rem]" aria-hidden>
      <span className="h-[0.74rem] w-[0.74rem] rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.14)] ring-1 ring-black/25" />
      <span className="h-[0.74rem] w-[0.74rem] rounded-full bg-[#febc2e] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.12)] ring-1 ring-black/22" />
      <span className="h-[0.74rem] w-[0.74rem] rounded-full bg-[#28c840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.1)] ring-1 ring-black/20" />
    </div>
  );
}

function ExpandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M6 3.25H3.25V6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12.75H12.75V10"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.4 3.4L6.6 6.6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M12.6 12.6L9.4 9.4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M9.75 12.25L5.25 8L9.75 3.75"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogLine({ block }: { block: LogBlock }) {
  if (block.kind === "banner") {
    const akBanner = [
      " █████╗ ██╗  ██╗",
      "██╔══██╗██║ ██╔╝",
      "███████║█████╔╝ ",
      "██╔══██║██╔═██╗ ",
      "██║  ██║██║  ██╗",
      "╚═╝  ╚═╝╚═╝  ╚═╝",
    ].join("\n");

    return (
      <div className="pb-1">
        <pre
          className="whitespace-pre font-semibold leading-[1.1] text-[#d6d6d6]"
          style={{
            fontSize: "clamp(12px, 2.4vw, 14px)",
            letterSpacing: "0.02em",
          }}
          aria-hidden
        >
          {akBanner}
        </pre>
        <div className="h-2" aria-hidden />
      </div>
    );
  }
  if (block.kind === "system") {
    return (
      <p className="text-[0.8125rem] leading-[1.55] text-[#8f8f8f] sm:text-[0.84375rem] sm:leading-[1.52]">
        {block.text}
      </p>
    );
  }
  if (block.kind === "cmd") {
    return (
      <p className="whitespace-pre-wrap break-words text-[0.8125rem] leading-[1.55] text-[#ececec] sm:text-[0.84375rem] sm:leading-[1.52]">
        <span className="text-[#9a9a9a]">{PROMPT}&nbsp;</span>
        {block.text}
      </p>
    );
  }
  if (block.kind === "err") {
    return (
      <p className="text-[0.8125rem] leading-[1.55] text-[#ff8a7a] sm:text-[0.84375rem]">
        {block.text}
      </p>
    );
  }
  if (block.kind === "launch") {
    return (
      <div className="space-y-1.5">
        <p className="text-[0.8125rem] leading-[1.55] text-[#d4d4d4] sm:text-[0.84375rem]">
          {block.message}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={block.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.14] bg-white/[0.04] px-2.5 py-1.5 text-[0.8125rem] font-medium text-[#e8e8e8] transition-colors hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35"
          >
            {block.linkLabel}
          </a>
          <Link
            href="/projects/edgaze"
            className="text-[0.8125rem] font-medium text-cyan-300/80 underline decoration-cyan-400/30 underline-offset-2 hover:text-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35"
          >
            /projects/edgaze
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-0.5">
      {block.lines.map((line, i) => (
        <p
          key={`${block.id}-${i}`}
          className="whitespace-pre-wrap break-words text-[0.8125rem] leading-[1.55] text-[#d6d6d6] sm:text-[0.84375rem] sm:leading-[1.52]"
        >
          {line}
        </p>
      ))}
    </div>
  );
}

export function AKTerminalWindow({
  context,
  className,
  showSuggestions,
}: {
  context: TerminalContext;
  className?: string;
  showSuggestions?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [blocks, setBlocks] = useState<LogBlock[]>(bootBlocks);
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [mode, setMode] = useState<InputMode>("command");
  const [history, setHistory] = useState<string[]>([]);
  const [histPos, setHistPos] = useState<number | null>(null);
  const draftRef = useRef("");
  const pendingRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [blocks, scrollToBottom]);

  const commit = useCallback(
    async (raw: string) => {
      if (pendingRef.current) return;
      const trimmed = parseCommand(raw);
      setHistPos(null);

      if (trimmed && trimmed !== "clear" && mode === "command") {
        setHistory((h) => [...h, raw]);
      }

      if (trimmed === "clear") {
        setBlocks(bootBlocks());
        setInput("");
        setMode("command");
        return;
      }

      if (!trimmed) return;

      if (mode === "newsletter_email") {
        const email = trimmed;
        pendingRef.current = true;

        setBlocks((b) => [
          ...b,
          { id: `cmd-${Date.now()}`, kind: "cmd", text: email },
          { id: `sys-${Date.now()}-sub`, kind: "system", text: "Subscribing…" },
        ]);
        setInput("");

        const location = context === "route" ? "newsletter_page" : "footer";
        const result = await subscribeNewsletter(email, location);
        pendingRef.current = false;

        setBlocks((b) => {
          const base = [...b];
          if (result.ok) {
            base.push({
              id: `out-${Date.now()}`,
              kind: "out",
              lines:
                result.state === "already_subscribed"
                  ? ["Subscribed (already on the list)."]
                  : ["Subscribed."],
            });
          } else {
            base.push({ id: `err-${Date.now()}`, kind: "err", text: `Failed: ${result.message}` });
          }
          return base;
        });

        setMode("command");
        requestAnimationFrame(() => inputRef.current?.focus());
        return;
      }

      if (trimmed === "newsletter") {
        setBlocks((b) => [
          ...b,
          { id: `cmd-${Date.now()}`, kind: "cmd", text: trimmed },
          { id: `out-${Date.now()}`, kind: "out", lines: ["Email:"] },
        ]);
        setInput("");
        setMode("newsletter_email");
        requestAnimationFrame(() => inputRef.current?.focus());
        return;
      }

      setBlocks((b) => [
        ...b,
        { id: `cmd-${Date.now()}`, kind: "cmd", text: raw.trimEnd() },
        ...runCommand(raw),
      ]);
      setInput("");
    },
    [context, mode],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit(input);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (mode !== "command") return;
      if (history.length === 0) return;
      if (histPos === null) draftRef.current = input;
      const next =
        histPos === null ? history.length - 1 : Math.max(0, histPos - 1);
      setHistPos(next);
      setInput(history[next] ?? "");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (mode !== "command") return;
      if (histPos === null) return;
      const next = histPos + 1;
      if (next >= history.length) {
        setHistPos(null);
        setInput(draftRef.current);
        return;
      }
      setHistPos(next);
      setInput(history[next] ?? "");
    }
  };

  const terminalFont = useMemo(
    () =>
      'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    [],
  );

  const chrome = (
    <div
      className="relative flex h-[2.4rem] items-center justify-between gap-3 border-b border-black/40 px-3 sm:h-[2.55rem] sm:px-3.5"
      style={{
        background:
          "linear-gradient(180deg, #3d3d3f 0%, #343436 50%, #2f2f31 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center gap-2.5">
        <TrafficLights />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
        <div className="mx-auto max-w-[min(70%,16rem)] truncate text-center text-[12.75px] font-medium tracking-wide text-[#b9b9b9] sm:text-[13px]">
          Terminal
        </div>
      </div>

      <div className="flex items-center gap-2">
        {context === "home" ? (
          <Link
            href="/terminal"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.1] bg-white/[0.03] text-[#cfcfcf] transition-colors hover:border-white/[0.16] hover:bg-white/[0.055] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35"
            aria-label="Open full screen terminal"
          >
            <ExpandIcon />
          </Link>
        ) : (
          <Link
            href="/"
            className="inline-flex h-7 items-center gap-1.5 rounded-md border border-white/[0.1] bg-white/[0.03] px-2.25 text-[12px] font-medium tracking-wide text-[#cfcfcf] transition-colors hover:border-white/[0.16] hover:bg-white/[0.055] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/35"
            aria-label="Back to homepage"
          >
            <BackIcon />
            Home
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div className={className}>
      <div
        className={[
          "rounded-[16px] p-[1px] transition-[box-shadow] duration-300",
          "bg-gradient-to-b from-white/[0.12] via-white/[0.055] to-white/[0.02]",
          focused
            ? "shadow-[0_0_0_1px_rgba(34,211,238,0.14),0_0_52px_-16px_rgba(34,211,238,0.16),0_0_64px_-22px_rgba(232,121,249,0.14),0_28px_60px_-34px_rgba(0,0,0,0.78)]"
            : "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_60px_-34px_rgba(0,0,0,0.72)]",
        ].join(" ")}
      >
        <div
          className="overflow-hidden rounded-[15px] ring-1 ring-black/70"
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.045)" }}
        >
          {chrome}

          <div
            role="document"
            tabIndex={-1}
            onMouseDown={(e) => {
              if ((e.target as HTMLElement).closest("a, button")) return;
              if ((e.target as HTMLElement).closest("input")) return;
              e.preventDefault();
              inputRef.current?.focus();
            }}
            className={[
              "cursor-text",
              "bg-[linear-gradient(180deg,#1f1f1f_0%,#191919_100%)]",
              "text-[#e8e8e8]",
            ].join(" ")}
            style={{ fontFamily: terminalFont }}
          >
            <div
              ref={scrollRef}
              className={[
                "overflow-y-auto overflow-x-hidden",
                context === "route"
                  ? "h-[calc(100vh-10.25rem)] min-h-[28rem] sm:h-[calc(100vh-11.5rem)]"
                  : "max-h-[min(32rem,60vh)] min-h-[min(24rem,52vh)]",
                "px-3.5 py-3.5 sm:px-4 sm:py-4",
                "text-[13px] leading-[1.55] sm:text-[14px] sm:leading-[1.52]",
              ].join(" ")}
            >
              <div className="space-y-2.5">
                {blocks.map((b) => (
                  <LogLine key={b.id} block={b} />
                ))}

                <div className="flex min-w-0 flex-wrap items-baseline gap-y-0.5">
                  <span
                    className="shrink-0 select-none text-[#9a9a9a]"
                    aria-hidden
                  >
                    {PROMPT}&nbsp;
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    autoCapitalize="none"
                    autoCorrect="off"
                    value={input}
                    onChange={(e) => {
                      setHistPos(null);
                      setInput(e.target.value);
                    }}
                    onKeyDown={onKeyDown}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className="min-w-[10ch] flex-1 border-0 bg-transparent p-0 text-[#ececec] caret-[#d0d0d0] outline-none ring-0 focus:ring-0"
                    aria-label="Terminal input"
                  />
                </div>
              </div>
            </div>

            {showSuggestions ? (
              <div className="border-t border-white/[0.06] bg-black/[0.14] px-3.5 py-2.5 sm:px-4">
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        inputRef.current?.focus();
                        setHistPos(null);
                        setInput(s);
                      }}
                      className="rounded-full border border-white/[0.1] bg-white/[0.02] px-3 py-1.5 text-[11px] font-medium tracking-wide text-zinc-400 transition-colors hover:border-white/[0.16] hover:bg-white/[0.04] hover:text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/30 sm:text-xs"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

