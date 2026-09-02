/**
 * Convert an SVG file into a React component with correct camelCase attributes.
 *
 *   node scripts/svg-to-component.mjs <input.svg> <output.tsx> <ComponentName> "<doc comment>"
 *
 * Kept in the repo because brand logos occasionally need re-importing from source,
 * and hand-transcribing SVG paths is how they get corrupted.
 */
import { readFileSync, writeFileSync } from "node:fs";

/** SVG presentation attributes that React expects in camelCase. */
const ATTR_MAP = {
  "clip-path": "clipPath",
  "clip-rule": "clipRule",
  "fill-rule": "fillRule",
  "fill-opacity": "fillOpacity",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-opacity": "strokeOpacity",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "stroke-miterlimit": "strokeMiterlimit",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-weight": "fontWeight",
  "text-anchor": "textAnchor",
  "letter-spacing": "letterSpacing",
  "paint-order": "paintOrder",
  "mask-type": "maskType",
  "color-interpolation-filters": "colorInterpolationFilters",
  "gradient-units": "gradientUnits",
  "gradient-transform": "gradientTransform",
  "xlink:href": "xlinkHref",
  "xml:space": "xmlSpace"
};

const [, , input, output, componentName, docComment = ""] = process.argv;
if (!input || !output || !componentName) {
  console.error("usage: svg-to-component.mjs <input.svg> <output.tsx> <ComponentName> [doc]");
  process.exit(1);
}

let svg = readFileSync(input, "utf8");

// Strip XML prologue, comments, and <title>/<desc> (the component gets an aria-label instead).
svg = svg
  .replace(/<\?xml[^>]*\?>/g, "")
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace(/<!DOCTYPE[^>]*>/gi, "")
  .replace(/<title>[\s\S]*?<\/title>/gi, "")
  .replace(/<desc>[\s\S]*?<\/desc>/gi, "")
  .trim();

const openTag = svg.match(/<svg\b[^>]*>/);
if (!openTag) {
  console.error("no <svg> root found");
  process.exit(1);
}
const viewBox = openTag[0].match(/viewBox="([^"]+)"/)?.[1];
if (!viewBox) {
  console.error("no viewBox on root <svg>; refusing to guess");
  process.exit(1);
}

// Inner markup only. The component supplies its own root <svg>.
let inner = svg.replace(/^<svg\b[^>]*>/, "").replace(/<\/svg>\s*$/, "");

// Rename attributes React needs in camelCase.
for (const [from, to] of Object.entries(ATTR_MAP)) {
  inner = inner.replace(new RegExp(`\\s${from}=`, "g"), ` ${to}=`);
}

// Namespace ids so multiple inlined logos cannot collide.
const prefix = componentName.replace(/Logo$|Icon$/, "").toLowerCase();
const ids = [...new Set([...inner.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))];
for (const id of ids) {
  const safe = `${prefix}-${id}`.replace(/[^a-zA-Z0-9_-]/g, "-");
  inner = inner.replaceAll(`id="${id}"`, `id="${safe}"`);
  inner = inner.replaceAll(`url(#${id})`, `url(#${safe})`);
}

// Self-close void SVG elements so the markup is valid JSX.
inner = inner.replace(/<(stop|path|circle|rect|ellipse|line|polygon|polyline|use)\b([^>]*?)(?<!\/)>/g, "<$1$2 />");

// Pretty-print: one element per line.
inner = inner
  .replace(/></g, ">\n<")
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean)
  .map((l) => `      ${l}`)
  .join("\n");

const doc = docComment
  ? `/**\n${docComment
      .split("\n")
      .map((l) => ` * ${l}`)
      .join("\n")}\n */`
  : "";

const file = `import type { SVGProps } from "react";

${doc}
export function ${componentName}(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
${inner}
    </svg>
  );
}
`;

writeFileSync(output, file);
console.log(`${output}  viewBox="${viewBox}"  ids=${ids.length}  ${file.length} chars`);
