export type Project = {
  slug: string; name: string; kind: "Live app" | "Prototype"; domain: string;
  tagline: string; problem: string; solution: string; points: string[];
  note?: string; media: string; shot: string; href: string; external?: boolean; portrait?: boolean;
};

export const projects: Project[] = [
  {
    slug: "lets-match", name: "Let's Match", kind: "Live app", domain: "Consumer · Entertainment",
    tagline: "Helps a group or a couple decide what to watch, in minutes.",
    problem: "Deciding what to watch takes longer with every extra person. Everyone scrolls, suggests, vetoes and negotiates.",
    solution: "Everyone reacts to the same small set of titles on their own phone, so the group's overlap shows up quickly instead of through negotiation.",
    points: [
      "The host creates a session and shares a QR code, link or code. No sign-up or download.",
      "Each person picks up to two vibes in under 90 seconds, then swipes 10 titles filtered to their streaming services and languages.",
      "The app shows the group's top 3, ranked by how many people liked each, and offers 10 more if nobody agrees.",
      "Separate Friends and Couples pages. Works remotely too.",
    ],
    note: "Live and in testing. Many people are using it and sending constant feedback. Built on Next.js with Claude Code. Title data from TMDB, where-to-watch from JustWatch, availability from the Streaming Availability API by Movie of the Night.",
    media: "/media/lets-match.mp4", shot: "/shots/lets-match.jpg", href: "https://lets-match.com/", external: true, portrait: true,
  },
  {
    slug: "helix-ai", name: "Helix AI", kind: "Prototype", domain: "Customer operations",
    tagline: "A customer experience OS where the work and the intelligence sit together.",
    problem: "Support leaders find SLA breaches, escalations and quality issues after the damage is done.",
    solution: "Helix puts the work and the intelligence in one place, so problems are investigated and escalated from the same screen.",
    points: [
      "Overview, Tickets, Unified Inbox, Customers, AI Insights, Analytics, Agent Coaching, Automations, Team and Agents, Settings.",
      "An Ask Helix assistant for questions about the operation.",
    ],
    media: "/media/helix-ai.mp4", shot: "/shots/helix-ai.png", href: "/prototypes/Helix_AI_Customer_Operations.html",
  },
  {
    slug: "revora-ai", name: "Revora AI", kind: "Prototype", domain: "Billing and revenue operations",
    tagline: "Finds revenue that leaks between contract, invoice, payment and collection.",
    problem: "Revenue leaks quietly between contract, invoice, payment and collection. Finance finds it at month-end reconciliation, when recovery is hardest.",
    solution: "Revora covers customers, subscriptions, invoicing, payments and collections, with a Revenue Leakage Monitor and AI Revenue Insights, so a recommendation becomes an owned task.",
    points: [
      "16 modules, from Customers through Reconciliation to Settings.",
      "Workflows and approvals turn each finding into an owned, trackable action.",
    ],
    media: "/media/revora-ai.mp4", shot: "/shots/revora-ai.png", href: "/prototypes/Revora_AI_Revenue_Operations.html",
  },
  {
    slug: "performance-ai", name: "Performance AI", kind: "Prototype", domain: "Marketing",
    tagline: "A daily brief of the decisions a performance marketer needs to make.",
    problem: "Marketers see spend, leads and CTR, but what matters is cost per revenue outcome, and the funnel leaks between lead and revenue.",
    solution: "A daily brief of decisions needed, backed by diagnosis across the full funnel, campaign, city and platform, plus a forecast of cost per revenue outcome with a what-if.",
    points: [
      "Five views: Brief, Diagnose, Forecast, Guardrails, Settings.",
      "Guardrails set what the AI can act on, what goes to a review queue, and what is only logged.",
      "Shown for a fictional lender, Meridian Capital Finance, where the outcome is a loan disbursal.",
    ],
    media: "/media/performance-ai.mp4", shot: "/shots/performance-ai.png", href: "/prototypes/Performance_AI_Meridian.html",
  },
  {
    slug: "comply", name: "Comply", kind: "Prototype", domain: "Compliance",
    tagline: "One traceable chain from regulation to obligation to control to remediation.",
    problem: "Regulatory change, controls and evidence live in different places, so nobody can quickly say which obligation, control and owner a new regulation affects.",
    solution: "A single chain from regulation to obligation to control to finding to remediation, sitting on top of the tools a team already uses.",
    points: [
      "Works with existing tools (Vanta, Okta, AWS Config, Jira, Slack) instead of replacing them.",
      "Every exception carries an expiry and a compensating control. Evidence is shown as current or stale.",
      "Six modules: Command Centre, Regulatory Register, Controls and Ownership, Exceptions and Remediation, Audit Workspace, Settings.",
      "Shown for a fictional NBFC.",
    ],
    media: "/media/comply.mp4", shot: "/shots/comply.png", href: "/prototypes/Comply_Compliance_Operating_Layer.html",
  },
  {
    slug: "peopleos", name: "PeopleOS", kind: "Prototype", domain: "HR and talent",
    tagline: "Talent intelligence where skills are the thread across every module.",
    problem: "HR systems store records, but decisions on hiring, mobility, development and succession depend on knowing who can do what.",
    solution: "Skills run through every module, with explainable skill matches, People Signals leaders can act on, and a Copilot for workforce questions.",
    points: [
      "20 views, including Employee 360, a Skills Intelligence heatmap, a Talent Marketplace, Succession and Workforce Planning.",
    ],
    media: "/media/peopleos.mp4", shot: "/shots/peopleos.png", href: "/prototypes/PeopleOS_Talent_Intelligence.html",
  },
];

export const bySlug = (s: string) => projects.find((p) => p.slug === s);
