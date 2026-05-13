import { motion } from "framer-motion";

function pickFeatured(projects) {
  if (!Array.isArray(projects) || projects.length === 0) return [];

  const preferred = ["motion", "portfolio", "eeg"];

  return preferred
    .map((needle) =>
      projects.find((project) =>
        `${project.title || ""} ${project.spineTitle || ""} ${project.repoName || ""}`
          .toLowerCase()
          .includes(needle)
      )
    )
    .filter(Boolean)
    .filter((project, index, array) => array.findIndex((item) => item.id === project.id) === index)
    .concat(projects)
    .slice(0, 3);
}

export default function ArchiveSpotlight({ projects = [], onOpenProject }) {
  const featured = pickFeatured(projects);

  return (
    <section className="archive-spotlight" aria-label="Featured projects">
      <div className="spotlight-heading">
        <p>Featured volumes</p>
        <h2>Start here if you only have thirty seconds.</h2>
      </div>

      <div className="spotlight-grid">
        {featured.map((project, index) => (
          <motion.article
            className="spotlight-card"
            key={project.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: index * 0.08 }}
          >
            <div className="spotlight-index">0{index + 1}</div>
            <div>
              <p className="spotlight-category">{project.category || project.language || "Archive entry"}</p>
              <h3>{project.title || project.spineTitle}</h3>
              <p className="spotlight-copy">
                {project.synopsis || project.description || "A documented project with source links and implementation notes."}
              </p>
            </div>

            <div className="spotlight-actions">
              <button type="button" onClick={() => onOpenProject?.(project)}>
                Open volume
              </button>
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                  Source
                </a>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
