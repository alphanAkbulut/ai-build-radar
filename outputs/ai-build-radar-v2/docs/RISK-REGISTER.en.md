# Risk register · sources and release decisions

**Status:** 6 October 2026. Open risks for the local private MVP, not approval for public use. [Türkçe](RISK-REGISTER.md). Live source health is on `/sources`; implementation details are in the [GitHub Trending audit](GITHUB-TRENDING.en.md); [R15](https://github.com/alphanAkbulut/ai-build-radar/issues/15) tracks the release gate.

## Recording rule

When a new external source, provider, data flow, or release mode creates material rights, reliability, cost, privacy, or false-claim risk, create or update a dated entry in the same change. Record **observation, uncertainty, impact, current safeguard, trigger, required check, decision, and linked task** separately. A working local PoC establishes neither public permission nor resilience. Close a risk only after recording evidence for its check and a dated decision; a code change alone does not close it.

## GH-01 · GitHub Trending HTML access and reuse rights — open

- **Observation:** The adapter is enabled only when `RADAR_AUTH_MODE=local`; it reads the [repository](https://github.com/trending) and [developer](https://github.com/trending/developers) Trending HTML pages every three hours. The reviewed [REST Search API](https://docs.github.com/en/rest/search/search) documentation does not provide an endpoint for the same Trending ranking. This does not prove that no permission path exists.
- **Uncertainty and impact:** GitHub's [Acceptable Use Policies](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies) define automated extraction, allow some purposes, and restrict excessive load and unauthorized reuse of the service. It would be inaccurate to say HTML reading is categorically prohibited. Access, display, and reuse rights still require review before a public/hosted or commercial product relies on this path. Possible impact: source disruption, access restrictions, and rights/product risk. This is not legal advice.
- **Current safeguard:** Local-only gate, two fixed URLs, a three-hour interval, response size/time limits, and no stored full HTML. These do not grant permission.
- **Trigger / release gate:** Before hosted/public launch, commercial use, redistribution, or a larger crawl, [R15](https://github.com/alphanAkbulut/ai-build-radar/issues/15) rechecks GitHub terms and robots guidance. Consider a narrower signal from the official API/Search; if the exact Trending rank is essential, seek appropriate guidance/permission from GitHub or specialist rights review. Record a dated source decision: **continue / replace / disable**. Do not enable the HTML adapter publicly without that decision.

## GH-02 · HTML layout and measurement fragility — open

- **Observation:** Titles and links are parsed from today's page markup. Tests cover a representative HTML fixture and changed-layout failure; they cannot guarantee that the live markup remains stable.
- **Impact:** Silent empty results, wrong repository matches, or missed trends could mislead visitors.
- **Current safeguard:** Layout/API failures appear as failed/partial runs on `/sources`, rather than fabricated empty success. URL deduplication and signal-type separation are implemented.
- **Trigger / check:** Layout change, consecutive failures, or an unexpected zero/large volume shift. Before R15 closes, test live end-to-end monitoring, an error alert, and a way to disable the adapter while showing dated last-verified data. A fixture test alone does not meet this gate.

## GH-03 · request volume and limits — open

- **Observation:** One run can read at most two HTML pages and hydrate 16 repositories through the API. At a three-hour interval the theoretical maximum is about 16 HTML and 128 repository API requests per day. Actual counts depend on runs; this excludes other GitHub adapters. The pipeline uses `FetchError` retry timing and increasing backoff; `Retry-After` behavior has not been verified for every GitHub error type.
- **Impact:** Exceeding [GitHub API limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api) can produce 403/429 responses, temporary restrictions, and missed updates.
- **Trigger / check:** Higher cadence/scope, hosted worker migration, or observed 403/429. Test a shared request budget, response-header-aware backoff, a central worker (no crawl per visitor), success/error ratios, and limit alerts before scaling.

## GH-04 · misreading the trend signal — open

- **Observation:** Repository Trending measures GitHub-specific visibility; a developer-page “popular repo” is only a mention. Neither proves AI-assisted development, a working demo, praise, or global popularity.
- **Impact:** Claims stronger than the evidence damage Radar's credibility.
- **Current safeguard:** Separate `github_trending_daily` / `github_trending_developer` evidence, canonical URL resolution, and additional site/description requirements for cards. An AI-development-tool claim needs separate sourcing.
- **Trigger / check:** If card text, ranking, or an automated summary turns these signals into “AI-built” or “globally trending,” block that claim before publication and update the [evaluation rules](EVALUATION.en.md) and regression checks.
