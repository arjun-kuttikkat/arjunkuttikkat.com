"use client";

/**
 * macOS window controls, reproduced to spec:
 *  - 12px discs, 8px apart; close #ff5f57, minimize #febc2e, zoom #28c840, each with a darker 0.5px rim
 *  - glyphs are hidden until the pointer enters the group, then all three show at once
 *  - the whole set turns grey when the window is inactive, and recolours on hover
 *  - a pressed disc darkens
 */
type Props = {
  active: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onZoom: () => void;
  zoomLabel?: string;
};

const disc =
  "relative flex h-3 w-3 items-center justify-center rounded-full border-[0.5px] transition-colors duration-150 active:brightness-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-1 focus-visible:ring-offset-black";

const glyph =
  "opacity-0 transition-opacity duration-100 group-hover/lights:opacity-100 group-focus-within/lights:opacity-100";

export function TrafficLights({
  active,
  onClose,
  onMinimize,
  onZoom,
  zoomLabel = "Enter Full Screen",
}: Props) {
  return (
    <div className="group/lights flex items-center gap-2" data-active={active}>
      <button
        type="button"
        aria-label="Close"
        title="Close"
        onClick={onClose}
        className={[
          disc,
          active
            ? "border-[#e0443e] bg-[#ff5f57]"
            : "border-[#3f3f41] bg-[#4d4d4f] group-hover/lights:border-[#e0443e] group-hover/lights:bg-[#ff5f57]",
        ].join(" ")}
      >
        <svg viewBox="0 0 12 12" className={`h-3 w-3 ${glyph}`} aria-hidden>
          <path
            d="M3.6 3.6 8.4 8.4M8.4 3.6 3.6 8.4"
            stroke="#4d0000"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Minimize"
        title="Minimize"
        onClick={onMinimize}
        className={[
          disc,
          active
            ? "border-[#dea123] bg-[#febc2e]"
            : "border-[#3f3f41] bg-[#4d4d4f] group-hover/lights:border-[#dea123] group-hover/lights:bg-[#febc2e]",
        ].join(" ")}
      >
        <svg viewBox="0 0 12 12" className={`h-3 w-3 ${glyph}`} aria-hidden>
          <path
            d="M2.6 6h6.8"
            stroke="#995700"
            strokeWidth="1.35"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <button
        type="button"
        aria-label={zoomLabel}
        title={zoomLabel}
        onClick={onZoom}
        className={[
          disc,
          active
            ? "border-[#1aab29] bg-[#28c840]"
            : "border-[#3f3f41] bg-[#4d4d4f] group-hover/lights:border-[#1aab29] group-hover/lights:bg-[#28c840]",
        ].join(" ")}
      >
        <svg viewBox="0 0 12 12" className={`h-3 w-3 ${glyph}`} aria-hidden>
          <path d="M3 3h4.4L3 7.4z" fill="#006500" />
          <path d="M9 9H4.6L9 4.6z" fill="#006500" />
        </svg>
      </button>
    </div>
  );
}
