const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { parseResume } = require("./resumeParser");
const { getGitHubProjects } = require("./githubProjects");

const app = express();
const PORT = process.env.PORT || 5000;
const resumeFile = path.join(__dirname, "..", "assets", "resume.pdf");

app.use(cors());
app.use(express.json());

// Cache with TTL
let cache = {
  mtimeMs: 0,
  profile: null,
  timestamp: 0,
  TTL: 5 * 60 * 1000 // 5 minutes
};

function isCacheValid() {
  return cache.profile && (Date.now() - cache.timestamp < cache.TTL);
}

async function getProfile() {
  try {
    const stat = fs.statSync(resumeFile);

    // Check file modification or cache expiration
    if (!cache.profile || stat.mtimeMs !== cache.mtimeMs || !isCacheValid()) {
      const parsed = await parseResume(resumeFile);
      cache = {
        mtimeMs: stat.mtimeMs,
        profile: parsed,
        timestamp: Date.now(),
        TTL: cache.TTL
      };
    }
    return cache.profile;
  } catch (error) {
    console.error("Error in getProfile:", error);
    throw error;
  }
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/profile", async (_req, res) => {
  try {
    if (!fs.existsSync(resumeFile)) {
      return res.status(404).json({
        error: "Resume not found",
        message: "Place your resume at assets/resume.pdf"
      });
    }

    const profile = await getProfile();
    res.json(profile);
  } catch (error) {
    console.error("Error parsing resume:", error);
    res.status(500).json({
      error: "Failed to parse resume",
      message: error.message || "An unknown error occurred"
    });
  }
});

app.get("/api/projects", async (_req, res) => {
  try {
    if (!fs.existsSync(resumeFile)) {
      return res.status(404).json({
        error: "Resume not found",
        message: "Place your resume at assets/resume.pdf",
        projects: []
      });
    }

    const profile = await getProfile();
    const projects = await getGitHubProjects(profile);

    // Set cache headers
    res.set("Cache-Control", "public, max-age=300"); // 5 minutes
    res.json(projects);
  } catch (error) {
    console.error("Error loading projects:", error);
    res.status(500).json({
      error: "Failed to load GitHub projects",
      message: error.message || "An unknown error occurred",
      projects: []
    });
  }
});

app.get("/resume.pdf", (_req, res) => {
  if (!fs.existsSync(resumeFile)) {
    return res.status(404).send("Resume file not found");
  }

  res.set("Cache-Control", "public, max-age=86400"); // 1 day
  return res.sendFile(resumeFile);
});

// Error handler for unhandled routes
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

