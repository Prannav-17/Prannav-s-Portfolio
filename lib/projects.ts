// A public source backing the pain point. `quote` is verbatim from the source (or a figure stated in it),
// `why` ties it to the product. Checked against the live page before adding; keep it that way.
export type Evidence = { quote: string; who: string; url: string; why: string };

export type Project = {
  slug: string; name: string; kind: "Live app" | "Prototype"; domain: string;
  tagline: string; problem: string; solution: string; points: string[];
  note?: string; different?: string; impact?: string; feedback?: string[];
  // Depth for prototypes: the pain, why existing tools miss it, how it solves it, and the judgment calls built in
  pain?: string; gap?: string; how?: string[]; decisions?: string[];
  evidence?: Evidence[];
  users?: { user: string; buyer: string; when: string };
  data?: string[]; controls?: string[]; metrics?: string[]; validate?: string[];
  media: string; shot: string; cover?: string; href: string; external?: boolean; portrait?: boolean;
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
    different: "No app or sign-up, built for Indian services and 32 languages, and the group always gets a ranked top 3 in about three minutes, even when not everyone agrees",
    impact: "In live testing with friend groups, a group decided what to watch in about 3 minutes on average, much faster than they took before using the app",
    feedback: [
      "Multiple languages: users asked to pick more than one language instead of just one, so the app now allows several, and the streaming platforms shown refresh to match the languages chosen",
      "Swipe walkthrough: many testers were new to Tinder-style right/left voting and missed it in live sessions, so a short animated tutorial now shows what to do",
      "Ratings while swiping: ratings were hidden at first so people would judge without preconceived notions, but testers were more satisfied with the final pick when they could see them, so each title now shows its rating",
    ],
    note: "Live and in testing with friend groups, who send regular feedback. Built on Next.js with Claude Code. Title data from TMDB, where-to-watch from JustWatch, availability from the Streaming Availability API by Movie of the Night",
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
    evidence: [
      { quote: "It's too granular and too difficult for the average Zendesk user to build a report.", who: "A Zendesk customer, on the Zendesk Community, about its reporting tool (2021)", url: "https://community.zendesk.com/fid-0/tid-1479", why: "The data exists, but getting from it to a cause takes an analyst. Helix does that step every morning" },
      { quote: "More than one-half of consumers will switch to a competitor after only one bad experience.", who: "Zendesk, Customer service statistics (Zendesk Benchmark data, 2026)", url: "https://www.zendesk.com/blog/customer-service-statistics/", why: "Finding a problem after CSAT drops is too late. Helix flags it while the spike is still building" },
      { quote: "84 percent of customer service and service support leaders cited customer data and analytics as \"very or extremely important\"", who: "Gartner survey, reported by CRM Magazine (January 2023)", url: "https://www.destinationcrm.com/Articles/CRM-News/CRM-Featured-Articles/Gartner-Customer-Data-and-Analytics-Top%C2%A0Customer-Service-Priorities-in-2023-156571.aspx", why: "Leaders already want data-led decisions. What they lack is the data turned into an owner and an action" },
    ],
    users: { user: "Support lead or head of CX running 50 to 300 agents across email, WhatsApp, chat and phone", buyer: "VP of Customer Experience", when: "The first 15 minutes of the day, and the weekly review with product and engineering" },
    data: [
      "Conversations from Gmail, WhatsApp Business and live chat, read where they already are, with no migration",
      "Customer and order context from Salesforce and Shopify, so a spike can be sized by revenue at risk",
      "Engineering issues from Jira, so a cluster of tickets can be linked to a known bug and escalated with evidence",
    ],
    controls: [
      "Single sign-on (SAML via Okta), two-factor sign-in for admins and an optional IP allowlist",
      "A role-by-permission matrix admins can edit, plus an audit log of every action",
      "Data retention set by the customer (12, 24 or 36 months) and scoped API keys",
    ],
    metrics: [
      "Time from a ticket spike to a named cause and owner (the north star)",
      "Repeat contacts on issues already marked fixed",
      "CSAT and SLA recovery on the teams that acted",
      "Guardrail: share of findings dismissed as wrong, which should stay low",
    ],
    validate: [
      "Will leads trust a ranked list of three over their own dashboards? Test by comparing it with what they would have picked",
      "Ticket tags are often unreliable, so is reading the ticket text accurate enough to cluster causes?",
      "Who owns a fix that sits with engineering, and will they accept an escalation that comes from support?",
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
    evidence: [
      { quote: "at least three to five percent of every company’s revenue", who: "MGI Research, Revenue Leakage Series (December 2025), on what leakage costs", url: "https://mgiresearch.com/research/revenue-leakage/", why: "For a ₹500 Cr subscription business, that is ₹15 to 25 Cr a year" },
      { quote: "Billing system configured for flat pricing lacks ability to model step-ups or tier transitions.", who: "MGI Research, on why revenue leakage happens (December 2025)", url: "https://mgiresearch.com/research/revenue-leakage-series-part-2-why-does-revenue-leakage-happen/", why: "The contract says one thing and the invoice another. Revora compares the two, line by line" },
      { quote: "5% of revenue is lost per year to manual processes.", who: "Zone & Co, survey of more than 200 finance leaders (2026)", url: "https://zoneandco.com/articles/revenue-leakage-how-you-can-save-millions-of-dollars", why: "Spreadsheet checks at month-end are the manual process. Revora runs the check continuously" },
      { quote: "It accounts for an estimated 20% - 40% of total churn across subscription businesses.", who: "Recurly, on involuntary churn from failed payments (April 2026)", url: "https://recurly.com/blog/failed-payment-recovery-data-based-strategy/", why: "Why Revora keeps failed payments (collections) apart from billing errors (leakage): different owner, different fix" },
    ],
    users: { user: "Revenue operations and billing analysts", buyer: "CFO or Financial Controller", when: "Daily, instead of only at month-end close, with approvals routed to finance admins" },
    data: [
      "Contract terms, prices and discounts from Salesforce",
      "Payments and settlements from Stripe, Adyen and Razorpay",
      "The ledger from QuickBooks, and the full history from a Snowflake warehouse",
      "Alerts and approval requests to Slack and Gmail",
    ],
    controls: [
      "Money-moving actions (refunds, credit notes, price changes, invoice edits, cancellations) always go through approval",
      "Approval limits by role: above a set amount, a second approver is required",
      "Single sign-on (SAML via Okta), two-factor sign-in for finance admins and a 30-minute idle timeout",
      "Financial records kept for 7 years, with an audit log of every change",
    ],
    metrics: [
      "Revenue recovered each month, counted only once the money is in (the north star)",
      "Leakage as a share of billed revenue, trending down",
      "Days from a leak starting to it being caught",
      "Guardrail: share of findings that finance rejects as false",
    ],
    validate: [
      "How reliably can contract terms be read when some live in PDFs instead of the CRM?",
      "How does finance want recovered revenue recognised and evidenced for auditors?",
      "Rebilling a customer has relationship risk. Should account managers approve alongside finance?",
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
      "Nothing executes on its own: guardrail rules raise a decision for a person, and every rule fired and decision taken is kept in an audit log",
      "Loans that cannot be traced to a click are shown apart, not spread across campaigns, so no campaign gets credit it did not earn",
    ],
    evidence: [
      { quote: "Algorithmic ad targeting optimises for clicks and leads, not funded loans.", who: "Credit Sense, a lending-data company (June 2025)", url: "https://www.creditsense.com.au/the-growing-problem-of-poor-quality-finance-leads-and-what-to-do-about-it/", why: "If the platform is the scorekeeper, cheap leads look like success. Performance scores on disbursals" },
      { quote: "Marketing teams are optimizing for clicks and submissions, while sales teams just want a real pipeline.", who: "Google, Think with Google (September 2026)", url: "https://business.google.com/us/think/measurement/unlocking-offline-sales-data/", why: "Even Google's own advice is to bring CRM outcomes back into measurement, which is the reconciliation Performance does" },
      { quote: "Native CRM connectors fail because they were built on fragile assumptions: single browser sessions, native forms, cooperative cookies, and short sales cycles.", who: "CustomerLabs, a conversion-tracking company (August 2026)", url: "https://customerlabs.com/blog/google-ads-hubspot-conversion-discrepancy-the-offline-gap", why: "A loan takes weeks from click to payout. So Performance marks young campaigns provisional and shows untraceable loans separately" },
    ],
    users: { user: "Performance marketing lead at a lender (bank or NBFC)", buyer: "Chief Marketing Officer, with the head of credit as a key stakeholder", when: "Every morning before budgets move, and in the weekly budget review" },
    data: [
      "Spend, clicks and platform-reported leads from Google Ads, Meta, Snapchat and DV360",
      "Lead status, sanction and disbursal from the lender's CRM (a Zoho bridge in the sample)",
      "Each source shows when it last synced, and a delayed feed is flagged instead of silently used",
    ],
    controls: [
      "Guardrails are written as plain sentences (e.g. a cost-per-disbursal ceiling) and raise decisions; they never act alone",
      "Campaigns younger than the maturity setting are withheld from judgement, not marked as failing",
      "Every rule fired and every decision taken is kept in an audit log",
      "Automatic pausing needs write access to ad platforms and is deliberately left for a later phase",
    ],
    metrics: [
      "Cost per disbursal and cost per ₹1L lent (the north star)",
      "Share of spend judged on CRM-verified outcomes, not platform leads",
      "Budget moved before a campaign's payout window closed, which should fall",
      "Guardrail: share of disbursals that cannot be traced to a click",
    ],
    validate: [
      "How quickly does disbursal data reach the CRM at a real lender? That sets how early a campaign can be judged",
      "Will credit teams accept a funnel diagnosis that points at credit policy rather than marketing?",
      "What borrower data can be sent back to ad platforms under India's DPDP Act?",
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
    evidence: [
      { quote: "significantly lower performance evaluations for their first two years on the job", who: "Knowledge at Wharton, on Matthew Bidwell's research into external hires (2012)", url: "https://knowledge.wharton.upenn.edu/article/why-external-hires-get-paid-more-and-perform-worse-than-internal-staff/", why: "The same research found external hires were paid about 18% to 20% more. PeopleOS shows the insider first" },
      { quote: "Only 15% of employees say their organization encouraged them to move to a new role.", who: "LinkedIn Learning, on career pathing and retention", url: "https://business.linkedin.com/learn/resources/career-development/career-pathing-employee-retention", why: "People who want to move are invisible to HR. PeopleOS records the wish and matches it to open roles" },
      { quote: "Employees at companies with high rates of internal mobility stay 60% longer", who: "LinkedIn Learning, Internal Mobility Playbook", url: "https://learning.linkedin.com/resources/internal-mobility/internal-mobility-playbook", why: "Internal moves are a retention lever, which is why PeopleOS pairs matching with early attrition signals" },
    ],
    users: { user: "HR business partners and talent managers, with hiring managers and employees as everyday users", buyer: "Chief Human Resources Officer", when: "When a role opens, in quarterly workforce planning and in succession reviews" },
    data: [
      "People records from Workday (HRIS) and ADP (payroll)",
      "Open roles and candidates from Greenhouse (ATS)",
      "Courses and certifications from Docebo (LMS)",
      "Sign-in through Okta, with nudges and approvals in Slack",
    ],
    controls: [
      "Copilot governance: suggested skills need human validation, and match explanations are always shown",
      "No autonomous decisions on hiring, promotion, pay or ratings",
      "Sensitive data is permission-controlled, and every action is written to an audit log",
    ],
    metrics: [
      "Share of open roles filled internally (the north star)",
      "Time to fill, against external hires",
      "Regretted attrition among people who had asked to move",
      "Guardrail: matches reviewed for fairness across teams and groups, with reasons shown",
    ],
    validate: [
      "Will employees keep skill profiles current once the novelty wears off?",
      "Will managers release strong people to other teams, or quietly block moves?",
      "How visible should attrition signals be, and to whom, before they feel like surveillance?",
    ],
    points: [
      "20 views, including Employee 360, a Skills Intelligence heatmap, a Talent Marketplace, Succession and Workforce Planning",
    ],
    media: "/media/peopleos.mp4", shot: "/shots/peopleos.png", cover: "/covers/peopleos.webp", href: "/prototypes/PeopleOS_Talent_Intelligence.html",
  },
];

export const bySlug = (s: string) => projects.find((p) => p.slug === s);
