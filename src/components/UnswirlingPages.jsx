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
      Array.from({ length: 18 }, (_, index) => {
        const side = index % 2 === 0 ? -1 : 1;
        const angle = -1.15 + seeded(index + 4) * 2.3;
        const radius = 260 + seeded(index + 7) * 360;
        const startX = Math.cos(angle) * radius * side;
        const startY = Math.sin(angle) * radius * 0.7;
        const width = 86 + seeded(index + 10) * 34;
        const height = width * 1.42;
        const delay = seeded(index + 13) * 0.42;
        const duration = 2.45 + seeded(index + 16) * 0.55;
        const initialTilt = -18 + seeded(index + 19) * 36;
        const initialYaw = side * (12 + seeded(index + 22) * 24);
        const orbit = side * (56 + seeded(index + 25) * 48);

        return {
          id: index,
          width,
          height,
          delay,
          duration,
          paper: `hsl(${40 + seeded(index + 28) * 6} 34% ${93 + seeded(index + 31) * 3}%)`,
          edge: `hsl(38 20% ${78 + seeded(index + 34) * 7}%)`,
          ink: `rgba(78, 58, 34, ${0.12 + seeded(index + 37) * 0.08})`,
          initial: {
            x: startX,
            y: startY,
            z: -140 + seeded(index + 40) * 260,
            rotateX: initialTilt,
            rotateY: initialYaw,
            rotateZ: -22 + seeded(index + 43) * 44,
            scale: 0.8 + seeded(index + 46) * 0.2,
            opacity: 0,
            filter: "blur(2px)",
          },
          animate: {
            x: [startX, startX * 0.7 + orbit, startX * 0.28, 0],
            y: [startY, startY * 0.55 - orbit * 0.22, startY * 0.18, 0],
            z: [-120, -40, 40, 0],
            rotateX: [initialTilt, initialTilt * 0.4, -4, 0],
            rotateY: [initialYaw, initialYaw * 0.55, side * 6, 0],
            rotateZ: [-22 + seeded(index + 43) * 44, side * 18, side * 5, 0],
            scale: [0.84, 1, 0.9, 0.72],
            opacity: [0, 0.96, 0.96, 0],
            filter: ["blur(2px)", "blur(0px)", "blur(0px)", "blur(0px)"],
          },
        };
      }),
    []
  );

  useEffect(() => {
    const total = prefersReducedMotion ? 450 : 3400;
    const timer = window.setTimeout(() => {
      setIsAnimating(false);
      window.setTimeout(onComplete, prefersReducedMotion ? 80 : 450);
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
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.45, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "grid",
            placeItems: "center",
            perspective: "1100px",
            background:
              "radial-gradient(circle at 50% 48%, rgba(76, 54, 30, 0.18), transparent 30%), #080605",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.16,
              backgroundImage:
                "radial-gradient(circle, rgba(214, 188, 137, 0.3) 0.7px, transparent 0.8px)",
              backgroundSize: "36px 36px",
            }}
          />

          <motion.div
            initial={{ opacity: 0.08, scale: 0.94 }}
            animate={{ opacity: [0.08, 0.24, 0], scale: [0.94, 1, 1.04] }}
            transition={{ duration: 3, times: [0, 0.55, 1], ease: "easeInOut" }}
            style={{
              position: "absolute",
              width: "30vw",
              minWidth: 320,
              aspectRatio: "1",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(227, 198, 142, 0.18), transparent 70%)",
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
                    times: [0, 0.36, 0.76, 1],
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
                    animate={{ skewY: [0, 1.8, -1.2, 0], scaleX: [1, 0.985, 1.01, 1] }}
                    transition={{
                      duration: page.duration,
                      delay: page.delay,
                      times: [0, 0.38, 0.75, 1],
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
                      boxShadow:
                        "0 12px 28px rgba(0,0,0,0.34), inset 6px 0 12px rgba(255,255,255,0.16), inset -5px 0 10px rgba(80,58,30,0.08)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "repeating-linear-gradient(to bottom, transparent 0 13px, rgba(104,78,45,0.07) 13px 14px)",
                        opacity: 0.7,
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
                        width: 16,
                        height: 16,
                        clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                        background: "linear-gradient(135deg, rgba(255,255,255,0.75), rgba(192,164,111,0.26))",
                        borderLeft: "1px solid rgba(95,70,38,0.12)",
                        borderBottom: "1px solid rgba(95,70,38,0.12)",
                      }}
                    />

                    <div
                      style={{
                        position: "absolute",
                        inset: "auto 0 0 0",
                        height: 3,
                        background: "linear-gradient(to bottom, transparent, rgba(86,63,35,0.16))",
                      }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: prefersReducedMotion ? 0 : [0, 0, 0.8, 0], scale: [0.92, 0.92, 1, 1.02] }}
            transition={{ duration: 3, times: [0, 0.62, 0.82, 1], ease: "easeInOut" }}
            style={{
              position: "relative",
              width: 118,
              height: 168,
              borderRadius: 3,
              background: "linear-gradient(90deg, #d8c39c, #f4ead7 8%, #fff9eb 92%, #ceb98f)",
              border: "1px solid rgba(91,65,31,0.18)",
              boxShadow: "0 18px 38px rgba(0,0,0,0.5)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
