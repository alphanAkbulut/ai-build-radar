# TrendRadar review and ideas adapted for Radar

**Reviewed:** 5 October 2026. **Reference:** [SANSAN0/TrendRadar](https://github.com/SANSAN0/TrendRadar), inspected `master` commit `792bcc3`. [Türkçe](TRENDRADAR-BENCHMARK.md).

## What TrendRadar does

TrendRadar monitors general news and hot topics. It reads platform hot lists through the [NewsNow](https://github.com/newsnext/newsnow) API and also ingests RSS, Atom, and JSON feeds. Its default configuration includes Chinese platforms such as Toutiao, Baidu, Bilibili, Weibo, and Zhihu. It stores repeated appearances and ranking positions, filters by keywords or an **optional** model API, and generates reports, notifications, and MCP tools. It offers local SQLite and optional remote storage, a sample hourly GitHub Actions workflow, and Docker deployment. See the [fetcher](https://github.com/SANSAN0/TrendRadar/blob/master/trendradar/crawler/fetcher.py), [configuration](https://github.com/SANSAN0/TrendRadar/blob/master/config/config.en.yaml), [AI filter pipeline](https://github.com/SANSAN0/TrendRadar/blob/master/trendradar/ai/filter_pipeline.py), and [workflow](https://github.com/SANSAN0/TrendRadar/blob/master/.github/workflows/crawler.yml).

Its “AI” primarily **filters and interprets news**. It does not verify that a linked product was developed with AI, has a working demo, uses a particular codebase, or teaches a reusable technique. Many hot lists depend on one NewsNow API; counting them as eleven independent direct provider connections in Radar would misrepresent coverage.

## Does it actually work?

- The code contains fetching, status validation, domain checking, storage, filtering, and reporting paths. Its fetcher processed a controlled sample API response successfully. That does not establish an end-to-end live run.
- At review time GitHub's API reported this repository's `Get Hot News` workflow as `disabled_manually`. The sample workflow also expires after seven days by design, so it is not evidence of a continuously running service. [Workflow source](https://github.com/SANSAN0/TrendRadar/blob/master/.github/workflows/crawler.yml).
- One request to its default `newsnow.busiyi.world` API returned HTTP 403 from our environment. This establishes an access problem here, not global unavailability.
- The repository's `output/news` samples date from December 2025. They can demonstrate the product, but do not prove current collection. A full installation, live crawl, and notification delivery were not verified in this review.

## Decisions for Radar

| Idea | Decision and reason |
| --- | --- |
| Ranking history | **Adapted.** Hugging Face's most-liked response no longer supplies trend evidence. Only entries in the top-20 trend response receive it. We store the actual rank and show movement only with observations at least 24 hours apart. Ranks from different platforms are never added together. |
| Source concentration | **Adapted.** `/briefing` counts which platforms contribute single-source attention signals, exposing a feed dominated by one platform. |
| Topic relevance | **Tightened.** General Lobsters `web/show/release` tags no longer qualify for the AI feed; only `ai` or `ml` tags do. Old false positives remain in evidence history but are not republished in the feed. |
| Health and failures | **Already present.** `/sources` separates last successful scan, latest attempt, errors, and next due time. A failed scan is not success. |
| Deduplication | **Already present.** Radar keeps product URL/aliases distinct from evidence provenance; matching names alone never merge entities. |
| General news API as a build source | **Not adopted.** A general headline is neither a Build Entity nor AI-development evidence. NewsNow returned HTTP 403 here and adds a single aggregator dependency. It could be evaluated for a future separate News Event lane. |
| Notifications, MCP, paid AI filter | **Out of scope here.** Candidate quality, source diversity, and working-demo review come first. No model API is connected yet. |

TrendRadar uses [GPL-3.0](https://github.com/SANSAN0/TrendRadar/blob/master/LICENSE). None of its code was copied into Radar; these concepts were implemented independently within Radar's existing data contract.
