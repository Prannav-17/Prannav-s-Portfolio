// Anonymised question log: no IP, no user agent, no identifiers. Emails and phone numbers are stripped from the text.
const scrub = (s: string) =>
  s.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[email]").replace(/\+?\d[\d\s().-]{7,}\d/g, "[number]").slice(0, 200);

export async function logQuestion(q: string, route: string, entry?: string) {
  const rec = { t: new Date().toISOString(), q: scrub(q), route, entry: entry ?? null };
  console.log("ASK_LOG " + JSON.stringify(rec));
  const url = process.env.UPSTASH_REDIS_REST_URL, tokn = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !tokn) return;
  try {
    await fetch(`${url}/lpush/ask_log`, { method: "POST", headers: { Authorization: `Bearer ${tokn}` }, body: JSON.stringify(JSON.stringify(rec)) });
  } catch {}
}
