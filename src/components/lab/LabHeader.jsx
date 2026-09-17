import { useEffect, useState } from "react";
import { identity, currentStatuses } from "../../data/lab";

/** Sticky dark header: mrudula.exe, rotating status phrase, nav links. */
export default function LabHeader() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const t = setInterval(() => {
      setStatusIndex((i) => (i + 1) % currentStatuses.length);
    }, 3600);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="lab-header">
      <a href="#top" className="exe" aria-label="back to top">
        ✳ {identity.handle}
        <span className="blink" aria-hidden="true" />
      </a>
      <p className="lab-status" aria-live="off">
        <span className="sr-only">current status: </span>“{currentStatuses[statusIndex]}”
      </p>
      <nav className="lab-nav" aria-label="primary">
        <a href="#work">work</a>
        <a href="#research">research</a>
        <a href="#words">words</a>
        <a href={identity.links.github} target="_blank" rel="noreferrer" className="nav-ext">
          github
        </a>
        <a href={identity.links.linkedin} target="_blank" rel="noreferrer" className="nav-ext">
          linkedin
        </a>
        <a href={identity.links.email}>contact</a>
      </nav>
    </header>
  );
}
