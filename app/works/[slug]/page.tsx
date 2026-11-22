import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Chat from "@/components/Chat";
import { projects, bySlug } from "@/lib/projects";
import { Words } from "@/components/Split";
import AutoVideo from "@/components/AutoVideo";

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
          <span data-h className={`tag ${p.kind === "Live app" ? "live" : ""}`}>{p.kind === "Live app" && <span className="pulse" />}{p.kind}</span> <span data-h style={{ color: "var(--mut)", fontSize: 14 }}>{p.domain}</span>
          <h1 data-hwords style={{ fontSize: "clamp(36px,5.5vw,64px)", marginTop: 10 }}><Words text={p.name} /></h1>
          <p className="sub" data-h style={{ margin: 0, fontSize: 20 }}>{p.tagline}</p>
        </div>
        <div className={`frame${p.portrait ? " ph" : ""}`} data-a="up">
          {!p.portrait && <div className="bar"><i /><i /><i /></div>}
          <AutoVideo src={p.media} poster={p.shot} fallback={p.slug === "lets-match" ? "/media/lets-match-anim.webp" : undefined} />
        </div>
        <div className="cta" style={{ justifyContent: "center" }}>
          <a className="btn acc" href={p.href} target="_blank" rel="noreferrer" data-magnetic>{p.kind === "Live app" ? "Open the live app ↗" : "Open the full prototype ↗"}</a>
        </div>
        {p.pain ? <>
          <div className="cols" style={{ marginTop: 34 }} data-a="stagger">
            <div><h3>The pain point</h3><p>{p.pain}</p></div>
            <div><h3>Why today&apos;s tools miss it</h3><p>{p.gap}</p></div>
          </div>
          {p.evidence && (
            <section className="ev" aria-labelledby="ev-h">
              <h3 id="ev-h">The pain, in public</h3>
              <p className="ev-sub">What customers, analysts and researchers have written about this problem. Each quote links to its source</p>
              <div className={`ev-grid${p.evidence.length === 4 ? " ev-4" : ""}`} data-a="stagger">
                {p.evidence.map((e) => (
                  <figure key={e.url + e.quote} className="ev-card">
                    <blockquote>{/^[a-z]/.test(e.quote) ? "“…" : "“"}{e.quote}”</blockquote>
                    <figcaption><a href={e.url} target="_blank" rel="noreferrer">{e.who} ↗</a></figcaption>
                    <p className="ev-why">{e.why}</p>
                  </figure>
                ))}
              </div>
            </section>
          )}
          {p.users && (
            <div className="who" data-a="stagger">
              <div><small>Used by</small><p>{p.users.user}</p></div>
              <div><small>Bought by</small><p>{p.users.buyer}</p></div>
              <div><small>When it&apos;s used</small><p>{p.users.when}</p></div>
            </div>
          )}
          <div className="cols" style={{ marginTop: 26 }} data-a="stagger">
            <div><h3>How it solves it</h3><ul>{p.how?.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div><h3>Judgment calls</h3><ul>{p.decisions?.map((x) => <li key={x}>{x}</li>)}</ul></div>
          </div>
          {p.data && (
            <div className="cols" style={{ marginTop: 26 }} data-a="stagger">
              <div><h3>Where the data comes from</h3><ul>{p.data.map((x) => <li key={x}>{x}</li>)}</ul></div>
              <div><h3>Enterprise controls</h3><ul>{p.controls?.map((x) => <li key={x}>{x}</li>)}</ul></div>
            </div>
          )}
          {p.metrics && (
            <div className="cols" style={{ marginTop: 26 }} data-a="stagger">
              <div><h3>How success is measured</h3><ul>{p.metrics.map((x) => <li key={x}>{x}</li>)}</ul></div>
              <div><h3>What he&apos;d validate next</h3><ul>{p.validate?.map((x) => <li key={x}>{x}</li>)}</ul></div>
            </div>
          )}
        </> : (
          <div className="cols" style={{ marginTop: 34 }} data-a="stagger">
            <div><h3>The problem</h3><p>{p.problem}</p></div>
            <div><h3>The idea</h3><p>{p.solution}</p></div>
          </div>
        )}
        {p.different && <p className="diff" style={{ marginTop: 26 }} data-a="up"><b>Why it&apos;s different</b>{p.different}</p>}
        {p.impact && (
          <div className="cols" style={{ marginTop: 26 }} data-a="stagger">
            <div><h3>What testing showed</h3><p>{p.impact}</p></div>
            <div><h3>What changed after feedback</h3><ul>{p.feedback?.map((x) => <li key={x}>{x}</li>)}</ul></div>
          </div>
        )}
        <div className="cols" style={{ marginTop: 26 }} data-a="stagger">
          <div><h3>What is inside</h3><ul>{p.points.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div>{p.note && <><h3>Status</h3><p style={{ fontSize: 15.5, color: "#334155" }}>{p.note}</p></>}
            {p.kind === "Prototype" && <><h3>About this prototype</h3><p style={{ fontSize: 15.5, color: "#334155" }}>A clickable prototype with sample data, built with Claude Code from a written thesis and tested screen by screen. It is not a live product</p></>}</div>
        </div>
        <div style={{ marginTop: 44 }} data-a="up">
          <h3>Ask about {p.name}</h3>
          <Chat project={p.name} compact placeholder={`Ask anything about ${p.name}`} starters={p.kind === "Live app" ? [`What is ${p.name}?`, `Why did he build ${p.name}?`, `Is ${p.name} live?`] : [`Tell me about ${p.name}`, "Are these real products?", "How does Prannav build these products?"]} />
        </div>
        <div style={{ marginTop: 50 }}>
          <h3>More works</h3>
          <div className="cards" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))" }} data-a="stagger">
            {others.map((o) => (<a key={o.slug} className="mini" href={`/works/${o.slug}`}><span className={`tag ${o.kind === "Live app" ? "live" : ""}`}>{o.kind}</span><b>{o.name}</b><span>{o.domain}</span></a>))}
          </div>
        </div>
      </div></main>
    </>
  );
}
