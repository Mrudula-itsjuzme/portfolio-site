import { useEffect, useRef, useState } from "react";

export default function DraggableScrap({
  initial,
  className = "",
  children,
  disabled = false,
}) {
  const [pos, setPos] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const [z, setZ] = useState(3);
  const drag = useRef(null);

  useEffect(() => {
    setPos(initial);
  }, [initial.x, initial.y, initial.r]);

  useEffect(() => {
    const move = (e) => {
      if (!drag.current) return;
      const nextX = e.clientX - drag.current.parentLeft - drag.current.dx;
      const nextY = e.clientY - drag.current.parentTop - drag.current.dy;
      setPos((p) => ({ ...p, x: nextX, y: nextY }));
    };

    const up = () => {
      if (!drag.current) return;
      drag.current = null;
      setDragging(false);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  const start = (e) => {
    if (disabled || e.button !== 0 || e.target.closest?.("a, button, video")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.offsetParent?.getBoundingClientRect?.() || { left: 0, top: 0 };
    drag.current = {
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
      parentLeft: parentRect.left,
      parentTop: parentRect.top,
    };
    setDragging(true);
    setZ((n) => n + 20);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  };

  return (
    <div
      className={"draggable-proof-scrap " + className + (dragging ? " is-dragging" : "")}
      onPointerDown={start}
      style={{
        left: pos.x,
        top: pos.y,
        zIndex: z,
        transform: `rotate(${pos.r || 0}deg)`,
      }}
    >
      {children}
    </div>
  );
}
