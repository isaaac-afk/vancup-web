import {
  CANADA_MATCHES,
  getNextCanadaMatch,
  type CanadaMatch,
} from "@/lib/vancouver";
import { fetchLiveMatches, type LiveMatch } from "@/lib/espn";
import type { CSSProperties } from "react";
import Logo from "@/app/components/Logo";
import Countdown from "@/app/components/Countdown";
import AtmosphereLayer from "@/app/components/AtmosphereLayer";
import FieldGrid from "@/app/components/FieldGrid";
import FloatingBall from "@/app/components/FloatingBall";
import {
  getMatchBorderGradient,
  getMatchGlow,
} from "@/app/lib/flagColors";

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
        className={`${size} shrink-0 rounded bg-cream/10`}
        aria-hidden="true"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt=""
      className={`${size} shrink-0 rounded object-cover ring-1 ring-cream/10`}
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

// ---------------------------------------------------------------------------
// Match cards
// ---------------------------------------------------------------------------

// Shared card for any ESPN-sourced match (live, final, or scheduled).
function MatchCard({ match }: { match: LiveMatch }) {
  const showScore = match.status !== "scheduled";
  const homeCode = match.homeTeamCode || "un";
  const awayCode = match.awayTeamCode || "un";

  const wrapStyle: CSSProperties = {
    backgroundImage: getMatchBorderGradient(homeCode, awayCode),
  };
  // Keep live fixtures prominent with a sunset glow over the flag border.
  if (match.status === "live") {
    wrapStyle.boxShadow = getMatchGlow("un");
  }

  return (
    <div
      className="relative rounded-xl p-[2px] transition-all duration-200 hover:scale-[1.01]"
      style={wrapStyle}
    >
      <div className="card-surface flex flex-col gap-3 rounded-[10px] p-4 sm:flex-row sm:items-center sm:justify-between">
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
              ? "inline-flex items-center gap-1.5 rounded-full bg-sunset/15 px-2 py-0.5 text-xs font-semibold text-sunset"
              : "text-xs font-medium text-cream/50"
          }
        >
          {match.status === "live" ? (
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sunset" />
          ) : null}
          {statusLabel(match)}
        </span>
        <span className="text-xs text-cream/40">{match.statusDetail}</span>
        {match.isVancouverVenue ? (
          <span className="text-xs font-medium text-golden">BC Place</span>
        ) : null}
      </div>
      </div>
    </div>
  );
}

// Small pill showing the host venue + city, colour-coded per stadium.
function VenuePill({ match }: { match: CanadaMatch }) {
  const tint =
    match.venue === "BC Place"
      ? "bg-golden/20 text-golden"
      : "bg-pitch/20 text-pitch-light";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tint}`}
    >
      {match.venue} · {match.venueCity}
    </span>
  );
}

// Small pill marking a Canada home fixture.
function CanadaPill({ size = "sm" }: { size?: "sm" | "lg" }) {
  const dims =
    size === "lg"
      ? "px-3 py-1 text-sm"
      : "px-2 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-sunset/20 font-medium text-sunset ${dims}`}
    >
      <span aria-hidden="true">🍁</span>
      {size === "lg" ? "Canada home match" : "Canada"}
    </span>
  );
}

// Card for a statically known Canadian fixture. The 2-colour gradient border is
// painted with the two teams' flag colours; Canada home games get a thicker
// border and a soft glow in Canada red.
function CanadaRow({ match }: { match: CanadaMatch }) {
  const subtitle = match.group
    ? `${match.stage} · Group ${match.group}`
    : match.stage;

  const wrapStyle: CSSProperties = {
    backgroundImage: getMatchBorderGradient(match.homeTeamCode, match.awayTeamCode),
  };
  if (match.isCanada) {
    wrapStyle.boxShadow = getMatchGlow(match.homeTeamCode);
  }

  return (
    <div
      className={`relative rounded-xl transition-all duration-200 hover:scale-[1.01] ${
        match.isCanada ? "p-[3px]" : "p-[2px]"
      }`}
      style={wrapStyle}
    >
      <div className="card-surface flex flex-col gap-3 rounded-[10px] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <FlagBadge code={match.homeTeamCode} />
          <span className="font-medium">{match.homeTeam}</span>
        </div>
        <span className="text-sm text-cream/40">vs</span>
        <div className="flex items-center gap-2">
          <FlagBadge code={match.awayTeamCode} />
          <span className="font-medium">{match.awayTeam}</span>
        </div>
        {match.isCanada ? <CanadaPill /> : null}
      </div>

      <div className="flex flex-col gap-1.5 text-sm text-cream/60 sm:items-end sm:text-right">
        <div>{formatPT(match.date)}</div>
        <div className="text-cream/40">{subtitle}</div>
        <VenuePill match={match} />
      </div>
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
    <main className="bg-twilight-grain relative min-h-screen flex-1 text-cream">
      {/* Scroll-linked atmosphere, behind everything (stretches to full height) */}
      <AtmosphereLayer />

      <div className="relative mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
        {/* Hero */}
        <section className="relative">
          {/* Perspective pitch behind the hero content */}
          <FieldGrid className="pointer-events-none absolute inset-0 z-0" />

          {/* Floating soccer-ball accent, upper-right, behind the headline */}
          <FloatingBall className="pointer-events-none absolute -top-2 right-0 z-0 h-24 w-24 opacity-50 sm:right-4 sm:top-2 sm:h-32 sm:w-32" />

          <div className="relative z-10">
          {/* Crest + wordmark, top-left */}
          <div className="flex items-center gap-2.5">
            <Logo className="h-10 w-10" />
            <span className="font-headline text-3xl font-bold tracking-tight">
              VanCup
            </span>
          </div>

          <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-golden">
            <span className="h-2 w-2 animate-pulse rounded-full bg-golden" />
            VanCup · Matches in Canada
          </span>

          <h1 className="font-headline mt-3 text-6xl font-extrabold tracking-tight sm:text-7xl">
            World Cup 2026 — Canada
          </h1>
          <p className="mt-4 max-w-xl text-cream/60">
            Live scores and the 13 matches happening on Canadian soil — 7 at BC
            Place in Vancouver and 6 at Toronto Stadium.
          </p>

          {nextMatch ? (
            <div className="mt-8 rounded-2xl bg-gradient-to-r from-sunset to-golden p-[1.5px] shadow-[0_0_50px_-12px_rgba(255,107,53,0.5)]">
              <div className="rounded-[calc(1rem-1.5px)] bg-surface p-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-golden">
                  {`Next in Canada · ${nextMatch.stage} · ${nextMatch.venueCity}`}
                </div>

                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 text-xl font-semibold">
                    <FlagBadge code={nextMatch.homeTeamCode} />
                    <span>{nextMatch.homeTeam}</span>
                    <span className="text-cream/40">vs</span>
                    <FlagBadge code={nextMatch.awayTeamCode} />
                    <span>{nextMatch.awayTeam}</span>
                  </div>

                  <div className="flex flex-col gap-1.5 text-sm text-cream/60 sm:items-end sm:text-right">
                    <div>{formatPT(nextMatch.date)}</div>
                    <Countdown targetDate={nextMatch.date} />
                    <div className="text-cream/40">
                      {nextMatch.group
                        ? `${nextMatch.stage} · Group ${nextMatch.group}`
                        : nextMatch.stage}
                    </div>
                    <VenuePill match={nextMatch} />
                  </div>
                </div>

                {nextMatch.isCanada ? (
                  <div className="mt-4">
                    <CanadaPill size="lg" />
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-cream/10 bg-surface p-6 text-cream/60">
              All Canadian matches have wrapped up. Thanks for a great
              tournament!
            </div>
          )}
          </div>
        </section>

        {/* Live now */}
        {liveNow.length > 0 ? (
          <section className="mt-12">
            <h2 className="font-headline flex items-center gap-2 text-2xl font-bold">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-sunset" />
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
          <h2 className="font-headline text-2xl font-bold">
            All 13 matches in Canada
          </h2>
          <p className="mt-1 text-sm text-cream/50">
            Vancouver (BC Place): 7 matches · Toronto (Toronto Stadium / BMO
            Field): 6 matches
          </p>
          <p className="mt-1 text-sm text-cream/50">
            Canada matches highlighted in sunset orange.
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
            <h2 className="font-headline text-2xl font-bold">
              Around the tournament
            </h2>
            <p className="mt-1 text-sm text-cream/50">
              Other World Cup fixtures · BC Place matches highlighted in golden.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {aroundTournament.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </section>
        ) : null}

        {/* Footer */}
        <footer className="mt-16 border-t border-golden/20 pt-6">
          <div className="mb-3 flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="font-headline text-lg font-bold tracking-tight">
              VanCup
            </span>
          </div>
          <p className="text-sm text-cream/40">
            Built by Isaac Glenu ·{" "}
            <a
              href="https://github.com/isaaac-afk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-golden hover:text-sunset"
            >
              github.com/isaaac-afk
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
