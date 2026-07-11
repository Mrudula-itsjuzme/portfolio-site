import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

function seeded(seed) {
  const value = Math.sin(seed * 971.41) * 43758.5453123;
  return value - Math.floor(value);
}

function ParchmentSheet({ page }) {
  return (
    <motion.div
      initial={page.initial}
      animate={page.animate}
      transition={{
        duration: page.duration,
        delay: page.delay,
        times: [0, 0.3, 0.68, 1],
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
        zIndex: page.zIndex,
      }}
    >
      <motion.div
        animate={{
          rotateX: [0, page.curl, -page.curl * 0.45, 0],
          skewX: [0, page.skew, -page.skew * 0.6, 0],
          scaleX: [1, 0.985, 1.008, 1],
        }}
        transition={{
          duration: page.duration,
          delay: page.delay,
          times: [0, 0.35, 0.72, 1],
          ease: "easeInOut",
        }}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          clipPath: page.clipPath,
          transformOrigin: "50% 45%",
          background: `linear-gradient(105deg, ${page.edge} 0%, ${page.paper} 7%, ${page.paperLight} 52%, ${page.paper} 91%, ${page.edge} 100%)`,
          border: "1px solid rgba(92, 60, 25, 0.24)",
          boxShadow:
            "0 14px 30px rgba(0,0,0,0.46), inset 8px 0 12px rgba(255,255,255,0.18), inset -7px 0 12px rgba(77,48,19,0.12)",
          filter: page.filter,
          backfaceVisibility: "visible",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.62,
            backgroundImage:
              "radial-gradient(circle at 18% 22%, rgba(122,76,27,0.12) 0 1px, transparent 1.3px), radial-gradient(circle at 72% 66%, rgba(122,76,27,0.09) 0 1px, transparent 1.2px)",
            backgroundSize: "24px 22px, 31px 29px",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "14%",
            left: "13%",
            width: "60%",
            height: 1,
            background: page.ink,
            boxShadow: `0 8px 0 ${page.ink}, 0 16px 0 ${page.ink}, 0 24px 0 ${page.ink}, 0 32px 0 ${page.ink}`,
            transform: `rotate(${page.inkTilt}deg)`,
            opacity: 0.78,
          }}
        />

        {page.hasSeal && (
          <div
            style={{
              position: "absolute",
              right: "10%",
              bottom: "12%",
              width: 11,
              height: 11,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%, #8f2c26 0 18%, #651b18 45%, #3e0e0d 100%)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
              opacity: 0.85,
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
            background:
              "linear-gradient(135deg, rgba(255,248,224,0.92), rgba(163,119,61,0.3))",
            borderLeft: "1px solid rgba(100,66,30,0.16)",
            borderBottom: "1px solid rgba(100,66,30,0.16)",
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

  const pages = useMemo(() => {
    const count = 34;

    return Array.from({ length: count }, (_, index) => {
      const startAngle = seeded(index + 2) * Math.PI * 2;
      const direction = index % 2 === 0 ? 1 : -1;
      const radiusX = viewport.width * (0.34 + seeded(index + 5) * 0.25);
      const radiusY = viewport.height * (0.26 + seeded(index + 8) * 0.26);
      const midAngle = startAngle + direction * (0.85 + seeded(index + 11) * 0.8);
      const nearAngle = midAngle + direction * (0.48 + seeded(index + 14) * 0.42);

      const startX = Math.cos(startAngle) * radiusX;
      const startY = Math.sin(startAngle) * radiusY;
      const midX = Math.cos(midAngle) * radiusX * 0.62;
      const midY = Math.sin(midAngle) * radiusY * 0.62;
      const nearX = Math.cos(nearAngle) * radiusX * 0.24;
      const nearY = Math.sin(nearAngle) * radiusY * 0.24;
      const endX = (seeded(index + 17) - 0.5) * 34;
      const endY = (seeded(index + 20) - 0.5) * 26;

      const width = 28 + seeded(index + 23) * 46;
      const height = width * (1.28 + seeded(index + 26) * 0.28);
      const delay = index * 0.025 + seeded(index + 29) * 0.45;
      const duration = 2.65 + seeded(index + 32) * 0.72;
      const rotation = -70 + seeded(index + 35) * 140;
      const yaw = -28 + seeded(index + 38) * 56;
      const depth = -180 + seeded(index + 41) * 440;
      const paperHue = 38 + seeded(index + 44) * 8;
      const paperLight = 86 + seeded(index + 47) * 8;

      return {
        id: index,
        width,
        height,
        delay,
        duration,
        curl: 4 + seeded(index + 50) * 8,
        skew: 1 + seeded(index + 53) * 2.4,
        fold: 9 + seeded(index + 56) * 9,
        zIndex: 10 + Math.floor(seeded(index + 59) * 30),
        hasSeal: seeded(index + 62) > 0.76,
        paper: `hsl(${paperHue} 42% ${paperLight}%)`,
        paperLight: `hsl(${paperHue + 2} 46% ${Math.min(paperLight + 5, 96)}%)`,
        edge: `hsl(${paperHue - 4} 30% ${Math.max(paperLight - 18, 66)}%)`,
        ink: `rgba(74, 43, 20, ${0.13 + seeded(index + 65) * 0.12})`,
        inkTilt: -1.4 + seeded(index + 68) * 2.8,
        filter: seeded(index + 71) > 0.84 ? "sepia(0.14) brightness(0.78)" : "sepia(0.08)",
        clipPath:
          seeded(index + 74) > 0.5
            ? "polygon(2% 0, 98% 1%, 100% 96%, 97% 100%, 1% 98%, 0 4%)"
            : "polygon(1% 2%, 96% 0, 100% 4%, 98% 99%, 3% 100%, 0 96%)",
        initial: {
          x: startX,
          y: startY,
          z: depth,
          rotateX: -18 + seeded(index + 77) * 36,
          rotateY: yaw,
          rotateZ: rotation,
          scale: 0.62 + seeded(index + 80) * 0.34,
          opacity: 0,
          filter: "blur(2.5px)",
        },
        animate: {
          x: [startX, midX, nearX, endX],
          y: [startY, midY, nearY, endY],
          z: [depth, depth * 0.4, 60, 0],
          rotateX: [-12, 7, -4, 0],
          rotateY: [yaw, yaw * 0.5, -yaw * 0.12, 0],
          rotateZ: [rotation, rotation + direction * 48, rotation + direction * 88, 0],
          scale: [0.68, 0.92, 1.04, 0.58],
          opacity: [0, 0.96, 0.9, 0],
          filter: ["blur(2.5px)", "blur(0px)", "blur(0px)", "blur(1px)"],
        },
      };
    });
  }, [viewport.height, viewport.width]);

  useEffect(() => {
    const total = prefersReducedMotion ? 260 : 3900;
    const timer = window.setTimeout(() => {
      setIsAnimating(false);
      window.setTimeout(onComplete, prefersReducedMotion ? 60 : 420);
    }, total);

    return () => window.clearTimeout(timer);
  }, [onComplete, prefersReducedMotion]);

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          key="enchanted-parchment-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.08 : 0.42, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            overflow: "hidden",
            perspective: "1250px",
            background:
              "radial-gradient(circle at 50% 48%, rgba(130,88,40,0.2), transparent 24%), radial-gradient(circle at 50% 50%, #14100d 0%, #090706 55%, #040303 100%)",
            pointerEvents: "none",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.28,
              backgroundImage:
                "radial-gradient(circle, rgba(238,204,132,0.5) 0 0.8px, transparent 1px)",
              backgroundSize: "31px 31px",
              maskImage: "radial-gradient(circle at center, black, transparent 72%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0.08, scale: 0.78 }}
            animate={{ opacity: [0.08, 0.34, 0.12, 0], scale: [0.78, 1, 1.12, 1.22] }}
            transition={{ duration: 3.5, times: [0, 0.45, 0.78, 1], ease: "easeInOut" }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "42vw",
              minWidth: 360,
              aspectRatio: "1",
              marginLeft: "-21vw",
              transform: "translateY(-50%)",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(241,194,105,0.25), rgba(137,88,33,0.09) 36%, transparent 70%)",
              filter: "blur(24px)",
            }}
          />

          {!prefersReducedMotion && pages.map((page) => <ParchmentSheet key={page.id} page={page} />)}

          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
            animate={{
              opacity: prefersReducedMotion ? 0 : [0, 0, 0.85, 0],
              scale: [0.6, 0.6, 1, 1.06],
              rotate: [-10, -10, 0, 0],
            }}
            transition={{ duration: 3.45, times: [0, 0.62, 0.82, 1], ease: "easeInOut" }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 126,
              height: 178,
              marginLeft: -63,
              marginTop: -89,
              borderRadius: 3,
              background:
                "linear-gradient(102deg, #9f7742 0%, #e5cc99 8%, #f7e8c5 52%, #dbc18d 92%, #876334 100%)",
              border: "1px solid rgba(75,44,18,0.35)",
              boxShadow: "0 0 42px rgba(240,190,96,0.22), 0 22px 44px rgba(0,0,0,0.62)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
