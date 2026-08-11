# Roadmap to Launch

Reference doc, not a `$work` feature — no `status.yaml`/`requirements.yaml` tracking. Update this file directly as phases complete or plans change.

Last updated: 2026-08-11

## Where things stand

- Design handoff (desktop): **merged** (PR #1). All 7 pages match the locked design.
- CFB Rankings artifact pipeline: **built, not yet connected**. `cfb-rankings` publishes to R2; `personal-site` has the fetch script and consuming page ready, but no real credentials wired up yet.
- Mobile: not started. Site is desktop-only right now.
- Domain: not registered. `astro.config.mjs` still has the placeholder `site: "https://example.com"`.

## Phase 1 — Finish the CFB Rankings migration

Code is done. What's left is dashboard setup on your end, plus one small cross-repo follow-up.

1. **Create a read-only R2 API token.** Cloudflare dashboard → R2 Object Storage → Overview → Account Details → Manage API Tokens → new **Account API token**, scoped to **Object Read only** on the `cfb-rankings` bucket specifically. This must be a *separate* token from the write-scoped one `cfb-rankings` already uses — least privilege, and it means a bug in the read path can never corrupt or delete real data.
2. **Add 4 environment variables to the personal-site Cloudflare Pages project**: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID_READONLY`, `R2_SECRET_ACCESS_KEY_READONLY`, `R2_BUCKET_NAME`. These are build-time-only (never shipped to the browser) — the fetch script reads them before `astro build` runs.
3. **Create a Cloudflare Pages Deploy Hook** for personal-site (Pages project → Settings → Builds → Add deploy hook). This gives you a URL that triggers a rebuild on a plain POST.
4. **Small code follow-up (I can do this):** add one step to `cfb-rankings`' `weekly-update.yml` — a `curl -X POST` to that deploy hook URL, stored as a new GitHub secret in the `cfb-rankings` repo. Without this, the hook exists but nothing calls it, and the Rankings page only refreshes whenever personal-site happens to redeploy for an unrelated reason.
5. Once real data is flowing, do one real validation pass (the current code was only tested against manually-seeded sample data matching the schema, never a live fetch).
6. Decide when to actually retire the Streamlit app — no rush, it's still live and working, but it's no longer the source of truth for anything once this is validated.

## Phase 2 — Mobile design + implementation

Same pattern as the desktop redesign: a separate Claude design session produces the mobile design, then a build session here implements it.

- Current site is confirmed desktop-first (the repo's own internal notes already flag this as the top open item).
- This should happen **before** the domain goes live publicly — you don't want real visitors hitting a broken mobile layout while you're between design sessions.
- No dependency on Phase 1 — can happen in parallel or before, your call.

## Phase 3 — Page freeze

Not an action, a checkpoint: once Phases 1–2 land, the site's structure and design are locked. Remaining changes are manual content edits you make yourself (Now-page entries, project copy, etc.) — small enough not to need a full planning cycle each time, though I'm happy to help with any of them as quick fixes.

## Phase 4 — Resilience & security hardening

Your core worry — bots hammering the Rankings page and blowing up a bill — is actually **already solved by an architecture decision made during the R2 build-out**, worth being explicit about:

> The Rankings page reads R2 **only at build time** (once a week, via the cron), not per-visitor. A bot hitting the live page 10,000 times a second just serves pre-built static HTML/JSON off Cloudflare's CDN — it never touches R2 or any paid API at all. There's no per-request cost surface here the way there would be with a live database or serverless function.

What's still worth doing, roughly in order of value for the effort:

| Action | Cost | Effort | Notes |
|---|---|---|---|
| Enable **Bot Fight Mode** | Free | 1 dashboard toggle | Domain-wide, challenges traffic matching known-bot patterns automatically. No configuration needed on the free tier. |
| Add a **Rate Limiting rule** on the Rankings page path | Free (1 rule included) | 1 dashboard rule | Free plan includes exactly 1 custom rate-limiting rule (IP-based, fixed window) — enough to throttle/challenge any single path getting hammered. |
| Add security headers via a `public/_headers` file | Free | Small code change | Cloudflare Pages reads this file natively. Adds things like `Content-Security-Policy`, `X-Frame-Options`, `Referrer-Policy`. Not present in the repo today. |
| Add `robots.txt` + a sitemap | Free | Small code change | Neither exists yet. Low urgency but standard practice before public launch and SEO-relevant. |
| Confirm secrets hygiene | Free | Already done | R2 credentials are already build-time-only env vars, least-privilege scoped (separate read/write tokens) — no action needed, just confirming the pattern holds as more secrets get added later. |
| HTTPS/TLS | Free | Already done | Cloudflare Pages provisions this automatically for any domain you attach. |

None of this is urgent relative to Phases 1–2 — it's real but low-risk given the architecture, and cheap to do in a single short session whenever you're ready. I'd suggest doing it right before Phase 5, not before.

## Phase 5 — Domain + publish

I'll help you pick options when you're ready. A few grounded facts for when we get there:

- **Cloudflare Registrar** is a natural fit given everything else is already on Cloudflare: at-cost pricing (no markup — e.g. a `.com` runs about $10.44/yr, registry fee + the mandatory $0.18 ICANN fee), free WHOIS privacy and DNSSEC included. The catch: it only works if the domain uses Cloudflare's nameservers, which you'd want anyway since Pages/R2/everything else is already there.
- Attaching a domain to the Pages project is a two-step process (add it in the Pages dashboard, then a DNS record) — automatic if the domain's already on Cloudflare DNS, one manual CNAME if it's registered elsewhere.
- Concrete leftover TODO for this phase: `astro.config.mjs` still has `site: "https://example.com"` — needs updating to the real domain once chosen (small, but easy to forget).

## Open sequencing questions

- Timing of the mobile design session — start now, or after Phase 1's R2 connection is fully validated?
- Any domain name ideas already in mind, or starting from scratch when we get to Phase 5?

Sources:
- [Get started with Bot Fight Mode](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/)
- [Rate limiting parameters](https://developers.cloudflare.com/waf/rate-limiting-rules/parameters/)
- [Custom domains · Cloudflare Pages docs](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [How much does a domain name cost? · Cloudflare](https://www.cloudflare.com/learning/dns/how-much-does-a-domain-name-cost/)
