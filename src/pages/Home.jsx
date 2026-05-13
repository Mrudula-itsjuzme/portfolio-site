import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import ArchiveEntrance from "../components/ArchiveEntrance";
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

export default function Home() {
  const [openProject, setOpenProject] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem("library-sound") !== "off");
  const [projects, setProjects] = useState(() => fallbackProjects.map(enrichProject));
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const audioContextRef = useRef(null);
  const musicGainRef = useRef(null);
  const oscillatorsRef = useRef([]);

  const dust = useMemo(() => Array.from({ length: 14 }, (_, index) => ({ id: index, left: (index * 17) % 100 })), []);

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

      <header className="library-topbar">
        <div>
          <p className="kicker">Portfolio Archive</p>
          <h1>Pedamallu Sai Mrudula</h1>
          <p className="subtitle">CSE-AI Student · Researcher · Developer · Creative Technologist</p>
          <p className="subtitle tagline">My work is not a grid of links. It is a shelf of books you can pull and read.</p>
        </div>

        <div className="topbar-actions">
          <a className="resume-btn" href={`${import.meta.env.BASE_URL}resume.pdf`} target="_blank" rel="noreferrer" title="Download Resume">
            Resume
          </a>
          <button className="sound-toggle" onClick={handleToggleSound} title="Toggle ambient music and sound effects">
            {soundEnabled ? "🔊 Ambient: On" : "🔇 Ambient: Off"}
          </button>
        </div>
      </header>

      <ArchiveEntrance />

      <main id="archive" className="archive-main">
        <div className="archive-section-heading">
          <p>Open shelf</p>
          <h2>Pull a volume. Inspect the receipts.</h2>
        </div>

        {isLoading && (
          <div className="library-notice">
            <div className="spinner" />
            <p>Loading projects…</p>
          </div>
        )}

        {!isLoading && (
          <Bookshelf
            projects={projects}
            onOpenProject={(project) => setOpenProject(project)}
            onBookPullSound={() => soundEnabled && playTone("pull", audioContextRef)}
          />
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

      <footer className="library-footer">
        <div className="footer-links">
          <a href="https://github.com/Mrudula-itsjuzme" target="_blank" rel="noreferrer">GitHub</a>
          <span className="footer-dot">·</span>
          <a href="https://www.linkedin.com/in/pedamallusaimrudula/" target="_blank" rel="noreferrer">LinkedIn</a>
          <span className="footer-dot">·</span>
          <a href="mailto:mrudulasankar2007@gmail.com">Email</a>
          <span className="footer-dot">·</span>
          <a href={`${import.meta.env.BASE_URL}resume.pdf`} target="_blank" rel="noreferrer">Resume</a>
        </div>
        <p className="footer-updated">Last Archive Sync: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
      </footer>

      <div className="desk-surface" aria-hidden="true" />
    </div>
  );
}
