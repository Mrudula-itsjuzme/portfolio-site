import { motion } from "framer-motion";

export default function WritingsScroll({ onClose }) {
  // Articles data
  const articles = [
    { id: 1, title: "On Dark Academia and Interfaces", date: "Aug 2026", status: "Draft" },
    { id: 2, title: "Adversarial Examples in Physical UI", date: "Jul 2026", status: "Published" },
    { id: 3, title: "The Aesthetics of Computing", date: "Jun 2026", status: "Archived" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "10vh",
        background: "rgba(5, 3, 2, 0.8)",
        backdropFilter: "blur(12px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        exit={{ scaleY: 0, opacity: 0, transition: { duration: 0.3 } }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        style={{
          transformOrigin: "top center",
          width: "min(90vw, 600px)",
          minHeight: "60vh",
          background: "linear-gradient(180deg, #e6d7bd, #cbb798)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(100, 70, 40, 0.2)",
          borderRadius: "2px",
          position: "relative",
          padding: "3rem 2rem",
          color: "#2e2318",
          fontFamily: "'Cormorant Garamond', serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scroll wooden rollers top and bottom */}
        <div style={{ position: "absolute", top: -10, left: -20, right: -20, height: "20px", background: "linear-gradient(180deg, #332118, #17100d)", borderRadius: "10px", boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", bottom: -10, left: -20, right: -20, height: "20px", background: "linear-gradient(180deg, #332118, #17100d)", borderRadius: "10px", boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }} />
        
        <button 
          onClick={onClose} 
          style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#4c2f20" }}
        >×</button>

        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ fontFamily: "'Cinzel', serif", textAlign: "center", borderBottom: "1px solid rgba(76, 47, 32, 0.3)", paddingBottom: "1rem", marginBottom: "2rem" }}
        >
          Chronicles & Observations
        </motion.h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {articles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "0.5rem",
                borderBottom: "1px dashed rgba(76, 47, 32, 0.2)",
                cursor: "pointer"
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 0.2rem 0", fontSize: "1.2rem", fontWeight: "600" }}>{article.title}</h3>
                <span style={{ fontSize: "0.85rem", opacity: 0.7, fontFamily: "'Outfit', sans-serif" }}>{article.date}</span>
              </div>
              <span style={{ fontSize: "0.8rem", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>{article.status}</span>
            </motion.div>
          ))}
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ textAlign: "center", marginTop: "3rem", fontStyle: "italic", opacity: 0.8 }}
        >
          More writings are being compiled into the ledger...
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
