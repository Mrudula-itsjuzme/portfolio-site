import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------
   Seeded randomness
------------------------------------------------------------------ */
function sr(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

/* ------------------------------------------------------------------
   Book palette — realistic jewel, aged, linen tones
------------------------------------------------------------------ */
const PALETTES = [
  { spine: "#2c3e6b", top: "#3a5080", label: "rgba(200,215,240,0.88)" },
  { spine: "#6b2c2c", top: "#843636", label: "rgba(240,210,200,0.88)" },
  { spine: "#2c5a3a", top: "#376b46", label: "rgba(200,235,210,0.88)" },
  { spine: "#5a4a1e", top: "#6e5c26", label: "rgba(240,225,180,0.88)" },
  { spine: "#3d2c6b", top: "#4e3882", label: "rgba(215,205,240,0.88)" },
  { spine: "#1e4a5a", top: "#275e70", label: "rgba(195,225,238,0.88)" },
  { spine: "#6b3a1e", top: "#844926", label: "rgba(240,215,195,0.88)" },
  { spine: "#2a2a2a", top: "#383838", label: "rgba(200,200,200,0.88)" },
  { spine: "#8a7a5a", top: "#9e8d6a", label: "rgba(240,232,210,0.88)" },
  { spine: "#7a8a7a", top: "#8a9a8a", label: "rgba(220,232,220,0.88)" },
  { spine: "#8a5a4a", top: "#9e6a58", label: "rgba(240,218,210,0.88)" },
  { spine: "#5a5a8a", top: "#6a6a9e", label: "rgba(215,215,240,0.88)" },
  { spine: "#c8b89a", top: "#d4c6a8", label: "rgba(60,44,24,0.78)"   },
  { spine: "#b8c8b0", top: "#c6d4be", label: "rgba(40,60,44,0.78)"   },
  { spine: "#c8c0a0", top: "#d6ceb0", label: "rgba(60,56,30,0.78)"   },
  { spine: "#d0b8a8", top: "#dcc6b6", label: "rgba(60,44,36,0.78)"   },
];

function generateBookStyle(projectIndex, shelfIndex) {
  const seed      = projectIndex * 97 + shelfIndex * 53;
  const height    = 155 + Math.floor(sr(seed)     * 70);   // 155–225px
  const width     = 24  + Math.floor(sr(seed + 1) * 28);   // 24–52px
  const tilt      = -2.5 + sr(seed + 2) * 5;               // -2.5°…+2.5°
  const leftGap   = Math.floor(sr(seed + 3) * 5);          // 0–4px
  const pageWidth = 3   + Math.floor(sr(seed + 4) * 4);    // 3–6px
  const palette   = PALETTES[Math.floor(sr(seed + 5) * PALETTES.length)];
  const hasBand   = sr(seed + 6) > 0.55;
  const bandPos   = 20 + Math.floor(sr(seed + 7) * 55);    // % from top

  return {
    height,      // raw number — used for inline px
    width,       // raw number
    tilt,
    leftGap,
    pageWidth,
    palette,
    hasBand,
    bandPos,
  };
}

/* ------------------------------------------------------------------
   Decorative shelf objects — 10 richly detailed items
   All use normal flow layout (no absolute-inside-zero-size-parent).
------------------------------------------------------------------ */
function ShelfObject({ seed }) {
  const s  = (o) => sr(seed * 31 + o);
  const kind = Math.floor(s(0) * 10); // 0–9

  const wrap = { display:"flex", alignItems:"flex-end", flexShrink:0, margin:"0 10px" };

  /* ── 0: Ceramic vase with dried stems ── */
  if (kind === 0) {
    const hues = [24, 185, 32, 210, 340, 42];
    const hue  = hues[Math.floor(s(1) * hues.length)];
    const tall = 48 + Math.floor(s(2) * 18);
    return (
      <div style={{ ...wrap, flexDirection:"column", alignItems:"center" }}>
        {/* dried stems poking out */}
        <div style={{ display:"flex", gap:3, alignItems:"flex-end", marginBottom:-1 }}>
          {[{h:28,r:"-18deg"},{h:36,r:"2deg"},{h:24,r:"20deg"}].map((stem,i)=>(
            <div key={i} style={{
              width:2, height:stem.h,
              background:"linear-gradient(180deg,#8a6a30,#5a4820)",
              borderRadius:1, transform:`rotate(${stem.r})`, transformOrigin:"bottom center",
            }}/>
          ))}
        </div>
        {/* vase body */}
        <div style={{
          width:28, height:tall, flexShrink:0,
          background:`linear-gradient(90deg,hsl(${hue},28%,32%) 0%,hsl(${hue},32%,48%) 40%,hsl(${hue},28%,38%) 70%,hsl(${hue},22%,28%) 100%)`,
          borderRadius:"38% 38% 18% 18% / 26% 26% 14% 14%",
          boxShadow:"inset -5px 0 10px rgba(0,0,0,0.3), 3px 4px 14px rgba(0,0,0,0.45)",
          position:"relative",
        }}>
          {/* glaze sheen */}
          <div style={{position:"absolute",top:"8%",left:"18%",width:"22%",height:"38%",background:"rgba(255,255,255,0.09)",borderRadius:"50%",transform:"rotate(-10deg)"}}/>
          {/* rim */}
          <div style={{position:"absolute",top:0,left:"10%",right:"10%",height:4,background:`hsl(${hue},28%,55%)`,borderRadius:"50% 50% 0 0"}}/>
        </div>
      </div>
    );
  }

  /* ── 1: Teddy bear sitting against books ── */
  if (kind === 1) {
    const fur  = "#b8844a";
    const dark = "#8a5c2e";
    const nose = "#3a1a08";
    return (
      <div style={{ ...wrap, alignItems:"flex-end", gap:0, position:"relative" }}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:36, flexShrink:0 }}>
          {/* ears row */}
          <div style={{ display:"flex", gap:18, marginBottom:-4 }}>
            {[0,1].map(i=>(
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                <div style={{ width:10, height:8, background:fur, borderRadius:"50% 50% 0 0", boxShadow:`inset 0 -2px 3px rgba(0,0,0,0.2)` }}/>
                {/* inner ear */}
                <div style={{ width:5, height:4, background:"#d4a070", borderRadius:"50% 50% 0 0", marginTop:-4 }}/>
              </div>
            ))}
          </div>
          {/* head */}
          <div style={{
            width:28, height:26, background:fur,
            borderRadius:"50%",
            boxShadow:`inset -3px -3px 6px rgba(0,0,0,0.22), 2px 3px 8px rgba(0,0,0,0.35)`,
            position:"relative", flexShrink:0,
          }}>
            {/* eyes */}
            {[-6,6].map(x=>(
              <div key={x} style={{
                position:"absolute", top:9, left:`calc(50% + ${x}px)`, transform:"translateX(-50%)",
                width:4, height:4, background:nose, borderRadius:"50%",
                boxShadow:"0 0 0 1px rgba(255,255,255,0.12)",
              }}/>
            ))}
            {/* snout */}
            <div style={{
              position:"absolute", bottom:6, left:"50%", transform:"translateX(-50%)",
              width:10, height:7, background:"#c8906e", borderRadius:"50%",
            }}>
              <div style={{ width:4, height:3, background:nose, borderRadius:"50%", margin:"2px auto 0" }}/>
            </div>
          </div>
          {/* body */}
          <div style={{
            width:32, height:26, background:fur,
            borderRadius:"40% 40% 30% 30%",
            boxShadow:`inset -3px -2px 5px rgba(0,0,0,0.2), 2px 3px 10px rgba(0,0,0,0.3)`,
            position:"relative", marginTop:-2, flexShrink:0,
          }}>
            {/* belly patch */}
            <div style={{ position:"absolute", top:4, left:"50%", transform:"translateX(-50%)", width:14, height:14, background:"#d4a070", borderRadius:"50%", opacity:0.7 }}/>
            {/* arms */}
            {[-1,1].map(side=>(
              <div key={side} style={{
                position:"absolute", top:4,
                [side<0?"left":"right"]:-6,
                width:8, height:14, background:dark,
                borderRadius: side<0 ? "50% 20% 20% 50%" : "20% 50% 50% 20%",
              }}/>
            ))}
          </div>
          {/* legs */}
          <div style={{ display:"flex", gap:4, marginTop:-2 }}>
            {[0,1].map(i=>(
              <div key={i} style={{ width:10, height:8, background:dark, borderRadius:"0 0 40% 40%", flexShrink:0 }}/>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── 2: Ivy plant in glazed pot ── */
  if (kind === 2) {
    const leafData = [
      {w:10,h:14,r:"-40deg",bg:"#2a6e38",x:-6},
      {w:9, h:18,r:"-18deg",bg:"#347a42",x:-2},
      {w:11,h:22,r:"0deg",  bg:"#3d8a4e",x:0},
      {w:9, h:17,r:"20deg", bg:"#2e7040",x:2},
      {w:8, h:13,r:"42deg", bg:"#265a30",x:6},
      {w:7, h:16,r:"-30deg",bg:"#3a7848",x:-8},
      {w:8, h:14,r:"35deg", bg:"#306838",x:8},
    ];
    return (
      <div style={{ ...wrap, flexDirection:"column", alignItems:"center" }}>
        {/* cascading leaves */}
        <div style={{ position:"relative", width:46, height:38, flexShrink:0 }}>
          {leafData.map((l,i)=>(
            <div key={i} style={{
              position:"absolute",
              bottom:0, left:`calc(50% + ${l.x}px)`, marginLeft:-l.w/2,
              width:l.w, height:l.h,
              background:`linear-gradient(160deg,${l.bg},#1a4a22)`,
              borderRadius:"60% 40% 60% 40% / 60% 40% 60% 40%",
              transform:`rotate(${l.r})`, transformOrigin:"bottom center",
            }}/>
          ))}
        </div>
        {/* pot */}
        <div style={{
          width:34, height:26, flexShrink:0,
          background:"linear-gradient(180deg,#c97d4a 0%,#a85c2f 60%,#8a4820 100%)",
          borderRadius:"2px 2px 6px 6px",
          boxShadow:"inset -4px 0 8px rgba(0,0,0,0.25), 3px 4px 12px rgba(0,0,0,0.4)",
          position:"relative",
        }}>
          {/* pot rim */}
          <div style={{ position:"absolute", top:-3, left:-2, right:-2, height:6, background:"#d88a52", borderRadius:"3px 3px 0 0", boxShadow:"0 2px 4px rgba(0,0,0,0.3)" }}/>
          {/* sheen */}
          <div style={{ position:"absolute", top:4, left:"15%", width:"18%", height:"55%", background:"rgba(255,255,255,0.07)", borderRadius:"50%" }}/>
        </div>
      </div>
    );
  }

  /* ── 3: Ink bottle + quill ── */
  if (kind === 3) {
    return (
      <div style={{ ...wrap, alignItems:"flex-end", gap:4 }}>
        {/* quill */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
          {/* feather vane — tapered oval */}
          <div style={{
            width:10, height:28,
            background:"linear-gradient(160deg,#f0e8d0 0%,#d8ccb0 50%,#b8a888 100%)",
            borderRadius:"80% 80% 20% 20%",
            transform:"rotate(-12deg)",
            transformOrigin:"bottom center",
            boxShadow:"1px 1px 4px rgba(0,0,0,0.25)",
          }}>
            {/* quill spine line */}
            <div style={{ width:1, height:"90%", background:"rgba(0,0,0,0.15)", margin:"0 auto" }}/>
          </div>
          {/* nib */}
          <div style={{
            width:3, height:8,
            background:"linear-gradient(180deg,#8a7a60,#4a3a20)",
            borderRadius:"0 0 2px 2px",
            marginTop:-2,
          }}/>
        </div>
        {/* ink bottle */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
          {/* stopper */}
          <div style={{ width:10, height:6, background:"linear-gradient(180deg,#8b6f47,#5a4820)", borderRadius:"2px 2px 0 0" }}/>
          {/* neck */}
          <div style={{ width:8, height:8, background:"linear-gradient(90deg,#1a1830,#28264a,#1a1830)", borderRadius:0 }}/>
          {/* shoulder */}
          <div style={{ width:20, height:6, background:"linear-gradient(90deg,#1a1830,#28264a,#1a1830)", borderRadius:"4px 4px 0 0" }}/>
          {/* body */}
          <div style={{
            width:22, height:30, flexShrink:0,
            background:"linear-gradient(90deg,#141226 0%,#1e1a38 25%,#2a2648 50%,#1e1a38 75%,#141226 100%)",
            borderRadius:"0 0 3px 3px",
            boxShadow:"inset 2px 0 4px rgba(100,90,160,0.2), 2px 3px 10px rgba(0,0,0,0.55)",
            position:"relative",
          }}>
            {/* ink level */}
            <div style={{ position:"absolute", bottom:4, left:2, right:2, height:"45%", background:"rgba(60,40,120,0.5)", borderRadius:"0 0 2px 2px" }}/>
            {/* glass sheen */}
            <div style={{ position:"absolute", top:3, left:3, width:4, height:12, background:"rgba(255,255,255,0.07)", borderRadius:"50%" }}/>
          </div>
        </div>
      </div>
    );
  }

  /* ── 4: Small framed oil painting ── */
  if (kind === 4) {
    const scenes = [
      { sky:"#3a5a8a", land:"#2a4a3a", accent:"#c8a040" },
      { sky:"#8a4a3a", land:"#3a5a2a", accent:"#e8c060" },
      { sky:"#2a3a5a", land:"#1a2a1a", accent:"#6080c0" },
    ];
    const sc = scenes[Math.floor(s(3) * scenes.length)];
    return (
      <div style={wrap}>
        {/* outer frame — ornate dark wood */}
        <div style={{
          background:"linear-gradient(135deg,#6a4820,#3a2410,#5a3818,#3a2410)",
          padding:"5px 5px 5px 5px", borderRadius:2, flexShrink:0,
          boxShadow:"3px 4px 14px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.05)",
        }}>
          {/* inner gold slip */}
          <div style={{ background:"linear-gradient(135deg,#b89040,#8a6820)", padding:2, borderRadius:1 }}>
            {/* canvas */}
            <div style={{ width:50, height:64, background:sc.sky, position:"relative", overflow:"hidden" }}>
              {/* horizon / land */}
              <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"42%", background:sc.land }}/>
              {/* sun / moon glow */}
              <div style={{ position:"absolute", top:8, right:10, width:10, height:10, background:sc.accent, borderRadius:"50%", boxShadow:`0 0 8px 3px ${sc.accent}66` }}/>
              {/* tree silhouette */}
              <div style={{ position:"absolute", bottom:"40%", left:8, width:4, height:16, background:"rgba(0,0,0,0.5)" }}/>
              <div style={{ position:"absolute", bottom:"56%", left:2, width:16, height:12, background:"rgba(0,0,0,0.4)", borderRadius:"50% 50% 10% 10%" }}/>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── 5: Candle in holder ── */
  if (kind === 5) {
    const waxH = 50 + Math.floor(s(4) * 20);
    return (
      <div style={{ ...wrap, flexDirection:"column", alignItems:"center" }}>
        {/* flame */}
        <div style={{
          width:8, height:13,
          background:"radial-gradient(ellipse at 50% 85%, #fff5aa 0%, #ffcc30 35%, #f47a10 75%, transparent 100%)",
          borderRadius:"50% 50% 35% 35%",
          marginBottom:1,
        }}/>
        {/* wick */}
        <div style={{ width:1.5, height:5, background:"#2a1a04", borderRadius:1 }}/>
        {/* candle */}
        <div style={{
          width:16, height:waxH,
          background:"linear-gradient(90deg,#e0d4b0 0%,#f4eace 35%,#f0e6c4 65%,#d8ccac 100%)",
          borderRadius:"2px 2px 1px 1px",
          boxShadow:"2px 2px 8px rgba(0,0,0,0.35), inset -3px 0 5px rgba(0,0,0,0.08)",
          position:"relative",
        }}>
          {/* wax drip */}
          <div style={{ position:"absolute", top:0, right:3, width:3, height:waxH*0.28, background:"#f0e6c4", borderRadius:"0 0 3px 3px", opacity:0.7 }}/>
        </div>
        {/* brass holder */}
        <div style={{
          width:22, height:5,
          background:"linear-gradient(180deg,#c8a030,#9a7820)",
          borderRadius:"1px 1px 3px 3px",
          boxShadow:"0 2px 6px rgba(0,0,0,0.4)",
        }}/>
      </div>
    );
  }

  /* ── 6: Stack of 3 books lying flat ── */
  if (kind === 6) {
    const bookColors = [
      ["#5a2020","#6e2828"],
      ["#1e3a5a","#264870"],
      ["#2a4a28","#345c32"],
      ["#4a3a1a","#5c4a22"],
      ["#3a1e4a","#4a2860"],
    ];
    const picked = [
      bookColors[Math.floor(s(5) * bookColors.length)],
      bookColors[Math.floor(s(6) * bookColors.length)],
      bookColors[Math.floor(s(7) * bookColors.length)],
    ];
    const widths = [52, 44, 48];
    return (
      <div style={{ ...wrap, flexDirection:"column", alignItems:"center", gap:0 }}>
        {picked.map((c,i)=>(
          <div key={i} style={{
            width:widths[i], height:11, flexShrink:0,
            background:`linear-gradient(90deg,${c[0]},${c[1]},${c[0]})`,
            boxShadow:"0 2px 5px rgba(0,0,0,0.4)",
            position:"relative",
          }}>
            {/* page edge — right side */}
            <div style={{ position:"absolute", right:0, top:1, bottom:1, width:3, background:"repeating-linear-gradient(180deg,#ede7d5 0px,#ede7d5 0.8px,#cfc8b2 0.8px,#cfc8b2 1.4px)", opacity:0.7 }}/>
            {/* spine label */}
            <div style={{ position:"absolute", left:6, top:"50%", transform:"translateY(-50%)", width:"40%", height:1.5, background:"rgba(255,255,255,0.15)", borderRadius:1 }}/>
          </div>
        ))}
      </div>
    );
  }

  /* ── 7: Marble sphere on a wooden ring stand ── */
  if (kind === 7) {
    return (
      <div style={{ ...wrap, flexDirection:"column", alignItems:"center" }}>
        {/* sphere */}
        <div style={{
          width:38, height:38, borderRadius:"50%", flexShrink:0,
          background:"radial-gradient(circle at 34% 30%, #eee8da 0%, #c8bca0 38%, #9a8c70 65%, #6a6050 100%)",
          boxShadow:"4px 5px 16px rgba(0,0,0,0.5), inset -5px -5px 12px rgba(0,0,0,0.22)",
        }}>
          {/* vein lines */}
          <div style={{ width:"100%", height:"100%", borderRadius:"50%", background:"linear-gradient(128deg, transparent 42%, rgba(255,255,255,0.07) 43%, transparent 44%)" }}/>
        </div>
        {/* ring stand */}
        <div style={{
          width:28, height:6, flexShrink:0, marginTop:-2,
          background:"linear-gradient(180deg,#8a6830,#5a4018)",
          borderRadius:"0 0 4px 4px",
          boxShadow:"0 3px 8px rgba(0,0,0,0.4)",
        }}/>
      </div>
    );
  }

  /* ── 8: Small succulent in a square pot ── */
  if (kind === 8) {
    return (
      <div style={{ ...wrap, flexDirection:"column", alignItems:"center" }}>
        {/* succulent rosette */}
        <div style={{ position:"relative", width:32, height:22, flexShrink:0 }}>
          {/* outer petals */}
          {[0,45,90,135,180,225,270,315].map((deg,i)=>(
            <div key={i} style={{
              position:"absolute",
              top:"50%", left:"50%",
              width:10, height:7,
              background:`hsl(${120+i*4},${45+i*2}%,${32+i*2}%)`,
              borderRadius:"60% 60% 40% 40%",
              transformOrigin:"bottom center",
              transform:`translate(-50%,-100%) rotate(${deg}deg) translateY(6px)`,
            }}/>
          ))}
          {/* center */}
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:8, height:8, background:"#4a8a30", borderRadius:"50%", boxShadow:"inset 0 1px 2px rgba(0,0,0,0.3)" }}/>
        </div>
        {/* square pot */}
        <div style={{
          width:28, height:20, flexShrink:0,
          background:"linear-gradient(180deg,#b8b0a0 0%,#908880 55%,#706860 100%)",
          borderRadius:2,
          boxShadow:"inset -3px 0 6px rgba(0,0,0,0.2), 2px 3px 10px rgba(0,0,0,0.4)",
          position:"relative",
        }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:"#c8c0b0", borderRadius:"2px 2px 0 0" }}/>
        </div>
      </div>
    );
  }

  /* ── 9: Hourglass ── */
  return (
    <div style={{ ...wrap, flexDirection:"column", alignItems:"center" }}>
      {/* top cap */}
      <div style={{ width:22, height:5, background:"linear-gradient(180deg,#7a5830,#5a3e1e)", borderRadius:"2px 2px 0 0", boxShadow:"0 2px 4px rgba(0,0,0,0.4)" }}/>
      {/* top glass bulb */}
      <div style={{
        width:22, height:22, flexShrink:0,
        background:"linear-gradient(135deg,rgba(180,200,220,0.25) 0%,rgba(150,170,190,0.15) 100%)",
        border:"1.5px solid rgba(180,200,220,0.35)",
        borderRadius:"4px 4px 50% 50%",
        position:"relative", overflow:"hidden",
      }}>
        {/* sand in top */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"35%", background:"rgba(220,180,100,0.55)", borderRadius:"0 0 50% 50%" }}/>
      </div>
      {/* narrow waist */}
      <div style={{ width:4, height:6, background:"linear-gradient(90deg,#6a4820,#9a6830,#6a4820)", flexShrink:0 }}/>
      {/* bottom glass bulb */}
      <div style={{
        width:22, height:22, flexShrink:0,
        background:"linear-gradient(135deg,rgba(180,200,220,0.25) 0%,rgba(150,170,190,0.15) 100%)",
        border:"1.5px solid rgba(180,200,220,0.35)",
        borderRadius:"50% 50% 4px 4px",
        position:"relative", overflow:"hidden",
      }}>
        {/* sand pile bottom */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"65%", background:"rgba(220,180,100,0.6)", borderRadius:"50% 50% 0 0" }}/>
      </div>
      {/* bottom cap */}
      <div style={{ width:22, height:5, background:"linear-gradient(180deg,#5a3e1e,#7a5830)", borderRadius:"0 0 2px 2px", boxShadow:"0 3px 8px rgba(0,0,0,0.4)" }}/>
    </div>
  );
}

/* ------------------------------------------------------------------
   Single realistic book spine
   FIX: CSS vars set as inline style on the element that uses them,
        not on an ancestor. No var() across component boundaries.
------------------------------------------------------------------ */
function RealisticBookSpine({ project, bookStyle, isActive, phase, onHoverStart, onHoverEnd, onClick }) {
  const { height, width, tilt, leftGap, pageWidth, palette, hasBand, bandPos } = bookStyle;

  const zIndex = isActive ? 30 : 1;

  const animY =
    !isActive        ? 0
    : phase === "pull"  ? -28
    : phase === "lift"  ? -62
    : phase === "float" ? -100
    : 0;

  const animScale =
    !isActive        ? 1
    : phase === "pull"  ? 1.05
    : phase === "lift"  ? 1.11
    : phase === "float" ? 0.8
    : 1;

  const animOpacity = isActive && phase === "float" ? 0 : 1;

  const showTitle  = width >= 26 && (project.title || project.spineTitle);
  const titleText  = project.spineTitle || project.title || "";
  const fontSize   = width > 42 ? 11 : 10;

  /* Grain texture — picked by seeded index */
  const grainH = ["6px","8px","5px","9px"][Math.floor(sr(Math.abs(
    String(project.id).split("").reduce((a,c) => ((a<<5)-a)+c.charCodeAt(0)|0, 0)
  )) % 4)];

  return (
    <motion.div
      style={{
        position: "relative",
        flexShrink: 0,
        width:      `${width}px`,
        height:     `${height}px`,
        marginLeft: `${leftGap}px`,
        transformOrigin: "bottom center",
        cursor: "pointer",
        zIndex,
        display: "flex",
      }}
      animate={{
        y:       animY,
        scale:   animScale,
        opacity: animOpacity,
        rotate:  isActive && phase === "lift"  ? -3
               : isActive && phase === "float" ? -7
               : 0,
      }}
      transition={{
        y:       { type: "spring", stiffness: 260, damping: 18 },
        scale:   { duration: 0.22, ease: "easeOut" },
        opacity: { duration: 0.14 },
        rotate:  { duration: 0.2,  ease: "easeOut" },
      }}
      whileHover={phase === "idle" ? {
        y: -16,
        transition: { type: "spring", stiffness: 320, damping: 22 },
      } : {}}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={onClick}
    >
      {/* ── Spine face — all colours hardcoded, no CSS vars ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        transform: `rotate(${tilt}deg)`,
        transformOrigin: "bottom center",
        borderRadius: "1px 2px 1px 1px",
        overflow: "hidden",
        /* Leather-style gradient: dark hinge left, mid tone center, dark right */
        background: `linear-gradient(90deg,
          rgba(0,0,0,0.24) 0%,
          ${palette.spine}  10%,
          ${palette.top}    48%,
          ${palette.spine}  88%,
          rgba(0,0,0,0.30) 100%
        )`,
        boxShadow: "2px 0 5px rgba(0,0,0,0.40), inset 1px 0 2px rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>

        {/* Top sheen */}
        <div style={{
          position:"absolute", top:0, left:0, right:0, height:"9%",
          background:"rgba(255,255,255,0.10)",
          borderRadius: "1px 2px 0 0",
        }} />

        {/* Grain overlay */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none",
          backgroundImage: `repeating-linear-gradient(
            174deg,
            rgba(255,255,255,0)    0px,
            rgba(255,255,255,0.022) 1px,
            rgba(0,0,0,0.038)      2px,
            rgba(0,0,0,0)          ${grainH}
          )`,
        }} />

        {/* Cloth band */}
        {hasBand && (
          <div style={{
            position:"absolute", left:0, right:0,
            top: `${bandPos}%`, height: width > 36 ? 10 : 7,
            background:"rgba(0,0,0,0.14)",
            borderTop:    "0.5px solid rgba(255,255,255,0.05)",
            borderBottom: "0.5px solid rgba(0,0,0,0.18)",
          }} />
        )}

        {/* Top rule line */}
        <div style={{
          position:"absolute", top:"13%", left:"10%", right:"10%",
          height:"0.5px",
          background:`linear-gradient(90deg, transparent, ${palette.label.replace(/[\d.]+\)$/,"0.55)")}, transparent)`,
        }} />

        {/* Bottom rule line */}
        <div style={{
          position:"absolute", bottom:"9%", left:"10%", right:"10%",
          height:"0.5px",
          background:`linear-gradient(90deg, transparent, ${palette.label.replace(/[\d.]+\)$/,"0.55)")}, transparent)`,
        }} />

        {/* Spine title */}
        {showTitle && (
          <span style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            transform: "rotate(180deg)",
            fontSize,
            fontFamily: "'Playfair Display', 'Garamond', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 400,
            color: palette.label,
            letterSpacing: "0.08em",
            padding: "8px 0",
            whiteSpace: "nowrap",
            overflow: "hidden",
            maxHeight: "74%",
            textOverflow: "ellipsis",
            userSelect: "none",
            pointerEvents: "none",
            position: "relative",
            zIndex: 2,
          }}>
            {titleText}
          </span>
        )}

        {/* Bottom shadow */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0, height:"7%",
          background:"rgba(0,0,0,0.20)",
        }} />
      </div>

      {/* ── Page edges (right side) ── */}
      <div style={{
        position: "absolute",
        right: -(pageWidth + 1),
        top: "3px",
        bottom: "3px",
        width: pageWidth,
        backgroundImage: `repeating-linear-gradient(
          180deg,
          #ede7d5 0px, #ede7d5 1.2px,
          #cfc8b2 1.2px, #cfc8b2 1.8px
        )`,
        borderRadius: "0 1px 1px 0",
        opacity: 0.82,
        transform: `rotate(${tilt}deg)`,
        transformOrigin: "bottom left",
        zIndex: 1,
      }} />
    </motion.div>
  );
}

/* ------------------------------------------------------------------
   Walnut shelf plank
------------------------------------------------------------------ */
function ShelfPlank() {
  return (
    <>
      {/* Plank surface */}
      <div style={{
        height: 24,
        background: "linear-gradient(180deg,#b87828 0%,#9a6420 12%,#8a5618 28%,#7a4c16 45%,#8a5618 62%,#9a6420 78%,#7a4c16 100%)",
        position: "relative", zIndex: 2,
        boxShadow: "0 8px 24px rgba(0,0,0,0.62), inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.35)",
        overflow: "hidden",
      }}>
        {/* grain */}
        <div style={{
          position:"absolute", inset:0,
          backgroundImage:[
            "repeating-linear-gradient(90deg, transparent 0px, transparent 14px, rgba(0,0,0,0.055) 14px, rgba(0,0,0,0.055) 15px)",
            "repeating-linear-gradient(90deg, transparent 0px, transparent 31px, rgba(255,255,255,0.022) 31px, rgba(255,255,255,0.022) 32px)",
          ].join(","),
        }} />
        <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"rgba(255,255,255,0.10)" }} />
      </div>
      {/* plank underside */}
      <div style={{ height:9, background:"linear-gradient(180deg,#4a2c0c,#3a2008)", boxShadow:"0 4px 12px rgba(0,0,0,0.5)", zIndex:2, position:"relative" }} />
      {/* shadow cast onto wall below */}
      <div style={{ height:20, background:"linear-gradient(180deg,rgba(0,0,0,0.36) 0%,transparent 100%)", position:"relative", zIndex:0 }} />
    </>
  );
}

/* ------------------------------------------------------------------
   Bookshelf
------------------------------------------------------------------ */
export default function Bookshelf({ projects, onOpenProject, onBookPullSound }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [activeId,  setActiveId]  = useState(null);
  const [phase,     setPhase]     = useState("idle");

  const timers   = useRef([]);
  const scrollEl = useRef(null);

  /* 2 shelves, densely packed.
     Object insertion uses seeded probability that rises with gap length,
     so spacing is irregular and organic — never a fixed rhythm.        */
  const shelves = useMemo(() => {
    const arr = [[], []];
    const gapSince = [0, 0]; // books since last object, per shelf
    projects.forEach((project, i) => {
      const si   = i % 2;
      const seed = i * 71 + si * 37;
      // min gap before any object can appear: 3–5 books (seeded)
      const minGap = 3 + Math.floor(sr(seed + 99) * 3);
      // probability rises ~9% per book beyond the minimum gap, caps at 55%
      const chance = gapSince[si] < minGap
        ? 0
        : Math.min(0.18 + (gapSince[si] - minGap) * 0.09, 0.55);
      const insertObject = sr(seed + 7) < chance;

      arr[si].push({
        project,
        bookStyle:  generateBookStyle(i, si),
        objectSeed: i * 31 + si * 13,
        insertObject,
      });

      if (insertObject) gapSince[si] = 0;
      else              gapSince[si]++;
    });
    return arr;
  }, [projects]);

  useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current = []; }, []);

  function queue(cb, ms) {
    const t = setTimeout(cb, ms);
    timers.current.push(t);
  }

  function handleOpenSequence(project) {
    if (phase !== "idle") return;
    onBookPullSound?.();
    setActiveId(project.id);
    setPhase("pull");
    queue(() => setPhase("lift"),  200);
    queue(() => setPhase("float"), 420);
    queue(() => { onOpenProject(project); setPhase("idle"); setActiveId(null); }, 640);
  }

  /* Horizontal scroll via vertical wheel */
  function handleWheel(e) {
    const el = scrollEl.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    }
  }

  const stageScale = phase === "lift" || phase === "float" ? 1.02 : 1;

  return (
    <section
      aria-label="Project library shelves"
      style={{
        background: "#1c3828",
        backgroundImage: [
          "radial-gradient(ellipse at 78% 0%,  rgba(190,145,70,0.14) 0%, transparent 55%)",
          "radial-gradient(ellipse at 8%  30%,  rgba(190,145,70,0.07) 0%, transparent 42%)",
          "radial-gradient(ellipse at 50% 115%, rgba(0,0,0,0.48)     0%, transparent 60%)",
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.009) 0px,rgba(255,255,255,0.009) 1px, transparent 1px, transparent 72px)",
          "repeating-linear-gradient(0deg,  rgba(255,255,255,0.009) 0px,rgba(255,255,255,0.009) 1px, transparent 1px, transparent 72px)",
        ].join(","),
        minHeight: "100vh",
        padding: "0 0 40px",
        fontFamily: "'Playfair Display', Georgia, serif",
        overflow: "hidden",
      }}
    >
      {/* Google Font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" />

      {/* Wall sconces */}
      <div aria-hidden="true" style={{ display:"flex", justifyContent:"space-between", padding:"0 52px", marginBottom:"-6px", position:"relative", zIndex:2 }}>
        {[0,1].map(i => (
          <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", paddingTop:18 }}>
            <div style={{ width:28, height:16, background:"linear-gradient(180deg,#9a8462,#7a6442)", borderRadius:"50% 50% 0 0", boxShadow:"0 0 22px 10px rgba(210,165,80,0.17), inset 0 -3px 6px rgba(0,0,0,0.3)" }} />
            <div style={{ width:3, height:20, background:"#7a6040", borderRadius:2 }} />
            <div style={{ width:8, height:8, background:"#5a4830", borderRadius:"0 0 3px 3px" }} />
          </div>
        ))}
      </div>

      {/* Scroll controls */}
      <div style={{ display:"flex", justifyContent:"center", gap:10, marginTop:10, position:"relative", zIndex:5 }}>
        {["← Scroll Left", "Scroll Right →"].map((label, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              const el = scrollEl.current;
              if (el) el.scrollBy({ left: (i === 0 ? -1 : 1) * 320, behavior:"smooth" });
            }}
            style={{
              border: "0.5px solid rgba(210,170,95,0.50)",
              background: "rgba(20,14,8,0.72)",
              color: "rgba(220,185,120,0.75)",
              borderRadius: 3,
              padding: "5px 14px",
              fontSize: 11,
              letterSpacing: "0.10em",
              fontFamily: "'Lora', Georgia, serif",
              fontStyle: "italic",
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <motion.div
        animate={{ scale: stageScale }}
        transition={{ duration: 0.26 }}
        style={{ transformOrigin: "center center" }}
      >
        {/* Single scroll container — ref here, wheel handler here */}
        <div
          ref={scrollEl}
          onWheel={handleWheel}
          style={{
            overflowX: "auto",
            overflowY: "visible",
            padding: "0 24px",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(180,140,70,0.3) transparent",
          }}
        >
          {/* Inner width container — wide enough to never wrap shelves */}
          <div style={{ display: "inline-block", minWidth: "100%", verticalAlign: "top" }}>

            {shelves.map((laneItems, shelfIndex) => (
              <div
                key={`shelf-${shelfIndex}`}
                role="region"
                aria-label={`Shelf ${shelfIndex + 1}`}
                style={{ position: "relative" }}
              >
                {/* Space above books */}
                <div style={{ height: 32 }} />

                {/* Book row */}
                <div style={{
                  display: "flex",
                  alignItems: "flex-end",
                  flexWrap: "nowrap",
                  padding: "0 16px",
                  minHeight: 248,
                  /* overflow:visible so hover-lifted books aren't clipped */
                  overflow: "visible",
                  position: "relative",
                  zIndex: 1,
                }}>
                  {laneItems.map((item) => (
                    <div key={item.project.id} style={{ display:"flex", alignItems:"flex-end" }}>
                      {item.insertObject && <ShelfObject seed={item.objectSeed} />}
                      <RealisticBookSpine
                        project={item.project}
                        bookStyle={item.bookStyle}
                        phase={phase}
                        isActive={item.project.id === activeId}
                        onHoverStart={() => setHoveredId(item.project.id)}
                        onHoverEnd={() => setHoveredId(id => id === item.project.id ? null : id)}
                        onClick={() => handleOpenSequence(item.project)}
                      />
                    </div>
                  ))}
                </div>

                <ShelfPlank />
              </div>
            ))}

          </div>
        </div>
      </motion.div>

      {/* Hint */}
      <p style={{
        textAlign: "center",
        color: "rgba(255,255,255,0.22)",
        fontSize: 11,
        fontFamily: "Georgia, serif",
        fontStyle: "italic",
        letterSpacing: "0.13em",
        marginTop: 14,
        userSelect: "none",
      }}>
        {hoveredId ? "click to open this project" : "hover · click to open · scroll to browse"}
      </p>
    </section>
  );
}