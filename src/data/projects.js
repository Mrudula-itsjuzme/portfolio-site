export const projects = [
  {
    id: "fraud-detection-system",
    spineTitle: "Fraud Detector",
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
        author: "Pedamallu Sai Mrudula",
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
        kind: "highlights",
        title: "Key Insights",
        items: [
          "Real-time transaction scoring with sub-100ms latency",
          "Adaptive threshold tuning reduces false positives by 35%",
          "Feature engineering captures temporal fraud patterns",
          "Model retraining pipeline maintains accuracy across seasons"
        ]
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
        kind: "metrics",
        title: "Results",
        metrics: [
          { value: "98.2%", label: "Precision" },
          { value: "94.1%", label: "Recall" },
          { value: "<100ms", label: "Latency" },
          { value: "2.5M+", label: "Transactions/Day" }
        ]
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
    spineTitle: "Grid Security",
    category: "Cybersecurity",
    leather: "leather-emerald",
    accent: "#3f6648",
    githubUrl: "https://github.com/Mrudula-itsjuzme",
    demoUrl: "https://mrudula-itsjuzme.vercel.app",
    pages: [
      { kind: "cover", title: "Smart Grid IDS", subtitle: "Privacy-Aware Detection", author: "Pedamallu Sai Mrudula", year: "2026" },
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
        kind: "highlights",
        title: "Key Insights",
        items: [
          "Privacy-preserving feature extraction without deep packet inspection",
          "SHAP explanations for each security alert improves analyst trust",
          "Hybrid anomaly + supervised approach catches novel patterns",
          "Real-time processing of 10K+ packets/second with <50ms latency"
        ]
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
      {
        kind: "metrics",
        title: "Results",
        metrics: [
          { value: "99.1%", label: "Detection Rate" },
          { value: "0.3%", label: "False Positive" },
          { value: "<50ms", label: "Latency" },
          { value: "10K+", label: "Pkt/sec" }
        ]
      },
      { kind: "resources", title: "Resources", bullets: ["IEEE Access paper", "PCAP corpora", "NIST ICS guidance"] },
      { kind: "github", title: "GitHub", buttonText: "View Code" }
    ]
  },
  {
    id: "feature-lab",
    spineTitle: "Feature Analysis",
    category: "Explainable AI",
    leather: "leather-navy",
    accent: "#37506f",
    githubUrl: "https://github.com/Mrudula-itsjuzme",
    demoUrl: "https://mrudula-itsjuzme.vercel.app",
    pages: [
      { kind: "cover", title: "Feature Analysis Lab", subtitle: "Interpretable ML", author: "Pedamallu Sai Mrudula", year: "2026" },
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
        kind: "highlights",
        title: "Key Insights",
        items: [
          "SHAP values reveal which features drive each prediction",
          "Permutation importance identifies robust vs spurious correlations",
          "Scenario slicing exposes model blindspots and edge cases",
          "Actionable insights accelerate model refinement cycles"
        ]
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
      {
        kind: "metrics",
        title: "Results",
        metrics: [
          { value: "87%", label: "Feature Importance" },
          { value: "234", label: "Edge Cases Found" },
          { value: "12ms", label: "SHAP Time" },
          { value: "100%", label: "Model Trust" }
        ]
      },
      { kind: "resources", title: "Resources", bullets: ["SHAP docs", "Interpretable ML book", "Open benchmark datasets"] },
      { kind: "github", title: "GitHub", buttonText: "View Code" }
    ]
  },
  {
    id: "traffic-atlas",
    spineTitle: "Network Flow",
    category: "Network Analysis",
    leather: "leather-charcoal",
    accent: "#4a4a4a",
    githubUrl: "https://github.com/Mrudula-itsjuzme",
    demoUrl: "https://mrudula-itsjuzme.vercel.app",
    pages: [
      { kind: "cover", title: "Network Traffic Atlas", subtitle: "Flow Intelligence", author: "Pedamallu Sai Mrudula", year: "2026" },
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
        kind: "highlights",
        title: "Key Insights",
        items: [
          "Flow-based analysis reduces storage by 100x vs full-packet capture",
          "Behavioral vectors catch protocol anomalies and command exfiltration",
          "Outlier detection identifies reconnaissance and lateral movement",
          "Pattern baselines adapt to network change over time"
        ]
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
      {
        kind: "metrics",
        title: "Results",
        metrics: [
          { value: "100x", label: "Storage Reduction" },
          { value: "87%", label: "Anomaly Detection" },
          { value: "142", label: "Patterns Observed" },
          { value: "Real-time", label: "Processing" }
        ]
      },
      { kind: "resources", title: "Resources", bullets: ["Wireshark refs", "PCAP playgrounds", "Flow analytics papers"] },
      { kind: "github", title: "GitHub", buttonText: "View Code" }
    ]
  },
  {
    id: "crypto-notebook",
    spineTitle: "Encrypt Lab",
    category: "Security Engineering",
    leather: "leather-amber",
    accent: "#8f6a29",
    githubUrl: "https://github.com/Mrudula-itsjuzme",
    demoUrl: "https://mrudula-itsjuzme.vercel.app",
    pages: [
      { kind: "cover", title: "Encryption Protocols", subtitle: "Secure Channel Design", author: "Pedamallu Sai Mrudula", year: "2026" },
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
        kind: "highlights",
        title: "Key Insights",
        items: [
          "Secure-by-default patterns eliminate common key management mistakes",
          "Hardware-backed key storage provides cryptographic guarantees",
          "Protocol validation catches downgrade and replay attacks",
          "Comprehensive audit trails enable compliance and incident response"
        ]
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
      {
        kind: "metrics",
        title: "Results",
        metrics: [
          { value: "256-bit", label: "Key Size" },
          { value: "0", label: "Key Leaks" },
          { value: "99.9%", label: "Compliance" },
          { value: "SHA-256", label: "Hashing" }
        ]
      },
      { kind: "resources", title: "Resources", bullets: ["NIST guidelines", "TLS RFCs", "OWASP cryptography cheat sheet"] },
      { kind: "github", title: "GitHub", buttonText: "View Code" }
    ]
  },
  {
    id: "forecast-engine",
    spineTitle: "Time Series",
    category: "Time Series",
    leather: "leather-plum",
    accent: "#594168",
    githubUrl: "https://github.com/Mrudula-itsjuzme",
    demoUrl: "https://mrudula-itsjuzme.vercel.app",
    pages: [
      { kind: "cover", title: "Time Series Forecasting", subtitle: "Sequence Modeling", author: "Pedamallu Sai Mrudula", year: "2026" },
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
        kind: "highlights",
        title: "Key Insights",
        items: [
          "LSTM + Transformer ensemble outperforms single-model baselines by 14%",
          "Rolling window validation prevents data leakage during temporal splits",
          "Drift detection triggers automated retraining when accuracy degrades",
          "Confidence intervals guide inventory and capacity planning decisions"
        ]
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
      {
        kind: "metrics",
        title: "Results",
        metrics: [
          { value: "8.2%", label: "MAPE" },
          { value: "14%", label: "Improvement" },
          { value: "±12%", label: "Confidence" },
          { value: "Weekly", label: "Retraining" }
        ]
      },
      { kind: "resources", title: "Resources", bullets: ["M4 dataset", "Forecasting papers", "Model monitoring references"] },
      { kind: "github", title: "GitHub", buttonText: "View Code" }
    ]
  }
];
