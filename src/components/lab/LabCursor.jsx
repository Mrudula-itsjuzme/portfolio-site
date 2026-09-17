import { useEffect, useRef } from "react";

/**
 * Ink-pen cursor with a restrained pencil-dust trail and magnetic tilt on
 * nearby interactive elements. Pointer (fine) devices only; disabled entirely
 * under prefers-reduced-motion.
 */
export default function LabCursor() {
  const cursorRef = useRef(null);
  const reduced = useRef(false);

  useEffect(() => {
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqFine = window.matchMedia("(pointer: fine)");
    reduced.current = mqReduced.matches;

    const onReduceChange = () => {
      reduced.current = mqReduced.matches;
      if (reduced.current) teardown();
    };
    mqReduced.addEventListener?.("change", onReduceChange);

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
        dust.find((d) => d.life <= 0) || (dust.length < 14 ? { el: makeDust(), life: 0 } : null);
      if (!slot) return;
      slot.life = 1;
      slot.el.style.transform = `translate(${x + (Math.random() * 10 - 5)}px, ${
        y + 6 + Math.random() * 6
      }px)`;
      slot.el.style.opacity = boost ? "0.5" : "0.32";
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
      const interactive = el.closest?.("a, button, [data-magnetic]");
      cursorRef.current?.classList.toggle("cursor-hover", !!interactive);
      if (interactive) {
        spawnDust(mouse.x, mouse.y, true);
        if (interactive.dataset.magnetic !== "off" && interactive.animate) {
          const r = interactive.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
          const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
          interactive.style.transform = `perspective(600px) rotateX(${(-dy * 4).toFixed(
            2
          )}deg) rotateY(${(dx * 4).toFixed(2)}deg)`;
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

    function onLeave() {
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
    }
    function onEnter() {
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
    }

    function setup() {
      if (active || reduced.current || !mqFine.matches) return;
      active = true;
      document.body.classList.add("lab-cursor-active");
      window.addEventListener("mousemove", onMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
      document.documentElement.addEventListener("mouseenter", onEnter);
      raf = requestAnimationFrame(tick);
      disposers.push(() => {
        window.removeEventListener("mousemove", onMove);
        document.documentElement.removeEventListener("mouseleave", onLeave);
        document.documentElement.removeEventListener("mouseenter", onEnter);
        document.body.classList.remove("lab-cursor-active");
        document.querySelectorAll("[data-magnetized='1']").forEach((el) => {
          el.style.transform = "";
          el.removeAttribute("data-magnetized");
        });
        cursorRef.current?.classList.remove("cursor-hover");
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
      <span className="cursor-dot" />
      <span className="cursor-nib" />
    </div>
  );
}
