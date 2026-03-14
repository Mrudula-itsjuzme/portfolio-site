# Portfolio Website (React + Node)

This portfolio is now a full-stack app:
- Frontend: React + Vite
- Backend: Node.js + Express
- Resume parsing: `pdf-parse`
- GitHub repo intelligence: live parsing of your repositories

The backend reads `assets/resume.pdf`, extracts profile details, and the React UI renders those details automatically.

## Run locally
1. Open terminal in this folder.
2. Install dependencies:
   - `npm install`
3. Start both frontend and backend:
   - `npm run dev`
4. Open:
   - `http://localhost:5173`

## Important files
- `server/index.js` - API server and resume endpoint
- `server/resumeParser.js` - resume text extraction and detail parsing
- `src/App.jsx` - main UI that consumes `/api/profile`
- `src/styles.css` - custom UI design and responsive styles
- `assets/resume.pdf` - your source resume file

## API endpoints
- `GET /api/profile` - parsed details from resume
- `GET /api/projects` - parsed repository insights from your GitHub profile
- `GET /resume.pdf` - serves your resume file
- `GET /api/health` - health check

## Notes
- If you update `assets/resume.pdf`, refresh the page; new details are parsed automatically.
- If GitHub or LinkedIn links are missing in the resume text, the UI falls back to safe defaults.
- Repositories are cached briefly on the backend for performance.
- Set `GITHUB_TOKEN` in your environment to avoid public API rate limits.
