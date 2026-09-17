import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/library.css";
import "./styles/entrance.css";
import "./styles/archive-viewer.css";
import "./styles/archive-viewer-fixes.css";
import "./styles/premium-motion.css";
import "./premium-motion";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
