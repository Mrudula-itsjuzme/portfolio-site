import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

/* ---------------------------
   Seeded randomness
---------------------------- */

function seedRandom(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

/* ---------------------------
   Book style generator — realistic palette
---------------------------- */

const BOOK_PALETTES = [
  // Deep jewel tones from image
  { spine: "#1b2a1f", top: "#2a3d2e", label: "rgba(200,215,240,0.85)", accent: "#c8a868" }, // Green
  { spine: "#14283b", top: "#1a344d", label: "rgba(240,210,200,0.85)", accent: "#d7be89" }, // Blue
  { spine: "#2c1c13", top: "#3a251a", label: "rgba(240,225,180,0.85)", accent: "#e5cc98" }, // Brown
  { spine: "#3a1d1d", top: "#4d2626", label: "rgba(240,210,200,0.85)", accent: "#c8a868" }, // Red
  { spine: "#161d2a", top: "#1e2738", label: "rgba(200,215,240,0.85)", accent: "#c8a868" }, // Dark Slate
  { spine: "#23201a", top: "#302b23", label: "rgba(240,225,180,0.85)", accent: "#d7be89" }, // Dark Walnut
];

function generateBookStyle(projectIndex, shelfIndex) {
  const seed = projectIndex * 97 + shelfIndex * 53;

  const height = 180 + Math.floor(seedRandom(seed) * 80);      // 180–260px
  const width  = 36  + Math.floor(seedRandom(seed + 1) * 28);  // 36–64px
  const tilt   = -2  + seedRandom(seed + 2) * 4;               // -2°…+2°
  const leftGap = Math.floor(seedRandom(seed + 3) * 6);        // 0–5px gap
  const pageWidth = 4 + Math.floor(seedRandom(seed + 4) * 4);  // 4–8px page edge
  const paletteIdx = Math.floor(seedRandom(seed + 5) * BOOK_PALETTES.length);
  const palette = BOOK_PALETTES[paletteIdx];

  // Subtle decorative borders
  const hasBand = seedRandom(seed + 6) > 0.5;

  return {
    height: `${height}px`,
    width:  `${width}px`,
    marginLeft: `${leftGap}px`,
    "--book-tilt": `${tilt}deg`,
    "--page-width": `${pageWidth}px`,
    "--spine-color": palette.spine,
    "--spine-top":   palette.top,
    "--accent-color": palette.accent,
    hasBand,
    rawHeight: height,
  };
}

/* ---------------------------
   Decorative objects between books
---------------------------- */

const DECOR_ITEMS = [
  { char: "🧸", size: 48, y: 0 },
  { char: "🪴", size: 42, y: 0 },
  { char: "🕰️", size: 44, y: 0 },
  { char: "🕯️", size: 36, y: -4 },
  { char: "🖼️", size: 40, y: 0 },
  { char: "📜", size: 32, y: -2 },
  { char: "🦆", size: 30, y: 0 },
  { char: "🦉", size: 36, y: 0 },
  { char: "🪶", size: 38, y: -6 },
  { char: "⏳", size: 40, y: 0 },
];

function ScatteredObject({ seed }) {
  const r = (offset) => seedRandom(seed * 17 + offset);
  const item = DECOR_ITEMS[Math.floor(r(0) * DECOR_ITEMS.length)];
  
  return (
    <div style={{
      display: "flex", alignItems: "flex-end", flexShrink: 0, margin: "0 12px",
      fontSize: item.size,
      transform: `translateY(${item.y}px) rotate(${-4 + r(1)*8}deg)`,
      filter: "sepia(0.4) brightness(0.85) contrast(1.1)",
      textShadow: "4px 8px 12px rgba(0,0,0,0.7), -1px -1px 4px rgba(255,255,255,0.1)",
      userSelect: "none", pointerEvents: "none",
      zIndex: 2,
    }}>
      {item.char}
    </div>
  );
}

/* ---------------------------
   Single book spine
---------------------------- */

function RealisticBookSpine({ project, style, isActive, phase, isHovered, onHoverStart, onHoverEnd, onClick }) {
  const { hasBand, rawHeight, ...cssStyle } = style;

  const zIndex = isActive || isHovered ? 30 : 1;

  return (
    <motion.div
      className="book-spine book-spine-wrap"
      style={{
        ...cssStyle,
        position: "relative",
        flexShrink: 0,
        transformOrigin: "bottom center",
        cursor: "pointer",
        zIndex,
        display: "flex",
      }}
      animate={{
        y: !isActive ? 0
          : phase === "pull"  ? -30
          : phase === "lift"  ? -80
          : phase === "float" ? -120
          : 0,
        scale: !isActive ? 1
          : phase === "pull"  ? 1.2
          : phase === "lift"  ? 1.3
          : phase === "float" ? 0.9
          : 1,
        opacity: isActive && phase === "float" ? 0 : 1,
        rotate:  isActive && phase === "lift"  ? -3
               : isActive && phase === "float" ? -7
               : 0,
      }}
      transition={{
        y:       { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] },
        scale:   { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] },
        opacity: { duration: 0.3 },
        rotate:  { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] },
      }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={onClick}
      whileHover={phase === "idle" ? { y: -16, transition: { duration: 0.2 } } : {}}
    >
      {/* Active Glow Outline */}
      {isActive && (
        <div style={{
          position: "absolute",
          inset: -4,
          borderRadius: 4,
          border: "2px solid rgba(200, 175, 120, 0.8)",
          boxShadow: "0 0 20px rgba(200, 175, 120, 0.4), inset 0 0 10px rgba(200, 175, 120, 0.2)",
          zIndex: -1,
          pointerEvents: "none"
        }} />
      )}
      
      {/* Spotlight Glow behind hovered book */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "200%",
            height: "120%",
            background: "radial-gradient(ellipse at bottom, rgba(255, 200, 120, 0.35) 0%, transparent 60%)",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
      )}

      {/* Main spine */}
      <div style={{
        width: "100%",
        height: cssStyle.height,
        background: `linear-gradient(90deg, rgba(0,0,0,0.22) 0%, var(--spine-color) 12%, var(--spine-top) 50%, var(--spine-color) 88%, rgba(0,0,0,0.28) 100%)`,
        borderRadius: "1px 2px 1px 1px",
        boxShadow: "2px 0 5px rgba(0,0,0,0.38), inset 1px 0 2px rgba(255,255,255,0.06)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `rotate(var(--book-tilt))`,
        transformOrigin: "bottom center",
        border: isHovered ? "1px solid rgba(255, 220, 150, 0.6)" : "none",
      }}>
        {/* Subtle top highlight */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"8%", background:"rgba(255,255,255,0.09)", borderRadius:"1px 2px 0 0" }} />

        {/* Bookmark Ribbon on Hover */}
        {isHovered && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{
              position: "absolute",
              top: 0,
              left: "20%",
              width: "6px",
              height: "24px",
              background: "#b83030",
              boxShadow: "1px 1px 3px rgba(0,0,0,0.6)",
              borderLeft: "1px solid #d94a4a",
              zIndex: 10,
            }}
          >
            {/* Ribbon tail cutout */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: 0,
              height: 0,
              borderLeft: "3px solid transparent",
              borderRight: "3px solid transparent",
              borderBottom: "4px solid var(--spine-color)",
            }} />
          </motion.div>
        )}

        {/* Cloth band */}
        {hasBand && (
          <div style={{
            position:"absolute", left:0, right:0,
            top: `var(--band-pos)`, height: "14%",
            background:"rgba(0,0,0,0.12)",
            borderTop:"0.5px solid rgba(255,255,255,0.05)",
            borderBottom:"0.5px solid rgba(0,0,0,0.15)",
          }} />
        )}

        {/* Title text vertical */}
        {project?.title && parseInt(cssStyle.width) >= 26 && (
          <span style={{
            writingMode:"vertical-rl",
            textOrientation:"mixed",
            transform:"rotate(180deg)",
            fontSize: parseInt(cssStyle.width) > 38 ? 11 : 10,
            fontFamily:"'Playfair Display', Georgia, serif",
            fontStyle:"italic",
            color:"rgba(240, 230, 210, 0.9)",
            letterSpacing:"0.07em",
            padding:"6px 0",
            whiteSpace:"nowrap",
            overflow:"hidden",
            maxHeight:"82%",
            textOverflow:"ellipsis",
            userSelect:"none",
            pointerEvents:"none",
          }}>
            {project.title}
          </span>
        )}

        {parseInt(cssStyle.width, 10) >= 30 && (
          <span
            style={{
              position: "absolute",
              top: 6,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 9,
              letterSpacing: "0.12em",
              color: "rgba(243,223,171,0.86)",
              fontFamily: "'Cinzel', serif",
              textTransform: "uppercase",
              pointerEvents: "none",
              textShadow: "0 1px 1px rgba(0,0,0,0.7)",
            }}
          >
            {project.volume || "Vol. 01"}
          </span>
        )}

        {parseInt(cssStyle.width, 10) >= 34 && (
          <span
            style={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 18,
              height: 18,
              borderRadius: "50%",
              border: "1px solid rgba(233,205,140,0.75)",
              display: "grid",
              placeItems: "center",
              color: "rgba(243,223,171,0.9)",
              fontSize: 10,
              fontWeight: 700,
              fontFamily: "'Cinzel', serif",
              textShadow: "0 1px 1px rgba(0,0,0,0.72)",
              boxShadow: "inset 0 0 8px rgba(0,0,0,0.2)",
              pointerEvents: "none",
            }}
          >
            {project.monogram || "PX"}
          </span>
        )}

        {parseInt(cssStyle.width, 10) >= 42 && (
          <span
            style={{
              position: "absolute",
              right: 2,
              top: 18,
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
              fontSize: 8,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(235,214,170,0.78)",
              pointerEvents: "none",
              maxHeight: "72%",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {project.archiveCode || project.shelfMark || "ARC"}
          </span>
        )}

        {/* Bottom shadow */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"6%", background:"rgba(0,0,0,0.18)" }} />
      </div>

      {/* Page edges — right side */}
      <div style={{
        position:"absolute",
        right: -parseInt(cssStyle["--page-width"]) - 1,
        top: "3px",
        bottom: "3px",
        width: cssStyle["--page-width"],
        background:"repeating-linear-gradient(180deg,#ede7d5 0px,#ede7d5 1.2px,#cfc8b2 1.2px,#cfc8b2 1.8px)",
        borderRadius:"0 1px 1px 0",
        opacity:0.82,
        transform:`rotate(var(--book-tilt))`,
        transformOrigin:"bottom center",
      }} />

      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -8,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 10,
          color: "rgba(235,205,142,0.8)",
          textShadow: "0 1px 1px rgba(0,0,0,0.7)",
          pointerEvents: "none",
        }}
      >
        {project.sigil || "✶"}
      </span>
    </motion.div>
  );
}

/* ---------------------------
   Bookshelf Component
---------------------------- */

export default function Bookshelf({ projects, onOpenProject, onHoverProject, onBookPullSound }) {
  const [hoveredId, setHoveredId]   = useState(null);
  const [activeId,  setActiveId]    = useState(null);
  const [phase,     setPhase]       = useState("idle");

  const timers      = useRef([]);
  const corridorRef = useRef(null);

  /* Shelf layout — 2 shelves, densely packed */
  const shelves = useMemo(() => {
    const shelfCount = 2;
    const shelvesArray = Array.from({ length: shelfCount }, () => []);
    projects.forEach((project, index) => {
      const shelfIndex = index % shelfCount;
      shelvesArray[shelfIndex].push({
        project,
        style: generateBookStyle(index, shelfIndex),
        objectSeed: index * 31 + shelfIndex * 13,
        insertObject: index === 1 || index === 4, // one decoration per shelf
      });
    });
    return shelvesArray;
  }, [projects]);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  function queue(cb, delay) {
    const t = setTimeout(cb, delay);
    timers.current.push(t);
  }

  function handleOpenSequence(project) {
    if (phase !== "idle") return;
    onBookPullSound?.();
    setActiveId(project.id);
    setPhase("pull");
    queue(() => setPhase("lift"),  200);
    queue(() => setPhase("float"), 420);
    queue(() => { onOpenProject(project); setPhase("idle"); setActiveId(null); }, 640);
  }

  const stageScale = phase === "lift" || phase === "float" ? 1.02 : 1;

  function handleScroll(direction) {
    const node = corridorRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * 340, behavior: "smooth" });
  }

  function handleWheelScroll(event) {
    const node = corridorRef.current;
    if (!node) return;

    const absX = Math.abs(event.deltaX);
    const absY = Math.abs(event.deltaY);
    const dominantY = absY > absX;

    if (dominantY) {
      event.preventDefault();
      node.scrollLeft += event.deltaY;
    }
  }

  return (
    <section
      aria-label="Library"
      style={{
        background: "#12261a", // Darker forest green
        backgroundImage: [
          "radial-gradient(ellipse at 75% 0%,   rgba(190,145,70,0.13) 0%, transparent 55%)",
          "radial-gradient(ellipse at 10% 35%,   rgba(190,145,70,0.07) 0%, transparent 40%)",
          "radial-gradient(ellipse at 50% 110%,  rgba(0,0,0,0.45) 0%, transparent 60%)",
          "repeating-linear-gradient(90deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 2px, transparent 2px, transparent 120px)",
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 3px, transparent 3px, transparent 120px)",
          "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.4) 100%)",
        ].join(","),
        padding: "10px 0 80px",
        fontFamily: "'Playfair Display', Georgia, serif",
        overflow:"hidden",
      }}
    >
      {/* Google Font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" />

      <div style={{ width: "92%", margin: "0 auto", maxWidth: "1600px", position: "relative" }}>
        {/* Wall sconces */}
      <div aria-hidden="true" style={{ display:"flex", justifyContent:"space-between", padding:"0 64px", marginBottom:"-20px", position:"relative", zIndex:2 }}>
        {[0, 1].map(i => (
          <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", paddingTop: 18 }}>
            {/* The Bulb Glow */}
            <div style={{ position:"absolute", width: 80, height: 80, background: "radial-gradient(circle, rgba(255, 220, 120, 0.4) 0%, rgba(255, 180, 50, 0.1) 40%, transparent 70%)", top: 10, filter: "blur(8px)" }} />
            {/* Sconce Shade */}
            <div style={{ width:40, height:20, background:"linear-gradient(180deg,#9a8462,#5a4422)", borderRadius:"50% 50% 0 0", boxShadow:"0 0 25px 10px rgba(255,200,80,0.25), inset 0 -3px 8px rgba(0,0,0,0.5)" }} />
            <div style={{ width:4, height:24, background:"#4a3020", borderRadius:2 }} />
            <div style={{ width:12, height:12, background:"#3a2810", borderRadius:"0 0 4px 4px", boxShadow: "0 4px 10px rgba(0,0,0,0.5)" }} />
          </div>
        ))}
      </div>



      <motion.div
        animate={{ scale: stageScale }}
        transition={{ duration: 0.26 }}
        style={{ transformOrigin: "center center", position: "relative" }}
      >
        <button
          onClick={() => handleScroll(-1)}
          className="shelf-nav-btn"
          style={{
            position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", zIndex: 10,
            background: "rgba(30, 20, 15, 0.4)", backdropFilter: "blur(8px)", border: "1px solid rgba(200,175,120,0.3)",
            color: "#e2c899", padding: "12px 16px", borderRadius: "50%", cursor: "pointer",
            fontFamily: "Cinzel", fontSize: "1.2rem", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(200,175,120,0.2)"; e.currentTarget.style.transform = "translateY(-50%) scale(1.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(30, 20, 15, 0.4)"; e.currentTarget.style.transform = "translateY(-50%) scale(1)"; }}
        >
          ←
        </button>
        <button
          onClick={() => handleScroll(1)}
          className="shelf-nav-btn"
          style={{
            position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", zIndex: 10,
            background: "rgba(30, 20, 15, 0.4)", backdropFilter: "blur(8px)", border: "1px solid rgba(200,175,120,0.3)",
            color: "#e2c899", padding: "12px 16px", borderRadius: "50%", cursor: "pointer",
            fontFamily: "Cinzel", fontSize: "1.2rem", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(200,175,120,0.2)"; e.currentTarget.style.transform = "translateY(-50%) scale(1.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(30, 20, 15, 0.4)"; e.currentTarget.style.transform = "translateY(-50%) scale(1)"; }}
        >
          →
        </button>
        <div
          ref={corridorRef}
          style={{ overflowX:"auto", overflowY:"visible" }}
          onWheel={handleWheelScroll}
        >
          <div
            style={{
              minWidth: 640,
              padding:"0 24px",
              scrollbarWidth: "thin",
            }}
          >

            {shelves.map((laneItems, shelfIndex) => (
              <section
                key={`shelf-${shelfIndex}`}
                aria-label={`Shelf ${shelfIndex + 1}`}
                style={{ position:"relative", marginBottom: 0 }}
              >
                {/* Top space before books */}
                <div style={{ height: 40 }} />

                {/* Book row */}
                <div className="shelf-books" style={{
                  display:"flex",
                  alignItems:"flex-end",
                  flexWrap:"nowrap",
                  padding:"0 16px",
                  minHeight: 240,
                  gap: 0,
                  position:"relative",
                  zIndex: 1,
                }}>
                  {laneItems.map((item, idx) => (
                    <div key={item.project.id} style={{ display:"flex", alignItems:"flex-end" }}>
                      {item.insertObject && (
                        <ScatteredObject seed={item.objectSeed} />
                      )}
                      <RealisticBookSpine
                        project={item.project}
                        style={item.style}
                        phase={phase}
                        isActive={item.project.id === activeId}
                        isHovered={item.project.id === hoveredId}
                        onHoverStart={() => {
                          setHoveredId(item.project.id);
                          onHoverProject?.(item.project);
                        }}
                        onHoverEnd={() => {
                          setHoveredId(id => id === item.project.id ? null : id);
                          // Don't unset onHoverProject to keep hero populated
                        }}
                        onClick={() => handleOpenSequence(item.project)}
                      />
                    </div>
                  ))}
                  
                  {/* Archive Typography Beside Books */}
                  {shelfIndex === 0 && (
                    <div style={{
                      marginLeft: 80,
                      marginRight: 60,
                      alignSelf: "center",
                      display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left",
                      position: "relative",
                      zIndex: 1,
                      marginTop: -20,
                    }}>
                      <p style={{ 
                        margin: 0, color: "#c8a562", fontSize: "0.85rem", letterSpacing: "0.2em", fontFamily: "'Cinzel', serif", textTransform: "uppercase",
                        display: "flex", alignItems: "center", gap: "12px", opacity: 0.8
                      }}>
                        <span>↠</span> PORTFOLIO ARCHIVE <span>↞</span>
                      </p>
                      <h2 style={{ 
                        margin: "12px 0 16px", color: "#e2c899", fontSize: "2rem", letterSpacing: "0.1em", fontFamily: "'Cinzel', serif", fontWeight: 400, textTransform: "uppercase",
                        whiteSpace: "nowrap"
                      }}>
                        PULL A VOLUME. INSPECT THE RECEIPTS.
                      </h2>
                      <p style={{ margin: 0, color: "#a88e5a", fontSize: "1rem", fontStyle: "italic", fontFamily: "'Playfair Display', serif", whiteSpace: "nowrap" }}>
                        A curated library of ideas, code, research, and experiments.
                      </p>
                      <p style={{ margin: "6px 0 0", color: "#a88e5a", fontSize: "1rem", fontStyle: "italic", fontFamily: "'Playfair Display', serif", whiteSpace: "nowrap" }}>
                        Each volume opens a story. Each story leaves a trace.
                      </p>
                    </div>
                  )}
                </div>

                {/* Intricate Mahogany Shelf Ledge */}
                <div style={{ position: "relative", zIndex: 2 }}>
                  {/* Top trim / back stop */}
                  <div style={{ height: 14, background: "linear-gradient(180deg, #1c1008 0%, #2f1b0e 100%)", boxShadow: "inset 0 4px 8px rgba(0,0,0,0.6)" }} />
                  
                  {/* Main surface top (where books sit) */}
                  <div style={{
                    height: 28,
                    background: "linear-gradient(180deg, #4d2b15 0%, #3e210f 100%)",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    borderBottom: "2px solid #1f0f05",
                    position: "relative",
                  }}>
                    {/* Wood grain pattern */}
                    <div style={{
                      position: "absolute", inset: 0, opacity: 0.8,
                      backgroundImage: "repeating-linear-gradient(90deg, transparent 0px, transparent 24px, rgba(0,0,0,0.1) 24px, rgba(0,0,0,0.1) 26px, transparent 26px, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 42px)"
                    }} />
                    {/* Glossy top edge highlight */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.08)" }} />
                  </div>

                  {/* Convex molding layer 1 */}
                  <div style={{ height: 8, background: "linear-gradient(180deg, #5b3419 0%, #2f1b0e 100%)", borderBottom: "1px solid #140a04", boxShadow: "inset 0 2px 2px rgba(255,255,255,0.05)" }} />
                  
                  {/* Concave cove molding */}
                  <div style={{ height: 12, background: "linear-gradient(180deg, #1c1008 0%, #3e210f 100%)", borderBottom: "1px solid #140a04" }} />
                  
                  {/* Bottom structural trim */}
                  <div style={{ height: 16, background: "linear-gradient(180deg, #2f1b0e 0%, #110803 100%)", boxShadow: "0 12px 24px rgba(0,0,0,0.85)" }} />
                </div>

                {/* Cast shadow below shelf */}
                <div style={{
                  height: 30,
                  background:"linear-gradient(180deg,rgba(0,0,0,0.38) 0%,transparent 100%)",
                  position:"relative", zIndex:0,
                }} />

              </section>
            ))}

          </div>
        </div>
      </motion.div>
      </div>


    </section>
  );
}