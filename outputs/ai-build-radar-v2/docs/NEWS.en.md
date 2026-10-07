# News lane · operating contract

**Status:** local private MVP behavior as of 6 October 2026. [Türkçe](NEWS.md) · [Architecture memory](ARCHITECTURE.en.md) · [Source catalog](GLOBAL-SOURCE-CATALOG.en.md). This separates the implemented behavior from future targets; `/sources` and `/news` are authoritative for live run health and counts.

## Why a separate page?

`/news` shows **publisher articles** about AI. `/?view=feed` shows **products** with sourced attention or discovery signals that also passed a tested-demo publication gate. `/briefing` gives a short dated slice of both and lists articles separately. An article does not prove that a product was AI-developed, is drawing attention, works, or is recommended. This keeps research and model announcements out of **Try** cards.

## Source and processing sequence

1. Ten enabled RSS feeds are listed in [`content/news-feeds.json`](../content/news-feeds.json), each on a **180-minute** interval in [`lib/sources.ts`](../lib/sources.ts). They do not count toward the target of 25 *working independent product-discovery sources*. `pnpm worker` checks due work only while the machine and worker run; the schedule does not guarantee a new article every three hours.
2. [`scripts/news_feed.py`](../scripts/news_feed.py) reads the latest **20 RSS/Atom entries** per feed. Entries require an HTTPS URL and valid publication time. Future-dated and older-than-seven-day items are filtered; broad feeds use an AI-related title gate. That gate can miss relevant articles.
3. [`lib/news-collector.ts`](../lib/news-collector.ts) deduplicates by canonical article URL and keeps the actual `publishedAt` distinct from Radar's `firstSeenAt` and `lastSeenAt`. Rechecks never turn an old publication into a new event. An empty RSS description does not erase a previously valid one.
4. Cards show publisher headline, publication time, available author, and a **publisher-sourced description of at most 420 characters**. When description or author is missing, the newest **12** eligible articles per feed can receive a bounded metadata read from the registered publisher's host. Full articles are not stored. Description provenance is `rss` or `article-meta`; failed reads never fabricate an excerpt.
5. Up to **12 explicit outbound links in RSS content** are stored. A canonical exact match with an existing Build URL or alias links to that record. Unmatched GitHub repositories and Hugging Face Spaces appear only as **pending-review links**. No RSS link does not imply no project in the full article; full-text project extraction is not implemented.

## Visitor-facing states

`/news` defaults to the past **48 hours**, offers a **seven-day** window, orders by **publication time**, and paginates by **12 items**. Descriptions stay in the publisher's language; they are neither Radar-authored AI summaries nor Turkish translations. Missing reliable descriptions are labeled. The headline opens the original article. Exact matches to existing Radar records, unreviewed project links, and other outbound links have distinct labels.

The page shows the news scan schedule, enabled news-feed count, and **latest successful news-source check**. That timestamp may describe only one feed, not all ten. `/sources` exposes per-source last attempt/success, `completed`/`partial`/`failed` status, and fetched/filtered/accepted counts. An empty list does not mean the world produced no AI news: the time window, source coverage, filters, failures, stopped worker, or stale worker registry may explain it. Adding a source or adapter requires a controlled restart that preserves the single-worker/lock rule.

## Data and publication boundaries

`NewsEvent` is separate from Build Entity and Evidence Object in [`lib/schema.ts`](../lib/schema.ts) and lives in the optional `newsEvents` field of the local JSON store. No hosted Supabase news table or sync exists. An article link never creates a Build, assigns an AI-development badge, or passes the build feed/learning demo gate. `/briefing` lists news headlines compactly; descriptions and authors belong to `/news`.

**Open work:** reliable extraction of project links absent from RSS but present in full articles; original short summaries in multiple languages; publisher-by-publisher reuse rights; measured coverage and false positives/negatives; hosted scheduling and lag alerts. These are tracked by [R09](ROADMAP.en.md), [R12](ROADMAP.en.md), [R15](ROADMAP.en.md), [R16](ROADMAP.en.md), and [NEWS-01 / OPS-01](RISK-REGISTER.en.md). The current UI must not imply they are complete.
