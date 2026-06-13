import { motion } from "framer-motion";

export default function FeaturedVolume({ project, onOpen }) {
  return (
    <section className="featured-hero">
      {/* Background glow effects */}
      <div className="hero-glow hero-glow-left" />
      <div className="hero-glow hero-glow-right" />
      
      {/* Left Text Content */}
      <div className="hero-content">
        <p className="hero-kicker">PORTFOLIO ARCHIVE</p>
        <h2 className="hero-title">
          Pull a Volume.<br />
          Inspect the Receipts.
        </h2>
        <p className="hero-description">
          A curated library of ideas, code, research, and experiments.
          <br />
          <span style={{ borderBottom: "1px solid rgba(200, 175, 120, 0.4)", paddingBottom: 2 }}>Each volume opens a story.</span> Each story leaves a trace.
        </p>
        <div className="hero-signature">Sai Mrudula</div>
      </div>

      {/* Right Panel: Featured Volume */}
      <div className="hero-featured-panel">
        <div className="panel-header">FEATURED PREVIEW</div>
        
        <motion.div 
          className="panel-body"
          key={project?.id || "empty"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Open Book Graphic */}
          <div className="featured-book-graphic">
            <div className="book-page left-page">
              <span className="vol-text">{project?.volume || "VOL. 01"}</span>
              <h3>{project?.title || "Select a Volume"}</h3>
              <p className="book-sub">{project?.topics?.join(" · ") || project?.category || "Archive"}</p>
              <div className="book-sigil">{project?.sigil || "⚗️"}</div>
            </div>
            <div className="book-page right-page">
              <span className="vol-text">✦ ABSTRACT</span>
              <p className="abstract-text">
                {project?.description || project?.synopsis || "Explore the contents of this volume to reveal detailed notes, code artifacts, and research logs."}
              </p>
              <div className="book-sigil" style={{ opacity: 0.5 }}>🌿</div>
            </div>
            <div className="book-center-crease" />
          </div>

          {/* Project Details */}
          <div className="featured-details">
            <div className="detail-item">
              <span className="detail-icon">📚</span>
              <div>
                <p className="detail-label">Category</p>
                <p className="detail-val">{project?.category || "Research"}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📄</span>
              <div>
                <p className="detail-label">Stack</p>
                <p className="detail-val">{project?.language || "Code"}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📈</span>
              <div>
                <p className="detail-label">Impact</p>
                <p className="detail-val">{project?.stars ? `${project.stars} Stars` : "Stable"}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📅</span>
              <div>
                <p className="detail-label">Year</p>
                <p className="detail-val">{project?.publishedYear || "2025"}</p>
              </div>
            </div>

            <button className="open-volume-btn" onClick={() => onOpen(project)}>
              Open Volume <span>→</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
