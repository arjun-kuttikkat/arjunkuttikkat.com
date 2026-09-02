"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CHUNK_RELOAD_KEY = "site:chunk-reload";

function isChunkLoadFailure(value: unknown): boolean {
  const message =
    value instanceof Error
      ? value.message
      : typeof value === "string"
        ? value
        : String(value ?? "");

  return /ChunkLoadError|Loading chunk .* failed|Failed to fetch dynamically imported module|Importing a module script failed/i.test(
    message
  );
}

function isBackForwardNavigation(): boolean {
  const nav = performance.getEntriesByType?.("navigation")?.[0] as
    | PerformanceNavigationTiming
    | undefined;
  return nav?.type === "back_forward";
}

export function BfcacheRefresh() {
  const router = useRouter();

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted || isBackForwardNavigation()) {
        router.refresh();
      }
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [router]);

  useEffect(() => {
    const reloadOnce = (reason: unknown) => {
      if (!isChunkLoadFailure(reason)) return;

      const currentUrl = window.location.href;
      if (sessionStorage.getItem(CHUNK_RELOAD_KEY) === currentUrl) return;

      sessionStorage.setItem(CHUNK_RELOAD_KEY, currentUrl);
      window.location.reload();
    };

    const onError = (event: ErrorEvent) => reloadOnce(event.error ?? event.message);
    const onUnhandledRejection = (event: PromiseRejectionEvent) =>
      reloadOnce(event.reason);
    const resetReloadGuard = window.setTimeout(() => {
      sessionStorage.removeItem(CHUNK_RELOAD_KEY);
    }, 10_000);

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.clearTimeout(resetReloadGuard);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
}
