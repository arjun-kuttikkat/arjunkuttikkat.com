"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Fixed layer: structural grid + slow drifting light. Kept very low contrast. */
export function EdgazeWorkflowBackdrop() {
  const reduced = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 z-[5]" aria-hidden>
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(255 255 255 / 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(255 255 255 / 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px"
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to right, rgb(255 255 255 / 0.35) 1px, transparent 1px)`,
          backgroundSize: "12px 100%"
        }}
      />
      {!reduced ? (
        <motion.div
          className="absolute -left-[20%] top-[22%] h-[min(42vh,28rem)] w-[min(42vh,28rem)] rounded-full bg-fuchsia-400/[0.06] blur-[72px]"
          animate={{ x: ["0vw", "55vw", "0vw"], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 36, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}
      {!reduced ? (
        <motion.div
          className="absolute -right-[15%] bottom-[18%] h-[min(38vh,24rem)] w-[min(38vh,24rem)] rounded-full bg-cyan-400/[0.05] blur-[64px]"
          animate={{ x: ["0vw", "-40vw", "0vw"], opacity: [0.3, 0.48, 0.3] }}
          transition={{ duration: 42, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      ) : null}
    </div>
  );
}
