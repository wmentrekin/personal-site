# personal-site

Astro scaffold for a static personal site with a `/cfb` section.

## Quick start

1. Use Node 20+ (`.nvmrc` is set to `20`).
2. Install dependencies.
3. Run dev server.

```bash
npm install
npm run dev
```

Routes:
- `/` home page
- `/cfb` CFB rankings page using `public/data/cfb/latest-rankings.json`

## Next increments
- Connect `/cfb` to published artifact storage (R2)
- Deploy to Cloudflare Pages (`*.pages.dev` first)
- Add domain + DNS after content is stable
