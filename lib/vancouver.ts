// The 13 World Cup 2026 matches happening on Canadian soil:
//   - 7 at BC Place (Vancouver)
//   - 6 at Toronto Stadium / BMO Field (Toronto)
// Source: BC Place + Toronto host-city schedules.
// Vancouver times are Pacific (UTC-07:00); Toronto times are Eastern (UTC-04:00).

export type CanadaMatch = {
  id: string;
  date: string;              // ISO 8601 with TZ offset
  stage: string;             // "Group Stage" | "Round of 32" | "Round of 16"
  group?: string;            // group letter for group stage matches
  homeTeam: string;
  homeTeamCode: string;      // 2-letter lowercase ISO for flagcdn.com
  awayTeam: string;
  awayTeamCode: string;
  isCanada: boolean;         // highlight Canada matches
  venue: "BC Place" | "Toronto Stadium";
  venueCity: "Vancouver" | "Toronto";
};

export const CANADA_MATCHES: CanadaMatch[] = [
  // --- Vancouver · BC Place -------------------------------------------------
  {
    id: "van-001",
    date: "2026-06-13T21:00:00-07:00",
    stage: "Group Stage",
    group: "E",
    homeTeam: "Australia",
    homeTeamCode: "au",
    awayTeam: "Türkiye",
    awayTeamCode: "tr",
    isCanada: false,
    venue: "BC Place",
    venueCity: "Vancouver",
  },
  {
    id: "van-002",
    date: "2026-06-18T15:00:00-07:00",
    stage: "Group Stage",
    group: "A",
    homeTeam: "Canada",
    homeTeamCode: "ca",
    awayTeam: "Qatar",
    awayTeamCode: "qa",
    isCanada: true,
    venue: "BC Place",
    venueCity: "Vancouver",
  },
  {
    id: "van-003",
    date: "2026-06-21T18:00:00-07:00",
    stage: "Group Stage",
    group: "F",
    homeTeam: "New Zealand",
    homeTeamCode: "nz",
    awayTeam: "Egypt",
    awayTeamCode: "eg",
    isCanada: false,
    venue: "BC Place",
    venueCity: "Vancouver",
  },
  {
    id: "van-004",
    date: "2026-06-24T12:00:00-07:00",
    stage: "Group Stage",
    group: "A",
    homeTeam: "Canada",
    homeTeamCode: "ca",
    awayTeam: "Switzerland",
    awayTeamCode: "ch",
    isCanada: true,
    venue: "BC Place",
    venueCity: "Vancouver",
  },
  {
    id: "van-005",
    date: "2026-06-26T20:00:00-07:00",
    stage: "Group Stage",
    group: "F",
    homeTeam: "New Zealand",
    homeTeamCode: "nz",
    awayTeam: "Belgium",
    awayTeamCode: "be",
    isCanada: false,
    venue: "BC Place",
    venueCity: "Vancouver",
  },
  {
    id: "van-006",
    date: "2026-07-02T20:00:00-07:00",
    stage: "Round of 32",
    homeTeam: "TBD",
    homeTeamCode: "un",
    awayTeam: "TBD",
    awayTeamCode: "un",
    isCanada: false,
    venue: "BC Place",
    venueCity: "Vancouver",
  },
  {
    id: "van-007",
    date: "2026-07-07T13:00:00-07:00",
    stage: "Round of 16",
    homeTeam: "TBD",
    homeTeamCode: "un",
    awayTeam: "TBD",
    awayTeamCode: "un",
    isCanada: false,
    venue: "BC Place",
    venueCity: "Vancouver",
  },

  // --- Toronto · Toronto Stadium (BMO Field) --------------------------------
  {
    id: "tor-001",
    date: "2026-06-12T15:00:00-04:00",
    stage: "Group Stage",
    group: "B",
    homeTeam: "Canada",
    homeTeamCode: "ca",
    awayTeam: "Bosnia & Herzegovina",
    awayTeamCode: "ba",
    isCanada: true,
    venue: "Toronto Stadium",
    venueCity: "Toronto",
  },
  {
    id: "tor-002",
    date: "2026-06-17T19:00:00-04:00",
    stage: "Group Stage",
    group: "L",
    homeTeam: "Ghana",
    homeTeamCode: "gh",
    awayTeam: "Panama",
    awayTeamCode: "pa",
    isCanada: false,
    venue: "Toronto Stadium",
    venueCity: "Toronto",
  },
  {
    id: "tor-003",
    date: "2026-06-20T16:00:00-04:00",
    stage: "Group Stage",
    group: "E",
    homeTeam: "Germany",
    homeTeamCode: "de",
    awayTeam: "Côte d'Ivoire",
    awayTeamCode: "ci",
    isCanada: false,
    venue: "Toronto Stadium",
    venueCity: "Toronto",
  },
  {
    id: "tor-004",
    date: "2026-06-23T19:00:00-04:00",
    stage: "Group Stage",
    group: "L",
    homeTeam: "Panama",
    homeTeamCode: "pa",
    awayTeam: "Croatia",
    awayTeamCode: "hr",
    isCanada: false,
    venue: "Toronto Stadium",
    venueCity: "Toronto",
  },
  {
    id: "tor-005",
    date: "2026-06-26T15:00:00-04:00",
    stage: "Group Stage",
    group: "I",
    homeTeam: "Senegal",
    homeTeamCode: "sn",
    awayTeam: "Iraq",
    awayTeamCode: "iq",
    isCanada: false,
    venue: "Toronto Stadium",
    venueCity: "Toronto",
  },
  {
    id: "tor-006",
    date: "2026-07-02T19:00:00-04:00",
    stage: "Round of 32",
    homeTeam: "TBD",
    homeTeamCode: "un",
    awayTeam: "TBD",
    awayTeamCode: "un",
    isCanada: false,
    venue: "Toronto Stadium",
    venueCity: "Toronto",
  },
];

/** Returns the next upcoming match in Canada (or null if all are past). */
export function getNextCanadaMatch(now: Date = new Date()): CanadaMatch | null {
  const upcoming = CANADA_MATCHES
    .filter(m => new Date(m.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return upcoming[0] ?? null;
}

// --- Backward-compatibility aliases (do not use in new code) ----------------
export const VANCOUVER_MATCHES = CANADA_MATCHES;
export const getNextVancouverMatch = getNextCanadaMatch;
export type VancouverMatch = CanadaMatch;
