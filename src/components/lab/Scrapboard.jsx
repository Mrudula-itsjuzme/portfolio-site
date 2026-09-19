import DraggableScrap from "./DraggableScrap";

export default function Scrapboard({
  items = [],
  note = null,
  className = "",
  variant = "paper",
}) {
  return (
    <div className={"project-scrapboard board-" + variant + " " + className}>
      <div className="scrapboard-grid" aria-hidden="true" />
      {items.map((item) => (
        <DraggableScrap
          key={item.id}
          initial={item.initial}
          className={item.kind || ""}
        >
          <figure className="proof-paper">
            <span className="proof-tape" aria-hidden="true" />
            {item.type === "video" ? (
              <video
                src={item.src}
                controls
                muted
                playsInline
                preload="metadata"
                poster={item.poster || undefined}
              />
            ) : (
              <img src={item.src} alt={item.label || ""} loading="lazy" />
            )}
            <figcaption>
              <strong>{item.label}</strong>
              {item.caption ? <span>{item.caption}</span> : null}
            </figcaption>
          </figure>
        </DraggableScrap>
      ))}

      {note ? (
        <aside className="proof-note">
          <span>{note.kicker}</span>
          <p>{note.text}</p>
        </aside>
      ) : null}
    </div>
  );
}
