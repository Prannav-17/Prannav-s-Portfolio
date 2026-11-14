import raw from "@/data/knowledge.json";

export type Entry = { id: string; category: string; questions: string[]; answer: string; source: string; visibility: string };
export const KB = raw as unknown as { fallback: string; never_share: string[]; entries: Entry[] };

const STOP = new Set("a an the of to is in on for and or what who how does do did he his him prannav about tell me it with any can i you be are was has have this that there where when which show give share send please good should we us our you your my know kind so far much many get would could like really also all some more been as at by from if not no yes out up want need someone his there".split(" "));
const SYN: Record<string, string> = { resume: "cv", biodata: "cv", curriculum: "cv", salary: "compensation", ctc: "compensation", pay: "compensation", package: "compensation", mail: "email", expectation: "expected", expectations: "expected", relocate: "relocation", hobby: "hobbies", project: "projects", product: "products", app: "apps" };
const stem = (w: string) => (w.length > 4 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w);
const tok = (s: string) =>
  (s.toLowerCase().replace(/[\u2018\u2019]/g, "'").match(/[a-z0-9']+/g) ?? [])
    .map((w) => w.replace(/'s$/, "").replace(/'/g, ""))
    .map((w) => stem(SYN[w] ?? w));
const norm = (s: string) => tok(s).join(" ");

const docs = KB.entries.map((e) => tok((e.questions.join(" ") + " ").repeat(3) + " " + e.answer).filter((w) => !STOP.has(w)));
const N = docs.length;
const df: Record<string, number> = {};
for (const d of docs) for (const w of new Set(d)) df[w] = (df[w] ?? 0) + 1;
const idf = (w: string) => Math.log(1 + N / (df[w] ?? 1)); // a word the site never mentions counts as fully unanswered

// score: BM25-style relevance. coverage: share of the question's meaning (by idf weight) the entry actually covers,
// so one shared word ("available") can't hijack a question that is really about something else ("CV").
function score(q: string, d: string[]) {
  let s = 0, got = 0, all = 0;
  for (const w of new Set(tok(q))) {
    if (STOP.has(w)) continue;
    const wt = idf(w); all += wt;
    const tf = d.reduce((n, x) => n + (x === w ? 1 : 0), 0);
    if (tf) { s += (tf / (tf + 1.5)) * wt; got += wt; }
  }
  return { s, coverage: all ? got / all : 0 };
}

export type Hit = { entry: Entry; score: number; coverage: number };

export function search(q: string, k = 4): Hit[] {
  const nq = norm(q);
  const exact = KB.entries.find((e) => e.questions.some((x) => norm(x) === nq));
  const hits = KB.entries
    .map((entry, i) => { const r = score(q, docs[i]); return entry === exact ? { entry, score: r.s + 100, coverage: 1 } : { entry, score: r.s, coverage: r.coverage }; })
    .sort((a, b) => b.score - a.score);
  return hits.slice(0, k);
}

export const CONFIDENT = 6; // score at which a pre-written answer is returned without the model
export const MINIMUM = 2.0; // below this, the question is treated as out of scope
export const COVER_KB = 0.6; // share of the question an entry must cover to be returned as-is
export const COVER_LLM = 0.35; // below this, even the model is not asked: the site has nothing on it

export type Card = { title: string; desc: string; href: string; external?: boolean; tag: string };

const proj: Record<string, Card> = {
  "lets-match": { title: "Let's Match", desc: "Live app: decide what to watch as a group", href: "/works/lets-match", tag: "Live app" },
  "performance-ai": { title: "Performance AI", desc: "Marketing decision product", href: "/works/performance-ai", tag: "Prototype" },
  "helix-ai": { title: "Helix AI", desc: "Customer operations", href: "/works/helix-ai", tag: "Prototype" },
  "revora-ai": { title: "Revora AI", desc: "Billing and revenue operations", href: "/works/revora-ai", tag: "Prototype" },
  comply: { title: "Comply", desc: "Compliance operating layer", href: "/works/comply", tag: "Prototype" },
  peopleos: { title: "PeopleOS", desc: "Skills-based talent intelligence", href: "/works/peopleos", tag: "Prototype" },
  cv: { title: "View CV", desc: "Read it online", href: "/cv", tag: "CV" },
  "cv-pdf": { title: "Download PDF", desc: "Prannav_K_B_CV.pdf", href: "/Prannav_K_B_CV.pdf", tag: "CV" },
};
for (const c of Object.values(proj)) c.external = true;

const cardMap: Record<string, string[]> = {
  "projects-overview": ["lets-match", "performance-ai", "helix-ai", "revora-ai", "comply", "peopleos"],
  "project-letsmatch": ["lets-match"], "project-letsmatch-why": ["lets-match"], "project-letsmatch-status": ["lets-match"],
  "project-performance-ai": ["performance-ai"], "project-helix": ["helix-ai"], "project-revora": ["revora-ai"],
  "project-comply": ["comply"], "project-peopleos": ["peopleos"],
  "project-fictional": ["lets-match"], "project-how-built": ["lets-match"],
  cv: ["cv", "cv-pdf"], "experience-years": ["cv"],
};

export function cardsFor(ids: string[]): Card[] {
  const out: Card[] = [];
  for (const id of ids) for (const s of cardMap[id] ?? []) if (!out.find((c) => c.href === proj[s].href)) out.push(proj[s]);
  return out.slice(0, 6);
}
export const projectCard = (slug: string) => proj[slug];
