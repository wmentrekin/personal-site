# Roadmap to Launch

Reference doc, not a `$work` feature — no `status.yaml`/`requirements.yaml` tracking. Update this file directly as phases complete or plans change.

Last updated: 2026-08-12

## Where things stand

- Design handoff (desktop): **merged** (PR #1). All 7 pages match the locked design.
- CFB Rankings artifact pipeline: **done and live**. Real 2025 data renders on the Rankings page, sourced from R2 at build time, and the weekly cron auto-triggers a rebuild after each publish.
- Mobile: not started. Site is desktop-only right now.
- Domain: not registered. `astro.config.mjs` still has the placeholder `site: "https://example.com"`.

## Phase 1 — Finish the CFB Rankings migration ✅ done (2026-08-12)

1. ✅ Read-only R2 API token created (separate from cfb-rankings' write token).
2. ✅ 4 environment variables added to the personal-site Cloudflare Pages project.
3. ✅ Cloudflare Pages Deploy Hook created.
4. ✅ Deploy hook wired into `cfb-rankings`' `weekly-update.yml` as a final step, URL stored as a GitHub secret (`PERSONAL_SITE_DEPLOY_HOOK_URL`). Verified live: fired the hook manually, got a real build back, and confirmed real 2025 data renders in the table.
5. ✅ End-to-end validation done — real data confirmed populating in the live table (previously only tested against seeded sample data).
6. **Still open, no rush:** decide when to retire the Streamlit app. Still live and working, no longer the source of truth for anything now that this is validated.

**Next on this page specifically:** a separate, scoped Claude design session focused just on the Rankings table's styling (not folded into the mobile work) — same pattern as the desktop redesign: design externally, then bring the handoff back here to implement.

## Phase 2 — Mobile design + implementation

Same pattern as the desktop redesign: a separate Claude design session produces the mobile design, then a build session here implements it.

- Current site is confirmed desktop-first (the repo's own internal notes already flag this as the top open item).
- This should happen **before** the domain goes live publicly — you don't want real visitors hitting a broken mobile layout while you're between design sessions.
- Phase 1 is now done, so no remaining dependency either way.

## Phase 3 — Page freeze

Not an action, a checkpoint: once Phases 1–2 land, the site's structure and design are locked. Remaining changes are manual content edits you make yourself (Now-page entries, project copy, etc.) — small enough not to need a full planning cycle each time, though I'm happy to help with any of them as quick fixes.

## Phase 4 — Resilience & security hardening

Your core worry — bots hammering the Rankings page and blowing up a bill — is actually **already solved by an architecture decision made during the R2 build-out**, worth being explicit about:

> The Rankings page reads R2 **only at build time** (once a week, via the cron), not per-visitor. A bot hitting the live page 10,000 times a second just serves pre-built static HTML/JSON off Cloudflare's CDN — it never touches R2 or any paid API at all. There's no per-request cost surface here the way there would be with a live database or serverless function.

What's still worth doing, roughly in order of value for the effort:

| Action | Cost | Effort | Status |
|---|---|---|---|
| Enable **Bot Fight Mode** | Free | 1 dashboard toggle | **Still on you** — Cloudflare dashboard → your domain/zone → Security → Bots → enable. Domain-wide, no configuration needed on the free tier. (Note: this is a zone-level setting, so it may need the real domain attached first, or may apply to the `pages.dev` subdomain already — check what's available in the dashboard now.) |
| Add a **Rate Limiting rule** on the Rankings page path | Free (1 rule included) | 1 dashboard rule | **Still on you** — Security → WAF → Rate limiting rules → create a rule matching `/projects/cfb-rankings*`, throttle or challenge above a reasonable threshold (e.g. 60 requests/minute per IP). |
| Add security headers via `public/_headers` | Free | Small code change | ✅ Done (2026-08-12) — CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. CSP grounded in the site's actual external resources (Google Fonts + MathJax on the methodology page), not guessed. |
| Add `robots.txt` + a sitemap | Free | Small code change | ✅ Done (2026-08-12) — `@astrojs/sitemap` generates `sitemap-index.xml` at build time. **Follow-up for Phase 5:** once the real domain replaces the `astro.config.mjs` placeholder, the sitemap will automatically start generating correct URLs (no extra work) — but also add a `Sitemap:` line to `robots.txt` at that point, intentionally left out for now since it would've pointed at the placeholder domain. |
| Confirm secrets hygiene | Free | Already done | R2 credentials are already build-time-only env vars, least-privilege scoped (separate read/write tokens) — no action needed. |
| HTTPS/TLS | Free | Already done | Cloudflare Pages provisions this automatically for any domain you attach. |
| Dependency vulnerabilities (`npm audit`) | Free | Needs its own pass | 20 pre-existing findings in Astro/Vite's own build toolchain (dev-time only, none ship to the browser). Confirmed unrelated to any of this session's changes. Being handled as its own scoped `$work` pass rather than an ad hoc fix, given some fixes may involve version bumps worth reviewing deliberately. |

Two dashboard items still need you; everything code-side is done. Not urgent relative to Phases 1–2, but cheap enough that doing it now (rather than waiting for Phase 5) is fine too.

## Phase 5 — Domain + publish

I'll help you pick options when you're ready. A few grounded facts for when we get there:

- **Cloudflare Registrar** is a natural fit given everything else is already on Cloudflare: at-cost pricing (no markup — e.g. a `.com` runs about $10.44/yr, registry fee + the mandatory $0.18 ICANN fee), free WHOIS privacy and DNSSEC included. The catch: it only works if the domain uses Cloudflare's nameservers, which you'd want anyway since Pages/R2/everything else is already there.
- Attaching a domain to the Pages project is a two-step process (add it in the Pages dashboard, then a DNS record) — automatic if the domain's already on Cloudflare DNS, one manual CNAME if it's registered elsewhere.
- Concrete leftover TODO for this phase: `astro.config.mjs` still has `site: "https://example.com"` — needs updating to the real domain once chosen (small, but easy to forget).

## Open sequencing questions

- Timing of the mobile design session — start now, or after the Rankings table design pass?
- Any domain name ideas already in mind, or starting from scratch when we get to Phase 5?

Sources:
- [Get started with Bot Fight Mode](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/)
- [Rate limiting parameters](https://developers.cloudflare.com/waf/rate-limiting-rules/parameters/)
- [Custom domains · Cloudflare Pages docs](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [How much does a domain name cost? · Cloudflare](https://www.cloudflare.com/learning/dns/how-much-does-a-domain-name-cost/)
