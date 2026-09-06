export const projects = [
  {
    id: "motion-capture",
    spineTitle: "Motion Capture",
    category: "Applied Systems",
    leather: "leather-forest",
    accent: "#3f6648",
    githubUrl: "https://github.com/Mrudula-itsjuzme/Motion-capture",
    demoUrl: "https://github.com/Mrudula-itsjuzme/Motion-capture",
    pages: [
      { kind: "cover", title: "Distributed Real-Time Markerless Motion Capture", subtitle: "Computer Vision · 3D Reconstruction · Gait Analysis", author: "Pedamallu Sai Mrudula", year: "2026" },
      { kind: "overview", title: "Overview", bullets: ["Accessible markerless motion capture using common camera inputs.", "Dual-camera reconstruction, stabilization, gait analysis, and validation are treated as one measurable pipeline.", "The system explicitly separates diagnostic success from trustworthy downstream outputs."] },
      { kind: "workflow", title: "Working", bullets: ["Capture synchronized camera streams or offline video.", "Extract pose landmarks and triangulate 3D movement.", "Stabilize trajectories and compute gait/kinematic features.", "Apply validity gates before promoting results into analysis."] },
      { kind: "stack", title: "Tech Stack", bullets: ["Python", "Computer Vision", "3D Geometry", "Pose Estimation", "Signal Smoothing", "Dashboard UI"] },
      { kind: "resources", title: "Receipts", bullets: ["3D triangulation success: 0.993333 on the documented evaluation run.", "Mean reprojection error: 4.78 px; median: 4.01 px.", "Jitter reduction: 77%; acceleration reduction: 88%.", "Phase 4 gait work passed the full 263-test suite."] },
      { kind: "github", title: "GitHub", buttonText: "View Repository" }
    ]
  },
  {
    id: "smart-grid-ids",
    spineTitle: "Smart Grid IDS",
    category: "Published Research",
    leather: "leather-charcoal",
    accent: "#56636b",
    githubUrl: "https://github.com/Mrudula-itsjuzme/cyberattack-on-smart-grids",
    demoUrl: "https://ieeexplore.ieee.org/document/11083563",
    pages: [
      { kind: "cover", title: "Cyberattack Detection on Smart Grids", subtitle: "IEC-104 Intrusion Detection · Published Research", author: "Pedamallu Sai Mrudula", year: "2025" },
      { kind: "overview", title: "Overview", bullets: ["Intrusion-detection and analysis pipeline for IEC 60870-5-104 smart-grid traffic.", "Covers preprocessing, feature engineering, supervised attack detection, benchmarking, and publication-oriented analysis.", "Repository represents the engineering side of the research work."] },
      { kind: "architecture", title: "Pipeline", diagram: ["IEC-104 traffic", "Preprocessing", "Feature engineering", "Model training", "Evaluation + explainability"], text: "The repository includes experiment scripts, model comparisons, result plots, and research artifacts." },
      { kind: "stack", title: "Tech Stack", bullets: ["Python", "Pandas", "NumPy", "Scikit-learn", "IEC-104", "Cybersecurity ML"] },
      { kind: "resources", title: "Receipts", bullets: ["Connected IEEE publication available directly from the project.", "Repository benchmark ensemble accuracy: 91.81%.", "Contains result plots, confusion matrices, analysis folders, and publication artifacts.", "First-author research work should be treated as a flagship proof point, not buried as coursework."] },
      { kind: "github", title: "Repository & Paper", buttonText: "View Repository" }
    ]
  },
  {
    id: "finance-controller",
    spineTitle: "Finance Controller",
    category: "AI Systems",
    leather: "leather-brown",
    accent: "#8a6542",
    githubUrl: "https://github.com/Mrudula-itsjuzme/razor-pay",
    demoUrl: "https://github.com/Mrudula-itsjuzme/razor-pay",
    pages: [
      { kind: "cover", title: "Evidence-First Finance Controller", subtitle: "Provenance-Backed Reconciliation", author: "Pedamallu Sai Mrudula", year: "2026" },
      { kind: "overview", title: "Overview", bullets: ["Built around one rule: matching numbers is not the same as proving where money moved.", "Reconstructs money lifecycles from orders, payments, fees, taxes, settlements, refunds, and bank transactions.", "AI can explain and rank hypotheses, but cannot authorize financial closure."] },
      { kind: "architecture", title: "Architecture", diagram: ["Financial records", "Provenance graph", "Evidence contracts", "Deterministic gate", "AI investigator"], text: "Reconciliation authority stays deterministic. The AI layer is explanation-only and cannot override contract, temporal, or provenance validity." },
      { kind: "workflow", title: "Judge Cases", bullets: ["Clean reconciliation and split settlement.", "Missing fee evidence.", "Same amount but wrong transaction lineage.", "Duplicate UTR.", "Perfect refund discrepancy with wrong provenance.", "Pending bank-SLA-safe case."] },
      { kind: "stack", title: "Tech Stack", bullets: ["Python", "FastAPI", "NetworkX", "Evidence Contracts", "Synthetic Eval Harness", "Red-Team Tests"] },
      { kind: "resources", title: "Receipts", bullets: ["105-case fixed safety benchmark across 21 scenario families.", "Observed unsafe closures: 0 on that fixed synthetic benchmark.", "Proof citation precision: 100% on the documented benchmark.", "2,500-case scale run reports ~9,430 cases/sec reconciliation throughput."] },
      { kind: "github", title: "GitHub", buttonText: "View Repository" }
    ]
  },
  {
    id: "cyberbio",
    spineTitle: "CyberBio",
    category: "Adversarial ML Research",
    leather: "leather-navy",
    accent: "#445d78",
    githubUrl: "https://github.com/Mrudula-itsjuzme/cyberbio",
    demoUrl: "https://github.com/Mrudula-itsjuzme/cyberbio",
    pages: [
      { kind: "cover", title: "Adversarial Attacks & Defenses in Sequence Models", subtitle: "Materials Science · Synthetic Bio-Cybersecurity", author: "Pedamallu Sai Mrudula", year: "2026" },
      { kind: "overview", title: "Overview", bullets: ["A multi-phase adversarial ML investigation across materials sequence modelling and a safe synthetic biological benchmark.", "The project explicitly documents failed hypotheses, confounders, controls, and forensic audits instead of hiding them.", "Current work includes probabilistic attacks, defensive training, interpretability checks, and benchmark hardening."] },
      { kind: "workflow", title: "Research Progression", bullets: ["Baseline target model and token-level attacks.", "Controlled defense ablations and multi-seed replication.", "Forensic architecture audit that overturned the original length-sensitivity hypothesis.", "MCMC attack generator, residualization, and valid SMILES randomization controls.", "Synthetic DNA-like benchmark for safe bio-cyber adversarial experiments."] },
      { kind: "stack", title: "Tech Stack", bullets: ["PyTorch", "Transformers", "CNNs", "RDKit", "MCMC", "Adversarial Training", "Scientific Evaluation"] },
      { kind: "resources", title: "Receipts", bullets: ["A simple length-only baseline beat the Transformer validation MAE in the audited materials setup, exposing shortcut learning.", "MCMC attacks reached extreme prediction drifts up to 158 K in the documented experiments.", "Adversarial training reduced worst-case MCMC drift while leaving some structural fragility unresolved.", "The repository keeps the falsified hypotheses as part of the research record."] },
      { kind: "github", title: "GitHub", buttonText: "View Repository" }
    ]
  },
  {
    id: "quest-engine",
    spineTitle: "HABBIT Quests",
    category: "Product Engineering",
    leather: "leather-forest",
    accent: "#4b7a5a",
    githubUrl: "https://github.com/Mrudula-itsjuzme/quests",
    demoUrl: "https://github.com/Mrudula-itsjuzme/quests",
    pages: [
      { kind: "cover", title: "HABBIT Quest Engine", subtitle: "Full-Stack Product System", author: "Pedamallu Sai Mrudula", year: "2026" },
      { kind: "overview", title: "Overview", bullets: ["Standalone quest hub spanning a React experience, Express API, PostgreSQL state, Supabase auth, and Flutter client.", "Daily, weekly, and monthly quest generation uses documented rarity rules, cooldowns, idempotent rewards, and user-owned progression state.", "Production mode rejects development shortcuts and local-only provider configurations."] },
      { kind: "architecture", title: "Architecture", diagram: ["React / Flutter", "Supabase auth", "Express API", "PostgreSQL", "Provider adapters"], text: "The product uses same-origin web deployment, explicit native API configuration, transactional migrations, versioned writes, and production security guards." },
      { kind: "workflow", title: "System Features", bullets: ["Quest generation and progression.", "Submission/review workflow.", "XP ledger, streaks, rewards, and collectibles.", "Explore hotspots and GPS-derived capture clusters.", "Native and web clients sharing the same backend state model."] },
      { kind: "stack", title: "Tech Stack", bullets: ["React", "TypeScript", "Express", "PostgreSQL", "Supabase", "Flutter", "Docker"] },
      { kind: "resources", title: "Receipts", bullets: ["Production requires PostgreSQL, real OIDC/JWT auth, and non-local providers.", "Versioned writes require idempotency keys.", "Ordered transactional migrations are the schema source of truth.", "Reduced-motion and static fallbacks are built into the experience."] },
      { kind: "github", title: "GitHub", buttonText: "View Repository" }
    ]
  },
  {
    id: "eeg-reconstruction",
    spineTitle: "EEG Reconstruction",
    category: "Research Prototype",
    leather: "leather-charcoal",
    accent: "#4a4a4a",
    githubUrl: "https://github.com/Mrudula-itsjuzme/MFC3_D3_EEG_Recon_ADMM",
    demoUrl: "https://github.com/Mrudula-itsjuzme/MFC3_D3_EEG_Recon_ADMM",
    pages: [
      { kind: "cover", title: "Time-Varying EEG Reconstruction", subtitle: "Graph-Based Research Implementation", author: "Pedamallu Sai Mrudula", year: "2026" },
      { kind: "overview", title: "Overview", bullets: ["Structured EEG reconstruction using graph assumptions and iterative optimization.", "Presented as a research pipeline with reproducible setup, assumptions, method notes, and outputs."] },
      { kind: "architecture", title: "Architecture", diagram: ["EEG input", "Graph construction", "ADMM updates", "Reconstructed signal"], text: "The implementation keeps the reconstruction stages explicit so assumptions and evaluation behavior can be inspected." },
      { kind: "stack", title: "Tech Stack", bullets: ["Python", "NumPy", "Signal Processing", "Graph Methods", "ADMM", "Research Documentation"] },
      { kind: "github", title: "GitHub", buttonText: "View Repository" }
    ]
  },
  {
    id: "solar-panel-fault-detection",
    spineTitle: "PV Fault Study",
    category: "Published Research",
    leather: "leather-brown",
    accent: "#8f6a29",
    githubUrl: "https://github.com/Mrudula-itsjuzme/solarpanel-fault-detection",
    demoUrl: "https://github.com/Mrudula-itsjuzme/solarpanel-fault-detection",
    pages: [
      { kind: "cover", title: "Solar Panel Fault Detection", subtitle: "Photovoltaic Fault Classification", author: "Pedamallu Sai Mrudula", year: "2025" },
      { kind: "overview", title: "Overview", bullets: ["Applied deep-learning work for photovoltaic fault detection and classification.", "The portfolio entry should be read as a research artifact rather than a generic CNN exercise."] },
      { kind: "stack", title: "Tech Stack", bullets: ["Python", "Deep Learning", "GRU", "PV Fault Analysis", "Experiment Evaluation"] },
      { kind: "resources", title: "Receipts", bullets: ["Published research reports 96% binary performance and 91% across 12 fault classes.", "Keep repository claims aligned with the exact experiment artifacts available publicly."] },
      { kind: "github", title: "GitHub", buttonText: "View Repository" }
    ]
  },
  {
    id: "portfolio-site",
    spineTitle: "Portfolio Archive",
    category: "Creative Engineering",
    leather: "leather-navy",
    accent: "#37506f",
    githubUrl: "https://github.com/Mrudula-itsjuzme/portfolio-site",
    demoUrl: "https://mrudula-itsjuzme.github.io/portfolio-site/",
    pages: [
      { kind: "cover", title: "Digital Library Portfolio", subtitle: "Creative Frontend Engineering", author: "Pedamallu Sai Mrudula", year: "2026" },
      { kind: "overview", title: "Overview", bullets: ["A portfolio designed as an inspectable archive instead of a static project-card grid.", "Projects become volumes containing architecture, results, links, and evidence.", "The creative metaphor is intentionally paired with a recruiter-friendly evidence layer."] },
      { kind: "stack", title: "Tech Stack", bullets: ["React", "Vite", "Framer Motion", "Three.js", "Node.js", "Express"] },
      { kind: "github", title: "GitHub", buttonText: "View Repository" }
    ]
  }
];
