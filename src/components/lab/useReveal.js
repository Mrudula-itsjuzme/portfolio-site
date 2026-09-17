import { useEffect, useRef } from "react";

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
      { threshold: 0.05, rootMargin: "0px 0px 50px 0px" }
    );
    io.observe(el);

    // Fallback: guarantee visibility after 1.2s
    const t = setTimeout(() => {
      el.classList.add("in-view");
    }, 1200);

    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, [hidden]);
  return ref;
}

/** Global hook to auto-reveal ALL .reveal elements on the page (even without explicit refs). */
export function useGlobalReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px 60px 0px" }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    // Fallback timer: ensure all elements become visible
    const timer = setTimeout(() => {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in-view"));
    }, 1000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);
}
