"use client";
import { useEffect, useRef, useState } from "react";

type Card = { title: string; desc: string; href: string; external?: boolean; tag: string };
type Msg = { role: "u" | "a"; text: string; cards?: Card[] };

const STARTERS = [
  "What kind of products has Prannav built himself?",
  "Show me an app he built that people can use today",
  "How does he think about building products?",
  "What has he achieved in his career so far?",
  "What kind of roles is he looking for?",
  "How can I contact him?",
];

export default function Chat({ project, compact = false, placeholder, starters: custom }: { project?: string; compact?: boolean; placeholder?: string; starters?: string[] }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  // A new answer opens at its first line, not its last, so long answers read top-down (matters most on phones)
  useEffect(() => {
    const b = box.current; if (!b) return;
    const last = b.querySelector<HTMLElement>(".msg:last-of-type");
    if (!busy && last?.classList.contains("a")) {
      b.scrollTop = last.offsetTop - 8;
      const top = last.getBoundingClientRect().top;
      if (top < 72 || top > window.innerHeight - 140) {
        const lenis = (window as Window & { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
        if (lenis) lenis.scrollTo(window.scrollY + top - 96, { duration: 0.6 });
        else window.scrollBy({ top: top - 96, behavior: "smooth" });
      }
    } else b.scrollTop = b.scrollHeight;
  }, [msgs, busy]);

  async function ask(text: string) {
    const t = text.trim(); if (!t || busy) return;
    setQ(""); setMsgs((m) => [...m, { role: "u", text: t }]); setBusy(true);
    try {
      const r = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ q: t, project }) });
      const j = await r.json();
      setMsgs((m) => [...m, { role: "a", text: j.answer, cards: j.cards }]);
    } catch {
      setMsgs((m) => [...m, { role: "a", text: "Something went wrong. You can reach Prannav at prannavb27@iimklive.com." }]);
    } finally { setBusy(false); }
  }

  const starters = custom ?? STARTERS;
  return (
    <div className={`chat${compact ? " compact" : ""}`} id={compact ? undefined : "chat"}>
      {msgs.length > 0 && (
        <div className="msgs" ref={box} aria-live="polite" data-lenis-prevent>
          {msgs.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              {m.text}
              {m.cards && m.cards.length > 0 && (
                <div className="cards">
                  {m.cards.map((c) => (
                    <a key={c.href} className="mini" href={c.href} target="_blank" rel="noreferrer">
                      <span className={`tag ${c.tag === "Live app" ? "live" : ""}`}>{c.tag}</span>
                      <b>{c.title} ↗</b><span>{c.desc}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          {busy && <div className="msg a"><span className="dots"><span /><span /><span /></span></div>}
        </div>
      )}
      <form className="inrow" onSubmit={(e) => { e.preventDefault(); ask(q); }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} maxLength={300} aria-label="Ask a question about Prannav"
          placeholder={placeholder ?? "Ask anything about Prannav"} />
        <button className={`send${busy ? " go" : ""}`} disabled={busy || !q.trim()} aria-label="Send"><span>→</span></button>
      </form>
      {msgs.length === 0 && (
        <div className="chips">{starters.map((s) => <button key={s} className="chip" onClick={() => ask(s)}>{s}</button>)}</div>
      )}
      {!compact && <div className="note">AI assistant · Answers come only from this site · Questions are logged anonymously</div>}
    </div>
  );
}
