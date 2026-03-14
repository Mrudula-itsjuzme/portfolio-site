export const projectsData = [
  {
    id: 1,
    name: "Smart Grid IDS",
    category: "Cybersecurity",
    color: "#8B4513",
    pages: [
      {
        type: "cover",
        title: "Smart Grid Intrusion Detection",
        subtitle: "A Privacy-Aware ML Framework",
        image: "🔐"
      },
      {
        type: "overview",
        title: "Project Overview",
        content: "An advanced intrusion detection system for smart grids using machine learning. Published in IEEE Access, proposing a privacy-aware framework that maintains communication security under severe class imbalance."
      },
      {
        type: "architecture",
        title: "System Architecture",
        content: "Input Layer: Network traffic and structured metadata\n\nProcessing Layer: Feature extraction, validation checks, and ML-specific logic\n\nOutput Layer: Detection predictions, reports, and operational insights"
      },
      {
        type: "workflow",
        title: "Workflow Process",
        content: "1. Collect and prepare network traffic data\n2. Run detection pipeline and evaluate behavior\n3. Refine model accuracy and publish results\n\nModels: XGBoost, LightGBM, TensorFlow implementations"
      },
      {
        type: "tech",
        title: "Tech Stack",
        content: "Languages: Python\nML Frameworks: TensorFlow, Scikit-learn, XGBoost, LightGBM\nTools: Pandas, NumPy, Wireshark\nPublished: IEEE Access 2025"
      },
      {
        type: "resources",
        title: "Resources",
        content: "GitHub: github.com/Mrudula-itsjuzme/smart-grid-ids\nPaper: IEEE Access\nTools: TensorFlow, Scikit-learn\nDataset: Power System Datasets"
      }
    ]
  },
  {
    id: 2,
    name: "Anomaly Detection",
    category: "AI/ML",
    color: "#D2691E",
    pages: [
      {
        type: "cover",
        title: "Anomaly Detection System",
        subtitle: "Real-time ML-Based Detection",
        image: "🤖"
      },
      {
        type: "overview",
        title: "Project Overview",
        content: "A comprehensive anomaly detection pipeline for identifying unusual patterns in multivariate time-series data. Used in cybersecurity, IoT monitoring, and operational anomaly detection systems."
      },
      {
        type: "architecture",
        title: "System Architecture",
        content: "Input Layer: Time-series sensor data\n\nProcessing Layer: Feature engineering, normalization, detection algorithms\n\nOutput Layer: Anomaly scores, alerts, visualizations"
      },
      {
        type: "workflow",
        title: "Detection Workflow",
        content: "1. Collect streaming data from multiple sources\n2. Apply statistical and ML-based detection\n3. Generate real-time alerts and dashboards\n\nApproach: Isolation Forest, Autoencoders, SHAP analysis"
      },
      {
        type: "tech",
        title: "Tech Stack",
        content: "Languages: Python\nLibraries: Scikit-learn, TensorFlow, Pandas\nVisualization: Matplotlib, Plotly\nDatabase: Time-series optimized storage"
      },
      {
        type: "resources",
        title: "Resources",
        content: "GitHub: github.com/Mrudula-itsjuzme/anomaly-detection\nNotebooks: Jupyter analysis files\nDatasets: Public anomaly datasets"
      }
    ]
  },
  {
    id: 3,
    name: "Feature Analysis",
    category: "Data Science",
    color: "#CD853F",
    pages: [
      {
        type: "cover",
        title: "Feature Importance Analysis",
        subtitle: "Explainable AI for Model Interpretability",
        image: "📊"
      },
      {
        type: "overview",
        title: "Project Overview",
        content: "Comprehensive framework for analyzing feature importance and model interpretability using SHAP values, LIME, and permutation importance. Makes black-box ML models transparent and explainable."
      },
      {
        type: "architecture",
        title: "Architecture",
        content: "Analysis Pipeline: Feature extraction → Importance calculation → Visualization\n\nMethods: SHAP values, LIME explanations, Permutation importance, Correlation analysis"
      },
      {
        type: "workflow",
        title: "Analysis Process",
        content: "1. Train multiple ML models\n2. Extract and compare feature importance\n3. Generate interpretable explanations\n4. Create interactive visualizations\n\nOutput: Feature rankings, dependency plots, decision paths"
      },
      {
        type: "tech",
        title: "Tech Stack",
        content: "Languages: Python\nLibraries: SHAP, LIME, Scikit-learn\nVisualization: Matplotlib, Plotly, Seaborn\nNotebooks: Jupyter standalone analysis"
      },
      {
        type: "resources",
        title: "Resources",
        content: "GitHub: Notebooks and analysis scripts\nPapers: Lundberg & Lee (SHAP)\nTools: SHAP library, LIME framework"
      }
    ]
  },
  {
    id: 4,
    name: "Network Traffic",
    category: "Cybersecurity",
    color: "#A0522D",
    pages: [
      {
        type: "cover",
        title: "Network Traffic Analysis",
        subtitle: "Deep Packet Inspection & Profiling",
        image: "🌐"
      },
      {
        type: "overview",
        title: "Project Overview",
        content: "Advanced network traffic analysis system using Wireshark, libpcap, and Python. Captures, analyzes, and profiles network communication patterns for security and performance monitoring."
      },
      {
        type: "architecture",
        title: "System Design",
        content: "Capture Layer: Raw packet capture using libpcap\n\nAnalysis Layer: Protocol parsing, feature extraction\n\nVisualization Layer: Traffic matrices, flow diagrams, anomaly highlights"
      },
      {
        type: "workflow",
        title: "Traffic Analysis Workflow",
        content: "1. Capture network packets\n2. Parse protocols and extract flows\n3. Calculate statistical features\n4. Detect anomalies and generate reports\n\nOutput: Flow statistics, protocol distribution, behavioral patterns"
      },
      {
        type: "tech",
        title: "Tech Stack",
        content: "Languages: Python, C\nTools: Wireshark, libpcap, scapy\nAnalysis: Pandas, NumPy\nVisualization: Matplotlib, Plotly"
      },
      {
        type: "resources",
        title: "Resources",
        content: "GitHub: Traffic analysis scripts\nReference: Wireshark documentation\nDatasets: PCAP sample files"
      }
    ]
  },
  {
    id: 5,
    name: "Encryption Protocols",
    category: "Cybersecurity",
    color: "#8B6914",
    pages: [
      {
        type: "cover",
        title: "Encryption & Protocol Analysis",
        subtitle: "Cryptographic Security Implementation",
        image: "🔑"
      },
      {
        type: "overview",
        title: "Project Overview",
        content: "Implementation and analysis of modern encryption protocols including TLS/SSL, AES, RSA. Demonstrates secure communication patterns and cryptographic best practices."
      },
      {
        type: "architecture",
        title: "Architecture",
        content: "Layer 1: Cryptographic primitives (AES, RSA, ECDSA)\n\nLayer 2: Protocol implementation (TLS handshake)\n\nLayer 3: Secure communication endpoints"
      },
      {
        type: "workflow",
        title: "Security Workflow",
        content: "1. Generate keys and certificates\n2. Establish encrypted channels\n3. Authenticate peer connections\n4. Transfer secure data\n\nValidation: Security audit and compliance checks"
      },
      {
        type: "tech",
        title: "Tech Stack",
        content: "Languages: Python\nLibraries: cryptography, PyCryptodome\nProtocols: TLS 1.3, AES-256-GCM\nTools: OpenSSL, certificate generation"
      },
      {
        type: "resources",
        title: "Resources",
        content: "GitHub: Encryption examples\nReference: NIST guidelines\nTools: OpenSSL reference"
      }
    ]
  },
  {
    id: 6,
    name: "Time Series Analysis",
    category: "Data Science",
    color: "#DAA520",
    pages: [
      {
        type: "cover",
        title: "Time Series Forecasting",
        subtitle: "LSTM & Transformer Models",
        image: "📈"
      },
      {
        type: "overview",
        title: "Project Overview",
        content: "Advanced time-series forecasting using deep learning models (LSTM, Transformers). Predicts future values in temporal sequences for smart grid operations and system monitoring."
      },
      {
        type: "architecture",
        title: "Model Architecture",
        content: "Input Layer: Historical time-series sequences\n\nProcessing: LSTM cells with attention mechanism\n\nOutput: Future value predictions with confidence intervals"
      },
      {
        type: "workflow",
        title: "Forecasting Process",
        content: "1. Normalize and window time-series data\n2. Train LSTM/Transformer models\n3. Generate predictions\n4. Calculate forecast accuracy\n\nMetrics: MAE, RMSE, MAPE"
      },
      {
        type: "tech",
        title: "Tech Stack",
        content: "Languages: Python\nModels: TensorFlow LSTM, Transformer\nLibraries: Keras, statsmodels\nVisualization: Plotly for interactive charts"
      },
      {
        type: "resources",
        title: "Resources",
        content: "GitHub: Model notebooks\nPapers: Attention Is All You Need\nDatasets: Time-series benchmarks"
      }
    ]
  }
];
