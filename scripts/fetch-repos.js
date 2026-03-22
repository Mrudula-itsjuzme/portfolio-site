// Run during CI build to bake your real GitHub repos into a static JSON file.
// Requires Node 18+. Uses GITHUB_TOKEN env var (auto-provided by Actions).
const { writeFileSync, mkdirSync } = require("fs");
const { join } = require("path");

const GITHUB_USERNAME = "Mrudula-itsjuzme";
const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg"]);
const MAX_REPOS_TO_SCAN = 40;

function isDiagramPath(filePath) {
  const path = String(filePath).toLowerCase();
  return path.includes("diagram") || path.includes("architecture") || path.includes("flowchart") || path.includes("system-design") || path.includes("uml") || path.includes("pipeline");
}

function isUsefulGalleryPath(filePath) {
  const path = String(filePath).toLowerCase();

  if (/(^|\/)(next|vercel|file|globe|window|favicon)\.svg$/.test(path)) {
    return false;
  }

  return (
    path.includes("docs/") ||
    path.includes("assets/") ||
    path.includes("images/") ||
    path.includes("img/") ||
    path.includes("screenshots/") ||
    path.includes("screens/") ||
    path.includes("preview") ||
    path.includes("dashboard") ||
    path.includes("screenshot") ||
    path.includes("result") ||
    path.includes("output") ||
    path.includes("demo") ||
    path.includes("sample") ||
    path.includes("plot") ||
    path.includes("chart") ||
    path.includes("matrix") ||
    path.includes("report") ||
    path.includes("confusion") ||
    path.includes("wordcloud") ||
    path.includes("interaction")
  );
}

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "portfolio-site-builder",
};

if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

async function githubGet(url) {
  const res = await fetch(url, { headers });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body.slice(0, 300)}`);
  }

  return res.json();
}

function isImagePath(filePath) {
  const ext = String(filePath).split(".").pop()?.toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

function rawGitHubUrl(owner, repo, branch, filePath) {
  const segments = String(filePath)
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  return `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(branch)}/${segments}`;
}

function scoreAsset(filePath) {
  const path = String(filePath).toLowerCase();
  let score = 0;

  if (isDiagramPath(path)) {
    score += 100;
  }

  if (path.includes("docs/") || path.includes("doc/") || path.includes("assets/") || path.includes("images/") || path.includes("img/") || path.includes("screenshots/") || path.includes("screens/")) {
    score += 25;
  }

  if (path.includes("preview") || path.includes("dashboard") || path.includes("screenshot") || path.includes("result") || path.includes("output") || path.includes("demo") || path.includes("sample")) {
    score += 40;
  }

  if (path.endsWith(".svg")) {
    score += 15;
  }

  score -= path.split("/").length;
  return score;
}

function detectTechnologies(tree, topics) {
  const tech = new Set(topics.map(t => t.toLowerCase()));
  const paths = (Array.isArray(tree) ? tree : []).map(node => node.path.toLowerCase());

  // Language & Framework Detection
  if (paths.some(p => p.includes("package.json"))) tech.add("node.js");
  if (paths.some(p => p.includes("requirements.txt") || p.includes("environment.yml"))) tech.add("python");
  if (paths.some(p => p.endsWith(".jsx") || p.endsWith(".tsx"))) tech.add("react");
  if (paths.some(p => p.includes("next.config"))) tech.add("next.js");
  if (paths.some(p => p.includes("app.py") || p.includes("flask"))) tech.add("flask");
  if (paths.some(p => p.includes("main.py") && (p.includes("fastapi") || p.includes("uvicorn")))) tech.add("fastapi");
  
  // AI/ML Detection
  if (paths.some(p => p.includes("tensorflow") || p.includes(".pb") || p.includes(".h5"))) tech.add("tensorflow");
  if (paths.some(p => p.includes("torch") || p.includes(".pt") || p.includes(".pth"))) tech.add("pytorch");
  if (paths.some(p => p.includes("sklearn") || p.includes("scikit"))) tech.add("scikit-learn");
  if (paths.some(p => p.includes("mediapipe"))) tech.add("mediapipe");
  if (paths.some(p => p.includes("opencv") || p.includes("cv2"))) tech.add("opencv");

  // Web & Styles
  if (paths.some(p => p.includes("tailwind"))) tech.add("tailwind css");
  if (paths.some(p => p.includes("bootstrap"))) tech.add("bootstrap");
  if (paths.some(p => p.endsWith(".scss") || p.endsWith(".sass"))) tech.add("sass");

  // Infrastructure
  if (paths.some(p => p.includes("dockerfile") || p.includes("docker-compose"))) tech.add("docker");
  if (paths.some(p => p.includes(".vercel"))) tech.add("vercel");
  if (paths.some(p => p.includes("firebase"))) tech.add("firebase");

  // Formatting cleanup
  return Array.from(tech)
    .map(t => t.charAt(0).toUpperCase() + t.slice(1))
    .filter(t => t.length > 2)
    .slice(0, 8);
}

function selectRepoAssets(tree, owner, repo, branch, topics) {
  const imageNodes = (Array.isArray(tree) ? tree : []).filter(
    (node) => node?.type === "blob" && isImagePath(node.path)
  );

  const scored = imageNodes
    .map((node) => ({
      path: node.path,
      score: scoreAsset(node.path),
      url: rawGitHubUrl(owner, repo, branch, node.path),
    }))
    .sort((a, b) => b.score - a.score);

  const diagram = scored.find((item) => isDiagramPath(item.path));

  const previews = scored.filter((item) => isUsefulGalleryPath(item.path));
  
  const candidates = previews.length >= 2 ? previews : scored;

  const gallery = [];
  const seen = new Set();

  for (const item of candidates) {
    if (seen.has(item.url)) continue;
    seen.add(item.url);
    gallery.push(item.url);
    if (gallery.length === 6) break;
  }

  return {
    diagramUrl: diagram?.url || (scored[0] ? scored[0].url : null),
    galleryUrls: gallery,
    imageCount: scored.length,
    techStack: detectTechnologies(tree, topics)
  };
}

async function fetchRepoAssets(repo) {
  const fullName = String(repo?.full_name || "");
  const branch = repo?.default_branch || "main";
  const topics = Array.isArray(repo?.topics) ? repo.topics : [];
  const [owner, name] = fullName.split("/");

  if (!owner || !name) {
    return { diagramUrl: null, galleryUrls: [], imageCount: 0, techStack: [] };
  }

  try {
    const tree = await githubGet(`https://api.github.com/repos/${owner}/${name}/git/trees/${encodeURIComponent(branch)}?recursive=1`);
    return selectRepoAssets(tree?.tree || [], owner, name, branch, topics);
  } catch (error) {
    console.warn(`Asset scan skipped for ${fullName}: ${error.message}`);
    return { diagramUrl: null, galleryUrls: [], imageCount: 0, techStack: Array.isArray(repo?.topics) ? repo.topics : [] };
  }
}

async function main() {
  const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&direction=desc`;
  console.log(`Fetching repos for ${GITHUB_USERNAME}...`);

  const raw = await githubGet(url);

  const filtered = raw.filter((r) => !r.fork && r.name !== "portfolio-site" && r.name !== GITHUB_USERNAME);
  console.log(`Found ${filtered.length} repos (excluding forks and portfolio-site)`);

  const repos = [];

  for (const [index, repo] of filtered.entries()) {
    const shouldScanAssets = index < MAX_REPOS_TO_SCAN;
    const assets = shouldScanAssets
      ? await fetchRepoAssets(repo)
      : { diagramUrl: null, galleryUrls: [], imageCount: 0, techStack: Array.isArray(repo?.topics) ? repo.topics : [] };

    repos.push({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || "",
      language: repo.language || "Code",
      url: repo.html_url,
      homepage: repo.homepage || "",
      topics: Array.isArray(repo.topics) ? repo.topics : [],
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      defaultBranch: repo.default_branch || "main",
      repoAssets: assets,
    });
  }

  mkdirSync(join(__dirname, "../public"), { recursive: true });
  const outPath = join(__dirname, "../public/repos.json");
  writeFileSync(outPath, JSON.stringify(repos, null, 2));
  console.log(`Written to ${outPath}`);
}

main().catch((err) => {
  console.error("fetch-repos failed:", err);
  process.exit(1);
});
