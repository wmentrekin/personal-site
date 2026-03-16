# personal-site

Static-first Astro portfolio for Wyatt Entrekin. The site is optimized for project pages, methodology writeups,
lightweight dashboards, and a few client-side interactive elements where they add value.

## Stack

- `Astro 5`
- static output deployed to `Cloudflare Pages`
- `Node 20+`
- client-side globe visualization on `/travel` via `globe.gl`

## Quick start

```bash
source ~/.nvm/nvm.sh
nvm use 20
npm install
npm run dev
```

Build for production:

```bash
source ~/.nvm/nvm.sh
nvm use 20
npm run build
```

## Current routes

- `/`
- `/about`
- `/now`
- `/travel`
- `/projects`
- `/projects/cfb-rankings`
- `/projects/cfb-rankings/methodology`
- `/projects/2020-election-model`

## Content notes

- Homepage tile layout lives in `src/pages/index.astro`.
- The `Now` page is a simple editable log in `src/pages/now.astro`.
- Travel page data lives in `src/pages/travel.astro`.
- The interactive globe renderer lives in `src/components/TravelGlobe.astro`.
- Static images and artifacts should generally live under `public/`.

## Deployment notes

- Local builds require `Node 20`. Using an older Node version will fail.
- `npm run dev` may be blocked in restricted sandboxes even when the project is healthy.
- Production is intended to stay resilient even if live data sources are unavailable; project pages should prefer
  static artifacts where practical.

## Next increments

- refine homepage copy and replace remaining placeholder tiles
- move the travel page from seed data to a fuller travel history
- source CFB outputs from object storage
- keep page-specific content concise while preserving technical depth where it belongs
