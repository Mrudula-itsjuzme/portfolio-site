import { useEffect, useRef, useState, useCallback } from "react";

export default function DoodleCanvas({ active, onClose }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#171512");
  const [brushSize, setBrushSize] = useState(3);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const temp = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = window.innerWidth;
      canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      ctx.putImageData(temp, 0, 0);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active]);

  const startDraw = useCallback((e) => {
    setDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    lastPos.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const draw = useCallback(
    (e) => {
      if (!drawing || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const currentX = clientX - rect.left;
      const currentY = clientY - rect.top;

      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();

      lastPos.current = { x: currentX, y: currentY };
    },
    [drawing, color, brushSize]
  );

  const stopDraw = useCallback(() => {
    setDrawing(false);
  }, []);

  const clearCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, []);

  if (!active) return null;

  return (
    <div className="doodle-canvas-wrapper">
      <div className="doodle-toolbar">
        <span className="doodle-tool-label">✏️ Draw on Desk</span>
        <div className="doodle-colors">
          {["#171512", "#7a8f5a", "#c98f6b", "#79c7c5", "#e6a6a6"].map((c) => (
            <button
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
              key={s}
              className={`size-btn ${brushSize === s ? "selected" : ""}`}
              onClick={() => setBrushSize(s)}
            >
              {s}px
            </button>
          ))}
        </div>
        <button className="doodle-action-btn" onClick={clearCanvas}>
          Clear 🗑️
        </button>
        <button className="doodle-action-btn close" onClick={onClose}>
          Done ✓
        </button>
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
