"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Project } from "../../lib/projects";
import { archiveThemeStyles } from "./project-archive-theme";

type ProjectLogoProps = {
  project: Project;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
};

function fallbackGlyph(project: Project) {
  if (project.slug === "arjunkuttikkat-com") return "AK";
  if (project.slug === "health-signal") return "HS";
  return project.name.slice(0, 2).toUpperCase();
}

export function ProjectLogo({
  project,
  className = "",
  imageClassName = "object-contain",
  sizes = "64px",
  priority = false
}: ProjectLogoProps) {
  const [failed, setFailed] = useState(false);
  const theme = archiveThemeStyles[project.visualTheme];
  const glyph = useMemo(() => fallbackGlyph(project), [project]);

  // Logos stand alone — no frame, border, or plate behind the mark.
  return (
    <div className={`relative h-full w-full ${className}`}>
      {failed ? (
        <div className={`flex h-full w-full items-center justify-center ${theme.logoTextClass}`}>
          <span className="text-[0.74em] font-semibold tracking-[0.12em]">{glyph}</span>
        </div>
      ) : (
        <Image
          src={project.logo}
          alt={`${project.name} logo`}
          fill
          sizes={sizes}
          priority={priority}
          className={imageClassName}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
