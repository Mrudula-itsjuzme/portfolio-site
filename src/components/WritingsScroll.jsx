import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { articles } from "../data/articles";

export default function WritingsScroll({ onClose }) {
  const [activeArticle, setActiveArticle] = useState(null);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.18 }}
      className="writings-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "grid",
        placeItems: "center",
        padding: "clamp(1rem, 4vw, 3rem)",
        background: "rgba(5, 3, 2, 0.76)",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Writings"
    >
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: 12 }}
        transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "min(960px, 100%)",
          maxHeight: "min(86vh, 900px)",
          overflow: "hidden",
          background: "linear-gradient(180deg, #eadfc9 0%, #d6c5a8 100%)",
          border: "1px solid rgba(82, 56, 34, 0.38)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.48)",
          color: "#2d2117",
          position: "relative",
        }}
      >
        <button
          type="button"
          aria-label="Close writings"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            zIndex: 4,
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1px solid rgba(74,47,31,0.28)",
            background: "rgba(239,227,203,0.78)",
            color: "#3b281b",
            cursor: "pointer",
            fontSize: "1.45rem",
          }}
        >
          ×
        </button>

        <AnimatePresence mode="wait" initial={false}>
          {!activeArticle ? (
            <motion.div
              key="index"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ maxHeight: "inherit", overflowY: "auto", padding: "clamp(2rem, 5vw, 4rem)" }}
            >
              <p style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: ".72rem", letterSpacing: ".18em", textTransform: "uppercase", opacity: .68 }}>
                Essays, notes & field observations
              </p>
              <h2 style={{ margin: ".45rem 0 .55rem", fontFamily: "'Cinzel', serif", fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.05 }}>
                Writings
              </h2>
              <p style={{ maxWidth: 640, margin: "0 0 2.25rem", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", lineHeight: 1.55, opacity: .8 }}>
                Things I've actually written: essays, public notes, startup thoughts, and the occasional idea that refused to stay in drafts.
              </p>

              <div style={{ display: "grid", gap: ".9rem" }}>
                {articles.map((article, index) => (
                  <motion.button
                    key={article.id}
                    type="button"
                    onClick={() => setActiveArticle(article)}
                    whileHover={reduceMotion ? undefined : { y: -2 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.995 }}
                    transition={{ duration: .14 }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0,1fr) auto",
                      gap: "1.25rem",
                      textAlign: "left",
                      width: "100%",
                      border: "1px solid rgba(74,47,31,.2)",
                      background: index === 0 ? "rgba(255,249,236,.6)" : "rgba(255,249,236,.3)",
                      padding: "1.2rem 1.3rem",
                      cursor: "pointer",
                      color: "inherit",
                    }}
                  >
                    <span>
                      <span style={{ display: "block", fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: "clamp(1rem, 2.3vw, 1.2rem)", marginBottom: ".4rem" }}>
                        {article.title}
                      </span>
                      <span style={{ display: "block", fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", lineHeight: 1.45, opacity: .78 }}>
                        {article.excerpt}
                      </span>
                    </span>
                    <span style={{ alignSelf: "start", whiteSpace: "nowrap", fontFamily: "'Outfit', sans-serif", fontSize: ".72rem", letterSpacing: ".08em", textTransform: "uppercase", opacity: .58 }}>
                      {article.readTime} →
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.article
              key={activeArticle.id}
              initial={reduceMotion ? false : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
              transition={{ duration: reduceMotion ? 0 : .18 }}
              style={{ maxHeight: "inherit", overflowY: "auto", padding: "clamp(2rem, 6vw, 4.5rem)" }}
            >
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                style={{ border: 0, background: "transparent", color: "inherit", cursor: "pointer", padding: 0, fontFamily: "'Outfit', sans-serif", fontSize: ".8rem", letterSpacing: ".08em", textTransform: "uppercase", opacity: .7 }}
              >
                ← All writings
              </button>

              <header style={{ margin: "1.25rem 0 2rem", maxWidth: 760 }}>
                <p style={{ margin: "0 0 .65rem", fontFamily: "'Outfit', sans-serif", fontSize: ".72rem", letterSpacing: ".12em", textTransform: "uppercase", opacity: .62 }}>
                  {activeArticle.date} · {activeArticle.readTime}
                </p>
                <h2 style={{ margin: 0, fontFamily: "'Cinzel', serif", fontSize: "clamp(2rem, 5vw, 3.45rem)", lineHeight: 1.08 }}>
                  {activeArticle.title}
                </h2>
              </header>

              <div style={{ maxWidth: 760 }}>
                {activeArticle.content.split("\n\n").map((paragraph, index) => (
                  <p key={index} style={{ margin: "0 0 1.15rem", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.08rem, 2vw, 1.22rem)", lineHeight: 1.72 }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </motion.section>
    </motion.div>
  );
}
