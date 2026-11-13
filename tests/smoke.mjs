// Click-through smoke test. Usage: npm test   (BASE_URL defaults to http://localhost:3000)
import { chromium } from "playwright";
const BASE = process.env.BASE_URL || "http://localhost:3000";
const fails = [], pass = [];
const ok = (n) => { pass.push(n); console.log("  ✓", n); };
const bad = (n, e) => { fails.push(n); console.log("  ✗", n, "-", e?.message || e || ""); };
async function step(n, fn) { try { await fn(); ok(n); } catch (e) { bad(n, e); } }

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const errors = [];
ctx.on("page", (p) => {
  p.on("pageerror", (e) => errors.push(`${p.url()} ${e.message}`));
  p.on("console", (m) => { if (m.type() === "error" && !/favicon/.test(m.text())) errors.push(`${p.url()} ${m.text()}`); });
});
const page = await ctx.newPage();
const get = async (path) => (await ctx.request.get(new URL(path, BASE).href)).status();

console.log("Home page");
await page.goto(BASE, { waitUntil: "networkidle" });
await step("home loads", async () => { if (!(await page.title())) throw new Error("no title"); });
await step("no 'mockup' wording anywhere on home", async () => {
  if (/mock-?up/i.test(await page.locator("body").innerText())) throw new Error("found 'mockup'");
});

for (const label of ["Ask Prannav", "Works", "About", "CV"]) {
  await step(`nav: ${label}`, async () => {
    await page.locator("header a, .nav a").filter({ hasText: new RegExp(`^${label}$`) }).first().click();
    await page.waitForTimeout(400);
  });
}

const chips = await page.locator(".chip").count();
await step("starter chips exist", async () => { if (!chips) throw new Error("none"); });
for (let i = 0; i < chips; i++) {
  await step(`chat chip #${i + 1}`, async () => {
    await page.goto(BASE, { waitUntil: "networkidle" });
    const chip = page.locator(".chip").nth(i);
    await chip.click();
    await page.locator(".msg").nth(1).waitFor({ timeout: 20000 });
  });
}
await step("chat: type a question and press send", async () => {
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.locator(".inrow input").fill("Where did Prannav study?");
  await page.locator(".send").click();
  await page.locator(".msg").nth(1).waitFor({ timeout: 20000 });
});

console.log("Works");
await page.goto(BASE, { waitUntil: "networkidle" });
const hrefs = await page.locator("a[href^='/works/']").evaluateAll((a) => [...new Set(a.map((x) => x.getAttribute("href")))]);
await step("six works listed", async () => { if (hrefs.length !== 6) throw new Error(`found ${hrefs.length}`); });
await step("order: Helix and Revora right after Let's Match", async () => {
  const names = await page.locator(".grid .work h3").allInnerTexts();
  if (names[0] !== "Helix AI" || names[1] !== "Revora AI") throw new Error(names.join(", "));
});
for (const h of hrefs) {
  await step(`work page ${h}`, async () => {
    const [pop] = await Promise.all([ctx.waitForEvent("page"), page.locator(`a[href='${h}']`).first().click()]);
    await pop.waitForLoadState("networkidle");
    if (/mock-?up/i.test(await pop.locator("body").innerText())) throw new Error("found 'mockup'");
    const ext = await pop.locator("a.btn.acc").first().getAttribute("href");
    const s = ext.startsWith("http") ? 200 : await get(ext);
    if (s !== 200) throw new Error(`${ext} -> ${s}`);
    for (const l of await pop.locator("a[href^='/']").evaluateAll((a) => [...new Set(a.map((x) => x.getAttribute("href")))]))
      if (!l.startsWith("/#") && (await get(l)) >= 400) throw new Error(`broken link ${l}`);
    await pop.close();
  });
}
await step("live app button points to lets-match.com", async () => {
  const h = await page.locator("a.btn.acc").first().getAttribute("href");
  if (!h.includes("lets-match.com")) throw new Error(h);
});

console.log("CV and other links");
await step("CV page loads", async () => { const r = await page.goto(BASE + "/cv"); if (r.status() !== 200) throw new Error(r.status()); });
await step("CV PDF downloads", async () => { if ((await get("/Prannav_K_B_CV.pdf")) !== 200) throw new Error("404"); });
await step("API route responds", async () => {
  const r = await ctx.request.post(BASE + "/api/ask", { data: { q: "hello" } });
  if (r.status() >= 500) throw new Error(r.status());
});
await page.goto(BASE, { waitUntil: "networkidle" });
await step("all internal links resolve", async () => {
  const links = await page.locator("a[href^='/']").evaluateAll((a) => [...new Set(a.map((x) => x.getAttribute("href").split("#")[0]).filter(Boolean))]);
  for (const l of links) if ((await get(l)) >= 400) throw new Error(`broken: ${l}`);
});
await step("no console/page errors", async () => { if (errors.length) throw new Error(errors.slice(0, 3).join(" | ")); });

await browser.close();
console.log(`\n${pass.length} passed, ${fails.length} failed`);
process.exit(fails.length ? 1 : 0);
