import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

function seeded(seed) {
  const value = Math.sin(seed * 997.31) * 43758.5453123;
  return value - Math.floor(value);
}

function Parchment({ page }) {
  return (
    <motion.div
      initial={page.initial}
      animate={page.animate}
      transition={{
        duration: page.duration,
        delay: page.delay,
        ease: "easeInOut",
        times: [0, 0.2, 0.78, 1],
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
        animate={{
          skewX: [0, page.flutter, -page.flutter * 0.65, page.flutter * 0.35, 0],
          skewY: [0, -page.flutter * 0.55, page.flutter * 0.4, 0],
          scaleX: [1, 0.975, 1.012, 0.992, 1],
          rotateX: [0, page.curl, -page.curl * 0.42, 0],
        }}
        transition={{
          duration: page.duration,
          delay: page.delay,
          ease: "easeInOut",
          times: [0, 0.24, 0.56, 0.8, 1],
        }}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          transformOrigin: "50% 45%",
          clipPath: page.clipPath,
          border: "1px solid rgba(92, 56, 24, 0.2)",
          borderRadius: 2,
          background: `linear-gradient(102deg, ${page.edge} 0%, ${page.paper} 7%, ${page.highlight} 52%, ${page.paper} 92%, ${page.edge} 100%)`,
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.38), inset 5px 0 10px rgba(255,255,255,0.18), inset -5px 0 10px rgba(75,43,17,0.1)",
          backfaceVisibility: "visible",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.45,
            backgroundImage:
              "radial-gradient(circle at 22% 18%, rgba(105,64,26,0.11) 0 0.8px, transparent 1px), radial-gradient(circle at 76% 68%, rgba(105,64,26,0.08) 0 0.7px, transparent 1px)",
            backgroundSize: "27px 25px, 31px 29px",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "13%",
            width: "62%",
            height: 1,
            background: page.ink,
            boxShadow: `0 8px 0 ${page.ink}, 0 16px 0 ${page.ink}, 0 24px 0 ${page.ink}, 0 32px 0 ${page.ink}`,
            opacity: 0.68,
          }}
        />

        {page.hasSeal && (
          <div
            style={{
              position: "absolute",
              right: "10%",
              bottom: "11%",
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%, #96342d 0 18%, #6d211c 48%, #43100e 100%)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
              opacity: 0.78,
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: page.fold,
            height: page.fold,
            clipPath: "polygon(0 0, 100% 0, 100% 100%)",
            background: "linear-gradient(135deg, rgba(255,248,224,0.88), rgba(164,119,59,0.26))",
            borderLeft: "1px solid rgba(100,66,30,0.12)",
            borderBottom: "1px solid rgba(100,66,30,0.12)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function UnswirlingPages({ onComplete }) {
  const [isAnimating, setIsAnimating] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  const pages = useMemo(
    () =>
      Array.from({ length: 46 }, (_, index) => {
        const angle = seeded(index + 2) * Math.PI * 2;
        const radius = 130 + seeded(index + 5) * 600;
        const initialZ = -950 - seeded(index + 8) * 850;
        const finalZ = 760 + seeded(index + 11) * 900;
        const direction = seeded(index + 14) > 0.5 ? 1 : -1;
        const width = 34 + seeded(index + 17) * 42;
        const height = width * (1.27 + seeded(index + 20) * 0.2);
        const startRotateX = seeded(index + 23) * 360;
        const startRotateY = seeded(index + 26) * 360;
        const startRotateZ = seeded(index + 29) * 360;
        const hue = 38 + seeded(index + 32) * 8;
        const light = 86 + seeded(index + 35) * 7;

        return {
          id: index,
          width,
          height,
          delay: seeded(index + 38) * 1.7,
          duration: 2.2 + seeded(index + 41) * 1.5,
          curl: 3 + seeded(index + 44) * 7,
          flutter: 1.2 + seeded(index + 47) * 2.6,
          fold: 7 + seeded(index + 50) * 8,
          hasSeal: seeded(index + 53) > 0.82,
          paper: `hsl(${hue} 39% ${light}%)`,
          highlight: `hsl(${hue + 2} 45% ${Math.min(light + 5, 96)}%)`,
          edge: `hsl(${hue - 4} 28% ${Math.max(light - 17, 66)}%)`,
          ink: `rgba(70, 42, 19, ${0.12 + seeded(index + 56) * 0.1})`,
          clipPath:
            seeded(index + 59) > 0.5
              ? "polygon(2% 0, 98% 1%, 100% 96%, 97% 100%, 1% 98%, 0 4%)"
              : "polygon(1% 2%, 96% 0, 100% 4%, 98% 99%, 3% 100%, 0 96%)",
          initial: {
            x: 0,
            y: 0,
            z: initialZ,
            rotateX: startRotateX,
            rotateY: startRotateY,
            rotateZ: startRotateZ,
            scale: 0.08,
            opacity: 0,
            filter: "blur(7px)",
          },
          animate: {
            x: Math.cos(angle) * radius * 3,
            y: Math.sin(angle) * radius * 3,
            z: finalZ,
            rotateX: startRotateX + 300 * direction,
            rotateY: startRotateY - 340 * direction,
            rotateZ: startRotateZ + 150 * direction,
            scale: 1.7 + seeded(index + 62) * 1.25,
            opacity: [0, 0.94, 0.9, 0],
            filter: ["blur(7px)", "blur(0px)", finalZ > 1200 ? "blur(2.5px)" : "blur(0px)"],
          },
        };
      }),
    []
  );

  useEffect(() => {
    const total = prefersReducedMotion ? 280 : 4500;
    const timer = window.setTimeout(() => {
      setIsAnimating(false);
      window.setTimeout(onComplete, prefersReducedMotion ? 60 : 700);
    }, total);

    return () => window.clearTimeout(timer);
  }, [onComplete, prefersReducedMotion]);

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          key="unswirling-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.08 : 0.7, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            perspective: "1200px",
            background:
              "radial-gradient(circle at 50% 48%, rgba(129,85,39,0.18), transparent 26%), #080605",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.3,
              backgroundImage:
                "radial-gradient(circle, rgba(213,179,115,0.34) 0 0.7px, transparent 0.9px)",
              backgroundSize: "38px 38px",
            }}
          />

          {!prefersReducedMotion && (
            <motion.div
              initial={{ z: -500 }}
              animate={{ z: 800 }}
              transition={{ duration: 2, delay: 3, ease: "easeIn" }}
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
              <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
                {pages.map((page) => (
                  <Parchment key={page.id} page={page} />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
