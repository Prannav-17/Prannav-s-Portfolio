// Anonymised question log: no IP, no user agent, no identifiers. Emails and phone numbers are stripped from the text.
const scrub = (s: string) =>
  s.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[email]").replace(/\+?\d[\d\s().-]{7,}\d/g, "[number]").slice(0, 200);

export type Rec = { t: string; q: string; route: string; entry: string | null };
const conf = () => ({ url: process.env.UPSTASH_REDIS_REST_URL, tok: process.env.UPSTASH_REDIS_REST_TOKEN });
export const storeConfigured = () => !!(conf().url && conf().tok);

export async function logQuestion(q: string, route: string, entry?: string) {
  const rec: Rec = { t: new Date().toISOString(), q: scrub(q), route, entry: entry ?? null };
  console.log("ASK_LOG " + JSON.stringify(rec));
  const { url, tok } = conf(); if (!url || !tok) return;
  try {
    await fetch(`${url}/pipeline`, {
      method: "POST", headers: { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" },
      body: JSON.stringify([["LPUSH", "ask_log", JSON.stringify(rec)], ["LTRIM", "ask_log", 0, 4999]]),
    });
  } catch {}
}

export async function readLog(): Promise<Rec[]> {
  const { url, tok } = conf(); if (!url || !tok) return [];
  try {
    const r = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" },
      body: JSON.stringify(["LRANGE", "ask_log", 0, 4999]), cache: "no-store" });
    const j = await r.json();
    return (j.result as string[]).map((s) => { try { return JSON.parse(s) as Rec; } catch { return null; } }).filter(Boolean) as Rec[];
  } catch { return []; }
}
