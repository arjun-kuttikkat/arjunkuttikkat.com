"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * Query params that can carry personal data. Vercel Analytics records the full
 * URL of each page view, so these are stripped before the beacon is sent.
 */
const sensitiveParams = ["email", "token", "code", "state"];

function beforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  const url = new URL(event.url);
  let touched = false;
  for (const key of sensitiveParams) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      touched = true;
    }
  }
  return touched ? { ...event, url: url.toString() } : event;
}

/** Page views, Web Vitals, and the transport for custom events (`lib/analytics.ts`). */
export function SiteAnalytics() {
  return (
    <>
      <Analytics beforeSend={beforeSend} />
      <SpeedInsights />
    </>
  );
}
