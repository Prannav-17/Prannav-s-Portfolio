import Link from "next/link";
export default function Header({ home = false }: { home?: boolean }) {
  const p = home ? "" : "/";
  return (
    <header className="hdr"><div className="wrap">
      <Link href="/" aria-label="Prannav home"><img src="/wordmark.svg" alt="Prannav" /></Link>
      <nav className="nav">
        <a href={`${p}#ask`}>Ask Prannav</a><a href={`${p}#works`}>Works</a><a href={`${p}#about`}>About</a><a href={`${p}#cv`}>CV</a>
        <a className="btn pri" href={`${p}#contact`}>Contact</a>
      </nav>
    </div></header>
  );
}
