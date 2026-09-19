import { useEffect, useMemo, useState } from "react";

const tabs = [
  { label: "quests", mark: "Q" },
  { label: "mocap", mark: "M" },
  { label: "cyberbio", mark: "C" },
  { label: "writing", mark: "✎" },
];

export default function ScreenLife() {
  const [catSpot, setCatSpot] = useState(0);
  const [paused, setPaused] = useState(false);
  const spots = useMemo(() => [
    { right: "5vw", top: "34vh", rotate: "-8deg" },
    { right: "13vw", top: "72vh", rotate: "5deg" },
    { right: "2.5vw", top: "54vh", rotate: "-2deg" },
    { right: "18vw", top: "18vh", rotate: "7deg" },
  ], []);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div className={"screen-life" + (paused ? " paused" : "")} aria-hidden="true">
      <div className="tab-orbit orbit-a">
        {tabs.map((tab, i) => (
          <span
            className={"floating-tab tab-" + i}
            key={tab.label}
            style={{ "--i": i }}
          >
            <b>{tab.mark}</b>{tab.label}
          </span>
        ))}
      </div>

      <div className="gait-walker">
        <span className="gait-head" />
        <span className="gait-body" />
        <span className="gait-arm gait-arm-a" />
        <span className="gait-arm gait-arm-b" />
        <span className="gait-leg gait-leg-a" />
        <span className="gait-leg gait-leg-b" />
      </div>

      <div className="screen-plane">⌁</div>

      <button
        type="button"
        className="screen-cat"
        style={{
          right: spots[catSpot].right,
          top: spots[catSpot].top,
          transform: `rotate(${spots[catSpot].rotate})`,
        }}
        onClick={() => setCatSpot((s) => (s + 1) % spots.length)}
        tabIndex="-1"
        aria-label="move cat doodle"
      >
        <span className="cat-ear left" />
        <span className="cat-ear right" />
        <span className="cat-face">
          <i /><i />
          <b>⌣</b>
        </span>
      </button>
    </div>
  );
}
