import { useEffect } from "react";

export default function EssayModal({ isOpen, onClose, article }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !article) return null;

  return (
    <div className="essay-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={article.title}>
      <div className="essay-card" onClick={(e) => e.stopPropagation()}>
        <button className="essay-close" onClick={onClose} title="Close (Esc)">
          ✕
        </button>
        <div className="essay-header">
          <span className="essay-status">{article.status || "Essay"}</span>
          <span className="essay-date">{article.date || "2026"}</span>
        </div>
        <h2 className="essay-title">{article.title}</h2>
        {article.subtitle && <p className="essay-subtitle">{article.subtitle}</p>}
        <div className="essay-body">
          {article.content ? (
            article.content.split("\n\n").map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))
          ) : (
            <p>{article.excerpt || "Full text available on LinkedIn."}</p>
          )}
        </div>
        {article.href && (
          <div className="essay-footer">
            <a href={article.href} target="_blank" rel="noreferrer" className="btn-ink">
              Read original on LinkedIn ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
