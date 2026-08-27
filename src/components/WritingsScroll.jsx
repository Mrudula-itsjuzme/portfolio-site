import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WritingsScroll({ onClose }) {
  const [articles, setArticles] = useState([]);
  const [activeArticle, setActiveArticle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("portfolio_writings");
    if (saved) {
      try {
        setArticles(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse writings");
      }
    } else {
      const defaultArticles = [
        { id: 1, title: "On Dark Academia and Interfaces", date: "Aug 2026", content: "The intersection of vintage aesthetics and modern UI is fascinating...", status: "Published" },
      ];
      setArticles(defaultArticles);
      localStorage.setItem("portfolio_writings", JSON.stringify(defaultArticles));
    }
  }, []);

  const handleSave = () => {
    const updated = [...articles];
    if (isEditing === "new") {
      const newArticle = {
        id: Date.now(),
        title: editTitle || "Untitled Entry",
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' }),
        content: editContent,
        status: "Draft"
      };
      updated.unshift(newArticle);
    } else {
      const index = updated.findIndex(a => a.id === activeArticle.id);
      if (index !== -1) {
        updated[index] = { ...updated[index], title: editTitle, content: editContent };
      }
    }
    setArticles(updated);
    localStorage.setItem("portfolio_writings", JSON.stringify(updated));
    setActiveArticle(null);
    setIsEditing(false);
  };

  const handleOpen = (article) => {
    setActiveArticle(article);
    setEditTitle(article.title);
    setEditContent(article.content || "");
    setIsEditing(true);
  };

  const handleNew = () => {
    setIsEditing("new");
    setEditTitle("");
    setEditContent("");
    setActiveArticle({});
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const updated = articles.filter(a => a.id !== id);
    setArticles(updated);
    localStorage.setItem("portfolio_writings", JSON.stringify(updated));
    if (activeArticle?.id === id) {
      setActiveArticle(null);
      setIsEditing(false);
    }
  };

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
          width: "min(90vw, 650px)",
          minHeight: "65vh",
          maxHeight: "80vh",
          overflowY: "auto",
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
        <div style={{ position: "absolute", top: -10, left: -20, right: -20, height: "20px", background: "linear-gradient(180deg, #332118, #17100d)", borderRadius: "10px", boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", bottom: -10, left: -20, right: -20, height: "20px", background: "linear-gradient(180deg, #332118, #17100d)", borderRadius: "10px", boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }} />
        
        <button 
          onClick={onClose} 
          style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#4c2f20" }}
        >×</button>

        {!isEditing ? (
          <>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ fontFamily: "'Cinzel', serif", textAlign: "center", borderBottom: "1px solid rgba(76, 47, 32, 0.3)", paddingBottom: "1rem", marginBottom: "2rem" }}
            >
              Chronicles & Observations
            </motion.h2>
            
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
              <button 
                onClick={handleNew}
                style={{
                  background: "transparent",
                  border: "1px solid #4c2f20",
                  padding: "0.5rem 1rem",
                  fontFamily: "'Cinzel', serif",
                  cursor: "pointer",
                  color: "#4c2f20",
                  letterSpacing: "0.05em",
                }}
              >
                + Inscribe New Entry
              </button>
            </div>

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
                  }}
                >
                  <div onClick={() => handleOpen(article)} style={{ cursor: "pointer", flex: 1 }}>
                    <h3 style={{ margin: "0 0 0.2rem 0", fontSize: "1.3rem", fontWeight: "600" }}>{article.title}</h3>
                    <span style={{ fontSize: "0.9rem", opacity: 0.7, fontFamily: "'Outfit', sans-serif" }}>{article.date}</span>
                  </div>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <span style={{ fontSize: "0.8rem", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>{article.status}</span>
                    <button onClick={(e) => handleDelete(article.id, e)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8a4b38", fontSize: "1.5rem", padding: "0 0.5rem" }} title="Delete">×</button>
                  </div>
                </motion.div>
              ))}
              {articles.length === 0 && (
                <p style={{ textAlign: "center", fontStyle: "italic", opacity: 0.8 }}>No entries found. The ledger is empty.</p>
              )}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", borderBottom: "1px solid rgba(76, 47, 32, 0.3)", paddingBottom: "1rem" }}>
              <button 
                onClick={() => setIsEditing(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#4c2f20", fontFamily: "'Cinzel', serif", fontSize: "1rem" }}
              >
                ← Back
              </button>
              <button 
                onClick={handleSave}
                style={{ background: "#4c2f20", border: "none", color: "#e6d7bd", padding: "0.4rem 1rem", cursor: "pointer", fontFamily: "'Cinzel', serif" }}
              >
                Save
              </button>
            </div>
            
            <input 
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Title..."
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                borderBottom: "1px dashed rgba(76, 47, 32, 0.3)",
                fontSize: "1.8rem",
                fontFamily: "'Cinzel', serif",
                color: "#2e2318",
                outline: "none",
                marginBottom: "1.5rem",
                padding: "0.5rem 0",
                boxSizing: "border-box"
              }}
            />
            
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Write your entry here..."
              style={{
                width: "100%",
                minHeight: "40vh",
                background: "transparent",
                border: "none",
                fontSize: "1.2rem",
                fontFamily: "'Cormorant Garamond', serif",
                color: "#2e2318",
                outline: "none",
                resize: "vertical",
                lineHeight: "1.6",
                boxSizing: "border-box"
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
