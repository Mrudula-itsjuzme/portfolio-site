import { useEffect, useMemo, useRef, useState } from "react";

const fallbackProfile = {
  name: "Your Name",
  title: "Cybersecurity Engineer",
  summary:
    "A practical security-focused engineer who builds resilient systems, explains model behavior, and turns messy data into clear action.",
  email: "",
  phone: "",
  github: "https://github.com",
  linkedin: "https://www.linkedin.com",
  skills: ["Cybersecurity", "Machine Learning", "Python", "Network Defense"],
  highlights: [
    "Built anomaly detection workflows for threat intelligence.",
    "Created data pipelines and dashboards for operational visibility.",
    "Applied explainable AI methods for model transparency."
  ],
  resumePath: "/resume.pdf"
};

function normalizeUrl(url, fallback) {
  if (!url || typeof url !== "string") {
    return fallback;
  }

  return url.startsWith("http") ? url : `https://${url}`;
}

function formatDate(isoDate) {
  if (!isoDate) {
    return "Unknown";
  }

  return new Date(isoDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function shortText(text, max = 150) {
  if (!text) {
    return "";
  }

  if (text.length <= max) {
    return text;
  }

  return `${text.slice(0, max - 1)}...`;
}

function prettyName(name) {
  return String(name || "Untitled Project")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function whyText(project) {
  const c = String(project.category || "").toLowerCase();
  if (c.includes("cyber")) {
    return "Built to improve system safety, detect suspicious behavior early, and make security decisions explainable.";
  }
  if (c.includes("ai") || c.includes("ml")) {
    return "Built to transform raw data into decisions through practical machine learning workflows.";
  }
  if (c.includes("data")) {
    return "Built to turn complex analysis into clear visuals and useful operational insights.";
  }
  return "Built to solve a real workflow problem and document the solution in a reusable engineering form.";
}

function architectureLines(project) {
  return [
    `Input layer: ${project.language || "mixed-language"} sources and structured metadata.`,
    "Processing layer: feature extraction, validation checks, and task-specific logic.",
    "Output layer: project artifacts, reports, or interfaces for practical use."
  ];
}

function workflowLines(project) {
  const base = shortText(project.description || "Repository workflow available in source.", 160);
  return [
    "Collect and prepare data or project inputs.",
    `Run core implementation and evaluate behavior. ${base}`,
    "Refine output quality and publish reproducible results."
  ];
}

function tagsFor(project) {
  const tags = [project.language, ...(Array.isArray(project.topics) ? project.topics : [])]
    .filter(Boolean)
    .slice(0, 8);
  return [...new Set(tags)];
}

function getCategoryIcon(category) {
  const c = String(category || "").toLowerCase();
  if (c.includes("cyber")) return "🔐";
  if (c.includes("ai") || c.includes("ml")) return "🤖";
  if (c.includes("data")) return "📊";
  if (c.includes("web")) return "🌐";
  return "📚";
}

function getNarrative(context) {
  const narratives = {
    profile: [
      "Reading your resume...",
      "Opening the library ledger...",
      "Lighting the study lamps..."
    ],
    projects: [
      "Scanning the archives...",
      "Cataloging your projects...",
      "Dusting off the shelves...",
      "Organizing the volumes..."
    ],
    shelf: [
      "Your stories await...",
      "Navigate through your work...",
      "Each spine holds a memory..."
    ]
  };
  return narratives[context] || narratives.shelf;
}

export default function App() {
  const [profile, setProfile] = useState(fallbackProfile);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState("");
  const [projectData, setProjectData] = useState({
    username: "",
    projects: [],
    stats: {
      totalRepos: 0,
      totalStars: 0,
      languageMix: [],
      mostRecent: null
    }
  });
  const [activeShelf, setActiveShelf] = useState("AI");
  const [selectedProject, setSelectedProject] = useState(null);
  const [pullingBookId, setPullingBookId] = useState(null);
  const [hasOpened, setHasOpened] = useState(() => sessionStorage.getItem("libraryOpened") === "true");
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem("soundEnabled") !== "false");
  const [booksRead, setBooksRead] = useState(() => parseInt(localStorage.getItem("booksRead") || "0", 10));
  const [achievements, setAchievements] = useState(() => JSON.parse(localStorage.getItem("achievements") || "[]"));
  const [currentNarrativeIdx, setCurrentNarrativeIdx] = useState(0);
  const timeoutRef = useRef(null);
  const narrativeTimeoutRef = useRef(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [profileRes, projectsRes] = await Promise.all([fetch("/api/profile"), fetch("/api/projects")]);

        if (!profileRes.ok) {
          throw new Error("Could not load resume data");
        }

        const profilePayload = await profileRes.json();
        setProfile({ ...fallbackProfile, ...profilePayload });

        if (projectsRes.ok) {
          const projectsPayload = await projectsRes.json();
          setProjectData(projectsPayload);
        } else {
          setProjectError("Could not load repositories from GitHub.");
        }
      } catch (err) {
        setProfileError(err.message || "Failed to load profile");
      } finally {
        setProfileLoading(false);
        setProjectLoading(false);
        if (!hasOpened) {
          sessionStorage.setItem("libraryOpened", "true");
          setHasOpened(true);
        }
      }
    }

    loadProfile();
  }, [hasOpened]);

  useEffect(() => {
    localStorage.setItem("booksRead", String(booksRead));
  }, [booksRead]);

  useEffect(() => {
    localStorage.setItem("achievements", JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem("soundEnabled", soundEnabled ? "true" : "false");
  }, [soundEnabled]);

  const links = useMemo(
    () => ({
      github: normalizeUrl(profile.github, fallbackProfile.github),
      linkedin: normalizeUrl(profile.linkedin, fallbackProfile.linkedin),
      resume: profile.resumePath || "/resume.pdf"
    }),
    [profile]
  );

  const groupedShelves = useMemo(() => {
    const shelfMap = {
      AI: [],
      "Web Development": [],
      Research: [],
      Experiments: []
    };

    const mapped = projectData.projects.map((project) => {
      const category = String(project.category || "Engineering").toLowerCase();
      if (category.includes("ai") || category.includes("ml")) {
        return { ...project, shelf: "AI" };
      }
      if (category.includes("data") || category.includes("web")) {
        return { ...project, shelf: "Web Development" };
      }
      if (category.includes("cyber") || category.includes("research")) {
        return { ...project, shelf: "Research" };
      }
      return { ...project, shelf: "Experiments" };
    });

    mapped.forEach((p) => {
      shelfMap[p.shelf].push(p);
    });

    return shelfMap;
  }, [projectData.projects]);

  const shelfNames = useMemo(() => Object.keys(groupedShelves), [groupedShelves]);
  const visibleBooks = groupedShelves[activeShelf] || [];

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function openBook(project) {
    setPullingBookId(project.id);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setSelectedProject(project);
      setPullingBookId(null);
      const newBooksRead = booksRead + 1;
      setBooksRead(newBooksRead);
      if (newBooksRead === 5 && !achievements.includes("explorer")) {
        setAchievements([...achievements, "explorer"]);
      }
      if (newBooksRead === projectData.stats.totalRepos && !achievements.includes("librarian")) {
        setAchievements([...achievements, "librarian"]);
      }
    }, 300);
  }

  const totalBooks = projectData.stats.totalRepos || 26;
  const explorationPercentage = Math.round((booksRead / totalBooks) * 100);

  const dustParticles = useMemo(
    () => Array.from({ length: 18 }).map((_, i) => ({ id: i, left: (i * 17) % 100, delay: (i % 9) * 0.7 })),
    []
  );

  return (
    <>
      <div className="library-dust" aria-hidden="true">
        {dustParticles.map((p) => (
          <span key={p.id} className="dust" style={{ left: `${p.left}%`, animationDelay: `${p.delay}s` }} />
        ))}
      </div>

      <header className="topbar">
        <div>
          <p className="library-kicker">Welcome to My Library</p>
          <h1 className="library-title">Projects I Have Built</h1>
          <div className="header-meta">
            <span className="progress-indicator">{booksRead} of {totalBooks} volumes explored</span>
            <button
              type="button"
              className="sound-toggle"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={`Sound ${soundEnabled ? "on" : "off"}`}
            >
              🔊
            </button>
          </div>
        </div>
        <div className="top-actions">
          <a className="pill" href={links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="pill" href={links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="pill" href={links.resume} target="_blank" rel="noreferrer">
            Resume
          </a>
        </div>
      </header>

      <main className="page">
        <nav className="breadcrumb" aria-label="Navigation breadcrumb">
          <span className="breadcrumb-item">📚 Home</span>
          <span className="breadcrumb-sep">→</span>
          <span className="breadcrumb-item active">{activeShelf} Shelf</span>
          {selectedProject ? (
            <>
              <span className="breadcrumb-sep">→</span>
              <span className="breadcrumb-item active">{prettyName(selectedProject.name)}</span>
            </>
          ) : null}
        </nav>

        <section className={`profile-intro ${hasOpened ? "profile-intro-open" : ""}`}>
          <div className="profile-intro-content">
            <h2>{profile.name}</h2>
            <p className="profile-title">{profile.title}</p>
            <p className="profile-bio">{profile.summary}</p>
            <div className="skills-teaser">
              <h4>Key Skills</h4>
              <div className="skill-tags">
                {Array.isArray(profile.skills)
                  ? profile.skills.slice(0, 5).map((skill) => (
                      <span key={skill} className="skill-tag">
                        {skill}
                      </span>
                    ))
                  : null}
              </div>
            </div>
          </div>
          {achievements.length > 0 ? (
            <div className="achievements-peek">
              <h4>Achievements</h4>
              <div className="achievement-badges">
                {achievements.includes("explorer") ? (
                  <span className="badge" title="Explored 5 projects">
                    🏃 Explorer
                  </span>
                ) : null}
                {achievements.includes("librarian") ? (
                  <span className="badge" title="Explored all shelves">
                    📚 Librarian
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>

        <section className="intro-note">
          <p>
            Click or drag a book spine. It slides from the shelf and opens on the desk.
            Explore ideas as if you are walking through my working library.
          </p>
          <p className="intro-meta">
            {profileLoading ? getNarrative("profile")[currentNarrativeIdx % getNarrative("profile").length] : profile.name} |
            {projectLoading ? getNarrative("projects")[currentNarrativeIdx % getNarrative("projects").length] : `${projectData.stats.totalRepos} books archived`}
          </p>
          {profileError ? <p className="error">{profileError}</p> : null}
          {projectError ? <p className="error">{projectError}</p> : null}
        </section>

        <section className="shelf-tabs" aria-label="Project shelf categories">
          {shelfNames.map((shelf) => (
            <button
              key={shelf}
              type="button"
              className={`shelf-tab ${activeShelf === shelf ? "shelf-tab-active" : ""}`}
              onClick={() => setActiveShelf(shelf)}
            >
              {shelf}
            </button>
          ))}
        </section>

        <section className="library-corridor" aria-label="Bookshelf corridor">
          <article className="shelf-panel" key={activeShelf}>
            <h2>{activeShelf} Shelf</h2>
            <div className="wood-shelf" />
            <div className="book-row">
              {visibleBooks.length === 0 ? <p className="empty-books">No books in this shelf yet.</p> : null}
              {visibleBooks.slice(0, 18).map((project, index) => (
                <button
                  key={project.id}
                  type="button"
                  draggable
                  onDragStart={() => openBook(project)}
                  onClick={() => openBook(project)}
                  className={`book-spine ${pullingBookId === project.id ? "book-pulled" : ""}`}
                  style={{ background: `var(--book-${(index % 5) + 1})` }}
                  title={`Open ${prettyName(project.name)}`}
                >
                  <span>{prettyName(project.name)}</span>
                </button>
              ))}
            </div>
          </article>
        </section>
      </main>

      {selectedProject ? (
        <div className="quest-modal-backdrop" onClick={() => setSelectedProject(null)} role="presentation">
          <section className="quest-modal" role="dialog" aria-modal="true" aria-label="Project details" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="quest-close" onClick={() => setSelectedProject(null)}>
              Close
            </button>
            <div className="open-book">
              <article className="book-page">
                <p className="eyebrow">{selectedProject.category}</p>
                <h3 className="quest-title">{prettyName(selectedProject.name)}</h3>
                <h4>Overview</h4>
                <p className="quest-description">{selectedProject.description || "Project details available in repository."}</p>
                <h4>Why I Built It</h4>
                <p className="quest-description">{whyText(selectedProject)}</p>
                <h4>Tech Stack</h4>
                <div className="book-tags">
                  {tagsFor(selectedProject).map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>

              <article className="book-page">
                <h4>Architecture</h4>
                <ul>
                  {architectureLines(selectedProject).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <h4>Working</h4>
                <ul>
                  {workflowLines(selectedProject).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <h4>Resources</h4>
                <div className="project-metrics">
                  <span>Language {selectedProject.language}</span>
                  <span>Stars {selectedProject.stars}</span>
                  <span>Forks {selectedProject.forks}</span>
                  <span>Updated {formatDate(selectedProject.updatedAt)}</span>
                </div>
                <div className="project-links">
                  <a href={selectedProject.url} target="_blank" rel="noreferrer">
                    GitHub Repository
                  </a>
                  {selectedProject.homepage ? (
                    <a href={selectedProject.homepage} target="_blank" rel="noreferrer">
                      Live Resource
                    </a>
                  ) : null}
                </div>
              </article>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
