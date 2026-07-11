import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const PAGE_PATHS = [
  { x: ["-64vw", "-18vw", "12vw", "58vw"], y: ["30vh", "12vh", "-5vh", "-24vh"], r: [-18, -7, 8, 18], delay: 0.02, scale: [0.78, 0.92, 1.02, 0.84] },
  { x: ["62vw", "24vw", "-6vw", "-54vw"], y: ["-30vh", "-14vh", "8vh", "28vh"], r: [15, 7, -6, -17], delay: 0.16, scale: [0.72, 0.9, 1, 0.8] },
  { x: ["-58vw", "-28vw", "4vw", "52vw"], y: ["-18vh", "-4vh", "16vh", "34vh"], r: [22, 12, -4, -14], delay: 0.3, scale: [0.66, 0.86, 0.96, 0.76] },
  { x: ["54vw", "18vw", "-12vw", "-60vw"], y: ["26vh", "9vh", "-12vh", "-34vh"], r: [-20, -10, 5, 16], delay: 0.42, scale: [0.7, 0.9, 1.04, 0.82] },
  { x: ["-46vw", "-12vw", "18vw", "60vw"], y: ["42vh", "18vh", "-10vh", "-36vh"], r: [-10, -2, 11, 19], delay: 0.56, scale: [0.64, 0.82, 0.94, 0.72] },
  { x: ["48vw", "16vw", "-16vw", "-58vw"], y: ["-42vh", "-19vh", "7vh", "38vh"], r: [11, 4, -8, -18], delay: 0.68, scale: [0.68, 0.86, 1, 0.78] },
  { x: ["-52vw", "-20vw", "8vw", "56vw"], y: ["4vh", "-9vh", "3vh", "14vh"], r: [16, 6, -3, -12], delay: 0.82, scale: [0.58, 0.78, 0.9, 0.66] },
  { x: ["52vw", "20vw", "-10vw", "-56vw"], y: ["12vh", "-6vh", "2vh", "-16vh"], r: [-14, -5, 5, 13], delay: 0.94, scale: [0.6, 0.8, 0.92, 0.68] },
  { x: ["-40vw", "-8vw", "14vw", "46vw"], y: ["-36vh", "-15vh", "4vh", "24vh"], r: [8, 2, -5, -11], delay: 1.08, scale: [0.54, 0.74, 0.86, 0.62] },
];

function PaperSheet({ path, index }) {
  const width = 86 + (index % 3) * 12;
  const height = width * 1.42;
  const paper = `hsl(${40 + (index % 4) * 1.5} 34% ${94 - (index % 2)}%)`;
  const edge = `hsl(38 19% ${80 - (index % 3) * 2}%)`;
  const ink = `rgba(78, 58, 34, ${0.11 + (index % 3) * 0.025})`;

  return (
    <motion.div
      initial={{ x: path.x[0], y: path.y[0], rotateZ: path.r[0], rotateY: index % 2 ? -12 : 12, opacity: 0, scale: path.scale[0], filter: "blur(2px)" }}
      animate={{
        x: path.x,
        y: path.y,
        rotateZ: path.r,
        rotateY: [index % 2 ? -12 : 12, 0, index % 2 ? 7 : -7, 0],
        opacity: [0, 0.96, 0.92, 0],
        scale: path.scale,
        filter: ["blur(2px)", "blur(0px)", "blur(0px)", "blur(2px)"],
      }}
      transition={{ duration: 2.25, delay: path.delay, times: [0, 0.24, 0.74, 1], ease: [0.22, 0.61, 0.36, 1] }}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width,
        height,
        marginLeft: -width / 2,
        marginTop: -height / 2,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        animate={{ skewY: [0, 1.2, -0.8, 0], scaleX: [1, 0.992, 1.006, 1] }}
        transition={{ duration: 2.25, delay: path.delay, times: [0, 0.32, 0.7, 1], ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          borderRadius: 2,
          background: `linear-gradient(96deg, ${edge} 0%, ${paper} 5%, ${paper} 94%, ${edge} 100%)`,
          border: "1px solid rgba(89,67,40,0.15)",
          boxShadow: "0 12px 26px rgba(0,0,0,0.34), inset 5px 0 10px rgba(255,255,255,0.14), inset -4px 0 8px rgba(80,58,30,0.07)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.66,
            background: "repeating-linear-gradient(to bottom, transparent 0 13px, rgba(104,78,45,0.065) 13px 14px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "12%",
            left: "13%",
            width: "52%",
            height: 1.5,
            background: ink,
            boxShadow: `0 17px 0 ${ink}, 0 34px 0 ${ink}, 0 51px 0 ${ink}`,
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
            background: "linear-gradient(135deg, rgba(255,255,255,0.74), rgba(192,164,111,0.22))",
            borderLeft: "1px solid rgba(95,70,38,0.1)",
            borderBottom: "1px solid rgba(95,70,38,0.1)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function UnswirlingPages({ onComplete }) {
  const [isAnimating, setIsAnimating] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const paths = useMemo(() => PAGE_PATHS, []);

  useEffect(() => {
    const total = prefersReducedMotion ? 350 : 3350;
    const timer = window.setTimeout(() => {
      setIsAnimating(false);
      window.setTimeout(onComplete, prefersReducedMotion ? 70 : 420);
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
            overflow: "hidden",
            perspective: "1100px",
            background: "radial-gradient(circle at 50% 50%, rgba(78,55,30,0.2), transparent 34%), #080605",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.12,
              backgroundImage: "radial-gradient(circle, rgba(214,188,137,0.28) 0.7px, transparent 0.8px)",
              backgroundSize: "36px 36px",
            }}
          />

          {!prefersReducedMotion && paths.map((path, index) => <PaperSheet key={index} path={path} index={index} />)}

          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: prefersReducedMotion ? 0 : [0, 0, 0.38, 0], scale: [0.7, 0.7, 1, 1.14] }}
            transition={{ duration: 3.05, times: [0, 0.56, 0.82, 1], ease: "easeInOut" }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 220,
              height: 220,
              marginLeft: -110,
              marginTop: -110,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(236,210,158,0.2), transparent 70%)",
              filter: "blur(14px)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
