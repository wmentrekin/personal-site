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

export function conferenceFullName(token: string): string {
  return CONFERENCE_FULL_NAMES[token] ?? token;
}

export function conferenceShortName(token: string): string {
  return CONFERENCE_SHORT_NAMES[token] ?? token;
}
