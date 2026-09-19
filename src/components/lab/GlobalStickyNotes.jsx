import { useEffect, useRef, useState } from "react";

const COLORS = ["pink", "butter", "sage", "paper"];

export function makeGlobalNote(text) {
  return {
    id: "user-note-" + Date.now(),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    lines: [text],
    x: Math.round(window.scrollX + window.innerWidth * 0.62 + (Math.random() * 80 - 40)),
    y: Math.round(window.scrollY + window.innerHeight * 0.34 + (Math.random() * 80 - 40)),
    rotation: Number((Math.random() * 7 - 3.5).toFixed(1)),
    crossed: false,
    z: Date.now(),
  };
}

export default function GlobalStickyNotes({ notes, onChange }) {
  const [dragging, setDragging] = useState(null);
  const dragRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current) return;
      const { id, dx, dy } = dragRef.current;
      const maxX = Math.max(8, document.documentElement.clientWidth - 190);
      const maxY = Math.max(window.innerHeight, document.documentElement.scrollHeight) - 80;
      const x = Math.max(8, Math.min(maxX, e.clientX + window.scrollX - dx));
      const y = Math.max(8, Math.min(maxY, e.clientY + window.scrollY - dy));
      onChange((prev) => prev.map((n) => n.id === id ? { ...n, x, y } : n));
    };
    const onUp = () => {
      dragRef.current = null;
      setDragging(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [onChange]);

  const start = (e, note) => {
    if (e.button !== 0) return;
    const target = e.target;
    if (target.closest?.(".global-note-delete")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = {
      id: note.id,
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
    };
    const top = Date.now();
    onChange((prev) => prev.map((n) => n.id === note.id ? { ...n, z: top } : n));
    setDragging(note.id);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  };

  const toggleCross = (note) => {
    onChange((prev) => prev.map((n) => n.id === note.id ? { ...n, crossed: !n.crossed } : n));
  };

  const remove = (id) => {
    onChange((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="global-note-layer" aria-label="movable sticky notes">
      {notes.map((note) => (
        <aside
          key={note.id}
          className={"global-sticky note-" + note.color + (dragging === note.id ? " dragging" : "") + (note.crossed ? " crossed" : "")}
          style={{
            left: note.x,
            top: note.y,
            zIndex: note.z || 120,
            transform: `rotate(${note.rotation || 0}deg)`,
          }}
          onPointerDown={(e) => start(e, note)}
          onDoubleClick={() => toggleCross(note)}
          title="drag anywhere · double-click to cross / uncross"
        >
          <span className="global-note-tape" aria-hidden="true" />
          <button
            type="button"
            className="global-note-delete"
            onClick={() => remove(note.id)}
            aria-label="delete note"
          >
            ×
          </button>
          <div className="global-note-text">
            {note.lines.map((line, i) => <div key={i}>{line}</div>)}
          </div>
          <span className="global-note-x" aria-hidden="true" />
        </aside>
      ))}
    </div>
  );
}
