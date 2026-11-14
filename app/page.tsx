import Header from "@/components/Header";
import Chat from "@/components/Chat";
import WorkCard from "@/components/WorkCard";
import { Words } from "@/components/Split";
import { projects } from "@/lib/projects";

const EMAIL = "prannavb27@iimklive.com", PHONE = "99400 33571";

const exp = [
  { when: "Jun 2025 to present", role: "Manager, Strategy and Planning · Flipkart", text: "Took Flipkart Trust Shield from 0 to 1 (5% conversion uplift). Shipped an hourly sell-out reporting tool used by leadership. Built the CY2026 plan for a 25 Mn+ user loyalty base. Expanded serviceability from 4 to 66 cities" },
  { when: "Jan to Jun 2023", role: "Solutions Consultant, US Market · ZoomInfo", text: "Closed USD 0.22 Mn in ARR. Root-caused 200+ tickets to surface the product gaps behind repeat issues" },
  { when: "Jan 2021 to Jan 2023", role: "Product Consultant, UK Market · Freshworks", text: "Analysed 500+ lost deals (USD 0.5+ Mn protected), built 10+ competitor dashboards, generated USD 0.66+ Mn in ARR. Top Performer three quarters running" },
  { when: "2024 to 2025", role: "Internships · GlaxoSmithKline, Wayplorer", text: "Piloted a field sales app that lifted orders by 30%. Benchmarked 5+ CRM and RevOps platforms for positioning" },
];

const stats = [
  { to: 3, suffix: "+", label: "Years across B2B SaaS and e-commerce" },
  { to: 5, suffix: "%", label: "Conversion uplift from Trust Shield, taken 0 to 1" },
  { from: 4, to: 66, prefix: "4 → ", label: "Cities of serviceability, expanded at Flipkart" },
  { to: 25, suffix: " Mn+", label: "Users in the loyalty base he planned for" },
];

const Band = ({ n, title }: { n: string; title: string }) => (
  <div className="band" data-band>
    <div className="band-track" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i}><span className="it">{title.toLowerCase()}</span><span className="star">✦</span><span className="bold">{title}</span><span className="star">✦</span></span>
      ))}
    </div>
    <div className="wrap band-in"><h2>{title}</h2><span className="band-n">{n} / 04</span></div>
  </div>
);

export default function Home() {
  const [feat, ...rest] = projects;
  return (
    <>
      <div className="loader" aria-hidden="true">
        <div className="ld-cols">{Array.from({ length: 5 }, (_, i) => <i key={i} />)}</div>
        <div className="ld-in"><span className="ld-name"><span>Prannav</span></span><span className="ld-count">0%</span></div>
      </div>
      <Header home />
      <main>
        <section className="hero" id="ask">
          <div className="sky" aria-hidden="true">
            <div className="gridlines">{Array.from({ length: 7 }, (_, i) => <i key={i} />)}</div>
            <i className="cl c1" /><i className="cl c2" /><i className="cl c3" /><i className="cl c4" />
            <div className="spot" />
          </div>
          <div className="wrap hero-in">
            <div className="avatar-wrap" data-h><img className="avatar" src="/prannav.jpg" alt="Prannav" /></div>
            <div className="eyebrow badge" data-h><span className="pulse" />Ask Prannav · AI assistant</div>
            <h1 data-hwords>
              <Words text="Product Manager building where" />{" "}
              <em className="hl"><Words text="business, technology and AI" /></em>{" "}
              <Words text="meet" />
            </h1>
            <p className="sub" data-h>This site is run by an assistant. Ask it anything about what Prannav has built, how he works and where he&apos;d fit, and it will show you the work</p>
            <div data-h><Chat /></div>
          </div>
        </section>

        <section id="works" className="sec">
          <Band n="01" title="Works" />
          <div className="wrap">
            <div className="head">
              <h2 data-a="words"><Words text="He builds the products himself" /></h2>
              <p data-a="up">One live app that people use today, and five enterprise product prototypes that show how he thinks a problem through, end to end</p>
            </div>
            <div className="feat" data-a="up">
              <div className="txt">
                <span className="tag live"><span className="pulse" />Live app</span>
                <h2 style={{ marginTop: 10 }}>{feat.name}</h2>
                <p className="lead">{feat.tagline}</p>
                <p>{feat.problem}</p>
                <div className="row">
                  <a className="btn acc" href={feat.href} target="_blank" rel="noreferrer" data-magnetic>Try the live app ↗</a>
                  <a className="btn" href={`/works/${feat.slug}`} target="_blank" rel="noreferrer">How it works</a>
                </div>
              </div>
              <a className="vis" href={`/works/${feat.slug}`} target="_blank" rel="noreferrer" data-view aria-label={`How ${feat.name} works`}>
                <i className="ring r1" /><i className="ring r2" />
                <div className="phone" data-float><video src={feat.media} poster={feat.shot} autoPlay muted loop playsInline /></div>
              </a>
            </div>
            <div className="grid" data-a="stagger">
              {rest.map((p) => <WorkCard key={p.slug} p={p} />)}
            </div>
          </div>
        </section>

        <section id="about" className="sec alt">
          <Band n="02" title="About" />
          <div className="wrap about">
            <div className="photo" data-a="clip"><img src="/prannav.jpg" alt="Prannav" /></div>
            <div>
              <h2 data-a="words"><Words text="Turning complex problems into products people actually value" /></h2>
              <p className="lead" data-a="up">Prannav is based in Bengaluru. He spent two years in front of B2B SaaS customers at Freshworks and ZoomInfo, then moved into strategy and planning at Flipkart. He earned his MBA at <span className="iim">IIM Kozhikode</span> and builds products himself to learn what works</p>
              <div className="two" data-a="stagger">
                <div className="pill"><span className="pill-n">01</span><h3>Build, measure, iterate</h3><p>Strong decisions combine structured thinking with real-world feedback. The best way to learn what works is to build it, measure the impact and keep improving</p></div>
                <div className="pill"><span className="pill-n">02</span><h3>Value over interface</h3><p>Great products are defined by the value they deliver to the end user, with a friendly design, not by how good the interface looks</p></div>
              </div>
              <div data-a="up">
                <h3>Why product management</h3>
                <p className="muted">Close to customers at Freshworks and ZoomInfo, he learned to translate complex technology into business value. At Flipkart he saw consumer behaviour, product economics and outcomes up close. Product brings it together: understanding people, connecting business and technology, and turning ideas into outcomes</p>
                <h3 style={{ marginTop: 22 }}>Outside work</h3>
                <p className="muted" style={{ margin: 0 }}>He follows Formula 1 closely and watches races on weekends with friends, and stays active through cricket and running</p>
              </div>
            </div>
          </div>
        </section>

        <section id="cv" className="sec">
          <Band n="03" title="CV" />
          <div className="wrap">
            <div className="head">
              <h2 data-a="words"><Words text="Experience at a glance" /></h2>
              <p data-a="up">MBA, <span className="iim">IIM Kozhikode</span> (2025) · BBA, University of Madras (2020, University Rank 10)</p>
            </div>
            <div className="stats" data-a="stagger">
              {stats.map((s) => (
                <div className="stat" key={s.label}>
                  <b data-count={s.to} data-from={s.from ?? 0} data-prefix={s.prefix ?? ""} data-suffix={s.suffix ?? ""}>{s.prefix ?? ""}{s.to}{s.suffix ?? ""}</b>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
            <div className="cta" data-a="up">
              <a className="btn pri" href="/cv" target="_blank" rel="noreferrer" data-magnetic>View CV ↗</a>
              <a className="btn" href="/Prannav_K_B_CV.pdf" download>Download PDF</a>
            </div>
            <div className="cvg">
              <div className="tl" data-tl>
                <span className="tl-line" aria-hidden="true"><i /></span>
                {exp.map((e) => (<div className="it" key={e.role} data-a="up"><div className="when">{e.when}</div><b>{e.role}</b><p>{e.text}</p></div>))}
              </div>
              <div data-a="stagger">
                <div className="pill" style={{ marginBottom: 16 }}><h3>Skills</h3>
                  <div className="kv" data-a="pop">{["Product discovery", "0 to 1 launches", "Prioritization", "Product analytics", "Competitive benchmarking", "Pricing and unit economics", "Customer feedback loops"].map((s) => <span key={s}>{s}</span>)}</div></div>
                <div className="pill" style={{ marginBottom: 16 }}><h3>Tools</h3>
                  <div className="kv" data-a="pop">{["Jira", "Notion", "SQL", "Excel", "Power BI", "Salesforce", "Freshworks CRM", "Apps Script"].map((s) => <span key={s}>{s}</span>)}</div></div>
                <div className="pill"><h3>Looking for</h3><p>Product Manager, Associate PM, AI PM or Product Builder roles in B2B SaaS, AI-native, enterprise tech, fintech or consumer tech. Bengaluru, Chennai, remote or hybrid</p></div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="sec contact-sec">
          <Band n="04" title="Contact" />
          <div className="stage">
            <div className="stage-bg" data-expand aria-hidden="true"><i className="cl c1" /><i className="cl c2" /></div>
            <div className="wrap">
              <div className="head center">
                <h2 className="giant" data-a="words"><Words text="Let's talk" /></h2>
                <p data-a="up">Open to Product Manager roles in Bengaluru, Chennai, remote or hybrid</p>
              </div>
              <div className="contact" data-a="stagger">
                <a href={`mailto:${EMAIL}`} data-magnetic><small>Email</small><b>{EMAIL}</b><span className="go">↗</span></a>
                <a href="tel:+919940033571" data-magnetic><small>Phone</small><b>{PHONE}</b><span className="go">↗</span></a>
                <a href="https://linkedin.com/in/prannavkb" target="_blank" rel="noreferrer" data-magnetic><small>LinkedIn</small><b>linkedin.com/in/prannavkb</b><span className="go">↗</span></a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="foot"><div className="wrap"><span>© Prannav. Prototypes use sample data and fictional companies</span><span>The assistant logs questions anonymously (no name, IP or device details)</span></div></footer>
    </>
  );
}
