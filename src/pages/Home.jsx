import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Bookshelf from "../components/Bookshelf";
import { projects as fallbackProjects } from "../data/projects";

const BookViewer = lazy(() => import("../components/BookViewer"));

const leatherCycle = [
  "leather-oxblood",
  "leather-forest",
  "leather-navy",
  "leather-charcoal",
  "leather-brown"
];

const accentCycle = [
  "#c9a96a",
  "#b89054",
  "#a88046",
  "#d3b279",
  "#b58e5f"
];

function prettyName(raw) {
  return String(raw || "Project")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function initialsFromTitle(title) {
  return String(title || "PX")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "PX";
}

function buildArchiveCode(title, index) {
  const compact = String(title || "project")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 4)
    .padEnd(4, "X");

  return `ARC-${String(index + 1).padStart(2, "0")}-${compact}`;
}

function extractRepoName(url) {
  const match = String(url || "").match(/github\.com\/([^/]+)\/([^/?#]+)/i);
  if (!match) return null;
  return `${match[1]}/${match[2]}`;
}

function enrichProject(project, index) {
  const title = project?.spineTitle || project?.title || `Project ${index + 1}`;
  const archiveCode = project?.archiveCode || buildArchiveCode(title, index);

  return {
    ...project,
    id: String(project?.id || `project-${index}`),
    spineTitle: project?.spineTitle || title,
    title,
    monogram: project?.monogram || initialsFromTitle(title),
    volume: project?.volume || `Vol. ${String(index + 1).padStart(2, "0")}`,
    archiveCode,
    shelfMark: project?.shelfMark || `Bay ${Math.floor(index / 6) + 1} / ${String(index % 6 + 1).padStart(2, "0")}`,
    sigil: project?.sigil || ["✶", "✦", "❖", "✷", "✹"][index % 5],
    publishedYear: project?.publishedYear || String(2021 + (index % 5)),
    synopsis:
      project?.synopsis ||
      "A detailed engineering volume documenting design decisions, implementation trade-offs, and production learnings.",
    topics: Array.isArray(project?.topics) && project.topics.length ? project.topics : [project?.category || "Engineering"],
    repoName: project?.repoName || extractRepoName(project?.githubUrl)
  };
}

function mapRepoToProject(repo, index) {
  const title = prettyName(repo?.name);

  const category = repo?.language || "Repository";

  const description =
    repo?.description ||
    "Repository with implementation details and project artifacts.";

  const topics =
    Array.isArray(repo?.topics) && repo.topics.length
      ? repo.topics
      : ["engineering", "portfolio"];

  const topTopics = topics.slice(0, 4);

  const leather = leatherCycle[index % leatherCycle.length];
  const accent = accentCycle[index % accentCycle.length];

  return enrichProject({
    id: String(repo?.id || repo?.name || `project-${index}`),
    spineTitle: title,
    category,
    leather,
    accent,

    githubUrl:
      repo?.url ||
      "https://github.com/Mrudula-itsjuzme",

    demoUrl:
      repo?.homepage ||
      "https://mrudula-itsjuzme.vercel.app",

    pages: [
      {
        kind: "cover",
        title,
        subtitle: category,
        author: "Mrudula",
        year: new Date().getFullYear().toString()
      },

      {
        kind: "overview",
        title: "Overview",
        problem: description,
        idea: `Build a calm, readable system around ${category.toLowerCase()} using modular components and strong feedback loops.`,
        goal: `Deliver reliable outcomes while keeping behavior observable and easy to iterate.`
      },

      {
        kind: "architecture",
        title: "Architecture",
        diagram: [
          "Input",
          "Processing",
          "Core Logic",
          "Output"
        ],
        text:
          "The system is structured as a modular processing pipeline enabling scalable and testable components."
      },

      {
        kind: "workflow",
        title: "Working / Implementation",
        steps: [
          "Collect and validate inputs",
          "Execute the implementation pipeline",
          "Capture outputs and behavior",
          "Iterate with testing feedback"
        ]
      },

      {
        kind: "stack",
        title: "Tech Stack",
        technologies: [repo?.language || "Mixed", ...topTopics]
      },

      {
        kind: "resources",
        title: "Resources",
        links: [
          "Repository documentation",
          repo?.url ? "Source repository" : "Source overview",
          `Stars: ${repo?.stars ?? 0}`,
          `Forks: ${repo?.forks ?? 0}`
        ]
      },

      {
        kind: "github",
        title: "GitHub",
        buttonText: "View Repository"
      }
    ],
    topics,
    synopsis: description,
    repoName: repo?.fullName || null
  }, index);
}

/* ---------------------------------- */
/* Audio */
/* ---------------------------------- */

function playTone(type, contextRef) {
  const Context =
    window.AudioContext ||
    window.webkitAudioContext;

  if (!Context) return;

  if (!contextRef.current) {
    contextRef.current = new Context();
  }

  const ctx = contextRef.current;

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  if (type === "pull") {
    oscillator.frequency.value = 280;

    gain.gain.setValueAtTime(0.07, ctx.currentTime);

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + 0.14
    );

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.14);

    return;
  }

  oscillator.frequency.value = 520;

  gain.gain.setValueAtTime(0.05, ctx.currentTime);

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    ctx.currentTime + 0.09
  );

  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.09);
}

export default function Home() {
  const [openProject, setOpenProject] = useState(null);

  const [soundEnabled, setSoundEnabled] =
    useState(
      () =>
        localStorage.getItem("library-sound") !==
        "off"
    );

  const [projects, setProjects] =
    useState(() => fallbackProjects.map((project, index) => enrichProject(project, index)));

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] =
    useState(null);

  const audioContextRef = useRef(null);

  const dust = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
        id: index,
        left: (index * 17) % 100
      })),
    []
  );

  function handleToggleSound() {
    const next = !soundEnabled;

    setSoundEnabled(next);

    localStorage.setItem(
      "library-sound",
      next ? "on" : "off"
    );
  }

  /* ----------------------- */
  /* Load GitHub projects   */
  /* ----------------------- */

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      try {
        setIsLoading(true);

        // Fetch directly from GitHub API — works on static hosting (GitHub Pages)
        const res = await fetch(
          "https://api.github.com/users/Mrudula-itsjuzme/repos?per_page=100&sort=updated&direction=desc",
          {
            signal: controller.signal,
            headers: { Accept: "application/vnd.github+json" }
          }
        );

        if (!res.ok) {
          throw new Error(`GitHub API ${res.status}`);
        }

        const raw = await res.json();

        // Filter out forks and the portfolio-site repo itself
        const repos = Array.isArray(raw)
          ? raw.filter(r => !r.fork && r.name !== "portfolio-site")
          : [];

        if (repos.length) {
          // Map GitHub API shape to the internal repo shape mapRepoToProject expects
          const normalized = repos.map(r => ({
            id: r.id,
            name: r.name,
            fullName: r.full_name,
            description: r.description,
            language: r.language,
            url: r.html_url,
            homepage: r.homepage,
            topics: Array.isArray(r.topics) ? r.topics : [],
            stars: r.stargazers_count,
            forks: r.forks_count,
          }));

          const mapped = normalized.map((repo, i) => mapRepoToProject(repo, i));
          setProjects(mapped.map((project, index) => enrichProject(project, index)));
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Project load failed:", err);
          setLoadError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();

    return () => controller.abort();
  }, []);

  /* ----------------------- */
  /* Escape key close       */
  /* ----------------------- */

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") {
        setOpenProject(null);
      }
    }

    window.addEventListener("keydown", handleKey);

    return () =>
      window.removeEventListener(
        "keydown",
        handleKey
      );
  }, []);

  return (
    <div className="library-shell">

      {/* floating dust */}

      <div className="dust-field" aria-hidden>
        {dust.map((p) => (
          <span
            key={p.id}
            style={{
              left: `${p.left}%`,
              animationDelay: `${(p.id % 8) * 0.7}s`
            }}
          />
        ))}
      </div>

      {/* header */}

      <header className="library-topbar">
        <div>
          <p className="kicker">
            Private Archive
          </p>

          <h1>
            A Corridor Of Working Volumes
          </h1>

          <p className="subtitle">
            My work is not a grid of links. It is a shelf of books you can pull and read.
          </p>
        </div>

        <button
          className="sound-toggle"
          onClick={handleToggleSound}
        >
          {soundEnabled
            ? "Sound: On"
            : "Sound: Off"}
        </button>
      </header>

      {/* loader */}

      {isLoading && (
        <div className="library-notice">
          <div className="spinner" />
          <p>Loading projects…</p>
        </div>
      )}

      {!isLoading && (
        <Bookshelf
          projects={projects}
          onOpenProject={(p) =>
            setOpenProject(p)
          }
          onBookPullSound={() =>
            soundEnabled &&
            playTone("pull", audioContextRef)
          }
        />
      )}

      {loadError && !isLoading && (
        <div className="library-notice library-error">
          Could not load GitHub repos.
        </div>
      )}

      {/* viewer */}

      <AnimatePresence>

        {openProject && (
          <Suspense
            fallback={
              <div className="viewer-loading">
                Opening book…
              </div>
            }
          >

            <BookViewer
              project={openProject}
              onClose={() =>
                setOpenProject(null)
              }
              onPageFlipSound={() =>
                soundEnabled &&
                playTone("flip", audioContextRef)
              }
            />

          </Suspense>
        )}

      </AnimatePresence>

      <div className="desk-surface" aria-hidden="true" />

    </div>
  );
}