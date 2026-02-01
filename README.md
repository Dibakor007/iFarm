<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1ZUKFtMjcAcV2Vt-09BG-I2S5sAK4tV_Y

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Backend API

The dashboard now pulls farm metadata directly from the backend, so make sure the API is running before you fire up the Vite server:

1. Switch into the backend directory (`cd ifarm-backend`) and install dependencies (`npm install`).
2. Copy `.env` to `.env.local` and fill in the MySQL credentials described in `ifarm-backend/README.md`.
3. Start the backend (`npm run dev`). It listens on port 4000 by default and exposes `/api/v1/farms` plus `/health`.
4. Back in the frontend workspace, run `npm run dev` again; Vite proxies `/api` → `http://localhost:4000` so the dashboard can query the live data without needing CORS headers.

If you host the backend elsewhere, set `VITE_API_BASE_URL` (and optionally `VITE_API_BASE_PATH`) in `.env.local`, then restart the frontend server so `lib/apiClient.ts` picks up the new base URL.
