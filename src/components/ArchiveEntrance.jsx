import { motion } from "framer-motion";

const proofItems = [
  { value: "1,127+", label: "GitHub contributions" },
  { value: "20+", label: "public repositories" },
  { value: "2", label: "research publications" },
  { value: "∞", label: "unfinished experiments" }
];

const quickLinks = [
  { label: "Enter Archive", href: "#archive", kind: "primary" },
  { label: "GitHub", href: "https://github.com/Mrudula-itsjuzme" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/pedamallusaimrudula/" }
];

export default function ArchiveEntrance() {
  return (
    <section className="archive-entrance" aria-label="Portfolio entrance">
      <div className="entrance-orbit entrance-orbit-one" aria-hidden="true" />
      <div className="entrance-orbit entrance-orbit-two" aria-hidden="true" />
      <div className="entrance-grid" aria-hidden="true" />

      <motion.div
        className="entrance-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="entrance-eyebrow">
          <span className="pulse-dot" />
          Portfolio Archive / Vol. 01
        </div>

        <div className="entrance-copy">
          <p className="entrance-kicker">Welcome to the archive</p>
          <h1>
            Code, research, and experiments arranged like forbidden books.
          </h1>
          <p className="entrance-lede">
            I am Pedamallu Sai Mrudula — a CSE-AI student, researcher, developer,
            and creative technologist building thoughtful systems with receipts.
          </p>
        </div>

        <div className="entrance-proof" aria-label="Profile highlights">
          {proofItems.map((item) => (
            <div className="proof-tile" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="entrance-actions" aria-label="Quick links">
          {quickLinks.map((link) => (
            <a
              key={link.label}
              className={link.kind === "primary" ? "entrance-btn entrance-btn-primary" : "entrance-btn"}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="entrance-side-note"
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35, duration: 0.7, ease: "easeOut" }}
      >
        <span>Current shelf note</span>
        <p>
          Pull a book below. Every project opens into context, links, notes, and a little drama.
        </p>
      </motion.div>
    </section>
  );
}
