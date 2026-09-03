"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import type { ProjectAccent } from "../../../lib/projects";

/** Two colours per project, used only as soft edge light against black. */
const accents: Record<ProjectAccent, [string, string]> = {
  fuchsia: ["rgba(232,121,249,0.20)", "rgba(34,211,238,0.16)"],
  cyan: ["rgba(34,211,238,0.18)", "rgba(125,211,252,0.12)"],
  amber: ["rgba(251,191,36,0.16)", "rgba(249,115,22,0.12)"],
  orange: ["rgba(232,115,31,0.18)", "rgba(96,165,250,0.11)"],
  teal: ["rgba(45,212,191,0.16)", "rgba(34,211,238,0.12)"],
  violet: ["rgba(167,139,250,0.16)", "rgba(99,102,241,0.13)"]
};

/**
 * Project page background: flat black with two gradients pinned to the left and right edges.
 * They drift vertically with scroll (transform only, GPU-composited) so the page does not feel
 * like content sliding over a frozen image. No grid, no noise, no rotation.
 */
export function ProjectBackdrop({ accent }: { accent: ProjectAccent }) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 26, mass: 0.4 });

  const leftY = useTransform(smooth, [0, 1], ["-8%", "58%"]);
  const rightY = useTransform(smooth, [0, 1], ["18%", "-32%"]);
  const topFade = useTransform(smooth, [0, 0.12], [1, 0]);

  const [a, b] = accents[accent];

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black" aria-hidden>
      <motion.div
        className="absolute -left-[28vw] top-0 h-[70vh] w-[62vw] rounded-full blur-[130px] will-change-transform"
        style={{
          background: `radial-gradient(circle closest-side, ${a}, transparent 72%)`,
          y: reduced ? "10%" : leftY
        }}
      />
      <motion.div
        className="absolute -right-[26vw] top-0 h-[62vh] w-[56vw] rounded-full blur-[130px] will-change-transform"
        style={{
          background: `radial-gradient(circle closest-side, ${b}, transparent 70%)`,
          y: reduced ? "20%" : rightY
        }}
      />
      <motion.div
        className="absolute inset-x-0 top-0 h-[38rem]"
        style={{
          background: `radial-gradient(70rem 26rem at 50% -8%, ${a}, transparent 68%)`,
          opacity: reduced ? 0.5 : topFade
        }}
      />
    </div>
  );
}
