import type { ProjectVisualTheme } from "../../lib/projects";

type ArchiveThemeStyle = {
  frameClass: string;
  borderClass: string;
  pillClass: string;
  accentTextClass: string;
  accentLineClass: string;
  ambientClass: string;
  sweepClass: string;
  pointerGlow: string;
  stageBackground: string;
  stageMesh: string;
  glowClass: string;
  logoTextClass: string;
};

export const archiveThemeStyles: Record<ProjectVisualTheme, ArchiveThemeStyle> = {
  editorial: {
    frameClass:
      "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.09),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.012)_26%,rgba(5,5,6,0.98)_88%)]",
    borderClass: "border-white/12",
    pillClass: "border-white/14 bg-white/[0.03] text-zinc-300",
    accentTextClass: "text-zinc-100",
    accentLineClass: "from-white/70 via-white/20 to-transparent",
    ambientClass: "from-white/8 via-white/[0.02] to-transparent",
    sweepClass: "from-transparent via-white/12 to-transparent",
    pointerGlow: "rgba(255,255,255,0.12)",
    stageBackground:
      "bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.085),transparent_28%),radial-gradient(circle_at_84%_30%,rgba(255,255,255,0.035),transparent_24%),linear-gradient(180deg,#060607_0%,#070709_100%)]",
    stageMesh:
      "bg-[linear-gradient(to_right,rgba(255,255,255,0.024)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)]",
    glowClass: "bg-white/8",
    logoTextClass: "text-white"
  },
  workflow: {
    frameClass:
      "bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(232,121,249,0.16),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.045),rgba(5,5,8,0.98)_82%)]",
    borderClass: "border-fuchsia-400/18",
    pillClass: "border-fuchsia-400/24 bg-fuchsia-400/[0.07] text-fuchsia-100",
    accentTextClass: "text-fuchsia-100",
    accentLineClass: "from-cyan-300/80 via-fuchsia-300/55 to-transparent",
    ambientClass: "from-cyan-300/14 via-fuchsia-300/6 to-transparent",
    sweepClass: "from-transparent via-cyan-200/18 to-transparent",
    pointerGlow: "rgba(120,119,255,0.16)",
    stageBackground:
      "bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.15),transparent_26%),radial-gradient(circle_at_80%_24%,rgba(232,121,249,0.16),transparent_24%),linear-gradient(180deg,#050509_0%,#06050a_100%)]",
    stageMesh:
      "bg-[linear-gradient(to_right,rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)]",
    glowClass: "bg-fuchsia-400/12",
    logoTextClass: "text-fuchsia-100"
  },
  route: {
    frameClass:
      "bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.15),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(249,115,22,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(8,6,4,0.98)_84%)]",
    borderClass: "border-amber-400/18",
    pillClass: "border-amber-400/24 bg-amber-400/[0.07] text-amber-100",
    accentTextClass: "text-amber-100",
    accentLineClass: "from-amber-300/80 via-orange-300/55 to-transparent",
    ambientClass: "from-amber-300/14 via-orange-300/6 to-transparent",
    sweepClass: "from-transparent via-amber-200/18 to-transparent",
    pointerGlow: "rgba(251,191,36,0.16)",
    stageBackground:
      "bg-[radial-gradient(circle_at_18%_24%,rgba(251,191,36,0.14),transparent_26%),radial-gradient(circle_at_80%_28%,rgba(249,115,22,0.13),transparent_24%),linear-gradient(180deg,#080604_0%,#060505_100%)]",
    stageMesh:
      "bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.016)_1px,transparent_1px)]",
    glowClass: "bg-amber-400/12",
    logoTextClass: "text-amber-100"
  },
  compass: {
    frameClass:
      "bg-[radial-gradient(circle_at_top_left,rgba(232,115,31,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.11),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(7,6,6,0.98)_84%)]",
    borderClass: "border-orange-500/20",
    pillClass: "border-orange-400/25 bg-orange-500/[0.07] text-orange-100",
    accentTextClass: "text-orange-100",
    accentLineClass: "from-orange-400/85 via-blue-400/45 to-transparent",
    ambientClass: "from-orange-500/16 via-blue-400/5 to-transparent",
    sweepClass: "from-transparent via-orange-200/18 to-transparent",
    pointerGlow: "rgba(232,115,31,0.18)",
    stageBackground:
      "bg-[radial-gradient(circle_at_20%_22%,rgba(232,115,31,0.16),transparent_27%),radial-gradient(circle_at_80%_30%,rgba(96,165,250,0.10),transparent_25%),linear-gradient(180deg,#080605_0%,#060608_100%)]",
    stageMesh:
      "bg-[radial-gradient(circle,rgba(232,115,31,0.10)_1px,transparent_1px)] [background-size:20px_20px]",
    glowClass: "bg-orange-500/14",
    logoTextClass: "text-orange-100"
  },
  resolver: {
    frameClass:
      "bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.045),rgba(4,7,7,0.98)_84%)]",
    borderClass: "border-teal-400/18",
    pillClass: "border-teal-400/24 bg-teal-400/[0.07] text-teal-100",
    accentTextClass: "text-teal-100",
    accentLineClass: "from-teal-300/80 via-cyan-300/55 to-transparent",
    ambientClass: "from-teal-300/14 via-cyan-300/6 to-transparent",
    sweepClass: "from-transparent via-cyan-200/16 to-transparent",
    pointerGlow: "rgba(45,212,191,0.16)",
    stageBackground:
      "bg-[radial-gradient(circle_at_18%_20%,rgba(45,212,191,0.14),transparent_26%),radial-gradient(circle_at_80%_24%,rgba(34,211,238,0.12),transparent_24%),linear-gradient(180deg,#040708_0%,#050607_100%)]",
    stageMesh:
      "bg-[linear-gradient(to_right,rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)]",
    glowClass: "bg-teal-400/12",
    logoTextClass: "text-teal-100"
  },
  signal: {
    frameClass:
      "bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.045),rgba(5,6,10,0.98)_84%)]",
    borderClass: "border-violet-400/18",
    pillClass: "border-violet-400/24 bg-violet-400/[0.07] text-violet-100",
    accentTextClass: "text-violet-100",
    accentLineClass: "from-cyan-300/75 via-violet-300/55 to-transparent",
    ambientClass: "from-violet-300/14 via-cyan-300/6 to-transparent",
    sweepClass: "from-transparent via-cyan-100/16 to-transparent",
    pointerGlow: "rgba(129,140,248,0.16)",
    stageBackground:
      "bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.12),transparent_26%),radial-gradient(circle_at_80%_24%,rgba(129,140,248,0.14),transparent_24%),linear-gradient(180deg,#05060b_0%,#050509_100%)]",
    stageMesh:
      "bg-[linear-gradient(to_right,rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)]",
    glowClass: "bg-violet-400/12",
    logoTextClass: "text-violet-100"
  }
};
