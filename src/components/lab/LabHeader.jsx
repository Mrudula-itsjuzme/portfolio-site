import { useEffect, useState, useCallback } from "react";
import { identity, currentStatuses } from "../../data/lab";
import { playClickSound } from "./sound";

export default function LabHeader({ soundEnabled }) {
  const [statusIndex, setStatusIndex] = useState(0);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("lab-theme") || "paper";
    } catch {
      return "paper";
    }
  });
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const t = setInterval(() => {
      setStatusIndex((i) => (i + 1) % currentStatuses.length);
    }, 5200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("lab-theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    const sections = ["work", "research", "words"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.2, rootMargin: "-10% 0px -45% 0px" }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = useCallback(() => {
    playClickSound(soundEnabled);
    setTheme((current) => (current === "paper" ? "night" : "paper"));
  }, [soundEnabled]);

  return (
    <header className="lab-header">
      <a href="#top" className="exe" aria-label="back to top" onClick={() => playClickSound(soundEnabled)}>
        ✳ {identity.handle}
      </a>

      <p className="lab-status" aria-live="off">
        “{currentStatuses[statusIndex]}”
      </p>

      <nav className="lab-nav" aria-label="primary">
        {[
          ["work", "work"],
          ["research", "research"],
          ["words", "writing"],
        ].map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className={activeSection === id ? "active" : ""}
            onClick={() => playClickSound(soundEnabled)}
          >
            {label}
          </a>
        ))}

        <a href={identity.links.github} target="_blank" rel="noreferrer" className="nav-ext">
          github ↗
        </a>
        <a href={identity.links.linkedin} target="_blank" rel="noreferrer" className="nav-ext">
          linkedin ↗
        </a>
        <button type="button" className="header-pill-btn theme-btn" onClick={toggleTheme} title="switch the lights">
          {theme === "paper" ? "lights ↓" : "lights ↑"}
        </button>
      </nav>
    </header>
  );
}
