import { useEffect, useRef, useState } from "react";
import { useCoarsePointer, usePrefersReducedMotion } from "./StickyNote";

const TILT_MAX = 5;

/** Photo that gently tilts toward the pointer (polaroid feel). Pointer-fine only. */
export default function TiltPhoto({ src, alt, caption, className = "", rotate = 0, parallax = 0 }) {
  const ref = useRef(null);
  const coarse = useCoarsePointer();
  const reduced = usePrefersReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState(0);

  const interactive = !coarse && !reduced;

  useEffect(() => {
    if (!interactive) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      // only respond while the pointer is reasonably near the photo
      if (Math.abs(dx) < 1.6 && Math.abs(dy) < 1.6) {
        setTilt({
          x: (-dy * TILT_MAX).toFixed(2),
          y: (dx * TILT_MAX).toFixed(2),
        });
      } else {
        setTilt({ x: 0, y: 0 });
      }
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, [interactive]);

  useEffect(() => {
    if (!interactive || !parallax) return;
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (r.top + r.height / 2 - vh / 2) / vh; // -~1 .. 1
      setOffset((-progress * parallax).toFixed(1));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [interactive, parallax]);

  return (
    <figure
      ref={ref}
      className={`polaroid tilt-target ${className}`}
      style={{
        transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${offset}px) rotate(${rotate}deg)`,
        transition: "transform 0.18s ease-out",
        margin: 0,
      }}
    >
      <span className="pin" aria-hidden="true" />
      <img src={src} alt={alt} loading="lazy" decoding="async" />
      {caption ? <figcaption className="polaroid-caption">{caption}</figcaption> : null}
    </figure>
  );
}
