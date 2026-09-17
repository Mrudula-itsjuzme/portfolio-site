import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const STORAGE_KEY = "lab-notes-v1";
const TAU = Math.PI * 2;

function loadPositions() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePositions(map) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* private mode etc. — notes just won't persist */
  }
}

/**
 * Draggable sticky note. Position (x/y), rotation and z are persisted per note id.
 * Positions are stored relative to the note's positioning parent (fallback: viewport).
 * Degrades to a static in-flow note on touch/coarse pointers and under reduced motion.
 */
export default function StickyNote({
  id,
  color = "butter",
  rotation = 0,
  x,
  y,
  z = 5,
  title,
  lines,
  maxWidth = 205,
  dragDisabled = false,
  parentRef,
}) {
  const noteRef = useRef(null);
  const [pos, setPos] = useState(() => ({ x, y }));
  const [tilt, setTilt] = useState(rotation);
  const [dragging, setDragging] = useState(false);
  const [zIndex, setZIndex] = useState(z);
  const stateRef = useRef({ pos, tilt });
  stateRef.current = { pos, tilt };

  const coarse = useCoarsePointer();
  const reduced = usePrefersReducedMotion();
  const canDrag = !dragDisabled && !coarse && !reduced;

  // parent-aware bounds
  const bounds = useCallback(() => {
    const elW = noteRef.current?.offsetWidth || maxWidth;
    const pr = parentRef?.current?.getBoundingClientRect();
    const maxX = pr ? Math.max(4, pr.width - elW - 4) : Math.max(4, window.innerWidth - elW - 8);
    const maxY = pr ? Math.max(0, pr.height - 60) : Math.max(0, window.innerHeight - 80);
    return { maxX, maxY };
  }, [maxWidth, parentRef]);

  // hydrate + clamp (saved or default) to the parent box
  useLayoutEffect(() => {
    const { maxX, maxY } = bounds();
    const saved = loadPositions()[id];
    const target = saved ? { x: saved.x, y: saved.y } : { x, y };
    setPos({
      x: Math.min(Math.max(4, target.x), maxX),
      y: Math.min(Math.max(0, target.y), maxY),
    });
    if (saved && typeof saved.rotation === "number") setTilt(saved.rotation);
    if (saved && typeof saved.z === "number") setZIndex(saved.z);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const bumpZ = useCallback(() => {
    const map = loadPositions();
    const top = Object.values(map).reduce((m, n) => Math.max(m, n.z || 0), 5) + 1;
    const next = { ...map, [id]: { ...(map[id] || {}), z: top } };
    savePositions(next);
    setZIndex(top);
  }, [id]);

  const onPointerDown = useCallback(
    (e) => {
      if (!canDrag) return;
      if (e.button !== 0) return;
      e.preventDefault();
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const pr = parentRef?.current?.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      // pointer position in parent coordinates at drag start
      const pLeft = pr ? pr.left : 0;
      const pTop = pr ? pr.top : 0;
      const startInParent = {
        x: rect.left - pLeft,
        y: rect.top - pTop,
      };
      let raf = 0;
      let last = null;

      bumpZ();
      setDragging(true);
      el.setPointerCapture?.(e.pointerId);

      const move = (ev) => {
        const nx = ev.clientX - offsetX - pLeft;
        const ny = ev.clientY - offsetY - pTop;
        last = { x: nx, y: ny };
        if (!raf) {
          raf = requestAnimationFrame(() => {
            raf = 0;
            if (last) setPos(last);
          });
        }
      };

      const up = () => {
        el.releasePointerCapture?.(e.pointerId);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
        setDragging(false);
        if (last) {
          const { maxX, maxY } = bounds();
          const nx = Math.round(Math.min(Math.max(4, last.x), maxX));
          const ny = Math.round(Math.min(Math.max(0, last.y), maxY));
          setPos({ x: nx, y: ny });
          const map = loadPositions();
          savePositions({ ...map, [id]: { ...(map[id] || {}), x: nx, y: ny, rotation: stateRef.current.tilt } });
        }
      };

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
    },
    [canDrag, bumpZ, id, parentRef, bounds]
  );

  // gentle lift-and-tilt while dragging
  useEffect(() => {
    if (!dragging || !canDrag) return;
    setTilt(rotation + 1.6);
    const t = setInterval(() => {
      setTilt(rotation + (Math.random() * TAU > Math.PI ? 1.8 : 1.2));
    }, 260);
    return () => {
      clearInterval(t);
      setTilt(rotation);
    };
  }, [dragging, canDrag, rotation]);

  // re-clamp on resize
  useEffect(() => {
    const onResize = () => {
      const { maxX, maxY } = bounds();
      setPos((p) => {
        const next = { x: Math.min(p.x, maxX), y: Math.min(p.y, maxY) };
        return next.x === p.x && next.y === p.y ? p : next;
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [bounds]);

  const reset = useCallback(() => {
    setPos({ x, y });
    setTilt(rotation);
    const map = loadPositions();
    const next = { ...map };
    delete next[id];
    savePositions(next);
    setZIndex(z);
  }, [id, rotation, x, y, z]);

  // "drag me" hint until the user drags any note once
  const [hintDone, setHintDone] = useState(() => {
    try {
      return window.localStorage.getItem("lab-notes-hint") === "done";
    } catch {
      return true;
    }
  });

  const nudge = useCallback(
    (dx, dy) => {
      bumpZ();
      setPos((p) => {
        const { maxX, maxY } = bounds();
        const nx = Math.min(Math.max(4, p.x + dx), maxX);
        const ny = Math.min(Math.max(0, p.y + dy), maxY);
        const map = loadPositions();
        savePositions({
          ...map,
          [id]: { ...(map[id] || {}), x: nx, y: ny, rotation: stateRef.current.tilt },
        });
        return { x: nx, y: ny };
      });
    },
    [bounds, bumpZ, id]
  );

  const onKeyDown = useCallback(
    (e) => {
      if (!canDrag) return;
      const step = e.shiftKey ? 48 : 12;
      const dirs = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      };
      if (dirs[e.key]) {
        e.preventDefault();
        nudge(dirs[e.key][0], dirs[e.key][1]);
      } else if (e.key === "Escape") {
        reset();
      }
    },
    [canDrag, nudge, reset]
  );

  const dragHandlers = canDrag
    ? {
        onPointerDown: (e) => {
          if (!hintDone) {
            setHintDone(true);
            try {
              window.localStorage.setItem("lab-notes-hint", "done");
            } catch {
              /* ignore */
            }
          }
          onPointerDown(e);
        },
        onDoubleClick: reset,
      }
    : {};

  return (
    <aside
      ref={noteRef}
      className={`sticky-note note-${color}${dragging ? " dragging" : ""}${canDrag ? "" : " static"}`}
      style={{
        left: pos.x,
        top: pos.y,
        zIndex,
        maxWidth,
        transform: `rotate(${tilt}deg)`,
        transition: dragging ? "none" : "transform 0.25s ease, box-shadow 0.25s ease",
      }}
      {...dragHandlers}
      onKeyDown={onKeyDown}
      tabIndex={canDrag ? 0 : undefined}
      role={canDrag ? "button" : undefined}
      title={canDrag ? "drag me · arrow keys nudge · double-click or esc resets" : undefined}
      aria-label={title || "sticky note"}
    >
      {canDrag && !hintDone ? <span className="drag-hint">drag me ✎</span> : null}
      {canDrag ? <span className="note-pin" style={{ background: pinColor(color) }} /> : null}
      {lines.map((l, i) => (
        <div key={i}>– {l}</div>
      ))}
      <span className="note-fold" />
    </aside>
  );
}

function pinColor(color) {
  return { pink: "#b96f6f", butter: "#a98f2c", sage: "#5c6e50", paper: "#8a8378" }[color] || "#a98f2c";
}

export function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return coarse;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}
