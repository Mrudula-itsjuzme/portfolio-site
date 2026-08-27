import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CinematicDoors({ onComplete }) {
  const [phase, setPhase] = useState("approach");

  useEffect(() => {
    // Sequence timing
    // Approach phase: 0 - 500ms
    const doorTimer = setTimeout(() => setPhase("doors"), 400);
    // Light spill phase: 1000ms
    const lightTimer = setTimeout(() => setPhase("light"), 900);
    // Complete
    const completeTimer = setTimeout(() => {
      setPhase("complete");
      onComplete();
    }, 1600);

    return () => {
      clearTimeout(doorTimer);
      clearTimeout(lightTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Respect reduced motion
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    useEffect(() => {
      const timer = setTimeout(onComplete, 400);
      return () => clearTimeout(timer);
    }, [onComplete]);

    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "fixed", inset: 0, zIndex: 100, background: "#080605"
        }}
      />
    );
  }

  return (
    <AnimatePresence>
      {phase !== "complete" && (
        <motion.div
          key="cinematic-doors"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            perspective: "1200px",
            background: "#050302",
            overflow: "hidden",
            willChange: "opacity"
          }}
        >
          {/* Approach / Camera push-in */}
          <motion.div
            initial={{ scale: 1, z: 0 }}
            animate={{ scale: phase === "approach" ? 1 : 0.95, z: phase === "approach" ? 0 : 200 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transformStyle: "preserve-3d",
              willChange: "transform"
            }}
          >
            {/* Ambient dust / walkway texture */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 1 }}
              style={{
                position: "absolute", inset: 0,
                backgroundImage: "radial-gradient(circle at center, rgba(200,175,120,0.1) 0%, transparent 60%)",
                willChange: "opacity"
              }}
            />

            {/* Light Spill (behind doors) - optimized without blur filter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: phase === "light" ? 1 : (phase === "doors" ? 0.3 : 0), scale: phase === "light" ? 2.5 : 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{
                position: "absolute",
                width: "40vw",
                height: "60vh",
                background: "radial-gradient(ellipse at center, rgba(255, 230, 180, 0.9) 0%, rgba(200, 150, 80, 0.4) 30%, transparent 70%)",
                zIndex: 0,
                willChange: "opacity, transform"
              }}
            />

            {/* The Doors */}
            <div style={{
              display: "flex",
              width: "40vw",
              minWidth: "300px",
              height: "60vh",
              minHeight: "450px",
              position: "relative",
              zIndex: 1,
              transformStyle: "preserve-3d",
            }}>
              {/* Left Door */}
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: (phase === "doors" || phase === "light") ? 100 : 0 }}
                transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
                style={{
                  flex: 1,
                  background: "linear-gradient(90deg, #17100d, #241811)",
                  borderRight: "2px solid #050302",
                  transformOrigin: "left center",
                  boxShadow: "inset -10px 0 20px rgba(0,0,0,0.8)",
                  position: "relative",
                  willChange: "transform"
                }}
              >
                <div style={{ position: "absolute", right: "20px", top: "50%", width: "12px", height: "12px", borderRadius: "50%", background: "#5a452b", boxShadow: "inset 2px 2px 5px rgba(255,255,255,0.2)" }} />
              </motion.div>

              {/* Right Door */}
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: (phase === "doors" || phase === "light") ? -100 : 0 }}
                transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
                style={{
                  flex: 1,
                  background: "linear-gradient(270deg, #17100d, #241811)",
                  borderLeft: "2px solid #050302",
                  transformOrigin: "right center",
                  boxShadow: "inset 10px 0 20px rgba(0,0,0,0.8)",
                  position: "relative",
                  willChange: "transform"
                }}
              >
                <div style={{ position: "absolute", left: "20px", top: "50%", width: "12px", height: "12px", borderRadius: "50%", background: "#5a452b", boxShadow: "inset -2px 2px 5px rgba(255,255,255,0.2)" }} />
              </motion.div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
