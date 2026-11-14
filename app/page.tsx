import Header from "@/components/Header";
import Chat from "@/components/Chat";
import Reveal from "@/components/Reveal";
import WorkCard from "@/components/WorkCard";
import { projects } from "@/lib/projects";

const Band = ({ n, title }: { n: string; title: string }) => (
  <div className="band"><div className="wrap"><h2>{title}</h2><span>{n} / 04</span></div></div>
);

const EMAIL = "prannavb27@iimklive.com", PHONE = "99400 33571";

const exp = [
  { when: "Jun 2025 to present", role: "Manager, Strategy and Planning · Flipkart", text: "Took Flipkart Trust Shield from 0 to 1 (5% conversion uplift). Shipped an hourly sell-out reporting tool used by leadership. Built the CY2026 plan for a 25 Mn+ user loyalty base. Expanded serviceability from 4 to 66 cities" },
  { when: "Jan to Jun 2023", role: "Solutions Consultant, US Market · ZoomInfo", text: "Closed USD 0.22 Mn in ARR. Root-caused 200+ tickets to surface the product gaps behind repeat issues" },
  { when: "Jan 2021 to Jan 2023", role: "Product Consultant, UK Market · Freshworks", text: "Analysed 500+ lost deals (USD 0.5+ Mn protected), built 10+ competitor dashboards, generated USD 0.66+ Mn in ARR. Top Performer three quarters running" },
  { when: "2024 to 2025", role: "Internships · GlaxoSmithKline, Wayplorer", text: "Piloted a field sales app that lifted orders by 30%. Benchmarked 5+ CRM and RevOps platforms for positioning" },
];

export default function Home() {
  const [feat, ...rest] = projects;
  return (
    <>
      <Header home />
      <main>
        <section className="hero" id="ask" style={{ paddingBottom: 56 }}>
          <div className="wrap">
            <img className="avatar" src="/prannav.jpg" alt="Prannav" />
            <div className="eyebrow" style={{ marginTop: 18 }}>Ask Prannav</div>
            <h1>Product Manager building where <span>business, technology and AI</span> meet</h1>
            <p className="sub">This site is run by an assistant. Ask it anything about what Prannav has built, how he works and where he'd fit, and it will show you the work</p>
            <Chat />
          </div>
        </section>

        <section id="works" className="sec">
          <Band n="01" title="Works" />
          <div className="wrap">
            <Reveal className="head">
              <h2>He builds the products himself</h2>
              <p>One live app that people use today, and five enterprise product prototypes that show how he thinks a problem through, end to end</p>
            </Reveal>
            <Reveal>
              <div className="feat">
                <div className="txt">
                  <span className="tag live">Live app</span>
                  <h2 style={{ marginTop: 6 }}>{feat.name}</h2>
                  <p style={{ fontSize: 18, color: "#334155" }}>{feat.tagline}</p>
                  <p>{feat.problem}</p>
                  <div className="row">
                    <a className="btn acc" href={feat.href} target="_blank" rel="noreferrer">Try the live app ↗</a>
                    <a className="btn" href={`/works/${feat.slug}`} target="_blank" rel="noreferrer">How it works</a>
                  </div>
                </div>
                <div className="vis"><div className="phone"><video src={feat.media} poster={feat.shot} autoPlay muted loop playsInline /></div></div>
              </div>
            </Reveal>
            <div className="grid">
              {rest.map((p, i) => <Reveal key={p.slug} delay={i * 70}><WorkCard p={p} /></Reveal>)}
            </div>
          </div>
        </section>

        <section id="about" className="alt sec">
          <Band n="02" title="About" />
          <div className="wrap about">
            <Reveal><img src="/prannav.jpg" alt="Prannav" /></Reveal>
            <Reveal>
              <h2>Turning complex problems into products people actually value</h2>
              <p style={{ color: "#334155", fontSize: 17 }}>Prannav is based in Bengaluru. He spent two years in front of B2B SaaS customers at Freshworks and ZoomInfo, then moved into strategy and planning at Flipkart. He earned his MBA at <span className="iim">IIM Kozhikode</span> and builds products himself to learn what works</p>
              <div className="two">
                <div className="pill"><h3>Build, measure, iterate</h3><p>Strong decisions combine structured thinking with real-world feedback. The best way to learn what works is to build it, measure the impact and keep improving</p></div>
                <div className="pill"><h3>Value over interface</h3><p>Great products are defined by the value they deliver to the end user, with a friendly design, not by how good the interface looks</p></div>
              </div>
              <h3>Why product management</h3>
              <p style={{ color: "var(--mut)" }}>Close to customers at Freshworks and ZoomInfo, he learned to translate complex technology into business value. At Flipkart he saw consumer behaviour, product economics and outcomes up close. Product brings it together: understanding people, connecting business and technology, and turning ideas into outcomes</p>
              <h3 style={{ marginTop: 20 }}>Outside work</h3>
              <p style={{ color: "var(--mut)", margin: 0 }}>He follows Formula 1 closely and watches races on weekends with friends, and stays active through cricket and running</p>
            </Reveal>
          </div>
        </section>

        <section id="cv" className="sec">
          <Band n="03" title="CV" />
          <div className="wrap">
            <Reveal className="head">
              <h2>Experience at a glance</h2>
              <p>MBA, <span className="iim">IIM Kozhikode</span> (2025) · BBA, University of Madras (2020, University Rank 10)</p>
            </Reveal>
            <div className="cta">
              <a className="btn pri" href="/cv" target="_blank" rel="noreferrer">View CV ↗</a>
              <a className="btn" href="/Prannav_K_B_CV.pdf" download>Download PDF</a>
            </div>
            <div className="cvg">
              <Reveal><div className="tl">
                {exp.map((e) => (<div className="it" key={e.role}><div className="when">{e.when}</div><b>{e.role}</b><p>{e.text}</p></div>))}
              </div></Reveal>
              <Reveal delay={100}>
                <div className="pill" style={{ marginBottom: 16 }}><h3>Skills</h3>
                  <div className="kv" style={{ marginTop: 10 }}>{["Product discovery", "0 to 1 launches", "Prioritization", "Product analytics", "Competitive benchmarking", "Pricing and unit economics", "Customer feedback loops"].map((s) => <span key={s}>{s}</span>)}</div></div>
                <div className="pill" style={{ marginBottom: 16 }}><h3>Tools</h3>
                  <div className="kv" style={{ marginTop: 10 }}>{["Jira", "Notion", "SQL", "Excel", "Power BI", "Salesforce", "Freshworks CRM", "Apps Script"].map((s) => <span key={s}>{s}</span>)}</div></div>
                <div className="pill"><h3>Looking for</h3><p>Product Manager, Associate PM, AI PM or Product Builder roles in B2B SaaS, AI-native, enterprise tech, fintech or consumer tech. Bengaluru, Chennai, remote or hybrid</p></div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="contact" className="alt sec">
          <Band n="04" title="Contact" />
          <div className="wrap">
            <Reveal className="head"><h2>Let's talk</h2></Reveal>
            <Reveal><div className="contact">
              <a href={`mailto:${EMAIL}`}><small>Email</small><b>{EMAIL}</b></a>
              <a href="tel:+919940033571"><small>Phone</small><b>{PHONE}</b></a>
              <a href="https://linkedin.com/in/prannavkb" target="_blank" rel="noreferrer"><small>LinkedIn</small><b>linkedin.com/in/prannavkb</b></a>
            </div></Reveal>
          </div>
        </section>
      </main>
      <footer><div className="wrap"><span>© Prannav. Prototypes use sample data and fictional companies</span><span>The assistant logs questions anonymously (no name, IP or device details)</span></div></footer>
    </>
  );
}
