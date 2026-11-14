"use client";
// All page motion lives here: smooth scrolling, the intro loader, scroll-triggered reveals, the sliding
// section bands, and pointer effects (magnetic buttons, tilting cards, the "View" badge, click ripples).
// It only runs when the boot script in layout.tsx has set html.motion, so people who ask for reduced
// motion (or whose JavaScript fails) get the plain, fully visible page.
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

type W = Window & { __motionReady?: boolean; __lenis?: Lenis };
const all = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T & Element>(sel)) as T[];

export default function Motion() {
  const path = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const win = window as W;
    win.__motionReady = true;
    if (!root.classList.contains("motion")) return;

    gsap.registerPlugin(ScrollTrigger);
    const fine = window.matchMedia("(pointer: fine)").matches;
    const cleanups: (() => void)[] = [];
    const on = <K extends keyof DocumentEventMap>(t: Document | Window | HTMLElement, ev: K | string, fn: (e: any) => void, opts?: AddEventListenerOptions) => {
      t.addEventListener(ev, fn, opts); cleanups.push(() => t.removeEventListener(ev, fn, opts));
    };

    // ---------- Smooth scroll for mouse and trackpad, kept in step with ScrollTrigger.
    // Touch screens keep native scrolling: it already has momentum, and a scroll library there only gets in the way.
    const lenis = fine ? new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) }) : null;
    const tick = (t: number) => lenis?.raf(t * 1000);
    if (lenis) {
      win.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // In-page links glide to their section and stop just under the floating header
    on(document, "click", (e: MouseEvent) => {
      const a = (e.target as Element)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
      const u = new URL(a.href, location.href);
      if (u.pathname !== location.pathname || !u.hash) return;
      const el = document.getElementById(decodeURIComponent(u.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      // Both honour scroll-padding-top, so the section stops just under the header
      if (lenis) lenis.scrollTo(el, { duration: 1.4 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", u.hash);
    });

    const ctx = gsap.context(() => {
      // ---------- Intro: words of the headline rise, everything else settles in
      const intro = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      if (all(".hero .cl").length) intro.fromTo(".hero .cl", { opacity: 0, scale: 0.6 }, { opacity: 0.9, scale: 1, duration: 1.8, stagger: 0.12 }, 0);
      if (all(".gridlines i").length) intro.fromTo(".gridlines i", { scaleY: 0 }, { scaleY: 1, duration: 1.3, stagger: 0.06, ease: "power3.inOut" }, 0);
      if (all(".avatar-wrap[data-h]").length) intro.to(".avatar-wrap[data-h]", { opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.7)" }, 0.1);
      const hwords = all("[data-hwords] .wi");
      if (hwords.length) intro.to(hwords, { y: 0, yPercent: 0, rotate: 0, duration: 1.15, stagger: 0.055, ease: "power4.out" }, 0.25);
      const hl = document.querySelector(".hl");
      if (hl) intro.add(() => hl.classList.add("on"), 0.95);
      const rest = all("[data-h]").filter((el) => !el.classList.contains("avatar-wrap"));
      if (rest.length) intro.to(rest, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.2);
      const chips = all(".hero .chip");
      if (chips.length) intro.fromTo(chips, { opacity: 0, y: 14, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.05, ease: "back.out(1.8)", clearProps: "transform,opacity" }, 0.75);

      // ---------- Loader (first visit in a tab): count to 100, then the sky columns lift away
      const loader = document.querySelector<HTMLElement>(".loader");
      if (loader && !root.classList.contains("seen")) {
        const count = loader.querySelector(".ld-count");
        const n = { v: 0 };
        gsap.timeline({ onComplete: () => { try { sessionStorage.setItem("pk-intro", "1"); } catch {} loader.style.display = "none"; } })
          .fromTo(".ld-name span", { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: "power4.out" })
          .to(n, { v: 100, duration: 1, ease: "power2.inOut", onUpdate: () => { if (count) count.textContent = `${Math.round(n.v)}%`; } }, 0)
          .to(".ld-in", { yPercent: -40, opacity: 0, duration: 0.45, ease: "power2.in" }, ">-0.05")
          .to(".ld-cols i", { yPercent: -100, duration: 0.85, stagger: 0.07, ease: "power4.inOut" }, "<0.05")
          .add(() => { intro.play(); }, "-=0.6");
      } else {
        if (loader) loader.style.display = "none";
        intro.play();
      }

      // ---------- Scroll progress and the header that tightens once you scroll
      gsap.to(".progress i", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
      const hdr = document.querySelector(".hdr");
      hdr?.classList.toggle("scrolled", window.scrollY > 40);
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: (st) => hdr?.classList.toggle("scrolled", st.scroll() > 40) });

      // ---------- Header indicator slides to the section in view
      const ind = document.querySelector<HTMLElement>(".nav-ind");
      const links = all<HTMLAnchorElement>(".nav [data-sec]");
      let current = "";
      const moveInd = (id: string) => {
        current = id;
        const a = links.find((l) => l.dataset.sec === id && l.offsetParent !== null);
        links.forEach((l) => l.classList.toggle("active", l === a));
        if (!ind) return;
        if (!a || a.classList.contains("btn")) { gsap.to(ind, { opacity: 0, duration: 0.3 }); return; }
        const nav = ind.parentElement!.getBoundingClientRect(), r = a.getBoundingClientRect();
        gsap.to(ind, { x: r.left - nav.left, width: r.width, opacity: 1, duration: 0.55, ease: "power3.out" });
      };
      for (const l of links) {
        const sec = document.getElementById(l.dataset.sec!);
        if (sec) ScrollTrigger.create({ trigger: sec, start: "top 45%", end: "bottom 45%", onToggle: (s) => { if (s.isActive) moveInd(l.dataset.sec!); } });
      }
      on(window, "resize", () => { if (current) moveInd(current); });

      // ---------- Scroll reveals
      for (const el of all("[data-a='words']"))
        gsap.to(all(".wi", el), { y: 0, yPercent: 0, rotate: 0, duration: 1.15, stagger: 0.05, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 88%" } });
      for (const el of all("[data-a='up']"))
        gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } });
      for (const el of all("[data-a='stagger']"))
        gsap.to(el.children, { opacity: 1, y: 0, duration: 0.95, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
      for (const el of all("[data-a='pop']"))
        gsap.to(el.children, { opacity: 1, scale: 1, duration: 0.55, stagger: 0.035, ease: "back.out(2)", scrollTrigger: { trigger: el, start: "top 92%" } });
      for (const el of all("[data-a='clip']")) {
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%" } });
        tl.to(el, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.4, ease: "power4.inOut" });
        const img = el.querySelector("img");
        if (img) tl.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.6, ease: "power3.out" }, 0);
      }
      // Band titles rise in, and the faint marquee behind them slides with the scroll
      all("[data-band]").forEach((band, i) => {
        const h = band.querySelector("h2"), n = band.querySelector(".band-n"), track = band.querySelector(".band-track");
        if (h) gsap.to(h, { y: 0, opacity: 1, duration: 1, ease: "power4.out", scrollTrigger: { trigger: band, start: "top 90%" } });
        if (n) gsap.to(n, { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(2)", delay: 0.2, scrollTrigger: { trigger: band, start: "top 90%" } });
        if (track) gsap.fromTo(track, { xPercent: i % 2 ? -30 : -5 }, { xPercent: i % 2 ? -5 : -30, ease: "none", scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: 0.6 } });
      });
      // Numbers count up when they come into view
      for (const b of all("[data-count]")) {
        const to = +b.dataset.count!, from = +(b.dataset.from ?? 0), pre = b.dataset.prefix ?? "", suf = b.dataset.suffix ?? "";
        const n = { v: from };
        b.textContent = `${pre}${from}${suf}`;
        gsap.to(n, { v: to, duration: 1.8, ease: "power2.out", scrollTrigger: { trigger: b, start: "top 92%" }, onUpdate: () => { b.textContent = `${pre}${Math.round(n.v)}${suf}`; } });
      }
      // Timeline line draws itself as you read down
      const tl = document.querySelector("[data-tl]");
      if (tl) gsap.to(".tl-line i", { scaleY: 1, ease: "none", scrollTrigger: { trigger: tl, start: "top 75%", end: "bottom 55%", scrub: 0.5 } });
      // Contact panel opens out from a rounded card to full width
      for (const el of all("[data-expand]"))
        gsap.fromTo(el, { clipPath: "inset(0% 4% 0% 4% round 48px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: el, start: "top 95%", end: "top 30%", scrub: 0.5 } });
      // Gentle float on the live-app phone
      for (const el of all("[data-float]")) gsap.to(el, { y: -14, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
    });

    // ---------- Pointer effects (mouse and trackpad only)
    if (fine) {
      // Hero: clouds drift away from the pointer, a soft light follows it
      const hero = document.querySelector<HTMLElement>(".hero");
      if (hero) {
        const clouds = all(".cl", hero).map((c, i) => ({ x: gsap.quickTo(c, "x", { duration: 1.4, ease: "power3" }), y: gsap.quickTo(c, "y", { duration: 1.4, ease: "power3" }), d: 24 + i * 18 }));
        on(hero, "pointermove", (e: PointerEvent) => {
          const r = hero.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
          clouds.forEach((c) => { c.x(-nx * c.d); c.y(-ny * c.d); });
          hero.style.setProperty("--mx", `${e.clientX - r.left}px`);
          hero.style.setProperty("--my", `${e.clientY - r.top}px`);
        });
      }
      // Magnetic buttons: lean towards the pointer, spring back when it leaves
      for (const el of all("[data-magnetic]")) {
        const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" }), yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
        on(el, "pointermove", (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * 0.28); yTo((e.clientY - r.top - r.height / 2) * 0.35);
        });
        on(el, "pointerleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" }));
      }
      // Work cards tilt in 3D under the pointer
      for (const el of all("[data-tilt]")) {
        on(el, "pointermove", (e: PointerEvent) => {
          const r = el.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(el, { rotateY: nx * 9, rotateX: -ny * 7, y: -6, transformPerspective: 900, duration: 0.5, ease: "power2.out" });
        });
        on(el, "pointerleave", () => gsap.to(el, { rotateY: 0, rotateX: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" }));
      }
      // "View" badge follows the pointer over anything that opens a work
      const badge = document.querySelector<HTMLElement>(".vbadge");
      if (badge) {
        gsap.set(badge, { scale: 0, opacity: 1 });
        const bx = gsap.quickTo(badge, "x", { duration: 0.35, ease: "power3" }), by = gsap.quickTo(badge, "y", { duration: 0.35, ease: "power3" });
        let shown = false;
        on(window, "pointermove", (e: PointerEvent) => {
          bx(e.clientX); by(e.clientY);
          const over = !!(e.target as Element)?.closest?.("[data-view]");
          if (over !== shown) { shown = over; gsap.to(badge, { scale: over ? 1 : 0, duration: over ? 0.5 : 0.3, ease: over ? "back.out(2)" : "power2.in" }); }
        });
      }
    }

    // ---------- Click ripple (mouse and touch)
    on(document, "pointerdown", (e: PointerEvent) => {
      const el = (e.target as Element)?.closest?.(".btn, .chip, .send, .mini, .stage .contact a, .nav a, .work") as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect(), size = Math.max(r.width, r.height) * 2.2;
      const dot = document.createElement("span");
      dot.className = "ripple";
      Object.assign(dot.style, { width: `${size}px`, height: `${size}px`, left: `${e.clientX - r.left - size / 2}px`, top: `${e.clientY - r.top - size / 2}px` });
      el.appendChild(dot);
      gsap.fromTo(dot, { scale: 0, opacity: 0.45 }, { scale: 1, opacity: 0, duration: 0.75, ease: "power2.out", onComplete: () => dot.remove() });
    });

    // Measurements change once fonts, images and videos settle
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    on(window, "load", refresh);

    return () => {
      cleanups.forEach((f) => f());
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis?.destroy();
      delete win.__lenis;
    };
  }, [path]);

  return (
    <>
      <div className="progress" aria-hidden="true"><i /></div>
      <div className="vbadge" aria-hidden="true">View ↗</div>
    </>
  );
}
