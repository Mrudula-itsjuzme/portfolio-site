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

function generateBookTitle(repo) {
  const base = prettyName(repo?.name);
  const topics = Array.isArray(repo?.topics) ? repo.topics.join(" ").toLowerCase() : "";
  const language = String(repo?.language || "").toLowerCase();

  if (/(aircraft|sensor|signal|iot|embedded|flight)/.test(topics + " " + base.toLowerCase())) {
    return `Field Manual of ${base}`;
  }

  if (/(model|train|dataset|neural|ai|ml|classification|prediction)/.test(topics)) {
    return `Treatise on ${base}`;
  }

  if (/(data|analytics|etl|pipeline|forecast|analysis)/.test(topics + " " + base.toLowerCase())) {
    return `Atlas of ${base}`;
  }

  if (/(react|frontend|ui|web|javascript|typescript|next)/.test(topics + " " + language)) {
    return `${base} Codex`;
  }

  if (/(api|server|backend|express|flask|django|fastapi)/.test(topics + " " + base.toLowerCase())) {
    return `${base} Service Ledger`;
  }

  if (base.split(" ").length <= 2) {
    return `Chronicle of ${base}`;
  }

  return base;
}

function generateCoverSubtitle(repo) {
  const language = repo?.language || "Engineering";
  const firstTopic = Array.isArray(repo?.topics) && repo.topics.length ? prettyName(repo.topics[0]) : null;
  return firstTopic ? `${language} • ${firstTopic}` : language;
}

function buildProjectIdea(repo, category) {
  const name = prettyName(repo?.name);
  const topics = Array.isArray(repo?.topics) ? repo.topics.slice(0, 3) : [];
  if (topics.length) {
    return `${name} is organized around ${topics.join(", ")}, with each layer separated so the system can evolve without destabilizing adjacent components.`;
  }
  return `Build a calm, readable system around ${String(category || "engineering").toLowerCase()} using modular components, explicit boundaries, and strong feedback loops.`;
}

function buildProjectGoal(repo, category) {
  const language = repo?.language || category || "Engineering";
  return `Deliver reliable ${String(language).toLowerCase()} outcomes while keeping behavior observable, testable, and easy to iterate.`;
}

function buildWorkflowSteps(repo) {
  const topics = Array.isArray(repo?.topics) ? repo.topics.join(" ").toLowerCase() : "";
  const language = String(repo?.language || "").toLowerCase();

  if (/(model|train|dataset|classification|prediction|neural|ml|ai)/.test(topics)) {
    return [
      "Acquire and validate the training dataset",
      "Engineer features and normalize signal quality",
      "Train, evaluate, and compare candidate models",
      "Package the best-performing path for inference",
      "Track results and iterate using measured error cases"
    ];
  }

  if (/(react|frontend|ui|web)/.test(topics + " " + language)) {
    return [
      "Compose reusable interface components",
      "Model local and shared state transitions",
      "Integrate external APIs or static data sources",
      "Refine rendering, accessibility, and interaction feedback",
      "Ship a stable deployment path with regression checks"
    ];
  }

  if (/(api|server|backend|express|flask|django|fastapi)/.test(topics + " " + language)) {
    return [
      "Accept and validate external requests",
      "Route work into focused service modules",
      "Execute core business rules and persistence",
      "Return consistent responses with failure metadata",
      "Observe logs and iterate on bottlenecks"
    ];
  }

  return [
    "Collect and validate inputs",
    "Execute the implementation pipeline",
    "Capture outputs and behavior",
    "Review measurable outcomes",
    "Iterate with testing feedback"
  ];
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
  const title = generateBookTitle(repo);

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
    language: repo?.language || "Code",
    description,
    stars: repo?.stars ?? 0,
    forks: repo?.forks ?? 0,
    category,
    leather,
    accent,
    repoAssets: repo?.repoAssets || null,
    defaultBranch: repo?.defaultBranch || "main",

    githubUrl:
      repo?.url ||
      "https://github.com/Mrudula-itsjuzme",

    demoUrl:
      repo?.homepage ||
      "https://mrudula-itsjuzme.github.io/portfolio-site/",

    pages: [
      {
        kind: "cover",
        title,
        subtitle: generateCoverSubtitle(repo),
        author: "Pedamallu Sai Mrudula",
        year: new Date().getFullYear().toString(),
        image: repo?.repoAssets?.diagramUrl || null
      },

      {
        kind: "overview",
        title: "Overview",
        problem: description,
        idea: buildProjectIdea(repo, category),
        goal: buildProjectGoal(repo, category)
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
        image: repo?.repoAssets?.diagramUrl || null,
        text:
          "The system is structured as a modular processing pipeline enabling scalable and testable components."
      },

      ...(repo?.repoAssets?.galleryUrls?.length ? [
        {
          kind: "gallery",
          title: "Visual Archive",
          images: repo.repoAssets.galleryUrls.map(url => ({ src: url, alt: "Project Screenshot" }))
        }
      ] : []),

      {
        kind: "workflow",
        title: "Working / Implementation",
        steps: buildWorkflowSteps(repo)
      },

      {
        kind: "stack",
        title: "Tech Stack",
        technologies: (repo?.repoAssets?.techStack?.length) 
          ? repo.repoAssets.techStack 
          : [repo?.language || "Mixed", ...topTopics]
      },

      {
        kind: "resources",
        title: "Resources",
        links: [
          "Repository documentation",
          repo?.url ? "Source repository" : "Source overview",
          repo?.repoAssets?.diagramUrl ? "Architecture diagram located in repository assets" : "No checked-in architecture diagram found",
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

/* ---------------------------------- */
/* Ambient Music Generator            */
/* ---------------------------------- */

function createAmbientMusic(contextRef, gainRef, oscillatorsRef, enabled) {
  const Context =
    window.AudioContext ||
    window.webkitAudioContext;

  if (!Context) {
    console.warn("Web Audio API not supported");
    return;
  }

  // Initialize context if needed
  if (!contextRef.current) {
    try {
      contextRef.current = new Context();
      console.log("Audio context created");
    } catch (e) {
      console.error("AudioContext creation failed:", e);
      return;
    }
  }

  const ctx = contextRef.current;

  // Resume suspended context
  if (ctx.state === "suspended") {
    ctx.resume().then(() => {
      console.log("Audio context resumed");
    }).catch((err) => {
      console.warn("Failed to resume audio context:", err);
    });
  }

  if (!enabled) {
    // Fade out and stop all oscillators
    console.log("Stopping audio...");
    if (gainRef.current) {
      gainRef.current.gain.setValueAtTime(
        gainRef.current.gain.value,
        ctx.currentTime
      );
      gainRef.current.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 1.5
      );
    }

    // Schedule stopping oscillators
    setTimeout(() => {
      if (oscillatorsRef.current?.length) {
        oscillatorsRef.current.forEach((osc) => {
          try {
            osc.stop();
          } catch (e) {
            // Already stopped
          }
        });
        oscillatorsRef.current = [];
      }
    }, 1500);
    return;
  }

  // Clear any existing oscillators
  if (oscillatorsRef.current?.length) {
    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {}
    });
    oscillatorsRef.current = [];
  }

  // Create master gain if needed
  if (!gainRef.current) {
    gainRef.current = ctx.createGain();
    gainRef.current.connect(ctx.destination);
    console.log("Gain node created");
  }

  // Fade in
  gainRef.current.gain.setValueAtTime(0.001, ctx.currentTime);
  gainRef.current.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 2);

  // More audible base frequencies (one octave higher)
  const baseNotes = [
    130.81, // C3
    195.99, // G3
    246.94, // B3
    164.81, // E3
  ];

  console.log("Starting ambient music with notes:", baseNotes);

  // Add layered sine waves with longer sustain
  baseNotes.forEach((freq, idx) => {
    // Main oscillator
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;

    // Subtle vibrato
    const vibratoOsc = ctx.createOscillator();
    vibratoOsc.frequency.value = 0.3 + idx * 0.15; // Slower wobble

    const vibratoGain = ctx.createGain();
    vibratoGain.gain.value = 3; // Deeper modulation

    vibratoOsc.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);

    // Per-note gain
    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0, ctx.currentTime);
    noteGain.gain.exponentialRampToValueAtTime(
      0.08 - idx * 0.01,
      ctx.currentTime + 3
    );

    osc.connect(noteGain);
    noteGain.connect(gainRef.current);

    osc.start();
    vibratoOsc.start();

    oscillatorsRef.current.push(osc, vibratoOsc);
  });

  // Add noise for texture
  const bufferSize = ctx.sampleRate * 2;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);

  // Generate brownian noise (smoother than white noise)
  let lastSample = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    noiseData[i] = (lastSample + 0.02 * white) / 1.02;
    lastSample = noiseData[i];
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  // Low-pass filter
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 100;
  filter.Q.value = 0.5;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0, ctx.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.025, ctx.currentTime + 4);

  noiseSource.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(gainRef.current);

  noiseSource.start();
  oscillatorsRef.current.push(noiseSource);

  console.log("Ambient music initialized with", oscillatorsRef.current.length, "sources");
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
  const musicRef = useRef(null);
  const musicGainRef = useRef(null);
  const oscillatorsRef = useRef([]);

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

    // Control music
    createAmbientMusic(
      audioContextRef,
      musicGainRef,
      oscillatorsRef,
      next
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

        // Prefer the static repos.json baked at build time by scripts/fetch-repos.js
        // (avoids GitHub API rate limits entirely on the live site)
        const res = await fetch(
          `${import.meta.env.BASE_URL}repos.json`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error(`repos.json ${res.status}`);
        }

        const raw = await res.json();
        const repos = Array.isArray(raw) ? raw : [];

        if (repos.length) {
          const mapped = repos.map((repo, i) => mapRepoToProject(repo, i));
          setProjects(mapped.map((p, i) => enrichProject(p, i)));
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("Static repos.json failed, trying GitHub API:", err.message);
          // Fallback: call GitHub API directly (may be rate-limited)
          try {
            const apiRes = await fetch(
              "https://api.github.com/users/Mrudula-itsjuzme/repos?per_page=100&sort=updated",
              { headers: { Accept: "application/vnd.github+json" } }
            );
            if (apiRes.ok) {
              const raw = await apiRes.json();
              const repos = Array.isArray(raw)
                ? raw.filter(r => !r.fork && r.name !== "portfolio-site").map(r => ({
                    id: r.id, name: r.name, fullName: r.full_name,
                    description: r.description || "", language: r.language || "Code",
                    url: r.html_url, homepage: r.homepage || "",
                    topics: r.topics || [], stars: r.stargazers_count, forks: r.forks_count,
                  }))
                : [];
              if (repos.length) {
                const mapped = repos.map((repo, i) => mapRepoToProject(repo, i));
                setProjects(mapped.map((p, i) => enrichProject(p, i)));
              }
            }
          } catch (apiErr) {
            console.warn("GitHub API also failed, using hardcoded fallback:", apiErr.message);
          }
          setLoadError(null); // hardcoded fallback is fine, don't show error
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

  /* ----------------------- */
  /* Start ambient music     */
  /* ----------------------- */

  useEffect(() => {
    if (soundEnabled) {
      createAmbientMusic(
        audioContextRef,
        musicGainRef,
        oscillatorsRef,
        true
      );
    }

    return () => {
      // Stop music on unmount
      if (oscillatorsRef.current?.length) {
        oscillatorsRef.current.forEach((osc) => {
          try {
            osc.stop();
          } catch (e) {}
        });
        oscillatorsRef.current = [];
      }
    };
  }, [soundEnabled]);

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
            Portfolio Archive
          </p>

          <h1>
            Pedamallu Sai Mrudula
          </h1>

          <p className="subtitle">
            AI/ML Engineer . Cybersecurity Researcher . Full-Stack Developer
          </p>
          <p className="subtitle tagline">
            My work is not a grid of links. It is a shelf of books you can pull and read.
          </p>
        </div>

        <div className="topbar-actions">
          <a
            className="resume-btn"
            href={`${import.meta.env.BASE_URL}resume.pdf`}
            target="_blank"
            rel="noreferrer"
            title="Download Resume"
          >
            Resume
          </a>
          <button
            className="sound-toggle"
            onClick={handleToggleSound}
            title="Toggle ambient music and sound effects"
          >
            {soundEnabled
              ? "\uD83D\uDD0A Ambient: On"
              : "\uD83D\uDD07 Ambient: Off"}
          </button>
        </div>
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
        <p className="footer-updated">Last Archive Sync: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
      </footer>

      <div className="desk-surface" aria-hidden="true" />

    </div>
  );
}