"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaArrowRight, FaArrowUpRightFromSquare, FaXmark } from "react-icons/fa6";

type LeavingSiteLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
  countdownSeconds?: number;
  leavingText?: string;
};

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

export function LeavingSiteLink({
  href,
  className,
  children,
  countdownSeconds = 5,
  leavingText = "Run real AI workflows. Not demos."
}: LeavingSiteLinkProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [remainingMs, setRemainingMs] = useState(countdownSeconds * 1000);
  const startRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const totalMs = countdownSeconds * 1000;
  const secondsLeft = Math.max(0, Math.ceil(remainingMs / 1000));
  const progress = clamp01(1 - remainingMs / totalMs);

  const close = useCallback(() => {
    setOpen(false);
    setRemainingMs(totalMs);
    startRef.current = null;
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [totalMs]);

  const go = useCallback(() => {
    window.location.assign(href);
  }, [href]);

  const begin = useCallback(() => {
    setOpen(true);
    setRemainingMs(totalMs);
    startRef.current = performance.now();
    if (timerRef.current != null) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      const start = startRef.current;
      if (start == null) return;
      const elapsed = performance.now() - start;
      const next = Math.max(0, totalMs - elapsed);
      setRemainingMs(next);
      if (next <= 0) {
        window.clearInterval(timerRef.current!);
        timerRef.current = null;
        go();
      }
    }, 50);
  }, [go, totalMs]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, open]);

  useEffect(() => {
    return () => {
      if (timerRef.current != null) window.clearInterval(timerRef.current);
    };
  }, []);

  const circle = useMemo(() => {
    const size = 44;
    const stroke = 3;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const dashOffset = c * (1 - progress);
    return { size, stroke, r, c, dashOffset };
  }, [progress]);

  const modal = (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="leaving-site-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] flex items-center justify-center overflow-y-auto overscroll-contain p-5 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Leaving site confirmation"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="fixed inset-0 cursor-default bg-black/75 backdrop-blur-md"
          />

          <motion.div
            key="leaving-site-panel"
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="relative z-10 my-auto w-full max-w-[28.5rem] shrink-0 overflow-hidden rounded-2xl border border-white/[0.12] bg-[#070708]/92 shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/14 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-fuchsia-500/12 blur-[90px]" />

            <div className="relative p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                    You’re heading to Edgaze
                  </p>
                  <p className="mt-3 text-[0.98rem] font-medium leading-relaxed text-zinc-200">
                    {leavingText}
                  </p>
                  <p className="mt-3 text-[0.82rem] text-zinc-500">
                    Redirecting in{" "}
                    <span className="font-semibold text-zinc-300">{secondsLeft}s</span>
                  </p>
                </div>

                <div className="shrink-0">
                  <div className="relative h-11 w-11">
                    <svg
                      width={circle.size}
                      height={circle.size}
                      viewBox={`0 0 ${circle.size} ${circle.size}`}
                      className="absolute inset-0"
                      aria-hidden="true"
                    >
                      <circle
                        cx={circle.size / 2}
                        cy={circle.size / 2}
                        r={circle.r}
                        stroke="rgba(255,255,255,0.14)"
                        strokeWidth={circle.stroke}
                        fill="transparent"
                      />
                      <circle
                        cx={circle.size / 2}
                        cy={circle.size / 2}
                        r={circle.r}
                        stroke="rgba(34,211,238,0.85)"
                        strokeWidth={circle.stroke}
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray={circle.c}
                        strokeDashoffset={circle.dashOffset}
                        transform={`rotate(-90 ${circle.size / 2} ${circle.size / 2})`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-200">
                      <FaArrowUpRightFromSquare
                        className="h-[0.95rem] w-[0.95rem]"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-5">
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-zinc-200 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
                >
                  <FaXmark className="h-4 w-4" aria-hidden="true" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={go}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-[linear-gradient(130deg,rgba(34,211,238,0.16),rgba(232,121,249,0.12))] px-4 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white transition-all hover:border-cyan-200/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
                >
                  Go now
                  <FaArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <a
        href={href}
        className={className}
        onClick={(e) => {
          e.preventDefault();
          begin();
        }}
      >
        {children}
      </a>
      {mounted ? createPortal(modal, document.body) : null}
    </>
  );
}

