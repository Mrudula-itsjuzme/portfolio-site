import { useCallback, useEffect, useRef, useState } from "react";

const SESSION_KEY = "mrudula-ink-session-v1";

export default function DoodleCanvas({ active, onClose }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#171512");
  const [brushSize, setBrushSize] = useState(4);
  const [reloadGhost, setReloadGhost] = useState(null);
  const lastPos = useRef({ x: 0, y: 0 });

  const persist = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      sessionStorage.setItem(SESSION_KEY, canvas.toDataURL("image/png"));
    } catch {}
  }, []);

  const sizeCanvas = useCallback((restore) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const snapshot = restore ? canvas.toDataURL("image/png") : null;
    canvas.width = window.innerWidth;
    canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
    if (snapshot) {
      const img = new Image();
      img.onload = () => canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src = snapshot;
    }
  }, []);

  useEffect(() => {
    let previous = null;
    try {
      previous = sessionStorage.getItem(SESSION_KEY);
      if (previous) {
        setReloadGhost(previous);
        sessionStorage.removeItem(SESSION_KEY);
      }
    } catch {}

    sizeCanvas(false);
    const onResize = () => sizeCanvas(true);
    window.addEventListener("resize", onResize);
    const observer = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const targetHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
          if (Math.abs(canvas.height - targetHeight) > 4) sizeCanvas(true);
        })
      : null;
    observer?.observe(document.body);
    return () => {
      window.removeEventListener("resize", onResize);
      observer?.disconnect();
    };
  }, [sizeCanvas]);

  useEffect(() => {
    if (!reloadGhost) return;
    const t = setTimeout(() => setReloadGhost(null), 980);
    return () => clearTimeout(t);
  }, [reloadGhost]);

  const point = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDraw = useCallback((e) => {
    if (!active || e.button !== 0) return;
    e.preventDefault();
    setDrawing(true);
    lastPos.current = point(e);
  }, [active]);

  const draw = useCallback((e) => {
    if (!active || !drawing || !canvasRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const current = point(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(current.x, current.y);
    ctx.stroke();
    lastPos.current = current;
  }, [active, drawing, color, brushSize]);

  const stopDraw = useCallback(() => {
    if (drawing) persist();
    setDrawing(false);
  }, [drawing, persist]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.classList.remove("eraser-wipe-now");
    void canvas.offsetWidth;
    canvas.classList.add("eraser-wipe-now");
    setTimeout(() => {
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      canvas.classList.remove("eraser-wipe-now");
      try { sessionStorage.removeItem(SESSION_KEY); } catch {}
    }, 620);
  }, []);

  return (
    <>
      {reloadGhost ? (
        <div className="reload-erase-layer" aria-hidden="true">
          <img src={reloadGhost} alt="" />
          <span className="reload-eraser">ERASE</span>
        </div>
      ) : null}

      <div className={"doodle-canvas-wrapper" + (active ? " active" : "")} aria-hidden={!active}>
        {active ? (
          <div className="doodle-toolbar">
            <span className="doodle-tool-label">ink mode</span>
            <div className="doodle-colors" aria-label="ink colors">
              {["#171512", "#7a8f5a", "#c98f6b", "#79c7c5", "#e6a6a6"].map((ink) => (
                <button
                  type="button"
                  aria-label={"ink " + ink}
                  key={ink}
                  className={"color-dot " + (color === ink ? "selected" : "")}
                  style={{ background: ink }}
                  onClick={() => setColor(ink)}
                />
              ))}
            </div>
            <div className="brush-sizes">
              {[2, 4, 9].map((s) => (
                <button
                  type="button"
                  key={s}
                  className={"size-btn " + (brushSize === s ? "selected" : "")}
                  onClick={() => setBrushSize(s)}
                >
                  {s === 2 ? "fine" : s === 4 ? "pen" : "marker"}
                </button>
              ))}
            </div>
            <button type="button" className="doodle-action-btn" onClick={clearCanvas}>erase</button>
            <button type="button" className="doodle-action-btn close" onClick={() => { persist(); onClose(); }}>done</button>
          </div>
        ) : null}

        <canvas
          ref={canvasRef}
          className="doodle-canvas"
          onPointerDown={startDraw}
          onPointerMove={draw}
          onPointerUp={stopDraw}
          onPointerCancel={stopDraw}
          onPointerLeave={stopDraw}
        />
      </div>
    </>
  );
}
