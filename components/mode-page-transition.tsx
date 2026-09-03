import { ViewTransition, type ReactNode } from "react";

const direction = {
  "to-terminal": "to-terminal",
  "to-web": "to-web",
  default: "none",
} as const;

export function ModePageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={direction} exit={direction} default="none">
      {children}
    </ViewTransition>
  );
}
