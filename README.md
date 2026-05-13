# Digital Library Portfolio

An immersive library-themed portfolio website for **Pedamallu Sai Mrudula**, built with React, Vite, Node.js, Express, Framer Motion, and Three.js.

The idea: turn a technical profile, resume, and GitHub repositories into a digital archive where each project feels like a book on a shelf.

---

## Project links and evidence

| Item | Link / Note |
|---|---|
| Repository | https://github.com/Mrudula-itsjuzme/portfolio-site |
| Live demo | Add GitHub Pages, Vercel, or Netlify link here once deployed |
| Demo video | Not uploaded yet |
| Dataset note | Uses `assets/resume.pdf` and GitHub repository metadata generated into `public/repos.json` |
| Result screenshots | Add homepage/bookshelf/book-viewer screenshots or GIFs to a `screenshots/` folder |

---

## Features

- interactive 3D-inspired bookshelf
- project cards represented as books
- page-flip style project viewer
- GitHub repository fetching and categorization
- static `repos.json` fallback to avoid public API rate-limit issues
- resume link and profile archive layout
- sound toggle with local preference storage
- static deployment path through GitHub Pages, Vercel, or Netlify

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

## Design notes

This project is designed to feel like a quiet digital archive rather than a generic portfolio grid. The portfolio uses a bookshelf metaphor so each repository becomes a browsable artifact with context, links, and story.

Motion and sound are used as atmosphere, but the site should stay readable and usable without them. Future versions should continue improving accessibility, reduced-motion support, keyboard navigation, and performance on low-end devices.

---

## Future improvements

- add the final production deployment link
- add screenshots and demo GIFs to this README
- improve accessibility for audio and motion effects
- add fallback UI for low-performance devices
- add project filtering by category or status
- add automated refresh for GitHub metadata
- replace placeholder/fallback project content with verified project data only

---

## Author

Built by [Pedamallu Sai Mrudula](https://github.com/Mrudula-itsjuzme) as a personal portfolio and creative frontend engineering project.
