export const projects = [
  {
    id: "fraud-detection-system",
    spineTitle: "Fraud Detection",
    category: "Machine Learning",
    leather: "leather-oxblood",
    accent: "#8e3b2f",
    githubUrl: "https://github.com/Mrudula-itsjuzme",
    demoUrl: "https://mrudula-itsjuzme.vercel.app",
    pages: [
      {
        kind: "cover",
        title: "Fraud Detection System",
        subtitle: "Machine Learning Project",
        author: "Mrudula",
        year: "2026"
      },
      {
        kind: "overview",
        title: "Overview",
        bullets: [
          "Problem: fraudulent transactions are sparse and hard to detect early.",
          "Goal: reduce false negatives while keeping review load practical.",
          "Idea: combine feature engineering with a tuned gradient model and threshold strategy."
        ]
      },
      {
        kind: "architecture",
        title: "Architecture",
        diagram: ["User Input", "Data Preprocessing", "ML Model", "Prediction"],
        text: "A staged pipeline keeps data quality checks and inference isolated for reliability and easier debugging."
      },
      {
        kind: "workflow",
        title: "Working",
        bullets: [
          "Ingest transaction streams.",
          "Normalize and enrich signals.",
          "Score each transaction in real time.",
          "Route high-risk events for analyst review.",
          "Retrain model with confirmed labels."
        ]
      },
      {
        kind: "stack",
        title: "Tech Stack",
        bullets: ["Python", "TensorFlow", "Flask", "React"]
      },
      {
        kind: "resources",
        title: "Resources",
        bullets: [
          "Kaggle fraud datasets",
          "Google ML fraud prevention guides",
          "Research papers on imbalance learning"
        ]
      },
      {
        kind: "github",
        title: "GitHub",
        buttonText: "View Code"
      }
    ]
  },
  {
    id: "smart-grid-ids",
    spineTitle: "Smart Grid IDS",
    category: "Cybersecurity",
    leather: "leather-emerald",
    accent: "#3f6648",
    githubUrl: "https://github.com/Mrudula-itsjuzme",
    demoUrl: "https://mrudula-itsjuzme.vercel.app",
    pages: [
      { kind: "cover", title: "Smart Grid IDS", subtitle: "Privacy-Aware Detection", author: "Mrudula", year: "2026" },
      {
        kind: "overview",
        title: "Overview",
        bullets: [
          "Problem: operational traffic anomalies are difficult to separate from regular bursts.",
          "Goal: detect attacks earlier without exposing sensitive grid telemetry.",
          "Idea: hybrid anomaly plus classifier flow with explainable outputs."
        ]
      },
      {
        kind: "architecture",
        title: "Architecture",
        diagram: ["Traffic Capture", "Feature Selection", "Detection Model", "Alert + Explain"],
        text: "The architecture separates feature governance from model scoring to keep updates safe."
      },
      {
        kind: "workflow",
        title: "Working",
        bullets: [
          "Capture packets from mirrored streams.",
          "Extract protocol and temporal features.",
          "Score with anomaly and supervised stages.",
          "Trigger prioritized analyst alerts.",
          "Generate SHAP-based explanations."
        ]
      },
      { kind: "stack", title: "Tech Stack", bullets: ["Python", "XGBoost", "Scikit-learn", "Wireshark"] },
      { kind: "resources", title: "Resources", bullets: ["IEEE Access paper", "PCAP corpora", "NIST ICS guidance"] },
      { kind: "github", title: "GitHub", buttonText: "View Code" }
    ]
  },
  {
    id: "feature-lab",
    spineTitle: "Feature Lab",
    category: "Explainable AI",
    leather: "leather-navy",
    accent: "#37506f",
    githubUrl: "https://github.com/Mrudula-itsjuzme",
    demoUrl: "https://mrudula-itsjuzme.vercel.app",
    pages: [
      { kind: "cover", title: "Feature Analysis Lab", subtitle: "Interpretable ML", author: "Mrudula", year: "2026" },
      {
        kind: "overview",
        title: "Overview",
        bullets: [
          "Problem: black-box predictions reduce trust in critical systems.",
          "Goal: expose why the model made each decision.",
          "Idea: combine SHAP, permutation tests, and scenario slicing."
        ]
      },
      {
        kind: "architecture",
        title: "Architecture",
        diagram: ["Dataset", "Model Training", "Explainability Layer", "Insight Report"],
        text: "Interpretability is treated as a first-class layer rather than a post-process."
      },
      {
        kind: "workflow",
        title: "Working",
        bullets: [
          "Train baseline and optimized models.",
          "Rank features by global and local importance.",
          "Inspect edge cases and error clusters.",
          "Publish actionable model cards."
        ]
      },
      { kind: "stack", title: "Tech Stack", bullets: ["Python", "SHAP", "Pandas", "Plotly"] },
      { kind: "resources", title: "Resources", bullets: ["SHAP docs", "Interpretable ML book", "Open benchmark datasets"] },
      { kind: "github", title: "GitHub", buttonText: "View Code" }
    ]
  },
  {
    id: "traffic-atlas",
    spineTitle: "Traffic Atlas",
    category: "Network Analysis",
    leather: "leather-charcoal",
    accent: "#4a4a4a",
    githubUrl: "https://github.com/Mrudula-itsjuzme",
    demoUrl: "https://mrudula-itsjuzme.vercel.app",
    pages: [
      { kind: "cover", title: "Network Traffic Atlas", subtitle: "Flow Intelligence", author: "Mrudula", year: "2026" },
      {
        kind: "overview",
        title: "Overview",
        bullets: [
          "Problem: high-volume traffic hides anomalies.",
          "Goal: map traffic behavior clearly for investigation.",
          "Idea: aggregate flow topology with statistical profiling."
        ]
      },
      {
        kind: "architecture",
        title: "Architecture",
        diagram: ["Packet Stream", "Flow Builder", "Feature Engine", "Visual Analytics"],
        text: "Flow-centric aggregation makes patterns visible without full-packet storage."
      },
      {
        kind: "workflow",
        title: "Working",
        bullets: [
          "Collect packet captures.",
          "Build directional flow records.",
          "Compute behavior vectors.",
          "Highlight outliers and protocol drift."
        ]
      },
      { kind: "stack", title: "Tech Stack", bullets: ["Python", "Scapy", "Pandas", "Matplotlib"] },
      { kind: "resources", title: "Resources", bullets: ["Wireshark refs", "PCAP playgrounds", "Flow analytics papers"] },
      { kind: "github", title: "GitHub", buttonText: "View Code" }
    ]
  },
  {
    id: "crypto-notebook",
    spineTitle: "Crypto Notebook",
    category: "Security Engineering",
    leather: "leather-amber",
    accent: "#8f6a29",
    githubUrl: "https://github.com/Mrudula-itsjuzme",
    demoUrl: "https://mrudula-itsjuzme.vercel.app",
    pages: [
      { kind: "cover", title: "Encryption Protocols", subtitle: "Secure Channel Design", author: "Mrudula", year: "2026" },
      {
        kind: "overview",
        title: "Overview",
        bullets: [
          "Problem: weak key handling creates hidden risks.",
          "Goal: implement secure-by-default communication.",
          "Idea: harden key lifecycle and protocol validation."
        ]
      },
      {
        kind: "architecture",
        title: "Architecture",
        diagram: ["Key Generation", "Handshake", "Encrypted Session", "Audit Trail"],
        text: "Each stage emits verifiable artifacts for debugging and compliance."
      },
      {
        kind: "workflow",
        title: "Working",
        bullets: [
          "Generate and rotate keys.",
          "Negotiate secure handshake.",
          "Encrypt payload transport.",
          "Validate and log security events."
        ]
      },
      { kind: "stack", title: "Tech Stack", bullets: ["Python", "PyCryptodome", "OpenSSL", "Flask"] },
      { kind: "resources", title: "Resources", bullets: ["NIST guidelines", "TLS RFCs", "OWASP cryptography cheat sheet"] },
      { kind: "github", title: "GitHub", buttonText: "View Code" }
    ]
  },
  {
    id: "forecast-engine",
    spineTitle: "Forecast Engine",
    category: "Time Series",
    leather: "leather-plum",
    accent: "#594168",
    githubUrl: "https://github.com/Mrudula-itsjuzme",
    demoUrl: "https://mrudula-itsjuzme.vercel.app",
    pages: [
      { kind: "cover", title: "Time Series Forecasting", subtitle: "Sequence Modeling", author: "Mrudula", year: "2026" },
      {
        kind: "overview",
        title: "Overview",
        bullets: [
          "Problem: fluctuating demand is difficult to predict reliably.",
          "Goal: improve forecast quality and confidence intervals.",
          "Idea: LSTM plus transformer baselines with drift monitoring."
        ]
      },
      {
        kind: "architecture",
        title: "Architecture",
        diagram: ["Historical Data", "Feature Windowing", "Forecast Model", "Decision Support"],
        text: "The system uses rolling windows and validation slices to avoid leakage."
      },
      {
        kind: "workflow",
        title: "Working",
        bullets: [
          "Prepare temporal features.",
          "Train and compare sequence models.",
          "Evaluate MAE and RMSE bands.",
          "Deploy periodic retraining jobs."
        ]
      },
      { kind: "stack", title: "Tech Stack", bullets: ["Python", "TensorFlow", "NumPy", "Plotly"] },
      { kind: "resources", title: "Resources", bullets: ["M4 dataset", "Forecasting papers", "Model monitoring references"] },
      { kind: "github", title: "GitHub", buttonText: "View Code" }
    ]
  }
];
