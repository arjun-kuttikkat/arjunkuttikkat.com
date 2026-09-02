import type { ComponentType } from "react";
import type { Project } from "../../../lib/projects";
import { AuraPage } from "./aura-page";
import { AutoresolvePage } from "./autoresolve-page";
import { EdgazePage } from "./edgaze-page";
import { HealthSignalPage } from "./health-signal-page";
import { SitePage } from "./site-page";

export type ProjectPageComponent = ComponentType<{ project: Project }>;

/**
 * Each project gets its own composition built from the shared detail primitives.
 * Adding a project = add data in lib/projects.ts + one entry here.
 */
export const projectPages: Record<string, ProjectPageComponent> = {
  edgaze: EdgazePage,
  "arjunkuttikkat-com": SitePage,
  aura: AuraPage,
  autoresolve: AutoresolvePage,
  "health-signal": HealthSignalPage
};
