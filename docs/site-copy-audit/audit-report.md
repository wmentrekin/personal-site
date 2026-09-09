# Site Copy Audit

> Implementation note (September 9, 2026): the objective corrections selected in the approved plan have been applied on `work/site-copy-audit`. This report intentionally retains the broader editorial findings for the follow-up discussion. Findings about the CFB neutral-site legend and ranking-change accessibility were superseded by newer work already merged to `main` and were not changed in this pass.

> Editorial follow-up (September 9, 2026): the user accepted minimal election-archive typo corrections, the formal FCS-loss notation repair, curly apostrophes in current site copy, project-card fragments with sentence-style detail-page introductions, and page-specific descriptions. Education uses “MS Analytics,” the role wording remains unchanged, and Travel remains untouched. The Grizzlies project now refers explicitly to player contracts and future draft picks. Project hero descriptions use the full available card width before wrapping, and prose avoids em dashes.

Scope: all public page routes, shared layout/navigation copy, shared project UI labels, accessibility-facing labels, and rendered 2020 election table headings.

This pass is read-only with respect to site copy. Findings are classified as:

- **Error**: typo, grammar error, rendering defect, accessibility defect, or technical contradiction.
- **Should fix**: materially unclear, awkward, inconsistent, stale, or imprecise wording.
- **Optional polish**: defensible current copy that could be cleaner or more consistent.

## Cross-site findings

### Errors

- The site mixes straight and curly apostrophes. Choose one convention; curly apostrophes are the cleaner publishing default.
- Several icon-only or repeated links lack descriptive accessible names. These are copy defects for screen-reader users even when no text is visibly missing.

### Should fix

- `BaseLayout.astro` gives every page the same default description: “Sports analytics, data engineering, and technical portfolio work by Wyatt Entrekin.” This is vague and poorly fits About, Now, Travel, Resume, and Stats. Use a stronger general fallback or page-specific descriptions.
  - Suggested fallback: “Data engineering, analytics, operations research, and personal projects by Wyatt Entrekin.”
- Generic professional role capitalization varies (`Data Engineer`, `DATA ENGINEER`, and `data engineer`). Use lowercase in prose; uppercase can remain when it is purely decorative display text.
- Hero/card summaries alternate between fragments without terminal punctuation and complete sentences with punctuation. Pick one style and apply it consistently.

## Home (`src/pages/index.astro`)

### Error

- GitHub, LinkedIn, and email links contain only SVGs marked `aria-hidden="true"`; screen readers receive three unnamed links.
  - Suggested labels: “GitHub profile,” “LinkedIn profile,” and “Email Wyatt.”

### Should fix

- “Main Focus” introduces three areas.
  - Suggested: “Focus Areas.”
- “Georgia Tech, BS ISyE '23, Incoming MS Analytics Student” is hard to parse, omits “in,” and conflicts with the About page wording.
  - Suggested: “Georgia Tech, BS ISyE ’23; MS in Analytics, starting Spring 2027.”
  - Decision needed: keep `BS ISyE` shorthand or spell out the degree.

### Optional polish

- “This site is a home for my personal projects, past, present, and future.”
  - Suggested: “This site is a home for my past, present, and future personal projects.”

## About (`src/pages/about.astro`)

### Errors

- “Homewtown” → “Hometown.”
- “Data Engineeering Consultant at CapTech” contains an extra `e`.
  - Suggested if it matches the intended title: “Data Engineering Consultant at CapTech.”
  - Decision needed: elsewhere the page says “Consultant in Data & Analytics at CapTech”; confirm the official/preferred public title.
- The two education values render with no separator: “Georgia Tech, BS ISyE '23Georgia Tech, MS in Analytics - Starting Spring 2027.”
  - Suggested: “Georgia Tech, BS ISyE ’23; MS in Analytics — starting Spring 2027.”

### Should fix

- “Whether that means data pipelines, ranking models, or explaining a messy problem clearly…” mixes nouns and a gerund phrase.
  - Suggested: “Whether that means building data pipelines or ranking models, or explaining a messy problem clearly, I tend to enjoy work that combines technical depth, analytical thinking, creativity, and real-world constraints.”
- “I care less about novelty alone…” is an awkward contrast.
  - Suggested: “I care less about novelty for its own sake and more about building things that are technically sound, clearly reasoned, and genuinely useful or interesting.”
- “playing sports. I also enjoy cooking, traveling, sports…” repeats `sports` in adjacent sentences.
  - Decision needed: remove the second occurrence, or say “following sports” if that distinction is intended.

### Optional polish

- “interactive project presentation” → “presenting projects interactively.”
- “For a more current view of what I’m focused on right now…” is redundant.
  - Suggested: “For what I’m focused on right now, check out my now page.”

## Now (`src/pages/now.astro`, `src/data/now/entries/2026-03-15.ts`)

### Errors

- “So far 2026…” → “So far, 2026…”
- “self growth” → “self-growth.”
- “If you haven't heard from me in awhile” → “If you haven’t heard from me in a while.”

### Should fix

- The page calls itself “a more up-to-date view” but was last updated March 15, 2026. The repo roadmap also marks it stale.
  - Resolution: publish a current entry, or frame entries as dated snapshots rather than a current view.
- “ML Ops” → “MLOps.”
- “my first 10k,” “working towards,” “2 plate bench,” and “a mainly whole foods diet” are inconsistent or awkward.
  - Suggested: “I recently ran my first 10K, and I’m working toward new personal records in my compound lifts—including a two-plate bench press. I’m also focusing on improving my sleep and eating a diet made up mainly of whole foods.”
  - Decision needed: keep “two-plate” gym terminology or translate it to “225-pound” for a general audience.
- “enhancements to my college football rankings to be completed this offseason” is passive, and “in the works as well including” needs punctuation.
  - Suggested: “I’m also working on offseason enhancements to my college football rankings. I have a few other projects in the works as well, including…”
- “I don't have any family here in Atlanta and as each year passes, it feels that my friends become more and more spread out.”
  - Suggested: “I don’t have any family here in Atlanta, and as each year passes, my friends seem to become more spread out.”

## Travel (`src/pages/travel.astro`, `src/components/TravelGlobe.astro`)

### Should fix

- “Click and drag to rotate the globe. Use the scroll wheel to zoom.” is mouse-specific.
  - Suggested: “Drag to rotate the globe. Scroll to zoom.”
  - Note: touch pinch-to-zoom and keyboard zoom do not appear to be implemented, so the copy should not claim them.
- Canvas label “Interactive globe” does not explain its purpose.
  - Suggested: “Interactive globe showing places Wyatt has visited.”
- A canvas label alone does not provide an equivalent text list of highlighted places.
- There is no visible legend for the highlight color.
  - Suggested: “Highlighted places are locations I’ve visited.”
- The data set called `visitedUsStates` includes Puerto Rico, which is a U.S. territory.
  - Use “U.S. locations” or “U.S. states and Puerto Rico” in any public description.

## Resume (`src/pages/resume.astro`)

### Error

- The status label and sentence render to assistive technology as “StatusThis page is still under construction…” because CSS supplies visual space but the text contains no separator.
  - Suggested: “Status: This page is still under construction while I rework it. Check back soon.”

## Stats (`src/pages/stats.astro`)

### Errors

- “stats and streaks -- fitness…” uses double hyphens as finished punctuation.
  - Suggested: “stats and streaks—fitness…” or “stats and streaks — fitness…”
- The status label and sentence render as “StatusThis page is still under construction…”
  - Suggested: “Status: This page is still under construction while I figure out what goes here. Check back soon.”

## Projects hub (`src/pages/projects/index.astro`)

### Should fix

- “college football teams in FBS” is missing `the` and is less natural than the standard term.
  - Suggested: “a convex quadratic program that objectively ranks FBS college football teams based solely on game outcomes.”
- “the lineage of franchise player and draft assets” has a singular/plural mismatch and unclear meaning.
  - Likely suggested wording: “the lineage of franchise-defining players and draft assets.”
  - Decision needed: confirm whether this refers to one player, multiple franchise-defining players, or player assets generally.

### Optional polish

- “using processed historical transaction data” → “using historical transaction data.”
- “speaker-diarization” → “speaker diarization.”
- “Entrekin Quadratic Index - College Football Rankings” → “Entrekin Quadratic Index — College Football Rankings.”

## Agent Skills (`src/pages/projects/agent-skills.astro`)

### Should fix

- “integrates an agentic /work command natively into” is awkward.
  - Suggested: “My custom AI coding framework that provides a native `/work` command across Claude Code, OpenAI Codex, and Google Antigravity.”

### Optional polish

- “proper writeup” → “full write-up.”

## College Basketball Rankings (`src/pages/projects/cbb-rankings.astro`)

- No independent error found.
- Optional consistency item: add terminal punctuation to the hero summary only if all project summaries are standardized as full sentences.

## Memphis Grizzlies Asset Lineage (`src/pages/projects/grizzlies-asset-lineage.astro`)

### Should fix

- “the lineage of franchise player and draft assets” has the same ambiguity as the project-hub card.
  - Likely suggested wording: “the lineage of franchise-defining players and draft assets since the end of the Grit & Grind era.”

### Optional polish

- “using processed historical transaction data” → “using historical transaction data.”

## Chronicle (`src/pages/projects/chronicle.astro`)

### Optional polish

- “speaker-diarization” → “speaker diarization.”
- “proper writeup” → “full write-up.”

## 2020 Election Model (`src/pages/projects/2020-election-model.astro`)

### Errors

- “I hope this peaks your interest.” → “I hope this piques your interest.”
- “Scipy, Numpy” → “SciPy, NumPy.” Standardize `pandas` according to its official lowercase styling as well.
- “webscraping” → “web scraping.”
- “each of these objects, to implement” has an unnecessary comma.
- “The first interesting result … were how” has subject-verb disagreement.
  - Suggested: “One of the first interesting results I noticed was that some states had narrow projected margins even though the favored candidate had a high probability of winning.”
- “more than 80% chance” / “more than 90% chance” need articles: “more than an 80% chance” / “more than a 90% chance.”
- “This reflects in the projected flipped states” uses the wrong idiom.
  - Suggested: “This is also reflected in the projected flipped states.”
- “Trump's chance rely” → “Trump’s chances rely” or “Trump’s chance relies.”
- “repeating as closely his victory in 2016” has incorrect word order.
  - Suggested: “replicating his 2016 victory as closely as possible.”

### Should fix

- “A state-by-state statistical predictive model” is redundant.
  - Suggested: “A state-by-state statistical model for forecasting the 2020 U.S. presidential election.”
- “such as Scipy, Numpy, Pandas, and Matplotlib and to see if…” lacks parallel structure.
  - Suggested: “I wanted to learn more about Python libraries such as SciPy, NumPy, pandas, and Matplotlib, while seeing whether I could build an accurate model.”
- The model-method sentence beginning “The model thus breaks down into these parts” runs roughly 120 words.
  - Suggested: “The model has five main steps: adjust polls for pollster grade and historical bias; aggregate each state’s polls into a single rating, candidate vote-share estimates, and a margin of error; use 2016 results for states without polling; combine current ratings with prior results to construct vote-share distributions; and simulate 10,000 outcomes per state before visualizing the results.”
- “there are 10,000 scenarios that were run” → “The model simulates 10,000 election scenarios.”
- Margins described as “10% of the vote” and “25% of the vote” should be “10 percentage points” and “25 percentage points.”
- “This table below” → “The table below.”
- “from a different party than the one which won in 2016” → “from a different party than the 2016 winner.”
- “Below … Below you can see” repeats immediately.
  - Suggested: “The table shows the model’s results for all 50 states and the District of Columbia, including each candidate’s projected vote share and win probability, plus the projected margin.”
- The Expected Electoral Votes explanation has a number mismatch, lowercase “electoral college,” and does not say that state-level products are summed.
  - Suggested: “The table shows each candidate’s expected electoral-vote total and probability of winning the Electoral College. Expected electoral votes are calculated by multiplying each state’s electoral votes by the candidate’s probability of winning that state, then summing across states. Win probability is the share of simulated elections won by that candidate.”
- The projected-flips sentence repeats `with` and has an unclear `which`.
  - Suggested: “Every projected flip moves from Trump to Biden, and Biden’s projected margin is larger than Trump’s 2016 margin in all but Arizona and North Carolina—the two traditionally more Republican states in this group.”
- “victory chances don't necessarily represent an accurate number” is imprecise.
  - Suggested: “the model’s win probabilities may not be well calibrated.”
- Capitalize “Electoral College” consistently.

### Optional polish

- “3rd-year Industrial Engineering student” → “third-year industrial engineering student.”
- “as the result of a desire” → “out of a desire.”
- Standardize source brands: “U.S. Census Bureau,” “270toWin,” and “FiveThirtyEight.”
- “can be potentially misleading” → “could be misleading.”
- Numeric ranges should use en dashes: `310–340`, `200–230`.

### Editorial decision needed

- The page says it preserves original content, but future-facing lines such as “regardless of how accurate it turns out to be” remain after the election. Choose one approach:
  1. Preserve the article verbatim and strengthen the notice to say the original 2020 text appears unchanged.
  2. Preserve the historical model/output but edit the prose consistently into past tense.

## Rendered 2020 election tables (`public/data/2020-election/tables/*.html`)

### Should fix

- “Trump Projected Vote” / “Biden Projected Vote” → “Trump Projected Vote Share” / “Biden Projected Vote Share.”
- “Trump Chance” / “Biden Chance” → “Trump Win Probability” / “Biden Win Probability.”
- “Trump Projected Chance” / “Biden Projected Chance” → “Trump Win Probability” / “Biden Win Probability.”

## CFB Rankings (`src/pages/projects/cfb-rankings/index.astro`)

### Should fix

- “Optimization-based college football ratings based solely…” repeats `based`.
  - Suggested: “Optimization-based college football ratings derived solely from game outcomes.”
- Table heading “Delta” is unclear to a general visitor.
  - Decision needed: confirm whether it means week-over-week rank movement, rating movement, or something else. If it is rank movement, use “Rank Change” and explain the sign direction.

### Optional polish

- “Switch between Rankings and Season Grid views” → “Switch between rankings and season grid views.”

## CFB Schedule Grid (`src/components/ScheduleGrid.astro`)

### Should fix

- Neutral-site games appear as “vs [opponent]*”, but the asterisk has no key and is not meaningful to assistive technology.
  - Add a visible key: “* Neutral-site game.”
  - Suggested accessible cell text: “{Opponent}, neutral site.”

### Optional polish

- Lowercase status strings (`possible`, `eliminated`, `bowl eligible`, `bowl ineligible`) differ from title-cased interface labels. Either treatment works, but it should be deliberate and consistent across server and client rendering.

## CFB Methodology (`src/pages/projects/cfb-rankings/methodology.astro`)

### Errors and technical contradictions

- “At the core, this model is very simple, it tries…” is a comma splice.
  - Suggested: “At its core, the model is simple: it assigns ratings to teams such that:”
- “It minimizes total ranking inconsistency subject to logical constraints about game results” misdescribes the implementation. Game-result relationships are soft penalties; hard constraints are rating bounds.
  - Suggested: “It minimizes total penalty from inconsistencies with game results, subject to upper and lower rating bounds.”
- “I hope you find this model as interesting and useful as I have building it.” is missing a complement.
  - Suggested: “I hope you find this model as interesting and useful as I have found it rewarding to build.”
- The default prior rating is stated as both `1` and `15`. The model implementation assigns `1`.
  - Suggested implementation-note correction: “New FBS teams receive a default prior rating of \(1\).”
- The definition of \(\mathcal{F}\) is incompatible with the objective’s tuple indices and margin term. The implementation stores FCS-loss records containing a team, margin, and location multiplier.
  - This needs a mathematical notation correction, not a blind wording substitution.

### Should fix

- Heading fragment “objective terms, constraints, parameters, and implementation notes” should begin with a capital letter.
- “constraint optimization approach” → “constrained optimization approach.”
- “Teams that win games have higher ratings … relative to a factor of the margin of victory” is unclear and overstates a soft objective term as a guarantee.
  - Suggested: “The model penalizes ratings that fail to place a winner sufficiently above the loser, with the desired gap based on margin of victory and game location.”
- “until enough games are played to connect enough teams” repeats `enough`.
  - Suggested: “until enough games have been played to connect teams through common opponents.”
- “in their kth matchup” uses an ambiguous pronoun.
  - Suggested: “in the \(k\)th meeting between them.”
- The prior-rating definition is a comma splice and omits articles.
  - Suggested: “\(\text{prior}_i\): team \(i\)’s rating from the previous season’s final rankings. New FBS teams receive a default of \(1\). Prior ratings are produced by running the same model on the previous season’s data.”
- Notation alternates among \(\mathcal{M}\), \(M\), and \(\text{M}_{i,j,k}\). Pick one symbol and use it throughout.
- The parameter is defined as week-dependent \(\lambda(w)\), but the objective uses bare \(\lambda\). Use \(\lambda(w)\) in the objective unless \(\lambda=\lambda(w)\) is defined first.
- “linearly dropping to 0 from Week 1 to Week 7, eventually to rely…” dangles.
  - Suggested: “The \(\lambda\) parameter decreases linearly from Week 1 through Week 7, reaching \(0\) at Week 7; after that, the model relies entirely on current-season results.”
- “The optimization is solved using CVXPY with default convex solvers, returning team ratings sorted…” wrongly implies the solver sorts the output.
  - Suggested: “CVXPY solves the optimization with its default convex solver, after which the application sorts team ratings in descending order.”

### Optional polish

- “Small margin penalty coefficient” should match the lowercase starts of other parameter descriptions.
- “game location advantage” → “game-location effects.”

## Pages with no substantive independent errors

- College Basketball Rankings: only the cross-page hero-punctuation and repository-link consistency choices apply.

## Decisions needed before editing

1. Preferred public CapTech title.
2. `BS ISyE` shorthand versus the full undergraduate degree name.
3. Current facts for a new Now entry.
4. “two-plate bench” versus “225-pound bench press.”
5. Whether the second About-page `sports` means following/watching sports.
6. Whether Grizzlies “franchise player” is singular, plural, or a category of player assets.
7. Whether `Delta` is rank movement, rating movement, or another measure.
8. Whether the election archive preserves original prose verbatim or receives a consistent retrospective edit.
9. Correct mathematical notation for an FCS-loss record in the CFB methodology.
