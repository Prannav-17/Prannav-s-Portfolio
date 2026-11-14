// Phase 1: drive each prototype through its story, screenshot every state at 2x, and record element boxes.
// Writes <out>/<slug>/*.png and <out>/<slug>/spec.json for render.py. Usage: node capture.mjs <baseUrl> <outDir> [slug]
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const [BASE, OUT, ONLY] = process.argv.slice(2);
const W = 1440, TALL = 2400;
const browser = await chromium.launch();

// 16:10 camera rect around a box, padded, clamped to the image
function cam(r, img, pad = 40, minW = 520) {
  let x = r.x - pad, y = r.y - pad, w = r.w + pad * 2, h = r.h + pad * 2;
  if (w < minW) { x -= (minW - w) / 2; w = minW; }
  if (w / h > 1.6) { const nh = w / 1.6; y -= (nh - h) / 2; h = nh; } else { const nw = h * 1.6; x -= (nw - w) / 2; w = nw; }
  if (w > img.w) { w = img.w; h = w / 1.6; }
  if (h > img.h) { h = img.h; w = h * 1.6; }
  x = Math.max(0, Math.min(x, img.w - w)); y = Math.max(0, Math.min(y, img.h - h));
  return [Math.round(x), Math.round(y), Math.round(w), Math.round(h)];
}
const full = (img, y = 0) => [0, Math.max(0, Math.min(y, img.h - 900)), 1440, 900];
const union = (...rs) => { const x = Math.min(...rs.map((r) => r.x)), y = Math.min(...rs.map((r) => r.y)); return { x, y, w: Math.max(...rs.map((r) => r.x + r.w)) - x, h: Math.max(...rs.map((r) => r.y + r.h)) - y }; };
const mid = (r) => [Math.round(r.x + r.w / 2), Math.round(r.y + r.h / 2)];

async function story(slug, file, fn) {
  if (ONLY && ONLY !== slug) return;
  const dir = path.join(OUT, slug); fs.mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: W, height: TALL }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/prototypes/${file}.html`, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  const scenes = []; let n = 0;
  const box = async (loc) => { const b = await loc.first().boundingBox(); if (!b) throw new Error(`${slug}: no box for ${loc}`); return { x: b.x, y: b.y, w: b.width, h: b.height }; };
  // Screenshot the current state. "tall" shows the whole page in one image so the camera can glide down it.
  const snap = async ({ tall = true, reveal } = {}) => {
    if (!tall) {
      await page.setViewportSize({ width: W, height: 900 });
      if (reveal) await reveal.first().evaluate((e) => e.scrollIntoView({ block: "center" }));
    }
    await page.waitForTimeout(650);
    let h = 900;
    if (tall) h = await page.evaluate(() => Math.min(2400, Math.max(900, ...[...document.querySelectorAll("body *")].filter((e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.height > 0 && r.width > 0 && s.visibility !== "hidden" && s.position !== "fixed"; }).map((e) => Math.ceil(e.getBoundingClientRect().bottom)))));
    const img = `s${++n}.png`;
    await page.screenshot({ path: path.join(dir, img), clip: { x: 0, y: 0, width: W, height: h } });
    return { img, w: W, h };
  };
  const tallAgain = () => page.setViewportSize({ width: W, height: TALL });
  await fn({ page, box, snap, scenes, tallAgain });
  fs.writeFileSync(path.join(dir, "spec.json"), JSON.stringify({ slug, scenes }, null, 1));
  console.log(slug, scenes.length, "scenes,", scenes.reduce((a, s) => a + s.dur, 0).toFixed(1), "s");
  await ctx.close();
}

// ---------------- Helix AI
await story("helix-ai", "Helix_AI_Customer_Operations", async ({ page, box, snap, scenes, tallAgain }) => {
  const img1 = await snap();
  const att = union(await box(page.getByText("What needs your attention today?")), await box(page.getByRole("button", { name: "Investigate issue" })));
  const inv = await box(page.getByRole("button", { name: "Investigate issue" }));
  scenes.push({ ...img1, cap: "Helix flags what needs attention", dur: 3.4,
    cam: [[0, full(img1)], [0.5, full(img1)], [1.7, cam(att, img1, 60, 900)]], cur: [[0, 1180, 640], [1.8, 1100, 600], [2.8, ...mid(inv)]], click: [3.0] });
  await page.getByRole("button", { name: "Investigate issue" }).first().click();
  const img2 = await snap();
  const why = union(await box(page.getByText("What happened", { exact: true })), await box(page.getByText("Who is affected", { exact: true })));
  const esc = page.getByRole("button", { name: "Create escalation" });
  const act = union(await box(page.getByText("Take action", { exact: true })), await box(page.getByRole("button", { name: "Dismiss insight" })));
  scenes.push({ ...img2, cap: "Root cause, evidence, impact", dur: 3.0,
    cam: [[0, full(img2)], [0.4, full(img2)], [1.6, cam(union(why, { ...why, h: why.h + 140 }), img2, 50, 900)]], cur: [[0, ...mid(inv)], [1.5, 640, 520]] });
  scenes.push({ ...img2, cap: "Act in one click", dur: 2.6,
    cam: [[0, cam(union(why, { ...why, h: why.h + 140 }), img2, 50, 900)], [1.2, cam(act, img2, 70, 640)]], cur: [[0, 640, 520], [1.5, ...mid(await box(esc))]], click: [1.9] });
  await esc.first().click();
  const img3 = await snap({ tall: false, reveal: page.getByText("Take action", { exact: true }) });
  const toast = await box(page.getByText("Escalation created", { exact: true }));
  const act2 = await box(page.getByText("Take action", { exact: true }));
  scenes.push({ ...img3, cap: "Escalation created and logged", dur: 3.0,
    cam: [[0, cam(union(act2, toast), img3, 60, 760)], [3, cam(union(act2, toast), img3, 40, 720)]], cur: [[0, toast.x - 60, toast.y - 40]] });
  await tallAgain();
});

// ---------------- Revora AI
await story("revora-ai", "Revora_AI_Revenue_Operations", async ({ page, box, snap, scenes }) => {
  const img1 = await snap();
  const kpis = union(await box(page.getByText("MRR", { exact: true }).locator("xpath=ancestor-or-self::*[@onclick][1]")), await box(page.getByText("Revenue Leakage", { exact: true }).locator("xpath=ancestor-or-self::*[@onclick][1]")));
  const leak = await box(page.getByText("Revenue Leakage", { exact: true }).locator("xpath=ancestor-or-self::*[@onclick][1]"));
  scenes.push({ ...img1, cap: "Revenue, collections and leakage in one view", dur: 3.6,
    cam: [[0, full(img1)], [0.5, full(img1)], [1.7, cam(kpis, img1, 40, 900)]], cur: [[0, 700, 700], [2.0, 900, 420], [3.0, ...mid(leak)]], click: [3.2] });
  await page.evaluate(() => navigate("leakage"));
  const img2 = await snap();
  const row = page.locator("tr", { hasText: "ANOM-113" });
  const reg = union(await box(page.getByText("Leakage register", { exact: true })), await box(page.locator("tr", { hasText: "ANOM-105" })));
  scenes.push({ ...img2, cap: "Revenue Leakage Monitor", dur: 2.6,
    cam: [[0, full(img2)], [0.4, full(img2)], [1.8, cam(union(await box(page.getByText("Total identified", { exact: true })), reg), img2, 40, 1100)]], cur: [[0, ...mid(leak)], [2.0, 760, 560]] });
  scenes.push({ ...img2, cap: "Open an anomaly", dur: 2.4,
    cam: [[0, cam(union(await box(page.getByText("Total identified", { exact: true })), reg), img2, 40, 1100)], [1.2, cam(reg, img2, 40, 900)]], cur: [[0, 760, 560], [1.5, ...mid(await box(row))]], click: [1.9] });
  await row.first().click();
  const img3 = await snap();
  const rc = union(await box(page.getByText("Root cause & evidence", { exact: true })), await box(page.getByRole("button", { name: "Approve correction" })));
  scenes.push({ ...img3, cap: "Root cause and corrective action", dur: 3.4,
    cam: [[0, full(img3)], [0.4, full(img3)], [1.8, cam(rc, img3, 50, 900)]], cur: [[0, 700, 500], [2.4, ...mid(await box(page.getByRole("button", { name: "Approve correction" })))]] });
});

// ---------------- Performance AI
await story("performance-ai", "Performance_AI_Meridian", async ({ page, box, snap, scenes }) => {
  const nav = (t) => page.getByRole("button", { name: t, exact: true });
  const img1 = await snap();
  const brief = union(await box(page.getByText(/^Blended cost per disbursal is/)), await box(page.getByText(/Unmatched disbursal share/).locator("xpath=ancestor::button[1]")));
  scenes.push({ ...img1, cap: "Daily brief: what needs a decision", dur: 3.4,
    cam: [[0, full(img1)], [0.5, full(img1)], [1.7, cam(brief, img1, 40, 900)]], cur: [[0, 900, 700], [2.0, 600, 300], [3.0, ...mid(await box(nav("Diagnose")))]], click: [3.2] });
  await nav("Diagnose").first().click();
  const img2 = await snap();
  const funnel = await box(page.getByText("Full funnel", { exact: true }).locator("xpath=ancestor::div[contains(concat(' ',normalize-space(@class),' '),' card ')][1]"));
  scenes.push({ ...img2, cap: "Diagnose the funnel", dur: 3.4,
    cam: [[0, full(img2)], [0.4, full(img2)], [1.8, cam(funnel, img2, 40, 900)]], cur: [[0, ...mid(await box(nav("Diagnose")))], [2.2, 900, 600], [3.0, ...mid(await box(nav("Forecast")))]], click: [3.2] });
  await nav("Forecast").first().click();
  const img3 = await snap();
  const chart = await box(page.getByText(/^Cost per disbursal, projected/).locator("xpath=ancestor::div[contains(concat(' ',normalize-space(@class),' '),' card ')][1]"));
  const rebal = await box(page.getByText(/^Rebalance budget/));
  scenes.push({ ...img3, cap: "Forecast cost per outcome", dur: 3.8,
    cam: [[0, full(img3)], [0.4, full(img3)], [1.6, cam(chart, img3, 40, 900)], [3.8, cam(union(chart, rebal), img3, 40, 900)]], cur: [[0, ...mid(await box(nav("Forecast")))], [2.0, 900, 520]] });
});

// ---------------- Comply
await story("comply", "Comply_Compliance_Operating_Layer", async ({ page, box, snap, scenes, tallAgain }) => {
  const img1 = await snap();
  const kpi = union(await box(page.getByText("Compliance posture", { exact: true })), await box(page.getByText("Regulatory changes pending", { exact: true })));
  const regNav = page.getByText("Regulatory Register", { exact: true });
  scenes.push({ ...img1, cap: "3 regulatory changes pending", dur: 3.2,
    cam: [[0, full(img1)], [0.5, full(img1)], [1.6, cam({ ...kpi, h: kpi.h + 110 }, img1, 40, 900)]], cur: [[0, 900, 600], [1.9, 1100, 230], [2.8, ...mid(await box(regNav))]], click: [3.0] });
  await regNav.first().click();
  const img2 = await snap();
  const row = page.getByText("RBI Digital Lending, Key Fact Statement disclosures, update", { exact: true });
  const table = union(await box(page.getByText("Incoming regulatory changes", { exact: true })), await box(page.getByText("EU AI Act — High-Risk AI System Classification")));
  scenes.push({ ...img2, cap: "Review a new regulation", dur: 2.8,
    cam: [[0, full(img2)], [0.4, full(img2)], [1.5, cam(table, img2, 40, 900)]], cur: [[0, ...mid(await box(regNav))], [1.9, ...mid(await box(row))]], click: [2.3] });
  await row.first().click();
  const img3 = await snap();
  const conf = page.getByRole("button", { name: "Confirm applicability" });
  const drawer = union(await box(page.getByText("REGULATORY CHANGE", { exact: true }).or(page.getByText("Regulatory change", { exact: true }))), await box(conf));
  scenes.push({ ...img3, cap: "Confirm applicability", dur: 2.8,
    cam: [[0, cam(table, img3, 40, 900)], [1.2, cam(drawer, img3, 50, 700)]], cur: [[0, ...mid(await box(row))], [1.6, ...mid(await box(conf))]], click: [2.0] });
  await conf.first().click();
  const img4 = await snap({ tall: false });
  const toast = await box(page.getByText(/^Applicability confirmed/));
  const ccNav = page.getByText("Command Centre", { exact: true }).first();
  scenes.push({ ...img4, cap: "Change confirmed and a control drafted", dur: 2.6,
    cam: [[0, cam(toast, img4, 120, 900)], [2.6, full(img4)]], cur: [[0, toast.x + toast.w / 2, toast.y - 40], [1.6, ...mid(await box(ccNav))]], click: [2.0] });
  await tallAgain();
  await ccNav.click();
  const img5 = await snap();
  const kpi2 = union(await box(page.getByText("Compliance posture", { exact: true })), await box(page.getByText("Regulatory changes pending", { exact: true })));
  const changed = await box(page.getByText("What changed", { exact: true }));
  scenes.push({ ...img5, cap: "Pending now 2, and the change is logged", dur: 3.6,
    cam: [[0, full(img5)], [0.4, full(img5)], [1.4, cam({ ...kpi2, h: kpi2.h + 110 }, img5, 40, 900)], [3.4, cam({ ...changed, w: 900, h: 260 }, img5, 40, 900)]], cur: [[0, ...mid(await box(ccNav))], [1.6, 1200, 300]] });
});

// ---------------- PeopleOS
await story("peopleos", "PeopleOS_Talent_Intelligence", async ({ page, box, snap, scenes }) => {
  const bu = page.getByRole("button", { name: "All business units" });
  const img1 = await snap();
  const filters = union(await box(page.getByRole("button", { name: "Last 90 days" })), await box(page.getByRole("button", { name: "Ask about your workforce" })));
  const head = union(filters, await box(page.getByText("Your people, in perspective.")));
  scenes.push({ ...img1, cap: "Scope by business unit", dur: 2.8,
    cam: [[0, full(img1)], [0.5, full(img1)], [1.6, cam({ ...head, h: head.h + 260 }, img1, 40, 900)]], cur: [[0, 800, 600], [2.2, ...mid(await box(bu))]], click: [2.5] });
  await bu.first().click();
  const img2 = await snap();
  const eng = page.getByText("Engineering", { exact: true }).first();
  const menu = await box(eng);
  scenes.push({ ...img2, cap: "Scope by business unit", dur: 1.8, cont: true,
    cam: [[0, cam({ ...head, h: head.h + 260 }, img2, 40, 900)], [1.0, cam({ x: menu.x - 40, y: menu.y - 80, w: 420, h: 360 }, img2, 30, 760)]], cur: [[0, ...mid(await box(bu))], [1.2, ...mid(menu)]], click: [1.5] });
  await eng.click();
  const img3 = await snap();
  const kpis = union(await box(page.getByText("Total employees", { exact: true })), await box(page.getByText("Average tenure", { exact: true })));
  scenes.push({ ...img3, cap: "Every figure re-scopes, compared to the org", dur: 3.4,
    cam: [[0, cam({ x: menu.x - 40, y: menu.y - 80, w: 420, h: 360 }, img3, 30, 760)], [1.4, cam({ ...kpis, w: kpis.w + 260 }, img3, 50, 900)]], cur: [[0, ...mid(menu)], [2.0, 900, 520]] });
  await page.evaluate(() => navigate("skills"));
  const img4 = await snap();
  const heat = await box(page.getByText("Skills coverage heatmap", { exact: true }));
  scenes.push({ ...img4, cap: "Skills coverage heatmap", dur: 3.8,
    cam: [[0, full(img4)], [0.4, full(img4)], [1.6, cam({ ...heat, w: 1000, h: 520 }, img4, 30, 900)], [3.8, cam({ x: heat.x + 300, y: heat.y + 60, w: 1000, h: 520 }, img4, 30, 900)]], cur: [[0, 900, 520]] });
});

await browser.close();
