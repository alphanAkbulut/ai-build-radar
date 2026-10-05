# AI Build Radar

**Language:** English · [Türkçe](README.md)

**Status:** private, local MVP. Radar discovers working products in the AI ecosystem, shows what is actually known about them, and turns a small reviewed subset into practical lessons. A product that *uses AI*, a product *built with AI*, and a product *drawing attention* are three separate claims with separate evidence.

The product has two distinct surfaces: a timely, sourced **discovery/news feed** and a smaller **learning collection** whose demos and learning steps have been reviewed. Being found by a source or collecting stars never automatically qualifies a project as a lesson.

## Documentation

- [Architecture memory](docs/ARCHITECTURE.en.md) ([Türkçe](docs/ARCHITECTURE.md)) is the primary explanation of data flow, evidence, decisions, every page, listing rules, operational behavior, ownership, and known limits.
- Topic documents: [data and evidence](docs/MODEL.md), [source coverage](docs/PROJECT-CONTEXT.md), [evaluation](docs/EVALUATION.md), [selection](docs/SELECTION.md), [people and ideas](docs/PEOPLE.md), [summaries](docs/SUMMARIES.md), [analytics](docs/ANALYTICS.md), and [mobile](docs/MOBILE.md). These topic documents are currently in Turkish; dated pilots and checks are not live status reports.
- [Source audit for the daily AI product prompt](docs/SOURCE-EXPANSION.en.md) ([Türkçe](docs/SOURCE-EXPANSION.md)) records verified candidate sources, access/licensing constraints, and integration order. `/briefing` offers a short read derived from existing data.
- [TrendRadar comparison](docs/TRENDRADAR-BENCHMARK.en.md) ([Türkçe](docs/TRENDRADAR-BENCHMARK.md)) records runtime evidence, aggregator dependencies, and the ranking/source-visibility ideas adapted for Radar.
- [AGENTS.md](AGENTS.md) defines agent working rules, not the product architecture.

## Current boundaries

| Area | Current implementation |
| --- | --- |
| Sources | 25 registered rows; 14 enabled independent discovery sources plus 2 enabled enrichment jobs. Enabled does not mean successfully scanned: read `/sources`. The public target is 25 **working independent discovery sources**. |
| Discovery | Candidates from GitHub, Hacker News, One’s Vibe, Hugging Face Spaces, DEV Community, Lobsters, and eight author publications. This is not a crawl of the whole web. |
| Learning selection | Requires a sourced purpose, recently tested interaction, real preview, concrete differentiator, and application steps. The gate does not automatically judge “wow” quality. |
| Access | Private local password and session. A Supabase schema exists, but no connected hosted project or public deployment. |
| AI summaries | No external AI API is connected. Missing-language summaries are not presented as generated translations. |

## Run locally

On macOS, `Start-Radar.command` opens the interface at `http://127.0.0.1:3101`. `Start-Radar-Mobile.command` opens a separate private LAN session for a phone on the same Wi-Fi; the Mac must remain on. `.env.example` lists required settings. Keep the password and session secret in local `.env.local`, outside Git. The existing password is in the computer’s `LOCAL-ACCESS.txt` file. A local sign-in is remembered in that browser for 180 days; signing out or clearing browser cookies ends the session.

With Node.js and pnpm:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm typecheck
pnpm build
```

`pnpm ingest` processes currently due enabled sources once. `pnpm worker` checks for due sources about every 30 seconds. The local v2 setup may use `RADAR_DATA_DIR` to share v1 data: **never start two workers on the same directory.** The launcher does not start another worker. Scanning stops when the computer sleeps or the worker stops. Last attempt, last success, additions, and errors are visible on `/sources`.

## Directory map

| Path | Responsibility |
| --- | --- |
| `app/`, `components/` | Private Next.js pages and interactions |
| `lib/`, `scripts/` | Sources, collection, identity, evidence, evaluation, and worker |
| `content/` | Curated lessons, reviews, people, and references |
| `previews/`, `public/spotlights/` | Real demo captures and related records |
| `data/` or `RADAR_DATA_DIR` | Live local ingestion data, excluded from Git |
| `learning-data/` | People feed cache and local analytics |
| `supabase/` | Hosted schema and access-policy preparation |
| `docs/` | Product and system decisions |

`snapshots/ingestion-initial.json` is a fixed initial snapshot, not a live backup. Keep the repository private. Third-party projects and content retain their own rights.
