import { useEffect, useRef } from "react";

const MAX_DUST = 14;

/**
 * Ink-pen cursor: halo on hoverables, press squash, ink blots on click,
 * grab state while dragging sticky notes, restrained pencil-dust trail,
 * magnetic tilt on nearby interactive elements.
 * Pointer-fine devices only; fully disabled under prefers-reduced-motion.
 */
export default function LabCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqFine = window.matchMedia("(pointer: fine)");
    let reduced = mqReduced.matches;
    let active = false;
    let raf = 0;
    let mouse = { x: -100, y: -100 };
    let soft = { x: -100, y: -100 };
    let lastDust = 0;
    const dust = [];
    const disposers = [];

    function makeDust() {
      const el = document.createElement("span");
      el.className = "cursor-dust";
      const size = 2 + Math.random() * 2.5;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.opacity = "0";
      document.body.appendChild(el);
      dust.push({ el, life: 0 });
      return el;
    }

    function spawnDust(x, y, boost) {
      const now = performance.now();
      if (now - lastDust < 90) return; // rate limit — never spam
      lastDust = now;
      const slot =
        dust.find((d) => d.life <= 0) || (dust.length < MAX_DUST ? { el: makeDust(), life: 0 } : null);
      if (!slot) return;
      slot.life = 1;
      slot.el.style.transform = `translate(${x + (Math.random() * 10 - 5)}px, ${
        y + 6 + Math.random() * 6
      }px)`;
      slot.el.style.opacity = boost ? "0.5" : "0.32";
    }

    function spawnBlot(x, y) {
      const el = document.createElement("span");
      el.className = "ink-blot";
      const size = 26 + Math.random() * 18;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      document.body.appendChild(el);
      el.addEventListener("animationend", () => el.remove(), { once: true });
    }

    function tick() {
      raf = requestAnimationFrame(tick);
      soft.x += (mouse.x - soft.x) * 0.22;
      soft.y += (mouse.y - soft.y) * 0.22;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${soft.x}px, ${soft.y}px)`;
      }
      for (const d of dust) {
        if (d.life > 0) {
          d.life -= 0.045;
          const el = d.el;
          const m = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(el.style.transform);
          if (m) {
            el.style.transform = `translate(${m[1]}px, ${parseFloat(m[2]) + 0.7}px) scale(${
              0.96 + d.life * 0.1
            })`;
          }
          el.style.opacity = String(Math.max(0, d.life) * 0.4);
        }
      }
    }

    function onMove(e) {
      mouse = { x: e.clientX, y: e.clientY };
      const el = e.target;
      const interactive = el.closest?.("a, button, [data-magnetic], input, [role='button']");
      const note = el.closest?.(".sticky-note");
      cursorRef.current?.classList.toggle("cursor-hover", !!interactive && !note);
      cursorRef.current?.classList.toggle("cursor-grab", !!note);
      if (interactive) {
        spawnDust(mouse.x, mouse.y, true);
        if (interactive.dataset.magnetic !== "off" && interactive.animate) {
          const r = interactive.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
          const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
          interactive.style.transform = `perspective(600px) rotateX(${(-dy * 4).toFixed(2)}deg) rotateY(${(dx * 4).toFixed(2)}deg)`;
          interactive.dataset.magnetized = "1";
          disposers.push(() => {
            interactive.style.transform = "";
          });
        }
      } else {
        spawnDust(mouse.x, mouse.y, false);
        document.querySelectorAll("[data-magnetized='1']").forEach((el) => {
          el.style.transform = "";
          el.removeAttribute("data-magnetized");
        });
      }
    }

    function onDown(e) {
      cursorRef.current?.classList.add("cursor-press");
      spawnBlot(e.clientX, e.clientY);
      spawnDust(e.clientX, e.clientY, true);
    }
    function onUp() {
      cursorRef.current?.classList.remove("cursor-press");
    }

    function onLeave() {
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
    }
    function onEnter() {
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
    }

    function setup() {
      if (active || reduced || !mqFine.matches) return;
      active = true;
      document.body.classList.add("lab-cursor-active");
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mousedown", onDown);
      window.addEventListener("mouseup", onUp);
      document.documentElement.addEventListener("mouseleave", onLeave);
      document.documentElement.addEventListener("mouseenter", onEnter);
      raf = requestAnimationFrame(tick);
      disposers.push(() => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mousedown", onDown);
        window.removeEventListener("mouseup", onUp);
        document.documentElement.removeEventListener("mouseleave", onLeave);
        document.documentElement.removeEventListener("mouseenter", onEnter);
        document.body.classList.remove("lab-cursor-active");
        document.querySelectorAll("[data-magnetized='1']").forEach((el) => {
          el.style.transform = "";
          el.removeAttribute("data-magnetized");
        });
        cursorRef.current?.classList.remove("cursor-hover", "cursor-press", "cursor-grab");
      });
    }

    function teardown() {
      if (!active) return;
      active = false;
      cancelAnimationFrame(raf);
      while (disposers.length) disposers.pop()();
      dust.forEach((d) => {
        d.life = 0;
        d.el.style.opacity = "0";
      });
    }

    const onReduceChange = () => {
      reduced = mqReduced.matches;
      if (reduced) teardown();
    };
    mqReduced.addEventListener?.("change", onReduceChange);

    setup();

    return () => {
      mqReduced.removeEventListener?.("change", onReduceChange);
      teardown();
      cancelAnimationFrame(raf);
      dust.forEach((d) => d.el.remove());
    };
  }, []);

  return (
    <div className="lab-cursor" ref={cursorRef} aria-hidden="true" style={{ opacity: 0 }}>
      <span className="cursor-halo" />
      <span className="cursor-dot" />
      <span className="cursor-nib" />
    </div>
  );
}
