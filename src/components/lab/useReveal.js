import { useEffect, useRef, useState } from "react";

/** Adds `in-view` when the element scrolls into the viewport (runs once).
 *  Pass `hidden: false` to observe without hiding the element itself. */
export default function useReveal({ hidden = true } = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!hidden) el.classList.add("reveal-auto");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in-view");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("in-view");
            io.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
