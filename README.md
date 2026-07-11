# Digital Library Portfolio

An immersive library-themed portfolio for **Pedamallu Sai Mrudula**, built to present research, engineering projects, and creative technical work as a browsable digital archive.

Instead of placing projects in a standard grid, the interface turns repositories into books on a shelf. Each project becomes an artifact that can be opened, explored, and understood in context.

## Concept

The portfolio combines resume data, GitHub repository metadata, motion, sound, and 3D-inspired interaction into one narrative experience.

The central idea is simple: a technical portfolio should not feel like a filing cabinet. It should feel like entering a world built from the work itself.

## Features

- interactive 3D-inspired bookshelf
- repositories presented as project books
- page-flip project viewer
- GitHub repository fetching and categorization
- static `repos.json` fallback for reliable public rendering
- resume and profile archive
- atmospheric sound with saved user preference
- motion-led transitions using Framer Motion
- static production build support

## System overview

```text
Resume PDF + GitHub repositories
              ↓
      Data extraction scripts
              ↓
      Prepared JSON / API layer
              ↓
         React portfolio UI
              ↓
 Bookshelf + project-book viewer
```

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React, Vite, Framer Motion |
| 3D and visuals | Three.js, React Three Fiber, Drei |
| Book interaction | React PageFlip |
| Backend | Node.js, Express |
| Data extraction | pdf-parse, GitHub API scripts |
| Export utilities | html2canvas, jsPDF |

## Run locally

```bash
git clone https://github.com/Mrudula-itsjuzme/portfolio-site.git
cd portfolio-site
npm install
npm run dev
```

Development services:

```text
Client: http://localhost:5173
Server: http://localhost:5000
```

An optional GitHub token can be added for repository-data fetching:

```env
GITHUB_TOKEN=your_token_here
```

Create a production build with:

```bash
npm run build
```

## Important files

| File | Purpose |
|---|---|
| `assets/resume.pdf` | source profile and resume data |
| `scripts/fetch-repos.js` | fetches and prepares repository metadata |
| `public/repos.json` | static repository-data fallback |
| `src/pages/Home.jsx` | main library stage and sound behaviour |
| `src/components/Bookshelf.jsx` | bookshelf rendering system |
| `src/components/BookViewer.jsx` | interactive project-book viewer |

## Design approach

The site is designed as a quiet digital archive rather than a conventional portfolio dashboard.

Motion and sound are used to create atmosphere, but the content remains the centre of the experience. The bookshelf metaphor gives each project a physical sense of place while still preserving direct links, descriptions, technologies, and repository evidence.

The architecture also keeps a static metadata fallback so the portfolio does not depend entirely on unauthenticated GitHub API requests at runtime.

## Current status

The core library experience, repository ingestion, book viewer, and static-data workflow are implemented. Current refinement areas include accessibility, reduced-motion behaviour, keyboard navigation, low-performance fallbacks, and continued verification of project metadata.

## Roadmap

- improve keyboard navigation and focus states
- strengthen reduced-motion and audio controls
- add a lightweight mode for low-performance devices
- add filtering by project category and status
- automate repository-metadata refreshes
- continue replacing fallback content with verified project data

## Author

Built by [Pedamallu Sai Mrudula](https://github.com/Mrudula-itsjuzme) as a personal portfolio and creative frontend-engineering project.