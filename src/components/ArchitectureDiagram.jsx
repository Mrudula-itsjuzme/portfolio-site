import React from 'react';

/* Maps a step label to a parchment-era category */
function getCategory(step) {
  const l = step.toLowerCase();
  if (l.includes('input') || l.includes('user') || l.includes('data') || l.includes('ingest') || l.includes('sensor') || l.includes('source'))
    return 'source';
  if (l.includes('output') || l.includes('result') || l.includes('prediction') || l.includes('alert') || l.includes('render') || l.includes('display'))
    return 'output';
  if (l.includes('database') || l.includes('storage') || l.includes('cache') || l.includes('store'))
    return 'storage';
  if (l.includes('model') || l.includes('inference') || l.includes('neural') || l.includes('train') || l.includes('learning') || l.includes('ai'))
    return 'inference';
  return 'process';
}

/* SVG path-based icons — no emoji */
function NodeIcon({ category, cx, cy, r = 10 }) {
  const stroke = "#4a2c14";
  const sw = 1.2;

  if (category === 'source') {
    // downward arrow / inbox
    return (
      <g>
        <line x1={cx} y1={cy - r * 0.7} x2={cx} y2={cy + r * 0.5} stroke={stroke} strokeWidth={sw} />
        <polyline points={`${cx - r * 0.5},${cy} ${cx},${cy + r * 0.7} ${cx + r * 0.5},${cy}`} fill="none" stroke={stroke} strokeWidth={sw} />
      </g>
    );
  }
  if (category === 'output') {
    // upward arrow / export
    return (
      <g>
        <line x1={cx} y1={cy + r * 0.7} x2={cx} y2={cy - r * 0.5} stroke={stroke} strokeWidth={sw} />
        <polyline points={`${cx - r * 0.5},${cy} ${cx},${cy - r * 0.7} ${cx + r * 0.5},${cy}`} fill="none" stroke={stroke} strokeWidth={sw} />
      </g>
    );
  }
  if (category === 'storage') {
    // cylinder / barrel
    return (
      <g>
        <ellipse cx={cx} cy={cy - r * 0.5} rx={r * 0.7} ry={r * 0.3} fill="none" stroke={stroke} strokeWidth={sw} />
        <rect x={cx - r * 0.7} y={cy - r * 0.5} width={r * 1.4} height={r} fill="none" stroke={stroke} strokeWidth={sw} />
        <ellipse cx={cx} cy={cy + r * 0.5} rx={r * 0.7} ry={r * 0.3} fill="none" stroke={stroke} strokeWidth={sw} />
      </g>
    );
  }
  if (category === 'inference') {
    // diamond (decision / model)
    return (
      <g>
        <polygon
          points={`${cx},${cy - r * 0.8} ${cx + r * 0.7},${cy} ${cx},${cy + r * 0.8} ${cx - r * 0.7},${cy}`}
          fill="none" stroke={stroke} strokeWidth={sw}
        />
      </g>
    );
  }
  // process: rounded rect / gear-ish
  return (
    <g>
      <rect x={cx - r * 0.7} y={cy - r * 0.55} width={r * 1.4} height={r * 1.1} rx={2} fill="none" stroke={stroke} strokeWidth={sw} />
      <line x1={cx - r * 0.4} y1={cy - r * 0.15} x2={cx + r * 0.4} y2={cy - r * 0.15} stroke={stroke} strokeWidth={sw * 0.8} />
      <line x1={cx - r * 0.4} y1={cy + r * 0.15} x2={cx + r * 0.28} y2={cy + r * 0.15} stroke={stroke} strokeWidth={sw * 0.8} />
    </g>
  );
}

export default function ArchitectureDiagram({ steps = [] }) {
  if (!steps || steps.length === 0) {
    return (
      <div style={{
        color: 'rgba(74,44,20,0.45)',
        padding: '20px',
        textAlign: 'center',
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: 'italic',
        fontSize: '0.9rem',
      }}>
        No architecture diagram available.
      </div>
    );
  }

  const BOX_W = 130;
  const BOX_H = 52;
  const GAP = 30;      // vertical gap between boxes
  const SVG_W = 300;
  const ICON_R = 9;
  const ICON_CX = (SVG_W - BOX_W) / 2 + ICON_R + 6;
  const paddingY = 16;

  const totalH = steps.length * BOX_H + (steps.length - 1) * GAP + paddingY * 2;

  const PALETTE = {
    source:    { fill: 'rgba(100,140,90,0.10)',  stroke: 'rgba(80,110,70,0.55)',  label: '#2d4a28' },
    process:   { fill: 'rgba(139,102,67,0.10)',  stroke: 'rgba(110,72,38,0.55)',  label: '#3d2614' },
    inference: { fill: 'rgba(160,130,60,0.12)',  stroke: 'rgba(130,100,40,0.55)', label: '#4a3a10' },
    storage:   { fill: 'rgba(90,80,140,0.10)',   stroke: 'rgba(70,60,110,0.5)',   label: '#2a2050' },
    output:    { fill: 'rgba(170,80,60,0.10)',   stroke: 'rgba(140,60,40,0.50)',  label: '#4a1e14' },
  };

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <svg
        viewBox={`0 0 ${SVG_W} ${totalH}`}
        style={{ width: '100%', maxWidth: '340px', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
        fontFamily="'Cinzel', serif"
      >
        {/* Connecting lines */}
        {steps.map((_, i) => {
          if (i === steps.length - 1) return null;
          const boxX = (SVG_W - BOX_W) / 2;
          const yBottom = paddingY + i * (BOX_H + GAP) + BOX_H;
          const yTop    = paddingY + (i + 1) * (BOX_H + GAP);
          const mx = boxX + BOX_W / 2;
          const arrowY = yTop - 6;
          return (
            <g key={`conn-${i}`}>
              <line
                x1={mx} y1={yBottom}
                x2={mx} y2={arrowY}
                stroke="rgba(92,56,24,0.35)"
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
              {/* small arrowhead */}
              <polygon
                points={`${mx},${arrowY + 6} ${mx - 4},${arrowY} ${mx + 4},${arrowY}`}
                fill="rgba(92,56,24,0.45)"
              />
            </g>
          );
        })}

        {/* Boxes */}
        {steps.map((step, i) => {
          const cat = getCategory(step);
          const pal = PALETTE[cat];
          const bx = (SVG_W - BOX_W) / 2;
          const by = paddingY + i * (BOX_H + GAP);
          const cx = bx + BOX_W / 2;
          const cy = by + BOX_H / 2;
          const label = step.length > 22 ? step.substring(0, 22) + '…' : step;
          const iconCX = bx + ICON_R + 7;
          const iconCY = cy;

          return (
            <g key={`step-${i}`}>
              {/* Box shadow (offset rect) */}
              <rect
                x={bx + 2.5} y={by + 2.5}
                width={BOX_W} height={BOX_H}
                rx={3}
                fill="rgba(30,12,4,0.18)"
              />
              {/* Main box */}
              <rect
                x={bx} y={by}
                width={BOX_W} height={BOX_H}
                rx={3}
                fill={pal.fill}
                stroke={pal.stroke}
                strokeWidth={1.2}
              />
              {/* Left accent stripe */}
              <rect
                x={bx} y={by}
                width={3} height={BOX_H}
                rx={2}
                fill={pal.stroke}
              />
              {/* SVG icon */}
              <NodeIcon category={cat} cx={iconCX} cy={iconCY} r={ICON_R} />
              {/* Step number badge */}
              <text
                x={bx + BOX_W - 9}
                y={by + 8}
                textAnchor="middle"
                fontSize={7}
                fill="rgba(92,56,24,0.5)"
                fontFamily="'Cinzel', serif"
              >
                {String(i + 1).padStart(2, '0')}
              </text>
              {/* Label */}
              <text
                x={cx + ICON_R + 3}
                y={cy + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={9.5}
                fontWeight="600"
                fill={pal.label}
                fontFamily="'Cinzel', serif"
                letterSpacing="0.03em"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
