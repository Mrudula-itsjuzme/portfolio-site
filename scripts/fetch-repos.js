// Run during CI build to bake your real GitHub repos into a static JSON file.
// Requires Node 18+. Uses GITHUB_TOKEN env var (auto-provided by Actions).
const { writeFileSync, mkdirSync } = require("fs");
const { join } = require("path");

const GITHUB_USERNAME = "Mrudula-itsjuzme";

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "portfolio-site-builder",
};

if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

async function main() {
  const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&direction=desc`;
  console.log(`Fetching repos for ${GITHUB_USERNAME}...`);

  const res = await fetch(url, { headers });

  if (!res.ok) {
    const body = await res.text();
    console.error(`GitHub API error ${res.status}: ${body}`);
    process.exit(1);
  }

  const raw = await res.json();

  const repos = raw
    .filter((r) => !r.fork && r.name !== "portfolio-site")
    .map((r) => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      description: r.description || "",
      language: r.language || "Code",
      url: r.html_url,
      homepage: r.homepage || "",
      topics: Array.isArray(r.topics) ? r.topics : [],
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
    }));

  console.log(`Found ${repos.length} repos (excluding forks and portfolio-site)`);

  mkdirSync(join(__dirname, "../public"), { recursive: true });
  const outPath = join(__dirname, "../public/repos.json");
  writeFileSync(outPath, JSON.stringify(repos, null, 2));
  console.log(`Written to ${outPath}`);
}

main().catch((err) => {
  console.error("fetch-repos failed:", err);
  process.exit(1);
});
