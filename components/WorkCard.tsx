"use client";
import { useRef } from "react";
import type { Project } from "@/lib/projects";

export default function WorkCard({ p }: { p: Project }) {
  const v = useRef<HTMLVideoElement>(null);
  return (
    <a className="work" href={`/works/${p.slug}`} target="_blank" rel="noreferrer" data-view data-tilt
      onMouseEnter={() => v.current?.play().catch(() => {})} onMouseLeave={() => { if (v.current) { v.current.pause(); v.current.currentTime = 0; } }}>
      <div className="m">
        <video ref={v} src={p.media} poster={p.shot} muted loop playsInline preload="none" />
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
