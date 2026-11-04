import { useEffect, useState, useCallback, useRef } from "react";
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
  const moreRef = useRef(null);

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

  useEffect(() => {
    const closeOnOutside = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        moreRef.current.open = false;
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape" && moreRef.current?.open) {
        moreRef.current.open = false;
        moreRef.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const closeMore = () => {
    if (moreRef.current) moreRef.current.open = false;
  };

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

        <details className="lab-more-menu" ref={moreRef}>
          <summary aria-label="More navigation and contact links">more <span aria-hidden="true">⌄</span></summary>
          <div className="lab-more-links">
            <a className="mobile-only-link" href="#contributions" onClick={closeMore}>contributions</a>
            <a className="mobile-only-link compact-only-link" href="#research" onClick={closeMore}>research section</a>
            <a className="mobile-only-link" href="#words" onClick={closeMore}>writing</a>
            <a href="/research.html" onClick={closeMore}>publications ↗</a>
            <a href="/impact.html" onClick={closeMore}>impact / community ↗</a>
            <a href="/work-with-me.html" onClick={closeMore}>hire / collaborate ↗</a>
            <a href="/resume.pdf" target="_blank" rel="noreferrer" onClick={closeMore}>resume ↗</a>
            <a href={identity.links.github} target="_blank" rel="noreferrer" onClick={closeMore}>github ↗</a>
            <a href={identity.links.orcid} target="_blank" rel="noreferrer" onClick={closeMore}>ORCID ↗</a>
            <a href={identity.links.linkedin} target="_blank" rel="noreferrer" onClick={closeMore}>linkedin ↗</a>
          </div>
        </details>
        <button type="button" className="header-pill-btn theme-btn" onClick={toggleTheme} title="switch the lights">
          {theme === "paper" ? "lights ↓" : "lights ↑"}
        </button>
      </nav>
    </header>
  );
}
