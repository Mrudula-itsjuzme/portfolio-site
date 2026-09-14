/**
 * useViewMode — manages "simple" vs "immersive" view preference.
 *
 * Resolution order (highest wins):
 *  1. Explicit localStorage value set by the user toggle
 *  2. prefers-reduced-motion media query → auto-defaults to "simple"
 *  3. Falls back to "immersive"
 */
import { useCallback, useEffect, useState } from "react";

const LS_KEY = "portfolio-view-mode";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function resolveInitial() {
  try {
    const stored = localStorage.getItem(LS_KEY);
    if (stored === "simple" || stored === "immersive") return stored;
  } catch (_) { /* private browsing */ }
  return prefersReducedMotion() ? "simple" : "immersive";
}

export function useViewMode() {
  const [mode, setMode] = useState(resolveInitial);

  // Keep in sync if the OS setting changes at runtime (e.g. user flips system preference)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e) => {
      // Only auto-switch if the user hasn't set an explicit preference
      try {
        const stored = localStorage.getItem(LS_KEY);
        if (!stored && e.matches) setMode("simple");
      } catch (_) { /* ignore */ }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next = prev === "simple" ? "immersive" : "simple";
      try { localStorage.setItem(LS_KEY, next); } catch (_) { /* ignore */ }
      return next;
    });
  }, []);

  const isSimple = mode === "simple";
  const isImmersive = mode === "immersive";

  return { mode, isSimple, isImmersive, toggle };
}
