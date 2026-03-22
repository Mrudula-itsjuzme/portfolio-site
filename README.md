# 📚 Digital Library | Portfolio

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)

A immersive, library-themed portfolio for **Mrudula Sankar**. This is a full-stack application that transforms a technical resume and GitHub repositories into a digital archive of "working volumes" that users can pull from a shelf and read.

## ✨ Features

- **Interactive Bookshelf**: A 3D-inspired bookshelf where each project is a unique book.
- **Realistic Page Flip**: High-fidelity book viewer with physical page-turning animations.
- **Ambient Soundscape**: Generative ambient music and physical sound effects (paper flips, book pulls).
- **Auto-Syncing Intelligence**:
  - Automatically parses `assets/resume.pdf` to populate profile details.
  - Live-fetches and categorizes GitHub repositories using the GitHub API.
  - Smart categorization into AI/ML, Cybersecurity, and Engineering domains.
- **Rich Project Detail**: Automatic generation of technical architecture diagrams and implementation notes for every repository.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Framer Motion, React-PageFlip, Three.js (Fiber/Drei).
- **Backend**: Node.js, Express.
- **Data Mining**: `pdf-parse` for resume extraction, Custom GitHub Scraper for repo metadata.
- **Deployment**: GitHub Pages (static build with pre-baked JSON).

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Mrudula-itsjuzme/portfolio-site.git
   cd portfolio-site
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment** (Optional):
   Create a `.env` file for local GitHub API limits:
   ```env
   GITHUB_TOKEN=your_token_here
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   - Client: `http://localhost:5173`
   - Server: `http://localhost:5000`

## 📖 Important Files

- `assets/resume.pdf`: The source of truth for profile data.
- `scripts/fetch-repos.js`: CI script that bakes GitHub data into `public/repos.json`.
- `src/pages/Home.jsx`: Main library stage and ambient music logic.
- `src/components/Bookshelf.jsx`: The shelf rendering engine.
- `src/components/BookViewer.jsx`: The interactive book layout system.

---
Designed & Built with ❤️ by Mrudula Sankar
