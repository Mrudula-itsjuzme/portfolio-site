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

function selectRepoAssets(tree, owner, repo, branch) {
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

  const gallery = [];
  const seen = new Set();

  for (const item of [...previews, ...scored.filter((entry) => isUsefulGalleryPath(entry.path))]) {
    if (seen.has(item.url)) continue;
    seen.add(item.url);
    gallery.push(item.url);
    if (gallery.length === 4) break;
  }

  return {
    diagramUrl: diagram?.url || null,
    galleryUrls: gallery,
    imageCount: scored.length,
  };
}

async function fetchRepoAssets(repo) {
  const fullName = String(repo?.full_name || "");
  const branch = repo?.default_branch || "main";
  const [owner, name] = fullName.split("/");

  if (!owner || !name) {
    return { diagramUrl: null, galleryUrls: [], imageCount: 0 };
  }

  try {
    const tree = await githubGet(`https://api.github.com/repos/${owner}/${name}/git/trees/${encodeURIComponent(branch)}?recursive=1`);
    return selectRepoAssets(tree?.tree || [], owner, name, branch);
  } catch (error) {
    console.warn(`Asset scan skipped for ${fullName}: ${error.message}`);
    return { diagramUrl: null, galleryUrls: [], imageCount: 0 };
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
      : { diagramUrl: null, galleryUrls: [], imageCount: 0 };

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
