import { track } from "@vercel/analytics";

/**
 * Custom events sent to Vercel Analytics. Page views are automatic via
 * `<Analytics />` in the root layout; this file covers the interactions
 * that a page view cannot see.
 *
 * Rules: never send an email address, free text, or terminal arguments.
 * Vercel caps a property value at 255 chars and drops events with PII.
 */
export type AnalyticsEvent =
  | {
      name: "newsletter_subscribe";
      props: {
        location: "footer" | "newsletter_page" | "terminal";
        result: "subscribed" | "already_subscribed" | "error";
      };
    }
  | { name: "cta_click"; props: { label: string; href: string; location: string } }
  | { name: "outbound_click"; props: { href: string; location: string } }
  | { name: "book_call"; props: { method: "popup" | "new_tab" } }
  | { name: "blog_share"; props: { network: string; slug: string } }
  | { name: "blog_copy_link"; props: { slug: string } }
  | { name: "terminal_command"; props: { command: string; context: "home" | "route" } }
  | { name: "terminal_window"; props: { action: "minimize" | "close" | "zoom" | "reopen" } }
  | { name: "mode_toggle"; props: { mode: "web" | "terminal" } };

export function trackEvent<E extends AnalyticsEvent>(name: E["name"], props: E["props"]) {
  try {
    track(name, props);
  } catch {
    // Analytics must never break the UI.
  }
}
