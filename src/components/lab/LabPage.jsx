import { useEffect, useRef, useState, useCallback } from "react";
import {
  identity,
  featuredProjects,
  currentWorks,
  contributions,
  researchPapers,
  community,
  recentThoughts,
  writings,
  publishedWriting,
  currentExperiments,
  unfinishedIdeas,
  heroSticky,
  sideRepos,
  projectConstellation,
  quote,
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
import ScreenLife from "./ScreenLife";
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

const MOCAP_MEDIA = [
  {
    id: "capture",
    type: "video",
    label: "annotated capture",
    src: "https://raw.githubusercontent.com/Mrudula-itsjuzme/Motion-capture/main/results/session_may16_dual/annotated_front.mp4",
    note: "front camera · MediaPipe overlay",
  },
  {
    id: "quality",
    type: "image",
    label: "quality improvement",
    src: "https://raw.githubusercontent.com/Mrudula-itsjuzme/Motion-capture/main/docs/figures/offline_quality_improvement_card.png",
    note: "before / after pipeline quality",
  },
  {
    id: "sync",
    type: "image",
    label: "sync sweep",
    src: "https://raw.githubusercontent.com/Mrudula-itsjuzme/Motion-capture/main/docs/figures/sync_offset_sweep_card.png",
    note: "camera offset search",
  },
  {
    id: "reprojection",
    type: "image",
    label: "reprojection",
    src: "https://raw.githubusercontent.com/Mrudula-itsjuzme/Motion-capture/main/results/session_may16_dual/markerless_benchmark/reprojection_error_plot.png",
    note: "documented benchmark output",
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
  const [activeMedia, setActiveMedia] = useState(MOCAP_MEDIA[0]);
  const [mediaKey, setMediaKey] = useState(0);

  const chooseMedia = (item) => {
    setActiveMedia(item);
    setMediaKey((k) => k + 1);
  };

  return (
    <article ref={ref} className="project project-mocap reveal" aria-label={p.name}>
      <div className="mocap-project-head">
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
          <strong>source + experiments ↗</strong>
        </a>
      </div>

      <div className="mocap-evidence-shell">
        <div className="mocap-media-stage">
          <div className="mocap-media-topbar">
            <span className="rec-dot" />
            <span>{activeMedia.label}</span>
            <a href={activeMedia.src} target="_blank" rel="noreferrer">open original ↗</a>
          </div>

          <div className="mocap-media-main" key={mediaKey}>
            {activeMedia.type === "video" ? (
              <video
                src={activeMedia.src}
                controls
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Annotated motion capture result video"
              />
            ) : (
              <img src={activeMedia.src} alt={activeMedia.label} loading="lazy" />
            )}
          </div>

          <div className="mocap-media-caption">
            <span>{activeMedia.note}</span>
            <span>real output from the repo</span>
          </div>
        </div>

        <div className="mocap-media-rail" aria-label="motion capture result views">
          {MOCAP_MEDIA.map((item) => (
            <button
              type="button"
              key={item.id}
              className={activeMedia.id === item.id ? "active" : ""}
              onClick={() => chooseMedia(item)}
            >
              <span className="rail-index">{item.type === "video" ? "▶" : "↗"}</span>
              <span>
                <strong>{item.label}</strong>
                <small>{item.note}</small>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mocap-bottom-grid">
        <div className="mocap-data mocap-data-inline">
          <div className="data-title">documented run</div>
          <table className="fact-table">
            <tbody>
              {p.facts.map(([k, v]) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mocap-notes">
          <span className="mocap-note-label">what I’m validating now</span>
          <p>repeatability · camera quality gates · gait-event reliability · failure cases</p>
          <div className="tag-row">
            {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Project: Quests — cinematic / product                               */
/* ------------------------------------------------------------------ */

function QuestsProject({ p, index }) {
  const ref = useReveal();
  return (
    <article ref={ref} className="project project-quests reveal" aria-label={p.name}>
      <div className="project-meta-row">
        <span className="project-index">{String(index).padStart(2, "0")} /</span>
        <h3 className="project-title">
          <a href={p.github} target="_blank" rel="noreferrer">{p.name}</a>
        </h3>
        <span className="project-year">{p.year}</span>
      </div>

      <div className="quests-real-grid">
        <div>
          <p className="project-blurb">{p.blurb}</p>
          <div className="tag-row">
            {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
          </div>
        </div>
        <div className="product-note">
          <span className="product-note-label">closed beta / right now</span>
          <p>
            tiny tester pool. real persistence bugs. UI feedback that actually changed the build.
            exactly the unglamorous part i wanted to reach.
          </p>
          <a href={p.github} target="_blank" rel="noreferrer">open the repo ↗</a>
        </div>
      </div>

      <table className="fact-table">
        <tbody>
          {p.facts.map(([k, v]) => (
            <tr key={k}><td>{k}</td><td>{v}</td></tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Project: CyberBio — experimental / scientific                       */
/* ------------------------------------------------------------------ */

function CyberBioProject({ p, index }) {
  const ref = useReveal();
  return (
    <article ref={ref} className="project project-cyberbio reveal tilt-2" aria-label={p.name}>
      <div className="cyber-grid">
        <div className="molecule" data-magnetic aria-hidden="true">
          <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
            <g stroke="rgba(121,199,197,0.75)" strokeWidth="1.4" fill="none">
              <path d="M40 120 L70 70 L120 90 L150 50" />
              <path d="M70 70 L60 130 L120 150 L150 110 L120 90" />
              <path d="M60 130 L110 160 L160 140" />
            </g>
            {[
              [40, 120], [70, 70], [120, 90], [150, 50], [60, 130],
              [120, 150], [150, 110], [110, 160], [160, 140],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={5 + (i % 3)} fill="rgba(121,199,197,0.85)" />
            ))}
          </svg>
          <span className="attack-arrow" style={{ left: "8%", top: "10%" }}>attack →</span>
          <span className="attack-arrow" style={{ right: "10%", top: "42%" }}>defend →</span>
          <span className="attack-arrow" style={{ left: "12%", bottom: "9%", color: "var(--butter)" }}>
            understand ↓
          </span>
        </div>

        <div>
          <div className="project-meta-row">
            <span className="project-index">{String(index).padStart(2, "0")} /</span>
            <h3 className="project-title">
              <a href={p.github} target="_blank" rel="noreferrer">
                {p.name}
              </a>
            </h3>
            <span className="project-year">{p.year}</span>
          </div>
          <p className="project-blurb">{p.blurb}</p>

          <div className="reaction" style={{ marginTop: 20 }}>
            {p.facts.map(([k, v], i) => (
              <div className="r-line" key={k}>
                <span className="r-key">{k}</span>
                <span className="r-arrow">{i === p.facts.length - 1 ? "⇒" : "→"}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>

          <div className="tag-row">
            {p.tags.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
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
    <article ref={ref} className="project project-archis reveal" aria-label={p.name}>
      <div className="project-meta-row">
        <span className="project-index">{String(index).padStart(2, "0")} /</span>
        <h3 className="project-title">
          <a href={p.github} target="_blank" rel="noreferrer">{p.name}</a>
        </h3>
        <span className="project-year">{p.year}</span>
        <a className="btn-quiet" href={p.demo} target="_blank" rel="noreferrer">prototype ↗</a>
      </div>

      <p className="project-blurb">{p.blurb}</p>

      <div className="archis-real-flow" aria-label="Archis workflow">
        <div className="archis-step">
          <span>01</span>
          <strong>blueprint</strong>
          <small>start with what the architect actually drew</small>
        </div>
        <div className="archis-flow-arrow">→</div>
        <div className="archis-step">
          <span>02</span>
          <strong>interpret</strong>
          <small>infer relationships, but keep uncertainty visible</small>
        </div>
        <div className="archis-flow-arrow">→</div>
        <div className="archis-step">
          <span>03</span>
          <strong>change carefully</strong>
          <small>make the smallest useful edit without erasing intent</small>
        </div>
      </div>

      <table className="fact-table">
        <tbody>
          {p.facts.map(([k, v]) => (
            <tr key={k}><td>{k}</td><td>{v}</td></tr>
          ))}
        </tbody>
      </table>

      <div className="tag-row">
        {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
      </div>
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
      <ScreenLife />

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
                  { x: 34, y: 250, r: 1.2 },
                  { x: 278, y: 246, r: -1.5 },
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
          <section className="lab-section" id="research" aria-label="research and community">
            <SectionHead
              kicker="research + people"
              title="Things I’ve"
              accent="worked on"
              sub="Published work, ongoing research, and communities I’ve helped build."
            />
            <div className="two-col">
              <div className="paper-block block-tilt-l reveal">
                <h3>research papers</h3>
                <ul className="paper-list">
                  {researchPapers.map((r) => (
                    <li key={r.title}>
                      <span className="li-marker">{r.tag === "published" ? "✦" : "✍"}</span>
                      <span>
                        <a href={r.href} target="_blank" rel="noreferrer" onClick={() => playClickSound(soundEnabled)}>
                          {r.title}
                        </a>
                        <br />
                        <span style={{ color: "rgba(23,21,18,0.6)", fontSize: 12 }}>{r.detail}</span>
                        <br />
                        <span style={{ color: "rgba(23,21,18,0.45)", fontSize: 11 }}>{r.meta}</span>
                      </span>
                    </li>
                  ))}
                </ul>
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
                    <h4>{c.name}</h4>
                    <span className="card-role">{c.role}</span>
                    <p>{c.blurb}</p>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* ---------------- words + experiments ---------------- */}
          <section className="lab-section" id="words" aria-label="writing and experiments">
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

          {/* ---------------- desk drawer: side repos ---------------- */}
          <section className="lab-section" aria-label="more experiments on github">
            <div className="drawer reveal">
              <span className="drawer-label">other repos i still like →</span>
              {sideRepos.map((r) => (
                <a
                  key={r.name}
                  className="chip"
                  href={r.href}
                  target="_blank"
                  rel="noreferrer"
                  title={r.note}
                  onClick={() => playClickSound(soundEnabled)}
                >
                  {r.name}
                </a>
              ))}
            </div>
          </section>

          {/* ---------------- project constellation ---------------- */}
          <section className="lab-section constellation-section" aria-label="more projects">
            <div className="constellation-head reveal">
              <span className="lab-kicker">the rest of the tabs</span>
              <h2 className="lab-h2">Project <span className="accent">constellation</span></h2>
              <p className="lab-sub">
                Not everything needs a giant case study. Some things are research, some are products,
                some are old experiments I still steal ideas from.
              </p>
            </div>

            <div className="constellation-grid reveal">
              {projectConstellation.map((p, i) => (
                <a
                  className={"constellation-card kind-" + p.kind}
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  key={p.name}
                  style={{ "--tilt": `${[-1.2, 0.7, -0.4, 1.1, -0.8, 0.5][i % 6]}deg` }}
                  onClick={() => playClickSound(soundEnabled)}
                >
                  <span className="constellation-dot">✦</span>
                  <span className="constellation-kind">{p.kind}</span>
                  <h3>{p.name}</h3>
                  <p>{p.note}</p>
                  <span className="constellation-link">peek ↗</span>
                </a>
              ))}
            </div>

            <div className="constellation-doodles" aria-hidden="true">
              <PaperPlaneDoodle size={44} />
              <StarDoodle size={24} />
              <Sparkle size={16} />
              <Constellation />
            </div>
          </section>

          {/* ---------------- quote ---------------- */}
          <div className="quote-card" data-magnetic>
            {quote}
            <span className="q-sign">— taped above my desk</span>
          </div>
        </main>

        {/* ---------------- footer ---------------- */}
        <footer className="lab-footer">
          <span className="foot-hand">thanks for scrolling this far ✦</span>
          <a
            className="to-top"
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              playPaperSound(soundEnabled);
              window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
            }}
          >
            ↑ back to the top
          </a>
          <span>
            <a href={identity.links.github} target="_blank" rel="noreferrer" onClick={() => playClickSound(soundEnabled)}>
              github
            </a>{" "}
            ·{" "}
            <a href={identity.links.linkedin} target="_blank" rel="noreferrer" onClick={() => playClickSound(soundEnabled)}>
              linkedin
            </a>{" "}
            ·{" "}
            <a href={identity.links.email} onClick={handleCopyEmail} title="Click to copy email">
              email 📋
            </a>
          </span>
          <span>© {new Date().getFullYear()} Mrudula · made, moved around, scribbled on</span>
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

            {/* ambient doodles stay in edge lanes */}
      <CoffeeRing className="doodle edge-doodle edge-right interactive-doodle" style={{ top: 120 }} onClick={triggerSparkle} />
      <Sparkle className="doodle edge-doodle edge-left clay twinkle interactive-doodle" size={18} style={{ top: 420 }} onClick={triggerSparkle} />
      <ArrowDoodle className="doodle edge-doodle edge-left mossy" style={{ top: 900 }} />
      <Sparkle className="doodle edge-doodle edge-right mossy twinkle slow interactive-doodle" size={13} style={{ top: 2100 }} onClick={triggerSparkle} />
      <CatDoodle className="doodle edge-doodle edge-right clay floaty slow interactive-doodle" size={42} style={{ top: 3400 }} onClick={triggerSparkle} />
      <Sparkle className="doodle edge-doodle edge-left pinky twinkle interactive-doodle" size={16} style={{ top: 4300 }} onClick={triggerSparkle} />
      <StarDoodle className="doodle edge-doodle edge-right mossy twinkle slow interactive-doodle" size={20} style={{ top: 5200 }} onClick={triggerSparkle} />
      <PaperPlaneDoodle className="doodle edge-doodle edge-left clay floaty interactive-doodle" size={30} style={{ top: 2650 }} onClick={triggerSparkle} />
      <VinylDoodle className="doodle edge-doodle edge-right pinky interactive-doodle" style={{ top: 4550 }} onClick={triggerSparkle} />
      <CoffeeRing className="doodle edge-doodle edge-left mossy" style={{ top: 6100, opacity: 0.35 }} />
      <Constellation className="doodle edge-doodle edge-left clay interactive-doodle" style={{ top: 5900, opacity: 0.45 }} onClick={triggerSparkle} />
    </div>
  );
}
