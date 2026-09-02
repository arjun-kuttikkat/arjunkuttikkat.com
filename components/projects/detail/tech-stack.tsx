import type { CSSProperties } from "react";
import { technologies, type StackGroup, type Technology } from "../../../lib/technologies";
import { Read } from "./primitives";
import { Reveal } from "./reveal";

function TechMark({ tech }: { tech: Technology }) {
  const Icon = tech.icon;
  if (!Icon) {
    return (
      <span
        aria-hidden
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border border-current/40 text-[0.5rem] font-semibold leading-none tracking-[0.04em]"
      >
        {tech.name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return (
    <span aria-hidden className="flex h-5 w-5 shrink-0 items-center justify-center">
      <Icon
        className="h-full w-full"
        style={{ transform: tech.scale && tech.scale !== 1 ? `scale(${tech.scale})` : undefined }}
      />
    </span>
  );
}

function TechItem({ tech }: { tech: Technology }) {
  return (
    <a
      href={tech.website}
      target="_blank"
      rel="noopener noreferrer"
      className="group/tech inline-flex items-center gap-2.5 rounded-sm text-zinc-300 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
      style={{ "--brand": tech.brand ?? "#ffffff" } as CSSProperties}
    >
      <span className="text-zinc-500 transition-colors duration-200 group-hover/tech:[color:var(--brand)]">
        <TechMark tech={tech} />
      </span>
      <span className="text-[0.95rem] tracking-[-0.005em]">{tech.name}</span>
    </a>
  );
}

/**
 * Grouped stack: category label, an optional line of context, then logo + name items.
 * Monochrome at rest, brand colour only on hover. No pills, no boxes per technology.
 */
export function TechStack({ groups }: { groups: StackGroup[] }) {
  return (
    <Read>
      <Reveal>
        <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {groups.map((group) => (
            <div key={group.title} className="py-6 sm:py-7">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <p className="text-[0.875rem] font-semibold tracking-[-0.01em] text-white">{group.title}</p>
                {group.note ? <p className="text-[0.8125rem] leading-[1.55] text-zinc-500">{group.note}</p> : null}
              </div>
              <ul className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3.5">
                {group.items.map((id) => (
                  <li key={id}>
                    <TechItem tech={technologies[id]} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </Read>
  );
}
