"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Mount animation (hero) instead of in-view (everything else). */
  onMount?: boolean;
};

/** The one motion primitive used on project pages: a short fade + 14px rise, once. */
export function Reveal({ children, className, delay = 0, onMount = false }: RevealProps) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  const visible = { opacity: 1, y: 0 };
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      {...(onMount ? { animate: visible } : { whileInView: visible, viewport: { once: true, amount: 0.2 } })}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
