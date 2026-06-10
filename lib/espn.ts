// Client for ESPN's public soccer scoreboard API (FIFA World Cup).
// No auth, no rate limit (within reason), no signup.
// Endpoint: https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard

const ESPN_WC_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

export type LiveMatch = {
  id: string;
  date: string;
  status: "scheduled" | "live" | "final";
  statusDetail: string;       // "FT", "HT", "45'", "Sat 9:00 PM PT"
  homeTeam: string;
  homeTeamCode: string;
  homeTeamLogo: string | null;
  homeScore: string | null;
  awayTeam: string;
  awayTeamCode: string;
  awayTeamLogo: string | null;
  awayScore: string | null;
  venue: string | null;
  isVancouverVenue: boolean;
};

type EspnCompetitor = {
  team: {
    displayName: string;
    abbreviation: string;
    logo?: string;
  };
  homeAway: "home" | "away";
  score?: string;
};

type EspnEvent = {
  id: string;
  date: string;
  status: {
    type: { state: string; detail: string };
  };
  competitions: Array<{
    competitors: EspnCompetitor[];
    venue?: { fullName?: string; address?: { city?: string } };
  }>;
};

/** Fetch live + upcoming World Cup matches from ESPN. */
export async function fetchLiveMatches(): Promise<LiveMatch[]> {
  try {
    const res = await fetch(ESPN_WC_URL, {
      next: { revalidate: 30 }, // cache 30s — perfect for live data
    });
    if (!res.ok) {
      console.error("ESPN API error:", res.status);
      return [];
    }
    const data = await res.json();
    const events: EspnEvent[] = data.events ?? [];

    return events.map((event): LiveMatch => {
      const comp = event.competitions[0];
      const home = comp.competitors.find(c => c.homeAway === "home");
      const away = comp.competitors.find(c => c.homeAway === "away");
      const venueName = comp.venue?.fullName ?? null;

      const espnState = event.status.type.state;
      const status: LiveMatch["status"] =
        espnState === "in" ? "live" :
        espnState === "post" ? "final" : "scheduled";

      return {
        id: event.id,
        date: event.date,
        status,
        statusDetail: event.status.type.detail,
        homeTeam: home?.team.displayName ?? "TBD",
        homeTeamCode: home?.team.abbreviation?.toLowerCase() ?? "un",
        homeTeamLogo: home?.team.logo ?? null,
        homeScore: home?.score ?? null,
        awayTeam: away?.team.displayName ?? "TBD",
        awayTeamCode: away?.team.abbreviation?.toLowerCase() ?? "un",
        awayTeamLogo: away?.team.logo ?? null,
        awayScore: away?.score ?? null,
        venue: venueName,
        isVancouverVenue:
          venueName?.toLowerCase().includes("bc place") ?? false,
      };
    });
  } catch (err) {
    console.error("Failed to fetch ESPN data:", err);
    return [];
  }
}