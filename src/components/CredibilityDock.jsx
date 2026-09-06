import { useEffect, useState } from "react";

const publications = [
  {
    venue: "IEEE Access · 2025",
    role: "First author",
    title: "Smart Grid Intrusion Detection for IEC 60870-5-104 With Feature Optimization, Privacy Protection, and Honeypot-Firewall Integration",
    evidence: "99.29% accuracy · 94.8% recall · 4.1% false-positive rate",
    href: "https://doi.org/10.1109/ACCESS.2025.3590151",
  },
  {
    venue: "Energy Conversion and Management: X · 2025",
    role: "Co-author",
    title: "Lightweight Hierarchical Spatial Feature Extraction and Sequential Modeling for PV Fault Detection Using Pyramid Network and GRU for Edge Applications",
    evidence: "96% binary accuracy · 91% across 12 classes · 3.5M parameters",
    href: "https://doi.org/10.1016/j.ecmx.2025.101293",
  },
];

const flagship = [
  {
    title: "Motion Capture",
    note: "Dual-camera markerless mocap, gait analysis, validation-first pipeline",
    href: "https://github.com/Mrudula-itsjuzme/Motion-capture",
  },
  {
    title: "AI Finance Controller",
    note: "Provenance-backed reconciliation with deterministic closure gates",
    href: "https://github.com/Mrudula-itsjuzme/razor-pay",
  },
  {
    title: "Smart Grid IDS",
    note: "Published IEC-104 intrusion detection research and engineering artifacts",
    href: "https://github.com/Mrudula-itsjuzme/cyberattack-on-smart-grids",
  },
  {
    title: "CyberBio",
    note: "Adversarial sequence modelling, falsification, MCMC attacks and defenses",
    href: "https://github.com/Mrudula-itsjuzme/cyberbio",
  },
];

const contributions = [
  {
    project: "AI Council",
    work: "Manifest-based plugin system with discovery, validation, runtime hooks, routing rules, docs and tests",
    href: "https://github.com/shrixtacy/Ai-Council/pull/244",
    tag: "Feature PR",
  },
  {
    project: "NVIDIA TensorRT Pose",
    work: "ONNX-backed torch2trt conversion fix for modern notebook environments",
    href: "https://github.com/NVIDIA-AI-IOT/trt_pose/pull/188",
    tag: "Bug fix PR",
  },
  {
    project: "NVIDIA DALI",
    work: "Documentation corrections across DALI docs",
    href: "https://github.com/NVIDIA/DALI/pull/6459",
    tag: "Docs PR",
  },
  {
    project: "NVIDIA NeMo",
    work: "Documentation corrections across NeMo Speech docs",
    href: "https://github.com/NVIDIA-NeMo/Speech/pull/16130",
    tag: "Docs PR",
  },
  {
    project: "NVIDIA CUTLASS",
    work: "Documentation corrections across C++ and CuTe docs",
    href: "https://github.com/NVIDIA/cutlass/pull/3530",
    tag: "Docs PR",
  },
];

const tabs = [
  ["fast", "Fast lane"],
  ["papers", "Publications"],
  ["oss", "Contributions"],
];

function ExternalLink({ href, children, className = "" }) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export default function CredibilityDock() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("fast");

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openTo = (nextTab) => {
    setTab(nextTab);
    setOpen(true);
  };

  return (
    <>
      <style>{`
        .cred-dock {
          position: fixed;
          right: 18px;
          bottom: 18px;
          z-index: 220;
          display: flex;
          gap: 8px;
          align-items: center;
          padding: 7px;
          border: 1px solid rgba(205, 174, 112, .34);
          border-radius: 999px;
          background: rgba(18, 13, 9, .88);
          box-shadow: 0 12px 38px rgba(0,0,0,.34);
          backdrop-filter: blur(16px);
        }
        .cred-dock button {
          border: 0;
          color: #e4cf9e;
          background: transparent;
          font: 600 .7rem/1 'Outfit', sans-serif;
          text-transform: uppercase;
          letter-spacing: .09em;
          padding: 10px 12px;
          border-radius: 999px;
          cursor: pointer;
        }
        .cred-dock button:first-child {
          background: rgba(205, 174, 112, .14);
          color: #f3dfae;
        }
        .cred-overlay {
          position: fixed;
          inset: 0;
          z-index: 230;
          display: grid;
          place-items: center;
          padding: clamp(12px, 4vw, 38px);
          background: rgba(5, 4, 3, .76);
          backdrop-filter: blur(8px);
        }
        .cred-panel {
          width: min(1040px, 100%);
          max-height: min(88vh, 900px);
          overflow: hidden;
          color: #2b2118;
          background: linear-gradient(180deg, #efe5d1 0%, #d8c5a4 100%);
          border: 1px solid rgba(91, 61, 35, .38);
          box-shadow: 0 30px 90px rgba(0,0,0,.52);
          position: relative;
        }
        .cred-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle at 12% 8%, rgba(255,255,255,.42), transparent 30%);
          opacity: .8;
        }
        .cred-panel-inner {
          position: relative;
          z-index: 1;
          max-height: min(88vh, 900px);
          overflow-y: auto;
          padding: clamp(24px, 5vw, 54px);
        }
        .cred-kicker {
          margin: 0;
          font: 700 .7rem/1.2 'Outfit', sans-serif;
          letter-spacing: .18em;
          text-transform: uppercase;
          opacity: .58;
        }
        .cred-title {
          margin: .45rem 0 .55rem;
          font: 700 clamp(2rem, 5vw, 3.6rem)/1.03 'Cinzel', serif;
          letter-spacing: -.02em;
        }
        .cred-subtitle {
          margin: 0 0 1.6rem;
          max-width: 720px;
          font: 1.08rem/1.55 'Cormorant Garamond', serif;
          opacity: .78;
        }
        .cred-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 1.6rem;
        }
        .cred-tab {
          border: 1px solid rgba(71,45,28,.2);
          background: rgba(255,248,234,.28);
          color: inherit;
          padding: 9px 12px;
          cursor: pointer;
          font: 650 .72rem/1 'Outfit', sans-serif;
          text-transform: uppercase;
          letter-spacing: .08em;
        }
        .cred-tab.active {
          background: #322216;
          color: #f0dbab;
          border-color: #322216;
        }
        .cred-close {
          position: absolute;
          top: 15px;
          right: 15px;
          z-index: 3;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(71,45,28,.25);
          background: rgba(245,235,214,.82);
          color: #39281c;
          cursor: pointer;
          font-size: 1.4rem;
        }
        .cred-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 1.8rem;
        }
        .cred-action {
          text-decoration: none;
          color: #f0dbab;
          background: #322216;
          border: 1px solid #322216;
          padding: 10px 13px;
          font: 650 .72rem/1 'Outfit', sans-serif;
          text-transform: uppercase;
          letter-spacing: .07em;
        }
        .cred-action.secondary {
          color: #39281c;
          background: transparent;
          border-color: rgba(57,40,28,.28);
        }
        .cred-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .cred-card {
          text-decoration: none;
          color: inherit;
          display: block;
          border: 1px solid rgba(72,47,30,.18);
          background: rgba(255,249,237,.36);
          padding: 16px;
          transition: transform .14s ease, background .14s ease;
        }
        .cred-card:hover {
          transform: translateY(-2px);
          background: rgba(255,249,237,.62);
        }
        .cred-card h3 {
          margin: 0 0 5px;
          font: 700 1rem/1.25 'Cinzel', serif;
        }
        .cred-card p {
          margin: 0;
          font: 1rem/1.45 'Cormorant Garamond', serif;
          opacity: .76;
        }
        .cred-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 8px;
          font: 650 .68rem/1 'Outfit', sans-serif;
          text-transform: uppercase;
          letter-spacing: .08em;
          opacity: .64;
        }
        .cred-paper {
          display: block;
          text-decoration: none;
          color: inherit;
          padding: 18px 0;
          border-top: 1px solid rgba(72,47,30,.18);
        }
        .cred-paper:last-child { border-bottom: 1px solid rgba(72,47,30,.18); }
        .cred-paper h3 {
          margin: 0 0 7px;
          max-width: 820px;
          font: 700 clamp(1.04rem, 2vw, 1.28rem)/1.35 'Cinzel', serif;
        }
        .cred-paper p {
          margin: 0;
          font: 1rem/1.45 'Cormorant Garamond', serif;
          opacity: .76;
        }
        .cred-contrib {
          display: grid;
          grid-template-columns: minmax(130px, .38fr) minmax(0, 1fr) auto;
          gap: 16px;
          align-items: start;
          text-decoration: none;
          color: inherit;
          padding: 16px 0;
          border-top: 1px solid rgba(72,47,30,.18);
        }
        .cred-contrib:last-child { border-bottom: 1px solid rgba(72,47,30,.18); }
        .cred-contrib strong { font: 700 .9rem/1.25 'Cinzel', serif; }
        .cred-contrib span { font: .95rem/1.4 'Cormorant Garamond', serif; }
        .cred-tag {
          font: 650 .64rem/1 'Outfit', sans-serif !important;
          text-transform: uppercase;
          letter-spacing: .08em;
          opacity: .58;
          white-space: nowrap;
        }
        @media (max-width: 720px) {
          .cred-dock {
            right: 10px;
            bottom: 10px;
            left: 10px;
            justify-content: center;
          }
          .cred-dock button { padding: 10px 9px; font-size: .63rem; }
          .cred-grid { grid-template-columns: 1fr; }
          .cred-contrib { grid-template-columns: 1fr; gap: 5px; }
          .cred-tag { white-space: normal; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cred-card { transition: none; }
          .cred-card:hover { transform: none; }
        }
      `}</style>

      <div className="cred-dock" aria-label="Portfolio shortcuts">
        <button type="button" onClick={() => openTo("fast")}>⚡ Recruiter lane</button>
        <button type="button" onClick={() => openTo("papers")}>Papers</button>
        <button type="button" onClick={() => openTo("oss")}>Contribs</button>
      </div>

      {open && (
        <div className="cred-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }} role="dialog" aria-modal="true" aria-label="Evidence index">
          <section className="cred-panel">
            <button className="cred-close" type="button" onClick={() => setOpen(false)} aria-label="Close evidence index">×</button>
            <div className="cred-panel-inner">
              <p className="cred-kicker">Evidence index · skip the shelves</p>
              <h2 className="cred-title">The Receipts</h2>
              <p className="cred-subtitle">A fast route through the work, papers, source, and contributions. The archive is for wandering. This is for deciding quickly.</p>

              <div className="cred-tabs" role="tablist" aria-label="Evidence categories">
                {tabs.map(([id, label]) => (
                  <button key={id} type="button" className={`cred-tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)} role="tab" aria-selected={tab === id}>{label}</button>
                ))}
              </div>

              {tab === "fast" && (
                <div>
                  <div className="cred-actions">
                    <ExternalLink className="cred-action" href={`${import.meta.env.BASE_URL}resume.pdf`}>Resume ↗</ExternalLink>
                    <ExternalLink className="cred-action secondary" href="https://github.com/Mrudula-itsjuzme">GitHub ↗</ExternalLink>
                    <ExternalLink className="cred-action secondary" href="https://www.linkedin.com/in/pedamallusaimrudula/">LinkedIn ↗</ExternalLink>
                    <a className="cred-action secondary" href="mailto:mrudulasankar2007@gmail.com">Email</a>
                  </div>
                  <div className="cred-grid">
                    {flagship.map((item) => (
                      <ExternalLink key={item.title} className="cred-card" href={item.href}>
                        <h3>{item.title}</h3>
                        <p>{item.note}</p>
                      </ExternalLink>
                    ))}
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <p className="cred-kicker" style={{ marginBottom: 8 }}>Peer-reviewed work</p>
                    {publications.map((paper) => (
                      <ExternalLink key={paper.href} className="cred-paper" href={paper.href}>
                        <div className="cred-meta"><span>{paper.venue}</span><span>·</span><span>{paper.role}</span></div>
                        <h3>{paper.title}</h3>
                        <p>{paper.evidence}</p>
                      </ExternalLink>
                    ))}
                  </div>
                </div>
              )}

              {tab === "papers" && (
                <div>
                  {publications.map((paper) => (
                    <ExternalLink key={paper.href} className="cred-paper" href={paper.href}>
                      <div className="cred-meta"><span>{paper.venue}</span><span>·</span><span>{paper.role}</span></div>
                      <h3>{paper.title}</h3>
                      <p>{paper.evidence} · DOI ↗</p>
                    </ExternalLink>
                  ))}
                </div>
              )}

              {tab === "oss" && (
                <div>
                  <p className="cred-subtitle" style={{ marginBottom: 10 }}>Selected external pull requests. Status is intentionally not overstated here. Open the PR for the current review or merge state.</p>
                  {contributions.map((item) => (
                    <ExternalLink key={item.href} className="cred-contrib" href={item.href}>
                      <strong>{item.project}</strong>
                      <span>{item.work}</span>
                      <span className="cred-tag">{item.tag} ↗</span>
                    </ExternalLink>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
