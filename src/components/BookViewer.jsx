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
  const seedBase = encodeURIComponent(project?.id || project?.spineTitle || "project");
  const picsumA = `https://picsum.photos/seed/${seedBase}-a/900/540`;
  const picsumB = `https://picsum.photos/seed/${seedBase}-b/900/540`;
  const picsumC = `https://picsum.photos/seed/${seedBase}-c/900/540`;

  const full = String(project?.repoName || "").trim();
  if (!full || !full.includes("/")) {
    return { cover: picsumA, architecture: picsumB, dashboard: picsumC };
  }

  const [owner, repo] = full.split("/");
  const encodedOwner = encodeURIComponent(owner || "owner");
  const encodedRepo = encodeURIComponent(repo || "repo");

  return {
    cover: `https://opengraph.githubassets.com/1/${encodedOwner}/${encodedRepo}`,
    architecture: `https://gh-card.dev/repos/${encodedOwner}/${encodedRepo}.svg`,
    dashboard: `https://gh-card.dev/repos/${encodedOwner}/${encodedRepo}/languages.svg`
  };
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
    paragraphs: [
      `This volume addresses the ${project?.category || "engineering"} domain with a practical build-first lens. The guiding principle is to keep each layer understandable under pressure while preserving room for rapid iteration.`,
      "The project is framed as a living system rather than a static artifact: assumptions are explicit, interfaces are composable, and outcomes are measured against operational expectations.",
      `Primary thematic threads include ${topics.slice(0, 4).join(", ")}. These threads shape trade-offs across reliability, performance, and readability.`
    ],
    image: images.dashboard,
    caption: "Domain and technology texture for this volume."
  });

  pages.push({
    id: "architecture",
    kind: "architecture",
    title: architecture?.title || "Architecture",
    diagram: architecture?.diagram || ["Input", "Process", "Output"],
    text: architecture?.text || "Architecture description unavailable.",
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
    paragraphs: [
      "Implementation is structured as a sequence of auditable steps, each producing verifiable intermediate artifacts. This makes debugging and stakeholder walkthroughs far easier than opaque end-to-end scripts.",
      "Code paths are written for maintainers first: naming is explicit, boundaries are narrow, and observability is built in rather than patched later.",
      "Critical decision points are documented with rationale so the project can evolve without losing historical context."
    ],
    image: images.cover,
    caption: "Representative project visual captured for this manuscript."
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
    paragraphs: [
      `${stack[0] || "Core tooling"} anchors the implementation due to ecosystem maturity and strong package support for this class of problem.`,
      "Supporting technologies are selected to preserve composability, observability, and straightforward deployment paths.",
      "Dependency decisions are reviewed with an emphasis on long-term maintainability instead of short-term novelty."
    ]
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
    images: [
      { src: images.cover, alt: `${project?.spineTitle} project snapshot` },
      { src: images.architecture, alt: `${project?.spineTitle} architecture chart` },
      { src: images.dashboard, alt: `${project?.spineTitle} language or metrics view` }
    ]
  });

  pages.push({
    id: "lessons",
    kind: "essay",
    title: "Lessons Learned",
    paragraphs: [
      "Reliable systems are built through repetition of small quality habits: explicit contracts, measurable outcomes, and incremental hardening.",
      "Most complexity becomes manageable when surfaced early through visual traces and plain-language documentation.",
      "The archive metaphor reflects this process: each iteration is another annotated page rather than a discarded draft."
    ]
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

  useEffect(() => {
    setPage(0);
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
      className="viewer-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.section
        className="viewer-desk"
        initial={{ scale: 0.92, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-viewer" onClick={onClose}>
          Close
        </button>

        <header className="viewer-header">
          <h2>{project.spineTitle}</h2>
          <p>{project.category}</p>
        </header>

        <div className="flipbook-wrap">
          <HTMLFlipBook
            ref={flipRef}
            width={500}
            height={640}
            size="stretch"
            showCover
            maxShadowOpacity={0.4}
            drawShadow
            flippingTime={800}
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
        </div>

        <footer className="viewer-controls">
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
      </motion.section>
    </motion.div>
  );
}
