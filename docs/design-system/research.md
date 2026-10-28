# Design system research

Branch: `design-system`. Status: research only, no site code changed yet.

## Why the current design reads as AI-made

From screenshots of `/`, `/about`, `/projects` and the tokens in `src/layouts/BaseLayout.astro`:

| Tell | Where it shows up |
| --- | --- |
| Near-black navy with a faint blueprint grid behind everything | `body` background, `--grid-line` |
| Inter + Inter Tight for everything, with IBM Plex Mono for small uppercase labels | `--font-body`, `--font-display`, 42 `font-mono` uses |
| Small, letter-spaced, all-caps mono "eyebrow" labels above every block (`WELCOME`, `BACKGROUND`, `MAIN FOCUS`) | `index`, `about`, `SectionBlock` |
| Everything sits in a rounded glass card (24px radius, inner highlight, drop shadow), including plain prose | `.card`, `.glass-card`, used on 18 files |
| Tailwind-default accent colours (`sky-300 #7dd3fc`, `lime-400`, `orange-400`, `yellow-400`) | `--accent-*` |
| A bento grid of tiles on the homepage, each with a small decorative widget (clock, waveform, terminal, network) | `index.astro` |
| Pill badges (`ACTIVE`, `IN PROGRESS`) and 999px-radius everything | 26 `border-radius: 999px` |
| Fade-and-rise animation on every block as it scrolls into view | `.reveal` |

None of these is wrong on its own. Together they make up the default look that coding agents fall back on, so the site doesn't look like it belongs to anyone in particular. The content is distinctive (convex-optimization CFB rankings, Grizzlies asset lineage, family-history tooling, Memphis to Atlanta, ISyE), but the design doesn't show any of that.

## The main projects

### 1. Anthropic `frontend-design` skill (official)
- Repo: `anthropics/skills` (`skills/frontend-design/SKILL.md`), also packaged as a Claude Code plugin.
- **How it works:** a single prompt-level skill. It loads when Claude does front-end work and changes *how Claude thinks*:
  - Ground the design in the subject's own world and materials.
  - Make typography the main design element (one or two distinct faces, a deliberate scale).
  - Avoid known tells: eyebrow labels, all-caps labels, accenting one word in a headline, generic palettes.
  - Use borders and labels only where they carry meaning.
  - Use one orchestrated motion moment instead of scattered entrance animations.
  - Draft a 4–6 colour token system, critique it for defaults, then build.
- **Strength:** light, official, and good defaults.
- **Weakness:** it holds no memory of *your* brand, so without a written brief the output is still generic.

### 2. Impeccable (`pbakaus/impeccable`, Apache-2.0, ~92k stars)
- **Install:** `npx impeccable install`, then `/impeccable init`.
- **How it works:** a skill plus a CLI with three layers.
  1. **Context files:**
     - `PRODUCT.md`: audience, purpose, voice. Written by `init`.
     - `DESIGN.md`: the design system. Written by `document`/`extract` from existing code.
     - `.impeccable/`: config, per-surface notes and critiques.
  2. **24 commands:**
     - Planning: `shape`, `craft`
     - Review: `critique`, `audit`, `polish`
     - Intensity dials: `bolder`, `quieter`, `distill`
     - Focused passes: `typeset`, `layout`, `colorize`, `animate`, …
     - Live iteration: `live`
  3. **Deterministic detector:** `npx impeccable detect`, 62 rules for "AI slop" and quality issues (purple gradients, bounce easing, side-tab borders, small touch targets, skipped headings). It can run as a Claude Code post-edit hook or a GitHub Action.
- **Strength:** the most complete workflow. It covers brief, system, critique and enforcement, and fits a redesign of an existing site well.
- **Note:** it sends anonymous telemetry by default. Turn it off with `npx impeccable telemetry off` or `DO_NOT_TRACK=1`.

### 3. Taste Skill (`Leonxlnx/taste-skill`, MIT, ~104k stars)
- **How it works:**
  - A script deals 3 of 20 researched art directions, and the agent picks one and ties it to the client's material.
  - It builds the page with credited open-collection photos.
  - It screenshots the result at 3 widths in a real browser and runs up to 3 fix rounds.
  - It includes a redesign-existing-project workflow and an `--app` mode for dashboards.
- **Strength:** forces a real art direction, and the visual self-check loop is excellent.
- **Weakness:**
  - It is tuned for marketing-style pages built around imagery.
  - Runs are slow (30–45 min per build).
  - It needs Node 22+ (this repo pins 20).

### 4. UI UX Pro Max (`nextlevelbuilder/ui-ux-pro-max-skill`, MIT, ~142k stars)
- **How it works:**
  - A local CSV knowledge base: 50 styles, 192 palettes, 74 font pairings, UX guidelines.
  - A BM25 search script plus a generator that turns "industry + product" into a recommended style, palette, type and checklist.
  - The output is saved to `design-system/`.
- **Strength:** quick, concrete starting tokens.
- **Weakness:** it picks from a catalogue by industry, which pulls toward the average. That is the opposite of what a personal site needs.

### 5. awesome-design-md (`VoltAgent/awesome-design-md`, MIT, ~124k stars)
- **What it is:** about 84 `DESIGN.md` files reverse-engineered from real sites (Claude, Notion, WIRED, Linear, Oura, Resend, …) in Google Stitch's DESIGN.md format.
- **Sections in each file:**
  - Atmosphere
  - Colour roles
  - Typography
  - Components
  - Layout
  - Elevation
  - Do's and don'ts
  - Responsive behaviour
  - Agent prompt guide
- **Extras:** each file has `preview.html` and `preview-dark.html` catalogues.
- **Use here:** as *reference and format*, not to copy someone's brand. It is useful for showing what a good DESIGN.md looks like.

## What they share

Every one of these works the same way underneath:
1. **Write down the brief and the system in plain Markdown** (`PRODUCT.md` + `DESIGN.md`), so every session starts from the same taste instead of the model's defaults.
2. **Steer away from known defaults** with explicit lists of tells.
3. **Check the output visually** with screenshots, a critique pass and a lint-style detector, instead of trusting the code.

## How this would fit this repo

- **Recommended stack:**
  - **Impeccable** for the workflow (`PRODUCT.md`, `DESIGN.md`, `critique`/`audit`, detector hook).
  - The **Anthropic frontend-design** skill as the baseline taste layer.
  - Optionally borrow Taste Skill's three-width screenshot loop. Playwright is already available in cloud sessions.
- **Commit skills into the repo** (`.claude/skills/…`) rather than installing them as user-level plugins, so cloud sessions pick them up too.
- **Point the existing workflow at the design files:** add a pointer to `DESIGN.md` from the root instructions and from the `.agents` `/work` workflow, so design changes go through it.
- **Move tokens out of `BaseLayout.astro`** into a single `src/styles/tokens.css`. Today many pages carry their own scoped styles that re-declare colours and radii. Consolidating them is what makes a new system apply site-wide.
- **Keep the data surfaces working:** `RankingsTable`, `ScheduleGrid`, `TravelGlobe` and the charts carry the most logic. Re-skin them through tokens, not rewrites.

## Proposed process

1. **Brief:** write `PRODUCT.md`.
   - Who is this for? Recruiters, MS Analytics peers, sports-analytics readers, friends.
   - What should a visitor feel and do?
   - What is the voice?
2. **Directions:** prototype 2–3 distinct homepage directions as throwaway routes (for example `/lab/a`), screenshot them, pick one.
3. **System:** write `DESIGN.md` covering:
   - Tokens
   - Type scale
   - Layout grid
   - Components: link, list row, table, figure, tag
   - Motion rules
   - Explicit do's and don'ts
4. **Foundation:** create the token file, rebuild `BaseLayout`, then migrate the shared components.
5. **Pages:** home, then about/now, then projects, then the CFB data pages. Run critique, audit and the detector after each.

## Seed directions to react to (not decisions)

- **Almanac / box score:**
  - Light newsprint, serif headlines, tabular numerals.
  - Dense ruled tables in the style of Sports-Reference or old FiveThirtyEight.
  - Fits the rankings and stats work.
- **Engineering report / lab notebook:**
  - Paper background, numbered figures with captions, margin notes.
  - Restrained ink colours, a nod to ISyE and operations research.
  - Methodology pages would shine.
- **Typographic index:**
  - No cards at all. A homepage that is a well-set list of projects, writing and pages, with dates and status as plain text.
  - One bold typeface does the work, and colour is used only for data.
