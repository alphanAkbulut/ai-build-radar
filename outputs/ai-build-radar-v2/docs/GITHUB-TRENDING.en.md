# GitHub Trending · source audit and operation

**Status:** private local PoC as of 5 October 2026. [Türkçe](GITHUB-TRENDING.md). Code: `lib/github-trending.ts`; registry: `lib/sources.ts`; evidence/feed: `lib/evaluation.ts`. The live `/sources` page is authoritative for current success and counts.

## Why it was added

The earlier GitHub collector queried Repository Search for “built with ...” statements and the `vibe-coding` topic. It did **not** read [trending repositories](https://github.com/trending) or [trending developers](https://github.com/trending/developers). This gap can miss increasingly visible AI tools and should have been reported clearly. Neither page is a complete AI-product catalog or proof of AI-assisted development. The developer page shows a “popular repo” beside a trending person; that does not establish that the repo itself entered the repository trend list.

## Implemented flow

In local mode, `github-trending` checks both daily HTML pages every three hours. Requests use fixed URLs, a 2 MB/20-second bound, no redirects, and visible failure states. Up to ten repository-list and six developer-list links whose name/description matches AI terms are hydrated through the GitHub Repository API for metadata and an optional homepage. Changed HTML or failed API reads produce a failed/partial run on `/sources`, not a fabricated empty success. Developer profiles, follower counts, personal details, and full HTML pages are not stored.

The same canonical repository URL deduplicates entries across both pages and existing GitHub search, while each observation keeps separate evidence. A direct repository listing emits `github_trending_daily` as **platform-specific attention**. GitHub's displayed “stars today” is not Radar's own two-date star-growth measurement. A developer-page “popular repo” emits `github_trending_developer` as a **mention** only. Neither proves AI-assisted development, a working demo, or user praise. An explicit repository-owner “built with ...” API description may independently produce a `Builder-stated` claim.

A feed card additionally requires a non-repository site URL, meaningful product description, and resolved identity. Repository-only entries can remain in the archive without a **Try** card. Demo health and learning value still require editorial review. The two pages are **views of one GitHub platform**, not an extra independent discovery source beyond the 14 already counted.

## First observed run and limits

The run at 19:27 UTC on 5 October 2026 completed: 48 read listing/API records, 24 filtered, 12 new Build Entities, 12 matches (including listing/metadata pairs within the same run), 144 evidence observations, and no identity conflicts. It produced six direct-repository and six developer-list claims. Six records had enough site/description information to qualify for a feed card at that moment. **This snapshot is not global coverage, demo verification, or 12 independently trending products.** Six claims came only from the developer page. Later counts can change; use `/sources` for current status.

No official Trending API is used here: this private PoC reads HTML and can break when GitHub changes the page. The reviewed [GitHub REST Search API](https://docs.github.com/en/rest/search/search) does not offer the same Trending ranking. GitHub's [Acceptable Use Policies](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies) set conditions for automated access and information use; we do not treat HTML access as categorically prohibited. The adapter runs only with `RADAR_AUTH_MODE=local`. The public/hosted use decision, reuse rights, layout monitoring, rate-limit control, and accurate signal labels are tracked as GH-01–GH-04 in the [risk register](RISK-REGISTER.en.md), with a release gate in [R15](https://github.com/alphanAkbulut/ai-build-radar/issues/15). This is not legal advice or a claim that GitHub has granted permission.
