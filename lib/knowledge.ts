import raw from "@/data/knowledge.json";

export type Entry = { id: string; category: string; questions: string[]; answer: string; source: string; visibility: string };
export const KB = raw as unknown as { fallback: string; never_share: string[]; entries: Entry[] };

const STOP = new Set("a an the of to is in on for and or what who how does do did he his him prannav about tell me it with any".split(" "));
const tok = (s: string) => s.toLowerCase().match(/[a-z0-9']+/g) ?? [];
const norm = (s: string) => tok(s).join(" ");

const docs = KB.entries.map((e) => tok((e.questions.join(" ") + " ").repeat(3) + " " + e.answer).filter((w) => !STOP.has(w)));
const N = docs.length;
const df: Record<string, number> = {};
for (const d of docs) for (const w of new Set(d)) df[w] = (df[w] ?? 0) + 1;

function score(q: string, d: string[]) {
  let s = 0;
  for (const w of new Set(tok(q))) {
    if (STOP.has(w)) continue;
    const tf = d.reduce((n, x) => n + (x === w ? 1 : 0), 0);
    if (tf) s += (tf / (tf + 1.5)) * Math.log(1 + N / df[w]);
  }
  return s;
}

export type Hit = { entry: Entry; score: number };

export function search(q: string, k = 4): Hit[] {
  const nq = norm(q);
  const exact = KB.entries.find((e) => e.questions.some((x) => norm(x) === nq));
  const hits = KB.entries
    .map((entry, i) => ({ entry, score: score(q, docs[i]) + (entry === exact ? 100 : 0) }))
    .sort((a, b) => b.score - a.score);
  return hits.slice(0, k);
}

export const CONFIDENT = 6; // score at which a pre-written answer is returned without the model
export const MINIMUM = 2.0; // below this, the question is treated as out of scope

export type Card = { title: string; desc: string; href: string; external?: boolean; tag: string };

const proj: Record<string, Card> = {
  "lets-match": { title: "Let's Match", desc: "Live app: decide what to watch as a group", href: "/works/lets-match", tag: "Live app" },
  "performance-ai": { title: "Performance AI", desc: "Marketing decision product", href: "/works/performance-ai", tag: "Mockup" },
  "helix-ai": { title: "Helix AI", desc: "Customer operations", href: "/works/helix-ai", tag: "Mockup" },
  "revora-ai": { title: "Revora AI", desc: "Billing and revenue operations", href: "/works/revora-ai", tag: "Mockup" },
  comply: { title: "Comply", desc: "Compliance operating layer", href: "/works/comply", tag: "Mockup" },
  peopleos: { title: "PeopleOS", desc: "Skills-based talent intelligence", href: "/works/peopleos", tag: "Mockup" },
};
for (const c of Object.values(proj)) c.external = true;

const cardMap: Record<string, string[]> = {
  "projects-overview": ["lets-match", "performance-ai", "helix-ai", "revora-ai", "comply", "peopleos"],
  "project-letsmatch": ["lets-match"], "project-letsmatch-why": ["lets-match"], "project-letsmatch-status": ["lets-match"],
  "project-performance-ai": ["performance-ai"], "project-helix": ["helix-ai"], "project-revora": ["revora-ai"],
  "project-comply": ["comply"], "project-peopleos": ["peopleos"],
  "project-fictional": ["lets-match"], "project-how-built": ["lets-match"],
};

export function cardsFor(ids: string[]): Card[] {
  const out: Card[] = [];
  for (const id of ids) for (const s of cardMap[id] ?? []) if (!out.find((c) => c.href === proj[s].href)) out.push(proj[s]);
  return out.slice(0, 6);
}
export const projectCard = (slug: string) => proj[slug];
