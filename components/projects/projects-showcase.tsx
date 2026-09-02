"use client";

import { useInView } from "framer-motion";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { projectStateLabel, type Project, type ProjectAccent } from "../../lib/projects";
import { archiveThemeStyles } from "./project-archive-theme";
import { ProductAuroraBurst } from "./product-aurora-burst";
import { ProductMotionVisual } from "./product-motion-visual";
import { ShowcaseProgress } from "./showcase-progress";

type SceneChildren = ReactNode | ((ctx: { inView: boolean }) => ReactNode);

type ProjectsShowcaseProps = {
  projects: Project[];
};

type AuroraConfig =
  | { mode: "intro" }
  | { mode: "outro" }
  | { mode: "accent"; accent: ProjectAccent }
  | { mode: "firstProject" }
  | { mode: "edgaze" };

function ProjectSlideDiagram({
  theme,
  suspendMotion,
}: {
  theme: Project["visualTheme"];
  suspendMotion: boolean;
}) {
  return (
    <div className="relative z-10 mt-10 w-full">
      <ProductMotionVisual
        theme={theme}
        variant="showcase"
        suspendMotion={suspendMotion}
      />
    </div>
  );
}

function SceneShell({
  children,
  progressIndex,
  progressTotal,
  aurora,
}: {
  children: SceneChildren;
  progressIndex: number;
  progressTotal: number;
  aurora: AuroraConfig;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);

  const burstMode =
    aurora.mode === "accent"
      ? "accent"
      : aurora.mode === "firstProject"
        ? "firstProject"
        : aurora.mode === "edgaze"
          ? "edgaze"
          : aurora.mode;

  const isInView = useInView(sectionRef, {
    amount: 0.2,
    margin: "0px 0px -10% 0px",
  });

  const body = typeof children === "function" ? children({ inView: isInView }) : children;

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100dvh] min-h-[100dvh] snap-start flex-col overflow-hidden [content-visibility:auto] [contain-intrinsic-size:auto_720px] [scroll-snap-stop:always]"
    >
      <ProductAuroraBurst
        mode={burstMode}
        accent={aurora.mode === "accent" ? aurora.accent : undefined}
        position="scene"
        motionActive={isInView}
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32">
        <div className="flex w-full max-w-xl flex-col items-center text-center">
          {body}
        </div>
        <div className="relative z-10 mt-12 sm:mt-16">
          <ShowcaseProgress current={progressIndex} total={progressTotal} />
        </div>
      </div>
    </section>
  );
}

function ProjectSlideContent({
  project,
  theme,
  inView,
}: {
  project: Project;
  theme: (typeof archiveThemeStyles)[keyof typeof archiveThemeStyles];
  inView: boolean;
}) {
  return (
    <>
      <p className="text-sm text-zinc-300/90 drop-shadow-[0_1px_12px_rgba(0,0,0,0.4)]">
        {projectStateLabel[project.state]} · {project.year}
        {project.context ? (
          <span className="text-zinc-400"> · {project.context}</span>
        ) : null}
      </p>
      <h2 className="mt-4 text-pretty text-3xl font-semibold tracking-[-0.035em] text-white drop-shadow-[0_2px_28px_rgba(0,0,0,0.5)] sm:text-4xl">
        {project.name}
      </h2>
      <p
        className={`mt-3 max-w-lg text-pretty text-lg font-medium leading-snug drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)] sm:text-xl ${theme.accentTextClass}`}
      >
        {project.tagline}
      </p>
      <p className="mt-5 max-w-lg text-pretty text-[0.9375rem] leading-[1.65] text-zinc-200/90 drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)] sm:text-base sm:leading-[1.65]">
        {project.summary}
      </p>
      <ProjectSlideDiagram theme={project.visualTheme} suspendMotion={!inView} />
      <Link
        href={`/projects/${project.slug}`}
        className={`relative z-10 mt-10 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-colors ${theme.pillClass} hover:bg-white/[0.08]`}
      >
        View project
        <span aria-hidden>→</span>
      </Link>
    </>
  );
}

export function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  const totalScenes = projects.length + 2;

  return (
    <div className="bg-[#06060c]">
      <SceneShell
        progressIndex={0}
        progressTotal={totalScenes}
        aurora={{ mode: "intro" }}
      >
        <h1 className="text-pretty text-4xl font-semibold tracking-[-0.04em] text-white drop-shadow-[0_2px_32px_rgba(0,0,0,0.5)] sm:text-5xl">
          Projects
        </h1>
        <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-zinc-200/90 drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)] sm:text-lg">
          One live product, this site, and three hackathon builds.
        </p>
      </SceneShell>

      {projects.map((project, index) => {
        const theme = archiveThemeStyles[project.visualTheme];
        const isFirst = index === 0;

        return (
          <SceneShell
            key={project.slug}
            progressIndex={index + 1}
            progressTotal={totalScenes}
            aurora={
              project.slug === "edgaze"
                ? { mode: "edgaze" }
                : isFirst
                  ? { mode: "firstProject" }
                  : { mode: "accent", accent: project.accent }
            }
          >
            {({ inView }) => (
              <ProjectSlideContent project={project} theme={theme} inView={inView} />
            )}
          </SceneShell>
        );
      })}

      <SceneShell
        progressIndex={totalScenes - 1}
        progressTotal={totalScenes}
        aurora={{ mode: "outro" }}
      >
        <h2 className="text-pretty text-2xl font-semibold tracking-[-0.03em] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)] sm:text-3xl">
          That&apos;s the list.
        </h2>
        <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-zinc-300/90 drop-shadow-[0_2px_18px_rgba(0,0,0,0.4)]">
          Pick a project above for more detail, or head home if you&apos;re done browsing.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex rounded-full border border-white/[0.14] bg-black/30 px-5 py-2.5 text-sm font-medium text-zinc-100 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-colors hover:border-white/[0.22] hover:bg-black/40"
          >
            Back to home
          </Link>
        </div>
      </SceneShell>
    </div>
  );
}
