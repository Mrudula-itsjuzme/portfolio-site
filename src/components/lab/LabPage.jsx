import { useEffect, useRef, useState } from "react";
import {
  identity,
  featuredProjects,
  researchPapers,
  community,
  recentThoughts,
  writings,
  currentExperiments,
  unfinishedIdeas,
  currentlyBoard,
  heroSticky,
  quote,
} from "../../data/lab";
import StickyNote, { useCoarsePointer, usePrefersReducedMotion } from "./StickyNote";
import TiltPhoto from "./TiltPhoto";
import LabHeader from "./LabHeader";
import useReveal from "./useReveal";
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

function SectionHead({ kicker, title, accent, sub, id }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal" id={id}>
      <span className="lab-kicker">{kicker}</span>
      <h2 className="lab-h2">
        {title} {accent ? <span className="accent">{accent}</span> : null}
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
        className="mocap-stage parallax-layer"
        style={{ marginTop: 26 }}
        data-magnetic
      >
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

function QuestsProject({ p, index }) {
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

        <div className="quests-frame" data-magnetic>
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
            {p.annotations[0]} ✦
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

function ArchisProject({ p, index }) {
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
        <div className="stage-card" style={{ transform: "rotate(0.8deg)" }} data-magnetic>
          <span className="stage-label">interpreted</span>
          <img src={IMG.portfolio} alt="Interpreted architectural space from the blueprint" />
        </div>
        <div className="stage-arrow" aria-hidden="true">→</div>
        <div className="stage-card" style={{ transform: "rotate(-0.6deg)" }} data-magnetic>
          <span className="stage-label">3d / room</span>
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

const VARIANT = {
  mocap: MocapProject,
  quests: QuestsProject,
  cyberbio: CyberBioProject,
  archis: ArchisProject,
};

export default function LabPage() {
  const deskRef = useRef(null);
  const heroVisualsRef = useRef(null);
  const heroTextRef = useReveal({ hidden: false });
  const coarse = useCoarsePointer();
  const reduced = usePrefersReducedMotion();
  const [notePositions] = useState(() => ({
    hero: { x: 0, y: 30 },
  }));

  return (
    <div className="lab" id="top">
      <LabHeader />

      <main>

      {/* ---------------- hero ---------------- */}
      <section className="hero" ref={deskRef} aria-label="introduction">
        <div ref={heroTextRef} className="in-view-slot">
          <StarDoodle className="doodle mossy" size={26} style={{ position: "absolute", left: -8, top: 58 }} />
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
            <a className="btn-ink" href="#work">
              see the work ↓
            </a>
            <a className="btn-quiet" href={identity.links.github} target="_blank" rel="noreferrer">
              github ↗
            </a>
          </div>
        </div>

        <div ref={heroVisualsRef} className="hero-visuals" style={{ position: "relative", paddingTop: 26, minHeight: coarse ? 0 : 470 }}>
          <TiltPhoto
            src={IMG.portfolio}
            alt="a desk scene from one of the projects"
            caption="still here… (and it’s kind of beautiful)"
            rotate={2.4}
            parallax={26}
            className="parallax-layer"
          />
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
          title="Featured"
          accent="work"
          sub="Some things I’ve built, broken, and keep coming back to. None of them are finished — that’s the point."
        />
        <MocapProject p={featuredProjects[0]} index={1} />
        <QuestsProject p={featuredProjects[1]} index={2} />
        <CyberBioProject p={featuredProjects[2]} index={3} />
        <ArchisProject p={featuredProjects[3]} index={4} />
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
                    <a href={r.href} target="_blank" rel="noreferrer">
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
          accent="experiments"
          sub="Writing I keep doing, experiments currently on the bench, and ideas that refuse to leave."
        />
        <div className="two-col">
          <div className="paper-block block-tilt-r reveal" style={{ position: "relative" }}>
            <CatDoodle className="doodle" style={{ position: "absolute", right: 14, top: -18 }} />
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
                      <a href={w.href} target="_blank" rel="noreferrer">
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
              <Constellation className="doodle mossy" style={{ position: "absolute", right: 10, top: 8, opacity: 0.7 }} />
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

      {/* ---------------- filmstrip ---------------- */}
      <section className="lab-section" aria-label="a few frames from life">
        <div className="filmstrip" data-magnetic="off">
          <div className="sprockets" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <i key={i} />
            ))}
          </div>
          <figure className="frame">
            <img src={IMG.motion} alt="frame: mocap skeleton mid-capture" loading="lazy" />
            <figcaption>mocap, take 14</figcaption>
          </figure>
          <figure className="frame">
            <img src={IMG.solar} alt="frame: quests scene" loading="lazy" />
            <figcaption>quests beta</figcaption>
          </figure>
          <figure className="frame">
            <img src={IMG.eeg} alt="frame: room model" loading="lazy" />
            <figcaption>archis room</figcaption>
          </figure>
          <figure className="frame">
            <img src={IMG.portfolio} alt="frame: desk at night" loading="lazy" />
            <figcaption>2am desk</figcaption>
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
          a few frames from life →
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
        <span>
          <a href={identity.links.github} target="_blank" rel="noreferrer">
            github
          </a>{" "}
          ·{" "}
          <a href={identity.links.linkedin} target="_blank" rel="noreferrer">
            linkedin
          </a>{" "}
          · <a href={identity.links.email}>email</a>
        </span>
        <span>© {new Date().getFullYear()} Pedamallu Sai Mrudula · built by hand, on paper</span>
      </footer>

      {/* ambient doodles */}
      <CoffeeRing className="doodle" style={{ position: "absolute", right: "4%", top: 120, zIndex: 0 }} />
      <Sparkle className="doodle clay" size={18} style={{ position: "absolute", left: "2%", top: 420 }} />
      <ArrowDoodle className="doodle mossy" style={{ position: "absolute", left: "3%", top: 900 }} />
    </div>
  );
}
