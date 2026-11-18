export type Project = {
  slug: string; name: string; kind: "Live app" | "Prototype"; domain: string;
  tagline: string; problem: string; solution: string; points: string[];
  note?: string; different?: string;
  // Depth for prototypes: the pain, why existing tools miss it, how it solves it, and the judgment calls built in
  pain?: string; gap?: string; how?: string[]; decisions?: string[]; media: string; shot: string; cover?: string; href: string; external?: boolean; portrait?: boolean;
};

export const projects: Project[] = [
  {
    slug: "lets-match", name: "Let's Match", kind: "Live app", domain: "Consumer · Entertainment",
    tagline: "Helps a group or a couple decide what to watch, in minutes",
    problem: "Deciding what to watch takes longer with every extra person. Everyone scrolls, suggests, vetoes and negotiates",
    solution: "Everyone reacts to the same small set of titles on their own phone, so the group's overlap shows up quickly instead of through negotiation",
    points: [
      "The host creates a session and shares a QR code, link or code. No sign-up or download",
      "Each person picks up to two vibes in under 90 seconds, then swipes 10 titles filtered to their streaming services and languages",
      "The app shows the group's top 3, ranked by how many people liked each, and offers 10 more if nobody agrees",
      "Separate Friends and Couples pages. Works remotely too",
    ],
    different: "No app or sign-up, built for Indian services and 32 languages, and the group always gets a ranked top 3 in about two minutes, even when not everyone agrees",
    note: "Live and in testing. Many people are using it and sending constant feedback. Built on Next.js with Claude Code. Title data from TMDB, where-to-watch from JustWatch, availability from the Streaming Availability API by Movie of the Night",
    media: "/media/lets-match.mp4", shot: "/shots/lets-match.jpg", href: "https://lets-match.com/", external: true, portrait: true,
  },
  {
    slug: "helix-ai", name: "Helix", kind: "Prototype", domain: "Customer operations",
    tagline: "Turns a support team's tickets into a short list of problems, each with an owner",
    problem: "Support leads find out what went wrong after customers have already felt it",
    solution: "A morning list of the few problems that matter, each with its evidence and an owner action on the same screen",
    pain: "A support lead's day starts with a dashboard of things that already went wrong: CSAT fell, SLAs breached. Finding the cause means exporting tickets, slicing them by app version or shift, then switching to another tool to escalate or coach. By then customers are already complaining",
    gap: "Helpdesks are built to move one ticket at a time, and analytics tools report averages. Nobody owns the step between \"a number moved\" and \"this person acts on it\"",
    how: [
      "Every morning it shows three priorities, not thirty alerts, each with its evidence, e.g. 72% of payment-failure tickets come from Android v12.4 at the gateway callback",
      "Each finding ends in an action on the same screen: escalate to Payments Engineering, coach 5 flagged agents, or move 143 at-risk tickets to a team with spare capacity",
    ],
    decisions: [
      "Every finding shows its confidence and whether it was verified",
      "Nothing happens without a person's click, and dismissals are recorded",
    ],
    points: [
      "Command Centre, Tickets, Unified Inbox, Customers, Insights, Analytics, Agent Coaching, Automations, Team and Agents, Settings",
      "An Ask Helix assistant for questions about the operation, answered from the same ticket data",
    ],
    media: "/media/helix-ai.mp4", shot: "/shots/helix-ai.png", cover: "/covers/helix-ai.webp", href: "/prototypes/Helix_AI_Customer_Operations.html",
  },
  {
    slug: "revora-ai", name: "Revora", kind: "Prototype", domain: "Billing and revenue operations",
    tagline: "Catches revenue a subscription business billed wrong, before month-end",
    problem: "Revenue leaks between contract, invoice, payment and collection, and finance finds it at month-end",
    solution: "A continuous check of contract against invoice against payment, where every leak becomes an owned task",
    pain: "Money leaks in the gaps between systems: a price change that never reached the invoice, stale seat counts, unbilled add-ons, a discount that outlived its term. Finance finds it at month-end reconciliation, or never, and by then going back to the customer is awkward",
    gap: "The billing system bills what it is told, and the contract lives in the CRM. Nothing compares the two continuously",
    how: [
      "Continuously checks contract against invoice against payment against settlement, and sorts leaks into 8 types: underbilling, tax mismatch, wrong discounts, missing line items, unbilled usage, wrong proration, uncollected overdue and unreconciled settlement",
      "Keeps leakage (the bill was wrong) apart from collections (a card failed), because they have different owners and different fixes",
      "Every finding becomes an owned task with an approval step",
    ],
    decisions: [
      "Sits on top of the existing billing stack instead of replacing it",
      "Recovered revenue is tracked apart from identified revenue, so a guess is never counted as money recovered",
    ],
    points: [
      "16 modules, from Customers through Reconciliation to Settings",
      "A Revenue Leakage Monitor with identified, recoverable and recovered amounts",
    ],
    media: "/media/revora-ai.mp4", shot: "/shots/revora-ai.png", cover: "/covers/revora-ai.webp", href: "/prototypes/Revora_AI_Revenue_Operations.html",
  },
  {
    slug: "performance-ai", name: "Performance", kind: "Prototype", domain: "Marketing",
    tagline: "Measures a lender's marketing on loans disbursed, not leads reported",
    problem: "Marketing is judged on disbursed loans, but ad platforms report leads and clicks",
    solution: "Spend reconciled to the CRM, measured on cost per disbursal, with a morning brief of the decisions needed",
    pain: "A lender's marketing team is judged on cost per disbursed loan, but ad platforms report leads and clicks. Platform leads overcount (16% more than the CRM verifies in the sample), and a loan pays out weeks after the click, so campaigns get cut or scaled before their results arrive",
    gap: "Ad platforms grade their own homework. The CRM holds the truth, but nothing links it back to spend",
    how: [
      "Reconciles platform leads with the CRM and reports cost per disbursal, plus cost per ₹1L lent, since one personal loan is worth several gold loans",
      "Marks campaigns still inside the 45-day payout window as provisional, so they are not judged too early",
      "Shows where the funnel breaks against benchmarks, e.g. a 10% sanction rate against a typical 60% points to credit policy, not marketing",
    ],
    decisions: [
      "Guardrails set what the system may change on its own, what goes to review and what is only logged",
      "Loans that cannot be traced to a click are shown apart, not spread across campaigns, so no campaign gets credit it did not earn",
    ],
    points: [
      "Five views: Brief, Diagnose, Forecast, Guardrails, Settings",
      "Shown for a fictional lender, Meridian Capital Finance, where the outcome is a loan disbursal",
    ],
    media: "/media/performance-ai.mp4", shot: "/shots/performance-ai.png", cover: "/covers/performance-ai.webp", href: "/prototypes/Performance_AI_Meridian.html",
  },
  {
    slug: "peopleos", name: "PeopleOS", kind: "Prototype", domain: "HR and talent",
    tagline: "Shows who can do what, so roles get filled from inside first",
    problem: "HR knows who reports to whom, but not who can do what",
    solution: "A skills map across the organisation that matches internal people to open roles, with the reasons shown",
    pain: "When a senior role opens or a team runs short of a skill, HR knows who reports to whom but not who can do what. So companies hire from outside for roles an insider could fill, and the people who wanted to grow leave",
    gap: "HR systems store records like titles, leave and payroll. Skills live in managers' heads or old spreadsheets",
    how: [
      "Maps skills across the organisation against planned needs, showing coverage and gaps by team",
      "Matches internal people to open roles and shows why each matched. In the sample, 4 of 12 senior roles have internal candidates who said they want to move",
      "Flags early signals, like rising attrition in Customer Success or 23 people whose career goals have no development plan",
    ],
    decisions: [
      "Suggested skills only count once someone reviews them",
      "Every people signal needs human review before anyone acts",
    ],
    points: [
      "20 views, including Employee 360, a Skills Intelligence heatmap, a Talent Marketplace, Succession and Workforce Planning",
    ],
    media: "/media/peopleos.mp4", shot: "/shots/peopleos.png", cover: "/covers/peopleos.webp", href: "/prototypes/PeopleOS_Talent_Intelligence.html",
  },
];

export const bySlug = (s: string) => projects.find((p) => p.slug === s);
