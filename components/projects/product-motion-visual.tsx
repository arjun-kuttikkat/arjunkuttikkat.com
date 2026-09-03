"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";
import type { ProjectVisualTheme } from "../../lib/projects";

const EDGAZE_ROCKET_SMOKE = [
  { cx: -16, cy: 28, rx: 6, ry: 4, driftX: -12, driftY: 18, delay: 0, duration: 0.9 },
  { cx: -6, cy: 30, rx: 8, ry: 5, driftX: -6, driftY: 22, delay: 0.08, duration: 1 },
  { cx: 4, cy: 30, rx: 8, ry: 5, driftX: 6, driftY: 22, delay: 0.16, duration: 0.96 },
  { cx: 14, cy: 28, rx: 6, ry: 4, driftX: 12, driftY: 18, delay: 0.24, duration: 0.88 },
  { cx: -10, cy: 38, rx: 10, ry: 6, driftX: -14, driftY: 28, delay: 0.12, duration: 1.06 },
  { cx: 10, cy: 38, rx: 10, ry: 6, driftX: 14, driftY: 28, delay: 0.2, duration: 1.06 },
  { cx: 0, cy: 44, rx: 14, ry: 8, driftX: 0, driftY: 34, delay: 0.3, duration: 1.12 }
] as const;

const COMPASS_NODES = [
  { x: 62, y: 78, r: 7, role: "orange" },
  { x: 118, y: 42, r: 8, role: "orange" },
  { x: 126, y: 116, r: 7, role: "blue" },
  { x: 196, y: 76, r: 11, role: "selected" },
  { x: 268, y: 40, r: 7, role: "orange" },
  { x: 282, y: 106, r: 8, role: "blue" },
  { x: 342, y: 68, r: 7, role: "blue" },
  { x: 344, y: 126, r: 6, role: "orange" }
] as const;

const COMPASS_EDGES = [
  [0, 1],
  [0, 3],
  [1, 3],
  [2, 3],
  [3, 4],
  [3, 5],
  [3, 6],
  [4, 6],
  [5, 6],
  [5, 7],
  [6, 7]
] as const;

export type ProductMotionVariant = "showcase" | "backdrop";

type ProductMotionVisualProps = {
  theme: ProjectVisualTheme;
  variant?: ProductMotionVariant;
  className?: string;
  /** Pause looping SVG motion when the showcase slide is off-screen (scroll performance). */
  suspendMotion?: boolean;
};

export function ProductMotionVisual({
  theme,
  variant = "showcase",
  className = "",
  suspendMotion = false
}: ProductMotionVisualProps) {
  const reduced = useReducedMotion();
  const run = !reduced && !suspendMotion;
  const uid = useId().replace(/:/g, "");
  const isBackdrop = variant === "backdrop";

  const wrap = isBackdrop
    ? `pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden ${className}`
    : `relative mx-auto flex w-full max-w-lg justify-center ${className}`;

  const svgH = isBackdrop ? "h-[min(22rem,55vh)] w-full max-w-2xl opacity-90" : "h-44 w-full max-w-md sm:h-52 md:h-56";

  if (theme === "workflow") {
    const gid = `wf-${uid}`;
    const skyId = `wf-sky-${uid}`;
    const clipId = `wf-clip-${uid}`;
    const glowId = `wf-glow-${uid}`;
    const labelStyle = { fontSize: 9, fontFamily: "system-ui, sans-serif" } as const;

    return (
      <div className={wrap} aria-hidden>
        <svg viewBox="0 0 440 200" className={svgH} fill="none">
          <defs>
            <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(34 211 238 / 0.45)" />
              <stop offset="55%" stopColor="rgb(232 121 249 / 0.5)" />
              <stop offset="100%" stopColor="rgb(34 211 238 / 0.35)" />
            </linearGradient>
            <linearGradient id={skyId} x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="rgb(12 10 24)" />
              <stop offset="45%" stopColor="rgb(30 20 55)" />
              <stop offset="100%" stopColor="rgb(45 25 78)" />
            </linearGradient>
            <radialGradient id={glowId} cx="50%" cy="85%" r="65%">
              <stop offset="0%" stopColor="rgb(251 113 133 / 0.45)" />
              <stop offset="45%" stopColor="rgb(232 121 249 / 0.12)" />
              <stop offset="100%" stopColor="rgb(232 121 249 / 0)" />
            </radialGradient>
            <clipPath id={clipId}>
              <rect x="262" y="46" width="158" height="118" rx="7" />
            </clipPath>
          </defs>

          <text x="32" y="26" fill="#71717a" style={labelStyle}>
            Inputs
          </text>
          <text x="168" y="26" fill="#71717a" style={labelStyle}>
            Flow
          </text>
          <text x="312" y="26" fill="#71717a" style={labelStyle}>
            Share & sell
          </text>

          {/* Base edges (dim) */}
          <path
            d="M 58 78 C 108 78, 118 88, 152 94"
            stroke="rgb(255 255 255 / 0.07)"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d="M 58 128 C 112 128, 120 102, 152 98"
            stroke="rgb(255 255 255 / 0.07)"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d="M 178 96 C 210 88, 232 82, 252 78"
            stroke="rgb(255 255 255 / 0.07)"
            strokeWidth="1.25"
            strokeLinecap="round"
          />

          {/* Animated flow strokes */}
          <motion.path
            d="M 58 78 C 108 78, 118 88, 152 94"
            stroke={`url(#${gid})`}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeDasharray="5 12"
            initial={false}
            animate={run ? { strokeDashoffset: [0, -102] } : { strokeDashoffset: 0 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M 58 128 C 112 128, 120 102, 152 98"
            stroke={`url(#${gid})`}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeDasharray="5 12"
            initial={false}
            animate={run ? { strokeDashoffset: [0, -102] } : { strokeDashoffset: 0 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear", delay: 0.35 }}
          />
          <motion.path
            d="M 178 96 C 210 88, 232 82, 252 78"
            stroke={`url(#${gid})`}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeDasharray="5 12"
            initial={false}
            animate={run ? { strokeDashoffset: [0, -85] } : { strokeDashoffset: 0 }}
            transition={{ duration: 2.1, repeat: Infinity, ease: "linear", delay: 0.2 }}
          />

          {/* Input nodes */}
          <motion.g
            initial={false}
            animate={run ? { x: [0, 2.5, -1, 0], y: [0, -1.5, 1, 0] } : { x: 0, y: 0 }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect
              x="46"
              y="68"
              width="22"
              height="22"
              rx="6"
              fill="#09090b"
              stroke="rgb(34 211 238 / 0.5)"
              strokeWidth="1.35"
            />
            <rect
              x="46"
              y="118"
              width="22"
              height="22"
              rx="6"
              fill="#09090b"
              stroke="rgb(34 211 238 / 0.38)"
              strokeWidth="1.25"
            />
          </motion.g>

          {/* Merge / flow hub */}
          <motion.g
            initial={false}
            animate={run ? { x: [0, -2, 2, 0], y: [0, 2, -1.5, 0] } : { x: 0, y: 0 }}
            transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          >
            <rect
              x="156"
              y="84"
              width="36"
              height="28"
              rx="8"
              fill="#09090b"
              stroke="rgb(232 121 249 / 0.52)"
              strokeWidth="1.4"
            />
            <circle cx="174" cy="98" r="3.5" fill="rgb(232 121 249 / 0.35)" />
          </motion.g>

          {/* Token traveling hub → screen */}
          <motion.circle
            r={4}
            fill="rgb(250 250 250 / 0.92)"
            initial={false}
            animate={
              run
                ? {
                    cx: [174, 220, 258],
                    cy: [98, 88, 78],
                    opacity: [0, 1, 0]
                  }
                : { cx: 174, cy: 98, opacity: 0.35 }
            }
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
          />

          {/* Monitor / product surface */}
          <rect
            x="248"
            y="38"
            width="178"
            height="134"
            rx="14"
            stroke="rgb(255 255 255 / 0.14)"
            strokeWidth="1.15"
            fill="rgb(9 9 11 / 0.5)"
          />
          <rect x="256" y="44" width="162" height="122" rx="10" stroke="rgb(255 255 255 / 0.06)" strokeWidth="1" />

          <g clipPath={`url(#${clipId})`}>
            <rect x="262" y="46" width="158" height="118" fill={`url(#${skyId})`} />
            <circle cx="278" cy="58" r="0.9" fill="rgb(255 255 255 / 0.35)" />
            <circle cx="302" cy="64" r="0.65" fill="rgb(255 255 255 / 0.22)" />
            <circle cx="392" cy="54" r="0.75" fill="rgb(255 255 255 / 0.28)" />
            <circle cx="368" cy="72" r="0.55" fill="rgb(255 255 255 / 0.18)" />
            <circle cx="288" cy="138" r="0.7" fill="rgb(255 255 255 / 0.15)" />

            <ellipse cx="341" cy="152" rx="48" ry="14" fill={`url(#${glowId})`} opacity={0.85} />

            <g transform={`translate(341, ${run ? 160 : 142})`}>
              <g
                className={
                  run
                    ? "edgaze-workflow-rocket-shift edgaze-workflow-rocket-shift--run"
                    : "edgaze-workflow-rocket-shift"
                }
              >
                {EDGAZE_ROCKET_SMOKE.map((puff, i) => (
                  <motion.ellipse
                    key={i}
                    cx={puff.cx}
                    cy={puff.cy}
                    rx={puff.rx}
                    ry={puff.ry}
                    fill="rgb(241 245 249 / 0.2)"
                    initial={false}
                    animate={
                      run
                        ? {
                            cx: [puff.cx, puff.cx + puff.driftX * 0.35, puff.cx + puff.driftX],
                            cy: [puff.cy, puff.cy + puff.driftY * 0.45, puff.cy + puff.driftY],
                            rx: [puff.rx * 0.8, puff.rx * 1.15, puff.rx * 1.75],
                            ry: [puff.ry * 0.8, puff.ry * 1.12, puff.ry * 1.8],
                            opacity: [0, 0.6, 0]
                          }
                        : { opacity: 0.2 }
                    }
                    transition={{
                      duration: puff.duration,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: puff.delay
                    }}
                  />
                ))}
                <motion.ellipse
                  cx={0}
                  cy={22}
                  rx={4.5}
                  ry={8}
                  fill="rgb(251 146 60 / 0.42)"
                  initial={false}
                  animate={run ? { ry: [7, 11, 8], opacity: [0.35, 0.82, 0.3] } : { opacity: 0.35 }}
                  transition={{ duration: 0.24, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.path
                  d="M 0 10 L -5 22 L 5 22 Z"
                  fill="rgb(251 113 133 / 0.55)"
                  initial={false}
                  animate={run ? { opacity: [0.35, 0.95, 0.35] } : { opacity: 0.45 }}
                  transition={{ duration: 0.22, repeat: Infinity, ease: "easeInOut" }}
                />
                <path
                  d="M 0 -26 L -7 -4 H 7 Z"
                  fill="rgb(228 231 236 / 0.92)"
                  stroke="rgb(255 255 255 / 0.22)"
                  strokeWidth="0.75"
                  strokeLinejoin="round"
                />
                <rect x="-6" y="-4" width="12" height="20" rx="2" fill="rgb(200 205 214 / 0.9)" />
                <rect x="-4" y="0" width="8" height="5" rx="1.2" fill="rgb(56 189 248 / 0.38)" />
                <path d="M -6 16 L -9 24 L -3 21 Z" fill="rgb(148 163 184 / 0.55)" />
                <path d="M 6 16 L 9 24 L 3 21 Z" fill="rgb(148 163 184 / 0.55)" />
              </g>
            </g>
          </g>

          {/* Screen glass sheen */}
          <path
            d="M 268 52 L 318 52 L 288 158 L 268 158 Z"
            fill="rgb(255 255 255 / 0.03)"
            style={{ pointerEvents: "none" }}
          />
        </svg>
      </div>
    );
  }

  if (theme === "editorial") {
    return (
      <div className={wrap} aria-hidden>
        <div className={`relative ${isBackdrop ? "h-48 w-64" : "h-40 w-56 sm:h-44 sm:w-64"}`}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-lg border border-white/12 bg-black/20"
              style={{
                inset: `${8 + i * 10}px`,
                zIndex: 3 - i
              }}
              animate={
                run
                  ? {
                      y: [0, i % 2 === 0 ? -4 : 4, 0],
                      opacity: [0.5 + i * 0.12, 0.85, 0.5 + i * 0.12]
                    }
                  : undefined
              }
              transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            />
          ))}
          <motion.div
            className="absolute left-1/2 top-[32%] h-px w-[45%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={run ? { scaleX: [0.85, 1, 0.85], opacity: [0.35, 0.85, 0.35] } : undefined}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    );
  }

  if (theme === "compass") {
    const edgeId = `compass-edge-${uid}`;
    const glowId = `compass-glow-${uid}`;

    return (
      <div className={wrap} aria-hidden>
        <svg viewBox="0 0 400 160" className={svgH} fill="none">
          <defs>
            <linearGradient id={edgeId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(232 115 31 / 0.72)" />
              <stop offset="55%" stopColor="rgb(251 146 60 / 0.6)" />
              <stop offset="100%" stopColor="rgb(96 165 250 / 0.58)" />
            </linearGradient>
            <radialGradient id={glowId}>
              <stop offset="0%" stopColor="rgb(232 115 31 / 0.42)" />
              <stop offset="100%" stopColor="rgb(232 115 31 / 0)" />
            </radialGradient>
          </defs>

          <ellipse cx="198" cy="80" rx="82" ry="64" fill={`url(#${glowId})`} opacity="0.42" />

          {COMPASS_EDGES.map(([from, to], index) => {
            const a = COMPASS_NODES[from];
            const b = COMPASS_NODES[to];
            const bend = index % 2 === 0 ? -12 : 12;
            const d = `M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${(a.y + b.y) / 2 + bend} ${b.x} ${b.y}`;

            return (
              <g key={`${from}-${to}`}>
                <path d={d} stroke="rgb(255 255 255 / 0.09)" strokeWidth="1.2" />
                <motion.path
                  d={d}
                  stroke={`url(#${edgeId})`}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeDasharray="3 13"
                  initial={false}
                  animate={run ? { strokeDashoffset: [0, -64], opacity: [0.28, 0.8, 0.28] } : undefined}
                  transition={{
                    duration: 3.4 + (index % 3) * 0.55,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.08
                  }}
                />
              </g>
            );
          })}

          {COMPASS_NODES.map((node, index) => {
            const fill =
              node.role === "blue"
                ? "rgb(59 130 246 / 0.82)"
                : node.role === "selected"
                  ? "rgb(232 115 31)"
                  : "rgb(194 80 15 / 0.9)";
            const stroke = node.role === "blue" ? "rgb(147 197 253 / 0.7)" : "rgb(253 186 116 / 0.72)";

            return (
              <motion.g
                key={`${node.x}-${node.y}`}
                initial={false}
                animate={run ? { y: [0, index % 2 === 0 ? -2.5 : 2.5, 0] } : undefined}
                transition={{ duration: 4.5 + index * 0.18, repeat: Infinity, ease: "easeInOut" }}
              >
                <circle cx={node.x} cy={node.y} r={node.r + 5} fill={fill} opacity="0.1" />
                <circle cx={node.x} cy={node.y} r={node.r} fill={fill} stroke={stroke} strokeWidth="1.4" />
              </motion.g>
            );
          })}

          <motion.circle
            cx="196"
            cy="76"
            r="17"
            stroke="rgb(253 186 116 / 0.7)"
            strokeWidth="1.4"
            initial={false}
            animate={run ? { r: [15, 23, 15], opacity: [0.75, 0, 0.75] } : undefined}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
          />

          <motion.circle
            r="3.8"
            fill="rgb(255 237 213)"
            initial={false}
            animate={run ? { cx: [62, 196, 282, 342], cy: [78, 76, 106, 68], opacity: [0, 1, 1, 0] } : undefined}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          />

          <text x="178" y="103" fill="rgb(253 186 116 / 0.7)" style={{ fontSize: 9, fontFamily: "system-ui, sans-serif" }}>
            selected file
          </text>
        </svg>
      </div>
    );
  }

  if (theme === "route") {
    return (
      <div className={wrap} aria-hidden>
        <svg viewBox="0 0 400 160" className={svgH} fill="none">
          <rect x="40" y="52" width="56" height="72" rx="10" stroke="rgb(251 191 36 / 0.35)" strokeWidth="1.25" />
          <rect x="304" y="52" width="56" height="72" rx="10" stroke="rgb(251 191 36 / 0.35)" strokeWidth="1.25" />
          <path
            d="M96 88 C 160 40, 240 40, 304 88"
            stroke="rgb(251 191 36 / 0.2)"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <motion.path
            d="M96 88 C 160 40, 240 40, 304 88"
            stroke="rgb(251 191 36 / 0.65)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={false}
            animate={run ? { pathLength: [0.25, 0.85, 0.25], opacity: [0.35, 1, 0.35] } : undefined}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx={96}
            cy={88}
            r={6}
            fill="rgb(254 243 199)"
            animate={
              run
                ? {
                    cx: [96, 200, 304],
                    cy: [88, 52, 88],
                    opacity: [0.4, 1, 0.4]
                  }
                : undefined
            }
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>
    );
  }

  if (theme === "resolver") {
    const tid = `te-${uid}`;
    return (
      <div className={wrap} aria-hidden>
        <svg viewBox="0 0 400 170" className={svgH} fill="none">
          <rect x="48" y="72" width="72" height="40" rx="8" stroke="rgb(45 212 191 / 0.35)" strokeWidth="1.25" />
          <text x="58" y="96" fill="#71717a" style={{ fontSize: 10, fontFamily: "system-ui, sans-serif" }}>
            Same question
          </text>
          <path d="M120 92 H168" stroke={`url(#${tid})`} strokeWidth="2" strokeLinecap="round" />
          <circle cx="188" cy="92" r="10" fill="#09090b" stroke="rgb(45 212 191 / 0.5)" strokeWidth="1.5" />
          <path d="M198 82 L228 62" stroke="rgb(45 212 191 / 0.35)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M198 102 L228 122" stroke="rgb(34 211 238 / 0.35)" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="236" y="48" width="88" height="32" rx="8" stroke="rgb(45 212 191 / 0.4)" strokeWidth="1" />
          <text x="248" y="68" fill="#71717a" style={{ fontSize: 9, fontFamily: "system-ui, sans-serif" }}>
            Auto path
          </text>
          <rect x="236" y="108" width="88" height="32" rx="8" stroke="rgb(34 211 238 / 0.35)" strokeWidth="1" />
          <text x="248" y="128" fill="#71717a" style={{ fontSize: 9, fontFamily: "system-ui, sans-serif" }}>
            Human path
          </text>
          <motion.circle
            cx={84}
            cy={92}
            r={5}
            fill="rgb(204 251 241)"
            animate={
              run
                ? {
                    cx: [84, 188, 280, 188, 84],
                    cy: [92, 92, 64, 124, 92],
                    opacity: [0, 1, 1, 1, 0]
                  }
                : undefined
            }
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id={tid} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(45 212 191 / 0.5)" />
              <stop offset="100%" stopColor="rgb(34 211 238 / 0.45)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  const sigId = `sig-${uid}`;
  return (
    <div className={wrap} aria-hidden>
      <svg viewBox="0 0 400 140" className={svgH} fill="none">
        <path
          d="M40 88 H100 L118 88 L132 52 L154 112 L176 68 L198 88 H360"
          stroke={`url(#${sigId})`}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.25"
        />
        <motion.path
          d="M40 88 H100 L118 88 L132 52 L154 112 L176 68 L198 88 H360"
          stroke={`url(#${sigId})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={run ? { pathLength: [0.45, 1, 0.45], opacity: [0.3, 0.95, 0.3] } : undefined}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.line
          x1={120}
          y1={24}
          x2={120}
          y2={120}
          stroke="rgb(34 211 238 / 0.15)"
          strokeWidth={1}
          animate={run ? { x1: [80, 320, 80], x2: [80, 320, 80] } : undefined}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle
          cx={260}
          cy={88}
          r={14}
          stroke="rgb(167 139 250 / 0.25)"
          strokeWidth={1}
          fill="none"
          animate={run ? { r: [12, 16, 12], opacity: [0.2, 0.45, 0.2] } : undefined}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id={sigId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(34 211 238 / 0.55)" />
            <stop offset="100%" stopColor="rgb(167 139 250 / 0.55)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
