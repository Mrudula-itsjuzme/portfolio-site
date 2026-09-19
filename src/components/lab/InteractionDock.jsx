import { useEffect, useState } from "react";

function burst(x = window.innerWidth / 2, y = window.innerHeight / 2) {
  const glyphs = ["✦", "✧", "·", "★", "✶"];
  for (let i = 0; i < 24; i++) {
    const el = document.createElement("span");
    el.className = "chaos-spark";
    el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    const angle = (Math.PI * 2 * i) / 24 + Math.random() * 0.18;
    const distance = 35 + Math.random() * 110;
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.setProperty("--dx", Math.cos(angle) * distance + "px");
    el.style.setProperty("--dy", Math.sin(angle) * distance + "px");
    el.style.animationDelay = Math.random() * 80 + "ms";
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove(), { once: true });
  }
}

export default function InteractionDock({ doodleActive, onToggleDoodle }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() === "s") {
        window.dispatchEvent(new CustomEvent("lab:shuffle"));
      }
      if (e.key.toLowerCase() === "d") {
        onToggleDoodle();
      }
      if (e.key === "*") {
        burst();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onToggleDoodle]);

  const shuffle = () => {
    window.dispatchEvent(new CustomEvent("lab:shuffle"));
    document.body.classList.remove("lab-shake");
    requestAnimationFrame(() => {
      document.body.classList.add("lab-shake");
      setTimeout(() => document.body.classList.remove("lab-shake"), 520);
    });
  };

  const reset = () => {
    try {
      localStorage.removeItem("mrudula-workboard-v1");
      localStorage.removeItem("lab-notes-v1");
    } catch {}
    window.dispatchEvent(new CustomEvent("lab:reset-layout"));
  };

  return (
    <div className={"interaction-dock" + (open ? " open" : "")}>
      <button
        type="button"
        className="interaction-main"
        aria-expanded={open}
        aria-label="open interaction tools"
        onClick={() => setOpen((v) => !v)}
      >
        <span>✦</span>
      </button>

      <div className="interaction-fan" aria-hidden={!open}>
        <button type="button" onClick={shuffle} title="shuffle movable scraps (S)">shuffle</button>
        <button type="button" onClick={onToggleDoodle} className={doodleActive ? "active" : ""} title="draw on the page (D)">
          {doodleActive ? "done" : "draw"}
        </button>
        <button type="button" onClick={(e) => burst(e.clientX, e.clientY)} title="unnecessary sparkles (*)">sparkles</button>
        <button type="button" onClick={reset} title="reset movable stuff">reset</button>
      </div>

      {open ? <span className="interaction-hint">s / d / *</span> : null}
    </div>
  );
}
