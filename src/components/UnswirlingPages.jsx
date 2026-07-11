import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

function seeded(seed) {
  const value = Math.sin(seed * 928.31) * 43758.5453;
  return value - Math.floor(value);
}

export default function UnswirlingPages({ onComplete }) {
  const [isAnimating, setIsAnimating] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  const pages = useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => {
        const angle = (index / 16) * Math.PI * 2 + seeded(index + 2) * 0.55;
        const radius = 330 + seeded(index + 5) * 240;
        const startX = Math.cos(angle) * radius;
        const startY = Math.sin(angle) * radius * 0.62;
        const tangentX = -Math.sin(angle);
        const tangentY = Math.cos(angle);
        const orbitStrength = 120 + seeded(index + 8) * 130;
        const midpointX = startX * 0.52 + tangentX * orbitStrength;
        const midpointY = startY * 0.52 + tangentY * orbitStrength * 0.62;
        const nearX = (seeded(index + 11) - 0.5) * 120;
        const nearY = (seeded(index + 14) - 0.5) * 90;
        const endX = (seeded(index + 17) - 0.5) * 26;
        const endY = (seeded(index + 20) - 0.5) * 20;
        const width = 82 + seeded(index + 23) * 28;
        const height = width * 1.42;
        const delay = index * 0.055 + seeded(index + 26) * 0.12;
        const duration = 2.35 + seeded(index + 29) * 0.48;
        const rotation = -22 + seeded(index + 32) * 44;
        const yaw = -18 + seeded(index + 35) * 36;

        return {
          id: index,
          width,
          height,
          delay,
          duration,
          paper: `hsl(${40 + seeded(index + 38) * 6} 34% ${93 + seeded(index + 41) * 3}%)`,
          edge: `hsl(38 20% ${78 + seeded(index + 44) * 7}%)`,
          ink: `rgba(78, 58, 34, ${0.11 + seeded(index + 47) * 0.07})`,
          initial: {
            x: startX,
            y: startY,
            z: -80 + seeded(index + 50) * 160,
            rotateX: -10 + seeded(index + 53) * 20,
            rotateY: yaw,
            rotateZ: rotation,
            scale: 0.78 + seeded(index + 56) * 0.15,
            opacity: 0,
            filter: "blur(1.5px)",
          },
          animate: {
            x: [startX, midpointX, nearX, endX],
            y: [startY, midpointY, nearY, endY],
            z: [-60, 10, 35, 0],
            rotateX: [-8, 4, -2, 0],
            rotateY: [yaw, yaw * 0.45, yaw * 0.12, 0],
            rotateZ: [rotation, rotation + 24, rotation + 10, 0],
            scale: [0.8, 0.94, 0.82, 0.62],
            opacity: [0, 0.92, 0.82, 0],
            filter: ["blur(1.5px)", "blur(0px)", "blur(0px)", "blur(0px)"],
          },
        };
      }),
    []
  );

  useEffect(() => {
    const total = prefersReducedMotion ? 400 : 3300;
    const timer = window.setTimeout(() => {
      setIsAnimating(false);
      window.setTimeout(onComplete, prefersReducedMotion ? 80 : 420);
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
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.42, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "grid",
            placeItems: "center",
            perspective: "1050px",
            background: "radial-gradient(circle at 50% 48%, rgba(76, 54, 30, 0.18), transparent 30%), #080605",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.14,
              backgroundImage: "radial-gradient(circle, rgba(214, 188, 137, 0.3) 0.7px, transparent 0.8px)",
              backgroundSize: "36px 36px",
            }}
          />

          <motion.div
            initial={{ opacity: 0.06, scale: 0.94 }}
            animate={{ opacity: [0.06, 0.2, 0], scale: [0.94, 1, 1.045] }}
            transition={{ duration: 3, times: [0, 0.58, 1], ease: "easeInOut" }}
            style={{
              position: "absolute",
              width: "28vw",
              minWidth: 300,
              aspectRatio: "1",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(227, 198, 142, 0.17), transparent 70%)",
              filter: "blur(20px)",
            }}
          />

          {!prefersReducedMotion && (
            <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
              {pages.map((page) => (
                <motion.div
                  key={page.id}
                  initial={page.initial}
                  animate={page.animate}
                  transition={{
                    duration: page.duration,
                    delay: page.delay,
                    times: [0, 0.38, 0.78, 1],
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
                    animate={{ skewY: [0, 1.2, -0.7, 0], scaleX: [1, 0.992, 1.006, 1] }}
                    transition={{
                      duration: page.duration,
                      delay: page.delay,
                      times: [0, 0.4, 0.76, 1],
                      ease: "easeInOut",
                    }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 2,
                      overflow: "hidden",
                      transformOrigin: "50% 50%",
                      background: `linear-gradient(96deg, ${page.edge} 0%, ${page.paper} 5%, ${page.paper} 94%, ${page.edge} 100%)`,
                      border: "1px solid rgba(89, 67, 40, 0.16)",
                      boxShadow: "0 11px 24px rgba(0,0,0,0.3), inset 5px 0 10px rgba(255,255,255,0.14), inset -4px 0 8px rgba(80,58,30,0.07)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "repeating-linear-gradient(to bottom, transparent 0 13px, rgba(104,78,45,0.065) 13px 14px)",
                        opacity: 0.66,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "12%",
                        left: "13%",
                        width: "52%",
                        height: 1.5,
                        background: page.ink,
                        boxShadow: `0 17px 0 ${page.ink}, 0 34px 0 ${page.ink}, 0 51px 0 ${page.ink}`,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: 14,
                        height: 14,
                        clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                        background: "linear-gradient(135deg, rgba(255,255,255,0.72), rgba(192,164,111,0.22))",
                        borderLeft: "1px solid rgba(95,70,38,0.1)",
                        borderBottom: "1px solid rgba(95,70,38,0.1)",
                      }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: prefersReducedMotion ? 0 : [0, 0, 0.7, 0], scale: [0.92, 0.92, 1, 1.015] }}
            transition={{ duration: 2.9, times: [0, 0.64, 0.84, 1], ease: "easeInOut" }}
            style={{
              position: "relative",
              width: 112,
              height: 160,
              borderRadius: 3,
              background: "linear-gradient(90deg, #d8c39c, #f4ead7 8%, #fff9eb 92%, #ceb98f)",
              border: "1px solid rgba(91,65,31,0.18)",
              boxShadow: "0 18px 36px rgba(0,0,0,0.46)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
