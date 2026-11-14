"use client";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";

// Shows a designed cover; the demo video takes over on hover (or, on touch screens, when the card is in view).
// The cover only fades once the video is actually playing, so there is never a blank frame.
export default function WorkCard({ p }: { p: Project }) {
  const v = useRef<HTMLVideoElement>(null);
  const card = useRef<HTMLAnchorElement>(null);
  const [live, setLive] = useState(false);

  const play = () => { const el = v.current; if (el) { el.preload = "auto"; el.play().catch(() => {}); } };
  const stop = () => { const el = v.current; setLive(false); if (el) { el.pause(); el.currentTime = 0; } };

  useEffect(() => {
    // Touch screens have no hover: play while the card is mostly on screen (unless reduced motion is on)
    const touch = window.matchMedia("(hover: none)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!touch || calm || !card.current) return;
    const io = new IntersectionObserver(([e]) => (e.intersectionRatio > 0.6 ? play() : stop()), { threshold: [0, 0.6, 1] });
    io.observe(card.current);
    return () => io.disconnect();
  }, []);

  return (
    <a ref={card} className="work" href={`/works/${p.slug}`} target="_blank" rel="noreferrer" data-view data-tilt
      onMouseEnter={play} onMouseLeave={stop}>
      <div className={`m${live ? " live" : ""}`}>
        <video ref={v} src={p.media} muted loop playsInline preload="none" onPlaying={() => setLive(true)} aria-hidden="true" />
        <img className="cover" src={p.cover ?? p.shot} alt={`${p.name} cover`} loading="lazy" decoding="async" />
      </div>
      <div className="b">
        <span className="tag">{p.kind}</span>
        <div className="dom">{p.domain}</div>
        <h3>{p.name}</h3>
        <p>{p.tagline}</p>
        <div className="open">See how it works ↗</div>
      </div>
    </a>
  );
}
