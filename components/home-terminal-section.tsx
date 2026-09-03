"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import { trackEvent } from "../lib/analytics";
import type { TermPost } from "../lib/terminal/types";
import { AKTerminalWindow } from "./ak-terminal-window";
import { arTitleCard } from "./projects/archive-typography";
import { dockIconCenter, TerminalDock } from "./terminal/terminal-dock";

type WindowState = "open" | "minimized" | "closed";

const MINIMIZE_EASE = [0.32, 0, 0.24, 1] as const;

export function HomeTerminalSection({ posts = [] }: { posts?: TermPost[] }) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const labelId = useId();

  const [state, setState] = useState<WindowState>("open");
  const [session, setSession] = useState(0);
  const [slotHeight, setSlotHeight] = useState<number | undefined>(undefined);
  const [flight, setFlight] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.92", "end 0.08"],
  });
  const scaleRaw = useTransform(
    scrollYProgress,
    [0, 0.42, 0.58, 1],
    [0.965, 1, 1, 0.972]
  );
  const clarityRaw = useTransform(scrollYProgress, [0, 0.38, 0.62, 1], [0.88, 1, 1, 0.9]);
  const scale = useSpring(scaleRaw, { stiffness: 120, damping: 24, mass: 0.35 });
  const clarity = useSpring(clarityRaw, { stiffness: 100, damping: 22, mass: 0.32 });

  // Keep the slot the size of the window so the page does not jump when it leaves.
  useLayoutEffect(() => {
    if (state !== "open") return;
    const el = windowRef.current;
    if (!el) return;
    const update = () => setSlotHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [state, session]);

  // Vector from the window's centre to the dock icon, in viewport pixels. Measured on the
  // untransformed slot so it stays correct while the window itself is scaled into the Dock.
  const measureFlight = useCallback(() => {
    const el = slotRef.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    const dock = dockIconCenter();
    return { x: dock.x - (r.left + r.width / 2), y: dock.y - (r.top + r.height / 2) };
  }, []);

  const blurWindow = () => {
    const el = document.activeElement;
    if (el instanceof HTMLElement && windowRef.current?.contains(el)) el.blur();
  };

  const minimize = useCallback(() => {
    setFlight(measureFlight());
    blurWindow();
    setState("minimized");
    trackEvent("terminal_window", { action: "minimize" });
  }, [measureFlight]);

  const close = useCallback(() => {
    setFlight(measureFlight());
    blurWindow();
    setState("closed");
    trackEvent("terminal_window", { action: "close" });
  }, [measureFlight]);

  // Bring the terminal's spot on the page into view first, then fly the window out of the Dock.
  const restore = useCallback(() => {
    const open = () => {
      setFlight(measureFlight());
      if (state === "closed") setSession((s) => s + 1);
      setState("open");
      trackEvent("terminal_window", { action: "reopen" });
    };
    const slot = slotRef.current;
    if (!slot) return open();
    const r = slot.getBoundingClientRect();
    const inView = r.top >= 96 && r.bottom <= window.innerHeight - 16;
    if (inView) return open();
    slot.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.removeEventListener("scrollend", finish);
      open();
    };
    window.addEventListener("scrollend", finish, { once: true });
    window.setTimeout(finish, reduceMotion ? 50 : 700);
  }, [measureFlight, reduceMotion, state]);

  const minimizedStyle = { x: flight.x, y: flight.y, scale: 0.06, opacity: 0 };
  const openStyle = { x: 0, y: 0, scale: 1, opacity: 1 };

  return (
    <section
      ref={sectionRef}
      id="terminal"
      aria-labelledby={labelId}
      className="relative px-6 pb-24 pt-10 sm:pb-28 sm:pt-12 lg:px-10 lg:pb-32"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[min(42rem,120%)] -translate-y-1/2 bg-[radial-gradient(ellipse_55%_45%_at_50%_50%,rgba(34,211,238,0.07),transparent_62%),radial-gradient(ellipse_50%_40%_at_40%_55%,rgba(232,121,249,0.06),transparent_58%)] opacity-90"
        aria-hidden
      />

      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10 max-w-3xl sm:mb-12"
        >
          <p
            id={labelId}
            className="mb-3 text-xs font-medium tracking-[0.08em] text-zinc-400"
          >
            Terminal
          </p>
          <h2
            className={`${arTitleCard} text-[1.65rem] leading-[1.12] tracking-[-0.03em] text-white sm:text-3xl sm:leading-[1.1] lg:text-[2.05rem]`}
          >
            The site has another interface.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-[0.9375rem]">
            A functional shell over the portfolio. Browse projects and writing, inspect
            Edgaze, navigate a virtual filesystem, open pages, or subscribe without
            leaving the terminal.
          </p>
        </motion.div>

        <motion.div
          style={{ scale: reduceMotion ? 1 : scale, opacity: reduceMotion ? 1 : clarity }}
          className="mx-auto w-full will-change-transform"
        >
          <div ref={slotRef} className="relative" style={{ minHeight: slotHeight }}>
            <AnimatePresence>
              {state !== "open" ? (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 }}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                  aria-hidden
                >
                  <p className="text-[13px] text-zinc-600">
                    {state === "minimized"
                      ? "Terminal is in the Dock"
                      : "Terminal quit. Open it from the Dock"}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {state !== "closed" ? (
                <motion.div
                  key={`window-${session}`}
                  ref={windowRef}
                  initial={reduceMotion ? { opacity: 0 } : minimizedStyle}
                  animate={
                    state === "open"
                      ? openStyle
                      : reduceMotion
                        ? { opacity: 0 }
                        : minimizedStyle
                  }
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : {
                          scale: 0.96,
                          opacity: 0,
                          transition: { duration: 0.18, ease: "easeIn" },
                        }
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0.2 }
                      : { duration: 0.46, ease: MINIMIZE_EASE }
                  }
                  style={{ transformOrigin: "50% 50%" }}
                  className={state === "open" ? "" : "pointer-events-none"}
                  aria-hidden={state !== "open"}
                >
                  <AKTerminalWindow
                    context="home"
                    posts={posts}
                    showSuggestions
                    className="w-full"
                    onClose={close}
                    onMinimize={minimize}
                    onFullscreen={() => {
                      trackEvent("terminal_window", { action: "zoom" });
                      router.push("/terminal", { transitionTypes: ["to-terminal"] });
                    }}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <TerminalDock state={state === "open" ? "hidden" : state} onOpen={restore} />
    </section>
  );
}
