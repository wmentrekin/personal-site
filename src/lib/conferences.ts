/**
 * Display names for the conference values the cfb-rankings artifacts emit.
 *
 * Presentation only, deliberately. The producer's own map (artifacts/rankings.py's
 * CONFERENCE_DISPLAY_NAMES) turns the raw `teams.conference` value into a short token --
 * "Big Ten" becomes "BIG 10", "Conference USA" becomes "CUSA" -- and BOTH artifacts, rankings
 * and schedule, carry that token. Those tokens are the JOIN KEY on this page: the Season Grid
 * stamps them on every row as data-conference, and the filter's <option value> attributes must
 * match them exactly. So they are not renamed at the source and are not renamed in the DOM
 * either -- this maps token to label at the moment of rendering, and nothing else.
 *
 * The token vocabulary is exactly these eleven, and the producer logs and passes through
 * anything unmapped, so a value that reaches here unrecognised is a real (if unlikely)
 * possibility -- a new conference, or a realignment renaming an existing one. Both lookups
 * below return the token unchanged in that case rather than rendering an empty cell: an
 * unpolished "BIG 14" is a far better failure than a blank conference column.
 */

/** Full names, for the Season Grid's conference heading rows. */
export const CONFERENCE_FULL_NAMES: Record<string, string> = {
  ACC: "Atlantic Coast Conference",
  "BIG 12": "Big 12 Conference",
  "BIG 10": "Big Ten Conference",
  SEC: "Southeastern Conference",
  "FBS Independent": "FBS Independents",
  American: "American Conference",
  CUSA: "Conference USA",
  MAC: "Mid-American Conference",
  MWC: "Mountain West Conference",
  "PAC 12": "Pac-12 Conference",
  SBC: "Sun Belt Conference",
};

/**
 * Short names, for the Rankings table's Conference column and the Season Grid's per-team
 * record line -- both are inline, secondary text in a narrow column where a full conference
 * name would dominate the cell it sits in.
 */
export const CONFERENCE_SHORT_NAMES: Record<string, string> = {
  ACC: "ACC",
  "BIG 12": "Big 12",
  "BIG 10": "Big Ten",
  SEC: "SEC",
  "FBS Independent": "Independent",
  American: "American",
  CUSA: "C-USA",
  MAC: "MAC",
  MWC: "Mountain West",
  "PAC 12": "Pac-12",
  SBC: "Sun Belt",
};

/**
 * Labels for the Season Grid's conference filter. Derived from the short names rather than
 * hand-written beside the <option> elements: those labels are a THIRD copy of this
 * vocabulary otherwise, in a file that already imports this module, and renaming a
 * conference here would leave the dropdown silently saying the old thing.
 *
 * The one entry that is not simply the short name is deliberate and specified: the dropdown
 * reads "FBS Independents" where the Rankings column reads "Independent". Spelling it as an
 * explicit override makes that a decision rather than a drift.
 */
export const CONFERENCE_FILTER_LABELS: Record<string, string> = {
  ...CONFERENCE_SHORT_NAMES,
  "FBS Independent": "FBS Independents",
};

// Object.hasOwn, not `MAP[token] ?? token`: these maps are object literals, so they inherit
// Object.prototype, and a token of "constructor" or "toString" would return the inherited
// FUNCTION instead of falling through to the token. Not reachable with any real conference
// name, but the tokens arrive from a fetched artifact, which is exactly the boundary not to
// assume about. The client mirrors in index.astro do the same, so the two stay equivalent.
function lookup(map: Record<string, string>, token: string): string {
  return Object.hasOwn(map, token) ? map[token] : token;
}

export function conferenceFullName(token: string): string {
  return lookup(CONFERENCE_FULL_NAMES, token);
}

export function conferenceShortName(token: string): string {
  return lookup(CONFERENCE_SHORT_NAMES, token);
}

export function conferenceFilterLabel(token: string): string {
  return lookup(CONFERENCE_FILTER_LABELS, token);
}
