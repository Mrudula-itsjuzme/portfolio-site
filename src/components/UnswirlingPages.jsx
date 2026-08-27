import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

function seeded(seed) {
  const v = Math.sin(seed * 997.31) * 43758.5453123;
  return v - Math.floor(v);
}

// A single parchment page flying through the air
function FlyingPage({ page, phase }) {
  const isSettling = phase === "settling";

  return (
    <motion.div
      initial={page.initial}
      animate={isSettling ? page.settled : page.flying}
      transition={
        isSettling
          ? { duration: 0.8 + page.settleDuration, delay: page.settleDelay, ease: [0.2, 1, 0.4, 1] }
          : { duration: page.flyDuration, delay: page.flyDelay, ease: "linear", repeat: Infinity, repeatType: "mirror" }
      }
      style={{
        position: "absolute",
        width: page.w,
        height: page.h,
        left: "50%",
        top: "50%",
        marginLeft: -page.w / 2,
        marginTop: -page.h / 2,
        pointerEvents: "none",
        willChange: "transform, opacity",
      }}
    >
      {/* Page surface */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(${page.angle}deg, ${page.edge} 0%, ${page.paper} 8%, ${page.highlight} 50%, ${page.paper} 90%, ${page.edge} 100%)`,
          border: "1px solid rgba(92,56,24,0.18)",
          borderRadius: 1,
          boxShadow: "0 4px 18px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,248,228,0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ink lines */}
        <div style={{
          position: "absolute",
          top: "18%", left: "12%", right: "12%",
          display: "flex", flexDirection: "column", gap: "12%",
          opacity: 0.28,
        }}>
          {Array.from({ length: page.lines }).map((_, i) => (
            <div key={i} style={{
              height: 1,
              background: "rgba(60,35,14,0.7)",
              width: `${70 + seeded(page.seed + i) * 25}%`,
            }} />
          ))}
        </div>

        {/* Corner fold */}
        <div style={{
          position: "absolute",
          top: 0, right: 0,
          width: page.fold, height: page.fold,
          background: "linear-gradient(135deg, rgba(255,248,224,0.9), rgba(160,115,55,0.2))",
          clipPath: "polygon(0 0, 100% 0, 100% 100%)",
        }} />

        {/* Wax seal on some pages */}
        {page.hasSeal && (
          <div style={{
            position: "absolute",
            bottom: "12%", right: "10%",
            width: 10, height: 10,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, #9b3228 0 18%, #6d211c 48%, #43100e 100%)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
          }} />
        )}

        {/* Parchment texture overlay */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.2,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Ccircle cx='1' cy='1' r='0.5' fill='%235c3810' opacity='0.3'/%3E%3C/svg%3E\")",
          backgroundSize: "6px 6px",
        }} />
      </div>
    </motion.div>
  );
}

function TitleCard({ phase }) {
  const show = phase === "settling" || phase === "reveal";
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="title"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.2, 1, 0.4, 1] }}
          style={{
            position: "absolute",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.7rem",
            pointerEvents: "none",
          }}
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: 0.7, letterSpacing: "0.28em" }}
            transition={{ duration: 1.4, delay: 0.8 }}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.62rem",
              color: "rgba(210,180,120,0.8)",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            ✦ &nbsp; Portfolio Archive &nbsp; ✦
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, filter: "blur(12px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.4, delay: 1.0 }}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              color: "#ead2a0",
              letterSpacing: "0.08em",
              textAlign: "center",
              margin: 0,
              textShadow: "0 2px 0 #2a1408, 0 0 40px rgba(220,166,76,0.4)",
              background: "linear-gradient(135deg, #e8d090 0%, #f5e8b8 40%, #c8a850 70%, #e8d090 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Mrudula's Archive
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.0, delay: 1.4 }}
            style={{
              width: "280px",
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(210,180,100,0.7), transparent)",
            }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            transition={{ duration: 1.0, delay: 1.6 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: "1.05rem",
              color: "rgba(228,205,148,0.7)",
              margin: 0,
            }}
          >
            Entering the library…
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function UnswirlingPages({ onComplete }) {
  // phase: "storm" → pages fly chaotically
  //        "settling" → pages float away, title appears
  //        "done"
  const [phase, setPhase] = useState("storm");
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      const t = setTimeout(onComplete, 400);
      return () => clearTimeout(t);
    }

    const t1 = setTimeout(() => setPhase("settling"), 2200);
    const t2 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 4200);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete, prefersReducedMotion]);

  // Generate pages — they each start outside the viewport and fly through
  const pages = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => {
      const angle = seeded(i) * Math.PI * 2;
      const spawnRadius = 900 + seeded(i + 1) * 500;
      const startX = Math.cos(angle) * spawnRadius;
      const startY = Math.sin(angle) * spawnRadius;

      // Flying path: each page carves an arc across the screen
      const midAngle = angle + (seeded(i + 2) - 0.5) * 1.5;
      const midRadius = 180 + seeded(i + 3) * 340;
      const midX = Math.cos(midAngle) * midRadius;
      const midY = Math.sin(midAngle) * midRadius;

      const endAngle = angle + Math.PI + (seeded(i + 4) - 0.5) * 1.2;
      const endRadius = 700 + seeded(i + 5) * 600;
      const endX = Math.cos(endAngle) * endRadius;
      const endY = Math.sin(endAngle) * endRadius;

      const w = 52 + seeded(i + 6) * 60;
      const h = w * (1.3 + seeded(i + 7) * 0.2);
      const hue = 36 + seeded(i + 8) * 10;
      const light = 80 + seeded(i + 9) * 10;

      return {
        id: i,
        w, h,
        seed: seeded(i + 50),
        lines: 3 + Math.floor(seeded(i + 10) * 4),
        angle: 90 + seeded(i + 11) * 30,
        fold: 8 + seeded(i + 12) * 7,
        hasSeal: seeded(i + 13) > 0.8,
        paper: `hsl(${hue} 40% ${light}%)`,
        highlight: `hsl(${hue + 2} 46% ${Math.min(light + 6, 96)}%)`,
        edge: `hsl(${hue - 4} 30% ${Math.max(light - 20, 60)}%)`,
        flyDelay: seeded(i + 14) * 0.6,
        flyDuration: 1.4 + seeded(i + 15) * 1.2,
        settleDuration: seeded(i + 16) * 0.6,
        settleDelay: seeded(i + 17) * 0.5,
        initial: {
          x: startX,
          y: startY,
          rotateX: -40 + seeded(i + 18) * 80,
          rotateY: -50 + seeded(i + 19) * 100,
          rotateZ: -180 + seeded(i + 20) * 360,
          opacity: 0,
          scale: 0.3,
        },
        flying: {
          x: [startX, midX, endX],
          y: [startY, midY, endY],
          rotateX: [-40 + seeded(i + 18) * 80, seeded(i + 21) * 60 - 30, seeded(i + 22) * 80 - 40],
          rotateY: [-50 + seeded(i + 19) * 100, seeded(i + 23) * 80 - 40, seeded(i + 24) * 100 - 50],
          rotateZ: [-180 + seeded(i + 20) * 360, seeded(i + 25) * 360 - 180, seeded(i + 26) * 360 - 180],
          opacity: [0, 0.85, 0.85],
          scale: [0.3, 0.7 + seeded(i + 27) * 0.6, 0.5],
        },
        settled: {
          x: endX * 1.5,
          y: endY * 1.5,
          rotateX: seeded(i + 28) * 30 - 15,
          rotateY: seeded(i + 29) * 40 - 20,
          rotateZ: seeded(i + 30) * 720,
          opacity: 0,
          scale: 0.2,
        },
      };
    });
  }, []);

  if (prefersReducedMotion) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{ position: "fixed", inset: 0, zIndex: 100, background: "#080605" }}
      />
    );
  }

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="paper-storm"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            perspective: "1400px",
            background: "radial-gradient(circle at 50% 48%, rgba(100,65,30,0.25), transparent 32%), #080605",
            overflow: "hidden",
          }}
        >
          {/* Subtle dot texture */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.18,
            backgroundImage: "radial-gradient(circle, rgba(213,179,115,0.4) 0 0.7px, transparent 0.9px)",
            backgroundSize: "34px 34px",
            pointerEvents: "none",
          }} />

          {/* Warm ambient glow center */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "settling" ? 0.8 : 0.2 }}
            transition={{ duration: 1.5 }}
            style={{
              position: "absolute",
              width: "60vmin",
              height: "60vmin",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(220,170,80,0.25) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* The flying pages */}
          <div style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            pointerEvents: "none",
          }}>
            {pages.map((page) => (
              <FlyingPage key={page.id} page={page} phase={phase} />
            ))}
          </div>

          {/* Center title reveal */}
          <TitleCard phase={phase} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
