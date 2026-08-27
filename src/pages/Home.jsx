import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UnswirlingPages from "../components/UnswirlingPages";
import WritingsScroll from "../components/WritingsScroll";
import FeaturedVolume from "../components/FeaturedVolume";
import Bookshelf from "../components/Bookshelf";
import { projects as fallbackProjects } from "../data/projects";

const BookViewer = lazy(() => import("../components/BookViewer"));

const leatherCycle = ["leather-oxblood", "leather-forest", "leather-navy", "leather-charcoal", "leather-brown"];
const accentCycle = ["#c9a96a", "#b89054", "#a88046", "#d3b279", "#b58e5f"];
const CATEGORY_ORDER = ["Research & Publications", "AI Systems", "Product Experiments", "Interface Studies"];

function prettyName(raw) {
  return String(raw || "Project")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildArchiveCode(title, index) {
  const compact = String(title || "project")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 4)
    .padEnd(4, "X");
  return `ARC-${String(index + 1).padStart(2, "0")}-${compact}`;
}

function initialsFromTitle(title) {
  return String(title || "PX")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "PX";
}

function generateBookTitle(repo) {
  if (repo?.spineTitle) return repo.spineTitle;
  const base = prettyName(repo?.name);
  const topics = Array.isArray(repo?.topics) ? repo.topics.join(" ").toLowerCase() : "";
  const language = String(repo?.language || "").toLowerCase();

  if (/(aircraft|sensor|signal|iot|embedded|flight)/.test(`${topics} ${base.toLowerCase()}`)) return `Field Manual of ${base}`;
  if (/(model|train|dataset|neural|ai|ml|classification|prediction)/.test(topics)) return `Treatise on ${base}`;
  if (/(data|analytics|etl|pipeline|forecast|analysis)/.test(`${topics} ${base.toLowerCase()}`)) return `Atlas of ${base}`;
  if (/(react|frontend|ui|web|javascript|typescript|next)/.test(`${topics} ${language}`)) return `${base} Codex`;
  return base;
}

function extractRepoName(url) {
  const match = String(url || "").match(/github\.com\/([^/]+)\/([^/?#]+)/i);
  return match ? `${match[1]}/${match[2]}` : null;
}

function enrichProject(project, index) {
  const title = project?.spineTitle || project?.title || `Project ${index + 1}`;
  return {
    ...project,
    id: String(project?.id || `project-${index}`),
    title,
    spineTitle: project?.spineTitle || title,
    monogram: project?.monogram || initialsFromTitle(title),
    volume: project?.volume || `Vol. ${String(index + 1).padStart(2, "0")}`,
    archiveCode: project?.archiveCode || buildArchiveCode(title, index),
    shelfMark: project?.shelfMark || `Bay ${Math.floor(index / 6) + 1} / ${String((index % 6) + 1).padStart(2, "0")}`,
    sigil: project?.sigil || ["✶", "✦", "❖", "✷", "✹"][index % 5],
    publishedYear: project?.publishedYear || "2026",
    synopsis: project?.synopsis || project?.description || "A documented engineering artifact with context, implementation notes, and source links.",
    topics: Array.isArray(project?.topics) && project.topics.length ? project.topics : [project?.category || "Engineering"],
    repoName: project?.repoName || extractRepoName(project?.githubUrl)
  };
}

function mapRepoToProject(repo, index) {
  const title = generateBookTitle(repo);
  const topics = Array.isArray(repo?.topics) && repo.topics.length ? repo.topics : ["engineering"];
  const description = repo?.description || "Documented project repository.";
  const category = repo?.category || "AI Systems";

  const pages = Array.isArray(repo?.pages) && repo.pages.length
    ? repo.pages
    : [
        { kind: "cover", title: repo?.displayTitle || title, subtitle: repo?.subtitle || category, author: "Pedamallu Sai Mrudula", year: repo?.publishedYear || "2026" },
        { kind: "overview", title: "Problem & Contribution", bullets: repo?.overview?.length ? repo.overview : [description] },
        { kind: "architecture", title: "Architecture", diagram: repo?.architecture?.diagram || ["Input", "Processing", "Core Logic", "Output"], text: repo?.architecture?.text || "See the repository documentation for the implemented system structure." },
        { kind: "workflow", title: "Implementation", bullets: repo?.workflow?.length ? repo.workflow : ["Review the repository README", "Inspect the implementation", "Run the documented workflow"] },
        { kind: "stack", title: "Tech Stack", bullets: repo?.stack?.length ? repo.stack : [repo?.language || "Mixed", ...topics.slice(0, 4)] },
        { kind: "resources", title: repo?.resultsTitle || "Evidence & Status", bullets: repo?.results?.length ? repo.results : ["Implementation and documentation available in the repository", repo?.status || "Active project"] },
        { kind: "github", title: "Source & Documentation", buttonText: "View Repository" }
      ];

  return enrichProject({
    id: String(repo?.id || repo?.name || `project-${index}`),
    name: repo?.name,
    spineTitle: title,
    title,
    language: repo?.language || "Code",
    description,
    synopsis: repo?.synopsis || description,
    stars: repo?.stars ?? 0,
    forks: repo?.forks ?? 0,
    category,
    priority: repo?.priority ?? index,
    leather: repo?.leather || leatherCycle[index % leatherCycle.length],
    accent: repo?.accent || accentCycle[index % accentCycle.length],
    githubUrl: repo?.url || "https://github.com/Mrudula-itsjuzme",
    demoUrl: repo?.homepage || repo?.url || "https://github.com/Mrudula-itsjuzme",
    topics,
    repoName: repo?.fullName || null,
    pages
  }, index);
}

function playTone(type, contextRef) {
  const Context = window.AudioContext || window.webkitAudioContext;
  if (!Context) return;
  if (!contextRef.current) contextRef.current = new Context();
  const ctx = contextRef.current;
  if (ctx.state === "suspended") ctx.resume();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.frequency.value = type === "pull" ? 280 : 520;
  gain.gain.setValueAtTime(type === "pull" ? 0.07 : 0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (type === "pull" ? 0.14 : 0.09));
  oscillator.start();
  oscillator.stop(ctx.currentTime + (type === "pull" ? 0.14 : 0.09));
}

function stopAmbient(oscillatorsRef) {
  oscillatorsRef.current.forEach((source) => {
    try { source.stop(); } catch {}
  });
  oscillatorsRef.current = [];
}

function startAmbient(contextRef, gainRef, oscillatorsRef) {
  const Context = window.AudioContext || window.webkitAudioContext;
  if (!Context) return;
  if (!contextRef.current) contextRef.current = new Context();
  const ctx = contextRef.current;
  if (ctx.state === "suspended") ctx.resume();
  stopAmbient(oscillatorsRef);
  gainRef.current = ctx.createGain();
  gainRef.current.connect(ctx.destination);
  gainRef.current.gain.setValueAtTime(0.001, ctx.currentTime);
  gainRef.current.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.4);
  [130.81, 195.99, 246.94, 164.81].forEach((frequency, index) => {
    const oscillator = ctx.createOscillator();
    const noteGain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    noteGain.gain.value = 0.045 - index * 0.005;
    oscillator.connect(noteGain);
    noteGain.connect(gainRef.current);
    oscillator.start();
    oscillatorsRef.current.push(oscillator);
  });
}

export default function Home() {
  const [openProject, setOpenProject] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem("library-sound") !== "off");
  const [projects, setProjects] = useState(() => fallbackProjects.map(enrichProject));
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [introFinished, setIntroFinished] = useState(false);
  const audioContextRef = useRef(null);
  const musicGainRef = useRef(null);
  const oscillatorsRef = useRef([]);

  const dust = useMemo(() => Array.from({ length: 14 }, (_, index) => ({ id: index, left: (index * 17) % 100 })), []);

  const groupedProjects = useMemo(() => {
    const groups = new Map(CATEGORY_ORDER.map((category) => [category, []]));
    projects
      .slice()
      .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
      .forEach((project) => {
        const category = groups.has(project.category) ? project.category : "AI Systems";
        groups.get(category).push(project);
      });
    return CATEGORY_ORDER.map((category) => ({ category, projects: groups.get(category) })).filter((group) => group.projects.length);
  }, [projects]);

  function handleToggleSound() {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem("library-sound", next ? "on" : "off");
    if (next) startAmbient(audioContextRef, musicGainRef, oscillatorsRef);
    else stopAmbient(oscillatorsRef);
  }

  useEffect(() => {
    const controller = new AbortController();
    async function loadProjects() {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.BASE_URL}repos.json`, { signal: controller.signal });
        if (!response.ok) throw new Error(`repos.json ${response.status}`);
        const raw = await response.json();
        if (Array.isArray(raw) && raw.length) setProjects(raw.map(mapRepoToProject));
        setLoadError(null);
      } catch (error) {
        if (error.name !== "AbortError") setLoadError("Using the built-in curated archive because the project catalogue could not be loaded.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    function handleKey(event) {
      if (event.key === "Escape") {
        setOpenProject(null);
        setActiveModal(null);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (soundEnabled) startAmbient(audioContextRef, musicGainRef, oscillatorsRef);
    return () => stopAmbient(oscillatorsRef);
  }, []);

  return (
    <div className="library-shell">
      <style>{`
        html, body, #root, .library-shell {
          max-width: 100%;
          overflow-x: hidden;
        }

        .bookshelf-section-wrapper,
        .shelf-books {
          max-width: 100%;
        }

        .shelf-books {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .shelf-books::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .archive-main > section:last-of-type {
          margin-bottom: 0 !important;
        }
      `}</style>

      <div className="dust-field" aria-hidden="true">
        {dust.map((particle) => <span key={particle.id} style={{ left: `${particle.left}%`, animationDelay: `${(particle.id % 8) * 0.7}s` }} />)}
      </div>

      {!introFinished && <UnswirlingPages onComplete={() => setIntroFinished(true)} />}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: introFinished ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <motion.div style={{ filter: (openProject || activeModal === 'writings') ? "blur(12px) brightness(0.6)" : "none", transition: "filter 0.8s ease", minHeight: "100vh" }}>
          <header className="library-topbar">
          <div className="topbar-left">
            <div className="topbar-logo">M</div>
            <div className="topbar-title-group">
              <h1>PEDAMALLU SAI MRUDULA</h1>
              <p>AI Engineering Student · Researcher · Builder · Creative Technologist</p>
            </div>
          </div>

          <nav className="topbar-nav">
            <a href="#archive" className={!activeModal ? "active" : ""} onClick={(event) => { event.preventDefault(); setActiveModal(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Archive</a>
            <a href="#about" className={activeModal === "about" ? "active" : ""} onClick={(event) => { event.preventDefault(); setActiveModal("about"); }}>About</a>
            <a href="#projects" onClick={(event) => { event.preventDefault(); setActiveModal(null); document.getElementById("archive")?.scrollIntoView({ behavior: "smooth" }); }}>Projects</a>
            <a href="#writings" className={activeModal === "writings" ? "active" : ""} onClick={(event) => { event.preventDefault(); setActiveModal("writings"); }}>Writings</a>
            <a href="#experiments" className={activeModal === "experiments" ? "active" : ""} onClick={(event) => { event.preventDefault(); setActiveModal("experiments"); }}>Experiments</a>
            <a href="#contact" className={activeModal === "contact" ? "active" : ""} onClick={(event) => { event.preventDefault(); setActiveModal("contact"); }}>Contact</a>
          </nav>

          <div className="topbar-actions">
            <a className="resume-btn" href={`${import.meta.env.BASE_URL}resume.pdf`} target="_blank" rel="noreferrer" title="Open resume">📄 Resume</a>
            <button className="sound-toggle" onClick={handleToggleSound} title="Toggle ambient sound">{soundEnabled ? "💡 Ambient: On" : "💡 Ambient: Off"}</button>
          </div>
        </header>

        <main id="archive" className="archive-main">
          {!isLoading && groupedProjects.map(({ category, projects: categoryProjects }) => (
            <section key={category} style={{ marginBottom: "42px" }}>
              <div style={{ maxWidth: "1180px", margin: "0 auto 12px", padding: "0 24px", display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ color: "#d2b478", fontFamily: "'Cinzel', serif", fontSize: "0.82rem", letterSpacing: "0.18em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{category}</span>
                <span style={{ height: 1, flex: 1, background: "linear-gradient(90deg, rgba(210,180,120,0.45), transparent)" }} />
                <span style={{ color: "#806b47", fontFamily: "'Cinzel', serif", fontSize: "0.68rem" }}>{categoryProjects.length} {categoryProjects.length === 1 ? "volume" : "volumes"}</span>
              </div>
              <div className="bookshelf-section-wrapper">
                <Bookshelf projects={categoryProjects} onOpenProject={setOpenProject} onHoverProject={setHoveredProject} onBookPullSound={() => soundEnabled && playTone("pull", audioContextRef)} />
              </div>
            </section>
          ))}

          {isLoading && <div className="library-notice"><div className="spinner" /><p>Loading curated archive…</p></div>}
          {loadError && !isLoading && <div className="library-notice library-error">{loadError}</div>}
        </main>

        <div className="desk-surface" aria-hidden="true" />
        </motion.div>

        <AnimatePresence>
          {activeModal === 'writings' && (
            <WritingsScroll onClose={() => setActiveModal(null)} />
          )}
          {activeModal && activeModal !== 'writings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              style={{
                position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 100,
                background: "rgba(10, 5, 2, 0.8)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center"
              }}
            >
              <motion.div
                initial={{ scale: 0.95, y: 10, rotateX: 10 }}
                animate={{ scale: 1, y: 0, rotateX: 0 }}
                exit={{ scale: 0.95, y: 10, rotateX: 10, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: activeModal === 'about' ? "linear-gradient(180deg, #e6d7bd, #cbb798)" : "linear-gradient(180deg, #1e1610 0%, #120d09 100%)",
                  border: activeModal === 'about' ? "1px solid #a88e5a" : "1px solid #4a3822",
                  borderRadius: "2px",
                  padding: "40px", maxWidth: "500px", width: "90%",
                  boxShadow: "0 30px 60px rgba(0,0,0,0.8)",
                  position: "relative", textAlign: "center",
                  color: activeModal === 'about' ? "#2e2318" : "#a88e5a"
                }}
              >
                <button onClick={() => setActiveModal(null)} style={{ position: "absolute", top: 16, right: 20, background: "none", border: "none", color: activeModal === 'about' ? "#4c2f20" : "#a88e5a", fontSize: "1.5rem", cursor: "pointer" }}>×</button>
                <h2 style={{ color: activeModal === 'about' ? "#2e2318" : "#d2b478", fontFamily: "'Cinzel', serif", marginTop: 0, letterSpacing: "0.1em" }}>
                  {activeModal.toUpperCase()}
                </h2>
                <div style={{ height: 1, background: activeModal === 'about' ? "rgba(46, 35, 24, 0.2)" : "linear-gradient(90deg, transparent, #4a3822, transparent)", margin: "20px 0" }} />
                
                {activeModal === 'about' && (
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", lineHeight: 1.6 }}>
                    Third-year AI Engineering student at Amrita Vishwa Vidyapeetham, working across applied machine learning, computer vision, biomedical signal processing, cybersecurity analytics, and AI product development.<br/><br/>
                    I am a first-author IEEE Access researcher and build systems that try to balance technical depth with real-world usability.
                  </p>
                )}
                
                {activeModal === 'contact' && (
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", lineHeight: 1.6 }}>
                    Open to AI/ML internships, research collaborations, and ambitious engineering projects.<br/><br/>
                    Reach me via <a href="mailto:mrudulasankar2007@gmail.com" style={{ color: "#d2b478", textDecoration: "underline" }}>email</a>, connect on <a href="https://www.linkedin.com/in/pedamallusaimrudula" target="_blank" rel="noreferrer" style={{ color: "#d2b478", textDecoration: "underline" }}>LinkedIn</a>, or inspect the work on <a href="https://github.com/Mrudula-itsjuzme" target="_blank" rel="noreferrer" style={{ color: "#d2b478", textDecoration: "underline" }}>GitHub</a>.
                  </p>
                )}

                {(activeModal === 'experiments') && (
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", lineHeight: 1.6 }}>
                    These records are currently being compiled into the archive.<br/>
                    Check back soon as I bind new volumes and organize my scattered notes.
                  </p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {openProject && <Suspense fallback={<div className="viewer-loading">Opening book…</div>}><BookViewer project={openProject} onClose={() => setOpenProject(null)} onPageFlipSound={() => soundEnabled && playTone("flip", audioContextRef)} /></Suspense>}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
