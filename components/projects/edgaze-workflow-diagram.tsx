"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";

const NODE_LEFT_PCT = [10, 34, 58, 82] as const;
const LABELS = ["Ingest", "Parse", "Execute", "Emit"] as const;

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function EdgazeWorkflowDiagram() {
  const gradId = useId().replace(/:/g, "");
  const reduced = useReducedMotion();
  const [activeNode, setActiveNode] = useState(-1);
  const [rippleNode, setRippleNode] = useState<number | null>(null);
  const [phase, setPhase] = useState<"inputs" | "nodes" | "outputs" | "rest">("rest");
  const cancelledRef = useRef(false);

  const visualActive = reduced ? 1 : activeNode;
  const visualPhase = reduced ? "rest" : phase;

  useEffect(() => {
    if (reduced) return;

    cancelledRef.current = false;

    (async () => {
      while (!cancelledRef.current) {
        setPhase("inputs");
        await sleep(900);
        if (cancelledRef.current) break;

        setPhase("nodes");
        for (let i = 0; i < 4; i++) {
          setActiveNode(i);
          await sleep(1850);
          if (cancelledRef.current) break;
          setRippleNode(i);
          await sleep(380);
          setRippleNode(null);
          await sleep(220);
          if (cancelledRef.current) break;
        }

        setActiveNode(-1);
        setPhase("outputs");
        await sleep(850);
        if (cancelledRef.current) break;

        setPhase("rest");
        await sleep(700);
      }
    })();

    return () => {
      cancelledRef.current = true;
    };
  }, [reduced]);

  return (
    <div className="relative mx-auto w-full max-w-2xl select-none">
      <p className="mb-6 text-center text-[0.75rem] font-medium uppercase tracking-[0.18em] text-zinc-400">
        Execution trace
      </p>

      <div className="relative h-[128px] sm:h-[148px]">
        <svg
          className="absolute left-0 right-0 top-[46%] h-8 w-full -translate-y-1/2 overflow-visible"
          viewBox="0 0 400 32"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(232 121 249)" stopOpacity="0" />
              <stop offset="45%" stopColor="rgb(232 121 249)" stopOpacity="0.35" />
              <stop offset="55%" stopColor="rgb(34 211 238)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(34 211 238)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 12 16 L 388 16"
            fill="none"
            stroke="rgb(255 255 255 / 0.08)"
            strokeWidth="1.25"
            strokeLinecap="round"
            vectorEffect="nonScalingStroke"
          />
          <motion.path
            d="M 12 16 L 388 16"
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="6 14"
            vectorEffect="nonScalingStroke"
            animate={reduced ? undefined : { strokeDashoffset: [0, -80] }}
            transition={reduced ? undefined : { duration: 2.8, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        {!reduced && visualActive >= 0 ? (
          <motion.div
            className="pointer-events-none absolute top-[46%] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-200 shadow-[0_0_14px_rgba(232,121,249,0.65)]"
            initial={false}
            animate={{
              left: `${NODE_LEFT_PCT[visualActive]}%`,
              opacity: [0.88, 1, 0.88]
            }}
            transition={{
              left: { type: "spring", stiffness: 420, damping: 36 },
              opacity: { duration: 1.15, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        ) : null}

        <AnimatePresence>
          {visualPhase === "inputs" && !reduced ? (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`in-${i}`}
                  className="absolute top-[46%] h-2.5 w-2.5 -translate-y-1/2 rounded-[3px] border border-cyan-300/45 bg-cyan-400/20 shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                  initial={{ left: "2%", opacity: 0 }}
                  animate={{ left: `${NODE_LEFT_PCT[0]}%`, opacity: [0, 1, 0.85, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.95,
                    delay: i * 0.11,
                    ease: [0.22, 1, 0.36, 1],
                    opacity: { times: [0, 0.15, 0.72, 1], duration: 0.95, delay: i * 0.11 }
                  }}
                />
              ))}
            </>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {visualPhase === "outputs" && !reduced ? (
            <>
              {[0, 1].map((i) => (
                <motion.div
                  key={`out-${i}`}
                  className="absolute top-[46%] h-2.5 w-2.5 -translate-y-1/2 rounded-[3px] border border-fuchsia-300/50 bg-fuchsia-400/25 shadow-[0_0_12px_rgba(232,121,249,0.25)]"
                  initial={{ left: `${NODE_LEFT_PCT[3]}%`, opacity: 0.9 }}
                  animate={{ left: "96%", opacity: [0.9, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.75,
                    delay: i * 0.14,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                />
              ))}
            </>
          ) : null}
        </AnimatePresence>

        {NODE_LEFT_PCT.map((left, i) => {
          const active = visualActive === i;
          const ripple = rippleNode === i;

          return (
            <div
              key={i}
              className="absolute top-[46%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: `${left}%` }}
            >
              <motion.div
                className="relative flex h-[11px] w-[11px] items-center justify-center rounded-full border border-white/15 bg-zinc-950/90"
                animate={{
                  scale: active ? 1.12 : 1,
                  boxShadow: active
                    ? "0 0 0 1px rgb(232 121 249 / 0.45), 0 0 22px rgb(232 121 249 / 0.35)"
                    : "0 0 0 0 transparent"
                }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                    active ? "bg-fuchsia-200" : "bg-zinc-500"
                  }`}
                />
                <AnimatePresence>
                  {ripple ? (
                    <motion.span
                      className="absolute inset-0 rounded-full border border-fuchsia-300/60 bg-fuchsia-400/15"
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 2.35, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    />
                  ) : null}
                </AnimatePresence>
              </motion.div>
              <span className="mt-3 whitespace-nowrap text-[0.7rem] font-medium uppercase tracking-[0.12em] text-zinc-400">
                {LABELS[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
