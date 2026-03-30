import type { ProjectAccent } from "../../lib/projects";

export const accentRing: Record<ProjectAccent, string> = {
  cyan: "ring-cyan-400/25",
  fuchsia: "ring-fuchsia-400/25",
  amber: "ring-amber-400/25",
  teal: "ring-teal-400/25",
  violet: "ring-violet-400/25"
};

export const accentText: Record<ProjectAccent, string> = {
  cyan: "text-cyan-100",
  fuchsia: "text-fuchsia-100",
  amber: "text-amber-100",
  teal: "text-teal-100",
  violet: "text-violet-100"
};

export const accentBorder: Record<ProjectAccent, string> = {
  cyan: "border-cyan-400/35",
  fuchsia: "border-fuchsia-400/35",
  amber: "border-amber-400/35",
  teal: "border-teal-400/35",
  violet: "border-violet-400/35"
};

export const accentGlow: Record<ProjectAccent, string> = {
  cyan: "from-cyan-400/20 via-transparent to-fuchsia-400/10",
  fuchsia: "from-fuchsia-400/20 via-transparent to-cyan-400/10",
  amber: "from-amber-400/18 via-transparent to-orange-400/10",
  teal: "from-teal-400/18 via-transparent to-cyan-400/10",
  violet: "from-violet-400/18 via-transparent to-indigo-400/10"
};

export const accentBar: Record<ProjectAccent, string> = {
  cyan: "bg-cyan-400/70",
  fuchsia: "bg-fuchsia-400/70",
  amber: "bg-amber-400/70",
  teal: "bg-teal-400/70",
  violet: "bg-violet-400/70"
};
