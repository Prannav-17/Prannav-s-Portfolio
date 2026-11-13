import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Chat from "@/components/Chat";
import { projects, bySlug } from "@/lib/projects";

export const dynamicParams = false;
export function generateStaticParams() { return projects.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = bySlug((await params).slug); if (!p) return {};
  return { title: `${p.name} | Prannav`, description: p.tagline };
}

export default async function Work({ params }: { params: Promise<{ slug: string }> }) {
  const p = bySlug((await params).slug); if (!p) notFound();
  const others = projects.filter((x) => x.slug !== p.slug);
  return (
    <>
      <Header />
      <main className="pg"><div className="wrap" style={{ maxWidth: 940 }}>
        <a className="back" href="/#works">← All works</a>
        <div style={{ marginTop: 18 }}>
          <span className={`tag ${p.kind === "Live app" ? "live" : ""}`}>{p.kind}</span> <span style={{ color: "var(--mut)", fontSize: 14 }}>{p.domain}</span>
          <h1 style={{ fontSize: "clamp(30px,4.5vw,46px)", marginTop: 8 }}>{p.name}</h1>
          <p className="sub" style={{ margin: 0, fontSize: 20 }}>{p.tagline}</p>
        </div>
        <div className={`frame${p.portrait ? " ph" : ""}`}>
          {!p.portrait && <div className="bar"><i /><i /><i /></div>}
          <video src={p.media} poster={p.shot} autoPlay muted loop playsInline controls={false} />
        </div>
        <div className="cta" style={{ justifyContent: "center" }}>
          <a className="btn acc" href={p.href} target="_blank" rel="noreferrer">{p.kind === "Live app" ? "Open the live app ↗" : "Open the full prototype ↗"}</a>
        </div>
        <div className="cols" style={{ marginTop: 34 }}>
          <div><h3>The problem</h3><p>{p.problem}</p></div>
          <div><h3>The idea</h3><p>{p.solution}</p></div>
        </div>
        <div className="cols" style={{ marginTop: 26 }}>
          <div><h3>What is inside</h3><ul>{p.points.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div>{p.note && <><h3>Status</h3><p style={{ fontSize: 15.5, color: "#334155" }}>{p.note}</p></>}
            {p.kind === "Prototype" && <><h3>About this prototype</h3><p style={{ fontSize: 15.5, color: "#334155" }}>A clickable prototype with sample data, built with Claude Code from a written thesis and tested screen by screen. It is not a live product.</p></>}</div>
        </div>
        <div style={{ marginTop: 44 }}>
          <h3>Ask about {p.name}</h3>
          <Chat project={p.name} compact placeholder={`Ask anything about ${p.name}`} starters={p.kind === "Live app" ? [`What is ${p.name}?`, `Why did he build ${p.name}?`, `Is ${p.name} live?`] : [`Tell me about ${p.name}`, "Are these real products?", "How does Prannav build these products?"]} />
        </div>
        <div style={{ marginTop: 50 }}>
          <h3>More works</h3>
          <div className="cards" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))" }}>
            {others.map((o) => (<a key={o.slug} className="mini" href={`/works/${o.slug}`}><span className={`tag ${o.kind === "Live app" ? "live" : ""}`}>{o.kind}</span><b>{o.name}</b><span>{o.domain}</span></a>))}
          </div>
        </div>
      </div></main>
    </>
  );
}
