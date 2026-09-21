import { useEffect, useRef, useState, useCallback } from "react";
import {
  identity,
  featuredProjects,
  currentWorks,
  contributions,
  researchRows,
  productProjects,
  otherBuilds,
  community,
  selectionTrail,
  recentThoughts,
  writings,
  publishedWriting,
  currentExperiments,
  unfinishedIdeas,
  heroSticky,
} from "../../data/lab";
import { useCoarsePointer, usePrefersReducedMotion } from "./StickyNote";
import LabHeader from "./LabHeader";
import LightboxModal from "./LightboxModal";
import EssayModal from "./EssayModal";
import DoodleCanvas from "./DoodleCanvas";
import PersonalDesk from "./PersonalDesk";
import MovableScrap from "./MovableScrap";
import InteractionDock from "./InteractionDock";
import GlobalStickyNotes, { makeGlobalNote } from "./GlobalStickyNotes";
import useReveal, { useGlobalReveal } from "./useReveal";
import { playClickSound, playPaperSound } from "./sound";
import {
  StarDoodle,
  ArrowDoodle,
  UnderlineScribble,
  Sparkle,
  CoffeeRing,
  CatDoodle,
  Constellation,
  ScribbleX,
  PaperPlaneDoodle,
  VinylDoodle,
} from "./Doodles";

const IMG = {
  motion: "diagrams/motion.png",
  solar: "diagrams/solar.png",
  portfolio: "diagrams/portfolio.png",
  eeg: "diagrams/eeg.png",
};

const CYBERBIO_MEDIA = [
  {
    id: "defense",
    label: "baseline vs defended",
    src: "https://github.com/Mrudula-itsjuzme/cyberbio/raw/refs/heads/main/materials-adversarial/outputs/baseline_vs_defended_multiseed.png",
    note: "multi-seed robustness comparison",
  },
  {
    id: "ablation",
    label: "ablation",
    src: "https://github.com/Mrudula-itsjuzme/cyberbio/raw/refs/heads/main/materials-adversarial/outputs/ablation_study_chart.png",
    note: "attack / defense ablation",
  },
  {
    id: "mcmc",
    label: "MCMC drift",
    src: "https://github.com/Mrudula-itsjuzme/cyberbio/raw/refs/heads/main/materials-adversarial/outputs/mcmc_steps_drift_curve.png",
    note: "drift across search steps",
  },
];

const ARCHIS_MEDIA = [
  {
    id: "hero",
    label: "workspace",
    src: "https://github.com/Mrudula-itsjuzme/archis/raw/refs/heads/main/docs/assets/archis-hero.svg",
    note: "repo hero · current product direction",
  },
  {
    id: "loop",
    label: "semantic loop",
    src: "https://github.com/Mrudula-itsjuzme/archis/raw/refs/heads/main/docs/assets/semantic-loop.svg",
    note: "semantic interaction loop",
  },
  {
    id: "concept",
    label: "workspace concept",
    src: "https://github.com/Mrudula-itsjuzme/archis/raw/refs/heads/main/docs/assets/workspace-concept.svg",
    note: "product workspace concept",
  },
];

const CYBERBIO_BOARD = [
  {
    id: "defense",
    type: "image",
    src: CYBERBIO_MEDIA[0].src,
    label: "baseline vs defended",
    caption: "multi-seed robustness comparison",
    initial: { x: 44, y: 46, r: -1 },
    kind: "proof-large",
  },
  {
    id: "ablation",
    type: "image",
    src: CYBERBIO_MEDIA[1].src,
    label: "ablation",
    caption: "attack / defense ablation",
    initial: { x: 700, y: 74, r: 2 },
    kind: "proof-small",
  },
  {
    id: "mcmc",
    type: "image",
    src: CYBERBIO_MEDIA[2].src,
    label: "MCMC drift",
    caption: "drift across search steps",
    initial: { x: 665, y: 324, r: -1.6 },
    kind: "proof-small",
  },
];

const ARCHIS_BOARD = [
  {
    id: "hero",
    type: "image",
    src: ARCHIS_MEDIA[0].src,
    label: "workspace",
    caption: "current product direction",
    initial: { x: 40, y: 42, r: -1 },
    kind: "proof-large",
  },
  {
    id: "loop",
    type: "image",
    src: ARCHIS_MEDIA[1].src,
    label: "semantic loop",
    caption: "relationship / intent loop",
    initial: { x: 710, y: 78, r: 2 },
    kind: "proof-small",
  },
  {
    id: "concept",
    type: "image",
    src: ARCHIS_MEDIA[2].src,
    label: "workspace concept",
    caption: "product workspace concept",
    initial: { x: 690, y: 330, r: -1.5 },
    kind: "proof-small",
  },
];

const GALLERY = [
  {
    src: IMG.motion,
    title: "Motion Capture — Markerless Tracking",
    tag: "Project 01",
    caption: "Dual-camera 3D triangulation, joint tracking, and trajectory stabilization.",
    alt: "Motion capture dual camera setup",
  },
  {
    src: IMG.solar,
    title: "Quests — HABBIT Quest Engine",
    tag: "Project 02",
    caption: "Daily quest hub, XP ledger, streak tracking, and progression state.",
    alt: "Quests app screenshot",
  },
  {
    src: IMG.portfolio,
    title: "Archis — Interpreted Space Draft",
    tag: "Project 04",
    caption: "2D Floor plan converted to initial spatial layout and intent hypotheses.",
    alt: "Interpreted space draft",
  },
  {
    src: IMG.eeg,
    title: "Archis — Semantic 3D Room Model",
    tag: "Project 04",
    caption: "Interactive 3D geometry surviving original architectural intent.",
    alt: "3D room model",
  },
  {
    src: IMG.portfolio,
    title: "2am Desk Scene",
    tag: "Workspace",
    caption: "Still here… (and it’s kind of beautiful)",
    alt: "Desk scene polaroid photo",
  },
];

function SectionHead({ kicker, title, accent, sub, id }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal" id={id}>
      <span className="lab-kicker">{kicker}</span>
      <h2 className="lab-h2">
        {title}
        {accent ? (
          <>
            {"\u00A0"}
            <span className="accent">{accent}</span>
          </>
        ) : null}
      </h2>
      {sub ? <p className="lab-sub">{sub}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Project: Motion Capture — technical / spatial                       */
/* ------------------------------------------------------------------ */

function MocapProject({ p, index }) {
  const ref = useReveal();
  return (
    <article ref={ref} className="project project-mocap project-layout-lab reveal" aria-label={p.name}>
      <div className="project-proof-head">
        <div>
          <div className="project-meta-row">
            <span className="project-index">{String(index).padStart(2, "0")} /</span>
            <h3 className="project-title">{p.name}</h3>
            <span className="project-year">{p.year}</span>
          </div>
          <p className="project-blurb">{p.blurb}</p>
        </div>
        {p.repoPrivate ? (
          <div className="project-private-badge">
            <span>research repo</span>
            <strong>private · evidence shown here</strong>
          </div>
        ) : (
          <a className="project-github-btn" href={p.github} target="_blank" rel="noreferrer">
            <span>GitHub</span>
            <strong>source + experiments ↗</strong>
          </a>
        )}
      </div>

      <div className="mocap-clean-layout">
        <figure className="mocap-local-visual">
          <img src={IMG.motion} alt="Motion Capture project diagram" loading="lazy" />
          <figcaption>pipeline / gait-analysis project visual</figcaption>
        </figure>

        <aside className="mocap-metrics-panel">
          <span className="panel-kicker">documented run</span>
          {p.facts.map(([k,v]) => (
            <div className="metric-row" key={k}>
              <span>{k}</span>
              <strong>{v}</strong>
            </div>
          ))}
          <div className="mocap-now">
            <span>validating now</span>
            <p>repeatability · camera quality gates · gait-event reliability · failure cases</p>
          </div>
        </aside>
      </div>

      <div className="tag-row">{p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
      <div className="project-edge-doodles" aria-hidden="true"><ArrowDoodle /><Sparkle size={14} /></div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Project: Quests — product system                                    */
/* ------------------------------------------------------------------ */

function QuestsProject({ p, index }) {
  const ref = useReveal();
  return (
    <article ref={ref} className="project project-quests project-layout-product reveal" aria-label={p.name}>
      <div className="project-proof-head">
        <div>
          <div className="project-meta-row">
            <span className="project-index">{String(index).padStart(2, "0")} /</span>
            <h3 className="project-title">{p.name}</h3>
            <span className="project-year">{p.year}</span>
          </div>
          <p className="project-blurb">{p.blurb}</p>
        </div>
        <a className="project-github-btn" href={p.github} target="_blank" rel="noreferrer">
          <span>GitHub</span>
          <strong>repo + release ↗</strong>
        </a>
      </div>

      <div className="quests-system-layout">
        <div className="quests-loop-card">
          <span className="panel-kicker">the loop</span>
          <div className="quests-loop">
            <div><b>01</b><strong>pick</strong><small>daily / weekly / world quests</small></div>
            <span>→</span>
            <div><b>02</b><strong>do</strong><small>real-world action + capture</small></div>
            <span>→</span>
            <div><b>03</b><strong>verify</strong><small>rules first, human review when needed</small></div>
            <span>→</span>
            <div><b>04</b><strong>progress</strong><small>XP + coins without duplicate rewards</small></div>
          </div>
        </div>

        <div className="quests-rules-card">
          <span className="panel-kicker">things I refused to fake</span>
          <div className="quests-rule-grid">
            <div><strong>server-authoritative</strong><span>progression is not trusted to the client</span></div>
            <div><strong>idempotent rewards</strong><span>same capture cannot quietly pay twice</span></div>
            <div><strong>D → S rarity</strong><span>higher grades get stricter verification</span></div>
            <div><strong>closed beta</strong><span>3–4 testers finding persistence + UX bugs</span></div>
          </div>
        </div>

        <div className="quests-product-bar">
          {p.facts.map(([k,v]) => (
            <div key={k}><span>{k}</span><strong>{v}</strong></div>
          ))}
        </div>
      </div>

      <div className="tag-row">{p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
      <div className="project-edge-doodles" aria-hidden="true"><PaperPlaneDoodle size={28} /><StarDoodle size={16} /></div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Project: CyberBio — experimental / scientific                       */
/* ------------------------------------------------------------------ */

function CyberBioProject({ p, index }) {
  const ref = useReveal();
  return (
    <article ref={ref} className="project project-cyberbio project-layout-research reveal" aria-label={p.name}>
      <div className="project-proof-head">
        <div>
          <div className="project-meta-row">
            <span className="project-index">{String(index).padStart(2, "0")} /</span>
            <h3 className="project-title">{p.name}</h3>
            <span className="project-year">{p.year}</span>
          </div>
          <p className="project-blurb">{p.blurb}</p>
        </div>
        <a className="project-github-btn" href={p.github} target="_blank" rel="noreferrer">
          <span>GitHub</span>
          <strong>experiments + outputs ↗</strong>
        </a>
      </div>

      <div className="cyberbio-report-grid">
        <figure className="cyberbio-primary">
          <img src={CYBERBIO_MEDIA[0].src} alt="Baseline versus defended model robustness across five seeds" loading="lazy" />
          <figcaption>baseline vs defended · multi-seed robustness comparison</figcaption>
        </figure>
        <div className="cyberbio-sideplots">
          <figure>
            <img src={CYBERBIO_MEDIA[1].src} alt="CyberBio ablation study" loading="lazy" />
            <figcaption>ablation</figcaption>
          </figure>
          <figure>
            <img src={CYBERBIO_MEDIA[2].src} alt="CyberBio MCMC drift plot" loading="lazy" />
            <figcaption>MCMC drift</figcaption>
          </figure>
        </div>
        <aside className="cyberbio-findings">
          <span className="panel-kicker">what survived scrutiny</span>
          {p.facts.map(([k,v],i) => (
            <div className="finding-row" key={k}>
              <span>{String(i + 1).padStart(2,"0")}</span>
              <div><strong>{k}</strong><p>{v}</p></div>
            </div>
          ))}
          <small>current pass: multi-seed stats · representation sensitivity · physical checks</small>
        </aside>
      </div>

      <div className="tag-row">{p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
      <div className="project-edge-doodles" aria-hidden="true"><Constellation /><Sparkle size={14} /></div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Project: Archis — blueprint → interpreted space → 3D                */
/* ------------------------------------------------------------------ */

function BlueprintSvg() {
  return (
    <svg className="blueprint-svg" viewBox="0 0 220 170" role="img" aria-label="Architectural blueprint sketch of a floor plan">
      <g stroke="rgba(247,241,230,0.85)" strokeWidth="1.1" fill="none">
        <rect x="18" y="16" width="184" height="138" />
        <path d="M18 78 H104 M104 16 V154 M104 100 H202 M150 100 V154" />
        <path d="M30 30 h44 M30 38 h30" strokeWidth="0.7" opacity="0.6" />
        <path d="M118 30 h56 M118 38 h40" strokeWidth="0.7" opacity="0.6" />
        <path d="M120 116 h56 M120 124 h40" strokeWidth="0.7" opacity="0.6" />
        <circle cx="160" cy="60" r="14" opacity="0.85" />
        <path d="M160 46 V74 M146 60 H174" strokeWidth="0.7" opacity="0.6" />
      </g>
      <text x="26" y="150" fill="rgba(247,241,230,0.55)" fontSize="8" fontFamily="monospace">
        plan 01 — first draft
      </text>
    </svg>
  );
}

function ArchisProject({ p, index }) {
  const ref = useReveal();
  return (
    <article ref={ref} className="project project-archis project-layout-architecture reveal" aria-label={p.name}>
      <div className="project-proof-head">
        <div>
          <div className="project-meta-row">
            <span className="project-index">{String(index).padStart(2, "0")} /</span>
            <h3 className="project-title">{p.name}</h3>
            <span className="project-year">{p.year}</span>
          </div>
          <p className="project-blurb">{p.blurb}</p>
        </div>
        <div className="project-link-stack">
          <a className="project-github-btn" href={p.github} target="_blank" rel="noreferrer">
            <span>GitHub</span>
            <strong>source + research ↗</strong>
          </a>
          <a className="btn-quiet" href={p.demo} target="_blank" rel="noreferrer">live prototype ↗</a>
        </div>
      </div>

      <div className="archis-concept-sheet">
        <figure className="archis-hero-panel">
          <img src={ARCHIS_MEDIA[0].src} alt="Archis workspace concept" loading="lazy" />
          <figcaption>workspace · current product direction</figcaption>
        </figure>
        <figure className="archis-support-panel">
          <img src={ARCHIS_MEDIA[1].src} alt="Archis semantic loop" loading="lazy" />
          <figcaption>semantic loop</figcaption>
        </figure>
        <figure className="archis-support-panel">
          <img src={ARCHIS_MEDIA[2].src} alt="Archis workspace concept detail" loading="lazy" />
          <figcaption>workspace concept</figcaption>
        </figure>
      </div>

      <div className="archis-flow-clean">
        <span>architect draft</span><b>→</b><span>semantic model</span><b>→</b><span>intent hypotheses</span><b>→</b><span>minimal edit</span>
      </div>

      <table className="fact-table archis-facts"><tbody>{p.facts.map(([k,v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}</tbody></table>
      <div className="tag-row">{p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
      <div className="project-edge-doodles" aria-hidden="true"><ArrowDoodle /><CoffeeRing /></div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function LabPage() {
  useGlobalReveal();
  const deskRef = useRef(null);
  const heroVisualsRef = useRef(null);
  const heroTextRef = useReveal({ hidden: false });
  const coarse = useCoarsePointer();
  const reduced = usePrefersReducedMotion();
  const progressRef = useRef(null);

  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return localStorage.getItem("lab-sound") === "on";
    } catch {
      return true;
    }
  });

  const [doodleCanvasActive, setDoodleCanvasActive] = useState(false);
  const [selectedEssay, setSelectedEssay] = useState(null);

  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    index: 0,
  });

  const [toastMsg, setToastMsg] = useState("");
  const [userNotes, setUserNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("lab-user-notes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((cur) => (cur === msg ? "" : cur));
    }, 3200);
  }, []);

  const handleCopyEmail = useCallback(
    (e) => {
      e.preventDefault();
      const email = identity.links.email.replace("mailto:", "");
      navigator.clipboard?.writeText(email);
      playClickSound(soundEnabled);
      showToast(`Copied ${email} to clipboard! ✦`);
    },
    [soundEnabled, showToast]
  );

  const handleAddNote = useCallback(() => {
    playPaperSound(soundEnabled);
    const input = prompt("Sticky note:", "do this next");
    if (!input || !input.trim()) return;
    setUserNotes((prev) => [...prev, makeGlobalNote(input.trim())]);
    showToast("note dropped");
  }, [soundEnabled, showToast]);

  useEffect(() => {
    try {
      localStorage.setItem("lab-user-notes", JSON.stringify(userNotes));
    } catch {}
  }, [userNotes]);

  useEffect(() => {
    let lastTap = { time: 0, x: 0, y: 0 };

    const activateInk = (target) => {
      if (target?.closest?.("a, button, input, textarea, select, .global-sticky, .movable-scrap, .doodle-toolbar")) return;
      setDoodleCanvasActive(true);
      showToast("ink mode");
    };

    const onDoubleClick = (e) => activateInk(e.target);
    const onPointerUp = (e) => {
      if (e.pointerType !== "touch") return;
      const now = performance.now();
      const near = Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 24;
      if (now - lastTap.time < 320 && near) {
        activateInk(e.target);
        lastTap = { time: 0, x: 0, y: 0 };
      } else {
        lastTap = { time: now, x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener("dblclick", onDoubleClick);
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    return () => {
      window.removeEventListener("dblclick", onDoubleClick);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [showToast]);

  const triggerSparkle = useCallback(
    (e) => {
      playClickSound(soundEnabled);
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      for (let i = 0; i < 8; i++) {
        const dot = document.createElement("span");
        dot.className = "cursor-dust";
        dot.style.width = "4px";
        dot.style.height = "4px";
        dot.style.background = ["var(--clay)", "var(--butter)", "var(--moss)", "var(--cyan)"][i % 4];
        dot.style.transform = `translate(${x + (Math.random() * 50 - 25)}px, ${
          y + (Math.random() * 50 - 25)
        }px)`;
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), 700);
      }
    },
    [soundEnabled]
  );

  const openLightbox = useCallback(
    (index) => {
      playClickSound(soundEnabled);
      setLightboxState({ isOpen: true, index });
    },
    [soundEnabled]
  );

  const closeLightbox = useCallback(() => {
    playPaperSound(soundEnabled);
    setLightboxState({ isOpen: false, index: 0 });
  }, [soundEnabled]);

  // scroll progress bar
  useEffect(() => {
    const onScroll = () => {
      const de = document.documentElement;
      const max = de.scrollHeight - de.clientHeight;
      const pct = max > 0 ? (de.scrollTop / max) * 100 : 0;
      if (progressRef.current) progressRef.current.style.width = pct + "%";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="lab-app" id="top">
      <div className="scroll-progress" ref={progressRef} aria-hidden="true" />
      <LabHeader
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        doodleActive={doodleCanvasActive}
        onToggleDoodle={() => setDoodleCanvasActive(!doodleCanvasActive)}
      />

      <DoodleCanvas active={doodleCanvasActive} onClose={() => setDoodleCanvasActive(false)} />
      <GlobalStickyNotes notes={userNotes} onChange={setUserNotes} />

      <div className="lab">
        {toastMsg && <div className="lab-toast" role="status">{toastMsg}</div>}

        <main>
          {/* ---------------- hero ---------------- */}
          <section className="hero" ref={deskRef} aria-label="introduction">
            <div ref={heroTextRef} className="in-view-slot">
              <StarDoodle
                className="doodle mossy interactive-doodle"
                size={26}
                style={{ position: "absolute", left: -8, top: 58, cursor: "pointer" }}
                onClick={triggerSparkle}
              />
              <PaperPlaneDoodle
                size={34}
                className="interactive-doodle"
                style={{ position: "absolute", right: 20, top: -10, cursor: "pointer" }}
                onClick={triggerSparkle}
              />
              <span className="hero-hello">hi. i’m</span>
              <h1 className="hero-name">
                {identity.name}
                <span className="scribble-x" aria-hidden="true">
                  <ScribbleX />
                </span>
              </h1>
              <p className="hero-mainline">
                I build things until{" "}
                <span className="underline-draw">
                  I understand them.
                  <UnderlineScribble />
                </span>
              </p>
              <p className="hero-sub">{identity.subtext}</p>

              <div className="hero-roles">
                {identity.roles.map((r) => (
                  <span className="role-chip" key={r}>
                    {r}
                  </span>
                ))}
              </div>

              <div className="hero-cta">
                <a className="btn-ink" href="#work" onClick={() => playClickSound(soundEnabled)}>
                  see the work ↓
                </a>
                <button
                  type="button"
                  className="btn-add-note"
                  onClick={handleAddNote}
                  title="Drop a sticky note anywhere on the page"
                >
                  + sticky note
                </button>
                <a className="btn-quiet" href={identity.links.github} target="_blank" rel="noreferrer">
                  github ↗
                </a>
              </div>
            </div>

            <div
              ref={heroVisualsRef}
              className="hero-workboard"
              aria-label="current work board"
            >
              <div className="workboard-label">
                <span>right now</span>
                <small>drag scraps · double-click blank space to draw</small>
              </div>

              {currentWorks.map((work, i) => {
                const positions = [
                  { x: 12, y: 58, r: -2.2 },
                  { x: 250, y: 42, r: 1.6 },
                  { x: 34, y: 240, r: 1.2 },
                  { x: 278, y: 232, r: -1.5 },
                  { x: 16, y: 422, r: -1.2 },
                  { x: 254, y: 414, r: 1.4 },
                  { x: 132, y: 600, r: -0.8 },
                ];
                const p = positions[i] || { x: 20 + i * 24, y: 70 + i * 36, r: 0 };
                return (
                  <MovableScrap
                    key={work.id}
                    id={work.id}
                    x={p.x}
                    y={p.y}
                    rotation={p.r}
                    tone={work.tone}
                    parentRef={heroVisualsRef}
                  >
                    <div className="scrap-status">{work.status}</div>
                    <h3><a href={work.href} target="_blank" rel="noreferrer">{work.name}</a></h3>
                    <p>{work.note}</p>
                    <span className="scrap-next">{work.next}</span>
                  </MovableScrap>
                );
              })}



              <Sparkle className="workboard-sparkle sparkle-a" size={18} aria-hidden="true" />
              <StarDoodle className="workboard-sparkle sparkle-b" size={24} aria-hidden="true" />
              <ArrowDoodle className="workboard-arrow" aria-hidden="true" />
            </div>
          </section>

          {/* ---------------- featured work ---------------- */}
          <section className="lab-section" id="work" aria-label="featured work">
            <SectionHead
              kicker="things i build"
              title="Selected"
              accent="work"
              sub="The projects I can explain without pretending they’re more finished than they are."
            />
            <MocapProject p={featuredProjects[0]} index={1} />
            <QuestsProject p={featuredProjects[1]} index={2} />
            <CyberBioProject p={featuredProjects[2]} index={3} />
            <ArchisProject p={featuredProjects[3]} index={4} />
          </section>

          {/* ---------------- products ---------------- */}
          <section className="lab-section product-projects-section" aria-label="products">
            <SectionHead
              kicker="products"
              title="Built to be"
              accent="used"
              sub="A product build that deserves more than a tiny repo chip. Paused experiments live elsewhere."
            />

            <div className="product-duo reveal">
              {productProjects.map((p) => (
                <article className={"product-feature-card product-" + p.variant} key={p.name}>
                  <div className="product-feature-head">
                    <div>
                      <span className="product-eyebrow">{p.variant === "voice" ? "voice / learning" : "desktop / systems"}</span>
                      <h3>{p.name}</h3>
                      {p.repoName ? <small>repo: {p.repoName}</small> : null}
                    </div>
                    <span className="product-mark" aria-hidden="true">{p.variant === "voice" ? "◉" : "⌘"}</span>
                  </div>

                  <p>{p.note}</p>

                  <div className="product-proof-stack">
                    {p.proofLines.map((line) => <span key={line}>{line}</span>)}
                  </div>

                  <div className="product-feature-foot">
                    <small>{p.meta}</small>
                    <div>
                      {p.demo ? <a href={p.demo} target="_blank" rel="noreferrer">live app ↗</a> : null}
                      <a href={p.href} target="_blank" rel="noreferrer">GitHub ↗</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ---------------- current contributions ---------------- */}
          <section className="lab-section contribution-section" id="contributions" aria-label="open source contributions">
            <SectionHead
              kicker="outside my repos"
              title="Contributions"
              accent="in the wild"
              sub="Merged work and PRs still under review. Open is open; merged is merged."
            />

            <div className="contribution-ledger reveal">
              <div className="ledger-spine" aria-hidden="true" />
              {contributions.map((item) => (
                <a
                  className={"contribution-row status-" + item.status}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  key={item.href}
                >
                  <span className="contribution-status">
                    <i aria-hidden="true" />
                    {item.status}
                  </span>
                  <span className="contribution-project">{item.project}</span>
                  <span className="contribution-title">{item.title}</span>
                  <span className="contribution-when">{item.when}</span>
                  <span className="contribution-arrow">↗</span>
                </a>
              ))}
            </div>

            <p className="contribution-note">
              tiny docs fixes count. so do bug fixes. i’d rather show the actual PR than inflate either one.
            </p>
          </section>

          {/* ---------------- research + community ---------------- */}
          <section className="lab-section section-has-doodles" id="research" aria-label="research and community">
            <div className="section-doodle-pair research-doodles" aria-hidden="true"><StarDoodle size={18} /><Sparkle size={13} /></div>
            <SectionHead
              kicker="published / research"
              title="Work with"
              accent="receipts"
              sub="Published papers, team research, and communities I’ve helped build."
            />
            <div className="research-community-grid">
              <div className="research-row-list reveal" aria-label="published and research work">
                {researchRows.map((r) => (
                  <article className="research-row" key={r.name}>
                    <div className="research-row-main">
                      <span className="research-row-label">{r.label}</span>
                      <h3>{r.name}</h3>
                      <p>{r.note}</p>
                    </div>
                    <div className="research-row-metrics">
                      {r.metrics.map((m) => <span key={m}>{m}</span>)}
                    </div>
                    <div className="research-row-links">
                      <a href={r.primaryHref} target="_blank" rel="noreferrer">{r.primaryLabel} ↗</a>
                      {r.secondaryHref ? <a href={r.secondaryHref} target="_blank" rel="noreferrer">{r.secondaryLabel} ↗</a> : null}
                    </div>
                  </article>
                ))}
              </div>

              <div className="card-stack">
                {community.map((c) => (
                  <a
                    key={c.name}
                    className="index-card"
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none", color: "inherit", display: "block" }}
                    onClick={() => playClickSound(soundEnabled)}
                  >
                    <div className="community-card-head">
                      <h4>{c.name}</h4>
                      <span className="community-verify">{c.linkLabel || "verify"} ↗</span>
                    </div>
                    <span className="card-role">{c.role}</span>
                    <p>{c.blurb}</p>
                  </a>
                ))}
              </div>
            </div>

            <div className="selection-trail reveal" aria-label="selection trail">
              <div className="selection-trail-head">
                <span>selection trail</span>
                <small>not wins. just stages i reached.</small>
              </div>
              <div className="selection-trail-grid">
                {selectionTrail.map((item) => (
                  <a href={item.href} target="_blank" rel="noreferrer" key={item.name} className="selection-chip">
                    <span className="selection-name">{item.name}</span>
                    <strong>{item.stage}</strong>
                    <small>{item.note}</small>
                    <i>official ↗</i>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* ---------------- words + experiments ---------------- */}
          <section className="lab-section section-has-doodles" id="words" aria-label="writing and experiments">
            <div className="section-doodle-pair words-doodles" aria-hidden="true"><CatDoodle size={30} /><VinylDoodle /></div>
            <SectionHead
              kicker="outside the code"
              title="Writing &"
              accent="loose ends"
              sub="Notes, essays, and ideas I haven’t managed to stop thinking about."
            />
            <div className="published-writing-shelf reveal">
              <div className="published-writing-head">
                <div>
                  <span className="published-kicker">published elsewhere</span>
                  <h3>Books, journals & anthologies</h3>
                </div>
              </div>

              <div className="published-writing-grid">
                {publishedWriting.map((item) => (
                  <a
                    key={item.id}
                    className="published-writing-card"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="published-type">{item.kind}</span>
                    <span className="published-status">● {item.status}</span>
                    <h4>{item.title}</h4>
                    <p>{item.detail}</p>
                    <div className="published-meta">
                      <span>{item.venue}</span>
                      <span>{item.year}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="two-col">
              <div className="paper-block block-tilt-r reveal" style={{ position: "relative" }}>
                <CatDoodle
                  className="doodle interactive-doodle"
                  style={{ position: "absolute", right: 14, top: -18, cursor: "pointer" }}
                  onClick={triggerSparkle}
                />
                <VinylDoodle
                  className="interactive-doodle"
                  style={{ position: "absolute", right: 65, top: -14, cursor: "pointer" }}
                  onClick={triggerSparkle}
                />
                <h3>questions stuck in my head</h3>
                <ul className="paper-list">
                  {recentThoughts.map((t, idx) => (
                    <li key={t}>
                      <span className="li-marker">→</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <h3 style={{ marginTop: 18 }}>online writing</h3>
                <ul className="paper-list">
                  {writings.map((w) => (
                    <li key={w.id}>
                      <span className="li-marker">✎</span>
                      <span>
                        <button
                          type="button"
                          className="btn-text-link"
                          onClick={() => {
                            playPaperSound(soundEnabled);
                            setSelectedEssay(w);
                          }}
                          title="Click to read essay"
                        >
                          {w.title}
                        </button>
                      </span>
                      <span className="li-meta">
                        {w.status} · {w.date}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="scratch reveal" style={{ position: "relative" }}>
                  <Constellation
                    className="doodle mossy interactive-doodle"
                    style={{ position: "absolute", right: 10, top: 8, opacity: 0.7, cursor: "pointer" }}
                    onClick={triggerSparkle}
                  />
                  <h3>unfinished ideas</h3>
                  {unfinishedIdeas.map((idea, i) => (
                    <div className="scratch-line" key={idea}>
                      <span className={i === 2 ? "strikethrough" : ""}>{idea}</span>
                      {i === unfinishedIdeas.length - 1 ? <span className="q"> ← ?</span> : null}
                    </div>
                  ))}
                </div>

                <div className="paper-block block-tilt-l reveal" style={{ marginTop: 26 }}>
                  <h3>currently on the bench</h3>
                  <ul className="paper-list">
                    {currentExperiments.map((e) => (
                      <li key={e.label}>
                        <span className="li-marker">⌁</span>
                        <span>{e.label}</span>
                        <span className="li-meta">{e.note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ---------------- other builds ---------------- */}
          <section className="lab-section other-builds-section" aria-label="other builds">
            <div className="other-builds-line reveal">
              <span>other things</span>
              {otherBuilds.map((item) => (
                <a href={item.href} target="_blank" rel="noreferrer" key={item.name}>{item.name} ↗</a>
              ))}
            </div>
          </section>
        </main>

        {/* ---------------- footer ---------------- */}
        <footer className="lab-footer lab-footer-final">
          <a
            className="to-top"
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              playPaperSound(soundEnabled);
              window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
            }}
          >
            ↑ back to top
          </a>

          <nav className="footer-links" aria-label="final links">
            <a href="resume.pdf" target="_blank" rel="noreferrer">resume ↗</a>
            <a href={identity.links.github} target="_blank" rel="noreferrer">github ↗</a>
            <a href={identity.links.linkedin} target="_blank" rel="noreferrer">linkedin ↗</a>
            <a href={identity.links.email} onClick={handleCopyEmail}>email ↗</a>
          </nav>

          <span>© {new Date().getFullYear()} Mrudula</span>
        </footer>
      </div>{/* end .lab */}

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxState.isOpen}
        onClose={closeLightbox}
        items={GALLERY}
        currentIndex={lightboxState.index}
        onSelectIndex={(idx) => setLightboxState((s) => ({ ...s, index: idx }))}
      />

      {/* Essay Reader Modal */}
      <EssayModal
        isOpen={!!selectedEssay}
        onClose={() => setSelectedEssay(null)}
        article={selectedEssay}
      />

      <PersonalDesk
        doodleActive={doodleCanvasActive}
        onToggleDoodle={() => setDoodleCanvasActive((v) => !v)}
      />
      <InteractionDock
        doodleActive={doodleCanvasActive}
        onToggleDoodle={() => setDoodleCanvasActive((v) => !v)}
        onAddNote={handleAddNote}
      />

          </div>
  );
}
