export const identity = {
  name: "MRUDULA",
  handle: "mrudula.exe",
  roles: ["AI engineering student", "researcher", "builder", "writer"],
  subtext:
    "Third-year AI engineering student. I build systems, test weird ideas, and keep the failures visible long enough to learn from them — from markerless motion capture and adversarial ML to products that escape the notebook.",
  links: {
    github: "https://github.com/Mrudula-itsjuzme",
    linkedin: "https://www.linkedin.com/in/pedamallusaimrudula/",
    email: "mailto:mrudulasankar2007@gmail.com",
    location: "Coimbatore, IN",
  },
};

export const currentStatuses = [
  "quests · closed beta fixes",
  "mocap · gait validation",
  "cyberbio · evidence pass",
  "open source · PRs in review",
];

export const heroSticky = [
  "ship Quests",
  "gait validity > pretty skeleton",
  "physical oracle?",
  "write something not for linkedin",
];

export const currentWorks = [
  {
    id: "now-quests",
    name: "Quests",
    status: "closed beta",
    note: "3–4 testers are finding the boring bugs that matter: persistence, UX friction, and whether the progression loop actually sticks.",
    next: "next build → persistence + release polish",
    href: "https://github.com/Mrudula-itsjuzme/quests",
    tone: "butter",
  },
  {
    id: "now-mocap",
    name: "Motion Capture",
    status: "validation",
    note: "The skeleton is not the finish line. I’m tightening repeatability, camera quality gates, gait events, and the parts that decide whether a run is usable.",
    next: "next → one clean repeatable gait run",
    href: "https://github.com/Mrudula-itsjuzme/Motion-capture",
    tone: "sage",
  },
  {
    id: "now-cyberbio",
    name: "CyberBio",
    status: "evidence pass",
    note: "The attacks work. Now I’m trying to make the conclusions harder to fool: multi-seed stats, representation sensitivity, physical checks, cleaner reporting.",
    next: "next → freeze the canonical experiment",
    href: "https://github.com/Mrudula-itsjuzme/cyberbio",
    tone: "pink",
  },
  {
    id: "now-portfolio",
    name: "This site",
    status: "alive",
    note: "Turning a portfolio into a place I can actually use: movable scraps, doodles, a local desk, current work, and less recruiter theatre.",
    next: "next → keep only the fun parts that earn their space",
    href: "https://github.com/Mrudula-itsjuzme/portfolio-site",
    tone: "paper",
  },
];

export const contributions = [
  {
    project: "NVIDIA DALI",
    title: "docs: fix minor typos in documentation",
    status: "merged",
    href: "https://github.com/NVIDIA/DALI/pull/6459",
    when: "Aug 2026",
  },
  {
    project: "NVIDIA NeMo Speech",
    title: "docs: fix minor typos in documentation",
    status: "merged",
    href: "https://github.com/NVIDIA-NeMo/Speech/pull/16130",
    when: "Aug 2026",
  },
  {
    project: "Hugging Face LeRobot",
    title: "fix(eval): avoid recording directory collisions across batches",
    status: "open",
    href: "https://github.com/huggingface/lerobot/pull/4622",
    when: "Sep 2026",
  },
  {
    project: "Sports2D",
    title: "handle temporal lower-limb L/R swaps",
    status: "open",
    href: "https://github.com/davidpagnon/Sports2D/pull/41",
    when: "Sep 2026",
  },
  {
    project: "NVIDIA CUTLASS",
    title: "docs: fix minor typos in documentation",
    status: "open",
    href: "https://github.com/NVIDIA/cutlass/pull/3530",
    when: "Sep 2026",
  },
  {
    project: "NVIDIA-AI-IOT trt_pose",
    title: "fix: use ONNX backend for torch2trt conversion in notebooks",
    status: "open",
    href: "https://github.com/NVIDIA-AI-IOT/trt_pose/pull/188",
    when: "Sep 2026",
  },
];

export const featuredProjects = [
  {
    id: "mocap",
    name: "Motion Capture",
    title: "Distributed Real-Time Markerless Motion Capture",
    tagline: "Markerless. Two cameras. Real movement.",
    year: "2026",
    github: "https://github.com/Mrudula-itsjuzme/Motion-capture",
    repoPrivate: true,
    tags: ["computer vision", "biomechanics", "gait analysis"],
    blurb:
      "Markerless dual-camera gait analysis built around a stricter question than “does the skeleton look right?” — every exported metric carries validity checks, provenance, and explicit abstention when the evidence is not good enough.",
    annotations: [
      "tracking movement without markers.",
      "two cameras → one skeleton.",
      "jitter ↓ 77%",
    ],
    facts: [
      ["trust model", "metric-specific validity + fail-closed export gating"],
      ["pipeline", "dual-camera 3D + gait features + provenance"],
      ["testing", "399 passing tests in the current engineering line"],
      ["next evidence", "external BioCV validation still pending"],
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
      "A released mobile-first exploration platform with native Android/iOS builds, server-authoritative progression, evidence-backed captures, maps, rewards, public profiles, and a closed beta still finding the useful bugs.",
    annotations: ["small steps, wilder days", "XP ledger + streaks", "prod mode rejects shortcuts"],
    facts: [
      ["release", "v1.2.0 · web + native mobile builds"],
      ["progression", "server-authoritative + idempotent rewards"],
      ["world layer", "maps, GPS capture clusters, profiles, journal"],
      ["beta", "3–4 testers · persistence + UX fixes in progress"],
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
      "A leakage-audited adversarial robustness study for polymer sequence models, now centered on polyVERSE bandgap prediction with sealed test data, five-seed benchmarks, representation-preserving controls, and chemistry-changing stress tests.",
    annotations: ["attack →", "defend →", "understand →"],
    facts: [
      ["active lineage", "polyVERSE bandgap · 4,209 records"],
      ["baseline", "sealed-test MAE 0.4619 eV · R² 0.8019"],
      ["representation drift", "0.8968 → 0.4079 eV on scaffold split"],
      ["stress test", "MCMC-style drift ≈0.22 → ≈0.18 eV with consistency regularization"],
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
      "An architecture-software prototype testing whether an architect-authored draft can become a semantic model that exposes constraints, change impact, and eventually intent hypotheses without taking authorship away from the architect.",
    annotations: ["from blueprints to real spaces", "intent hypotheses, not facts", "smallest useful change"],
    facts: [
      ["thesis", "intent-preserving transformation, not generation"],
      ["implemented", "shared semantic model · linked 2D/3D · deterministic variants"],
      ["impact layer", "constraints + relationships + change requests"],
      ["research next", "latent intent inference + minimal-change search"],
    ],
    variant: "archis",
  },
];


export const productProjects = [
  {
    name: "MisSpoke",
    repoName: "speak134",
    href: "https://github.com/Mrudula-itsjuzme/speak134",
    demo: "https://misspoke1.vercel.app",
    note: "Voice-first language learning with adaptive AI tutors, multilingual practice, local learning memory, and session analytics.",
    proofLines: [
      "ElevenLabs conversational voice",
      "OpenRouter tutor layer",
      "IndexedDB learning memory",
      "Supabase auth + multilingual translation",
    ],
    meta: "built with Meghana Kotharu",
    variant: "voice",
  },
  {
    name: "AnswerBubble",
    href: "https://github.com/Mrudula-itsjuzme/Answer_bubble",
    note: "Desktop AI meeting copilot with live transcription, question detection, floating answers, notes, and local semantic memory.",
    proofLines: [
      "<500 ms question detection path",
      "multi-provider LLM failover",
      "Tauri desktop overlay",
      "no raw audio stored",
    ],
    meta: "React + TypeScript + Tauri",
    variant: "desktop",
  },
];

export const researchRows = [
  {
    name: "Smart Grid Intrusion Detection",
    label: "FIRST AUTHOR · IEEE ACCESS",
    note: "IEC 60870-5-104 intrusion detection for critical power-grid communications.",
    metrics: ["99.29% accuracy", "94.8% recall", "4.1% FPR"],
    primaryHref: "https://ieeexplore.ieee.org/document/11083563",
    primaryLabel: "paper",
    secondaryHref: "https://github.com/Mrudula-itsjuzme/cyberattack-on-smart-grids",
    secondaryLabel: "related repo",
  },
  {
    name: "PV Fault Detection",
    label: "CO-AUTHOR · ENERGY CONVERSION & MANAGEMENT: X",
    note: "Lightweight hierarchical spatial feature extraction with sequential GRU modeling for PV fault diagnosis.",
    metrics: ["96% binary", "91% across 12 faults", "PyramidNet + GRU"],
    primaryHref: "https://doi.org/10.1016/j.ecmx.2025.101293",
    primaryLabel: "paper",
  },
  {
    name: "EEG Reconstruction",
    label: "TEAM PROJECT",
    note: "Time-varying EEG reconstruction using local graph structure and ADMM optimization.",
    metrics: ["ADMM", "local graph methods", "signal reconstruction"],
    primaryHref: "https://github.com/Mrudula-itsjuzme/MFC3_D3_EEG_Recon_ADMM",
    primaryLabel: "repo",
  },
];

export const otherBuilds = [
  { name: "AI Council", href: "https://pypi.org/project/ai-council-orchestrator/1.0.0/" },
  { name: "Habbit", href: "https://github.com/Mrudula-itsjuzme/mind" },
];

export const researchPapers = [
  {
    title: "IEEE Access 2025 — Smart Grid Intrusion Detection",
    detail: "Smart Grid Intrusion Detection for IEC 60870-5-104",
    meta: "first author · IEEE Access 2025 · 99.29% accuracy · 94.8% recall",
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
    title: "EEG Reconstruction (ADMM)",
    detail: "Time-Varying EEG Signal Reconstruction using ADMM & Graph Methods",
    meta: "Iterative graph optimization · artifact removal & reconstruction",
    href: "https://github.com/Mrudula-itsjuzme/MFC3_D3_EEG_Recon_ADMM",
    tag: "project",
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
    role: "Co-founder · VP, Non-Tech",
    blurb: "Co-founded the club and helped run events, collaborations, partnerships, and community operations.",
    href: "https://initclub.vercel.app/",
    linkLabel: "official site",
  },
  {
    name: "IETE Amrita",
    role: "AI/ML vertical member",
    blurb: "Part of the AI/ML vertical in IETE Student Forum, Amrita Coimbatore.",
    href: "https://avvsf.ietecbe.org/",
    linkLabel: "official site",
  },
  {
    name: "Poetry Club",
    role: "Member",
    blurb: "Weekly poetry community at campus.",
    href: "https://www.linkedin.com/in/pedamallusaimrudula/",
    linkLabel: "profile",
  },
  {
    name: "Hacktoberfest @ INIT",
    role: "Organizer",
    blurb: "Open-source month, run through INIT.",
    href: "https://initclub.vercel.app/",
    linkLabel: "club site",
  },
];

export const selectionTrail = [
  {
    name: "Arc180 Fellows",
    stage: "interview / product-pitch stage",
    note: "Reached the interview stage for the 2026 founder fellowship.",
    href: "https://www.arc180fellows.com/",
  },
  {
    name: "Polaris Fellowship",
    stage: "Round 2 screening",
    note: "Advanced past Round 1 into the 2026 screening/build stage.",
    href: "https://fellowship.polariscampus.com/",
  },
];

export const recentThoughts = [
  "gait validity ≠ a pretty skeleton",
  "what counts as evidence after an attack works?",
  "what makes a product survive after the fun prototype bit?",
  "can a portfolio be a tool instead of a brochure?",
];

export const publishedWriting = [
  {
    id: "daffodils-ai-poetry",
    kind: "literary journal",
    title: "On Artificial Intelligence, Poetry, and Human Creativity",
    venue: "The Daffodils",
    year: "2025",
    detail: "Essay on AI, poetry, authorship, originality, literary labor, and human experience.",
    status: "published",
    href: "https://www.linkedin.com/in/pedamallusaimrudula/",
  },
  {
    id: "xx-anthology",
    kind: "anthology",
    title: "XX: Story from Foetus to Foeticide",
    venue: "Spectrum of Thoughts Publication",
    year: "2023",
    detail: "Co-author contribution in the published anthology · ISBN 978-93-5605-245-1.",
    status: "published",
    href: "https://www.linkedin.com/in/pedamallusaimrudula/",
  },
];


export const writings = [
  {
    id: "stories",
    title: "The Stories That Don't Exist Yet",
    date: "Sep 2026",
    status: "Essay",
    readTime: "3 min read",
    href: "https://www.linkedin.com/in/pedamallusaimrudula/recent-activity/all/",
    content: `There are companies that don't exist yet.
Products that haven't been built yet.
Problems that haven't been properly defined yet.

And the companies built around those things don't exist yet.
Neither do many of the jobs inside them.

That's a strange thing to realize when you're sitting in college trying to plan a career.
We're preparing for a job market that is still being written.

And maybe that's not something we should be afraid of.
Maybe it's an invitation.

Second and third year feels like a particularly good time to take that invitation seriously. You're far enough into college to have actual skills, enough exposure to know what you like and don't like, enough people around you to find collaborators. But you're also early enough that failure isn't the end of the road.

If something I build completely fails, I still have time.
I can apply for a job. I can do an internship. I can go back to research. I can build something else. I can change my mind.

I'm not late.

I think we sometimes spend college optimizing ourselves to fit into jobs that already exist. Which is useful, obviously. I do it too. But I don't want these years to only be about becoming employable.

I want some of them to be about finding out what I'm capable of building.

Because there are companies that haven't been started yet. Products that haven't been built yet. Problems that haven't been properly defined yet.

And someone has to start.

I don't think everyone needs to become a founder. Startups can be chaotic, uncertain and occasionally held together by caffeine and questionable decisions.

But I do think more people should experience building something from a point where the answer isn't already known.

Especially while they're young enough to fail without the failure becoming a life sentence.

I've always loved stories, but I think I've realized that the ones I'm most drawn to are the ones that are still being written. The ones where nobody knows the ending yet.

Not just businesses.
Stories that don't exist yet.`,
  },
  {
    id: "literature",
    title: "I Thought I'd Be a Literature Girl",
    date: "Jun 2026",
    status: "LinkedIn",
    readTime: "2 min read",
    href: "https://www.linkedin.com/in/pedamallusaimrudula/recent-activity/all/",
    content: `I thought I'd be a literature girl.

Then I got pushed into AI because apparently it was "the trend" and well, I'm from an Indian household, so obviously there was pressure to get into engineering.

Either that or be a doctor.
And well, I can't sit still enough to be a doc. So I tried engineering.

AND I LOVE IT. And I don't regret not joining literature either.
I'm basically still using English every day. Just in a .....slightly different way.

Half the time I'm yapping to AI agents so they can help me build apps, automate things, or figure out whatever weird idea I'm chasing that week. Turns out understanding language, structure, and how to communicate clearly is surprisingly useful when your coworkers are increasingly made of code.

I'm still getting on stages. Still writing. Not books, but articles/journals here. Still telling stories, just about different things now.
Somehow I ended up with both things I love instead of having to choose one.

Then I got curious.
Then I started building.
Then it got slightly out of hand.

Now I'm working on motion capture, cybersecurity research, EEG reconstruction, AI products, startups, and 2am GitHub commits.
Still obsessed with stories.
Just writing some of them in code now.`,
  },
  {
    id: "constraints",
    title: "Content From Constraints, Not Vibes",
    date: "Jun 2026",
    status: "Note",
    readTime: "2 min read",
    href: "https://www.linkedin.com/in/pedamallusaimrudula/recent-activity/all/",
    content: `i am learning that good brand content is not just "writing better captions."

it is constraint work.

what can the brand say?
what should it never say?
which words sound cheap?
which claims are too big?
which examples are real enough to use?
where does the tone become too loud?
where does it become too vague?

that has been the most useful shift for me.

content is not decoration.
it is a system for making the brand easier to understand without making it sound desperate.

the hard part is not filling a calendar.
anyone can do that.

the hard part is making sure every post has a reason to exist.

one post should clarify.
one should teach.
one should show judgment.
one should make the offer easier to believe.

less noise.
more signal.

small lesson for the week: constraints make the writing sharper.`,
  },
  {
    id: "leads",
    title: "Not Every Lead Is a Client",
    date: "Jun 2026",
    status: "Field Note",
    readTime: "2 min read",
    href: "https://www.linkedin.com/in/pedamallusaimrudula/recent-activity/all/",
    content: `one thing i am learning from outreach work:

not every lead is a client.

that sounds obvious until you actually start looking at prospects.

some people have urgency but no budget.
some have budget but no clear owner.
some want speed because they skipped thinking.
some want a vendor when the work needs a partner.
some want a guarantee for outcomes nobody can fully control.

the tempting thing is to treat every lead as an opportunity.
but that makes the pipeline noisy.

the better question is:
is this person ready for the kind of work being offered?

that changes how i look at outreach.
it is not just finding more people.
it is finding the right people, with the right problem, at the right stage.

less chasing.
more filtering.`,
  },
  {
    id: "marketing",
    title: "Marketing Is Also a Decision System",
    date: "Jun 2026",
    status: "Field Note",
    readTime: "2 min read",
    href: "https://www.linkedin.com/in/pedamallusaimrudula/recent-activity/all/",
    content: `i am learning that performance marketing is not just "make ads and run them."

that version sounds simple.
maybe too simple.

the harder part is knowing what the numbers are actually saying.

which ad created attention?
which page lost trust?
which audience was wrong?
which offer did not land?
which result was real and which one was just noise?

without tracking, everyone can have an opinion.
with tracking, the campaign has a memory.

that is the part i did not fully appreciate before.

good marketing is not only creative.
it is also a decision system.

note to self: numbers are not boring when they stop people from guessing.`,
  },
];

export const currentExperiments = [
  { label: "Quests beta", note: "iterating" },
  { label: "mocap pipeline", note: "fixing (again)" },
  { label: "CyberBio validation", note: "tightening evidence" },
  { label: "portfolio", note: "shipping this one" },
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

export const sideRepos = [
  { name: "ai-council", href: "https://github.com/Mrudula-itsjuzme/Ai-Council", note: "multi-model AI coordination library" },
  { name: "eeg-svd", href: "https://github.com/Mrudula-itsjuzme/EEG-signal-reconstruction-using-SVD", note: "SVD-based artifact removal" },
  { name: "aircraft-yolo", href: "https://github.com/Mrudula-itsjuzme/aircraft-data-training", note: "YOLOv8 aircraft detection pipeline" },
  { name: "ai-greenhouse", href: "https://github.com/Mrudula-itsjuzme/ai_greenhouse", note: "Arduino smart greenhouse" },
  { name: "noise-regulation", href: "https://github.com/Mrudula-itsjuzme/noise-regulation", note: "ESP32 acoustic monitoring" },
  { name: "cancer-genes", href: "https://github.com/Mrudula-itsjuzme/cancer-driver-gene-classification-ml", note: "bioinformatics ML pipeline" },
  { name: "dqn-tictactoe", href: "https://github.com/Mrudula-itsjuzme/tic-tac-toe-double-dqn", note: "double DQN reinforcement learning" },
  { name: "recipes-bot", href: "https://github.com/Mrudula-itsjuzme/recipes-chatbot-image", note: "multimodal recipe assistant" },
  { name: "osi-sim", href: "https://github.com/Mrudula-itsjuzme/osi-model-simulation-python", note: "layer-wise OSI simulation" },
  { name: "rasa-bot", href: "https://github.com/Mrudula-itsjuzme/Rasa-bot", note: "intent-classified chatbot framework" },
  { name: "microservices", href: "https://github.com/Mrudula-itsjuzme/microservices", note: "distributed architecture prototype" },
  { name: "c-syscalls", href: "https://github.com/Mrudula-itsjuzme/file-management-system-c-syscalls", note: "unix file management in C" },
];

export const quote =
  "\u201cYou don't have to have it all figured out. You just have to be curious enough to keep building.\u201d";
