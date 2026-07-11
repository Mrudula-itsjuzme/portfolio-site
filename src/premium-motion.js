const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function initPremiumMotion() {
  const root = document.documentElement;
  const body = document.body;

  body.dataset.premiumMotion = "ready";

  let pointerFrame = 0;
  let scrollFrame = 0;

  const updatePointer = (event) => {
    if (reduceMotion.matches) return;
    if (pointerFrame) cancelAnimationFrame(pointerFrame);

    pointerFrame = requestAnimationFrame(() => {
      const x = event.clientX;
      const y = event.clientY;
      const nx = x / Math.max(window.innerWidth, 1) - 0.5;
      const ny = y / Math.max(window.innerHeight, 1) - 0.5;

      root.style.setProperty("--pointer-x", `${x}px`);
      root.style.setProperty("--pointer-y", `${y}px`);
      root.style.setProperty("--pointer-nx", nx.toFixed(4));
      root.style.setProperty("--pointer-ny", ny.toFixed(4));
    });
  };

  const updateScroll = () => {
    if (scrollFrame) cancelAnimationFrame(scrollFrame);

    scrollFrame = requestAnimationFrame(() => {
      const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = clamp(window.scrollY / scrollable, 0, 1);
      root.style.setProperty("--scroll-progress", progress.toFixed(4));
      root.style.setProperty("--scroll-y", `${window.scrollY}px`);
    });
  };

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.dataset.revealed = "true";
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
  );

  const attachReveals = () => {
    document.querySelectorAll(".archive-main > section").forEach((section, index) => {
      section.dataset.cinematicSection = String(index + 1);
      revealObserver.observe(section);
    });
  };

  const magneticElements = document.querySelectorAll(
    ".resume-btn, .sound-toggle, .shelf-nav-btn, .topbar-nav a",
  );

  magneticElements.forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      if (reduceMotion.matches) return;
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      element.style.setProperty("--magnet-x", `${x * 7}px`);
      element.style.setProperty("--magnet-y", `${y * 5}px`);
    });

    element.addEventListener("pointerleave", () => {
      element.style.setProperty("--magnet-x", "0px");
      element.style.setProperty("--magnet-y", "0px");
    });
  });

  window.addEventListener("pointermove", updatePointer, { passive: true });
  window.addEventListener("scroll", updateScroll, { passive: true });
  window.addEventListener("resize", updateScroll, { passive: true });

  attachReveals();
  updateScroll();

  const catalogueObserver = new MutationObserver(() => attachReveals());
  const archive = document.querySelector(".archive-main");
  if (archive) catalogueObserver.observe(archive, { childList: true });

  return () => {
    window.removeEventListener("pointermove", updatePointer);
    window.removeEventListener("scroll", updateScroll);
    window.removeEventListener("resize", updateScroll);
    revealObserver.disconnect();
    catalogueObserver.disconnect();
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPremiumMotion, { once: true });
} else {
  initPremiumMotion();
}
