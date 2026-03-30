type Entry = { timestamps: number[] };

const store = new Map<string, Entry>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_IN_WINDOW = 12;

function prune(entry: Entry, now: number) {
  entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);
}

function sweepStale(now: number) {
  if (store.size < 2500) return;
  for (const [k, v] of store) {
    prune(v, now);
    if (v.timestamps.length === 0) store.delete(k);
  }
}

/** Per-process IP cap; resets on cold start. Good enough to blunt abuse without extra infra. */
export function newsletterRateLimitOk(ipKey: string): boolean {
  const now = Date.now();
  sweepStale(now);
  let entry = store.get(ipKey);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(ipKey, entry);
  }
  prune(entry, now);
  if (entry.timestamps.length >= MAX_IN_WINDOW) return false;
  entry.timestamps.push(now);
  return true;
}

export function getNewsletterClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}
