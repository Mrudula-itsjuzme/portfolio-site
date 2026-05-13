export const projects = [
  {
    id: "portfolio-site",
    spineTitle: "Portfolio Archive",
    category: "Creative Engineering",
    leather: "leather-navy",
    accent: "#37506f",
    githubUrl: "https://github.com/Mrudula-itsjuzme/portfolio-site",
    demoUrl: "https://mrudula-itsjuzme.github.io/portfolio-site/",
    pages: [
      {
        kind: "cover",
        title: "Digital Library Portfolio",
        subtitle: "Creative Frontend Engineering",
        author: "Pedamallu Sai Mrudula",
        year: "2026"
      },
      {
        kind: "overview",
        title: "Overview",
        bullets: [
          "Problem: most personal portfolios feel like static link dumps.",
          "Goal: present projects as memorable artifacts with context and story.",
          "Idea: transform repositories into books inside an interactive digital archive."
        ]
      },
      {
        kind: "architecture",
        title: "Architecture",
        diagram: ["GitHub metadata", "Prebuilt JSON", "React UI", "Bookshelf viewer"],
        text: "The site loads repository metadata, maps each project into a book-like object, and renders it through an interactive bookshelf and page viewer."
      },
      {
        kind: "workflow",
        title: "Working",
        bullets: [
          "Fetch or load repository metadata.",
          "Map each repository into a project-book structure.",
          "Render projects as spines on a digital bookshelf.",
          "Open each book into a page-flip project viewer.",
          "Keep the experience deployable as a static portfolio."
        ]
      },
      {
        kind: "stack",
        title: "Tech Stack",
        bullets: ["React", "Vite", "Framer Motion", "Three.js", "Node.js", "Express"]
      },
      {
        kind: "resources",
        title: "Notes",
        bullets: [
          "Designed as a creative frontend engineering project.",
          "Uses real repository metadata when available.",
          "Fallback content should stay factual and avoid inflated metrics."
        ]
      },
      {
        kind: "github",
        title: "GitHub",
        buttonText: "View Repository"
      }
    ]
  },
  {
    id: "motion-capture",
    spineTitle: "Motion Capture",
    category: "Applied Systems",
    leather: "leather-forest",
    accent: "#3f6648",
    githubUrl: "https://github.com/Mrudula-itsjuzme/Motion-capture",
    demoUrl: "https://github.com/Mrudula-itsjuzme/Motion-capture",
    pages: [
      {
        kind: "cover",
        title: "Distributed Real-Time Markerless Motion Capture",
        subtitle: "Interactive System Prototype",
        author: "Pedamallu Sai Mrudula",
        year: "2026"
      },
      {
        kind: "overview",
        title: "Overview",
        bullets: [
          "Problem: motion capture is often expensive, hardware-heavy, and difficult to access.",
          "Goal: explore a lighter multi-input motion capture workflow using common devices.",
          "Idea: combine capture, processing, visualization, and validation into one experimental system."
        ]
      },
      {
        kind: "architecture",
        title: "Architecture",
        diagram: ["Camera input", "Pose pipeline", "3D estimation", "Dashboard output"],
        text: "The project is organized as a pipeline so input capture, processing, metrics, and visualization can evolve separately."
      },
      {
        kind: "workflow",
        title: "Working",
        bullets: [
          "Accept webcam, phone, or offline video input.",
          "Extract motion/pose information from visual frames.",
          "Estimate and stabilize 3D movement metrics.",
          "Render outputs through dashboard and viewer components.",
          "Use validation scripts to check behavior and repeatability."
        ]
      },
      {
        kind: "stack",
        title: "Tech Stack",
        bullets: ["Python", "HTML/CSS", "JavaScript", "Computer Vision pipeline", "Dashboard UI"]
      },
      {
        kind: "resources",
        title: "Notes",
        bullets: [
          "Best candidate for a flagship demo.",
          "Add a short GIF or video preview to make the project instantly understandable.",
          "Mention that GitHub language stats may be skewed by frontend/static files if needed."
        ]
      },
      {
        kind: "github",
        title: "GitHub",
        buttonText: "View Repository"
      }
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
      {
        kind: "cover",
        title: "Time-Varying EEG Reconstruction",
        subtitle: "Graph-Based Research Implementation",
        author: "Pedamallu Sai Mrudula",
        year: "2026"
      },
      {
        kind: "overview",
        title: "Overview",
        bullets: [
          "Problem: EEG signals are noisy, high-dimensional, and difficult to reconstruct reliably.",
          "Goal: explore structured reconstruction using graph-based assumptions and iterative optimization.",
          "Idea: document a reproducible implementation with clear setup, method notes, and outputs."
        ]
      },
      {
        kind: "architecture",
        title: "Architecture",
        diagram: ["EEG input", "Graph construction", "ADMM updates", "Reconstructed signal"],
        text: "The implementation is best presented as a research pipeline, where each step should be documented with assumptions, parameters, and evaluation behavior."
      },
      {
        kind: "workflow",
        title: "Working",
        bullets: [
          "Load and inspect EEG-shaped input data.",
          "Build local graph structure for signal relationships.",
          "Run iterative reconstruction updates.",
          "Evaluate reconstruction quality using documented metrics.",
          "Save outputs for comparison and review."
        ]
      },
      {
        kind: "stack",
        title: "Tech Stack",
        bullets: ["Python", "NumPy", "Signal Processing", "Optimization", "Research documentation"]
      },
      {
        kind: "resources",
        title: "Notes",
        bullets: [
          "Keep clone instructions aligned with the current repository name.",
          "Add sample output images if available.",
          "Explain the method in simple terms for non-specialist reviewers."
        ]
      },
      {
        kind: "github",
        title: "GitHub",
        buttonText: "View Repository"
      }
    ]
  },
  {
    id: "solar-panel-fault-detection",
    spineTitle: "PV Fault Study",
    category: "Applied AI Study",
    leather: "leather-brown",
    accent: "#8f6a29",
    githubUrl: "https://github.com/Mrudula-itsjuzme/solarpanel-fault-detection",
    demoUrl: "https://github.com/Mrudula-itsjuzme/solarpanel-fault-detection",
    pages: [
      {
        kind: "cover",
        title: "Solar Panel Fault Detection",
        subtitle: "Applied Model Exploration",
        author: "Pedamallu Sai Mrudula",
        year: "2026"
      },
      {
        kind: "overview",
        title: "Overview",
        bullets: [
          "Problem: photovoltaic faults can reduce energy output and are hard to identify early.",
          "Goal: explore image or signal-based approaches for detecting fault patterns.",
          "Idea: keep the repository transparent by showing actual scripts, data assumptions, and reproducible results."
        ]
      },
      {
        kind: "architecture",
        title: "Architecture",
        diagram: ["Input samples", "Preprocessing", "Model script", "Evaluation output"],
        text: "This project should avoid placeholder claims and show only verified files, scripts, and results present in the repository."
      },
      {
        kind: "workflow",
        title: "Working",
        bullets: [
          "Prepare input samples and labels.",
          "Run baseline model scripts.",
          "Compare errors and predictions.",
          "Document limitations and next steps.",
          "Update README when new folders or experiments are added."
        ]
      },
      {
        kind: "stack",
        title: "Tech Stack",
        bullets: ["Python", "CNN baseline", "Data preprocessing", "Experiment notes"]
      },
      {
        kind: "resources",
        title: "Notes",
        bullets: [
          "Do not list folders in the README unless they exist publicly.",
          "Add a small results table only when the numbers are verified.",
          "This can become much stronger with screenshots, dataset notes, and a clean project structure."
        ]
      },
      {
        kind: "github",
        title: "GitHub",
        buttonText: "View Repository"
      }
    ]
  }
];
