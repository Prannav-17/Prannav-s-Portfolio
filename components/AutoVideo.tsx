"use client";
import { useEffect, useRef, useState } from "react";

// A muted demo that plays whenever it is on screen and pauses when it is not.
// Some phones block video autoplay (iPhone Low Power Mode, data savers) and show a play button instead.
// If playback is refused, an animated image of the same clip is swapped in, because those still animate.
export default function AutoVideo({ src, poster, fallback, className }: { src: string; poster?: string; fallback?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const v = ref.current; if (!v) return;
    v.muted = true; v.defaultMuted = true; v.playsInline = true;
    let visible = false, settled = false;
    const play = () => {
      if (!v.paused) return;
      v.play().then(() => { settled = true; }).catch((e: DOMException) => { if (e?.name === "NotAllowedError" && fallback) setBlocked(true); });
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) play(); else v.pause(); }, { threshold: 0.2 });
    io.observe(v);
    // If nothing has started a few seconds after it came into view, treat autoplay as blocked
    const check = window.setTimeout(() => { if (!settled && visible && v.paused && fallback) setBlocked(true); }, 3000);
    // A tap anywhere also counts as permission to play on browsers that need one
    const kick = () => { if (visible) play(); };
    window.addEventListener("touchend", kick, { passive: true });
    return () => { io.disconnect(); clearTimeout(check); window.removeEventListener("touchend", kick); };
  }, [fallback]);

  if (blocked && fallback) return <img className={className} src={fallback} alt="" aria-hidden="true" />;
  return <video ref={ref} className={`autovid${className ? ` ${className}` : ""}`} src={src} poster={poster} autoPlay muted loop playsInline preload="auto" aria-hidden="true" />;
}
