/**
 * SimpleView — accessible, static project grid.
 *
 * Uses the same `projects` array the bookshelf uses so there's
 * exactly one data source. No Framer Motion, no canvas, no audio.
 */
import { useEffect, useState } from "react";
import "../styles/simple-view.css";

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function tagList(project) {
  const topics = Array.isArray(project.topics) ? project.topics : [];
  const lang   = project.language || project.category || null;
  const all    = lang ? [lang, ...topics] : topics;
  return [...new Set(all)].slice(0, 6);
}

function repoUrl(project) {
  return (
    project.githubUrl ||
    project.url ||
    (project.repoName ? `https://github.com/${project.repoName}` : null)
  );
}

function demoUrl(project) {
  return project.demoUrl || project.homepage || null;
}

/* ------------------------------------------------------------------ */
/* Single card                                                          */
/* ------------------------------------------------------------------ */

function ProjectCard({ project, index }) {
  const tags  = tagList(project);
  const ghUrl = repoUrl(project);
  const demo  = demoUrl(project);
  const desc  = project.synopsis || project.description || "No description available.";

  return (
    <article
      className="sv-card"
      aria-label={`Project: ${project.spineTitle || project.title}`}
    >
      <div className="sv-card-inner">
        {/* Index badge */}
        <span className="sv-card-index" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="sv-card-content">
          <h3 className="sv-card-title">
            {ghUrl ? (
              <a href={ghUrl} target="_blank" rel="noreferrer noopener">
                {project.spineTitle || project.title}
              </a>
            ) : (
              project.spineTitle || project.title
            )}
          </h3>

          <p className="sv-card-category">{project.category}</p>

          <p className="sv-card-desc">{desc}</p>

          {tags.length > 0 && (
            <ul className="sv-card-tags" aria-label="Tech tags">
              {tags.map((t) => (
                <li key={t} className="sv-card-tag">{t}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="sv-card-actions">
          {ghUrl && (
            <a
              href={ghUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="sv-btn sv-btn-primary"
              aria-label={`View ${project.spineTitle} on GitHub`}
            >
              GitHub →
            </a>
          )}
          {demo && demo !== ghUrl && (
            <a
              href={demo}
              target="_blank"
              rel="noreferrer noopener"
              className="sv-btn sv-btn-secondary"
              aria-label={`Live demo for ${project.spineTitle}`}
            >
              Demo ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Main SimpleView                                                      */
/* ------------------------------------------------------------------ */

export default function SimpleView({ projects }) {
  // Sort by priority if available, then by title
  const sorted = [...(projects || [])].sort((a, b) => {
    if (a.priority != null && b.priority != null) return a.priority - b.priority;
    if (a.priority != null) return -1;
    if (b.priority != null) return 1;
    return (a.spineTitle || "").localeCompare(b.spineTitle || "");
  });

  // Group into categories for section headings
  const grouped = sorted.reduce((acc, p) => {
    const cat = p.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  const [filter, setFilter] = useState("All");
  const categories = ["All", ...Object.keys(grouped)];

  const visible = filter === "All"
    ? sorted
    : (grouped[filter] || []);

  return (
    <div className="simple-view" id="simple-view" role="main">
      {/* ── Header ── */}
      <header className="sv-header">
        <div className="sv-header-inner">
          <p className="sv-eyebrow">Portfolio · Simple View</p>
          <h1 className="sv-title">Mrudula's Projects</h1>
          <p className="sv-subtitle">
            A plain, fast, accessible view of all projects.
            Switch to <strong>Immersive view</strong> for the full library experience.
          </p>
        </div>
      </header>

      {/* ── Category filter ── */}
      <nav className="sv-filter-bar" aria-label="Filter by category">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`sv-filter-btn${filter === cat ? " active" : ""}`}
            onClick={() => setFilter(cat)}
            aria-pressed={filter === cat}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* ── Project grid ── */}
      <section className="sv-grid" aria-label="Projects">
        {visible.length === 0 && (
          <p className="sv-empty">No projects in this category yet.</p>
        )}
        {visible.map((p, i) => (
          <ProjectCard key={p.id || p.spineTitle || i} project={p} index={i} />
        ))}
      </section>

      {/* ── Footer ── */}
      <footer className="sv-footer">
        <p>
          Built by Mrudula ·{" "}
          <a
            href="https://github.com/Mrudula-itsjuzme"
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
