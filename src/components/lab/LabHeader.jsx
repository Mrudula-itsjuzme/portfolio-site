import { useEffect, useState, useCallback } from "react";
import { identity } from "../../data/lab";
import { playClickSound } from "./sound";

export default function LabHeader({ soundEnabled }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("lab-theme") || "paper";
    } catch {
      return "paper";
    }
  });
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("lab-theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    const sections = ["work", "contributions", "research", "words"];
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
        ✳ mrudula.tech
      </a>

      <nav className="lab-nav" aria-label="primary">
        {[
          ["work", "work"],
          ["contributions", "contrib"],
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

        <details className="lab-more-menu">
          <summary>more <span aria-hidden="true">⌄</span></summary>
          <div className="lab-more-links">
            <a href="/research.html">publications ↗</a>
            <a href="/work-with-me.html">hire / collaborate ↗</a>
            <a href="/resume.pdf" target="_blank" rel="noreferrer">resume ↗</a>
            <a href={identity.links.github} target="_blank" rel="noreferrer">github ↗</a>
            <a href={identity.links.orcid} target="_blank" rel="noreferrer">ORCID ↗</a>
            <a href={identity.links.linkedin} target="_blank" rel="noreferrer">linkedin ↗</a>
          </div>
        </details>
        <button type="button" className="header-pill-btn theme-btn" onClick={toggleTheme} title="switch the lights">
          {theme === "paper" ? "lights ↓" : "lights ↑"}
        </button>
      </nav>
    </header>
  );
}
