import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

function seeded(seed) {
  const value = Math.sin(seed * 999.91) * 43758.5453;
  return value - Math.floor(value);
}

export default function UnswirlingPages({ onComplete }) {
  const [isAnimating, setIsAnimating] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  const pages = useMemo(() => {
    return Array.from({ length: 30 }, (_, index) => {
      const side = index % 2 === 0 ? -1 : 1;
      const spread = 180 + seeded(index + 2) * 620;
      const vertical = -320 + seeded(index + 5) * 640;
      const depth = -520 + seeded(index + 8) * 900;
      const width = 112 + seeded(index + 11) * 54;
      const height = width * (1.34 + seeded(index + 14) * 0.18);
      const delay = seeded(index + 17) * 0.65;
      const duration = 2.7 + seeded(index + 20) * 0.75;
      const curl = 5 + seeded(index + 23) * 9;
      const warm = 93 + seeded(index + 26) * 4;

      return {
        id: index,
        width,
        height,
        delay,
        duration,
        curl,
        paper: `hsl(42 36% ${warm}%)`,
        edge: `hsl(37 24% ${Math.max(warm - 12, 72)}%)`,
        ink: `rgba(80, 59, 34, ${0.1 + seeded(index + 29) * 0.08})`,
        initial: {
          x: side * spread,
          y: vertical,
          z: depth,
          rotateX: -38 + seeded(index + 32) * 76,
          rotateY: side * (36 + seeded(index + 35) * 78),
          rotateZ: -34 + seeded(index + 38) * 68,
          scale: 0.72 + seeded(index + 41) * 0.42,
          opacity: 0,
          filter: "blur(3px)",
        },
        animate: {
          x: [side * spread, side * spread * 0.62, side * 110, 0],
          y: [vertical, vertical * 0.72, vertical * 0.2, 0],
          z: [depth, depth * 0.5, 120, 0],
          rotateX: [
            -38 + seeded(index + 32) * 76,
            18 * side,
            -8 * side,
            0,
          ],
          rotateY: [
            side * (36 + seeded(index + 35) * 78),
            side * 42,
            side * 14,
            0,
          ],
          rotateZ: [
            -34 + seeded(index + 38) * 68,
            16 * side,
            -5 * side,
            0,
          ],
          scale: [0.78, 1.02, 0.9, 0.72],
          opacity: [0, 1, 1, index < 8 ? 0.95 : 0],
          filter: ["blur(3px)", "blur(0px)", "blur(0px)", "blur(0px)"],
        },
      };
    });
  }, []);

  useEffect(() => {
    const total = prefersReducedMotion ? 500 : 3900;
    const timer = window.setTimeout(() => {
      setIsAnimating(false);
      window.setTimeout(onComplete, prefersReducedMotion ? 100 : 550);
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
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.55, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "grid",
            placeItems: "center",
            perspective: "1500px",
            background:
              "radial-gradient(circle at 50% 46%, rgba(74, 53, 28, 0.2), transparent 28%), #080605",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.2,
              backgroundImage:
                "radial-gradient(circle, rgba(214, 188, 137, 0.32) 0.7px, transparent 0.8px)",
              backgroundSize: "34px 34px",
            }}
          />

          <motion.div
            initial={{ scale: 0.94, opacity: 0.2 }}
            animate={{ scale: [0.94, 1, 1.035], opacity: [0.2, 0.44, 0] }}
            transition={{ duration: 3.4, times: [0, 0.48, 1], ease: "easeInOut" }}
            style={{
              position: "absolute",
              width: "34vw",
              minWidth: 360,
              aspectRatio: "1",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(225, 196, 139, 0.18), transparent 68%)",
              filter: "blur(18px)",
            }}
          />

          {!prefersReducedMotion && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                transformStyle: "preserve-3d",
              }}
            >
              {pages.map((page) => (
                <motion.div
                  key={page.id}
                  initial={page.initial}
                  animate={page.animate}
                  transition={{
                    duration: page.duration,
                    delay: page.delay,
                    times: [0, 0.34, 0.74, 1],
                    ease: [0.22, 0.61, 0.36, 1],
                  }}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: page.width,
                    height: page.height,
                    marginLeft: -page.width / 2,
                    marginTop: -page.height / 2,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <motion.div
                    animate={{ rotateX: [page.curl, -page.curl * 0.45, page.curl * 0.22, 0] }}
                    transition={{
                      duration: page.duration * 0.95,
                      delay: page.delay,
                      times: [0, 0.38, 0.76, 1],
                      ease: "easeInOut",
                    }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 2,
                      overflow: "hidden",
                      transformOrigin: "50% 0%",
                      background: `linear-gradient(100deg, ${page.edge} 0%, ${page.paper} 8%, ${page.paper} 88%, ${page.edge} 100%)`,
                      border: "1px solid rgba(90, 68, 39, 0.18)",
                      boxShadow:
                        "0 14px 32px rgba(0,0,0,0.42), inset 10px 0 18px rgba(255,255,255,0.18), inset -8px 0 14px rgba(77,55,29,0.1)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "repeating-linear-gradient(to bottom, transparent 0 14px, rgba(100,75,42,0.08) 14px 15px)",
                        opacity: 0.72,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "12%",
                        left: "12%",
                        width: "58%",
                        height: 2,
                        background: page.ink,
                        boxShadow: `0 18px 0 ${page.ink}, 0 36px 0 ${page.ink}, 0 54px 0 ${page.ink}`,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "7%",
                        right: "7%",
                        width: 18,
                        height: 18,
                        borderTop: "1px solid rgba(93,67,34,0.16)",
                        borderRight: "1px solid rgba(93,67,34,0.16)",
                        background: "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(194,167,116,0.28))",
                        clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 5,
                        background: "linear-gradient(to right, rgba(92,67,34,0.22), transparent)",
                      }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: prefersReducedMotion ? 0 : [0, 0, 0.9, 0], scale: [0.92, 0.92, 1, 1.03] }}
            transition={{ duration: 3.5, times: [0, 0.58, 0.78, 1], ease: "easeInOut" }}
            style={{
              position: "relative",
              width: 150,
              height: 210,
              borderRadius: 3,
              background: "linear-gradient(90deg, #d9c39b, #f3ead7 10%, #fff9eb 88%, #ceb98f)",
              border: "1px solid rgba(91,65,31,0.2)",
              boxShadow: "0 22px 48px rgba(0,0,0,0.58)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
