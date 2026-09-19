import { useEffect } from "react";

/**
 * Keep the real cursor. This layer only drops tiny hand-drawn sparkles.
 * No fake nib, no magnetic hijacking, no cursor lag.
 */
export default function LabCursor() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let last = 0;
    const colors = ["var(--clay)", "var(--moss)", "var(--butter)", "var(--pink)", "var(--cyan)"];

    const sparkle = (x, y, big = false) => {
      const el = document.createElement("span");
      el.className = big ? "pointer-spark pointer-spark-big" : "pointer-spark";
      el.textContent = Math.random() > 0.5 ? "✦" : "·";
      el.style.left = `${x + (Math.random() * 10 - 5)}px`;
      el.style.top = `${y + (Math.random() * 10 - 5)}px`;
      el.style.color = colors[Math.floor(Math.random() * colors.length)];
      document.body.appendChild(el);
      el.addEventListener("animationend", () => el.remove(), { once: true });
    };

    const onMove = (e) => {
      const now = performance.now();
      if (now - last < 85) return;
      last = now;
      if (Math.random() > 0.58) sparkle(e.clientX, e.clientY);
    };

    const onClick = (e) => {
      for (let i = 0; i < 6; i++) {
        setTimeout(() => sparkle(e.clientX, e.clientY, true), i * 18);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      document.querySelectorAll(".pointer-spark").forEach((el) => el.remove());
    };
  }, []);

  return null;
}
