"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

function isBackForwardNavigation(): boolean {
  const nav = performance.getEntriesByType?.("navigation")?.[0] as PerformanceNavigationTiming | undefined;
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

  return null;
}

