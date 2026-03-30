/**
 * Rough read time from markdown body: strip fences, refs, and markup noise; count words.
 */
export function estimateReadTimeMinutes(markdown: string): number {
  let text = markdown;
  text = text.replace(/```[\s\S]*?```/g, " ");
  text = text.replace(/`[^`]+`/g, " ");
  text = text.replace(/!\[[^\]]*]\([^)]+\)/g, " ");
  text = text.replace(/\[([^\]]+)]\([^)]+\)/g, "$1");
  text = text.replace(/^#{1,6}\s+/gm, " ");
  text = text.replace(/[*_~`|>[\](){}#\-–—]/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}
