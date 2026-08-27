const CACHE_TTL_MS = 10 * 60 * 1000;

const cache = {
  username: "",
  expiresAt: 0,
  projects: [],
  stats: null
};

function getGitHubUsername(profile) {
  const profileUrl = (profile && profile.github) || "";
  const match = profileUrl.match(/github\.com\/([A-Za-z0-9-]+)/i);
  if (match && match[1]) {
    return match[1];
  }

  return "";
}

function getHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-site"
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function githubGet(url) {
  const res = await fetch(url, {
    headers: getHeaders()
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body.slice(0, 250)}`);
  }

  return res.json();
}

async function fetchAllRepos(username) {
  const repos = [];
  let page = 1;
  // When a token is present use the authenticated endpoint which returns private repos too
  const useAuth = !!process.env.GITHUB_TOKEN;

  while (true) {
    const url = useAuth
      ? `https://api.github.com/user/repos?per_page=100&page=${page}&sort=updated&direction=desc&visibility=all&affiliation=owner`
      : `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&sort=updated&direction=desc`;

    const chunk = await githubGet(url);

    if (!Array.isArray(chunk) || chunk.length === 0) {
      break;
    }

    repos.push(...chunk);
    if (chunk.length < 100) {
      break;
    }

    page += 1;
    if (page > 10) {
      break;
    }
  }

  return repos;
}

async function fetchReadmeSummary(owner, repoName) {
  try {
    const url = `https://api.github.com/repos/${owner}/${repoName}/readme`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500); // 1.5s per-request cap
    const res = await fetch(url, {
      headers: {
        ...getHeaders(),
        Accept: "application/vnd.github.raw+json"
      },
      signal: controller.signal
    });
    clearTimeout(timer);

    if (!res.ok) {
      return "";
    }

    const text = await res.text();
    const lines = text
      .split("\n")
      .map((line) => line.replace(/^#+\s*/, "").trim())
      .filter((line) => line && !/^!\[/.test(line) && !/^\[/.test(line));

    const paragraph = lines.find((line) => line.length > 30 && line.length < 220);
    return paragraph || "";
  } catch (_err) {
    return ""; // timeout or network error — skip silently
  }
}

function classifyProject(repo) {
  const bucketText = `${repo.name} ${repo.description || ""}`.toLowerCase();

  if (/cyber|security|intrusion|attack|threat/.test(bucketText)) {
    return "Cybersecurity";
  }

  if (/ml|machine|ai|neural|anomaly|xai|model/.test(bucketText)) {
    return "AI/ML";
  }

  if (/dashboard|ui|web|react|frontend|visual/.test(bucketText)) {
    return "Data Experience";
  }

  if (/script|automation|tool|utils/.test(bucketText)) {
    return "Automation";
  }

  return "Engineering";
}

function summarizeLanguageMix(repos) {
  const counts = {};
  for (const repo of repos) {
    const key = repo.language || "Other";
    counts[key] = (counts[key] || 0) + 1;
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([language, count]) => ({ language, count }));
}

async function buildProjects(username) {
  const repos = await fetchAllRepos(username);
  const filtered = repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  // Fetch READMEs in parallel — allSettled so one slow/private repo can't block the rest
  const readmeTargets = filtered.slice(0, 20);
  const settled = await Promise.allSettled(
    readmeTargets.map((repo) => fetchReadmeSummary(repo.owner.login, repo.name))
  );

  const summaryMap = {};
  readmeTargets.forEach((repo, i) => {
    summaryMap[repo.id] = settled[i].status === "fulfilled" ? settled[i].value : "";
  });

  const projects = filtered.map((repo) => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || summaryMap[repo.id] || "Project details available on repository.",
    readmeSummary: summaryMap[repo.id] || "",
    url: repo.html_url,
    homepage: repo.homepage || "",
    category: classifyProject(repo),
    language: repo.language || "Mixed",
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    watchers: repo.watchers_count || 0,
    topics: Array.isArray(repo.topics) ? repo.topics.slice(0, 5) : [],
    updatedAt: repo.updated_at
  }));

  const stats = {
    totalRepos: filtered.length,
    totalStars: filtered.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
    languageMix: summarizeLanguageMix(filtered),
    mostRecent: filtered[0] ? filtered[0].updated_at : null
  };

  return { projects, stats };
}

async function getGitHubProjects(profile) {
  const username = getGitHubUsername(profile);
  if (!username) {
    return {
      username: "",
      projects: [],
      stats: {
        totalRepos: 0,
        totalStars: 0,
        languageMix: [],
        mostRecent: null
      }
    };
  }

  if (cache.username === username && cache.expiresAt > Date.now()) {
    return {
      username,
      projects: cache.projects,
      stats: cache.stats
    };
  }

  const payload = await buildProjects(username);
  cache.username = username;
  cache.projects = payload.projects;
  cache.stats = payload.stats;
  cache.expiresAt = Date.now() + CACHE_TTL_MS;

  return {
    username,
    projects: payload.projects,
    stats: payload.stats
  };
}

module.exports = {
  getGitHubProjects
};
