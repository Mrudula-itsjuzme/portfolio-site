import { useEffect, useRef, useState, useCallback } from "react";
import {
  identity,
  featuredProjects,
  researchPapers,
  community,
  recentThoughts,
  writings,
  currentExperiments,
  unfinishedIdeas,
  heroSticky,
  sideRepos,
  quote,
} from "../../data/lab";
import StickyNote, { useCoarsePointer, usePrefersReducedMotion } from "./StickyNote";
import TiltPhoto from "./TiltPhoto";
import LabHeader from "./LabHeader";
import LightboxModal from "./LightboxModal";
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
} from "./Doodles";

const IMG = {
  motion: "diagrams/motion.png",
  solar: "diagrams/solar.png",
  portfolio: "diagrams/portfolio.png",
  eeg: "diagrams/eeg.png",
};

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

function MocapProject({ p, index, onOpenLightbox }) {
  const ref = useReveal();
  const stageRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const coarse = useCoarsePointer();
  const [scan, setScan] = useState(38);

  useEffect(() => {
    if (reduced || coarse || !stageRef.current) return;
    const el = stageRef.current;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      setScan(((e.clientY - r.top) / r.height) * 100);
    };
    el.addEventListener("mousemove", onMove, { passive: true });
    return () => el.removeEventListener("mousemove", onMove);
  }, [reduced, coarse]);

  return (
    <article ref={ref} className={`project project-mocap reveal tilt-1`} aria-label={p.name}>
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

      <div
        ref={stageRef}
        className="mocap-stage parallax-layer clickable-stage"
        style={{ marginTop: 26, cursor: "pointer" }}
        onClick={() => onOpenLightbox(0)}
        title="Click to view full screen ⛶"
        data-magnetic
      >
        <span className="mocap-tag" aria-hidden="true">
          <span className="rec-dot" />
          cam 02 · rec · ⛶ expand
        </span>
        <span className="corner tl" aria-hidden="true" />
        <span className="corner tr" aria-hidden="true" />
        <span className="corner bl" aria-hidden="true" />
        <span className="corner br" aria-hidden="true" />
        <img src={IMG.motion} alt={`Motion capture tracking view — ${p.annotations[0]}`} />
        <span className="scanline" aria-hidden="true" />
        <span
          className="anno"
          style={{ left: "5%", top: "12%", transform: `rotate(-2deg) translateY(${reduced ? 0 : (scan - 50) * 0.06}px)` }}
        >
          {p.annotations[0]}
          <span className="anno-line" />
        </span>
        <span
          className="anno"
          style={{ right: "6%", top: "48%", transform: "rotate(1.5deg)" }}
        >
          {p.annotations[1]}
          <span className="anno-line" />
        </span>
        <span
          className="anno"
          style={{ left: "38%", bottom: "9%", color: "var(--butter)", transform: "rotate(-1deg)" }}
        >
          {p.annotations[2]}
        </span>
        {!reduced && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${scan}%`,
              height: "1px",
              background: "rgba(121,199,197,0.5)",
              transition: "top 0.08s linear",
            }}
          />
        )}
      </div>

      <div className="mocap-data">
        <div className="data-title">recorded run · annotations</div>
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

      <div className="tag-row">
        {p.tags.map((t) => (
          <span className="tag" key={t}>
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Project: Quests — cinematic / product                               */
/* ------------------------------------------------------------------ */

function QuestsProject({ p, index, onOpenLightbox }) {
  const ref = useReveal();
  return (
    <article ref={ref} className="project project-quests reveal" aria-label={p.name}>
      <div className="quests-wide">
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
          <div className="tag-row">
            {p.tags.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
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

        <div
          className="quests-frame clickable-stage"
          data-magnetic
          onClick={() => onOpenLightbox(1)}
          style={{ cursor: "pointer" }}
          title="Click to view full screen ⛶"
        >
          <span className="tape" style={{ left: "8%", top: -12, transform: "rotate(-4deg)" }} />
          <img src={IMG.solar} alt={`Quests app scene — ${p.annotations[0]}`} />
          <div className="quests-ui" aria-hidden="true">
            <div className="ui-head">today’s quests</div>
            <div className="ui-row"><span className="dot" /> walk without your phone</div>
            <div className="ui-row"><span className="dot amber" /> read 10 pages</div>
            <div className="ui-row"><span className="dot" /> ship the small fix</div>
          </div>
          <p
            style={{
              fontFamily: "var(--hand)",
              color: "var(--cream)",
              fontSize: 17,
              textAlign: "center",
              margin: "10px 0 12px",
              transform: "rotate(-1deg)",
            }}
          >
            {p.annotations[0]} ✦ (click to expand)
          </p>
        </div>
      </div>
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

function ArchisProject({ p, index, onOpenLightbox }) {
  const ref = useReveal();
  return (
    <article ref={ref} className="project project-archis reveal" aria-label={p.name}>
      <div className="project-meta-row">
        <span className="project-index">{String(index).padStart(2, "0")} /</span>
        <h3 className="project-title">
          <a href={p.github} target="_blank" rel="noreferrer">
            {p.name}
          </a>
        </h3>
        <span className="project-year">{p.year}</span>
        <a className="btn-quiet" href={p.demo} target="_blank" rel="noreferrer">
          live prototype ↗
        </a>
      </div>
      <p className="project-blurb">{p.blurb}</p>

      <div className="archis-strip" style={{ marginTop: 34 }}>
        <div className="stage-card" data-magnetic>
          <span className="stage-label">blueprint</span>
          <BlueprintSvg />
        </div>
        <div className="stage-arrow" aria-hidden="true">→</div>
        <div
          className="stage-card clickable-stage"
          style={{ transform: "rotate(0.8deg)", cursor: "pointer" }}
          data-magnetic
          onClick={() => onOpenLightbox(2)}
          title="Click to view full screen ⛶"
        >
          <span className="stage-label">interpreted ⛶</span>
          <img src={IMG.portfolio} alt="Interpreted architectural space from the blueprint" />
        </div>
        <div className="stage-arrow" aria-hidden="true">→</div>
        <div
          className="stage-card clickable-stage"
          style={{ transform: "rotate(-0.6deg)", cursor: "pointer" }}
          data-magnetic
          onClick={() => onOpenLightbox(3)}
          title="Click to view full screen ⛶"
        >
          <span className="stage-label">3d / room ⛶</span>
          <img src={IMG.eeg} alt="Semantic 3D room model derived from the plan" />
        </div>
      </div>

      <table className="fact-table" style={{ marginTop: 20 }}>
        <tbody>
          {p.facts.map(([k, v]) => (
            <tr key={k}>
              <td>{k}</td>
              <td>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="tag-row">
        {p.tags.map((t) => (
          <span className="tag" key={t}>
            {t}
          </span>
        ))}
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
      return localStorage.getItem("lab-sound") !== "off";
    } catch {
      return true;
    }
  });

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
    const input = prompt("Type your handwritten note for the desk:", "keep building ✦");
    if (!input || !input.trim()) return;
    const colors = ["pink", "butter", "sage", "paper"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newNote = {
      id: `user-note-${Date.now()}`,
      color: randomColor,
      lines: [input.trim()],
      x: 30 + Math.floor(Math.random() * 140),
      y: 120 + Math.floor(Math.random() * 180),
      rotation: (Math.random() * 8 - 4).toFixed(1),
    };
    setUserNotes((prev) => {
      const updated = [...prev, newNote];
      try {
        localStorage.setItem("lab-user-notes", JSON.stringify(updated));
      } catch {
        /* ignore */
      }
      return updated;
    });
    showToast("Added sticky note to your desk! ✎");
  }, [soundEnabled, showToast]);

  const triggerSparkle = useCallback(
    (e) => {
      playClickSound(soundEnabled);
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      for (let i = 0; i < 6; i++) {
        const dot = document.createElement("span");
        dot.className = "cursor-dust";
        dot.style.width = "4px";
        dot.style.height = "4px";
        dot.style.background = "var(--clay)";
        dot.style.transform = `translate(${x + (Math.random() * 40 - 20)}px, ${
          y + (Math.random() * 40 - 20)
        }px)`;
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), 600);
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
      <LabHeader soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} />

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
            <span className="hero-hello">Hi, I’m</span>
            <h1 className="hero-name">
              {identity.name}
              <span className="scribble-x" aria-hidden="true">
                <ScribbleX />
              </span>
            </h1>
            <p className="hero-mainline">
              I build things because{" "}
              <span className="underline-draw">
                I want to know what happens if they work.
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
                title="Add a handwritten sticky note to the desk"
              >
                + add note ✎
              </button>
              <a className="btn-quiet" href={identity.links.github} target="_blank" rel="noreferrer">
                github ↗
              </a>
            </div>
          </div>

          <div
            ref={heroVisualsRef}
            className="hero-visuals"
            style={{ position: "relative", paddingTop: 26, minHeight: coarse ? 0 : 470 }}
          >
            <div onClick={() => openLightbox(4)} style={{ cursor: "pointer" }} title="Click to view full screen ⛶">
              <TiltPhoto
                src={IMG.portfolio}
                alt="a desk scene from one of the projects"
                caption="still here… (click to view full screen ⛶)"
                rotate={2.4}
                parallax={26}
                className="parallax-layer"
              />
            </div>
            {!coarse && !reduced && (
              <div className="sticky-layer" style={{ position: "absolute", inset: 0, height: "100%" }}>
                <StickyNote
                  id="hero-ideas"
                  color="pink"
                  rotation={-3.5}
                  x={-60}
                  y={-6}
                  parentRef={heroVisualsRef}
                  lines={heroSticky}
                  title="sticky note: ideas"
                />
              </div>
            )}
            {!coarse && !reduced && (
              <StickyNote
                id="hero-progress"
                color="butter"
                rotation={2.2}
                x={255}
                y={250}
                parentRef={heroVisualsRef}
                lines={["progress over", "perfection."]}
                title="sticky note: progress"
              />
            )}
            {!coarse && !reduced && userNotes.map((note) => (
              <StickyNote
                key={note.id}
                id={note.id}
                color={note.color}
                rotation={parseFloat(note.rotation)}
                x={note.x}
                y={note.y}
                parentRef={heroVisualsRef}
                lines={note.lines}
                title="custom sticky note"
              />
            ))}
            {coarse && (
              <div
                className="sticky-note static note-pink"
                style={{ position: "relative", marginTop: 18, transform: "rotate(-2deg)", left: 0, top: 0 }}
              >
                {heroSticky.map((l) => (
                  <div key={l}>– {l}</div>
                ))}
                <span className="note-fold" />
              </div>
            )}
          </div>
        </section>

        {/* ---------------- featured work ---------------- */}
        <section className="lab-section" id="work" aria-label="featured work">
          <SectionHead
            kicker="the desk"
            title="Work &"
            accent="experiments"
            sub="Some things I’ve built, broken, and keep coming back to. None of them are finished — that’s the point."
          />
          <MocapProject p={featuredProjects[0]} index={1} onOpenLightbox={openLightbox} />
          <span className="marginalia" style={{ right: "2%", top: "28%", transform: "rotate(2deg)" }} aria-hidden="true">
            two cameras, one skeleton →
          </span>
          <QuestsProject p={featuredProjects[1]} index={2} onOpenLightbox={openLightbox} />
          <span className="marginalia" style={{ left: "1%", top: "46%", transform: "rotate(-2deg)" }} aria-hidden="true">
            ← the gamification rabbit hole
          </span>
          <CyberBioProject p={featuredProjects[2]} index={3} />
          <span className="marginalia" style={{ right: "3%", top: "62%", transform: "rotate(1.5deg)" }} aria-hidden="true">
            attack, defend, then understand ↓
          </span>
          <ArchisProject p={featuredProjects[3]} index={4} onOpenLightbox={openLightbox} />
        </section>

        {/* ---------------- research + community ---------------- */}
        <section className="lab-section" id="research" aria-label="research and community">
          <SectionHead
            kicker="the shelf"
            title="Research &"
            accent="people"
            sub="Papers I’ve published, and the communities I help keep alive."
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
            kicker="the margins"
            title="Words &"
            accent="unfinished things"
            sub="Writing I keep doing, experiments currently on the bench, and ideas that refuse to leave."
          />
          <div className="two-col">
            <div className="paper-block block-tilt-r reveal" style={{ position: "relative" }}>
              <CatDoodle
                className="doodle interactive-doodle"
                style={{ position: "absolute", right: 14, top: -18, cursor: "pointer" }}
                onClick={triggerSparkle}
              />
              <h3>recent thoughts</h3>
              <ul className="paper-list">
                {recentThoughts.map((t) => (
                  <li key={t}>
                    <span className="li-marker">→</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <h3 style={{ marginTop: 18 }}>writing</h3>
              <ul className="paper-list">
                {writings.map((w) => (
                  <li key={w.id}>
                    <span className="li-marker">✎</span>
                    <span>
                      {w.href ? (
                        <a href={w.href} target="_blank" rel="noreferrer" onClick={() => playClickSound(soundEnabled)}>
                          {w.title}
                        </a>
                      ) : (
                        w.title
                      )}
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
            <span className="drawer-label">the drawer ↓ (everything else that compiles):</span>
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

        {/* ---------------- filmstrip ---------------- */}
        <section className="lab-section" aria-label="a few frames from life">
          <div className="filmstrip" data-magnetic="off">
            <div className="sprockets" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <i key={i} />
              ))}
            </div>
            <figure className="frame clickable-stage" onClick={() => openLightbox(0)} title="Click to view full screen ⛶">
              <img src={IMG.motion} alt="frame: mocap skeleton mid-capture" loading="lazy" />
              <figcaption>mocap, take 14 ⛶</figcaption>
            </figure>
            <figure className="frame clickable-stage" onClick={() => openLightbox(1)} title="Click to view full screen ⛶">
              <img src={IMG.solar} alt="frame: quests scene" loading="lazy" />
              <figcaption>quests beta ⛶</figcaption>
            </figure>
            <figure className="frame clickable-stage" onClick={() => openLightbox(3)} title="Click to view full screen ⛶">
              <img src={IMG.eeg} alt="frame: room model" loading="lazy" />
              <figcaption>archis room ⛶</figcaption>
            </figure>
            <figure className="frame clickable-stage" onClick={() => openLightbox(4)} title="Click to view full screen ⛶">
              <img src={IMG.portfolio} alt="frame: desk at night" loading="lazy" />
              <figcaption>2am desk ⛶</figcaption>
            </figure>
            <div className="sprockets" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <i key={i} />
              ))}
            </div>
          </div>
          <p
            style={{
              fontFamily: "var(--hand)",
              fontSize: 19,
              transform: "rotate(-1deg)",
              margin: "14px 4px 0",
              color: "var(--charcoal)",
            }}
          >
            a few frames from life → (click frames to inspect full screen ⛶)
          </p>
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
        <span>© {new Date().getFullYear()} Pedamallu Sai Mrudula · built by hand, on paper</span>
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

      {/* ambient doodles */}
      <CoffeeRing className="doodle interactive-doodle" style={{ position: "absolute", right: "4%", top: 120, zIndex: 0, cursor: "pointer" }} onClick={triggerSparkle} />
      <Sparkle className="doodle clay twinkle interactive-doodle" size={18} style={{ position: "absolute", left: "2%", top: 420, cursor: "pointer" }} onClick={triggerSparkle} />
      <ArrowDoodle className="doodle mossy" style={{ position: "absolute", left: "3%", top: 900 }} />
      <Sparkle className="doodle mossy twinkle slow interactive-doodle" size={13} style={{ position: "absolute", right: "8%", top: 2100, cursor: "pointer" }} onClick={triggerSparkle} />
      <CatDoodle className="doodle clay floaty slow interactive-doodle" size={50} style={{ position: "absolute", right: "5%", top: 3400, cursor: "pointer" }} onClick={triggerSparkle} />
      <Sparkle className="doodle pinky twinkle interactive-doodle" size={16} style={{ position: "absolute", left: "4%", top: 4300, cursor: "pointer" }} onClick={triggerSparkle} />
      <StarDoodle className="doodle mossy twinkle slow interactive-doodle" size={20} style={{ position: "absolute", right: "3%", top: 5200, cursor: "pointer" }} onClick={triggerSparkle} />
      <Constellation className="doodle clay interactive-doodle" style={{ position: "absolute", left: "2%", top: 5900, opacity: 0.65, cursor: "pointer" }} onClick={triggerSparkle} />
    </div>
  );
}
