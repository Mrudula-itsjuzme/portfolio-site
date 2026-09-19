import { useCallback, useEffect, useRef, useState } from "react";

const KEY = "mrudula-workboard-v1";

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
function save(value) {
  try { localStorage.setItem(KEY, JSON.stringify(value)); } catch {}
}

export default function MovableScrap({ id, x, y, rotation = 0, tone = "paper", parentRef, children }) {
  const ref = useRef(null);
  const [pos, setPos] = useState(() => ({ x, y }));
  const [z, setZ] = useState(3);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const saved = load()[id];
    if (saved) {
      setPos({ x: saved.x ?? x, y: saved.y ?? y });
      setZ(saved.z ?? 3);
    }
  }, [id, x, y]);

  const bounds = useCallback(() => {
    const parent = parentRef?.current;
    const el = ref.current;
    if (!parent || !el) return { maxX: 9999, maxY: 9999 };
    return {
      maxX: Math.max(0, parent.clientWidth - el.offsetWidth),
      maxY: Math.max(0, parent.clientHeight - el.offsetHeight),
    };
  }, [parentRef]);

  const onPointerDown = (e) => {
    if (e.button !== 0 || window.matchMedia("(pointer: coarse)").matches) return;
    e.preventDefault();
    const parent = parentRef?.current;
    const el = ref.current;
    if (!parent || !el) return;

    const parentRect = parent.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - rect.left;
    const dy = e.clientY - rect.top;
    const saved = load();
    const top = Object.values(saved).reduce((m, item) => Math.max(m, item?.z || 0), 3) + 1;
    setZ(top);
    setDragging(true);
    el.setPointerCapture?.(e.pointerId);

    const move = (ev) => {
      const b = bounds();
      const nx = Math.max(0, Math.min(b.maxX, ev.clientX - parentRect.left - dx));
      const ny = Math.max(0, Math.min(b.maxY, ev.clientY - parentRect.top - dy));
      setPos({ x: nx, y: ny });
    };

    const up = () => {
      setDragging(false);
      const current = ref.current;
      if (current) {
        const left = parseFloat(current.style.left) || 0;
        const topPos = parseFloat(current.style.top) || 0;
        save({ ...load(), [id]: { x: left, y: topPos, z: top } });
      }
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up, { once: true });
  };

  const reset = () => {
    const all = load();
    delete all[id];
    save(all);
    setPos({ x, y });
    setZ(3);
  };

  return (
    <article
      ref={ref}
      className={`movable-scrap scrap-${tone}${dragging ? " dragging" : ""}`}
      style={{
        left: pos.x,
        top: pos.y,
        zIndex: z,
        transform: `rotate(${rotation}deg)`,
      }}
      onPointerDown={onPointerDown}
      onDoubleClick={reset}
      title="drag me · double-click to reset"
    >
      <span className="scrap-tape" aria-hidden="true" />
      {children}
    </article>
  );
}
