import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function UnswirlingPages({ onComplete }) {
  const [isAnimating, setIsAnimating] = useState(true);

  // ── Generate page data — same logic as the original working version ──────
  const pages = Array.from({ length: 50 }).map((_, i) => {
    const delay    = Math.random() * 2.0;
    const duration = 2.0 + Math.random() * 2.0;
    const angle    = Math.random() * 360;
    const radius   = 100 + Math.random() * 600;

    const initialZ       = -1000 - Math.random() * 800;
    const initialRotateX = Math.random() * 360;
    const initialRotateY = Math.random() * 360;
    const initialRotateZ = Math.random() * 360;

    const finalX = Math.cos(angle * (Math.PI / 180)) * radius * 3;
    const finalY = Math.sin(angle * (Math.PI / 180)) * radius * 3;
    const finalZ = 800 + Math.random() * 800;

    // ── Paper appearance ──────────────────────────────────────────────────
    const isDark     = Math.random() > 0.85;
    const hue        = 28 + Math.random() * 16;
    const lig        = isDark ? 10 + Math.random() * 8 : 87 + Math.random() * 9;
    const sat        = isDark ? 6 : 14 + Math.random() * 12;
    const baseColor  = `hsl(${hue},${sat}%,${lig}%)`;
    const lightColor = `hsl(${hue},${Math.max(sat-3,0)}%,${Math.min(lig+10,97)}%)`;
    const darkColor  = `hsl(${hue},${sat+4}%,${Math.max(lig-15,2)}%)`;
    const lineColor  = isDark
      ? `rgba(255,255,255,${0.07 + Math.random() * 0.07})`
      : `rgba(80,52,22,${0.13 + Math.random() * 0.13})`;

    // How much the page curls (cylindrical bend intensity)
    const bendDeg = 14 + Math.random() * 22;

    return {
      id: i,
      delay,
      duration,
      isDark,
      baseColor,
      lightColor,
      darkColor,
      lineColor,
      bendDeg,
      initial: {
        x: 0,
        y: 0,
        z: initialZ,
        rotateX: initialRotateX,
        rotateY: initialRotateY,
        rotateZ: initialRotateZ,
        scale: 0.1,
        opacity: 0,
        filter: "blur(8px)",
      },
      animate: {
        x: finalX,
        y: finalY,
        z: finalZ,
        rotateX: initialRotateX + 360 * (Math.random() > 0.5 ? 1 : -1),
        rotateY: initialRotateY + 360 * (Math.random() > 0.5 ? 1 : -1),
        rotateZ: initialRotateZ + 180,
        // Wind skew — makes the page wobble like it's catching air
        skewX: [0, 10, -5, 8, -5, 0],
        skewY: [0, -8, 5, -10, 5, 0],
        scale: 2.5 + Math.random() * 1.5,
        opacity: [0, 0.9, 0.9, 0],
        filter: ["blur(8px)", "blur(0px)", finalZ > 1000 ? "blur(4px)" : "blur(0px)"],
      },
    };
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(onComplete, 800);
    }, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          key="unswirling-container"
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
            perspective: "1200px",
            background: "#080605",
            overflow: "hidden",
          }}
        >
          {/* Ambient dust */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.4,
            backgroundImage: "radial-gradient(circle, rgba(200,175,120,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />

          {/* Camera push-in */}
          <motion.div
            initial={{ z: -500 }}
            animate={{ z: 800 }}
            transition={{ duration: 2.0, delay: 3.0, ease: "easeIn" }}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Pages */}
            <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
              {pages.map((p) => (
                <motion.div
                  key={p.id}
                  initial={p.initial}
                  animate={p.animate}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.8, 1],
                  }}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: "150px",
                    height: "220px",
                    marginLeft: "-75px",
                    marginTop: "-110px",
                    transformStyle: "preserve-3d",
                    // No background here — strips handle it
                  }}
                >
                  {/*
                    ── CYLINDRICAL BEND: 5 horizontal strips ──────────────────
                    Each strip has a different rotateX, forming a physical curve
                    like real paper bending in the wind. Strip 0=top bends back,
                    strip 2=middle is flat, strip 4=bottom bends forward.
                    This is ONLY a visual change — animation is identical to before.
                  */}
                  {[0, 1, 2, 3, 4].map((si) => {
                    const frac      = si / 4;                     // 0→1
                    const stripH    = 220 / 5;
                    // Sinusoidal bend: edges curve, middle stays flat
                    const bendAngle = p.bendDeg * Math.sin(frac * Math.PI) * (frac < 0.5 ? -1 : 1);
                    const light     = Math.sin(frac * Math.PI);   // 0 at edges, 1 center

                    return (
                      <div key={si} style={{
                        position:        "absolute",
                        left:            0,
                        top:             si * stripH,
                        width:           "150px",
                        height:          stripH + 0.5,
                        background:      frac < 0.5
                          ? `linear-gradient(to bottom, ${p.darkColor}, ${p.baseColor})`
                          : `linear-gradient(to bottom, ${p.baseColor}, ${p.darkColor})`,
                        filter:          `brightness(${0.8 + light * 0.3})`,
                        transformOrigin: "50% 0%",
                        transform:       `perspective(600px) rotateX(${bendAngle}deg)`,
                        overflow:        "hidden",
                        boxShadow:       si === 0
                          ? `0 -4px 12px rgba(0,0,0,0.3)`
                          : si === 4
                          ? `0 6px 18px rgba(0,0,0,0.4)`
                          : "none",
                      }}>
                        {/* Lateral shimmer — makes the cylinder look round */}
                        <div style={{
                          position:   "absolute",
                          inset:      0,
                          background: `linear-gradient(to right,
                            rgba(0,0,0,${0.08 - light * 0.04}),
                            rgba(255,255,255,${light * 0.08}),
                            rgba(0,0,0,${0.06 - light * 0.03}))`,
                          pointerEvents: "none",
                        }} />
                        {/* Manuscript line */}
                        <div style={{
                          position:   "absolute",
                          top:        "38%",
                          left:       "10%",
                          width:      `${50 + si * 9}%`,
                          height:     "0.8px",
                          background: p.lineColor,
                          opacity:    0.4 + light * 0.35,
                        }} />
                      </div>
                    );
                  })}

                  {/* Right-edge glint */}
                  <div style={{
                    position:   "absolute",
                    top: 0, right: 0,
                    width:      "18%",
                    height:     "100%",
                    background: `linear-gradient(to left, ${p.lightColor}44, transparent)`,
                    pointerEvents: "none",
                  }} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
