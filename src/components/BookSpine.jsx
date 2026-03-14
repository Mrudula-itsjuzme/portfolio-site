import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Bookshelf from "../components/Bookshelf";
import { projects as fallbackProjects } from "../data/projects";

const BookViewer = lazy(() => import("../components/BookViewer"));

const leatherCycle = [
  "leather-oxblood",
  "leather-forest",
  "leather-navy",
  "leather-charcoal",
  "leather-brown",
];

const accentCycle = [
  "#c9a96a",
  "#b89054",
  "#a88046",
  "#d3b279",
  "#b58e5f",
];

function prettyName(raw) {
  return String(raw || "Project")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function mapRepoToProject(repo, index) {
  const title = prettyName(repo?.name);
  const category = repo?.language || "Repository";
  const description =
    repo?.description ||
    "Repository with implementation details and project artifacts.";
  const topics =
    Array.isArray(repo?.topics) && repo.topics.length
      ? repo.topics
      : ["engineering", "portfolio"];
  const leather = leatherCycle[index % leatherCycle.length];
  const accent = accentCycle[index % accentCycle.length];

  return {
    id: String(repo?.id || repo?.name || `project-${index}`),
    title,
    spineTitle: title,
    category,
    leather,
    accent,
    githubUrl: repo?.url || "https://github.com/Mrudula-itsjuzme",
    demoUrl: repo?.homepage || "https://mrudula-itsjuzme.vercel.app",
    pages: [
      {
        kind: "cover",
        title,
        subtitle: category,
        author: "Mrudula",
        year: new Date().getFullYear().toString(),
      },
      {
        kind: "overview",
        title: "Overview",
        bullets: [
          `Problem: ${description}`,
          `Goal: build a reliable ${category.toLowerCase()} implementation.`,
          `Focus: ${topics.slice(0, 3).join(", ")}`,
        ],
      },
      {
        kind: "architecture",
        title: "Architecture",
        diagram: ["Input", "Processing", "Core Logic", "Output"],
        text: "The system is structured as a modular processing pipeline enabling scalable and testable components.",
      },
      {
        kind: "workflow",
        title: "Workflow",
        bullets: [
          "Collect and validate inputs",
          "Execute the implementation pipeline",
          "Capture outputs and behavior",
          "Iterate with testing feedback",
        ],
      },
      {
        kind: "stack",
        title: "Tech Stack",
        bullets: [repo?.language || "Mixed", ...topics.slice(0, 3)],
      },
      {
        kind: "resources",
        title: "Resources",
        bullets: [
          "Repository documentation",
          `Stars: ${repo?.stars ?? 0}`,
          `Forks: ${repo?.forks ?? 0}`,
        ],
      },
      { kind: "github", title: "GitHub", buttonText: "View Code" },
    ],
  };
}

/* ---------------------------------- */
/* Audio                              */
/* ---------------------------------- */

function playTone(type, contextRef) {
  const Context = window.AudioContext || window.webkitAudioContext;
  if (!Context) return;
  if (!contextRef.current) contextRef.current = new Context();
  const ctx = contextRef.current;
  if (ctx.state === "suspended") ctx.resume();

  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === "pull") {
    osc.frequency.value = 280;
    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);
    osc.start();
    osc.stop(ctx.currentTime + 0.14);
    return;
  }

  osc.frequency.value = 520;
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);
  osc.start();
  osc.stop(ctx.currentTime + 0.09);
}

/* ---------------------------------- */
/* Floating dust motes                */
/* ---------------------------------- */

function DustField({ count = 18 }) {
  const motes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left:  `${(i * 19 + 3) % 98}%`,
        top:   `${(i * 13 + 7) % 80}%`,
        size:  1 + (i % 3) * 0.8,
        delay: `${(i * 0.6) % 8}s`,
        dur:   `${7 + (i % 5) * 2}s`,
      })),
    [count]
  );

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {motes.map((m) => (
        <motion.span
          key={m.id}
          style={{
            position: "absolute",
            left: m.left,
            top: m.top,
            width:  m.size,
            height: m.size,
            borderRadius: "50%",
            background: "rgba(220,195,140,0.45)",
          }}
          animate={{
            y: [0, -28, 0],
            opacity: [0, 0.55, 0],
          }}
          transition={{
            duration: parseFloat(m.dur),
            delay: parseFloat(m.delay),
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ---------------------------------- */
/* Wall sconces                       */
/* ---------------------------------- */

function Sconce({ side }) {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        [side]: 40,
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 16,
      }}
    >
      {/* glow bloom */}
      <div
        style={{
          position: "absolute",
          top: 22,
          width: 140,
          height: 100,
          background:
            "radial-gradient(ellipse at 50% 10%, rgba(210,165,80,0.2) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* arm */}
      <div style={{ width: 3, height: 24, background: "#8a7050", borderRadius: 2 }} />
      {/* shade */}
      <div
        style={{
          width: 28,
          height: 18,
          background: "linear-gradient(180deg,#9e8462 0%,#7a6040 100%)",
          borderRadius: "50% 50% 0 0",
          boxShadow:
            "0 0 24px 10px rgba(210,165,80,0.18), inset 0 -3px 5px rgba(0,0,0,0.3)",
        }}
      />
      {/* mount */}
      <div style={{ width: 9, height: 7, background: "#5a4030", borderRadius: "0 0 3px 3px" }} />
    </div>
  );
}

/* ---------------------------------- */
/* Home                               */
/* ---------------------------------- */

export default function Home() {
  const [openProject,  setOpenProject]  = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(
    () => localStorage.getItem("library-sound") !== "off"
  );
  const [projects,   setProjects]   = useState(fallbackProjects);
  const [isLoading,  setIsLoading]  = useState(true);
  const [loadError,  setLoadError]  = useState(null);

  const audioContextRef = useRef(null);

  function handleToggleSound() {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem("library-sound", next ? "on" : "off");
  }

  /* Load GitHub projects */
  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/projects", { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        const repos   = Array.isArray(payload?.projects) ? payload.projects : [];
        if (repos.length) setProjects(repos.map((r, i) => mapRepoToProject(r, i)));
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Project load failed:", err);
          setLoadError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
    return () => controller.abort();
  }, []);

  /* Escape to close */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setOpenProject(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className="library-shell"
      style={{
        minHeight: "100vh",
        background: [
          /* deep forest green wall */
          "#1c3828",
          /* warm light from top-right sconce */
          "radial-gradient(ellipse at 92% 0%,   rgba(200,155,70,0.16) 0%, transparent 50%)",
          /* warm light from top-left sconce */
          "radial-gradient(ellipse at 8%  0%,   rgba(200,155,70,0.10) 0%, transparent 42%)",
          /* floor darkening */
          "radial-gradient(ellipse at 50% 120%,  rgba(0,0,0,0.55)    0%, transparent 55%)",
          /* subtle wall texture */
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.008) 0px, rgba(255,255,255,0.008) 1px, transparent 1px, transparent 80px)",
          "repeating-linear-gradient(0deg,  rgba(255,255,255,0.008) 0px, rgba(255,255,255,0.008) 1px, transparent 1px, transparent 80px)",
        ].join(","),
        backgroundBlendMode: "normal",
        fontFamily: "'Playfair Display', Georgia, serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Google font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lora:ital@0;1&display=swap"
      />

      {/* Ambient dust */}
      <DustField count={18} />

      {/* Wall sconces */}
      <Sconce side="left"  />
      <Sconce side="right" />

      {/* ── Top bar ───────────────────────────────── */}
      <header
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "36px 52px 28px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* eyebrow */}
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(200,175,120,0.65)",
              marginBottom: 6,
              fontFamily: "'Lora', Georgia, serif",
              fontStyle: "italic",
            }}
          >
            Digital Stacks
          </p>

          {/* main title */}
          <h1
            style={{
              fontSize: "clamp(24px, 4vw, 40px)",
              fontWeight: 600,
              color: "rgba(240,228,200,0.92)",
              letterSpacing: "0.02em",
              lineHeight: 1.15,
              margin: 0,
              textShadow: "0 2px 18px rgba(0,0,0,0.45)",
            }}
          >
            Project Library
          </h1>

          {/* sub hint */}
          <p
            style={{
              marginTop: 8,
              fontSize: 13,
              fontFamily: "'Lora', Georgia, serif",
              fontStyle: "italic",
              color: "rgba(200,185,150,0.45)",
              letterSpacing: "0.06em",
            }}
          >
            hover · pull · open
          </p>
        </motion.div>

        {/* Sound toggle */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={handleToggleSound}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "0.5px solid rgba(200,175,120,0.22)",
            borderRadius: 4,
            color: "rgba(200,175,120,0.6)",
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontFamily: "'Lora', Georgia, serif",
            padding: "7px 14px",
            cursor: "pointer",
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(200,175,120,0.10)";
            e.currentTarget.style.color = "rgba(220,200,150,0.9)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.color = "rgba(200,175,120,0.6)";
          }}
        >
          {soundEnabled ? "♪  Sound" : "♪  Muted"}
        </motion.button>
      </header>

      {/* ── Loading state ─────────────────────────── */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              padding: "80px 0",
              position: "relative",
              zIndex: 5,
            }}
          >
            {/* Pulsing book stack icon */}
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                display: "flex",
                gap: 4,
                alignItems: "flex-end",
              }}
            >
              {[38, 52, 44, 48, 36].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 12,
                    height: h,
                    background: `hsl(${150 + i * 18}, 28%, ${30 + i * 4}%)`,
                    borderRadius: "1px 2px 1px 1px",
                    boxShadow: "1px 0 3px rgba(0,0,0,0.35)",
                  }}
                />
              ))}
            </motion.div>

            <p
              style={{
                color: "rgba(200,185,150,0.45)",
                fontSize: 12,
                fontFamily: "'Lora', Georgia, serif",
                fontStyle: "italic",
                letterSpacing: "0.14em",
              }}
            >
              Loading projects…
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Shelves ───────────────────────────────── */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ position: "relative", zIndex: 5 }}
        >
          <Bookshelf
            projects={projects}
            onOpenProject={(p) => setOpenProject(p)}
            onBookPullSound={() =>
              soundEnabled && playTone("pull", audioContextRef)
            }
          />
        </motion.div>
      )}

      {/* ── Error notice ──────────────────────────── */}
      <AnimatePresence>
        {loadError && !isLoading && (
          <motion.p
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              textAlign: "center",
              color: "rgba(200,120,100,0.6)",
              fontSize: 12,
              fontFamily: "'Lora', Georgia, serif",
              fontStyle: "italic",
              letterSpacing: "0.1em",
              padding: "12px 0",
              position: "relative",
              zIndex: 5,
            }}
          >
            Could not reach GitHub — showing local projects.
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Book viewer overlay ───────────────────── */}
      <AnimatePresence>
        {openProject && (
          <Suspense
            fallback={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  position: "fixed",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(14,28,20,0.72)",
                  color: "rgba(210,190,145,0.7)",
                  fontSize: 13,
                  fontFamily: "'Lora', Georgia, serif",
                  fontStyle: "italic",
                  letterSpacing: "0.14em",
                  zIndex: 50,
                  backdropFilter: "blur(4px)",
                }}
              >
                Opening…
              </motion.div>
            }
          >
            <BookViewer
              project={openProject}
              onClose={() => setOpenProject(null)}
              onPageFlipSound={() =>
                soundEnabled && playTone("flip", audioContextRef)
              }
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* ── Desk surface at bottom ────────────────── */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 56,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.35) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </div>
  );
}