import { useEffect, useState } from "react";

export default function LightboxModal({ isOpen, onClose, items = [], currentIndex = 0, onSelectIndex }) {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    setZoomed(false);
  }, [currentIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        if (items.length > 1) {
          onSelectIndex((currentIndex - 1 + items.length) % items.length);
        }
      } else if (e.key === "ArrowRight") {
        if (items.length > 1) {
          onSelectIndex((currentIndex + 1) % items.length);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, currentIndex, items, onClose, onSelectIndex]);

  if (!isOpen || !items.length) return null;

  const current = items[currentIndex] || items[0];

  return (
    <div
      className="lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image fullscreen lightbox"
    >
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="lightbox-close"
          onClick={onClose}
          aria-label="Close fullscreen view"
          title="Close (Esc)"
        >
          ✕
        </button>

        <div className="lightbox-meta">
          {current.tag && <span className="lightbox-tag">{current.tag}</span>}
          {current.title && <h3 className="lightbox-title">{current.title}</h3>}
        </div>

        <div className={`lightbox-stage ${zoomed ? "zoomed" : ""}`} onClick={() => setZoomed(!zoomed)}>
          <img
            src={current.src}
            alt={current.alt || "Fullscreen view"}
            className="lightbox-img"
          />
          <span className="lightbox-zoom-hint">
            {zoomed ? "click to fit" : "click to zoom 🔍"}
          </span>
        </div>

        {current.caption && (
          <p className="lightbox-caption">
            ✦ {current.caption}
          </p>
        )}

        {items.length > 1 && (
          <div className="lightbox-nav">
            <button
              className="lightbox-arrow"
              onClick={() => onSelectIndex((currentIndex - 1 + items.length) % items.length)}
              aria-label="Previous image"
              title="Previous (Left Arrow)"
            >
              ←
            </button>
            <span className="lightbox-counter">
              {currentIndex + 1} / {items.length}
            </span>
            <button
              className="lightbox-arrow"
              onClick={() => onSelectIndex((currentIndex + 1) % items.length)}
              aria-label="Next image"
              title="Next (Right Arrow)"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
