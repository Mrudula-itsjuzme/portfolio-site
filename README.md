# Digital Library Portfolio

An immersive library-themed portfolio website for Pedamallu Sai Mrudula, built with React, Vite, Node.js, Express, Framer Motion, and Three.js.

The idea: turn a technical profile, resume, and GitHub repositories into a digital archive where each project feels like a book on a shelf.

---

## Project links and evidence

| Item | Link / Note |
|---|---|
| Repository | https://github.com/Mrudula-itsjuzme/portfolio-site |
| Paper / reference | Personal portfolio / frontend engineering project |
| Demo video | Not uploaded yet |
| Deployment | Add GitHub Pages, Vercel, or Netlify link here once deployed |
| Dataset note | Uses `assets/resume.pdf` and GitHub repository metadata generated into `public/repos.json` |
| Result screenshots | Add homepage/bookshelf/book-viewer screenshots or GIFs to a `screenshots/` folder |

---

## Features

- interactive 3D-inspired bookshelf
- project cards represented as books
- page-flip style project viewer
- ambient sound effects and library atmosphere
- GitHub repository fetching and categorization
- resume-driven profile data extraction
- generated project descriptions and architecture notes
- static deployment path through GitHub Pages

---

## System overview

```text
Resume PDF + GitHub Repos
          ↓
Data Extraction Scripts
          ↓
Prebuilt JSON / API Layer
          ↓
React Portfolio UI
          ↓
Bookshelf + Book Viewer Experience
```

---

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React, Vite, Framer Motion |
| 3D / Visuals | Three.js, React Three Fiber, Drei |
| Book UI | React PageFlip |
| Backend | Node.js, Express |
| Data extraction | pdf-parse, GitHub API scripts |
| Deployment | GitHub Pages / static build |

---

## Getting started

```bash
git clone https://github.com/Mrudula-itsjuzme/portfolio-site.git
cd portfolio-site

npm install
npm run dev
```

Development URLs:

```text
Client: http://localhost:5173
Server: http://localhost:5000
```

Optional `.env` file:

```env
GITHUB_TOKEN=your_token_here
```

---

## Important files

| File | Purpose |
|---|---|
| `assets/resume.pdf` | source profile/resume data |
| `scripts/fetch-repos.js` | fetches and prepares GitHub repository data |
| `public/repos.json` | prebuilt repository metadata |
| `src/pages/Home.jsx` | main library stage and sound logic |
| `src/components/Bookshelf.jsx` | bookshelf rendering engine |
| `src/components/BookViewer.jsx` | interactive project-book viewer |

---

## Why this project matters

A portfolio should not just list projects; it should make them memorable. This project experiments with storytelling, interaction design, and automated project presentation to make a technical profile feel more alive.

---

## Future improvements

- add live deployment link
- improve accessibility for audio and motion effects
- add fallback UI for low-performance devices
- add project filtering by domain
- add automated refresh for GitHub metadata
- add screenshots and demo GIFs

---

## Author

Built by [Pedamallu Sai Mrudula](https://github.com/Mrudula-itsjuzme) as a personal portfolio and creative frontend engineering project.
