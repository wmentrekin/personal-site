# personal-site

Static-first Astro portfolio for Wyatt Entrekin.

## Stack

- `Astro 5`
- `d3-geo` for the rotating travel globe
- static assets under `public/`
- `Node 20+`

## Local development

```bash
source ~/.nvm/nvm.sh
nvm use 20
npm install
npm run dev
```

## Build

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

## Notes

- Homepage tile layout lives in `src/pages/index.astro`.
- The `Now` page is edited directly in `src/pages/now.astro`.
- The travel page is in `src/pages/travel.astro`.
- The rotating globe component is in `src/components/TravelGlobe.astro`.
- Travel country geometry is stored in `public/data/travel/ne_110m_admin_0_countries.geojson`.
