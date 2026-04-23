# Streamium

A movie & TV streaming site built with React + Vite. Uses TMDB for catalog data and third-party embed providers for video playback.

## Features

- Browse trending, popular, top-rated, and upcoming movies & TV
- Search across movies, TV, and people
- Movie & TV detail pages with cast, recommendations
- Episode-by-episode TV show player
- 14 streaming server providers (switch on the fly)
- Favorite providers (starred ones float to the front)
- Continue Watching rail (remembers last 20 things you played)
- Watchlist (localStorage)
- Dark cinematic UI

## Local Development

1. Install [Node.js 20+](https://nodejs.org/) and [pnpm](https://pnpm.io/) (or npm/yarn).
2. Copy `.env.example` to `.env` and put your free [TMDB API key](https://www.themoviedb.org/settings/api) in it.
3. Install and run:

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173.

## Deploy to GitHub Pages (free hosting)

### One-time setup

1. **Create a GitHub repo** and push this folder's contents to it.
2. On GitHub: **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `TMDB_API_KEY`
   - Value: your TMDB key
3. **Settings → Pages → Source → GitHub Actions**.

### Deploy

Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and publishes automatically. Your site will be at `https://YOUR_USERNAME.github.io/YOUR_REPO/`.

## Deploy elsewhere

Any static host works. Build with:

```bash
VITE_TMDB_API_KEY=xxx pnpm build
```

Upload the `dist/` folder to:
- **Cloudflare Pages** — connect repo, build command `pnpm build`, output `dist`, env var `VITE_TMDB_API_KEY`
- **Netlify / Vercel** — same idea
- **Any web server** — just serve `dist/` as static files (configure SPA fallback to `index.html`)

## Notes

- Your TMDB key is **embedded into the built JavaScript** because the browser calls TMDB directly. TMDB read-only keys are free and rate-limited per IP, so this is fine — but don't use a sensitive key.
- The embed providers occasionally show popup ads. Install [uBlock Origin](https://ublockorigin.com/) in your browser to block them.
- This project is for personal/educational use. The video providers are third-party services; we don't host any content.
