import Link from "next/link";
import { projectStateLabel, type Project, type ProjectState } from "../../lib/projects";
import { textLink } from "../ui/button-styles";
import { Wide, eyebrow } from "./detail/primitives";
import { Reveal } from "./detail/reveal";
import { ProjectLogo } from "./project-logo";

type RelatedProjectsProps = {
  projects: Project[];
};

/** A shipped thing reads differently from a weekend build. One dot carries that. */
const stateDot: Record<ProjectState, string> = {
  live: "bg-emerald-400/70",
  beta: "bg-cyan-300/70",
  hackathon: "bg-zinc-600",
  prototype: "bg-zinc-600"
};

export function RelatedProjects({ projects }: RelatedProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <section className="border-t border-white/[0.08] py-16 sm:py-20">
      <Wide>
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <p className={eyebrow}>More projects</p>
            <Link href="/projects" className={textLink}>
              View all projects
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>

        <ul className="mt-6 divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {projects.map((p) => (
            <li key={p.slug} className="group relative">
              <Link
                href={`/projects/${p.slug}`}
                className="relative flex items-center gap-4 py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45 sm:gap-6 sm:py-6"
              >
                {/* Hover wash bleeds past the text column so the row lights up, not a card. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-x-4 inset-y-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.055),rgba(255,255,255,0.015)_42%,transparent_78%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:-inset-x-6"
                />

                <span className="relative block h-11 w-11 shrink-0 transition-transform duration-300 group-hover:scale-[1.03] sm:h-[3.25rem] sm:w-[3.25rem]">
                  <ProjectLogo project={p} className="h-full w-full" sizes="52px" />
                </span>

                <div className="relative min-w-0 flex-1 sm:grid sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:items-center sm:gap-8">
                  <div className="min-w-0">
                    <p className="truncate text-[1.05rem] font-semibold tracking-[-0.015em] text-white">{p.name}</p>
                    <p className="mt-0.5 truncate text-[0.8125rem] text-zinc-600 transition-colors group-hover:text-zinc-500">
                      {p.category}
                    </p>
                  </div>
                  <p className="mt-1.5 text-[0.95rem] leading-[1.55] text-zinc-400 transition-colors group-hover:text-zinc-200 sm:mt-0">
                    {p.tagline}
                  </p>
                </div>

                <div className="relative flex shrink-0 items-center gap-3 text-[0.8125rem] text-zinc-500">
                  <span className="hidden items-center gap-2 sm:inline-flex">
                    <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${stateDot[p.state]}`} />
                    {projectStateLabel[p.state]}
                  </span>
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:text-zinc-300"
                  >
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Wide>
    </section>
  );
}
