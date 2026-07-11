import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

function seeded(seed) {
  const value = Math.sin(seed * 999.17) * 43758.5453123;
  return value - Math.floor(value);
}

function PaperSheet({ page }) {
  return (
    <motion.div
      initial={page.initial}
      animate={page.animate}
      transition={{
        duration: page.duration,
        delay: page.delay,
        ease: "easeInOut",
        times: [0, 0.32, 0.7, 1],
      }}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: page.width,
        height: page.height,
      }}
    >
      <motion.div
        animate={page.flutter}
        transition={{
          duration: page.duration * 0.92,
          delay: page.delay,
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: 2,
          clipPath: page.clipPath,
          background: `linear-gradient(180deg, ${page.paper}, rgba(226,226,222,0.68))`,
          boxShadow: `0 6px 16px ${page.shadow}`,
          filter: "blur(0.15px)",
          transformOrigin: "50% 50%",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.58,
            background:
              "repeating-linear-gradient(to bottom, transparent 0 5px, rgba(255,255,255,0.09) 5px 6px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "18%",
            left: "12%",
            width: "64%",
            height: 1,
            opacity: 0.72,
            background: page.line,
            boxShadow: `0 7px 0 ${page.line}, 0 14px 0 ${page.line}, 0 21px 0 ${page.line}`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function UnswirlingPages({ onComplete }) {
  const [isAnimating, setIsAnimating] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  const viewport = useMemo(() => {
    if (typeof window === "undefined") return { width: 1440, height: 900 };
    return { width: window.innerWidth, height: window.innerHeight };
  }, []);

  const pages = useMemo(
    () =>
      Array.from({ length: 44 }, (_, index) => {
        const sideBias = seeded(index + 2) > 0.5 ? 1 : -1;
        const startX = seeded(index + 4) * viewport.width;
        const startY = seeded(index + 7) * viewport.height - 120;
        const driftX =
          (seeded(index + 10) - 0.5) * 220 +
          sideBias * (40 + seeded(index + 12) * 60);
        const driftY = 180 + seeded(index + 14) * 260;
        const width = 18 + seeded(index + 16) * 34;
        const height = width * (1.22 + seeded(index + 18) * 0.24);
        const delay = seeded(index + 20) * 0.8;
        const duration = 2.2 + seeded(index + 22) * 1.2;
        const rotateA = -85 + seeded(index + 24) * 170;
        const rotateB = rotateA + (-25 + seeded(index + 26) * 50);
        const rotateC = rotateB + (-18 + seeded(index + 28) * 36);
        const gray = 205 + Math.floor(seeded(index + 30) * 32);
        const alpha = 0.72 + seeded(index + 32) * 0.22;

        return {
          id: index,
          width,
          height,
          delay,
          duration,
          paper: `rgba(${gray}, ${gray}, ${gray}, ${alpha})`,
          line: `rgba(255,255,255,${0.12 + seeded(index + 34) * 0.16})`,
          shadow: `rgba(0,0,0,${0.16 + seeded(index + 36) * 0.14})`,
          clipPath:
            seeded(index + 50) > 0.5
              ? "polygon(1% 0, 100% 2%, 98% 100%, 0 98%)"
              : "polygon(0 1%, 99% 0, 100% 98%, 2% 100%)",
          initial: {
            x: startX,
            y: startY,
            rotate: rotateA,
            scale: 0.82 + seeded(index + 38) * 0.26,
            opacity: 0,
          },
          animate: {
            x: [
              startX,
              startX + driftX * 0.4,
              startX + driftX,
              startX + driftX * 1.12,
            ],
            y: [
              startY,
              startY + driftY * 0.35,
              startY + driftY * 0.72,
              startY + driftY,
            ],
            rotate: [
              rotateA,
              rotateB,
              rotateC,
              rotateC + (-10 + seeded(index + 40) * 20),
            ],
            opacity: [0, 0.94, 0.88, 0],
            scale: [0.88, 1, 0.96, 0.9],
          },
          flutter: {
            rotateZ: [0, -2, 2, -1, 0],
            skewX: [0, 1.3, -1.4, 0.5, 0],
            skewY: [0, -1, 1, -0.4, 0],
            scaleX: [1, 0.985, 1.01, 0.995, 1],
          },
        };
      }),
    [viewport.height, viewport.width]
  );

  useEffect(() => {
    const total = prefersReducedMotion ? 220 : 3250;
    const timer = window.setTimeout(() => {
      setIsAnimating(false);
      window.setTimeout(onComplete, prefersReducedMotion ? 50 : 320);
    }, total);

    return () => window.clearTimeout(timer);
  }, [onComplete, prefersReducedMotion]);

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          key="paper-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.08 : 0.32 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            overflow: "hidden",
            background: "#070707",
            pointerEvents: "none",
          }}
        >
          <motion.div
            initial={{ opacity: 0.08, scale: 0.92 }}
            animate={{ opacity: [0.08, 0.18, 0], scale: [0.92, 1, 1.04] }}
            transition={{ duration: 2.8, times: [0, 0.6, 1], ease: "easeInOut" }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "34vw",
              minWidth: 280,
              aspectRatio: "1",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, rgba(162,116,60,0.14), rgba(162,116,60,0.05) 35%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />

          {!prefersReducedMotion &&
            pages.map((page) => <PaperSheet key={page.id} page={page} />)}

          {!prefersReducedMotion && (
            <motion.div
              initial={{
                x: viewport.width * 0.72,
                y: viewport.height * 0.18,
                rotate: 46,
                scale: 0.9,
                opacity: 0,
              }}
              animate={{
                x: [
                  viewport.width * 0.72,
                  viewport.width * 0.58,
                  viewport.width * 0.5,
                  viewport.width * 0.5,
                ],
                y: [
                  viewport.height * 0.18,
                  viewport.height * 0.34,
                  viewport.height * 0.48,
                  viewport.height * 0.5,
                ],
                rotate: [46, 22, 8, 0],
                scale: [0.9, 1.06, 1.1, 1],
                opacity: [0, 0, 1, 0],
              }}
              transition={{
                duration: 2.4,
                delay: 1.15,
                ease: [0.2, 0.7, 0.2, 1],
                times: [0, 0.25, 0.72, 1],
              }}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 110,
                height: 154,
                marginLeft: -55,
                marginTop: -77,
              }}
            >
              <motion.div
                animate={{ rotateZ: [0, -4, 3, 0], skewX: [0, 1.2, -0.8, 0] }}
                transition={{
                  duration: 2.1,
                  delay: 1.15,
                  ease: "easeInOut",
                  times: [0, 0.45, 0.75, 1],
                }}
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: 3,
                  background:
                    "linear-gradient(180deg, rgba(248,248,246,0.96), rgba(229,229,225,0.82))",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.28)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.62,
                    background:
                      "repeating-linear-gradient(to bottom, transparent 0 7px, rgba(180,180,180,0.12) 7px 8px)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "14%",
                    left: "11%",
                    width: "62%",
                    height: 1,
                    background: "rgba(255,255,255,0.22)",
                    boxShadow:
                      "0 9px 0 rgba(255,255,255,0.18), 0 18px 0 rgba(255,255,255,0.16), 0 27px 0 rgba(255,255,255,0.14)",
                  }}
                />
              </motion.div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{
              opacity: prefersReducedMotion ? 0 : [0, 0, 0.56, 0],
              scale: [0.92, 0.92, 1, 1.02],
            }}
            transition={{
              duration: 2.7,
              times: [0, 0.68, 0.86, 1],
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 118,
              height: 165,
              borderRadius: 3,
              transform: "translate(-50%, -50%)",
              background:
                "linear-gradient(90deg, #d9c39b, #f5ebd8 10%, #fff9ee 90%, #ccb78e)",
              border: "1px solid rgba(91,65,31,0.18)",
              boxShadow: "0 18px 36px rgba(0,0,0,0.4)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
