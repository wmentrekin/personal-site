# Roadmap to Launch

Reference doc, not a `$work` feature — no `status.yaml`/`requirements.yaml` tracking. Update this file directly as phases complete or plans change.

Last updated: 2026-08-24

## Where things stand

- Design handoff (desktop): **merged** (PR #1). All 7 pages match the locked design.
- CFB Rankings artifact pipeline: **done and live**. Real 2025/2026 data renders on the Rankings page, sourced from R2 at build time, the weekly cron auto-triggers a rebuild after each publish, and it can no longer publish a bogus pre-season "Week 0" artifact.
- Mobile: **merged** (PR #2). Home page mobile fix-up (CFB tile runaway-canvas-height bug, uniform stacked-tile height, resume/stats widget redesign) done via PR #14 — see Phase 2 below. Rankings table mobile layout and the Travel page mobile pass are still open, deferred items (not currently tracked on an open branch).
- Rankings table desktop styling: **merged** (cfb-rankings PR #3, personal-site PR #3), plus two follow-up fixes: week/season selector (#4) and post-switch row styling (#6).
- Content pass (About/Home/Now/project copy): **merged** (#5). Home tile title + project-page spacing fixes: **merged** (#7).
- Home tile reorder + resume org logos + resume timeline uniform slots: **merged** (#8).
- Home page design update (resume "credential seal", stats "signal waveform", CFB mobile fix, uniform tile height): **open** (#14), visually confirmed by user, ready to merge.
- Remaining pre-launch work is 5 open content/build PRs (#9–#13) — see Phase 3 below.
- Domain: not registered. `astro.config.mjs` still has the placeholder `site: "https://example.com"`.

## Launch sequencing

Once every currently-open PR (#9–#14) is merged, the site is content-complete and we move straight to Phase 5: register the domain, attach it to Cloudflare Pages, and launch.

## Phase 1 — Finish the CFB Rankings migration ✅ done (2026-08-12)

1. ✅ Read-only R2 API token created (separate from cfb-rankings' write token).
2. ✅ 4 environment variables added to the personal-site Cloudflare Pages project.
3. ✅ Cloudflare Pages Deploy Hook created.
4. ✅ Deploy hook wired into `cfb-rankings`' `weekly-update.yml` as a final step, URL stored as a GitHub secret (`PERSONAL_SITE_DEPLOY_HOOK_URL`). Verified live: fired the hook manually, got a real build back, and confirmed real 2025 data renders in the table.
5. ✅ End-to-end validation done — real data confirmed populating in the live table (previously only tested against seeded sample data).
6. ✅ Streamlit app deleted and its code/deps cleaned out of cfb-rankings (2026-08-12).
7. ✅ `daily-keep-alive.yml` question resolved (2026-08-13): investigated and confirmed it's unrelated to Supabase or Streamlit — it only makes empty git commits, and its real purpose was preventing GitHub from auto-disabling scheduled workflows after 60 days of repo inactivity (`weekly-update.yml` itself never commits anything, only writes to Postgres/R2). User was informed of that risk and chose to **remove it anyway** (2026-08-14, `ae8851c`) — worth remembering this as an accepted tradeoff, not an oversight, if the weekly cron ever goes silently disabled after a long quiet period.

**Rankings table styling: ✅ done (2026-08-16).** cfb-rankings PR #3 added a `logo` field (dark/32px CFBD logo, resolved by URL substring match, not positional indexing) and standardized `conference` display names (11-value mapping) to the artifact; also fixed a real bug found along the way — the pipeline could publish a "Week 0" artifact before any games were played, now permanently guarded against in `main.py` regardless of how it's invoked. personal-site PR #3 consumed those fields: per-column alignment, team logos rendered next to team names (both on initial load and the season/week switcher), and a row-separation redesign. Desktop-only — the table's **mobile stacked-card layout is still deferred**, see Phase 2's punch list below.

## Phase 2 — Mobile design + implementation ✅ merged (2026-08-14), fix-up pass done pending merge (#14)

Same pattern as the desktop redesign: a separate Claude design session produced the mobile design (`Personal Site Design.zip`), a `$work` large-initiative build session implemented it. See `docs/design-handoff-mobile-2026-08/`.

- PR: [#2](https://github.com/wmentrekin/personal-site/pull/2) — merged, branch deleted. Reviewer + tester subagent passes both completed before merge (1 required fix found and applied: a widget cleanup gap under `prefers-reduced-motion`). All validation at merge time was structural (build output, source inspection) — no browser was available to any agent.
- Shipped: phone-tier (~480px) responsive breakpoints + 44px touch targets across About, Now, Election Model, Methodology, CFB Rankings (hero/panel only), Travel (best-effort, no mockup provided), and the Home grid. 4 new project pages (Agent Skills, Chronicle, CBB Rankings, Grizzlies Asset Lineage) as placeholder "under construction" pages, linked from a resynced Projects hub. 5 new Home-tile live-preview widgets (mini-globe, clock, terminal, typing effect, network-sim), all gated on `prefers-reduced-motion` and wired to this site's View Transitions lifecycle (`astro:page-load`/`astro:before-swap`), not the more common but wrong-for-this-site `DOMContentLoaded`/`pagehide`.
- **Real device pass (2026-08-16) found real breakage.** A second, targeted Claude Design session (`Personal Site Design.zip`) produced fixes, implemented on branch `home-page` (PR #14, 2026-08-24): the CFB tile's runaway-canvas-height bug on mobile/high-DPR, uniform `13rem` height for all stacked link-tiles below the 1140px breakpoint, and a full redesign of the Resume and Stats home-tile widgets (credential-seal / signal-waveform). Visually confirmed by user — ready to merge.
- **Still open, not currently tracked on a branch:**
  - The Rankings table's mobile "stacked card" layout is **still deferred** — was explicitly out of scope for both PR #2 and the Rankings styling work (Phase 1 note above). `RankingsTable.astro` has no responsive breakpoints at all right now.
  - Travel page only ever got a "best-effort" mobile pass with no mockup (PR #2) — worth a real design look at some point.
  - Neither is blocking launch; revisit post-launch as their own quick-fix or bounded-feature work.

## Phase 3 — Content punch list (pre-launch)

Structure and design are locked (Phases 1–2 done). What's left before launch is content for pages that are still under-construction placeholders, each tracked on its own open PR:

| PR | Page | Status |
|---|---|---|
| [#9](https://github.com/wmentrekin/personal-site/pull/9) | Now page entry (2026-08-19) | Scaffold added, needs real content written (Work/Health/Personal Projects/Connections) — last entry is stale (3/15/26). |
| [#10](https://github.com/wmentrekin/personal-site/pull/10) | Agent Skills project page | Needs write-up drafted; may get its own Claude Design pass. |
| [#11](https://github.com/wmentrekin/personal-site/pull/11) | Resume page content | Needs a Claude Design session, then rebuild `resume.astro` from placeholder. |
| [#12](https://github.com/wmentrekin/personal-site/pull/12) | Grizzlies Asset Lineage project page | Blocked on the underlying [nba-asset-lineage](https://github.com/wmentrekin/nba-asset-lineage) data/viz work landing first. |
| [#13](https://github.com/wmentrekin/personal-site/pull/13) | Personal Stats dashboard page | Needs ideation (what to track) + design before building `stats.astro`. |

None of these are close to a quick merge — most need content/ideation/design work done first, not just a review pass. #12 in particular is gated on external repo progress. Once all 5 are merged, move to Phase 5.

## Phase 4 — Resilience & security hardening

Your core worry — bots hammering the Rankings page and blowing up a bill — is actually **already solved by an architecture decision made during the R2 build-out**, worth being explicit about:

> The Rankings page reads R2 **only at build time** (once a week, via the cron), not per-visitor. A bot hitting the live page 10,000 times a second just serves pre-built static HTML/JSON off Cloudflare's CDN — it never touches R2 or any paid API at all. There's no per-request cost surface here the way there would be with a live database or serverless function.

What's still worth doing, roughly in order of value for the effort:

| Action | Cost | Effort | Status |
|---|---|---|---|
| Enable **Bot Fight Mode** | Free | 1 dashboard toggle | **Blocked on Phase 5.** Confirmed (2026-08-13): this is a zone-level setting (dashboard path is `.../:zone/security/settings`) and personal-site has no zone yet — it's pure `*.pages.dev`, no domain attached to the Cloudflare account. There's nothing to toggle until a domain is registered/attached in Phase 5. Do this right after the domain goes live. |
| Add a **Rate Limiting rule** on the Rankings page path | Free (1 rule included) | 1 dashboard rule | **Blocked on Phase 5**, same reason — Rate limiting rules also live under the zone's Security settings. Do this right after the domain goes live: Security → WAF → Rate limiting rules → create a rule matching `/projects/cfb-rankings*`, throttle or challenge above a reasonable threshold (e.g. 60 requests/minute per IP). |
| Add security headers via `public/_headers` | Free | Small code change | ✅ Done (2026-08-12) — CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. CSP grounded in the site's actual external resources (Google Fonts + MathJax on the methodology page), not guessed. |
| Add `robots.txt` + a sitemap | Free | Small code change | ✅ Done (2026-08-12) — `@astrojs/sitemap` generates `sitemap-index.xml` at build time. **Follow-up for Phase 5:** once the real domain replaces the `astro.config.mjs` placeholder, the sitemap will automatically start generating correct URLs (no extra work) — but also add a `Sitemap:` line to `robots.txt` at that point, intentionally left out for now since it would've pointed at the placeholder domain. |
| Confirm secrets hygiene | Free | Already done | R2 credentials are already build-time-only env vars, least-privilege scoped (separate read/write tokens) — no action needed. |
| HTTPS/TLS | Free | Already done | Cloudflare Pages provisions this automatically for any domain you attach. |
| Dependency vulnerabilities (`npm audit`) | Free | Small code change | ✅ Mostly done (2026-08-12) — `npm audit fix` (no `--force`) resolved 17 of 20 findings cleanly, no breaking changes. **3 remaining, deliberately deferred:** `astro`'s bundled finding (7 named CVEs) and `sharp`'s (bundled under astro) only resolve via `astro` 5→7.2.1 — checked every CVE against this repo's actual usage (no server islands, no dynamic slot names, no spread-prop patterns, no `transition:*` directives despite the router being on, no `astro:assets` usage) and **all 7 are structurally inapplicable or dormant — zero real exploitability today.** Deferred rather than forced through anyway because of two real blockers: Astro ≥6 requires **Node ≥22.12** (this repo/dev machine is on Node 20 — the fix would produce an unbuildable site, unrelated to code risk), and `@astrojs/sitemap`'s latest release has no confirmed Astro 7 compatibility (its own devDependency is pinned to Astro 6.3.8, published before Astro 7 existed). Revisit once a Node runtime bump is on the table for its own reasons. |

Everything code-side is done. The two remaining dashboard items (Bot Fight Mode, Rate Limiting rule) can't happen yet — they need a zone, which means they're effectively part of Phase 5, not a standalone Phase 4 loose end.

## Phase 5 — Domain + publish

I'll help you pick options when you're ready. A few grounded facts for when we get there:

- **Cloudflare Registrar** is a natural fit given everything else is already on Cloudflare: at-cost pricing (no markup — e.g. a `.com` runs about $10.44/yr, registry fee + the mandatory $0.18 ICANN fee), free WHOIS privacy and DNSSEC included. The catch: it only works if the domain uses Cloudflare's nameservers, which you'd want anyway since Pages/R2/everything else is already there.
- Attaching a domain to the Pages project is a two-step process (add it in the Pages dashboard, then a DNS record) — automatic if the domain's already on Cloudflare DNS, one manual CNAME if it's registered elsewhere.
- Concrete leftover TODO for this phase: `astro.config.mjs` still has `site: "https://example.com"` — needs updating to the real domain once chosen (small, but easy to forget).
- Once the domain is attached (this is what creates the zone), immediately do the two Phase 4 dashboard items that were blocked until now: enable Bot Fight Mode, add the Rate Limiting rule on `/projects/cfb-rankings*`. Both are quick, free, and this is the first point they become possible.

## Open sequencing questions

- Any domain name ideas already in mind, or starting from scratch when we get to Phase 5?

Sources:
- [Get started with Bot Fight Mode](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/)
- [Rate limiting parameters](https://developers.cloudflare.com/waf/rate-limiting-rules/parameters/)
- [Custom domains · Cloudflare Pages docs](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [How much does a domain name cost? · Cloudflare](https://www.cloudflare.com/learning/dns/how-much-does-a-domain-name-cost/)
