"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ProjectAccent } from "../../lib/projects";

type AuroraMode = "accent" | "intro" | "outro" | "firstProject" | "edgaze";

type ProductAuroraBurstProps = {
  mode: AuroraMode;
  accent?: ProjectAccent;
  /** fixed = locked to viewport behind scrolling content. scene = fills parent (relative section). */
  position?: "fixed" | "scene";
  className?: string;
  /** When false, skip infinite motion (saves GPU during off-screen snap scroll). */
  motionActive?: boolean;
  /** Lighter blurs + one fewer layer — use behind scrolling project detail pages. */
  intensity?: "full" | "calm";
};

const accentColors: Record<ProjectAccent, { a: string; b: string; c: string }> = {
  fuchsia: {
    a: "rgba(217,70,239,0.65)",
    b: "rgba(34,211,238,0.45)",
    c: "rgba(192,132,252,0.4)"
  },
  cyan: {
    a: "rgba(34,211,238,0.55)",
    b: "rgba(125,211,252,0.4)",
    c: "rgba(56,189,248,0.35)"
  },
  amber: {
    a: "rgba(251,191,36,0.55)",
    b: "rgba(249,115,22,0.45)",
    c: "rgba(245,158,11,0.32)"
  },
  orange: {
    a: "rgba(232,115,31,0.58)",
    b: "rgba(96,165,250,0.38)",
    c: "rgba(194,80,15,0.38)"
  },
  teal: {
    a: "rgba(45,212,191,0.52)",
    b: "rgba(34,211,238,0.42)",
    c: "rgba(20,184,166,0.35)"
  },
  violet: {
    a: "rgba(167,139,250,0.52)",
    b: "rgba(34,211,238,0.38)",
    c: "rgba(139,92,246,0.38)"
  }
};

/** Intro slide — full-spectrum wash (still vignetted for readable type). */
const introRainbowConic = `conic-gradient(
  from 200deg at 50% 50%,
  rgba(239,68,68,0.5),
  rgba(249,115,22,0.48),
  rgba(250,204,21,0.44),
  rgba(74,222,128,0.42),
  rgba(34,211,238,0.46),
  rgba(59,130,246,0.48),
  rgba(139,92,246,0.5),
  rgba(217,70,239,0.48),
  rgba(236,72,153,0.46),
  rgba(239,68,68,0.5)
)`;

const introRainbowBursts = {
  a: "rgba(249,115,22,0.55)",
  b: "rgba(59,130,246,0.5)",
  c: "rgba(192,38,211,0.52)"
};

const introColors = {
  a: "rgba(34,211,238,0.42)",
  b: "rgba(217,70,239,0.38)",
  c: "rgba(125,211,252,0.28)"
};

const outroColors = {
  a: "rgba(161,161,170,0.32)",
  b: "rgba(167,139,250,0.25)",
  c: "rgba(82,82,91,0.38)"
};

/** First catalog project — reads warmer / more electric than the intro cyan–magenta wash. */
const firstProjectColors = {
  a: "rgba(192,38,211,0.48)",
  b: "rgba(99,102,241,0.52)",
  c: "rgba(244,63,94,0.38)"
};

/** Edgaze slide on /projects — cyan + pink wash (not purple-first). */
const edgazeSceneColors = {
  a: "rgba(34,211,238,0.58)",
  b: "rgba(244,114,182,0.52)",
  c: "rgba(217,70,239,0.48)"
};

function pickColors(mode: AuroraMode, accent?: ProjectAccent) {
  if (mode === "intro") return introRainbowBursts;
  if (mode === "outro") return outroColors;
  if (mode === "edgaze") return edgazeSceneColors;
  if (mode === "firstProject") return firstProjectColors;
  if (accent && mode === "accent") return accentColors[accent];
  return introColors;
}

export function ProductAuroraBurst({
  mode,
  accent,
  position = "scene",
  className = "",
  motionActive = true,
  intensity = "full"
}: ProductAuroraBurstProps) {
  const reduced = useReducedMotion();
  const c = pickColors(mode, accent);
  const isIntroRainbow = mode === "intro";
  const runAmbient = motionActive && !reduced;
  const calm = intensity === "calm";

  const posClass =
    position === "fixed"
      ? "pointer-events-none fixed inset-0 z-0 overflow-hidden"
      : "pointer-events-none absolute inset-0 z-0 overflow-hidden";

  const spinDuration = runAmbient ? 48 : 0;
  const pulse1 = runAmbient ? 14 : 0;
  const pulse2 = runAmbient ? 18 : 0;

  const blurSpin =
    position === "scene"
      ? calm
        ? "blur-[48px] sm:blur-[62px] md:blur-[72px]"
        : "blur-[64px] sm:blur-[80px] md:blur-[96px]"
      : calm
        ? "blur-[56px] sm:blur-[72px] md:blur-[88px]"
        : "blur-[80px] sm:blur-[100px] md:blur-[120px]";

  const blurR1 = calm
    ? "blur-[52px] sm:blur-[66px] md:blur-[78px]"
    : "blur-[72px] sm:blur-[92px] md:blur-[108px]";
  const blurR2 = calm
    ? "blur-[46px] sm:blur-[60px] md:blur-[72px]"
    : "blur-[68px] sm:blur-[88px] md:blur-[104px]";
  const blurR3 = calm
    ? "blur-[42px] sm:blur-[54px] md:blur-[64px]"
    : "blur-[60px] sm:blur-[78px] md:blur-[92px]";

  /** Off-screen / paused: static layers only — avoids Framer + filter repaints during scroll. */
  if (!runAmbient) {
    return (
      <div className={`${posClass} ${className}`} aria-hidden>
        <div className="absolute inset-0 bg-[#06060c]" />
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div
            className={`aspect-square w-[min(200vmin,110rem)] shrink-0 ${blurSpin}`}
            style={{
              background: isIntroRainbow
                ? introRainbowConic
                : `conic-gradient(from 200deg at 50% 50%, ${c.a}, ${c.b}, ${c.c}, ${c.a})`,
              opacity: 0.92
            }}
          />
        </div>
        <div
          className={`absolute left-[-20%] top-[-15%] h-[min(95vw,52rem)] w-[min(95vw,52rem)] rounded-full opacity-[0.88] ${blurR1}`}
          style={{
            background: `radial-gradient(circle closest-side, ${c.a}, transparent 72%)`
          }}
        />
        <div
          className={`absolute bottom-[-25%] right-[-15%] h-[min(85vw,44rem)] w-[min(85vw,44rem)] rounded-full opacity-[0.78] ${blurR2}`}
          style={{
            background: `radial-gradient(circle closest-side, ${c.b}, transparent 70%)`
          }}
        />
        {!calm ? (
          <div
            className={`absolute left-[25%] top-[40%] h-[min(70vw,36rem)] w-[min(70vw,36rem)] rounded-full opacity-[0.65] ${blurR3}`}
            style={{
              background: `radial-gradient(circle closest-side, ${c.c}, transparent 68%)`
            }}
          />
        ) : null}
        <div
          className={
            isIntroRainbow
              ? "absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/78"
              : "absolute inset-0 bg-gradient-to-b from-[#030304]/20 via-transparent to-[#030304]/72"
          }
        />
        <div
          className={
            isIntroRainbow
              ? "absolute inset-0 bg-[radial-gradient(ellipse_95%_70%_at_50%_42%,transparent_0%,rgb(6_6_12_/_0.88)_58%)]"
              : "absolute inset-0 bg-[radial-gradient(ellipse_95%_70%_at_50%_42%,transparent_0%,#030304_62%)]"
          }
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_35%,rgba(0,0,0,0.15),transparent_100%)]" />
      </div>
    );
  }

  return (
    <div className={`${posClass} ${className}`} aria-hidden>
      <div className="absolute inset-0 bg-[#06060c]" />

      {/* Slow rotating colour field — reads as “moving” gradient */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <motion.div
          className={`aspect-square w-[min(200vmin,110rem)] shrink-0 ${blurSpin}`}
          style={{
            background: isIntroRainbow
              ? introRainbowConic
              : `conic-gradient(from 200deg at 50% 50%, ${c.a}, ${c.b}, ${c.c}, ${c.a})`
          }}
          initial={false}
          animate={{ rotate: 360 }}
          transition={{ duration: spinDuration, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Large radial bursts — drift via scale / opacity */}
      <motion.div
        className={`absolute left-[-20%] top-[-15%] h-[min(95vw,52rem)] w-[min(95vw,52rem)] rounded-full ${blurR1}`}
        style={{
          background: `radial-gradient(circle closest-side, ${c.a}, transparent 72%)`
        }}
        animate={{
          scale: [1, 1.18, 1.05, 1.14, 1],
          opacity: [0.75, 1, 0.82, 0.95, 0.75]
        }}
        transition={{ duration: pulse1, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`absolute bottom-[-25%] right-[-15%] h-[min(85vw,44rem)] w-[min(85vw,44rem)] rounded-full ${blurR2}`}
        style={{
          background: `radial-gradient(circle closest-side, ${c.b}, transparent 70%)`
        }}
        animate={{
          scale: [1.1, 0.92, 1.08, 1, 1.1],
          opacity: [0.65, 0.92, 0.7, 0.88, 0.65]
        }}
        transition={{ duration: pulse2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />
      {!calm ? (
        <motion.div
          className={`absolute left-[25%] top-[40%] h-[min(70vw,36rem)] w-[min(70vw,36rem)] rounded-full ${blurR3}`}
          style={{
            background: `radial-gradient(circle closest-side, ${c.c}, transparent 68%)`
          }}
          animate={{
            scale: [0.95, 1.12, 1, 1.15, 0.95],
            opacity: [0.5, 0.85, 0.6, 0.78, 0.5]
          }}
          transition={{ duration: runAmbient ? 21 : 0, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
        />
      ) : null}

      {/* Vignette + readability over text — lighter bottom so snap gaps don’t read as empty voids */}
      <div
        className={
          isIntroRainbow
            ? "absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/78"
            : "absolute inset-0 bg-gradient-to-b from-[#030304]/20 via-transparent to-[#030304]/72"
        }
      />
      <div
        className={
          isIntroRainbow
            ? "absolute inset-0 bg-[radial-gradient(ellipse_95%_70%_at_50%_42%,transparent_0%,rgb(6_6_12_/_0.88)_58%)]"
            : "absolute inset-0 bg-[radial-gradient(ellipse_95%_70%_at_50%_42%,transparent_0%,#030304_62%)]"
        }
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_35%,rgba(0,0,0,0.15),transparent_100%)]" />
    </div>
  );
}
