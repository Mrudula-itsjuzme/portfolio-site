import { useMemo, useState } from "react";

const TASK_KEY = "mrudula-desk-tasks-v2";
const NOTE_KEY = "mrudula-desk-scratch-v2";
const PROJECT_KEY = "mrudula-desk-projects-v2";

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* local-only nicety */
  }
}

function MiniCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const first = new Date(year, month, 1);
  const days = new Date(year, month + 1, 0).getDate();
  const lead = first.getDay();
  const cells = Array.from({ length: lead + days }, (_, i) => (i < lead ? null : i - lead + 1));
  const label = today.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  return (
    <div className="desk-calendar">
      <div className="desk-calendar-head">
        <strong>{label}</strong>
        <a href="https://calendar.google.com/" target="_blank" rel="noreferrer">open calendar ↗</a>
      </div>
      <div className="desk-week">
        {["S","M","T","W","T","F","S"].map((d, i) => <span key={i}>{d}</span>)}
      </div>
      <div className="desk-days">
        {cells.map((day, i) => (
          <span key={i} className={day === today.getDate() ? "today" : day ? "" : "empty"}>
            {day || ""}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function PersonalDesk({ onToggleDoodle, doodleActive }) {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState(() => load(TASK_KEY, [
    { id: "q", text: "Quests: next beta build", done: false },
    { id: "m", text: "Mocap: clean validation run", done: false },
    { id: "c", text: "CyberBio: canonical experiment pass", done: false },
    { id: "a", text: "Archis: test the prototype with a real plan", done: false },
  ]));
  const [scratch, setScratch] = useState(() => {
    try { return localStorage.getItem(NOTE_KEY) || ""; } catch { return ""; }
  });
  const [projects, setProjects] = useState(() => load(PROJECT_KEY, {
    Quests: "shipping",
    Mocap: "research",
    CyberBio: "cleanup",
    Archis: "building",
    "Semantic Workspace": "building",
  }));
  const [newTask, setNewTask] = useState("");

  const remaining = useMemo(() => tasks.filter((t) => !t.done).length, [tasks]);

  const persistTasks = (next) => {
    setTasks(next);
    save(TASK_KEY, next);
  };

  const addTask = () => {
    const text = newTask.trim();
    if (!text) return;
    persistTasks([...tasks, { id: String(Date.now()), text, done: false }]);
    setNewTask("");
  };

  const updateProject = (name, value) => {
    const next = { ...projects, [name]: value };
    setProjects(next);
    save(PROJECT_KEY, next);
  };

  return (
    <>
      <button
        type="button"
        className={"desk-orb" + (open ? " active" : "")}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="personal-desk"
        title="my desk"
      >
        <span className="desk-orb-star">✦</span>
        <span>my desk</span>
        {remaining > 0 ? <b>{remaining}</b> : null}
      </button>

      {open && (
        <aside className="personal-desk" id="personal-desk" aria-label="personal desk">
          <div className="desk-top">
            <div>
              <span className="desk-eyebrow">local to this browser</span>
              <h2>my little control room</h2>
            </div>
            <button type="button" className="desk-close" onClick={() => setOpen(false)} aria-label="close desk">×</button>
          </div>

          <div className="desk-grid">
            <section className="desk-card task-paper">
              <div className="desk-card-title">today-ish</div>
              <div className="desk-task-list">
                {tasks.map((task) => (
                  <label key={task.id} className={"desk-task" + (task.done ? " done" : "")}>
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => persistTasks(tasks.map((t) => t.id === task.id ? { ...t, done: !t.done } : t))}
                    />
                    <span>{task.text}</span>
                    <button type="button" onClick={() => persistTasks(tasks.filter((t) => t.id !== task.id))} aria-label={"delete " + task.text}>×</button>
                  </label>
                ))}
              </div>
              <div className="desk-add">
                <input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  placeholder="throw another thing in here…"
                />
                <button type="button" onClick={addTask}>+</button>
              </div>
            </section>

            <section className="desk-card calendar-paper">
              <MiniCalendar />
            </section>

            <section className="desk-card project-paper">
              <div className="desk-card-title">projects breathing rn</div>
              {Object.entries(projects).map(([name, status]) => (
                <div className="desk-project-row" key={name}>
                  <span>{name}</span>
                  <select value={status} onChange={(e) => updateProject(name, e.target.value)}>
                    <option>idea</option>
                    <option>building</option>
                    <option>research</option>
                    <option>cleanup</option>
                    <option>shipping</option>
                    <option>paused</option>
                    <option>alive</option>
                  </select>
                </div>
              ))}
            </section>

            <section className="desk-card scratch-paper">
              <div className="desk-card-title">brain dump</div>
              <textarea
                value={scratch}
                onChange={(e) => {
                  setScratch(e.target.value);
                  try { localStorage.setItem(NOTE_KEY, e.target.value); } catch {}
                }}
                placeholder="write the half-thought before it runs away"
              />
            </section>
          </div>

          <div className="desk-bottom">
            <button type="button" className={"desk-doodle-btn" + (doodleActive ? " active" : "")} onClick={onToggleDoodle}>
              {doodleActive ? "finish doodling ✓" : "draw all over this ✎"}
            </button>
            <span>nothing here syncs anywhere yet. that is intentional.</span>
          </div>
        </aside>
      )}
    </>
  );
}
