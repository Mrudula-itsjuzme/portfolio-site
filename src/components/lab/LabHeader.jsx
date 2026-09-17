import { useEffect, useState, useCallback } from "react";
import { identity, currentStatuses } from "../../data/lab";
import { playClickSound, playPaperSound } from "./sound";

/** Sticky dark header: mrudula.exe, rotating status phrase, nav links, theme switcher, and fullscreen mode. */
export default function LabHeader({ soundEnabled, setSoundEnabled }) {
  const [statusIndex, setStatusIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("lab-theme") || "paper";
    } catch {
      return "paper";
    }
  });
  const [activeSection, setActiveSection] = useState("");

  // Rotating status phrase
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const t = setInterval(() => {
      setStatusIndex((i) => (i + 1) % currentStatuses.length);
    }, 3600);
    return () => clearInterval(t);
  }, []);

  // Theme application
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("lab-theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  // Fullscreen state listener
  useEffect(() => {
    const onFSChange = () => {
      const isFS = !!document.fullscreenElement;
      setIsFullscreen(isFS);
      if (isFS) {
        document.documentElement.setAttribute("data-fullscreen", "true");
      } else {
        document.documentElement.removeAttribute("data-fullscreen");
      }
    };

    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
  }, []);

  // Keyboard shortcut 'F' for Fullscreen toggle
  useEffect(() => {
    const onKeyDown = (e) => {
      if (
        (e.key === "f" || e.key === "F") &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName) &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullscreen]);

  // Active section scroll spy
  useEffect(() => {
    const sections = ["work", "research", "words"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: "-10% 0px -40% 0px" }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const toggleFullscreen = useCallback(() => {
    playClickSound(soundEnabled);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, [soundEnabled]);

  const cycleTheme = useCallback(() => {
    playPaperSound(soundEnabled);
    setTheme((current) => {
      if (current === "paper") return "night";
      if (current === "night") return "sunset";
      return "paper";
    });
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((s) => {
      const next = !s;
      playClickSound(next);
      try {
        localStorage.setItem("lab-sound", next ? "on" : "off");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, [setSoundEnabled]);

  const themeLabel = theme === "paper" ? "☀️ Paper" : theme === "night" ? "🌙 Night" : "🌅 Sunset";

  return (
    <header className="lab-header">
      <a href="#top" className="exe" aria-label="back to top" onClick={() => playPaperSound(soundEnabled)}>
        ✳ {identity.handle}
        <span className="blink" aria-hidden="true" />
      </a>
      <p className="lab-status" aria-live="off">
        <span className="sr-only">current status: </span>“{currentStatuses[statusIndex]}”
      </p>
      <nav className="lab-nav" aria-label="primary">
        <a
          href="#work"
          className={activeSection === "work" ? "active" : ""}
          onClick={() => playClickSound(soundEnabled)}
        >
          work
        </a>
        <a
          href="#research"
          className={activeSection === "research" ? "active" : ""}
          onClick={() => playClickSound(soundEnabled)}
        >
          research
        </a>
        <a
          href="#words"
          className={activeSection === "words" ? "active" : ""}
          onClick={() => playClickSound(soundEnabled)}
        >
          words
        </a>

        <button
          type="button"
          className="header-pill-btn theme-btn"
          onClick={cycleTheme}
          title="Switch Desk Lighting Theme"
        >
          {themeLabel}
        </button>

        <button
          type="button"
          className={`header-pill-btn sound-btn ${soundEnabled ? "on" : ""}`}
          onClick={toggleSound}
          title={soundEnabled ? "Sound FX Enabled" : "Sound FX Disabled"}
        >
          {soundEnabled ? "🔊 SFX" : "🔇 SFX"}
        </button>

        <button
          type="button"
          className={`header-pill-btn fs-btn ${isFullscreen ? "active" : ""}`}
          onClick={toggleFullscreen}
          title="Toggle Fullscreen Mode (Press 'F')"
        >
          {isFullscreen ? "🗗 Exit FS" : "⛶ Full Screen"}
        </button>

        <a href={identity.links.github} target="_blank" rel="noreferrer" className="nav-ext">
          github
        </a>
        <a href={identity.links.linkedin} target="_blank" rel="noreferrer" className="nav-ext">
          linkedin
        </a>
        <a href={identity.links.email} onClick={() => playClickSound(soundEnabled)}>
          contact
        </a>
      </nav>
    </header>
  );
}
