"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { trackEvent } from "../lib/analytics";

const WEB_HREF = "/";
const TERMINAL_HREF = "/terminal";
const LAST_WEB_KEY = "ak:last-web";

const pill =
  "relative z-[1] inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45";

function GlobeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function PromptIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 8.5 11 12l-4 3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12.5 16.5H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function readLastWebPath() {
  try {
    const stored = sessionStorage.getItem(LAST_WEB_KEY);
    if (stored && stored.startsWith("/") && stored !== TERMINAL_HREF) return stored;
  } catch {
    // sessionStorage can be blocked.
  }
  return WEB_HREF;
}

export function ModeToggle({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const terminal = pathname === TERMINAL_HREF;

  useEffect(() => {
    if (terminal) return;
    try {
      sessionStorage.setItem(LAST_WEB_KEY, pathname);
    } catch {
      // sessionStorage can be blocked.
    }
  }, [pathname, terminal]);

  const goWeb = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      trackEvent("mode_toggle", { mode: "web" });
      router.push(readLastWebPath(), { transitionTypes: ["to-web"] });
    },
    [router]
  );

  return (
    <div
      role="group"
      aria-label="Site mode"
      className={`relative inline-flex items-center rounded-full border border-white/16 bg-black/55 p-0.5 backdrop-blur-md ${className ?? ""}`}
      style={{ viewTransitionName: "mode-toggle" }}
    >
      {terminal ? (
        <Link
          href={WEB_HREF}
          transitionTypes={["to-web"]}
          prefetch
          aria-label="Web"
          onClick={goWeb}
          className={`${pill} text-zinc-500 hover:text-zinc-200`}
        >
          <GlobeIcon />
        </Link>
      ) : (
        <span aria-label="Web" aria-current="page" className={`${pill} text-white`}>
          <span
            className="absolute inset-0 rounded-full bg-white/[0.12]"
            style={{ viewTransitionName: "mode-toggle-thumb" }}
            aria-hidden
          />
          <GlobeIcon />
        </span>
      )}
      {terminal ? (
        <span aria-label="Terminal" aria-current="page" className={`${pill} text-white`}>
          <span
            className="absolute inset-0 rounded-full bg-white/[0.12]"
            style={{ viewTransitionName: "mode-toggle-thumb" }}
            aria-hidden
          />
          <PromptIcon />
        </span>
      ) : (
        <Link
          href={TERMINAL_HREF}
          transitionTypes={["to-terminal"]}
          prefetch
          aria-label="Terminal"
          onClick={() => trackEvent("mode_toggle", { mode: "terminal" })}
          className={`${pill} text-zinc-500 hover:text-zinc-200`}
        >
          <PromptIcon />
        </Link>
      )}
    </div>
  );
}
