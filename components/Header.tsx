import Link from "next/link";
import { Roll } from "@/components/Split";

const LINKS = [["ask", "Ask Prannav"], ["works", "Works"], ["about", "About"], ["cv", "CV"]] as const;

export default function Header({ home = false }: { home?: boolean }) {
  const p = home ? "" : "/";
  return (
    <header className="hdr">
      <div className="hdr-pill">
        <Link href="/" className="brand" aria-label="Prannav home"><img src="/wordmark.svg" alt="Prannav" /></Link>
        <nav className="nav">
          <span className="nav-ind" aria-hidden="true" />
          {LINKS.map(([id, label]) => (
            <a key={id} className={id === "ask" ? "navask" : undefined} href={`${p}#${id}`} data-sec={id} aria-label={label}><Roll text={label} /></a>
          ))}
          <a className="btn pri" href={`${p}#contact`} data-sec="contact" data-magnetic aria-label="Contact"><Roll text="Contact" /></a>
        </nav>
      </div>
    </header>
  );
}
