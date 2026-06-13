import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UnswirlingPages from "../components/UnswirlingPages";
import FeaturedVolume from "../components/FeaturedVolume";

import Bookshelf from "../components/Bookshelf";
import { projects as fallbackProjects } from "../data/projects";

const BookViewer = lazy(() => import("../components/BookViewer"));

const leatherCycle = ["leather-oxblood", "leather-forest", "leather-navy", "leather-charcoal", "leather-brown"];
const accentCycle = ["#c9a96a", "#b89054", "#a88046", "#d3b279", "#b58e5f"];

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
  const base = prettyName(repo?.name);
  const topics = Array.isArray(repo?.topics) ? repo.topics.join(" ").toLowerCase() : "";
  const language = String(repo?.language || "").toLowerCase();

  if (/(aircraft|sensor|signal|iot|embedded|flight)/.test(`${topics} ${base.toLowerCase()}`)) return `Field Manual of ${base}`;
  if (/(model|train|dataset|neural|ai|ml|classification|prediction)/.test(topics)) return `Treatise on ${base}`;
  if (/(data|analytics|etl|pipeline|forecast|analysis)/.test(`${topics} ${base.toLowerCase()}`)) return `Atlas of ${base}`;
  if (/(react|frontend|ui|web|javascript|typescript|next)/.test(`${topics} ${language}`)) return `${base} Codex`;
  if (/(api|server|backend|express|flask|django|fastapi)/.test(`${topics} ${base.toLowerCase()}`)) return `${base} Service Ledger`;
  return base.split(" ").length <= 2 ? `Chronicle of ${base}` : base;
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
    publishedYear: project?.publishedYear || new Date().getFullYear().toString(),
    synopsis: project?.synopsis || project?.description || "A documented engineering artifact with context, implementation notes, and source links.",
    topics: Array.isArray(project?.topics) && project.topics.length ? project.topics : [project?.category || "Engineering"],
    repoName: project?.repoName || extractRepoName(project?.githubUrl)
  };
}

function mapRepoToProject(repo, index) {
  const title = generateBookTitle(repo);
  const topics = Array.isArray(repo?.topics) && repo.topics.length ? repo.topics : ["engineering", "portfolio"];
  const description = repo?.description || "Repository with implementation details and project artifacts.";

  return enrichProject({
    id: String(repo?.id || repo?.name || `project-${index}`),
    spineTitle: title,
    title,
    language: repo?.language || "Code",
    description,
    stars: repo?.stars ?? 0,
    forks: repo?.forks ?? 0,
    category: repo?.language || "Repository",
    leather: leatherCycle[index % leatherCycle.length],
    accent: accentCycle[index % accentCycle.length],
    githubUrl: repo?.url || "https://github.com/Mrudula-itsjuzme",
    demoUrl: repo?.homepage || "https://mrudula-itsjuzme.github.io/portfolio-site/",
    topics,
    repoName: repo?.fullName || null,
    pages: [
      { kind: "cover", title, subtitle: repo?.language || "Engineering", author: "Pedamallu Sai Mrudula", year: new Date().getFullYear().toString() },
      {
        kind: "overview",
        title: "Overview",
        bullets: [
          description,
          "Mapped into this portfolio as a browsable archive entry.",
          "Open the repository for implementation details, commits, and source files."
        ]
      },
      { kind: "architecture", title: "Architecture", diagram: ["Input", "Processing", "Core Logic", "Output"], text: "The project is presented as a modular system so the implementation path is easier to inspect." },
      { kind: "workflow", title: "Working / Implementation", bullets: ["Inspect project goal", "Review files and setup", "Run or read the implementation", "Compare outputs", "Iterate with documented changes"] },
      { kind: "stack", title: "Tech Stack", bullets: [repo?.language || "Mixed", ...topics.slice(0, 4)] },
      { kind: "resources", title: "Resources", bullets: ["Repository documentation", `Stars: ${repo?.stars ?? 0}`, `Forks: ${repo?.forks ?? 0}`] },
      { kind: "github", title: "GitHub", buttonText: "View Repository" }
    ]
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
    try {
      source.stop();
    } catch {}
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

function StatItem({ icon, count, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <span style={{ fontSize: "1.8rem", opacity: 0.85, filter: "sepia(0.4) saturate(0.8)" }}>{icon}</span>
      <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
        <span style={{ color: "#e2c899", fontSize: "1.4rem", fontFamily: "'Cinzel', serif", lineHeight: 1 }}>{count}</span>
        <span style={{ color: "#a88e5a", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "4px", fontFamily: "'Cinzel', serif" }}>{label}</span>
      </div>
    </div>
  );
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

  const stats = useMemo(() => {
    let research = 0;
    let experiments = 0;
    let mainProjects = 0;

    projects.forEach(p => {
      const topicStr = (p.topics || []).join(" ").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      const name = (p.name || "").toLowerCase();

      if (topicStr.includes("research") || topicStr.includes("paper") || topicStr.includes("data") || topicStr.includes("analysis") || desc.includes("research")) {
        research++;
      } else if (topicStr.includes("experiment") || topicStr.includes("test") || topicStr.includes("demo") || name.includes("demo") || name.includes("test")) {
        experiments++;
      } else {
        mainProjects++;
      }
    });

    return {
      volumes: projects.length,
      projects: mainProjects || 12,
      researchNotes: research || 4,
      experiments: experiments || 8
    };
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
        const res = await fetch(`${import.meta.env.BASE_URL}repos.json`, { signal: controller.signal });
        if (!res.ok) throw new Error(`repos.json ${res.status}`);
        const raw = await res.json();
        const repos = Array.isArray(raw) ? raw : [];
        if (repos.length) setProjects(repos.map(mapRepoToProject));
        setLoadError(null);
      } catch (err) {
        if (err.name !== "AbortError") {
          try {
            const apiRes = await fetch("https://api.github.com/users/Mrudula-itsjuzme/repos?per_page=100&sort=updated", {
              headers: { Accept: "application/vnd.github+json" }
            });
            if (!apiRes.ok) throw new Error(`GitHub API ${apiRes.status}`);
            const raw = await apiRes.json();
            const repos = Array.isArray(raw)
              ? raw
                  .filter((repo) => !repo.fork && repo.name !== "portfolio-site")
                  .map((repo) => ({
                    id: repo.id,
                    name: repo.name,
                    fullName: repo.full_name,
                    description: repo.description || "",
                    language: repo.language || "Code",
                    url: repo.html_url,
                    homepage: repo.homepage || "",
                    topics: repo.topics || [],
                    stars: repo.stargazers_count,
                    forks: repo.forks_count
                  }))
              : [];
            if (repos.length) setProjects(repos.map(mapRepoToProject));
            setLoadError(null);
          } catch {
            setLoadError("Using fallback archive entries.");
          }
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    function handleKey(event) {
      if (event.key === "Escape") setOpenProject(null);
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
      <div className="dust-field" aria-hidden="true">
        {dust.map((particle) => (
          <span key={particle.id} style={{ left: `${particle.left}%`, animationDelay: `${(particle.id % 8) * 0.7}s` }} />
        ))}
      </div>

      {!introFinished && <UnswirlingPages onComplete={() => setIntroFinished(true)} />}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: introFinished ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <header className="library-topbar">
          <div className="topbar-left">
            <div className="topbar-logo">M</div>
            <div className="topbar-title-group">
              <h1>PEDAMALLU SAI MRUDULA</h1>
              <p>CSE-AI Student · Researcher · Developer · Creative Technologist</p>
            </div>
          </div>

          <nav className="topbar-nav">
            <a href="#archive" className={!activeModal ? "active" : ""} onClick={(e) => { e.preventDefault(); setActiveModal(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Archive</a>
            <a href="#about" className={activeModal === "about" ? "active" : ""} onClick={(e) => { e.preventDefault(); setActiveModal("about"); }}>About</a>
            <a href="#projects" onClick={(e) => { e.preventDefault(); setActiveModal(null); document.getElementById("archive")?.scrollIntoView({ behavior: "smooth" }); }}>Projects</a>
            <a href="#writings" className={activeModal === "writings" ? "active" : ""} onClick={(e) => { e.preventDefault(); setActiveModal("writings"); }}>Writings</a>
            <a href="#experiments" className={activeModal === "experiments" ? "active" : ""} onClick={(e) => { e.preventDefault(); setActiveModal("experiments"); }}>Experiments</a>
            <a href="#contact" className={activeModal === "contact" ? "active" : ""} onClick={(e) => { e.preventDefault(); setActiveModal("contact"); }}>Contact</a>
          </nav>

          <div className="topbar-actions">
            <a className="resume-btn" href={`${import.meta.env.BASE_URL}resume.pdf`} target="_blank" rel="noreferrer" title="Download Resume">
              📄 Resume
            </a>
            <button className="sound-toggle" onClick={handleToggleSound} title="Toggle ambient music and sound effects">
              {soundEnabled ? "💡 Ambient: On" : "💡 Ambient: Off"}
            </button>
          </div>
        </header>

        {/* Info Modal Overlay */}
        <AnimatePresence>
          {activeModal && (
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
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "linear-gradient(180deg, #1e1610 0%, #120d09 100%)", border: "1px solid #4a3822", borderRadius: "8px",
                  padding: "40px", maxWidth: "500px", width: "90%", boxShadow: "0 20px 40px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.03)",
                  position: "relative", textAlign: "center"
                }}
              >
                <button onClick={() => setActiveModal(null)} style={{ position: "absolute", top: 16, right: 20, background: "none", border: "none", color: "#a88e5a", fontSize: "1.5rem", cursor: "pointer" }}>×</button>
                <h2 style={{ color: "#d2b478", fontFamily: "'Cinzel', serif", marginTop: 0, letterSpacing: "0.1em" }}>
                  {activeModal.toUpperCase()}
                </h2>
                <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #4a3822, transparent)", margin: "20px 0" }} />
                
                {activeModal === 'about' && (
                  <p style={{ color: "#a88e5a", fontFamily: "'Playfair Display', serif", lineHeight: 1.6 }}>
                    I am a CSE-AI student and creative technologist deeply interested in building premium, thoughtful digital experiences.<br/><br/>
                    This archive is a living collection of my engineering notes, software experiments, and aesthetic explorations.
                  </p>
                )}
                
                {activeModal === 'contact' && (
                  <p style={{ color: "#a88e5a", fontFamily: "'Playfair Display', serif", lineHeight: 1.6 }}>
                    I am currently open for opportunities, collaborations, and discussions about technology and design.<br/><br/>
                    You can reach me via <a href="mailto:psm@example.com" style={{ color: "#d2b478", textDecoration: "underline" }}>Email</a> or connect on <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: "#d2b478", textDecoration: "underline" }}>LinkedIn</a>.
                  </p>
                )}

                {(activeModal === 'writings' || activeModal === 'experiments') && (
                  <p style={{ color: "#a88e5a", fontFamily: "'Playfair Display', serif", lineHeight: 1.6 }}>
                    These records are currently being compiled into the archive.<br/>
                    Check back soon as I bind new volumes and organize my scattered notes.
                  </p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main id="archive" className="archive-main">
          {!isLoading && projects.length > 0 && (
            <>
              <div className="bookshelf-section-wrapper">
                <Bookshelf
                  projects={projects}
                  onOpenProject={(project) => setOpenProject(project)}
                  onHoverProject={(project) => setHoveredProject(project)}
                  onBookPullSound={() => soundEnabled && playTone("pull", audioContextRef)}
                />
              </div>


            </>
          )}

          {isLoading && (
            <div className="library-notice">
              <div className="spinner" />
              <p>Loading projects…</p>
            </div>
          )}

          {loadError && !isLoading && <div className="library-notice library-error">{loadError}</div>}
        </main>

        <AnimatePresence>
          {openProject && (
            <Suspense fallback={<div className="viewer-loading">Opening book…</div>}>
              <BookViewer
                project={openProject}
                onClose={() => setOpenProject(null)}
                onPageFlipSound={() => soundEnabled && playTone("flip", audioContextRef)}
              />
            </Suspense>
          )}
        </AnimatePresence>

        <footer style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 0 60px",
          position: "relative",
          zIndex: 10,
          background: "linear-gradient(180deg, transparent 0%, #0d0a08 100%)"
        }}>
          {/* Floating Stats Bar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "48px",
            background: "rgba(20, 15, 10, 0.7)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(200, 175, 120, 0.15)",
            borderBottom: "1px solid rgba(200, 175, 120, 0.05)",
            borderRadius: "4px",
            padding: "24px 48px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6), inset 0 2px 10px rgba(255,255,255,0.02)",
            marginBottom: "30px",
            flexWrap: "wrap"
          }}>
            <StatItem icon="📖" count={stats.volumes} label="VOLUMES" />
            <div style={{ width: "1px", height: "40px", background: "rgba(200, 175, 120, 0.15)" }} />
            <StatItem icon="💼" count={`${stats.projects}+`} label="PROJECTS" />
            <div style={{ width: "1px", height: "40px", background: "rgba(200, 175, 120, 0.15)" }} />
            <StatItem icon="📄" count={`${stats.researchNotes}+`} label="RESEARCH NOTES" />
            <div style={{ width: "1px", height: "40px", background: "rgba(200, 175, 120, 0.15)" }} />
            <StatItem icon="🧪" count={`${stats.experiments}+`} label="EXPERIMENTS" />
          </div>

          <p style={{ 
            margin: 0, color: "#c8a562", fontSize: "1.1rem", fontStyle: "italic", fontFamily: "'Playfair Display', serif", letterSpacing: "0.05em",
            display: "flex", alignItems: "center", gap: "16px", textShadow: "0 2px 4px rgba(0,0,0,0.8)"
          }}>
            <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>↠</span> Explore deeply. Build meaningfully. <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>↞</span>
          </p>
        </footer>

        <div className="desk-surface" aria-hidden="true" />
      </motion.div>
    </div>
  );
}
