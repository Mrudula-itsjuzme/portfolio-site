import { useEffect, useRef, useState, useCallback } from "react";

const DOODLE_KEY = "mrudula-doodle-canvas-v1";

export default function DoodleCanvas({ active, onClose }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#171512");
  const [brushSize, setBrushSize] = useState(3);
  const lastPos = useRef({ x: 0, y: 0 });

  const saveCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      localStorage.setItem(DOODLE_KEY, canvas.toDataURL("image/png"));
    } catch {
      /* browser storage can fail; drawing still works for the session */
    }
  }, []);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);

    try {
      const saved = localStorage.getItem(DOODLE_KEY);
      if (saved) {
        const img = new Image();
        img.onload = () => canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        img.src = saved;
      }
    } catch {
      /* no saved doodles */
    }

    const onResize = () => {
      const snapshot = canvas.toDataURL("image/png");
      canvas.width = window.innerWidth;
      canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      const img = new Image();
      img.onload = () => canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src = snapshot;
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active]);

  const point = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches?.[0];
    return {
      x: (touch ? touch.clientX : e.clientX) - rect.left,
      y: (touch ? touch.clientY : e.clientY) - rect.top,
    };
  };

  const startDraw = useCallback((e) => {
    e.preventDefault();
    setDrawing(true);
    lastPos.current = point(e);
  }, []);

  const draw = useCallback((e) => {
    if (!drawing || !canvasRef.current) return;
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
  }, [drawing, color, brushSize]);

  const stopDraw = useCallback(() => {
    if (drawing) saveCanvas();
    setDrawing(false);
  }, [drawing, saveCanvas]);

  const clearCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    try { localStorage.removeItem(DOODLE_KEY); } catch {}
  }, []);

  if (!active) return null;

  return (
    <div className="doodle-canvas-wrapper">
      <div className="doodle-toolbar">
        <span className="doodle-tool-label">draw on everything ✎</span>
        <div className="doodle-colors" aria-label="ink colors">
          {["#171512", "#7a8f5a", "#c98f6b", "#79c7c5", "#e6a6a6"].map((c) => (
            <button
              type="button"
              aria-label={"ink " + c}
              key={c}
              className={`color-dot ${color === c ? "selected" : ""}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <div className="brush-sizes">
          {[2, 4, 8].map((s) => (
            <button
              type="button"
              key={s}
              className={`size-btn ${brushSize === s ? "selected" : ""}`}
              onClick={() => setBrushSize(s)}
            >
              {s === 2 ? "tiny" : s === 4 ? "pen" : "chaos"}
            </button>
          ))}
        </div>
        <button type="button" className="doodle-action-btn" onClick={clearCanvas}>erase</button>
        <button type="button" className="doodle-action-btn close" onClick={() => { saveCanvas(); onClose(); }}>done ✓</button>
      </div>

      <canvas
        ref={canvasRef}
        className="doodle-canvas"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
    </div>
  );
}
