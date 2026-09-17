/** Tiny hand-drawn SVG doodles used across the lab. */

export function StarDoodle({ size = 22, className = "", style }) {
  return (
    <svg className={`doodle-svg ${className}`} style={style} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        className="ink"
        d="M12 3 L13.4 10.2 L21 12 L13.4 13.8 L12 21 L10.6 13.8 L3 12 L10.6 10.2 Z"
      />
    </svg>
  );
}

export function ArrowDoodle({ width = 90, className = "", style }) {
  return (
    <svg className={className} style={style} width={width} height="24" viewBox="0 0 90 24" aria-hidden="true">
      <path className="ink" d="M2 14 C 26 8, 54 16, 82 11" />
      <path className="ink" d="M74 6 L83 11 L74 17" />
    </svg>
  );
}

export function UnderlineScribble() {
  return (
    <svg viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden="true">
      <path d="M4 8 C 60 2, 120 12, 180 7 S 270 5, 296 9" />
    </svg>
  );
}

export function Sparkle({ size = 14, className = "", style }) {
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path className="ink" d="M12 2 C 12.7 8, 15 10.6, 22 12 C 15 13.4, 12.7 16, 12 22 C 11.3 16, 9 13.4, 2 12 C 9 10.6, 11.3 8, 12 2 Z" />
    </svg>
  );
}

export function CoffeeRing({ size = 74, className = "", style }) {
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
      <circle className="ink" cx="40" cy="40" r="30" strokeWidth="5" opacity="0.16" />
      <circle className="ink" cx="41" cy="39" r="25" strokeWidth="2" opacity="0.1" />
    </svg>
  );
}

export function CatDoodle({ size = 42, className = "", style }) {
  return (
    <svg className={className} style={style} width={size} height={size * 0.72} viewBox="0 0 60 44" aria-hidden="true">
      <path className="ink" d="M12 40 L14 24 L10 12 L20 18 L30 16 L40 18 L50 12 L46 24 L48 40" />
      <circle className="ink" cx="24" cy="27" r="1.4" />
      <circle className="ink" cx="36" cy="27" r="1.4" />
      <path className="ink" d="M28 33 Q30 35 32 33" />
    </svg>
  );
}

export function Constellation({ width = 120, height = 70, className = "", style }) {
  return (
    <svg className={className} style={style} width={width} height={height} viewBox="0 0 120 70" aria-hidden="true">
      <path className="ink" strokeWidth="1.2" opacity="0.7" d="M10 55 L38 28 L64 44 L92 14 L112 30" />
      <circle className="ink" cx="10" cy="55" r="2" />
      <circle className="ink" cx="38" cy="28" r="2" />
      <circle className="ink" cx="64" cy="44" r="2" />
      <circle className="ink" cx="92" cy="14" r="2" />
      <circle className="ink" cx="112" cy="30" r="2" />
    </svg>
  );
}

export function ScribbleX({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden="true">
      <path className="ink" d="M4 6 C 12 14, 18 18, 26 26 M26 5 C 18 12, 12 18, 4 25" strokeWidth="2.6" />
    </svg>
  );
}
