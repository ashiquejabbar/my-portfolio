// Light per-IP guard for the AI routes (src/app/api/*) against someone burning the free-tier quotas.
// Kept in memory, so it resets whenever the function cold-starts; the providers' own quotas are the hard limit.

const WINDOW_MS = 10 * 60 * 1000;
const buckets = new Map<string, Map<string, number[]>>();

// true once an IP has made more than `max` requests to `bucket` in the last 10 minutes
export function rateLimited(bucket: string, ip: string, max: number): boolean {
  const hits = buckets.get(bucket) ?? new Map<string, number[]>();
  buckets.set(bucket, hits);
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}

export const clientIp = (request: Request) =>
  request.headers.get("x-nf-client-connection-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
