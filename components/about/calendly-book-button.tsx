"use client";

import { useCallback, useEffect } from "react";

const CALENDLY_URL = "https://calendly.com/arjun-edgaze/creator_call";
const CALENDLY_CSS = "https://assets.calendly.com/assets/external/widget.css";
const CALENDLY_STYLE_ID = "calendly-widget-css";

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

export function CalendlyBookButton({ className, children }: CalendlyBookButtonProps) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(CALENDLY_STYLE_ID)) return;
    const link = document.createElement("link");
    link.id = CALENDLY_STYLE_ID;
    link.rel = "stylesheet";
    link.href = CALENDLY_CSS;
    document.head.appendChild(link);
  }, []);

  const openPopup = useCallback(() => {
    if (typeof window === "undefined") return;
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
    }
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
