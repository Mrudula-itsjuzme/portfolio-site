import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

function rng(seed) {
  const v = Math.sin(seed * 997.31) * 43758.5453;
  return v - Math.floor(v);
}

let cssInjected = false;
function injectCSS(pages) {
  if (cssInjected) return;
  cssInjected = true;
  const rules = pages.map((p) => `
    @keyframes fly-${p.id} {
      0% { transform: translate(${p.x0}px, ${p.y0}px) rotate(${p.r0}deg) scale(.35); opacity: 0; }
      35% { opacity: .8; }
      100% { transform: translate(${p.x1}px, ${p.y1}px) rotate(${p.r1}deg) scale(.82); opacity: 0; }
    }
  `).join("\n");
  const style = document.createElement("style");
  style.textContent = rules;
  document.head.appendChild(style);
}

export default function UnswirlingPages({ onComplete }) {
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  const pages = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const angle = rng(i) * Math.PI * 2;
    const radius = 460 + rng(i + 1) * 180;
    return {
      id: i,
      x0: Math.round(Math.cos(angle) * radius),
      y0: Math.round(Math.sin(angle) * radius),
      x1: Math.round((rng(i + 2) - .5) * 180),
      y1: Math.round((rng(i + 3) - .5) * 140),
      r0: Math.round(-140 + rng(i + 4) * 280),
      r1: Math.round(-25 + rng(i + 5) * 50),
      delay: +(rng(i + 6) * .18).toFixed(2),
      w: Math.round(44 + rng(i + 7) * 38),
      h: Math.round(62 + rng(i + 8) * 46),
    };
  }), []);

  useEffect(() => {
    if (!reduceMotion) injectCSS(pages);
  }, [pages, reduceMotion]);

  useEffect(() => {
    const duration = reduceMotion ? 80 : 760;
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, duration);
    return () => clearTimeout(timer);
  }, [onComplete, reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="entrance"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : .18 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "grid",
            placeItems: "center",
            background: "#080605",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {!reduceMotion && pages.map((p) => (
            <div
              key={p.id}
              aria-hidden="true"
              style={{
                position: "absolute",
                width: p.w,
                height: p.h,
                background: "linear-gradient(108deg, #b99c6c, #efe1be 18%, #f7eccf 58%, #c6a778)",
                border: "1px solid rgba(92,56,24,.18)",
                boxShadow: "0 4px 14px rgba(0,0,0,.25)",
                animation: `fly-${p.id} .72s ${p.delay}s cubic-bezier(.22,1,.36,1) both`,
                willChange: "transform, opacity",
              }}
            />
          ))}

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : .12, duration: .28 }}
            style={{ position: "relative", zIndex: 2, textAlign: "center" }}
          >
            <p style={{ margin: "0 0 .35rem", fontFamily: "'Cinzel', serif", fontSize: ".58rem", letterSpacing: ".26em", textTransform: "uppercase", color: "rgba(224,196,132,.72)" }}>
              Portfolio Archive
            </p>
            <h1 style={{ margin: 0, fontFamily: "'Cinzel', serif", fontSize: "clamp(1.65rem, 4vw, 2.7rem)", color: "#ead6a1", letterSpacing: ".06em" }}>
              Mrudula
            </h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
