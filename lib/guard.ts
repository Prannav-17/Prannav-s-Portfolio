// Best-effort protection. State lives in server memory, so it resets on cold starts.
// The model provider's own free-tier limits and the global cap below are the hard stop.
const perMin = new Map<string, number[]>();
const perDay = new Map<string, { day: string; n: number }>();
let global = { day: "", n: 0 };
const cache = new Map<string, unknown>();

const day = () => new Date().toISOString().slice(0, 10);
export const LIMITS = {
  perMinute: Number(process.env.RATE_PER_MIN ?? 8),
  perDay: Number(process.env.RATE_PER_DAY ?? 60),
  globalLlmPerDay: Number(process.env.LLM_DAILY_CAP ?? 500),
};

export function allow(ip: string): "ok" | "minute" | "day" {
  const now = Date.now();
  const arr = (perMin.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (arr.length >= LIMITS.perMinute) return "minute";
  const d = perDay.get(ip);
  const cur = d && d.day === day() ? d : { day: day(), n: 0 };
  if (cur.n >= LIMITS.perDay) return "day";
  arr.push(now); perMin.set(ip, arr);
  cur.n++; perDay.set(ip, cur);
  if (perMin.size > 5000) perMin.clear();
  if (perDay.size > 5000) perDay.clear();
  return "ok";
}

export function llmBudget(): boolean {
  if (global.day !== day()) global = { day: day(), n: 0 };
  if (global.n >= LIMITS.globalLlmPerDay) return false;
  global.n++;
  return true;
}

export const cacheGet = (k: string) => cache.get(k);
export function cacheSet(k: string, v: unknown) {
  if (cache.size > 400) cache.delete(cache.keys().next().value as string);
  cache.set(k, v);
}
