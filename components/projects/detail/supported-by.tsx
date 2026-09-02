import { startupPrograms } from "../../../lib/technologies";
import { Read } from "./primitives";
import { Reveal } from "./reveal";

/** Shared render height. Width comes from each mark's own aspect ratio. */
const LOGO_HEIGHT_REM = 1.375;

/**
 * Startup programs backing Edgaze, shown with the official brand logos.
 * Every mark is drawn at the same height so none of them dominates the row.
 */
export function SupportedBy() {
  return (
    <Read className="mt-14">
      <Reveal>
        <p className="text-[0.8125rem] font-medium text-zinc-500">Supported by</p>
        <ul className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {startupPrograms.map((program) => {
            const Icon = program.icon;
            const height = `${LOGO_HEIGHT_REM}rem`;
            const width = `${LOGO_HEIGHT_REM * program.aspect}rem`;
            return (
              <li key={program.id}>
                <a
                  href={program.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-sm transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45"
                >
                  <Icon aria-hidden style={{ height, width }} className="shrink-0" {...program.iconProps} />
                  <span className="text-[0.95rem] font-medium tracking-[-0.005em] text-zinc-200">
                    {program.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </Read>
  );
}
