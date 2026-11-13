import { cookies } from "next/headers";
import { readLog, storeConfigured } from "@/lib/log";
import { token, same } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false, follow: false } };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
const count = <T,>(xs: T[], key: (x: T) => string) => { const m = new Map<string, number>(); xs.forEach((x) => m.set(key(x), (m.get(key(x)) ?? 0) + 1)); return [...m.entries()].sort((a, b) => b[1] - a[1]); };

export default async function Admin({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const sp = await searchParams;
  const c = (await cookies()).get("adm")?.value ?? "";
  const authed = !!process.env.ADMIN_KEY && same(c, token());

  if (!authed) {
    return (
      <main className="pg"><div className="wrap" style={{ maxWidth: 420 }}>
        <h2>Admin</h2>
        {!process.env.ADMIN_KEY && <p className="note" style={{ textAlign: "left" }}>Set ADMIN_KEY in Vercel environment variables to enable this page.</p>}
        <form method="post" action="/api/admin/login" className="chat" style={{ marginTop: 14 }}>
          <div className="inrow"><input type="password" name="key" placeholder="Admin key" autoFocus /><button className="send" aria-label="Sign in">→</button></div>
        </form>
        {sp.e === "bad" && <p className="note">Wrong key.</p>}
        {sp.e === "wait" && <p className="note">Too many attempts. Try again in a minute.</p>}
      </div></main>
    );
  }

  const log = await readLog();
  if (!storeConfigured()) {
    return (<main className="pg"><div className="wrap" style={{ maxWidth: 720 }}><h2>Admin</h2><p>No log store is connected yet. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel, redeploy, and questions will appear here. Until then you can see them in Vercel → Logs by searching for ASK_LOG.</p></div></main>);
  }

  const real = log.filter((r) => r.route !== "limited");
  const days = count(real, (r) => r.t.slice(0, 10)).sort((a, b) => (a[0] < b[0] ? 1 : -1)).slice(0, 14);
  const maxDay = Math.max(1, ...days.map((d) => d[1]));
  const topQ = count(real, (r) => norm(r.q)).slice(0, 15);
  const gaps = count(real.filter((r) => r.route === "fallback" || r.route === "kb-weak"), (r) => norm(r.q)).slice(0, 15);
  const routes = count(log, (r) => r.route);
  const topEntries = count(real.filter((r) => r.entry), (r) => r.entry as string).slice(0, 8);
  const recent = log.slice(0, 25);
  const t = (n: number) => <b style={{ fontSize: 28 }}>{n}</b>;

  return (
    <main className="pg"><div className="wrap" style={{ maxWidth: 980 }}>
      <h2>Questions asked</h2>
      <p style={{ color: "var(--mut)", marginTop: 0 }}>Anonymous. No names, IPs or devices. Latest {log.length} stored (max 5000).</p>
      <div className="contact" style={{ margin: "18px 0" }}>
        <div><small>Total questions</small>{t(real.length)}</div>
        <div><small>Last 7 days</small>{t(real.filter((r) => Date.now() - Date.parse(r.t) < 7 * 864e5).length)}</div>
        <div><small>Not answered well</small>{t(real.filter((r) => r.route === "fallback").length)}</div>
      </div>

      <div className="cols" style={{ gap: 20 }}>
        <div className="pill"><h3>Per day</h3>
          {days.length === 0 && <p>No questions yet.</p>}
          {days.map(([d, n]) => (<div key={d} style={{ display: "flex", gap: 10, alignItems: "center", margin: "6px 0", fontSize: 14 }}>
            <span style={{ width: 86, color: "var(--mut)" }}>{d}</span><div style={{ flex: 1, background: "#eef0f6", borderRadius: 6 }}><div style={{ width: `${(n / maxDay) * 100}%`, background: "var(--acc)", height: 10, borderRadius: 6 }} /></div><b>{n}</b></div>))}
        </div>
        <div className="pill"><h3>How they were answered</h3>
          {routes.map(([r, n]) => <div key={r} style={{ display: "flex", justifyContent: "space-between", margin: "6px 0", fontSize: 14 }}><span>{({ kb: "Pre-written answer", cache: "Cached", llm: "AI model", "kb-weak": "Closest answer (weak match)", fallback: "No answer", limited: "Rate limited" } as Record<string, string>)[r] ?? r}</span><b>{n}</b></div>)}
        </div>
      </div>

      <div className="cols" style={{ gap: 20, marginTop: 20 }}>
        <div className="pill"><h3>Most asked</h3>{topQ.length === 0 && <p>None yet.</p>}{topQ.map(([q, n]) => <div key={q} style={{ display: "flex", justifyContent: "space-between", gap: 10, margin: "7px 0", fontSize: 14 }}><span>{q}</span><b>{n}</b></div>)}</div>
        <div className="pill"><h3>Gaps to fill in the knowledge file</h3><p style={{ fontSize: 13, marginBottom: 6 }}>Questions with no answer or only a weak match.</p>{gaps.length === 0 && <p>None yet.</p>}{gaps.map(([q, n]) => <div key={q} style={{ display: "flex", justifyContent: "space-between", gap: 10, margin: "7px 0", fontSize: 14 }}><span>{q}</span><b>{n}</b></div>)}</div>
      </div>

      <div className="pill" style={{ marginTop: 20 }}><h3>Topics people care about</h3><div className="kv" style={{ marginTop: 8 }}>{topEntries.map(([e, n]) => <span key={e}>{e} · {n}</span>)}</div></div>
      <div className="pill" style={{ marginTop: 20 }}><h3>Latest questions</h3>{recent.map((r, i) => <div key={i} style={{ fontSize: 14, margin: "7px 0", display: "flex", gap: 12 }}><span style={{ color: "var(--mut)", whiteSpace: "nowrap" }}>{r.t.slice(5, 16).replace("T", " ")}</span><span>{r.q}</span></div>)}</div>
    </div></main>
  );
}
