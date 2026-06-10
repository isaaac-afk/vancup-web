// The 7 World Cup 2026 matches at BC Place, Vancouver.
// Source: BC Place official + FOX Sports / WorldCupVancouver.org
// All times Pacific.

export type VancouverMatch = {
  id: string;
  date: string;              // ISO 8601 with timezone
  stage: string;             // "Group Stage" | "Round of 32" | "Round of 16"
  group?: string;            // group letter for group stage matches
  homeTeam: string;
  homeTeamCode: string;      // 3-letter country code (lowercase for flag CDN)
  awayTeam: string;
  awayTeamCode: string;
  isCanada: boolean;         // highlight Canada matches
};

export const VANCOUVER_MATCHES: VancouverMatch[] = [
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
  },
];

/** Returns the next upcoming Vancouver match (or null if all are past). */
export function getNextVancouverMatch(now: Date = new Date()): VancouverMatch | null {
  const upcoming = VANCOUVER_MATCHES
    .filter(m => new Date(m.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return upcoming[0] ?? null;
}