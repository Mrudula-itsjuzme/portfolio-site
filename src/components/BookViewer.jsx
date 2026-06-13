import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import HTMLFlipBook from "react-pageflip";
import Page from "./Page";

function pickPage(project, kind) {
  return (project.pages || []).find((p) => p.kind === kind);
}

function safeTopicList(project) {
  if (Array.isArray(project?.topics) && project.topics.length) {
    return project.topics;
  }

  const stackPage = pickPage(project, "stack");
  if (Array.isArray(stackPage?.technologies) && stackPage.technologies.length) {
    return stackPage.technologies;
  }

  if (Array.isArray(stackPage?.bullets) && stackPage.bullets.length) {
    return stackPage.bullets;
  }

  return [project?.category || "Engineering", "Systems", "Implementation"];
}

function repoImageUrls(project) {
  const repoAssets = project?.repoAssets || {};
  const galleryUrls = Array.isArray(repoAssets.galleryUrls) ? repoAssets.galleryUrls.filter(Boolean) : [];
  const seedBase = encodeURIComponent(project?.id || project?.spineTitle || "project");
  const picsumA = `https://picsum.photos/seed/${seedBase}-a/900/540`;
  const picsumB = `https://picsum.photos/seed/${seedBase}-b/900/540`;
  const picsumC = `https://picsum.photos/seed/${seedBase}-c/900/540`;

  const full = String(project?.repoName || "").trim();
  if (!full || !full.includes("/")) {
    return {
      cover: galleryUrls[0] || picsumA,
      architecture: repoAssets.diagramUrl || null,
      dashboard: galleryUrls[1] || picsumC,
      gallery: galleryUrls.length ? galleryUrls : [picsumA, picsumB, picsumC],
    };
  }

  const [owner, repo] = full.split("/");
  const encodedOwner = encodeURIComponent(owner || "owner");
  const encodedRepo = encodeURIComponent(repo || "repo");

  return {
    cover: galleryUrls[0] || `https://opengraph.githubassets.com/1/${encodedOwner}/${encodedRepo}`,
    architecture: repoAssets.diagramUrl || null,
    dashboard: galleryUrls[1] || `https://gh-card.dev/repos/${encodedOwner}/${encodedRepo}/languages.svg`,
    gallery: galleryUrls.length
      ? galleryUrls
      : [
        `https://opengraph.githubassets.com/1/${encodedOwner}/${encodedRepo}`,
        `https://gh-card.dev/repos/${encodedOwner}/${encodedRepo}/languages.svg`,
        picsumC,
      ]
  };
}

const COVER_HEX = {
  "leather-oxblood": "#5c1a1a",
  "leather-forest": "#1a3d22",
  "leather-navy": "#152236",
  "leather-charcoal": "#222228",
  "leather-brown": "#4a2e14",
};
const COVER_DARK_HEX = {
  "leather-oxblood": "#380808",
  "leather-forest": "#091610",
  "leather-navy": "#080e1c",
  "leather-charcoal": "#0e0e12",
  "leather-brown": "#28100a",
};
function coverHex(project) {
  return COVER_HEX[project?.leather] || "#3d2810";
}
function coverDarkHex(project) {
  return COVER_DARK_HEX[project?.leather] || "#1c0c04";
}

function buildArchDiagram(lang, topics) {
  const l = (lang || "").toLowerCase();
  const t = (topics || []).join(" ").toLowerCase();
  if (t.match(/train|model|neural|deep|classif|nlp|vision|keras|torch|sklearn|tensorflow/)) {
    return ["Raw Dataset", "Feature Engineering", "Model Training", "Evaluation", "Inference API"];
  }
  if (t.match(/aircraft|flight|sensor|signal|embed|firmware|iot/)) {
    return ["Sensor / Data Source", "Ingestion & Parsing", "Processing Engine", "Decision Layer", "Output / Control"];
  }
  if (t.match(/react|vue|angular|frontend|ui|component|next/)) {
    return ["Browser / Client", "Component Tree", "State Management", "API Client", "Backend Service"];
  }
  if (t.match(/api|rest|express|fastapi|flask|django|backend|server|graphql/)) {
    return ["HTTP Request", "Route Handler", "Service Layer", "Data Access", "Database"];
  }
  if (t.match(/data|pipeline|etl|warehouse|spark|kafka|stream|analytics/)) {
    return ["Data Source", "Ingestion Pipeline", "Transformation Layer", "Storage", "Analytics / Report"];
  }
  if (l === "javascript" || l === "typescript") {
    return ["Client Layer", "Application Logic", "State Store", "API Integration", "External Services"];
  }
  if (l === "java" || l === "kotlin") {
    return ["REST Endpoint", "Controller", "Service", "Repository", "Database"];
  }
  if (l === "rust" || l === "go") {
    return ["Input Stream", "Parser / Lexer", "Core Engine", "Optimizer", "Output"];
  }
  if (l === "python") {
    return ["Input Source", "Processing Pipeline", "Core Logic", "Analysis Layer", "Output & Report"];
  }
  return ["Input", "Validation", "Core Logic", "Processing", "Output"];
}

function buildContextParagraphs(project, topics) {
  const lang = project.language || project.category || "various languages";
  const desc = project.description || project.synopsis || null;
  const name = project.spineTitle;
  const p1 = desc
    ? `${name} — ${desc}. Written primarily in ${lang}, every decision is shaped by real engineering constraints: reliability under load, clear failure modes, and low onboarding friction.`
    : `${name} is a ${lang} project built around practical patterns in the ${project.category || "software engineering"} domain. Choices are grounded in operational realities rather than theoretical ideals.`;
  const p2 = topics.length
    ? `Core areas covered in this volume include ${topics.slice(0, 5).join(", ")}. Each surfaces distinct trade-offs between performance, maintainability, and deployment simplicity — all documented across the chapters ahead.`
    : `The project follows a modular design: each component holds a single clear responsibility, enabling independent testing, clean failure paths, and confident incremental changes.`;
  const p3 = `Observability, explicit error paths, and incremental delivery are first-class requirements alongside functional correctness. The goal is a system that behaves predictably under pressure — not just in development.`;
  return [p1, p2, p3];
}

function buildImplementationNotes(project) {
  const lang = project.language || project.category || "the primary stack";
  const name = project.spineTitle;
  const langReason = {
    Python: "its rich data-manipulation ecosystem, wide library coverage, and fast iteration loop for this class of problem",
    JavaScript: "its ubiquity in the browser and Node.js runtime, enabling shared types and logic across the full stack",
    TypeScript: "its type safety characteristics that eliminate an entire class of runtime errors before deployment",
    Java: "its mature concurrency model, strong ecosystem, and proven track record in production systems",
    Rust: "its memory safety guarantees without a garbage collector, delivering predictable latency at the systems level",
    Go: "its simplicity, fast compilation, and excellent concurrency primitives for I/O-heavy workloads",
  }[lang] || "its maintainability characteristics and strong community support";
  return [
    `${name} is structured as a sequence of auditable stages, each producing verifiable intermediate artifacts. This makes debugging and stakeholder walkthroughs straightforward — no opaque end-to-end scripts.`,
    `${lang} was selected for ${langReason}. Supporting dependencies are chosen for composability and long-term stability over trend-following.`,
    `Critical decision points are annotated throughout the repository: naming is intentional, interfaces are narrow, and observability is embedded in each layer rather than bolted on afterward.`,
  ];
}

function buildLessons(project, topics) {
  const hasML = topics.some(t => /\b(ml|model|train|neural|ai|deep|classif|dataset)\b/.test(t));
  const hasWeb = topics.some(t => /\b(react|vue|api|frontend|web|ui|node)\b/.test(t));
  const firstTopic = topics[0] || project.category || "engineering";
  if (hasML) {
    return [
      "Data quality dominates model quality. Effort spent on clean, representative inputs pays back faster than architectural complexity in the model itself.",
      "Evaluation metrics are contracts: vague metrics produce vague systems. Making success criteria explicit before implementation avoids expensive post-hoc rationalization.",
      "Incremental experimentation beats large refactors. Each logged run becomes a reference point rather than a discarded draft — the archive metaphor applies literally here.",
    ];
  }
  if (hasWeb) {
    return [
      "Component boundaries should follow data boundaries, not visual groupings. Splitting components visually while they share data accumulates accidental coupling quickly.",
      "State management simplifies when sources of truth are minimized. Derived state is easier than synchronized state in every framework.",
      "API contracts written before implementation prevent the most expensive integration rewrites. A typed interface spec is worth more than a week of ad-hoc debugging.",
    ];
  }
  return [
    `Reliable ${firstTopic} systems are built through consistent small quality habits: explicit contracts, measurable outcomes, and incremental hardening rather than heroic last-minute fixes.`,
    "Most complexity becomes manageable when surfaced early through visual traces and plain-language documentation that the whole team can read.",
    "The archive metaphor reflects this process — each iteration is another annotated page, not a discarded draft. History is a feature, not a liability.",
  ];
}

function buildStackRationale(project, stack) {
  const lang = project.language || project.category || stack[0] || "the core technology";
  const name = project.spineTitle;
  return [
    `${lang} anchors ${name}. The choice reflects ecosystem maturity, strong package support, and well-established patterns for this class of problem that the community has stress-tested in production.`,
    `Supporting libraries were selected for composability — each should be replaceable independently without triggering cascading rewrites in adjacent layers. Abstraction boundaries are respected, not leaked.`,
    `Dependency decisions prioritize long-term maintainability over short-term novelty. A library understood and maintained in two years is worth more than a trending one that disappears.`,
  ];
}

function buildPages(project) {
  const cover = pickPage(project, "cover");
  const overview = pickPage(project, "overview");
  const architecture = pickPage(project, "architecture");
  const workflow = pickPage(project, "workflow");
  const stackPage = pickPage(project, "stack");
  const resources = pickPage(project, "resources");
  const github = pickPage(project, "github");

  const topics = safeTopicList(project);
  const images = repoImageUrls(project);

  const problemText =
    overview?.problem ||
    overview?.bullets?.[0] ||
    project?.synopsis ||
    "Problem statement unavailable.";

  const ideaText =
    overview?.idea ||
    overview?.bullets?.[1] ||
    "Implementation combines modular building blocks, explicit interfaces, and progressive validation.";

  const goalText =
    overview?.goal ||
    overview?.bullets?.[2] ||
    "Deliver production-ready behavior with measurable quality and maintainability.";

  const stack = stackPage?.technologies || stackPage?.bullets || topics;
  const resourceLinks = resources?.links || resources?.bullets || [];
  const implementationSteps = workflow?.steps || workflow?.bullets || ["Workflow unavailable."];
  const architectureDiagram = architecture?.diagram || buildArchDiagram(project.language || project.category, topics);
  const galleryItems = (images.gallery || [])
    .filter(Boolean)
    .slice(0, 4)
    .map((src, index) => ({
      src,
      alt: `${project?.spineTitle} visual ${index + 1}`,
    }));

  const pages = [];

  pages.push({
    id: "cover",
    kind: "cover",
    title: cover?.title || project.spineTitle,
    subtitle: cover?.subtitle || project.category,
    author: cover?.author || "Mrudula",
    year: cover?.year || project?.publishedYear || "2026",
    image: images.cover,
    archiveCode: project?.archiveCode,
    shelfMark: project?.shelfMark,
    sigil: project?.sigil
  });

  pages.push({
    id: "title-plate",
    kind: "titleplate",
    title: project?.spineTitle,
    subtitle: project?.category,
    archiveCode: project?.archiveCode,
    shelfMark: project?.shelfMark,
    monogram: project?.monogram,
    summary: project?.synopsis || problemText
  });

  pages.push({
    id: "overview",
    kind: "overview",
    title: overview?.title || "Overview",
    problem: problemText,
    idea: ideaText,
    goal: goalText,
    bullets: [problemText, ideaText, goalText]
  });

  pages.push({
    id: "context",
    kind: "essay",
    title: "Research Context",
    paragraphs: buildContextParagraphs(project, topics),
    image: images.dashboard,
    caption: "Repository language breakdown and activity metrics."
  });

  pages.push({
    id: "architecture",
    kind: "architecture",
    title: architecture?.title || "System Architecture",
    diagram: architectureDiagram,
    text: architecture?.text || `A clean ${architectureDiagram.length}-stage pipeline: ${architectureDiagram.join(" → ")}. Each stage owns a focused responsibility with a testable boundary, enabling isolated debugging and confident refactors without cascade risk.`,
    image: images.architecture
  });

  pages.push({
    id: "architecture-deep",
    kind: "matrix",
    title: "Component Responsibilities",
    columns: ["Layer", "Primary Responsibility", "Failure Strategy"],
    rows: [
      ["Input Boundary", "Validate and normalize incoming entities", "Reject malformed data with trace IDs"],
      ["Processing Core", "Apply deterministic transformations", "Checkpoint and retry idempotent stages"],
      ["Inference / Logic", "Generate outcome with explicit confidence", "Fallback path + error budget accounting"],
      ["Output Surface", "Render usable artifacts and logs", "Graceful degradation + event replay"]
    ]
  });

  pages.push({
    id: "workflow",
    kind: "workflow",
    title: workflow?.title || "Working / Implementation",
    steps: implementationSteps
  });

  pages.push({
    id: "implementation-notes",
    kind: "essay",
    title: "Implementation Notes",
    paragraphs: buildImplementationNotes(project),
    image: images.cover,
    caption: "GitHub repository preview for this project."
  });

  pages.push({
    id: "validation",
    kind: "checklist",
    title: "Validation And Quality Gates",
    checks: [
      "Data integrity checks on each intake boundary",
      "Unit and integration assertions for core behavior",
      "Regression snapshots for key outputs",
      "Performance profiling under realistic load",
      "Error telemetry with categorized failure modes",
      "Readability pass for maintainability"
    ]
  });

  pages.push({
    id: "metrics",
    kind: "metrics",
    title: "Operational Metrics",
    metrics: [
      { label: "Repository Stars", value: String(project?.stars ?? "--") },
      { label: "Repository Forks", value: String(project?.forks ?? "--") },
      { label: "Primary Domain", value: project?.category || "Engineering" },
      { label: "Tracked Topics", value: String(topics.length) }
    ],
    image: images.dashboard
  });

  pages.push({
    id: "stack",
    kind: "stack",
    title: stackPage?.title || "Tech Stack",
    technologies: stack
  });

  pages.push({
    id: "stack-notes",
    kind: "essay",
    title: "Stack Rationale",
    paragraphs: buildStackRationale(project, stack)
  });

  pages.push({
    id: "resources",
    kind: "resources",
    title: resources?.title || "Resources",
    links: resourceLinks
  });

  pages.push({
    id: "gallery",
    kind: "gallery",
    title: "Visual Appendix",
    images: galleryItems.length
      ? galleryItems
      : [
        { src: images.cover, alt: `${project?.spineTitle} project snapshot` },
        ...(images.architecture ? [{ src: images.architecture, alt: `${project?.spineTitle} architecture diagram` }] : []),
        { src: images.dashboard, alt: `${project?.spineTitle} language or metrics view` }
      ]
  });

  pages.push({
    id: "lessons",
    kind: "essay",
    title: "Lessons Learned",
    paragraphs: buildLessons(project, topics)
  });

  pages.push({
    id: "github",
    kind: "github",
    title: github?.title || "GitHub",
    buttonText: github?.buttonText || "View Repository"
  });

  pages.push({
    id: "back-matter",
    kind: "titleplate",
    title: "End Of Volume",
    subtitle: "Archive Reference",
    archiveCode: project?.archiveCode,
    shelfMark: project?.shelfMark,
    monogram: project?.monogram,
    summary: "Continue to the repository for commit-level detail, experiments, and implementation notes."
  });

  return pages;
}

export default function BookViewer({ project, onClose, onPageFlipSound }) {
  const flipRef = useRef(null);
  const [page, setPage] = useState(0);

  const pages = useMemo(() => buildPages(project), [project]);

  const [bookOpen, setBookOpen] = useState(false);

  useEffect(() => {
    setPage(0);
    setBookOpen(false);
    const t = setTimeout(() => setBookOpen(true), 400);
    return () => clearTimeout(t);
  }, [project.id]);

  function flipNext() {
    flipRef.current?.pageFlip()?.flipNext();
  }

  function flipPrev() {
    flipRef.current?.pageFlip()?.flipPrev();
  }

  useEffect(() => {
    function key(e) {
      if (e.key === "ArrowRight") {
        flipNext();
      }

      if (e.key === "ArrowLeft") {
        flipPrev();
      }

      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  return (
    <motion.div
      className="viewer-backdrop archive-viewer-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.section
        className="viewer-desk archive-desk"
        initial={{ scale: 0.86, y: 60, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.88, y: 30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="archive-desk-glow" />
        <div className="archive-desk-grain" />

        <button className="close-viewer archive-close" onClick={onClose}>
          Close ×
        </button>

        <header className="viewer-header archive-viewer-header">
          <div className="archive-title-rule" />
          <h2>{project.spineTitle}</h2>
          <p>
            {project.category} <span>•</span> Archive Entry
          </p>
        </header>

        <div className="archive-stage">
          <aside className="archive-prop archive-prop-left">
            <div className="mini-teddy teddy-left">
              <div className="teddy-ear teddy-ear-left" />
              <div className="teddy-ear teddy-ear-right" />
              <div className="teddy-head">
                <span className="teddy-eye eye-left" />
                <span className="teddy-eye eye-right" />
                <span className="teddy-nose" />
              </div>
              <div className="teddy-body">
                <span className="teddy-bow" />
              </div>
            </div>

            <div className="archive-stack archive-stack-left">
              <span>Distributed Systems</span>
              <span>Clean Architecture</span>
            </div>

            <div className="tiny-globe">
              <div className="globe-orbit orbit-a" />
              <div className="globe-orbit orbit-b" />
            </div>
          </aside>

          <main className="archive-book-zone">
            <motion.div
              className="flipbook-wrap archive-flipbook-wrap"
              initial={{ rotateX: 0, rotateY: 0, opacity: 0, scale: 0.8 }}
              animate={
                bookOpen
                  ? {
                      rotateX: [0, -1.5, 0.8, 0],
                      rotateY: [0, 0.8, -0.5, 0],
                      rotateZ: [0, 0.4, -0.3, 0],
                      opacity: 1,
                      scale: 1,
                    }
                  : { rotateX: -25, rotateY: 8, opacity: 1, scale: 0.95 }
              }
              transition={
                bookOpen
                  ? {
                      opacity:   { duration: 0.5 },
                      scale:     { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
                      rotateX:   { duration: 6, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" },
                      rotateY:   { duration: 8, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" },
                      rotateZ:   { duration: 7, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" },
                    }
                  : { duration: 0.35, ease: [0.34, 1.56, 0.64, 1], type: "spring", stiffness: 200, damping: 18 }
              }
              style={{ perspective: "1400px", transformStyle: "preserve-3d" }}
            >
              <div className="archive-book-shadow" />

              {bookOpen && (
                <>
                  <div
                    onClick={flipPrev}
                    className="page-hotspot page-hotspot-left"
                    title="Previous Page"
                  />
                  <div
                    onClick={flipNext}
                    className="page-hotspot page-hotspot-right"
                    title="Next Page"
                  />
                </>
              )}

              <motion.div
                className="cover-flip-overlay archive-cover-flip"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: bookOpen ? -100 : 0 }}
                transition={{ duration: 0.75, ease: [0.4, 0, 0.15, 1] }}
                style={{
                  transformOrigin: "1.5% 50%",
                  pointerEvents: bookOpen ? "none" : "auto",
                  background: `linear-gradient(150deg, ${coverHex(project)} 0%, ${coverDarkHex(project)} 100%)`,
                }}
              >
                <p className="cover-flip-kicker">Portfolio Archive</p>
                <h2 className="cover-flip-title">{project.spineTitle}</h2>
                <p className="cover-flip-sub">
                  {project.category || project.language || "Engineering"}
                </p>
                <p className="cover-flip-year">
                  {project.publishedYear || new Date().getFullYear()}
                </p>
              </motion.div>

              <HTMLFlipBook
                ref={flipRef}
                width={500}
                height={640}
                size="stretch"
                showCover={false}
                maxShadowOpacity={0.55}
                drawShadow
                flippingTime={1100}
                usePortrait={false}
                startPage={0}
                useMouseEvents
                swipeDistance={30}
                mobileScrollSupport
                className="flipbook archive-flipbook"
                style={{ perspective: "2000px" }}
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

            <div className="archive-brass-label">
              ARC · {project.category || "Engineering"}
            </div>
          </main>

          <aside className="archive-prop archive-prop-right">
            <div className="desk-lamp">
              <div className="lamp-shade" />
              <div className="lamp-neck" />
              <div className="lamp-base" />
            </div>

            <div className="mini-teddy teddy-right">
              <div className="teddy-ear teddy-ear-left" />
              <div className="teddy-ear teddy-ear-right" />
              <div className="teddy-head">
                <span className="teddy-eye eye-left" />
                <span className="teddy-eye eye-right" />
                <span className="teddy-nose" />
                <span className="teddy-glasses" />
              </div>
              <div className="teddy-body">
                <span className="teddy-bow" />
              </div>
            </div>

            <div className="archive-note-card">
              <span>Scale with intent.</span>
              <span>Design for change.</span>
              <span>Ship with clarity.</span>
            </div>

            <div className="archive-stack archive-stack-right">
              <span>Code is poetry</span>
              <span>Executed.</span>
            </div>
          </aside>
        </div>

        <footer className="viewer-controls archive-viewer-controls">
          <button onClick={flipPrev} disabled={page === 0}>
            ← Prev
          </button>

          <span>
            {Math.min(page + 1, pages.length)} / {pages.length}
          </span>

          <button onClick={flipNext} disabled={page >= pages.length - 1}>
            Next →
          </button>
        </footer>

        <div className="archive-filed-under">
          Filed under&nbsp;
          <span>{project.category || "Code"}</span>
          <span>•</span>
          <span>{project.language || "Systems"}</span>
          <span>•</span>
          <span>{project.archiveCode || "Portfolio"}</span>
        </div>
      </motion.section>
    </motion.div>
  );
}
