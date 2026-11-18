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
    let visible = false, settled = false, check = 0;
    const play = () => {
      if (!v.paused) return;
      v.preload = "auto";
      v.play().then(() => { settled = true; }).catch((e: DOMException) => { if (e?.name === "NotAllowedError" && fallback) setBlocked(true); });
    };
    // The file only starts downloading once the video is close to the screen
    const near = new IntersectionObserver(([e]) => { if (e.isIntersecting) { v.preload = "auto"; near.disconnect(); } }, { rootMargin: "400px 0px" });
    near.observe(v);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (!visible) { v.pause(); return; }
      play();
      // If it has data but still hasn't started a few seconds after coming into view, autoplay is blocked
      if (!settled && !check) check = window.setTimeout(() => { check = 0; if (!settled && visible && v.paused && v.readyState >= 2 && fallback) setBlocked(true); }, 3000);
    }, { threshold: 0.2 });
    io.observe(v);
    // A tap anywhere also counts as permission to play on browsers that need one
    const kick = () => { if (visible) play(); };
    window.addEventListener("touchend", kick, { passive: true });
    return () => { io.disconnect(); near.disconnect(); clearTimeout(check); window.removeEventListener("touchend", kick); };
  }, [fallback]);

  if (blocked && fallback) return <img className={className} src={fallback} alt="" aria-hidden="true" />;
  return <video ref={ref} className={`autovid${className ? ` ${className}` : ""}`} src={src} poster={poster} muted loop playsInline preload="none" aria-hidden="true" />;
}
