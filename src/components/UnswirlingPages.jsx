import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* Deterministic random */
function rng(seed) {
  const v = Math.sin(seed * 997.31) * 43758.5453;
  return v - Math.floor(v);
}

/* Inject CSS keyframes once */
let cssInjected = false;
function injectCSS(pages) {
  if (cssInjected) return;
  cssInjected = true;

  const rules = pages.map((p) => `
    @keyframes fly-${p.id} {
      0%   { transform: translate(${p.x0}px, ${p.y0}px) rotate(${p.r0}deg) scale(${p.s0}); opacity: 0; }
      15%  { opacity: 0.9; }
      50%  { transform: translate(${p.x1}px, ${p.y1}px) rotate(${p.r1}deg) scale(${p.s1}); opacity: 0.85; }
      85%  { opacity: 0.9; }
      100% { transform: translate(${p.x2}px, ${p.y2}px) rotate(${p.r2}deg) scale(${p.s2}); opacity: 0; }
    }
  `).join("\n");

  const style = document.createElement("style");
  style.textContent = rules;
  document.head.appendChild(style);
}

export default function UnswirlingPages({ onComplete }) {
  const [phase, setPhase] = useState("storm"); // "storm" | "reveal" | "done"

  /* Generate page data — pure data, no components */
  const pages = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => {
      const angle = rng(i) * Math.PI * 2;
      const spawnR = 700 + rng(i + 1) * 400;
      const x0 = Math.cos(angle) * spawnR;
      const y0 = Math.sin(angle) * spawnR;

      const midAngle = angle + (rng(i + 2) - 0.5) * 2;
      const midR = 120 + rng(i + 3) * 250;
      const x1 = Math.cos(midAngle) * midR;
      const y1 = Math.sin(midAngle) * midR;

      const exitAngle = angle + Math.PI + (rng(i + 4) - 0.5);
      const exitR = 600 + rng(i + 5) * 500;
      const x2 = Math.cos(exitAngle) * exitR;
      const y2 = Math.sin(exitAngle) * exitR;

      const w = 48 + rng(i + 6) * 52;
      const h = w * (1.28 + rng(i + 7) * 0.2);
      const hue = 36 + rng(i + 8) * 12;
      const light = 80 + rng(i + 9) * 10;
      const delay = rng(i + 10) * 0.8;
      const dur = 1.8 + rng(i + 11) * 1.2;

      return {
        id: i,
        w: Math.round(w),
        h: Math.round(h),
        paper: `hsl(${hue} 40% ${light}%)`,
        highlight: `hsl(${hue + 2} 46% ${Math.min(light + 6, 96)}%)`,
        edge: `hsl(${hue - 4} 30% ${Math.max(light - 22, 58)}%)`,
        fold: 8 + rng(i + 12) * 6,
        lines: 3 + Math.floor(rng(i + 13) * 3),
        hasSeal: rng(i + 14) > 0.78,
        x0: Math.round(x0), y0: Math.round(y0),
        x1: Math.round(x1), y1: Math.round(y1),
        x2: Math.round(x2), y2: Math.round(y2),
        r0: Math.round(-180 + rng(i + 15) * 360),
        r1: Math.round(-60 + rng(i + 16) * 120),
        r2: Math.round(-180 + rng(i + 17) * 360),
        s0: 0.3,
        s1: +(0.6 + rng(i + 18) * 0.5).toFixed(2),
        s2: 0.2,
        delay: +delay.toFixed(2),
        dur: +dur.toFixed(2),
      };
    });
  }, []);

  useEffect(() => {
    injectCSS(pages);
  }, [pages]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), 2000);
    const t2 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#080605",
            overflow: "hidden",
          }}
        >
          {/* Warm center glow — single div, no blur filter */}
          <motion.div
            animate={{ opacity: phase === "reveal" ? 1 : 0.15, scale: phase === "reveal" ? 1.4 : 1 }}
            transition={{ duration: 1.4 }}
            style={{
              position: "absolute",
              width: "55vmin",
              height: "55vmin",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(210,160,70,0.22) 0%, transparent 70%)",
              pointerEvents: "none",
              willChange: "opacity, transform",
            }}
          />

          {/* Flying pages — pure CSS animations, only translate+rotate (GPU only) */}
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}>
            {pages.map((p) => (
              <div
                key={p.id}
                style={{
                  position: "absolute",
                  width: p.w,
                  height: p.h,
                  animation: `fly-${p.id} ${p.dur}s ${p.delay}s ease-in-out infinite alternate`,
                  willChange: "transform, opacity",
                }}
              >
                {/* Page body */}
                <div style={{
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(108deg, ${p.edge} 0%, ${p.paper} 10%, ${p.highlight} 52%, ${p.paper} 90%, ${p.edge} 100%)`,
                  border: "1px solid rgba(92,56,24,0.2)",
                  borderRadius: 1,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  {/* Ink lines */}
                  {Array.from({ length: p.lines }).map((_, li) => (
                    <div key={li} style={{
                      position: "absolute",
                      height: 1,
                      background: "rgba(55,30,12,0.5)",
                      top: `${22 + li * 18}%`,
                      left: "10%",
                      width: `${55 + rng(p.id + li) * 30}%`,
                    }} />
                  ))}
                  {/* Corner fold */}
                  <div style={{
                    position: "absolute",
                    top: 0, right: 0,
                    width: p.fold, height: p.fold,
                    background: "linear-gradient(135deg, rgba(255,248,224,0.85), rgba(160,115,55,0.15))",
                    clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                  }} />
                  {/* Wax seal */}
                  {p.hasSeal && (
                    <div style={{
                      position: "absolute",
                      bottom: "10%", right: "10%",
                      width: 9, height: 9,
                      borderRadius: "50%",
                      background: "radial-gradient(circle at 35% 30%, #9b3228, #43100e)",
                    }} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Title reveal — only shows after storm settles */}
          <AnimatePresence>
            {phase === "reveal" && (
              <motion.div
                key="title"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.0, ease: [0.2, 1, 0.4, 1] }}
                style={{
                  position: "relative",
                  zIndex: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.6rem",
                  pointerEvents: "none",
                  textAlign: "center",
                }}
              >
                <p style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.6rem",
                  color: "rgba(210,180,120,0.75)",
                  textTransform: "uppercase",
                  letterSpacing: "0.3em",
                  margin: 0,
                }}>✦ &nbsp; Portfolio Archive &nbsp; ✦</p>

                <h1 style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(2rem, 5vw, 3.4rem)",
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: "0.08em",
                  background: "linear-gradient(135deg, #e8d090 0%, #f5e8b8 42%, #c8a850 70%, #e8d090 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "none",
                }}>Mrudula's Archive</h1>

                <div style={{
                  width: 240,
                  height: 1,
                  background: "linear-gradient(90deg, transparent, rgba(210,180,100,0.6), transparent)",
                }} />

                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: "1rem",
                  color: "rgba(228,205,148,0.65)",
                  margin: 0,
                }}>Entering the library…</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
