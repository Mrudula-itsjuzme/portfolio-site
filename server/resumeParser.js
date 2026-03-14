const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");

const HEADING_WORDS = [
  "summary",
  "objective",
  "experience",
  "work experience",
  "education",
  "projects",
  "certifications",
  "skills",
  "technical skills",
  "achievements",
  "publications",
  "contact"
];

function normalizeText(text) {
  return text
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitLines(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function looksLikeHeading(line) {
  const clean = line.toLowerCase().replace(/[:|\-]/g, "").trim();
  return HEADING_WORDS.some((word) => clean === word || clean.includes(word));
}

function extractSection(lines, titles) {
  const titleSet = titles.map((t) => t.toLowerCase());
  const start = lines.findIndex((line) => {
    const value = line.toLowerCase();
    return titleSet.some((title) => value === title || value.includes(title));
  });

  if (start === -1) {
    return [];
  }

  const output = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (looksLikeHeading(line)) {
      break;
    }
    output.push(line);
  }

  return output;
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function extractName(lines) {
  const blocked = ["resume", "curriculum vitae", "linkedin", "github", "email", "phone"];

  const firstCandidate = lines.find((line) => {
    if (line.length < 3 || line.length > 60) {
      return false;
    }

    const words = line.split(/\s+/);
    if (words.length > 5) {
      return false;
    }

    const lower = line.toLowerCase();
    if (blocked.some((word) => lower.includes(word))) {
      return false;
    }

    return /^[a-z .'-]+$/i.test(line);
  });

  return firstCandidate || "Your Name";
}

function extractTitle(lines, name) {
  const index = lines.findIndex((line) => line === name);
  if (index !== -1) {
    const candidates = lines.slice(index + 1, index + 5);
    const next = candidates.find((line) => {
      const hasContact = /@|\+\d|linkedin|github|www\.|http/i.test(line);
      const looksLocation = /,\s*[A-Za-z]{2,}|india|usa|united|city/i.test(line);
      const looksEducation = /university|college|school|vidyapeetham|cgpa|\b20\d{2}\b|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i.test(line);
      return line.length > 4 && line.length < 70 && !looksLikeHeading(line) && !hasContact && !looksLocation && !looksEducation;
    });

    if (next) {
      return next;
    }
  }

  const aiStudent = lines.find((line) => /artificial intelligence|computer science/i.test(line));
  if (aiStudent) {
    return "AI & Cybersecurity Researcher";
  }

  const summaryLine = lines.find((line) => /cyber|security|engineer|analyst|research|developer/i.test(line));
  return summaryLine || "Cybersecurity Engineer";
}

function extractLinks(text) {
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
  const phoneMatch = text.match(/(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{3,4}/g) || [];
  const linkedInMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[\w\-\/?=%.]+/gi) || [];
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[\w\-]+/gi) || [];

  const email = emailMatch[0] || "";
  const phone = phoneMatch.find((p) => p.replace(/\D/g, "").length >= 10) || "";

  const linkedin = linkedInMatch[0]
    ? linkedInMatch[0].startsWith("http")
      ? linkedInMatch[0]
      : `https://${linkedInMatch[0]}`
    : "";

  const github = githubMatch[0]
    ? githubMatch[0].startsWith("http")
      ? githubMatch[0]
      : `https://${githubMatch[0]}`
    : "";

  // Some resumes store social handles without full URLs.
  if (!linkedin || !github) {
    const compact = text.replace(/\n/g, " ");
    const handleMatch =
      compact.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\s*(?:[^A-Za-z0-9]+)?\s*([A-Za-z0-9-]{3,})\s+([A-Za-z0-9-]{3,})\s+education/i) ||
      compact.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\s*(?:[^A-Za-z0-9]+)?\s*([A-Za-z0-9-]{3,})\s+([A-Za-z0-9-]{3,})/i);
    if (handleMatch) {
      const linkedInHandle = (handleMatch[1] || "").replace(/[^A-Za-z0-9-]/g, "");
      const githubHandle = (handleMatch[2] || "").replace(/[^A-Za-z0-9-]/g, "");
      const isHeading = (value) => HEADING_WORDS.some((w) => w === value.toLowerCase());

      if (!linkedin && linkedInHandle && !isHeading(linkedInHandle)) {
        return {
          email,
          phone,
          linkedin: `https://www.linkedin.com/in/${linkedInHandle}`,
          github: !github && githubHandle && !isHeading(githubHandle) ? `https://github.com/${githubHandle}` : github
        };
      }

      if (!github && githubHandle && !isHeading(githubHandle)) {
        return {
          email,
          phone,
          linkedin,
          github: `https://github.com/${githubHandle}`
        };
      }
    }
  }

  if (!linkedin || !github) {
    const handleCandidates = unique(
      (text.match(/\b[A-Za-z0-9]+(?:-[A-Za-z0-9]+)+\b/g) || [])
        .map((value) => value.trim())
        .filter((value) => value.length >= 5 && value.length <= 40)
        .filter((value) => !HEADING_WORDS.includes(value.toLowerCase()))
    );

    const linkedInHandle = handleCandidates[0] || "";
    const githubHandle = handleCandidates[1] || "";

    return {
      email,
      phone,
      linkedin: linkedin || (linkedInHandle ? `https://www.linkedin.com/in/${linkedInHandle}` : ""),
      github: github || (githubHandle ? `https://github.com/${githubHandle}` : "")
    };
  }

  return { email, phone, linkedin, github };
}

function extractSkills(lines) {
  const section = extractSection(lines, ["skills", "technical skills", "skill set"]);
  if (section.length) {
    const tokens = section
      .join(" ")
      .split(/[,|/]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 1 && s.length < 35);

    return unique(tokens).slice(0, 16);
  }

  const keywords = [
    "Python",
    "Machine Learning",
    "Deep Learning",
    "Cybersecurity",
    "Network Security",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "TensorFlow",
    "PyTorch",
    "Wireshark",
    "Power BI",
    "Data Analysis",
    "SQL",
    "Linux",
    "Flask",
    "React",
    "Node.js"
  ];

  return keywords.filter((key) => new RegExp(key.replace(/[.+]/g, "\\$&"), "i").test(lines.join(" "))).slice(0, 12);
}

function extractSummary(lines) {
  const summarySection = extractSection(lines, ["summary", "profile", "objective", "about"]);
  if (summarySection.length) {
    return summarySection.slice(0, 3).join(" ");
  }

  const education = extractSection(lines, ["education"]);
  const projects = extractSection(lines, ["projects"]);

  const eduLine = education.find((line) => line.length > 12) || "AI & Computer Science student focused on cybersecurity.";
  const projectLine = projects.find((line) => /security|intrusion|anomaly|machine learning|ml/i.test(line)) || "Builds practical ML-driven security systems and analytics workflows.";

  return `${eduLine}. ${projectLine}`.replace(/\s{2,}/g, " ").slice(0, 280);
}

function extractHighlights(lines) {
  const experience = extractSection(lines, ["experience", "work experience", "professional experience"]);
  const projects = extractSection(lines, ["projects", "project experience"]);

  const points = [...experience, ...projects]
    .map((line) => line.replace(/^[-*•]\s*/, ""))
    .filter((line) => line.length > 20)
    .slice(0, 6);

  return points;
}

async function parseResume(pdfPath) {
  const absolutePath = path.resolve(pdfPath);
  const dataBuffer = fs.readFileSync(absolutePath);
  const parser = new PDFParse({ data: dataBuffer });
  const parsed = await parser.getText();
  await parser.destroy();
  const cleanText = normalizeText(parsed.text || "");
  const lines = splitLines(cleanText);

  const name = extractName(lines);
  const title = extractTitle(lines, name);
  const links = extractLinks(cleanText);
  const skills = extractSkills(lines);
  const summary = extractSummary(lines);
  const highlights = extractHighlights(lines);

  return {
    name,
    title,
    summary,
    email: links.email,
    phone: links.phone,
    github: links.github,
    linkedin: links.linkedin,
    skills,
    highlights,
    resumePath: "/resume.pdf"
  };
}

module.exports = {
  parseResume
};
