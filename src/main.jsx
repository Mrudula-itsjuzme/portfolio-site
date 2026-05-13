import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/library.css";
import "./styles/entrance.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
