"use client";

import { useCallback, useRef } from "react";
import { trackEvent } from "../../lib/analytics";

const CALENDLY_URL = "https://calendly.com/arjun-edgaze/edgaze-intro-call";
const CALENDLY_CSS = "https://assets.calendly.com/assets/external/widget.css";
const CALENDLY_JS = "https://assets.calendly.com/assets/external/widget.js";
const CALENDLY_STYLE_ID = "calendly-widget-css";
const CALENDLY_SCRIPT_ID = "calendly-widget-js";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

type CalendlyBookButtonProps = {
  className?: string;
  children?: React.ReactNode;
};

function ensureStylesheet() {
  if (document.getElementById(CALENDLY_STYLE_ID)) return;
  const link = document.createElement("link");
  link.id = CALENDLY_STYLE_ID;
  link.rel = "stylesheet";
  link.href = CALENDLY_CSS;
  document.head.appendChild(link);
}

function loadWidgetScript(): Promise<void> {
  if (window.Calendly) return Promise.resolve();
  const existing = document.getElementById(CALENDLY_SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Calendly failed to load")), {
        once: true,
      });
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = CALENDLY_SCRIPT_ID;
    script.src = CALENDLY_JS;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Calendly failed to load"));
    document.body.appendChild(script);
  });
}

export function CalendlyBookButton({ className, children }: CalendlyBookButtonProps) {
  const loading = useRef(false);

  const openPopup = useCallback(async () => {
    if (typeof window === "undefined" || loading.current) return;
    loading.current = true;
    try {
      ensureStylesheet();
      await loadWidgetScript();
      if (window.Calendly) {
        trackEvent("book_call", { method: "popup" });
        window.Calendly.initPopupWidget({ url: CALENDLY_URL });
        return;
      }
    } catch {
      // Fall through to a new tab if the widget never loads.
    } finally {
      loading.current = false;
    }
    trackEvent("book_call", { method: "new_tab" });
    window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <button
      type="button"
      onClick={openPopup}
      className={className}
      aria-haspopup="dialog"
    >
      {children ?? "Book a call"}
    </button>
  );
}
