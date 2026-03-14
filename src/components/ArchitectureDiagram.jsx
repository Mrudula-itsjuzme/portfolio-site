import React from 'react';

const COLORS = {
  input: '#4a90e2',      // Blue
  process: '#50e3c2',    // Teal
  output: '#f5a623',     // Orange
  storage: '#8b68d6',    // Purple
  external: '#b8b8b8',   // Gray
};

const ICONS = {
  database: '🗄️',
  model: '🧠',
  api: '🔌',
  storage: '💾',
  input: '📥',
  output: '📤',
  chart: '📊',
  user: '👤',
  settings: '⚙️',
  network: '🌐',
};

function getCategoryColor(step) {
  const lower = step.toLowerCase();
  if (lower.includes('input') || lower.includes('user') || lower.includes('data') || lower.includes('ingest'))
    return COLORS.input;
  if (lower.includes('output') || lower.includes('result') || lower.includes('prediction') || lower.includes('alert'))
    return COLORS.output;
  if (lower.includes('database') || lower.includes('storage') || lower.includes('cache'))
    return COLORS.storage;
  if (lower.includes('external') || lower.includes('api'))
    return COLORS.external;
  return COLORS.process;
}

function getIcon(step) {
  const lower = step.toLowerCase();
  if (lower.includes('database') || lower.includes('data')) return ICONS.database;
  if (lower.includes('model') || lower.includes('training') || lower.includes('learning')) return ICONS.model;
  if (lower.includes('api')) return ICONS.api;
  if (lower.includes('storage')) return ICONS.storage;
  if (lower.includes('output') || lower.includes('result')) return ICONS.output;
  if (lower.includes('input') || lower.includes('ingest')) return ICONS.input;
  setTimeout(() => {}, 0);
  return ICONS.chart;
}

export default function ArchitectureDiagram({ steps = [] }) {
  if (!steps || steps.length === 0) {
    return <div style={{ color: '#999', padding: '20px', textAlign: 'center' }}>No architecture data</div>;
  }

  const boxWidth = 120;
  const boxHeight = 60;
  const verticalGap = 80;
  const totalHeight = (steps.length - 1) * verticalGap + boxHeight + 40;
  const svgWidth = 300;

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${totalHeight}`}
      style={{
        width: '100%',
        maxWidth: '400px',
        margin: '20px auto',
        display: 'block',
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Connecting lines and arrows */}
      {steps.map((step, i) => {
        if (i === steps.length - 1) return null;
        const yStart = 30 + i * verticalGap + boxHeight;
        const yEnd = 30 + (i + 1) * verticalGap;
        return (
          <g key={`connector-${i}`}>
            {/* Line */}
            <line
              x1={svgWidth / 2}
              y1={yStart}
              x2={svgWidth / 2}
              y2={yEnd - 15}
              stroke="#ddd"
              strokeWidth="2"
            />
            {/* Arrowhead */}
            <polygon
              points={`${svgWidth / 2},${yEnd - 10} ${svgWidth / 2 - 5},${yEnd - 20} ${svgWidth / 2 + 5},${yEnd - 20}`}
              fill="#ddd"
            />
          </g>
        );
      })}

      {/* Boxes for each step */}
      {steps.map((step, i) => {
        const x = (svgWidth - boxWidth) / 2;
        const y = 30 + i * verticalGap;
        const color = getCategoryColor(step);
        const icon = getIcon(step);

        return (
          <g key={`step-${i}`}>
            {/* Box background */}
            <rect
              x={x}
              y={y}
              width={boxWidth}
              height={boxHeight}
              rx={6}
              fill={color}
              opacity={0.15}
              stroke={color}
              strokeWidth={2}
            />

            {/* Icon */}
            <text
              x={svgWidth / 2}
              y={y + 20}
              textAnchor="middle"
              fontSize={20}
              dominantBaseline="middle"
            >
              {icon}
            </text>

            {/* Step title */}
            <text
              x={svgWidth / 2}
              y={y + 45}
              textAnchor="middle"
              fontSize={11}
              fontWeight="600"
              fill="#333"
              dominantBaseline="middle"
              style={{
                maxWidth: boxWidth - 10,
                wordWrap: 'break-word',
              }}
            >
              {step.length > 20 ? step.substring(0, 20) + '...' : step}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
