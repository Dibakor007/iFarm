<!-- <div align="center">
  <img width="1200" height="475" alt="iFarm Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div> -->

# iFarm

A full-stack Cold Storage / Farm management dashboard.

## Prerequisites

- Node.js (LTS recommended)
- MySQL (e.g., XAMPP) for the backend

## Quick start (Frontend)

1. Install dependencies:
   - `npm install`
2. Create a local env file (do not commit it):
   - Copy `.env.example` → `.env.local`
   - Fill `GEMINI_API_KEY` if you want AI features
3. Run the app:
   - `npm run dev`

Frontend runs on `http://localhost:3000`.

## Quick start (Backend)

1. Open a new terminal and go to the backend:
   - `cd ifarm-backend`
2. Install dependencies:
   - `npm install`
3. Create the backend env file (do not commit it):
   - Copy `.env.example` → `.env.local`
   - Fill your DB credentials and other settings
4. Start the backend:
   - `npm run dev`

Backend runs on `http://localhost:4000` by default.

### Health checks

- Backend root health: `http://localhost:4000/health`
- API health: `http://localhost:4000/api/v1/health`

## API + Proxy notes

During development, the Vite dev server proxies `/api` → `http://localhost:4000`.
If you host the backend elsewhere, set `VITE_API_BASE_URL` (and optionally `VITE_API_BASE_PATH`) in `.env.local` at the repo root.

## Security

- Do not commit `.env.local` (real keys / DB credentials). This repo includes `.env.example` templates instead.
