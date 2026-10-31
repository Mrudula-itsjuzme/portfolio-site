# Mrudula — Portfolio

Personal portfolio for Pedamallu Sai Mrudula.

The current site is a scrapbook/workbench-style React portfolio focused on real project evidence, published research, open-source contributions, writing, and active builds. It intentionally avoids a generic project-card layout.

## What is on the site

- selected technical projects with evidence and limitations
- published research and metrics
- open-source contributions with direct PR links
- current work and experiments
- writing and published pieces
- movable scraps, sticky notes, doodles, and lightweight interactions
- recruiter-friendly profile and resume links

## Current featured work

- Motion Capture — dual-camera markerless 3D motion capture and gait analysis
- CyberBio — adversarial robustness for materials sequence models
- Archis — intent-preserving architecture workspace
- Quests / Wild Realm — mobile-first gamified exploration platform

## Stack

- React
- Vite
- CSS
- Framer Motion
- GitHub Pages

The deployed site does not depend on a runtime GitHub ingestion service. Project content is curated directly in the portfolio so stale repository metadata or random repository images cannot silently change the site.

## Structure

```text
src/
  components/lab/   scrapbook/workbench UI
  data/lab.js       curated portfolio content
  styles/lab.css    visual system and responsive layout

public/
  diagrams/         small set of local portfolio visuals
  profile.html      lightweight profile/publications view
  resume.pdf        downloadable resume
```

## Run locally

```bash
npm install
npm run dev:client
```

Production build:

```bash
npm run build
npm run preview
```

## Deployment

GitHub Pages deploys from `main` through `.github/workflows/deploy.yml`.

## Notes

The portfolio is deliberately evidence-first. Project states, metrics, limitations, and links should be updated when the underlying work changes rather than padded with placeholder screenshots or decorative generated imagery.

## Searchable research and recruiter pages

The original interactive homepage remains intact. Two additional, self-contained static HTML pages are copied by Vite from `public/` into the built site:

- `/research.html`: peer-reviewed publications with DOI records, author-role labels, and a separate accepted-but-unpublished section
- `/work-with-me.html`: quick recruiter overview, evidence links, resume PDF, and contact details

Both are linked from the site header, profile and footer and included in `public/sitemap.xml`. Dedicated project pages are intentionally left for a separate design discussion.

For verification and search performance, see [SEARCH_VISIBILITY.md](SEARCH_VISIBILITY.md). This change does not add analytics tracking or claim access to personal Google Search Console data.
