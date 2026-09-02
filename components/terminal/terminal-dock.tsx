"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

export type DockState = "hidden" | "minimized" | "closed";

/** Geometry shared with the minimize animation so the window flies to the icon. */
export const DOCK_MARGIN = 16;
export const DOCK_PADDING = 6;
export const DOCK_ICON = 52;

export function dockIconCenter(): { x: number; y: number } {
  const x = DOCK_MARGIN + DOCK_PADDING + DOCK_ICON / 2;
  const y = window.innerHeight - DOCK_MARGIN - DOCK_PADDING - DOCK_ICON / 2 - 6;
  return { x, y };
}

function TerminalAppIcon() {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[13px] border border-white/[0.16] bg-[linear-gradient(180deg,#3c3c40_0%,#1f1f22_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_2px_6px_rgba(0,0,0,0.5)]"
      aria-hidden
    >
      <div className="absolute inset-[3px] rounded-[10px] bg-[#0b0b0d]">
        <div className="absolute inset-x-0 top-0 h-[7px] rounded-t-[10px] bg-[linear-gradient(180deg,#5d5d62,#4a4a4f)]" />
        <span
          className="absolute left-[7px] top-[11px] text-[13px] font-bold leading-none text-white"
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
          }}
        >
          &gt;_
        </span>
      </div>
    </div>
  );
}

export function TerminalDock({
  state,
  onOpen,
}: {
  state: DockState;
  onOpen: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [hover, setHover] = useState(false);
  const [bouncing, setBouncing] = useState(false);

  const activate = () => {
    if (bouncing) return;
    if (reduceMotion) return onOpen();
    setBouncing(true);
    window.setTimeout(() => {
      setBouncing(false);
      onOpen();
    }, 420);
  };

  return (
    <AnimatePresence>
      {state !== "hidden" ? (
        <motion.div
          key="dock"
          initial={{ y: 72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 72, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.7 }}
          className="fixed z-[80]"
          style={{ left: DOCK_MARGIN, bottom: DOCK_MARGIN }}
          role="toolbar"
          aria-label="Dock"
        >
          <div
            className="flex items-end rounded-[19px] border border-white/[0.14] bg-[rgba(40,40,44,0.62)] shadow-[0_10px_30px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl"
            style={{ padding: DOCK_PADDING }}
          >
            <div className="relative flex flex-col items-center">
              <AnimatePresence>
                {hover ? (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    transition={{ duration: 0.14 }}
                    className="pointer-events-none absolute -top-[46px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[7px] border border-white/[0.12] bg-[rgba(48,48,52,0.92)] px-3 py-1.5 text-[13px] font-medium text-white shadow-[0_6px_18px_rgba(0,0,0,0.45)] backdrop-blur-xl"
                    role="tooltip"
                  >
                    Terminal
                    <span className="absolute left-1/2 top-full -ml-[6px] border-x-[6px] border-t-[6px] border-x-transparent border-t-[rgba(48,48,52,0.92)]" />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <motion.button
                type="button"
                aria-label={state === "minimized" ? "Show Terminal" : "Open Terminal"}
                onClick={activate}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onFocus={() => setHover(true)}
                onBlur={() => setHover(false)}
                animate={
                  bouncing
                    ? { y: [0, -22, 0, -10, 0], scale: 1.08 }
                    : {
                        y: hover && !reduceMotion ? -6 : 0,
                        scale: hover && !reduceMotion ? 1.14 : 1,
                      }
                }
                transition={
                  bouncing
                    ? { duration: 0.42, ease: "easeOut" }
                    : { type: "spring", stiffness: 420, damping: 26 }
                }
                className="block origin-bottom rounded-[13px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                style={{ height: DOCK_ICON, width: DOCK_ICON }}
              >
                <TerminalAppIcon />
              </motion.button>

              <span
                aria-hidden
                className={`mt-[3px] h-[3px] w-[3px] rounded-full transition-opacity ${state === "minimized" ? "bg-white/85 opacity-100" : "opacity-0"}`}
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
