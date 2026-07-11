import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

function seeded(seed) {
  const value = Math.sin(seed * 997.31) * 43758.5453123;
  return value - Math.floor(value);
}

function Parchment({ page }) {
  const cols = 5;
  const rows = 4;

  const cells = useMemo(
    () =>
      Array.from({ length: rows * cols }, (_, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const nx = col / (cols - 1);
        const ny = row / (rows - 1);
        const edgeX = Math.abs(nx - 0.5) * 2;
        const edgeY = Math.abs(ny - 0.5) * 2;
        const edgeFactor = Math.max(edgeX, edgeY);
        const cornerFactor =
          (col === 0 || col === cols - 1) &&
          (row === 0 || row === rows - 1)
            ? 1
            : 0;
        const phase = nx * 0.58 + ny * 0.37 + page.seed * 0.22;

        return {
          key: `${row}-${col}`,
          row,
          col,
          nx,
          ny,
          edgeFactor,
          cornerFactor,
          phase,
          bendX: (edgeFactor * 2.2 + cornerFactor * 1.4) * page.flex,
          bendY: (edgeFactor * 1.6 + cornerFactor) * page.flex,
          flutter: (0.5 + edgeFactor * 1.1 + cornerFactor * 0.9) * page.flutter,
          airflowDelay: nx * 0.075 + ny * 0.025,
        };
      }),
    [page.flex, page.flutter, page.seed]
  );

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
        filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.25))",
      }}
    >
      <motion.div
        animate={{
          rotateX: [0, page.sheetTiltX, -page.sheetTiltX * 0.42, page.sheetTiltX * 0.18, 0],
          rotateY: [0, page.sheetTiltY, -page.sheetTiltY * 0.5, page.sheetTiltY * 0.22, 0],
          rotateZ: [0, page.sheetSpin, page.sheetSpin * 0.45, 0],
        }}
        transition={{
          duration: page.duration,
          delay: page.delay,
          ease: "easeInOut",
          times: [0, 0.24, 0.56, 0.82, 1],
        }}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          perspective: 900,
          backfaceVisibility: "visible",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
          }}
        >
          {cells.map((cell) => {
            const cellW = 100 / cols;
            const cellH = 100 / rows;

            return (
              <motion.div
                key={cell.key}
                animate={{
                  rotateX: [
                    0,
                    -cell.bendX * (0.55 + Math.sin(cell.phase) * 0.16),
                    cell.bendX * 0.34,
                    -cell.bendX * 0.16,
                    0,
                  ],
                  rotateY: [
                    0,
                    cell.bendY * (0.42 + Math.cos(cell.phase) * 0.14),
                    -cell.bendY * 0.26,
                    cell.bendY * 0.1,
                    0,
                  ],
                  x: [
                    0,
                    Math.sin(cell.phase * 3.1) * cell.flutter * 0.42,
                    -Math.cos(cell.phase * 2.3) * cell.flutter * 0.22,
                    0,
                  ],
                  y: [
                    0,
                    -Math.cos(cell.phase * 2.4) * cell.flutter * 0.36,
                    Math.sin(cell.phase * 3.2) * cell.flutter * 0.16,
                    0,
                  ],
                  z: [
                    0,
                    cell.cornerFactor ? 2.1 : cell.edgeFactor * 1.25,
                    0.6,
                    0,
                  ],
                }}
                transition={{
                  duration: page.duration * 0.92,
                  delay: page.delay + cell.airflowDelay,
                  ease: "easeInOut",
                  times: [0, 0.32, 0.68, 1],
                }}
                style={{
                  position: "absolute",
                  left: `${cell.col * cellW}%`,
                  top: `${cell.row * cellH}%`,
                  width: `${cellW + 0.4}%`,
                  height: `${cellH + 0.4}%`,
                  transformOrigin: "50% 50%",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "visible",
                  overflow: "hidden",
                  background: `linear-gradient(${96 + cell.nx * 6}deg, ${page.edge} 0%, ${page.paper} 10%, ${page.highlight} 52%, ${page.paper} 88%, ${page.edge} 100%)`,
                  boxShadow: `inset 0 0 0 0.5px rgba(92,56,24,0.12), inset 2px 0 4px rgba(255,255,255,0.11), inset -2px 0 4px rgba(75,43,17,0.07)`,
                  filter: `saturate(0.96) brightness(${1 - cell.edgeFactor * 0.025})`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.32,
                    backgroundImage:
                      "radial-gradient(circle at 25% 20%, rgba(105,64,26,0.1) 0 0.7px, transparent 1px), radial-gradient(circle at 75% 70%, rgba(105,64,26,0.08) 0 0.7px, transparent 1px)",
                    backgroundSize: "24px 22px, 30px 28px",
                    pointerEvents: "none",
                  }}
                />

                {cell.col >= 1 && cell.col <= 3 && cell.row <= 2 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "18%",
                      left: "14%",
                      width: "58%",
                      height: 1,
                      background: page.ink,
                      boxShadow: `0 7px 0 ${page.ink}, 0 14px 0 ${page.ink}`,
                      opacity: 0.34,
                      pointerEvents: "none",
                    }}
                  />
                )}
              </motion.div>
            );
          })}

          <div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: page.clipPath,
              border: "1px solid rgba(92,56,24,0.18)",
              borderRadius: 2,
              boxShadow:
                "0 10px 26px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,248,228,0.08)",
              pointerEvents: "none",
            }}
          />

          <motion.div
            animate={{
              rotateZ: [0, -4, 2, 0],
              x: [0, -0.8, 0.4, 0],
              y: [0, 0.6, -0.2, 0],
            }}
            transition={{
              duration: page.duration * 0.9,
              delay: page.delay + 0.08,
              ease: "easeInOut",
              times: [0, 0.38, 0.72, 1],
            }}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: page.fold,
              height: page.fold,
              clipPath: "polygon(0 0, 100% 0, 100% 100%)",
              background:
                "linear-gradient(135deg, rgba(255,248,224,0.88), rgba(164,119,59,0.24))",
              borderLeft: "1px solid rgba(100,66,30,0.1)",
              borderBottom: "1px solid rgba(100,66,30,0.1)",
              transformOrigin: "100% 0%",
              pointerEvents: "none",
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
                background:
                  "radial-gradient(circle at 35% 30%, #96342d 0 18%, #6d211c 48%, #43100e 100%)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
                opacity: 0.78,
              }}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function UnswirlingPages({ onComplete }) {
  const [isAnimating, setIsAnimating] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  const pages = useMemo(
    () =>
      Array.from({ length: 40 }, (_, index) => {
        const angle = seeded(index + 2) * Math.PI * 2;
        const radius = 130 + seeded(index + 5) * 600;
        const initialZ = -950 - seeded(index + 8) * 850;
        const finalZ = 760 + seeded(index + 11) * 900;
        const direction = seeded(index + 14) > 0.5 ? 1 : -1;
        const width = 48 + seeded(index + 17) * 52;
        const height = width * (1.28 + seeded(index + 20) * 0.18);
        const sizeFactor = width / 100;
        const startRotateX = -42 + seeded(index + 23) * 84;
        const startRotateY = -52 + seeded(index + 26) * 104;
        const startRotateZ = -55 + seeded(index + 29) * 110;
        const hue = 38 + seeded(index + 32) * 8;
        const light = 82 + seeded(index + 35) * 8;

        return {
          id: index,
          width,
          height,
          seed: seeded(index + 70),
          flex: 0.9 + seeded(index + 73) * 0.9,
          sheetTiltX: 4 + seeded(index + 76) * 6,
          sheetTiltY: 5 + seeded(index + 79) * 7,
          sheetSpin: -6 + seeded(index + 82) * 12,
          delay: seeded(index + 38) * 1.7,
          duration: 2.1 + sizeFactor * 0.9 + seeded(index + 41) * 0.9,
          flutter: 0.8 + (1.3 - sizeFactor) * 1.6 + seeded(index + 47) * 1.1,
          fold: 7 + seeded(index + 50) * 8,
          hasSeal: seeded(index + 53) > 0.82,
          paper: `hsl(${hue} 39% ${light}%)`,
          highlight: `hsl(${hue + 2} 45% ${Math.min(light + 6, 95)}%)`,
          edge: `hsl(${hue - 4} 30% ${Math.max(light - 18, 62)}%)`,
          ink: `rgba(70, 42, 19, ${0.16 + seeded(index + 56) * 0.11})`,
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
            scale: 0.1,
            opacity: 0,
            filter: "blur(7px)",
          },
          animate: {
            x: Math.cos(angle) * radius * 3,
            y: Math.sin(angle) * radius * 3,
            z: finalZ,
            rotateX: startRotateX + 180 * direction,
            rotateY: startRotateY - 200 * direction,
            rotateZ: startRotateZ + 40 * direction,
            scale: 1.75 + seeded(index + 62) * 0.85,
            opacity: [0, 0.95, 0.9, 0],
            filter: [
              "blur(7px)",
              "blur(0px)",
              finalZ > 1200 ? "blur(2px)" : "blur(0px)",
            ],
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
