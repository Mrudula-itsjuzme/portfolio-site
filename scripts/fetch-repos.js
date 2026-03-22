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

function detectTechnologies(tree, topics, name, description) {
  const tech = new Set(topics.map(t => t.toLowerCase()));
  const paths = (Array.isArray(tree) ? tree : []).map(node => node.path.toLowerCase());
  const context = `${name} ${description}`.toLowerCase();

  // Frameworks & Languages
  if (paths.some(p => p.includes("package.json")) || context.includes("node.js") || context.includes("express")) tech.add("node.js");
  if (paths.some(p => p.includes("requirements.txt") || p.includes("environment.yml")) || context.includes("python")) tech.add("python");
  if (paths.some(p => p.endsWith(".jsx") || p.endsWith(".tsx")) || context.includes("react")) tech.add("react");
  if (context.includes("typescript") || paths.some(p => p.endsWith(".ts") || p.endsWith(".tsx"))) tech.add("typescript");
  if (context.includes("next.js") || paths.some(p => p.includes("next.config"))) tech.add("next.js");
  
  // AI/ML - Specialized
  if (context.includes("yolo") || context.includes("v8")) tech.add("yolov8");
  if (context.includes("dqn") || context.includes("deep q")) tech.add("double dqn");
  if (context.includes("reinforcement") || context.includes("rl")) tech.add("reinforcement learning");
  if (context.includes("neural") || context.includes("deep learning")) tech.add("neural networks");
  if (context.includes("transformer") || context.includes("attention")) tech.add("transformers");
  if (context.includes("genai") || context.includes("llm") || context.includes("rag")) tech.add("genai/llm");
  if (context.includes("anomaly") || context.includes("intrusion") || context.includes("ids") || context.includes("60870")) tech.add("smart grid security");
  if (context.includes("classification") || context.includes("classifier")) tech.add("classification");
  
  // Signal Processing & Math
  if (context.includes("eeg") || context.includes("signal")) tech.add("signal processing");
  if (context.includes("admm") || context.includes("svd")) tech.add("svd/admm");
  if (context.includes("bioinformatics") || context.includes("gene")) tech.add("bioinformatics");
  
  // Hardware & Embedded
  if (context.includes("esp32") || context.includes("esp-wroom")) tech.add("esp32");
  if (context.includes("arduino") || paths.some(p => p.endsWith(".ino"))) tech.add("arduino");
  if (context.includes("iot") || context.includes("smart home") || context.includes("greenhouse")) tech.add("iot");

  // Traditional AI/ML Libraries
  if (paths.some(p => p.includes("tensorflow") || p.includes(".pb")) || context.includes("tensorflow")) tech.add("tensorflow");
  if (paths.some(p => p.includes("torch")) || context.includes("pytorch")) tech.add("pytorch");
  if (paths.some(p => p.includes("sklearn")) || context.includes("scikit")) tech.add("scikit-learn");
  if (context.includes("mediapipe") || paths.some(p => p.includes("mediapipe"))) tech.add("mediapipe");
  if (context.includes("opencv") || context.includes("cv2")) tech.add("opencv");

  // Infrastructure
  if (paths.some(p => p.includes("dockerfile")) || context.includes("docker")) tech.add("docker");
  if (context.includes("microservices")) tech.add("microservices");
  if (context.includes("api") || context.includes("rest") || context.includes("graphql")) tech.add("api design");

  // Formatting cleanup - filter out very short junk and limit count
  return Array.from(tech)
    .filter(t => t.length > 2)
    .map(t => {
      // Manual overrides for acronyms
      if (["iot", "eeg", "rl", "cnn", "dqn", "ids", "ml"].includes(t)) return t.toUpperCase();
      if (t === "yolov8") return "YOLOv8";
      if (t === "node.js") return "Node.js";
      if (t === "next.js") return "Next.js";
      return t.charAt(0).toUpperCase() + t.slice(1);
    })
    .slice(0, 8);
}

function selectRepoAssets(tree, owner, repo, branch, topics, description) {
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
    techStack: detectTechnologies(tree, topics, repo, description)
  };
}

async function fetchRepoAssets(repo) {
  const fullName = String(repo?.full_name || "");
  const branch = repo?.default_branch || "main";
  const topics = Array.isArray(repo?.topics) ? repo.topics : [];
  const description = repo?.description || "";
  const [owner, name] = fullName.split("/");

  if (!owner || !name) {
    return { diagramUrl: null, galleryUrls: [], imageCount: 0, techStack: [] };
  }

  try {
    const tree = await githubGet(`https://api.github.com/repos/${owner}/${name}/git/trees/${encodeURIComponent(branch)}?recursive=1`);
    return selectRepoAssets(tree?.tree || [], owner, name, branch, topics, description);
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
