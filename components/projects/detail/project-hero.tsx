import Image from "next/image";
import type { ReactNode } from "react";
import { FaGithub } from "react-icons/fa";
import { projectStateLabel, type Project } from "../../../lib/projects";
import { LeavingSiteLink } from "../../leaving-site-link";
import { buttonPrimary, buttonSecondary, textLink } from "../../ui/button-styles";
import { Read } from "./primitives";
import { Reveal } from "./reveal";

const isEdgaze = (href: string) => /(^|\.)edgaze\.ai$/.test(new URL(href).hostname);

function Action({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  if (isEdgaze(href)) {
    return (
      <LeavingSiteLink href={href} className={className}>
        {children}
      </LeavingSiteLink>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

/**
 * Hero: one column, left-aligned inside the centred measure. Mark, meta line, name,
 * one sentence, actions. Nothing floats at the edges.
 */
export function ProjectHero({ project }: { project: Project }) {
  const meta = [
    projectStateLabel[project.state],
    project.year,
    project.role,
    project.context,
    project.team,
  ].filter(Boolean) as string[];

  return (
    <header className="pb-4 pt-10 sm:pb-6 sm:pt-14">
      <Read>
        <Reveal onMount>
          <span className="relative block h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]">
            <Image
              src={project.logo}
              alt=""
              fill
              sizes="72px"
              className="object-contain"
            />
          </span>

          <h1 className="mt-8 text-pretty text-[clamp(2.75rem,9vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-white">
            {project.name}
          </h1>

          <p className="mt-6 text-pretty text-[1.2rem] leading-[1.6] text-zinc-300 sm:text-[1.4rem] sm:leading-[1.55]">
            {project.summary}
          </p>
        </Reveal>

        <Reveal onMount delay={0.06}>
          <p className="mt-8 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[0.875rem] text-zinc-500">
            {meta.map((m, i) => (
              <span key={m} className="flex items-center gap-2.5">
                {i > 0 ? (
                  <span
                    aria-hidden
                    className="h-[3px] w-[3px] rounded-full bg-zinc-700"
                  />
                ) : null}
                <span className={i === 0 ? "text-zinc-300" : undefined}>{m}</span>
              </span>
            ))}
          </p>

          {project.links.length > 0 ? (
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
              {project.links.map((link) => (
                <Action
                  key={link.href}
                  href={link.href}
                  className={
                    link.kind === "primary"
                      ? buttonPrimary
                      : link.kind === "docs" || link.kind === "source"
                        ? buttonSecondary
                        : textLink
                  }
                >
                  {link.kind === "source" ? (
                    <FaGithub className="h-4 w-4" aria-hidden="true" />
                  ) : null}
                  {link.label}
                  {link.kind === "other" ? <span aria-hidden>↗</span> : null}
                </Action>
              ))}
            </div>
          ) : null}

          {project.sourceNote ? (
            <p className="mt-5 max-w-xl text-pretty text-[0.875rem] leading-[1.7] text-zinc-500">
              {project.sourceNote}
            </p>
          ) : null}
        </Reveal>
      </Read>
    </header>
  );
}
