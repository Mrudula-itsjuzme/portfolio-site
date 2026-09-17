// Real content only — sourced from src/data/projects.js, src/data/articles.js,
// CredibilityDock.jsx, and the Archis repo README / pitch (github.com/Mrudula-itsjuzme/Archis).

export const identity = {
  name: "MRUDULA",
  handle: "mrudula.exe",
  roles: ["AI engineering student, Amrita", "researcher", "builder", "overthinker"],
  subtext:
    "Third-year AI student. I research, break, and rebuild things until they make sense — motion capture, adversarial ML, EEG reconstruction, and whatever the current rabbit hole is.",
  links: {
    github: "https://github.com/Mrudula-itsjuzme",
    linkedin: "https://www.linkedin.com/in/pedamallusaimrudula/",
    email: "mailto:mrudulasankar2007@gmail.com",
    location: "Coimbatore, IN",
  },
};

export const currentStatuses = [
  "same brain, new problems",
  "training a model right now",
  "debugging mocap (again)",
  "reading adversarial ML papers",
  "iterating on Quests beta",
  "overcaffeinated and refactoring",
  "asking what happens if it works",
  "probably should be asleep",
];

export const heroSticky = [
  "make this cooler",
  "fix mocap (again)",
  "publish Quests ?",
  "stop procrastinating",
  "write",
  "be a little kinder",
];

export const featuredProjects = [
  {
    id: "mocap",
    name: "Motion Capture",
    title: "Distributed Real-Time Markerless Motion Capture",
    tagline: "Markerless. Two cameras. Real movement.",
    year: "2026",
    github: "https://github.com/Mrudula-itsjuzme/Motion-capture",
    tags: ["computer vision", "biomechanics", "gait analysis"],
    blurb:
      "Accessible motion capture with common cameras — dual-camera 3D triangulation, trajectory stabilization, gait features, and validity gates before any of it counts as analysis.",
    annotations: [
      "tracking movement without markers.",
      "two cameras → one skeleton.",
      "jitter ↓ 77%",
    ],
    facts: [
      ["reprojection error", "4.78 px mean / 4.01 px median"],
      ["triangulation success", "0.993 on the documented run"],
      ["jitter reduction", "77% · acceleration ↓ 88%"],
      ["gait phase test suite", "263 tests passed"],
    ],
    variant: "mocap",
  },
  {
    id: "quests",
    name: "Quests",
    title: "HABBIT Quest Engine",
    tagline: "Turn real life into a game.",
    year: "2026",
    github: "https://github.com/Mrudula-itsjuzme/quests",
    tags: ["react", "mobile", "gamification"],
    blurb:
      "A quest hub spanning React + Flutter clients, Express API, PostgreSQL state, and Supabase auth — daily/weekly/monthly quests with rarity rules, cooldowns, idempotent rewards, and user-owned progression.",
    annotations: ["small steps, wilder days", "XP ledger + streaks", "prod mode rejects shortcuts"],
    facts: [
      ["clients", "React web + Flutter, one backend state model"],
      ["auth", "real OIDC / JWT via Supabase"],
      ["writes", "versioned, idempotency-key required"],
      ["schema", "ordered transactional migrations"],
    ],
    variant: "quests",
  },
  {
    id: "cyberbio",
    name: "CyberBio",
    title: "Adversarial Attacks & Defenses in Sequence Models",
    tagline: "Learning to attack and defend.",
    year: "2026",
    github: "https://github.com/Mrudula-itsjuzme/cyberbio",
    tags: ["deep learning", "materials", "adversarial ml"],
    blurb:
      "A multi-phase adversarial ML investigation across materials sequence models and a safe synthetic bio benchmark — with failed hypotheses, confounders, and forensic audits kept as part of the record.",
    annotations: ["attack →", "defend →", "understand →"],
    facts: [
      ["shortcut learning", "length-only baseline beat the Transformer MAE"],
      ["MCMC attack drift", "up to 158 K in documented experiments"],
      ["defense", "adversarial training cut worst-case drift"],
      ["honesty", "falsified hypotheses kept in the repo"],
    ],
    variant: "cyberbio",
  },
  {
    id: "archis",
    name: "Archis",
    title: "Intent-Preserving Architecture Workspace",
    tagline: "From blueprints to real spaces.",
    year: "2026",
    github: "https://github.com/Mrudula-itsjuzme/Archis",
    demo: "https://archis-xi.vercel.app",
    tags: ["design", "3d", "spatial ai"],
    blurb:
      "An architecture-software prototype that starts from the architect's first draft, infers which relationships look intentional, asks when it's unsure, and finds the smallest change that survives the architect's original intent.",
    annotations: ["from blueprints to real spaces", "intent hypotheses, not facts", "smallest useful change"],
    facts: [
      ["thesis", "intent-preserving transformation, not generation"],
      ["flow", "draft → semantic model → intent hypotheses → confirm"],
      ["impact layer", "geometry + relationships + protected intent"],
      ["prototype", "shared semantic model, linked 2D/3D, variants"],
    ],
    variant: "archis",
  },
];

export const researchPapers = [
  {
    title: "IEEE Access 2025 — Smart Grid Intrusion Detection",
    detail: "Smart Grid Intrusion Detection for IEC 60870-5-104",
    meta: "energy conversion & management: X · PV fault detection using PyramidNet + GRU",
    href: "https://ieeexplore.ieee.org/document/11083563",
    tag: "published",
  },
  {
    title: "Energy Conversion & Management: X",
    detail: "PV Fault Detection using PyramidNet + GRU",
    meta: "96% binary · 91% across 12 fault classes",
    href: "https://github.com/Mrudula-itsjuzme/solarpanel-fault-detection",
    tag: "published",
  },
  {
    title: "CyberBio (in progress)",
    detail: "Adversarial attacks & defenses in materials sequence models",
    meta: "MCMC attacks, defensive training, forensic audits",
    href: "https://github.com/Mrudula-itsjuzme/cyberbio",
    tag: "working",
  },
];

export const community = [
  {
    name: "INIT Club",
    role: "Co-founder",
    blurb: "Started with friends because something we wanted didn't exist; now people actually show up.",
    href: "https://www.linkedin.com/in/pedamallusaimrudula/",
  },
  {
    name: "Poetry Club",
    role: "Member",
    blurb: "Words that don't compile. Still counts.",
    href: "https://www.linkedin.com/in/pedamallusaimrudula/",
  },
  {
    name: "Hacktoberfest @ INIT",
    role: "Organizer",
    blurb: "Open-source month, run through the club.",
    href: "https://www.linkedin.com/in/pedamallusaimrudula/",
  },
];

export const recentThoughts = [
  "What even is attention?",
  "On building in public (kinda)",
  "Why I love broken outputs",
  "A poem about not knowing",
];

export const writings = [
  { id: "stories", title: "The Stories That Don't Exist Yet", date: "Sep 2026", status: "Essay", href: "https://www.linkedin.com/in/pedamallusaimrudula/recent-activity/all/" },
  { id: "literature", title: "I Thought I'd Be a Literature Girl", date: "Jun 2026", status: "LinkedIn", href: "https://www.linkedin.com/in/pedamallusaimrudula/recent-activity/all/" },
  { id: "constraints", title: "Content From Constraints, Not Vibes", date: "Jun 2026", status: "Note", href: "https://www.linkedin.com/in/pedamallusaimrudula/recent-activity/all/" },
  { id: "leads", title: "Not Every Lead Is a Client", date: "Jun 2026", status: "Field Note", href: "https://www.linkedin.com/in/pedamallusaimrudula/recent-activity/all/" },
  { id: "marketing", title: "Marketing Is Also a Decision System", date: "Jun 2026", status: "Field Note", href: "https://www.linkedin.com/in/pedamallusaimrudula/recent-activity/all/" },
];

export const currentExperiments = [
  { label: "Quests beta", note: "iterating" },
  { label: "mocap pipeline", note: "fixing (again)" },
  { label: "CyberBio v2 ideas", note: "sketching" },
  { label: "what to break next", note: "planning" },
];

export const unfinishedIdeas = [
  "northlight",
  "speak134",
  "semantic workspace",
  "a poetry archive that annotates itself",
  "markerless mocap on a single phone camera",
];

export const currentlyBoard = [
  "Iterating on Quests (beta)",
  "Fixing mocap pipeline (again)",
  "CyberBio v2 ideas",
  "Planning what to break next",
];

export const quote =
  "\u201cYou don't have to have it all figured out. You just have to be curious enough to keep building.\u201d";
