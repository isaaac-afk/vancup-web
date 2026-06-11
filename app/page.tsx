import {
  CANADA_MATCHES,
  getNextCanadaMatch,
  type CanadaMatch,
} from "@/lib/vancouver";
import { fetchLiveMatches, type LiveMatch } from "@/lib/espn";

// Revalidate the page every 30s so live scores stay fresh (ISR).
export const revalidate = 30;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPT(iso: string): string {
  return new Date(iso).toLocaleString("en-CA", {
    timeZone: "America/Vancouver",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function FlagBadge({ code, small = false }: { code: string; small?: boolean }) {
  const size = small ? "h-4 w-6" : "h-6 w-9";

  if (!code || code === "un") {
    return (
      <div
        className={`${size} shrink-0 rounded bg-white/10`}
        aria-hidden="true"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt=""
      className={`${size} shrink-0 rounded object-cover ring-1 ring-white/10`}
    />
  );
}

function TeamLogo({
  url,
  code,
  small = false,
}: {
  url: string | null;
  code: string;
  small?: boolean;
}) {
  if (!url) {
    return <FlagBadge code={code} small={small} />;
  }

  const size = small ? "h-5 w-5" : "h-7 w-7";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="" className={`${size} shrink-0 object-contain`} />
  );
}

function statusLabel(match: LiveMatch): string {
  if (match.status === "live") return "LIVE";
  if (match.status === "final") return "FT";
  return formatPT(match.date);
}

function cardBorder(match: LiveMatch): string {
  if (match.status === "live") return "border-red-500/60";
  if (match.isVancouverVenue) return "border-emerald-500/50";
  return "border-white/10";
}

// ---------------------------------------------------------------------------
// Match cards
// ---------------------------------------------------------------------------

// Shared card for any ESPN-sourced match (live, final, or scheduled).
function MatchCard({ match }: { match: LiveMatch }) {
  const showScore = match.status !== "scheduled";

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border ${cardBorder(
        match
      )} bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <TeamLogo url={match.homeTeamLogo} code={match.homeTeamCode} />
          <span className="truncate font-medium">{match.homeTeam}</span>
          {showScore ? (
            <span className="ml-auto text-lg font-semibold tabular-nums">
              {match.homeScore ?? "0"}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <TeamLogo url={match.awayTeamLogo} code={match.awayTeamCode} />
          <span className="truncate font-medium">{match.awayTeam}</span>
          {showScore ? (
            <span className="ml-auto text-lg font-semibold tabular-nums">
              {match.awayScore ?? "0"}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:text-right">
        <span
          className={
            match.status === "live"
              ? "inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-300"
              : "text-xs font-medium text-white/50"
          }
        >
          {match.status === "live" ? (
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
          ) : null}
          {statusLabel(match)}
        </span>
        <span className="text-xs text-white/40">{match.statusDetail}</span>
        {match.isVancouverVenue ? (
          <span className="text-xs font-medium text-emerald-300">BC Place</span>
        ) : null}
      </div>
    </div>
  );
}

// Small pill showing the host venue + city, colour-coded per stadium.
function VenuePill({ match }: { match: CanadaMatch }) {
  const tint =
    match.venue === "BC Place"
      ? "bg-emerald-500/15 text-emerald-300"
      : "bg-blue-500/15 text-blue-300";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tint}`}
    >
      {match.venue} · {match.venueCity}
    </span>
  );
}

// Card for a statically known Canadian fixture.
function CanadaRow({ match }: { match: CanadaMatch }) {
  const border = match.isCanada ? "border-red-500/50" : "border-white/10";
  const subtitle = match.group
    ? `${match.stage} · Group ${match.group}`
    : match.stage;

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border ${border} bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <FlagBadge code={match.homeTeamCode} />
          <span className="font-medium">{match.homeTeam}</span>
        </div>
        <span className="text-sm text-white/40">vs</span>
        <div className="flex items-center gap-2">
          <FlagBadge code={match.awayTeamCode} />
          <span className="font-medium">{match.awayTeam}</span>
        </div>
        {match.isCanada ? (
          <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-medium text-red-300">
            🇨🇦 Canada
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5 text-sm text-white/60 sm:items-end sm:text-right">
        <div>{formatPT(match.date)}</div>
        <div className="text-white/40">{subtitle}</div>
        <VenuePill match={match} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function Home() {
  const nextMatch = getNextCanadaMatch();
  const allLive = await fetchLiveMatches();

  const liveNow = allLive.filter((m) => m.status === "live");
  const aroundTournament = allLive
    .filter((m) => m.status !== "live")
    .slice(0, 8);

  return (
    <main className="min-h-screen flex-1 bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
        {/* Hero */}
        <section>
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-emerald-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            VanCup · Matches in Canada
          </span>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            World Cup 2026 — Canada
          </h1>
          <p className="mt-3 max-w-xl text-white/60">
            Live scores and the 13 matches happening on Canadian soil — 7 at BC
            Place in Vancouver and 6 at Toronto Stadium.
          </p>

          {nextMatch ? (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
                {`Next in Canada · ${nextMatch.stage} · ${nextMatch.venueCity}`}
              </div>

              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 text-xl font-semibold">
                  <FlagBadge code={nextMatch.homeTeamCode} />
                  <span>{nextMatch.homeTeam}</span>
                  <span className="text-white/40">vs</span>
                  <FlagBadge code={nextMatch.awayTeamCode} />
                  <span>{nextMatch.awayTeam}</span>
                </div>

                <div className="flex flex-col gap-2 text-sm text-white/60 sm:items-end sm:text-right">
                  <div>{formatPT(nextMatch.date)}</div>
                  <div className="text-white/40">
                    {nextMatch.group
                      ? `${nextMatch.stage} · Group ${nextMatch.group}`
                      : nextMatch.stage}
                  </div>
                  <VenuePill match={nextMatch} />
                </div>
              </div>

              {nextMatch.isCanada ? (
                <span className="mt-4 inline-flex items-center rounded-full bg-red-500/15 px-3 py-1 text-sm font-medium text-red-300">
                  🇨🇦 Canada home match
                </span>
              ) : null}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/60">
              All Canadian matches have wrapped up. Thanks for a great
              tournament!
            </div>
          )}
        </section>

        {/* Live now */}
        {liveNow.length > 0 ? (
          <section className="mt-12">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
              Live now
            </h2>
            <div className="mt-4 flex flex-col gap-3">
              {liveNow.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </section>
        ) : null}

        {/* All 13 matches in Canada */}
        <section className="mt-12">
          <h2 className="text-lg font-semibold">All 13 matches in Canada</h2>
          <p className="mt-1 text-sm text-white/50">
            Vancouver (BC Place): 7 matches · Toronto (Toronto Stadium / BMO
            Field): 6 matches
          </p>
          <p className="mt-1 text-sm text-white/50">
            Canada matches highlighted in red.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {CANADA_MATCHES.map((m) => (
              <CanadaRow key={m.id} match={m} />
            ))}
          </div>
        </section>

        {/* Around the tournament */}
        {aroundTournament.length > 0 ? (
          <section className="mt-12">
            <h2 className="text-lg font-semibold">Around the tournament</h2>
            <p className="mt-1 text-sm text-white/50">
              Other World Cup fixtures · BC Place matches highlighted in
              emerald.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {aroundTournament.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </section>
        ) : null}

        {/* Footer */}
        <footer className="mt-16 border-t border-white/10 pt-6 text-sm text-white/40">
          Built by Isaac Glenu ·{" "}
          <a
            href="https://github.com/isaaac-afk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300"
          >
            github.com/isaaac-afk
          </a>
        </footer>
      </div>
    </main>
  );
}
