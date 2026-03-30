"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import type { ProjectAccent } from "../../lib/projects";
import { ProductAuroraBurst } from "./product-aurora-burst";

type DetailAuroraMode = "accent" | "edgaze";

export function ProjectDetailAurora({
  mode,
  accent
}: {
  mode: DetailAuroraMode;
  accent?: ProjectAccent;
}) {
  const [motionActive, setMotionActive] = useState(true);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const on = y < 420;
    setMotionActive((prev) => (prev === on ? prev : on));
  });

  return (
    <ProductAuroraBurst
      mode={mode}
      accent={accent}
      position="fixed"
      intensity="calm"
      motionActive={motionActive}
    />
  );
}
