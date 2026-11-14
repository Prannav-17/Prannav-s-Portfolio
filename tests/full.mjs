// Full click-through test on desktop and mobile. Usage: BASE_URL=http://localhost:3000 node tests/full.mjs
// Clicks every nav link, chat chip, chat card, work card and button, scrolls every page, and checks layout.
import { chromium, devices } from "playwright";
const BASE = process.env.BASE_URL || "http://localhost:3000";
let passN = 0; const fails = [];

const browser = await chromium.launch();
const profiles = {
  desktop: { viewport: { width: 1280, height: 900 } },
  mobile: { ...devices["iPhone 13"], defaultBrowserType: undefined },
  "reduced-motion": { viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" },
};

for (const [name, opts] of Object.entries(profiles)) {
  console.log(`\n=== ${name} ===`);
  const ctx = await browser.newContext(opts);
  const errors = [];
  ctx.on("page", (p) => {
    p.on("pageerror", (e) => errors.push(`${p.url()} ${e.message}`));
    p.on("console", (m) => { if (m.type() === "error" && !/favicon|Failed to load resource.*(mp4|video)/i.test(m.text())) errors.push(`${p.url()} ${m.text()}`); });
  });
  const page = await ctx.newPage();
  const mobile = name === "mobile", reduced = name === "reduced-motion";
  const tap = (loc) => (mobile ? loc.tap() : loc.click());
  const step = async (n, fn) => {
    try { await fn(); passN++; console.log("  ✓", n); }
    catch (e) { fails.push(`[${name}] ${n}: ${e.message.split("\n")[0]}`); console.log("  ✗", n, "-", e.message.split("\n")[0]); }
  };
  const status = async (u) => (await ctx.request.get(new URL(u, BASE).href)).status();
  const noOverflow = async (p, label) => {
    const [sw, iw] = await p.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
    if (sw > iw + 1) throw new Error(`${label}: page is ${sw}px wide in a ${iw}px window (sideways scroll)`);
  };
  const scrollAll = async (p) => {
    const h = await p.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y <= h; y += 400) { await p.mouse.wheel(0, 400).catch(() => p.evaluate((d) => scrollBy(0, d), 400)); await p.waitForTimeout(60); }
    await p.waitForTimeout(400);
  };
  const home = async () => { await page.goto(BASE, { waitUntil: "networkidle" }); };

  // ---- Home: load, scroll, layout
  await home();
  await step("home loads with title", async () => { if (!(await page.title())) throw new Error("no title"); });
  await step("no sideways scroll on home", () => noOverflow(page, "home"));
  await step("intro loader clears and the hero is fully shown", async () => {
    await page.waitForTimeout(3500);
    const s = await page.evaluate(() => {
      const l = document.querySelector(".loader");
      const vis = (e) => +getComputedStyle(e).opacity > 0.98;
      return { loader: l ? getComputedStyle(l).display : "none", hero: [...document.querySelectorAll("[data-h]")].every(vis), words: [...document.querySelectorAll("[data-hwords] .wi")].every((w) => Math.abs(new DOMMatrix(getComputedStyle(w).transform).f) < 1) };
    });
    if (s.loader !== "none") throw new Error("loader still showing");
    if (!s.hero || !s.words) throw new Error("hero content not fully shown");
  });
  await step("scrolling reveals every section's content", async () => {
    await scrollAll(page); await page.waitForTimeout(1800);
    const hidden = await page.evaluate(() => {
      const els = [...document.querySelectorAll("[data-a='up'], [data-a='stagger'] > *, [data-a='pop'] > *, .band h2")];
      const bad = els.filter((e) => +getComputedStyle(e).opacity < 0.98).map((e) => e.className || e.tagName);
      const words = [...document.querySelectorAll("[data-a='words'] .wi")].filter((w) => new DOMMatrix(getComputedStyle(w).transform).f > 1).length;
      const clip = [...document.querySelectorAll("[data-a='clip']")].filter((e) => !/inset\(0(px|%)? /.test(getComputedStyle(e).clipPath) && getComputedStyle(e).clipPath !== "none").length;
      return { bad, words, clip };
    });
    if (hidden.bad.length || hidden.words || hidden.clip) throw new Error(`still hidden: ${hidden.bad.length} blocks ${JSON.stringify(hidden.bad.slice(0, 4))}, ${hidden.words} words, ${hidden.clip} photos`);
  });
  await step("numbers count up to their real values", async () => {
    const t = await page.locator(".stat b").allInnerTexts();
    if (t.join("|") !== "3+|5%|4 → 66|25 Mn+") throw new Error(t.join("|"));
  });
  await step(reduced ? "reduced motion: nothing animates, smooth scroll is off" : "header tightens after scrolling", async () => {
    const s = await page.evaluate(() => ({ motion: document.documentElement.classList.contains("motion"), lenis: !!window.__lenis, scrolled: document.querySelector(".hdr").classList.contains("scrolled") }));
    if (reduced ? (s.motion || s.lenis) : !s.scrolled) throw new Error(JSON.stringify(s));
  });
  await step("four section bars, in order", async () => {
    const t = await page.locator(".band h2").allInnerTexts();
    if (t.join(",") !== "Works,About,CV,Contact") throw new Error(t.join(","));
  });
  await step("no purple or teal left in the page styles", async () => {
    const css = await page.evaluate(() => [...document.styleSheets].flatMap((s) => { try { return [...s.cssRules].map((r) => r.cssText); } catch { return []; } }).join(" "));
    if (/4f46e5|6366f1|0f766e|14917f|rgb\(79, 70, 229\)|rgb\(99, 102, 241\)|rgb\(15, 118, 110\)/i.test(css)) throw new Error("old colour found");
  });

  // ---- Navigation
  const navLabels = mobile ? ["Works", "About", "CV", "Contact"] : ["Ask Prannav", "Works", "About", "CV", "Contact"];
  for (const label of navLabels) {
    await step(`nav "${label}" scrolls to its section`, async () => {
      await home();
      const link = page.locator(".nav a").filter({ hasText: new RegExp(`^${label}$`) }).first();
      if (!(await link.isVisible())) throw new Error("link not visible");
      const id = (await link.getAttribute("href")).split("#")[1];
      await page.evaluate(() => (window.__lenis ? window.__lenis.scrollTo(document.body.scrollHeight, { immediate: true }) : window.scrollTo(0, document.body.scrollHeight)));
      await page.waitForTimeout(500);
      await tap(link);
      let top = NaN, prev;  // wait for the smooth scroll to come to rest
      for (let i = 0; i < 24 && top !== prev; i++) { prev = top; await page.waitForTimeout(250); top = Math.round(await page.evaluate((i) => document.getElementById(i).getBoundingClientRect().top, id)); }
      const want = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop));
      const hdrBottom = await page.evaluate(() => document.querySelector(".hdr-pill").getBoundingClientRect().bottom);
      if (id === "ask") { const y = await page.evaluate(() => scrollY); if (y > 2) throw new Error(`did not return to top (scrollY ${y})`); return; }
      if (Math.abs(top - want) > 6 && !(id === "contact" && top < 900)) throw new Error(`#${id} top at ${top}px, expected ${want}px`);
      if (top < hdrBottom - 1 && id !== "ask") throw new Error(`#${id} starts under the header`);
    });
  }
  await step("logo returns to home", async () => {
    await page.goto(BASE + "/cv", { waitUntil: "networkidle" });
    await tap(page.locator(".hdr a").first()); await page.waitForURL(BASE + "/");
  });

  // ---- Chat: every starter chip, answer opens at its first line
  await home();
  const chipCount = await page.locator(".chip").count();
  for (let i = 0; i < chipCount; i++) {
    await home();
    const chip = page.locator(".chip").nth(i); const q = await chip.innerText();
    await step(`chat chip: "${q}"`, async () => {
      await tap(chip);
      const ans = page.locator(".msg.a").last();
      await page.waitForFunction(() => { const a = [...document.querySelectorAll(".msg.a")].pop(); return a && !a.querySelector(".dots"); }, null, { timeout: 20000 });
      await page.waitForTimeout(700);
      const text = await ans.innerText();
      if (/don't have that/i.test(text)) throw new Error("got the fallback answer");
      const { boxTop, ansTop, vh } = await page.evaluate(() => {
        const b = document.querySelector(".msgs"), a = [...document.querySelectorAll(".msg.a")].pop();
        return { boxTop: b.getBoundingClientRect().top, ansTop: a.getBoundingClientRect().top, vh: innerHeight };
      });
      if (ansTop < boxTop - 2) throw new Error(`answer starts ${Math.round(boxTop - ansTop)}px above the chat window`);
      if (ansTop < 60 || ansTop > vh - 80) throw new Error(`answer start is off-screen (top ${Math.round(ansTop)}px)`);
    });
  }
  await step("typed questions: CV, follow-up, out-of-scope", async () => {
    await home();
    const ask = async (q) => {
      const n = await page.locator(".msg.a").count();
      await page.locator(".inrow input").fill(q); await tap(page.locator(".send"));
      await page.waitForFunction((n) => { const a = document.querySelectorAll(".msg.a"); return a.length > n && !a[a.length - 1].querySelector(".dots"); }, n, { timeout: 20000 });
      await page.waitForTimeout(600);
      return page.locator(".msg.a").last();
    };
    let a = await ask("Is Prannav's CV available?");
    if (!/CV/.test(await a.innerText())) throw new Error("CV question not answered");
    if ((await a.locator(".mini").count()) !== 2) throw new Error("CV buttons missing");
    a = await ask("What is his notice period?");
    if (!/2 months/.test(await a.innerText())) throw new Error("notice period wrong");
    const top = await a.evaluate((el) => el.getBoundingClientRect().top - el.closest(".msgs").getBoundingClientRect().top);
    if (top < -2) throw new Error("third answer opened scrolled past its start");
    a = await ask("What's his favourite movie?");
    if (!/don't have that/i.test(await a.innerText())) throw new Error("should admit it doesn't know");
  });
  await step("send button disabled when input is empty", async () => {
    await home(); if (!(await page.locator(".send").isDisabled())) throw new Error("enabled");
  });
  await step("chat answer cards open the right pages", async () => {
    await home();
    await tap(page.locator(".chip").first());
    await page.locator(".msg.a .mini").first().waitFor({ timeout: 20000 });
    for (const h of await page.locator(".msg.a .mini").evaluateAll((a) => a.map((x) => x.getAttribute("href"))))
      if ((await status(h)) !== 200) throw new Error(`${h} broken`);
    const [pop] = await Promise.all([ctx.waitForEvent("page"), tap(page.locator(".msg.a .mini").first())]);
    await pop.waitForLoadState(); if (!/\/works\//.test(pop.url())) throw new Error(pop.url()); await pop.close();
  });

  // ---- Works
  await home();
  if (name === "desktop") await step("'View' badge appears over a work card", async () => {
    await page.waitForTimeout(3500);
    const card = page.locator(".grid a.work").first(); await card.scrollIntoViewIfNeeded(); await page.waitForTimeout(1500);
    const bb = await card.boundingBox(); await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 3, { steps: 6 }); await page.waitForTimeout(700);
    const sc = await page.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector(".vbadge")).transform).a);
    if (sc < 0.9) throw new Error(`badge scale ${sc}`);
    await page.mouse.move(5, 5); 
  });
  await step("featured: 'Try the live app' points to lets-match.com", async () => {
    const h = await page.locator(".feat a.btn.acc").getAttribute("href"); if (!h.includes("lets-match.com")) throw new Error(h);
  });
  await step("featured: 'How it works' opens the Let's Match page", async () => {
    const [pop] = await Promise.all([ctx.waitForEvent("page"), tap(page.locator(".feat a.btn:not(.acc)"))]);
    await pop.waitForLoadState("networkidle"); if (!pop.url().endsWith("/works/lets-match")) throw new Error(pop.url()); await pop.close();
  });
  const cards = await page.locator(".grid a.work").evaluateAll((a) => a.map((x) => x.getAttribute("href")));
  await step("five prototype cards", async () => { if (cards.length !== 5) throw new Error(cards.length); });
  for (const h of ["/works/lets-match", ...cards]) {
    await step(`work page ${h}: buttons, chat, links, scroll`, async () => {
      let w;
      if (h === "/works/lets-match") { w = await ctx.newPage(); await w.goto(BASE + h, { waitUntil: "networkidle" }); }
      else { await home(); [w] = await Promise.all([ctx.waitForEvent("page"), tap(page.locator(`.grid a.work[href='${h}']`))]); await w.waitForLoadState("networkidle"); }
      await noOverflow(w, h);
      const open = await w.locator("a.btn.acc").getAttribute("href");
      if (!open.startsWith("http") && (await status(open)) !== 200) throw new Error(`${open} broken`);
      const v = await w.locator(".frame video").evaluate((el) => new Promise((r) => { if (el.readyState >= 2) r(true); el.onloadeddata = () => r(true); el.onerror = () => r(false); setTimeout(() => r(el.readyState >= 1), 8000); }));
      if (!v) throw new Error("demo video did not load");
      await w.locator(".chip").first().click();
      await w.waitForFunction(() => { const a = [...document.querySelectorAll(".msg.a")].pop(); return a && !a.querySelector(".dots"); }, null, { timeout: 20000 });
      if (/don't have that/i.test(await w.locator(".msg.a").last().innerText())) throw new Error("work chat gave fallback");
      for (const l of await w.locator("a[href^='/']").evaluateAll((a) => [...new Set(a.map((x) => x.getAttribute("href")))]))
        if (!l.includes("#") && (await status(l)) !== 200) throw new Error(`broken link ${l}`);
      await w.locator(".mini").last().click(); await w.waitForURL(/\/works\//);
      await w.locator(".back").click(); await w.waitForURL(/\/#works$/);
      await w.close();
    });
  }

  // ---- CV and contact
  await home();
  await step("'View CV' opens the CV page with the PDF", async () => {
    const [pop] = await Promise.all([ctx.waitForEvent("page"), tap(page.locator("#cv a.btn.pri"))]);
    await pop.waitForLoadState(); if (!pop.url().endsWith("/cv")) throw new Error(pop.url());
    if (!(await pop.locator("iframe.cvview").count())) throw new Error("no viewer");
    await noOverflow(pop, "/cv");
    await pop.locator(".back").click(); await pop.waitForURL(/\/#cv$/); await pop.close();
  });
  await step("'Download PDF' serves a PDF", async () => {
    const r = await ctx.request.get(BASE + (await page.locator("#cv a[download]").getAttribute("href")));
    if (r.status() !== 200 || !/pdf/.test(r.headers()["content-type"])) throw new Error(`${r.status()} ${r.headers()["content-type"]}`);
  });
  await step("contact links: email, phone, LinkedIn", async () => {
    const h = await page.locator(".contact a").evaluateAll((a) => a.map((x) => x.getAttribute("href")));
    if (!h[0].startsWith("mailto:prannavb27@") || !h[1].startsWith("tel:+91") || !h[2].includes("linkedin.com/in/prannavkb")) throw new Error(h.join(" "));
  });

  // ---- Other pages
  await step("/admin shows a sign-in form; a wrong key is rejected", async () => {
    await page.goto(BASE + "/admin"); await page.locator("input[type=password]").fill("wrong-key");
    await tap(page.locator("form .send")); await page.waitForURL(/\/admin/);
    await page.waitForTimeout(400); if (await page.locator("text=Questions asked").count()) throw new Error("got in with a wrong key");
    await noOverflow(page, "/admin");
  });
  await step("robots.txt, share card, favicon load", async () => {
    for (const u of ["/robots.txt", "/opengraph-image.jpg", "/twitter-image.jpg", "/icon.png"]) if ((await status(u)) !== 200) throw new Error(u);
  });
  await step("unknown page gives 404", async () => { if ((await status("/works/nope")) !== 404) throw new Error("not 404"); });
  await step("no console or page errors", async () => { if (errors.length) throw new Error(errors.slice(0, 3).join(" | ")); });
  await ctx.close();
}
await browser.close();
console.log(`\n${passN} passed, ${fails.length} failed`); fails.forEach((f) => console.log("  ✗", f));
process.exit(fails.length ? 1 : 0);
