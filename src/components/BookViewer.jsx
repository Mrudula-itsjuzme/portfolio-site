import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HTMLFlipBook from "react-pageflip";
import Page from "./Page";

/* ------------------------------------------------------------------
   Leather colour maps — kept in sync with BookSpine
------------------------------------------------------------------ */
const COVER_HEX = {
  "leather-oxblood":  "#5c1a1a",
  "leather-forest":   "#1a3d22",
  "leather-navy":     "#152236",
  "leather-charcoal": "#222228",
  "leather-brown":    "#4a2e14",
};
const COVER_DARK_HEX = {
  "leather-oxblood":  "#380808",
  "leather-forest":   "#091610",
  "leather-navy":     "#080e1c",
  "leather-charcoal": "#0e0e12",
  "leather-brown":    "#28100a",
};
const ACCENT_HEX = {
  "leather-oxblood":  "#c9a55a",
  "leather-forest":   "#b8a04a",
  "leather-navy":     "#c4ae6a",
  "leather-charcoal": "#b09050",
  "leather-brown":    "#c8a855",
};

function coverHex(project)     { return COVER_HEX[project?.leather]      || "#3d2810"; }
function coverDarkHex(project) { return COVER_DARK_HEX[project?.leather] || "#1c0c04"; }
function accentHex(project)    { return project?.accent || ACCENT_HEX[project?.leather] || "#c4a85a"; }

/* ------------------------------------------------------------------
   Data helpers — unchanged logic, isolated cleanly
------------------------------------------------------------------ */
function pickPage(project, kind) {
  return (project.pages || []).find((p) => p.kind === kind);
}

function safeTopicList(project) {
  if (Array.isArray(project?.topics) && project.topics.length) return project.topics;
  const stackPage = pickPage(project, "stack");
  if (Array.isArray(stackPage?.technologies) && stackPage.technologies.length) return stackPage.technologies;
  if (Array.isArray(stackPage?.bullets)       && stackPage.bullets.length)       return stackPage.bullets;
  return [project?.category || "Engineering", "Systems", "Implementation"];
}

function repoImageUrls(project) {
  const repoAssets  = project?.repoAssets || {};
  const galleryUrls = Array.isArray(repoAssets.galleryUrls) ? repoAssets.galleryUrls.filter(Boolean) : [];
  const seedBase    = encodeURIComponent(project?.id || project?.spineTitle || "project");
  const picsumA = `https://picsum.photos/seed/${seedBase}-a/900/540`;
  const picsumB = `https://picsum.photos/seed/${seedBase}-b/900/540`;
  const picsumC = `https://picsum.photos/seed/${seedBase}-c/900/540`;
  const full = String(project?.repoName || "").trim();
  if (!full || !full.includes("/")) {
    return {
      cover:        galleryUrls[0] || picsumA,
      architecture: repoAssets.diagramUrl || null,
      dashboard:    galleryUrls[1] || picsumC,
      gallery:      galleryUrls.length ? galleryUrls : [picsumA, picsumB, picsumC],
    };
  }
  const [owner, repo] = full.split("/");
  const eo = encodeURIComponent(owner || "owner");
  const er = encodeURIComponent(repo  || "repo");
  return {
    cover:        galleryUrls[0] || `https://opengraph.githubassets.com/1/${eo}/${er}`,
    architecture: repoAssets.diagramUrl || null,
    dashboard:    galleryUrls[1] || `https://gh-card.dev/repos/${eo}/${er}/languages.svg`,
    gallery:      galleryUrls.length
      ? galleryUrls
      : [`https://opengraph.githubassets.com/1/${eo}/${er}`, `https://gh-card.dev/repos/${eo}/${er}/languages.svg`, picsumC],
  };
}

function buildArchDiagram(lang, topics) {
  const l = (lang   || "").toLowerCase();
  const t = (topics || []).join(" ").toLowerCase();
  if (t.match(/train|model|neural|deep|classif|nlp|vision|keras|torch|sklearn|tensorflow/))
    return ["Raw Dataset","Feature Engineering","Model Training","Evaluation","Inference API"];
  if (t.match(/aircraft|flight|sensor|signal|embed|firmware|iot/))
    return ["Sensor / Data Source","Ingestion & Parsing","Processing Engine","Decision Layer","Output / Control"];
  if (t.match(/react|vue|angular|frontend|ui|component|next/))
    return ["Browser / Client","Component Tree","State Management","API Client","Backend Service"];
  if (t.match(/api|rest|express|fastapi|flask|django|backend|server|graphql/))
    return ["HTTP Request","Route Handler","Service Layer","Data Access","Database"];
  if (t.match(/data|pipeline|etl|warehouse|spark|kafka|stream|analytics/))
    return ["Data Source","Ingestion Pipeline","Transformation Layer","Storage","Analytics / Report"];
  if (l === "javascript" || l === "typescript")
    return ["Client Layer","Application Logic","State Store","API Integration","External Services"];
  if (l === "java" || l === "kotlin")
    return ["REST Endpoint","Controller","Service","Repository","Database"];
  if (l === "rust" || l === "go")
    return ["Input Stream","Parser / Lexer","Core Engine","Optimizer","Output"];
  if (l === "python")
    return ["Input Source","Processing Pipeline","Core Logic","Analysis Layer","Output & Report"];
  return ["Input","Validation","Core Logic","Processing","Output"];
}

function buildContextParagraphs(project, topics) {
  const lang = project.language || project.category || "various languages";
  const desc = project.description || project.synopsis || null;
  const name = project.spineTitle;
  const p1 = desc
    ? `${name} — ${desc}. Written primarily in ${lang}, every decision is shaped by real engineering constraints: reliability under load, clear failure modes, and low onboarding friction.`
    : `${name} is a ${lang} project built around practical patterns in the ${project.category || "software engineering"} domain. Choices are grounded in operational realities rather than theoretical ideals.`;
  const p2 = topics.length
    ? `Core areas covered in this volume include ${topics.slice(0, 5).join(", ")}. Each surfaces distinct trade-offs between performance, maintainability, and deployment simplicity.`
    : `The project follows a modular design: each component holds a single clear responsibility, enabling independent testing, clean failure paths, and confident incremental changes.`;
  const p3 = `Observability, explicit error paths, and incremental delivery are first-class requirements alongside functional correctness. The goal is a system that behaves predictably under pressure — not just in development.`;
  return [p1, p2, p3];
}

function buildImplementationNotes(project) {
  const lang = project.language || project.category || "the primary stack";
  const name = project.spineTitle;
  const langReason = {
    Python:     "its rich data-manipulation ecosystem, wide library coverage, and fast iteration loop for this class of problem",
    JavaScript: "its ubiquity in the browser and Node.js runtime, enabling shared types and logic across the full stack",
    TypeScript: "its type safety characteristics that eliminate an entire class of runtime errors before deployment",
    Java:       "its mature concurrency model, strong ecosystem, and proven track record in production systems",
    Rust:       "its memory safety guarantees without a garbage collector, delivering predictable latency at the systems level",
    Go:         "its simplicity, fast compilation, and excellent concurrency primitives for I/O-heavy workloads",
  }[lang] || "its maintainability characteristics and strong community support";
  return [
    `${name} is structured as a sequence of auditable stages, each producing verifiable intermediate artifacts. This makes debugging and stakeholder walkthroughs straightforward.`,
    `${lang} was selected for ${langReason}. Supporting dependencies are chosen for composability and long-term stability over trend-following.`,
    `Critical decision points are annotated throughout the repository: naming is intentional, interfaces are narrow, and observability is embedded in each layer rather than bolted on afterward.`,
  ];
}

function buildLessons(project, topics) {
  const hasML  = topics.some(t => /\b(ml|model|train|neural|ai|deep|classif|dataset)\b/.test(t));
  const hasWeb = topics.some(t => /\b(react|vue|api|frontend|web|ui|node)\b/.test(t));
  const first  = topics[0] || project.category || "engineering";
  if (hasML) return [
    "Data quality dominates model quality. Effort spent on clean, representative inputs pays back faster than architectural complexity in the model itself.",
    "Evaluation metrics are contracts: vague metrics produce vague systems. Making success criteria explicit before implementation avoids expensive post-hoc rationalization.",
    "Incremental experimentation beats large refactors. Each logged run becomes a reference point rather than a discarded draft.",
  ];
  if (hasWeb) return [
    "Component boundaries should follow data boundaries, not visual groupings. Splitting components visually while they share data accumulates accidental coupling quickly.",
    "State management simplifies when sources of truth are minimized. Derived state is easier than synchronized state in every framework.",
    "API contracts written before implementation prevent the most expensive integration rewrites. A typed interface spec is worth more than a week of ad-hoc debugging.",
  ];
  return [
    `Reliable ${first} systems are built through consistent small quality habits: explicit contracts, measurable outcomes, and incremental hardening rather than heroic last-minute fixes.`,
    "Most complexity becomes manageable when surfaced early through visual traces and plain-language documentation that the whole team can read.",
    "The archive metaphor reflects this process — each iteration is another annotated page, not a discarded draft. History is a feature, not a liability.",
  ];
}

function buildStackRationale(project, stack) {
  const lang = project.language || project.category || stack[0] || "the core technology";
  const name = project.spineTitle;
  return [
    `${lang} anchors ${name}. The choice reflects ecosystem maturity, strong package support, and well-established patterns for this class of problem.`,
    `Supporting libraries were selected for composability — each should be replaceable independently without triggering cascading rewrites in adjacent layers.`,
    `Dependency decisions prioritize long-term maintainability over short-term novelty. A library understood and maintained in two years is worth more than a trending one that disappears.`,
  ];
}

function buildPages(project) {
  const cover        = pickPage(project, "cover");
  const overview     = pickPage(project, "overview");
  const architecture = pickPage(project, "architecture");
  const workflow     = pickPage(project, "workflow");
  const stackPage    = pickPage(project, "stack");
  const resources    = pickPage(project, "resources");
  const github       = pickPage(project, "github");

  const topics   = safeTopicList(project);
  const images   = repoImageUrls(project);
  const stack    = stackPage?.technologies || stackPage?.bullets || topics;

  const problemText = overview?.problem || overview?.bullets?.[0] || project?.synopsis || "Problem statement unavailable.";
  const ideaText    = overview?.idea    || overview?.bullets?.[1] || "Implementation combines modular building blocks, explicit interfaces, and progressive validation.";
  const goalText    = overview?.goal    || overview?.bullets?.[2] || "Deliver production-ready behavior with measurable quality and maintainability.";

  const resourceLinks      = resources?.links  || resources?.bullets || [];
  const implementationSteps = workflow?.steps  || workflow?.bullets  || ["Workflow unavailable."];
  const archDiagram        = architecture?.diagram || buildArchDiagram(project.language || project.category, topics);
  const galleryItems       = (images.gallery || []).filter(Boolean).slice(0, 4).map((src, i) => ({ src, alt: `${project?.spineTitle} visual ${i + 1}` }));

  return [
    { id: "cover",             kind: "cover",        title: cover?.title || project.spineTitle, subtitle: cover?.subtitle || project.category, author: cover?.author || "Mrudula", year: cover?.year || project?.publishedYear || "2026", image: images.cover, archiveCode: project?.archiveCode, shelfMark: project?.shelfMark, sigil: project?.sigil },
    { id: "title-plate",       kind: "titleplate",   title: project?.spineTitle, subtitle: project?.category, archiveCode: project?.archiveCode, shelfMark: project?.shelfMark, monogram: project?.monogram, summary: project?.synopsis || problemText },
    { id: "overview",          kind: "overview",     title: overview?.title || "Overview", problem: problemText, idea: ideaText, goal: goalText, bullets: [problemText, ideaText, goalText] },
    { id: "context",           kind: "essay",        title: "Research Context", paragraphs: buildContextParagraphs(project, topics), image: images.dashboard, caption: "Repository language breakdown and activity metrics." },
    { id: "architecture",      kind: "architecture", title: architecture?.title || "System Architecture", diagram: archDiagram, text: architecture?.text || `A clean ${archDiagram.length}-stage pipeline: ${archDiagram.join(" → ")}. Each stage owns a focused responsibility with a testable boundary.`, image: images.architecture },
    { id: "architecture-deep", kind: "matrix",       title: "Component Responsibilities", columns: ["Layer","Primary Responsibility","Failure Strategy"], rows: [["Input Boundary","Validate and normalize incoming entities","Reject malformed data with trace IDs"],["Processing Core","Apply deterministic transformations","Checkpoint and retry idempotent stages"],["Inference / Logic","Generate outcome with explicit confidence","Fallback path + error budget accounting"],["Output Surface","Render usable artifacts and logs","Graceful degradation + event replay"]] },
    { id: "workflow",          kind: "workflow",     title: workflow?.title || "Working / Implementation", steps: implementationSteps },
    { id: "implementation",    kind: "essay",        title: "Implementation Notes", paragraphs: buildImplementationNotes(project), image: images.cover, caption: "GitHub repository preview for this project." },
    { id: "validation",        kind: "checklist",    title: "Validation And Quality Gates", checks: ["Data integrity checks on each intake boundary","Unit and integration assertions for core behavior","Regression snapshots for key outputs","Performance profiling under realistic load","Error telemetry with categorized failure modes","Readability pass for maintainability"] },
    { id: "metrics",           kind: "metrics",      title: "Operational Metrics", metrics: [{ label: "Repository Stars", value: String(project?.stars ?? "--") },{ label: "Repository Forks", value: String(project?.forks ?? "--") },{ label: "Primary Domain", value: project?.category || "Engineering" },{ label: "Tracked Topics", value: String(topics.length) }], image: images.dashboard },
    { id: "stack",             kind: "stack",        title: stackPage?.title || "Tech Stack", technologies: stack },
    { id: "stack-notes",       kind: "essay",        title: "Stack Rationale", paragraphs: buildStackRationale(project, stack) },
    { id: "resources",         kind: "resources",    title: resources?.title || "Resources", links: resourceLinks },
    { id: "gallery",           kind: "gallery",      title: "Visual Appendix", images: galleryItems.length ? galleryItems : [{ src: images.cover, alt: `${project?.spineTitle} project snapshot` }, ...(images.architecture ? [{ src: images.architecture, alt: `architecture diagram` }] : []), { src: images.dashboard, alt: "metrics view" }] },
    { id: "lessons",           kind: "essay",        title: "Lessons Learned", paragraphs: buildLessons(project, topics) },
    { id: "github",            kind: "github",       title: github?.title || "GitHub", buttonText: github?.buttonText || "View Repository" },
    { id: "back-matter",       kind: "titleplate",   title: "End Of Volume", subtitle: "Archive Reference", archiveCode: project?.archiveCode, shelfMark: project?.shelfMark, monogram: project?.monogram, summary: "Continue to the repository for commit-level detail, experiments, and implementation notes." },
  ];
}

/* ------------------------------------------------------------------
   BookViewer
------------------------------------------------------------------ */
export default function BookViewer({ project, onClose, onPageFlipSound }) {
  const flipRef  = useRef(null);
  const [page,      setPage]      = useState(0);
  const [bookOpen,  setBookOpen]  = useState(false);
  const [coverGone, setCoverGone] = useState(false);

  const pages  = useMemo(() => buildPages(project), [project]);
  const accent = accentHex(project);

  /* Reset when a different project is opened */
  useEffect(() => {
    setPage(0);
    setBookOpen(false);
    setCoverGone(false);
    const t1 = setTimeout(() => setBookOpen(true),  420);
    const t2 = setTimeout(() => setCoverGone(true), 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [project.id]);

  /* Keyboard navigation */
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowRight") flipRef.current?.pageFlip()?.flipNext();
      if (e.key === "ArrowLeft")  flipRef.current?.pageFlip()?.flipPrev();
      if (e.key === "Escape")     onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isFirst = page === 0;
  const isLast  = page >= pages.length - 1;

  /* ---------------------------------------------------------------- */
  return (
    <motion.div
      style={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.section
        style={styles.desk}
        initial={{ scale: 0.88, y: 56, opacity: 0 }}
        animate={{ scale: 1,    y: 0,  opacity: 1 }}
        exit={{    scale: 0.90, y: 28, opacity: 0 }}
        transition={{ type: "spring", stiffness: 210, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Top bar ─────────────────────────────── */}
        <div style={styles.topbar}>
          <div>
            <p style={{ ...styles.eyebrow, color: accent }}>Portfolio Archive</p>
            <h2 style={styles.title}>{project.spineTitle}</h2>
            <p style={styles.category}>{project.category}</p>
          </div>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Close book viewer">
            <span style={{ fontSize: 18, lineHeight: 1 }}>×</span>
          </button>
        </div>

        {/* ── Book stage ──────────────────────────── */}
        <div style={styles.stage}>

          {/* 3-D opening animation wrapper */}
          <motion.div
            style={{ perspective: "1400px", transformStyle: "preserve-3d", position: "relative" }}
            initial={{ rotateX: -22, rotateY: 6, opacity: 0, scale: 0.82 }}
            animate={{ rotateX: 0,   rotateY: 0, opacity: 1, scale: 1   }}
            transition={{ type: "spring", stiffness: 180, damping: 20, delay: 0.1 }}
          >

            {/* Physical cover flap — animates open then unmounts */}
            <AnimatePresence>
              {!coverGone && (
                <motion.div
                  style={{
                    ...styles.coverFlap,
                    background: `linear-gradient(145deg, ${coverHex(project)} 0%, ${coverDarkHex(project)} 100%)`,
                  }}
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: bookOpen ? -110 : 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.78, ease: [0.4, 0, 0.15, 1] }}
                >
                  {/* Grain texture overlay */}
                  <div style={styles.coverGrain} />
                  {/* Cover content */}
                  <div style={styles.coverInner}>
                    <div style={{ ...styles.coverRule, background: accent }} />
                    <p style={{ ...styles.coverKicker, color: `${accent}99` }}>Portfolio Archive</p>
                    <h2 style={{ ...styles.coverTitle, color: accent }}>{project.spineTitle}</h2>
                    <p style={{ ...styles.coverSub, color: `${accent}bb` }}>{project.category || "Engineering"}</p>
                    <div style={{ ...styles.coverRule, background: accent, marginTop: "auto", marginBottom: 0 }} />
                    <p style={{ ...styles.coverYear, color: `${accent}66` }}>
                      {project.publishedYear || new Date().getFullYear()}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* The flip book */}
            <HTMLFlipBook
              ref={flipRef}
              width={460}
              height={620}
              size="stretch"
              showCover
              maxShadowOpacity={0.45}
              drawShadow
              flippingTime={820}
              mobileScrollSupport
              className="flipbook"
              onFlip={(e) => {
                setPage(e.data);
                onPageFlipSound?.();
              }}
            >
              {pages.map((p, i) => (
                <Page
                  key={`${project.id}-${p.id}-${i}`}
                  page={p}
                  index={i}
                  total={pages.length}
                  project={project}
                />
              ))}
            </HTMLFlipBook>

          </motion.div>
        </div>

        {/* ── Page controls ───────────────────────── */}
        <footer style={styles.controls}>
          <button
            style={{ ...styles.navBtn, opacity: isFirst ? 0.3 : 1 }}
            disabled={isFirst}
            onClick={() => flipRef.current?.pageFlip()?.flipPrev()}
          >
            ← Prev
          </button>

          <span style={styles.pageCount}>
            {Math.min(page + 1, pages.length)}&thinsp;/&thinsp;{pages.length}
          </span>

          <button
            style={{ ...styles.navBtn, opacity: isLast ? 0.3 : 1 }}
            disabled={isLast}
            onClick={() => flipRef.current?.pageFlip()?.flipNext()}
          >
            Next →
          </button>
        </footer>

        {/* ── Keyboard hint ───────────────────────── */}
        <p style={styles.keyHint}>← → arrow keys · Esc to close</p>

      </motion.section>
    </motion.div>
  );
}

/* ------------------------------------------------------------------
   Styles object — dark library aesthetic, no className dependency
------------------------------------------------------------------ */
const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(8, 18, 12, 0.82)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: "20px 16px",
  },
  desk: {
    position: "relative",
    background: [
      "linear-gradient(170deg, #1e2e22 0%, #141e18 55%, #0e1812 100%)",
    ].join(","),
    border: "0.5px solid rgba(180,155,90,0.18)",
    borderRadius: 6,
    boxShadow: [
      "0 40px 80px rgba(0,0,0,0.75)",
      "0 0 0 1px rgba(0,0,0,0.6)",
      "inset 0 1px 0 rgba(200,175,100,0.08)",
    ].join(", "),
    width: "min(960px, 96vw)",
    maxHeight: "96vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  topbar: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "20px 24px 16px",
    borderBottom: "0.5px solid rgba(180,155,90,0.12)",
    flexShrink: 0,
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: "0.26em",
    textTransform: "uppercase",
    fontFamily: "'Lora', Georgia, serif",
    fontStyle: "italic",
    margin: "0 0 4px",
    opacity: 0.75,
  },
  title: {
    fontSize: "clamp(18px, 2.8vw, 26px)",
    fontWeight: 600,
    fontFamily: "'Playfair Display', Georgia, serif",
    color: "rgba(235,220,190,0.94)",
    margin: "0 0 3px",
    letterSpacing: "0.01em",
    lineHeight: 1.2,
  },
  category: {
    fontSize: 12,
    fontFamily: "'Lora', Georgia, serif",
    fontStyle: "italic",
    color: "rgba(180,160,110,0.5)",
    margin: 0,
    letterSpacing: "0.06em",
  },
  closeBtn: {
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(180,155,90,0.22)",
    borderRadius: 4,
    color: "rgba(200,180,130,0.6)",
    width: 32,
    height: 32,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
    transition: "background 0.18s, color 0.18s",
  },
  stage: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 20px",
    minHeight: 0,
  },
  coverFlap: {
    position: "absolute",
    inset: 0,
    zIndex: 20,
    borderRadius: 3,
    transformOrigin: "2% 50%",
    backfaceVisibility: "hidden",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  coverGrain: {
    position: "absolute",
    inset: 0,
    backgroundImage: [
      "repeating-linear-gradient(172deg, rgba(255,255,255,0) 0px, rgba(255,255,255,0.022) 1px, rgba(0,0,0,0.035) 2px, rgba(0,0,0,0) 7px)",
      "linear-gradient(90deg, rgba(0,0,0,0.22) 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.06) 70%, rgba(0,0,0,0.24) 100%)",
    ].join(", "),
    pointerEvents: "none",
  },
  coverInner: {
    position: "relative",
    zIndex: 1,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 28px",
    gap: 10,
  },
  coverRule: {
    width: "40%",
    height: "0.5px",
    opacity: 0.55,
  },
  coverKicker: {
    fontSize: 10,
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    fontFamily: "'Lora', Georgia, serif",
    fontStyle: "italic",
    margin: "4px 0 0",
  },
  coverTitle: {
    fontSize: "clamp(20px, 4vw, 34px)",
    fontWeight: 600,
    fontFamily: "'Playfair Display', Georgia, serif",
    textAlign: "center",
    letterSpacing: "0.03em",
    lineHeight: 1.2,
    margin: "6px 0 4px",
  },
  coverSub: {
    fontSize: 13,
    fontFamily: "'Lora', Georgia, serif",
    fontStyle: "italic",
    letterSpacing: "0.08em",
  },
  coverYear: {
    fontSize: 11,
    fontFamily: "'Lora', Georgia, serif",
    letterSpacing: "0.18em",
    marginTop: 6,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    padding: "14px 24px 10px",
    borderTop: "0.5px solid rgba(180,155,90,0.10)",
    flexShrink: 0,
  },
  navBtn: {
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(180,155,90,0.22)",
    borderRadius: 3,
    color: "rgba(200,180,130,0.75)",
    fontSize: 12,
    fontFamily: "'Lora', Georgia, serif",
    fontStyle: "italic",
    letterSpacing: "0.08em",
    padding: "7px 18px",
    cursor: "pointer",
    transition: "background 0.18s, color 0.18s",
  },
  pageCount: {
    fontSize: 12,
    fontFamily: "'Lora', Georgia, serif",
    fontStyle: "italic",
    color: "rgba(180,160,110,0.45)",
    letterSpacing: "0.06em",
    userSelect: "none",
  },
  keyHint: {
    textAlign: "center",
    fontSize: 10,
    fontFamily: "'Lora', Georgia, serif",
    fontStyle: "italic",
    color: "rgba(180,160,110,0.22)",
    letterSpacing: "0.12em",
    padding: "0 0 12px",
    flexShrink: 0,
    userSelect: "none",
  },
};