# CANCup 🇨🇦

A Canada-focused dashboard for **FIFA World Cup 2026** — live scores from across the tournament plus the full schedule for all **13 matches on Canadian soil**: 7 at BC Place in Vancouver and 6 at Toronto Stadium (BMO Field), including all three of Canada's group-stage home games.

**Live URL:** [vancup-web.vercel.app](https://vancup-web.vercel.app)

## What it does

- Surfaces the **next upcoming match in Canada** with venue, city, and kickoff time.
- Lists **all 13 Canadian matches** — colour-coded by host stadium (BC Place / Toronto Stadium) with Canada games highlighted.
- Shows a **Live now** section and a tournament-wide feed driven by the ESPN scoreboard API.

---

## Screenshots

> _Coming soon — drop screenshots in `/public` and link them here._
>
> | Home / next match | Live scores |
> | ----------------- | ----------- |
> | _placeholder_     | _placeholder_ |

---

## Tech stack

- **Next.js 16** (App Router, React Server Components)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **ESPN public soccer API** for live + tournament-wide scores
- **Vercel** for hosting (ISR / `revalidate: 30`)

No backend, no database, no API keys in v1 — the homepage is a Server Component that fetches scores directly from ESPN and caches them with Incremental Static Regeneration.

---

## Run locally

```bash
git clone https://github.com/isaaac-afk/vancup-web.git
cd vancup-web
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

---

## Architecture

### v1 — frontend-only (this repo)

```
Browser ──▶ Next.js Server Component ──▶ ESPN scoreboard API
                     │
                     └─ cached with ISR (revalidate: 30s)
```

- `lib/vancouver.ts` — the 13 statically known Canadian fixtures (`CANADA_MATCHES`) + `getNextCanadaMatch()`.
- `lib/espn.ts` — typed client for ESPN's `soccer/fifa.world/scoreboard` endpoint; maps their `events[]` shape to a clean `LiveMatch` type and degrades gracefully (returns `[]`) on failure.
- `app/page.tsx` — Server Component homepage: next match in Canada, a "Live now" section, all 13 Canadian fixtures, and a tournament-wide feed.

Why this shape? The World Cup starts **June 11, 2026**, so v1 prioritizes shipping a fast, reliable, read-only dashboard today with zero infra to manage.

### v2 — planned

- **FastAPI** backend to normalize and persist match data.
- **Supabase** (Postgres) for fixtures, results, and historical data.
- An **Elo-based predictor** for match outcome probabilities.
- Tests, and a proper data pipeline instead of hitting ESPN at request time.

---

## Credit

Built by **Isaac Glenu** — [github.com/isaaac-afk](https://github.com/isaaac-afk)
