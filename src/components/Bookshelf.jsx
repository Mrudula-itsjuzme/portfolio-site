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
  // Deep jewel tones
  { spine: "#2c3e6b", top: "#3a5080", label: "rgba(200,215,240,0.85)" },
  { spine: "#6b2c2c", top: "#843636", label: "rgba(240,210,200,0.85)" },
  { spine: "#2c5a3a", top: "#376b46", label: "rgba(200,235,210,0.85)" },
  { spine: "#5a4a1e", top: "#6e5c26", label: "rgba(240,225,180,0.85)" },
  { spine: "#3d2c6b", top: "#4e3882", label: "rgba(215,205,240,0.85)" },
  { spine: "#1e4a5a", top: "#275e70", label: "rgba(195,225,238,0.85)" },
  { spine: "#6b3a1e", top: "#844926", label: "rgba(240,215,195,0.85)" },
  { spine: "#2a2a2a", top: "#383838", label: "rgba(200,200,200,0.85)" },
  // Faded / aged
  { spine: "#8a7a5a", top: "#9e8d6a", label: "rgba(240,232,210,0.85)" },
  { spine: "#7a8a7a", top: "#8a9a8a", label: "rgba(220,232,220,0.85)" },
  { spine: "#8a5a4a", top: "#9e6a58", label: "rgba(240,218,210,0.85)" },
  { spine: "#5a5a8a", top: "#6a6a9e", label: "rgba(215,215,240,0.85)" },
  // Light cloth / linen
  { spine: "#c8b89a", top: "#d4c6a8", label: "rgba(60,44,24,0.75)" },
  { spine: "#b8c8b0", top: "#c6d4be", label: "rgba(40,60,44,0.75)" },
  { spine: "#c8c0a0", top: "#d6ceb0", label: "rgba(60,56,30,0.75)" },
  { spine: "#d0b8a8", top: "#dcc6b6", label: "rgba(60,44,36,0.75)" },
];

function generateBookStyle(projectIndex, shelfIndex) {
  const seed = projectIndex * 97 + shelfIndex * 53;

  const height = 155 + Math.floor(seedRandom(seed) * 70);      // 155–225px
  const width  = 22  + Math.floor(seedRandom(seed + 1) * 30);  // 22–52px
  const tilt   = -3  + seedRandom(seed + 2) * 6;               // -3°…+3°
  const leftGap = Math.floor(seedRandom(seed + 3) * 6);        // 0–5px gap
  const pageWidth = 3 + Math.floor(seedRandom(seed + 4) * 4);  // 3–6px page edge
  const paletteIdx = Math.floor(seedRandom(seed + 5) * BOOK_PALETTES.length);
  const palette = BOOK_PALETTES[paletteIdx];

  // Occasional cloth-texture band
  const hasBand = seedRandom(seed + 6) > 0.6;
  const bandPos = 20 + Math.floor(seedRandom(seed + 7) * 60); // % from top

  return {
    height: `${height}px`,
    width:  `${width}px`,
    marginLeft: `${leftGap}px`,
    "--book-tilt": `${tilt}deg`,
    "--page-width": `${pageWidth}px`,
    "--spine-color": palette.spine,
    "--spine-top":   palette.top,
    "--label-color": palette.label,
    "--band-pos":    `${bandPos}%`,
    hasBand,
    rawHeight: height,
  };
}

/* ---------------------------
   Decorative objects between books
---------------------------- */

function ScatteredObject({ seed }) {
  const r = (offset) => seedRandom(seed * 17 + offset);
  const kind = Math.floor(r(0) * 11); // 0-10: many different items

  if (kind === 0) {
    // Ceramic vase
    const hue = Math.floor(r(1) * 360);
    return (
      <div style={{ display:"flex", alignItems:"flex-end", flexShrink:0, margin:"0 10px", position:"relative" }}>
        <div style={{
          width: 26, height: 54,
          background: `hsl(${hue},22%,52%)`,
          borderRadius: "40% 40% 22% 22% / 30% 30% 16% 16%",
          boxShadow: "inset -4px 0 8px rgba(0,0,0,0.28), 2px 3px 12px rgba(0,0,0,0.4)",
          position:"relative", flexShrink:0,
        }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:"30%", background:"rgba(255,255,255,0.07)", borderRadius:"40% 40% 0 0" }} />
        </div>
      </div>
    );
  }

  if (kind === 1) {
    // Decorative sphere
    return (
      <div style={{ display:"flex", alignItems:"flex-end", flexShrink:0, margin:"0 10px" }}>
        <div style={{
          width: 38, height: 38, borderRadius:"50%",
          background: "radial-gradient(circle at 35% 32%, #e8dfc8 0%, #bfb090 45%, #7a6840 100%)",
          boxShadow: "3px 4px 14px rgba(0,0,0,0.45), inset -4px -4px 10px rgba(0,0,0,0.25)",
          flexShrink: 0,
        }} />
      </div>
    );
  }

  if (kind === 2) {
    // Small framed picture
    const tones = ["#8a7a9a","#9a7a5a","#6a8a7a","#8a6a4a"];
    const bg = tones[Math.floor(r(2) * tones.length)];
    return (
      <div style={{ display:"flex", alignItems:"flex-end", flexShrink:0, margin:"0 8px" }}>
        <div style={{
          background: "linear-gradient(135deg,#6a5030,#4a3820)",
          padding: 4, borderRadius:1,
          boxShadow: "2px 3px 10px rgba(0,0,0,0.45)",
        }}>
          <div style={{ width:46, height:60, background:bg, opacity:0.85 }} />
        </div>
      </div>
    );
  }

  if (kind === 3) {
    // Candle pair
    return (
      <div style={{ display:"flex", alignItems:"flex-end", gap:5, flexShrink:0, margin:"0 10px" }}>
        {[58, 40].map((h, i) => (
          <div key={i} style={{ position:"relative" }}>
            {/* flame */}
            <div style={{
              position:"absolute", top: -14, left:"50%", transform:"translateX(-50%)",
              width:7, height:10,
              background:"radial-gradient(ellipse at 50% 80%, #ffe066 20%, #f4a020 70%, transparent 100%)",
              borderRadius:"50% 50% 30% 30%",
              boxShadow:"0 0 6px 2px rgba(255,180,30,0.35)",
            }} />
            {/* wick */}
            <div style={{ position:"absolute", top:-4, left:"50%", transform:"translateX(-50%)", width:1.5, height:4, background:"#2a1a08", borderRadius:1 }} />
            <div style={{ width:13, height:h, background:"linear-gradient(180deg,#f4e8cc,#e2d4a8)", borderRadius:"2px 2px 1px 1px", boxShadow:"2px 2px 8px rgba(0,0,0,0.35)" }} />
          </div>
        ))}
      </div>
    );
  }

  if (kind === 4) {
    // Sticky notes stack
    const colors = ["#f4e066","#ffd080","#a6ffb3","#87ceeb","#ffb3d9"];
    return (
      <div style={{ display:"flex", alignItems:"flex-end", flexShrink:0, margin:"0 8px", position:"relative" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            position:"absolute",
            width: 24, height: 26,
            background: colors[Math.floor(r(4 + i) * colors.length)],
            border: "1px solid rgba(0,0,0,0.1)",
            boxShadow: "2px 2px 6px rgba(0,0,0,0.2)",
            transform: `translateY(${i * 3}px) rotate(${-2 + i * 2}deg)`,
            left: i * 8,
          }}>
            <div style={{ position:"absolute", top:6, left:6, width:3, height:3, background:"rgba(100,100,100,0.3)", borderRadius:"50%" }} />
          </div>
        ))}
      </div>
    );
  }

  if (kind === 5) {
    // Plant in pot
    return (
      <div style={{ display:"flex", alignItems:"flex-end", flexShrink:0, margin:"0 10px", position:"relative" }}>
        {/* Pot */}
        <div style={{
          width: 28, height: 24,
          background: "linear-gradient(180deg, #c97d4a 0%, #a85c2f 100%)",
          borderRadius: "0 0 4px 4px",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3), 2px 3px 8px rgba(0,0,0,0.3)",
          position:"relative", flexShrink:0,
        }}>
          {/* Plant leaves */}
          <div style={{
            position:"absolute", bottom: -18, left:2, width:8, height:20,
            background: "linear-gradient(135deg, #2d7a3e 0%, #1a4a22 100%)",
            borderRadius: "50% 20% 50% 20%",
            transform: "rotate(-25deg)",
          }} />
          <div style={{
            position:"absolute", bottom: -16, left:10, width:8, height:22,
            background: "linear-gradient(45deg, #3d8a4e 0%, #2a5a35 100%)",
            borderRadius: "20% 50% 20% 50%",
            transform: "rotate(15deg)",
          }} />
          <div style={{
            position:"absolute", bottom: -20, left:18, width:7, height:24,
            background: "linear-gradient(135deg, #2d7a3e 0%, #1a4a22 100%)",
            borderRadius: "50% 20% 50% 20%",
            transform: "rotate(35deg)",
          }} />
        </div>
      </div>
    );
  }

  if (kind === 6) {
    // Ink bottle
    return (
      <div style={{ display:"flex", alignItems:"flex-end", flexShrink:0, margin:"0 10px", position:"relative" }}>
        {/* Bottle */}
        <div style={{
          width: 14, height: 36,
          background: "linear-gradient(90deg, #1a1a3a 0%, #2a2a4a 50%, #1a1a3a 100%)",
          borderRadius: "2px 2px 0 0",
          boxShadow: "inset 1px 0 2px rgba(80,80,120,0.3), 2px 3px 8px rgba(0,0,0,0.5)",
          position:"relative",
        }}>
          {/* Ink inside */}
          <div style={{ position:"absolute", top:2, left:1, right:1, bottom:4, background:"rgba(26,26,58,0.8)", borderRadius:"1px 1px 0 0" }} />
          {/* Cork cap */}
          <div style={{
            position:"absolute", top:-4, left:"50%", transform:"translateX(-50%)",
            width: 8, height: 6,
            background: "linear-gradient(180deg, #8b6f47 0%, #6a5c3a 100%)",
            borderRadius: "2px 2px 1px 1px",
          }} />
        </div>
      </div>
    );
  }

  if (kind === 7) {
    // Teddy bear (simple)
    return (
      <div style={{ display:"flex", alignItems:"flex-end", flexShrink:0, margin:"0 12px" }}>
        <div style={{ position:"relative", width:32, height:40 }}>
          {/* Body */}
          <div style={{
            position:"absolute", left:6, top:12, width:20, height:18,
            background: "#a87835",
            borderRadius: "50%",
            boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.2)",
          }} />
          {/* Head */}
          <div style={{
            position:"absolute", left:8, top:0, width:16, height:16,
            background: "#b88845",
            borderRadius: "50%",
            boxShadow: "inset -2px -2px 3px rgba(0,0,0,0.15)",
          }} />
          {/* Ears */}
          {[{left:2}, {right:2}].map((pos, i) => (
            <div key={i} style={{
              position:"absolute", ...pos, top:2, width:6, height:6,
              background: "#a87835",
              borderRadius: "50%",
              boxShadow: "inset -1px -1px 2px rgba(0,0,0,0.2)",
            }} />
          ))}
          {/* Eyes */}
          {[{left:10}, {right:10}].map((pos, i) => (
            <div key={i} style={{
              position:"absolute", ...pos, top:6, width:2, height:2,
              background: "#2a1a0a",
              borderRadius: "50%",
            }} />
          ))}
        </div>
      </div>
    );
  }

  if (kind === 8) {
    // Quill pen
    return (
      <div style={{ display:"flex", alignItems:"flex-end", flexShrink:0, margin:"0 8px", position:"relative" }}>
        <div style={{
          width: 4, height: 42,
          background: "linear-gradient(180deg, #2a1a0a 0%, #4a3a2a 100%)",
          borderRadius: "2px 2px 0 0",
          transform: "rotate(-30deg)",
          transformOrigin: "bottom center",
          boxShadow: "1px 1px 4px rgba(0,0,0,0.4)",
        }} />
        {/* Feather */}
        <div style={{
          position:"absolute", bottom:34, right:-8,
          width: 16, height: 24,
          background: "linear-gradient(to right, #e8e0d0 0%, #d4c8b8 100%)",
          borderRadius: "50% 0 0 50%",
          transform: "rotate(-45deg)",
          opacity: 0.7,
        }} />
      </div>
    );
  }

  if (kind === 9) {
    // Stacked books
    return (
      <div style={{ display:"flex", alignItems:"flex-end", flexShrink:0, margin:"0 10px", position:"relative" }}>
        {["#6b3a3a", "#3a5a6b", "#5a4a2a"].map((color, i) => (
          <div key={i} style={{
            position:"absolute",
            width: 30, height: 8,
            background: color,
            border: "1px solid rgba(0,0,0,0.2)",
            boxShadow: "1px 1px 4px rgba(0,0,0,0.3)",
            transform: `translateY(${-i * 10}px) rotate(${-3 + i * 2}deg)`,
            left: i * 2,
          }} />
        ))}
      </div>
    );
  }

  // Crystal / gem (default for kind === 10)
  return (
    <div style={{ display:"flex", alignItems:"flex-end", flexShrink:0, margin:"0 10px" }}>
      <div style={{
        width: 16, height: 24,
        background: "linear-gradient(135deg, #6b8adb 0%, #4a6ab3 50%, #2a4a8a 100%)",
        clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
        boxShadow: "2px 3px 10px rgba(20,40,120,0.5), inset -2px -2px 4px rgba(0,0,0,0.3)",
      }} />
    </div>
  );
}

/* ---------------------------
   Single book spine
---------------------------- */

function RealisticBookSpine({ project, style, isActive, phase, onHoverStart, onHoverEnd, onClick }) {
  const { hasBand, rawHeight, ...cssStyle } = style;

  const zIndex = isActive ? 30 : 1;

  return (
    <motion.div
      className="book-spine-wrap"
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
          : phase === "lift"  ? -66
          : phase === "float" ? -104
          : 0,
        scale: !isActive ? 1
          : phase === "pull"  ? 1.05
          : phase === "lift"  ? 1.12
          : phase === "float" ? 0.78
          : 1,
        opacity: isActive && phase === "float" ? 0 : 1,
        rotate:  isActive && phase === "lift"  ? -3
               : isActive && phase === "float" ? -7
               : 0,
      }}
      transition={{
        y:       { type: "spring", stiffness: 260, damping: 18 },
        scale:   { duration: 0.25, ease: "easeOut" },
        opacity: { duration: 0.15 },
        rotate:  { duration: 0.22, ease: "easeOut" },
      }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={onClick}
      whileHover={phase === "idle" ? { y: -16, transition: { duration: 0.2 } } : {}}
    >
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
      }}>
        {/* Subtle top highlight */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"8%", background:"rgba(255,255,255,0.09)", borderRadius:"1px 2px 0 0" }} />

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
            color:`var(--label-color)`,
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

export default function Bookshelf({ projects, onOpenProject, onBookPullSound }) {
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
        background: "#1c3828",
        backgroundImage: [
          "radial-gradient(ellipse at 75% 0%,   rgba(190,145,70,0.13) 0%, transparent 55%)",
          "radial-gradient(ellipse at 10% 35%,   rgba(190,145,70,0.07) 0%, transparent 40%)",
          "radial-gradient(ellipse at 50% 110%,  rgba(0,0,0,0.45) 0%, transparent 60%)",
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.009) 0px,rgba(255,255,255,0.009) 1px, transparent 1px, transparent 72px)",
          "repeating-linear-gradient(0deg,  rgba(255,255,255,0.009) 0px,rgba(255,255,255,0.009) 1px, transparent 1px, transparent 72px)",
        ].join(","),
        minHeight: "100vh",
        padding: "0 0 40px",
        fontFamily: "'Playfair Display', Georgia, serif",
        overflow:"hidden",
      }}
    >
      <div
        aria-label="Shelf scrolling controls"
        style={{
          position: "relative",
          zIndex: 5,
          display: "flex",
          justifyContent: "center",
          gap: 10,
          marginTop: 8,
        }}
      >
        <button
          type="button"
          onClick={() => handleScroll(-1)}
          style={{
            border: "1px solid rgba(210,170,95,0.65)",
            background: "rgba(32,20,12,0.82)",
            color: "#e4c48f",
            borderRadius: 4,
            padding: "4px 10px",
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Scroll Left
        </button>
        <button
          type="button"
          onClick={() => handleScroll(1)}
          style={{
            border: "1px solid rgba(210,170,95,0.65)",
            background: "rgba(32,20,12,0.82)",
            color: "#e4c48f",
            borderRadius: 4,
            padding: "4px 10px",
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Scroll Right
        </button>
      </div>

      {/* Google Font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" />

      {/* Wall sconces */}
      <div aria-hidden="true" style={{ display:"flex", justifyContent:"space-between", padding:"0 48px", marginBottom:"-8px", position:"relative", zIndex:2 }}>
        {[0, 1].map(i => (
          <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", paddingTop: 18 }}>
            <div style={{ width:28, height:16, background:"linear-gradient(180deg,#9a8462,#7a6442)", borderRadius:"50% 50% 0 0", boxShadow:"0 0 20px 8px rgba(210,165,80,0.18), inset 0 -3px 6px rgba(0,0,0,0.3)" }} />
            <div style={{ width:3, height:20, background:"#7a6040", borderRadius:2 }} />
            <div style={{ width:8, height:8, background:"#5a4830", borderRadius:"0 0 3px 3px" }} />
          </div>
        ))}
      </div>

      <motion.div
        animate={{ scale: stageScale }}
        transition={{ duration: 0.26 }}
        style={{ transformOrigin: "center center" }}
      >
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
                <div style={{ height: 30 }} />

                {/* Book row */}
                <div style={{
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
                        onHoverStart={() => setHoveredId(item.project.id)}
                        onHoverEnd={() => setHoveredId(id => id === item.project.id ? null : id)}
                        onClick={() => handleOpenSequence(item.project)}
                      />
                    </div>
                  ))}
                </div>

                {/* Walnut plank surface */}
                <div style={{
                  height: 24,
                  background: [
                    "linear-gradient(180deg,",
                    " #b87828 0%, #9a6420 12%,",
                    " #8a5618 28%, #7a4c16 45%,",
                    " #8a5618 62%, #9a6420 78%,",
                    " #7a4c16 100%)",
                  ].join(""),
                  position:"relative", zIndex:2,
                  boxShadow:"0 8px 24px rgba(0,0,0,0.60), inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.35)",
                  overflow:"hidden",
                }}>
                  {/* Wood grain lines */}
                  <div style={{
                    position:"absolute", inset:0,
                    backgroundImage:[
                      "repeating-linear-gradient(90deg, transparent 0px, transparent 14px, rgba(0,0,0,0.055) 14px, rgba(0,0,0,0.055) 15px)",
                      "repeating-linear-gradient(90deg, transparent 0px, transparent 30px, rgba(255,255,255,0.025) 30px, rgba(255,255,255,0.025) 31px)",
                    ].join(","),
                  }} />
                  {/* Top highlight stripe */}
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"rgba(255,255,255,0.10)" }} />
                </div>

                {/* Plank underside (thickness) */}
                <div style={{
                  height: 9,
                  background:"linear-gradient(180deg,#4a2c0c 0%,#3a2008 100%)",
                  boxShadow:"0 4px 12px rgba(0,0,0,0.5)",
                  zIndex:2, position:"relative",
                }} />

                {/* Cast shadow below shelf */}
                <div style={{
                  height: 22,
                  background:"linear-gradient(180deg,rgba(0,0,0,0.38) 0%,transparent 100%)",
                  position:"relative", zIndex:0,
                }} />

              </section>
            ))}

          </div>
        </div>
      </motion.div>

      {/* Hover hint */}
      <p style={{
        textAlign:"center",
        color:"rgba(255,255,255,0.22)",
        fontSize:12,
        fontFamily:"Georgia, serif",
        fontStyle:"italic",
        letterSpacing:"0.12em",
        marginTop:12,
        userSelect:"none",
      }}>
        {hoveredId
            ? "click to open this project"
            : "your projects, shelved - use wheel or scroll buttons"}
      </p>
    </section>
  );
}