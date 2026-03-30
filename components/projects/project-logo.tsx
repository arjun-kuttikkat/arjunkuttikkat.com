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
  imageClassName = "object-contain p-2",
  sizes = "64px",
  priority = false
}: ProjectLogoProps) {
  const [failed, setFailed] = useState(false);
  const theme = archiveThemeStyles[project.visualTheme];
  const glyph = useMemo(() => fallbackGlyph(project), [project]);
  const bareBrand = project.slug === "arjunkuttikkat-com";

  if (bareBrand) {
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

  return (
    <div
      className={`relative overflow-hidden rounded-[1.1rem] border ${theme.logoFrameClass} bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015)_42%,rgba(0,0,0,0.28))] ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.1),transparent_42%)]" />

      {failed ? (
        <div className={`relative flex h-full w-full items-center justify-center ${theme.logoTextClass}`}>
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
