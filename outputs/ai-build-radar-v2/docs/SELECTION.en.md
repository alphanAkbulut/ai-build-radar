# Selection, attention, and learning

**Status:** code as of 5 October 2026; runtime counts can change. [Türkçe](SELECTION.md). The executable rules live in `lib/selection.ts`, `lib/evaluation.ts`, and `lib/sources.ts`.

## Timely feed

The feed answers why a product appears **now**. `evaluateFeed` creates candidate signals from a distinct site URL, meaningful description, no unresolved identity conflict, an event within seven days, and a check within 48 hours. It distinguishes **measured attention**, **new discovery with an AI-development statement**, and **a sourced mention**. Radar's first sighting is neither launch date nor popularity. Cards show source, event date, and evidence link. Yet a signal is **not publication approval**: `lib/publication.ts` currently requires the five lesson checks, a recent interaction review for the same URL, and a real interactive preview. A builder statement alone or an inaccessible demo remains in the review archive. This temporary gate can make the news feed small until R03/R04 delivers dependable demo review at scale.

Hacker News and Lobsters have a platform-specific threshold of **50 points or 20 comments** on a matching story; comments do not imply praise. Hugging Face attention comes only from the actual top-20 trending response, not `trendingScore` on the 30 most-liked results. Rank movement needs observations at least 24 hours apart. GitHub momentum requires a comparable **+25 stars** over at least 24 hours and a recent final observation; a total star count is not a growth rate. An article link is a **mention**, not an endorsement. Metrics from different platforms are not added into a global score.

The `attention` enrichment queue runs every 15 minutes for up to six due products, searching up to two exact canonical URLs and 50 stories per query in Hacker News Algolia. Name similarity is insufficient. The usual per-product recheck is about daily, or six hours after error. It does not measure X, LinkedIn, or YouTube. Absence of a strong Hacker News result says nothing about all other platforms.

Appearing on GitHub's daily Trending repository page is a separate platform-specific attention signal. “Stars today” is GitHub's display, not Radar's measured star difference. A “popular repo” beside a trending developer is only a sourced mention. Neither proves AI-assisted development. See the [source limits](GITHUB-TRENDING.en.md).

## Learning gate

A lesson is not an automatic expansion of a feed card. `selectionFor` sets `featured` only when all five checks pass:

1. The project's function has a source URL.
2. A core demo interaction was tested and recorded within 30 days.
3. A real demo preview was saved.
4. A specific learning differentiator was written.
5. An application goal, at least three steps, and at least two acceptance checks exist.

On 5 October the code-derived snapshot was **23 lesson records: five selected and 18 in the review archive**. These numbers can change when a demo review ages beyond 30 days; the UI is authoritative. Archive does not mean deleted or worthless. Automated candidates do not become lessons on discovery alone.

The gate checks the presence and freshness of editorial material, not factual quality, audience praise, or the “wow” effect. Reviews in `content/lesson-reviews.json` are curated. Autonomous browser review, sentiment analysis, and lesson generation for every candidate are not implemented. The **Apply to my project** action has a separate reproduction-test gate in `lib/adaptation.ts`. Radar's suggested tools are not attributed to the original builder.

Manually researched but unpublished candidates live in `content/research-discoveries.json`; dated exclusion decisions live in `content/research-exclusions.json`. Consult the exclusions before promoting a candidate. These files are editorial review memory, not an automatic publication gate in the current code.

## Coverage and metrics

`lib/sources.ts` has in local mode **46 registered rows, 24 enabled independent product-discovery sources, 10 news feeds, and three enabled enrichment jobs**. Eight author feeds, ten independent publication feeds, and GitHub, Hacker News, One’s Vibe, Hugging Face Spaces, DEV Community, and Lobsters make up discovery. Publication feeds contribute dated explicit project links only; they do not prove lesson quality or AI-assisted development. Registered/enabled does not mean a successful run: inspect `/sources`. The code enforces a floor of ten enabled independent sources; the public goal is 25 **working** ones. X, Reddit, Product Hunt, and YouTube are not enabled. Manually researched Product Hunt/web candidates do not imply a running Product Hunt connector.

Each author feed yields candidates from explicit GitHub and Hugging Face Space links in its latest 20 entries. An article date is not a product launch. Hugging Face likes are not growth; DEV reactions belong to the article. Only Lobsters discussions tagged `ai` or `ml` enter the AI feed. Old off-topic evidence remains in history but is excluded from the current feed. `fetched` counts inspected source records, not unique products or quality.

For screen order and operational boundaries see [architecture](ARCHITECTURE.en.md) and the [evaluation contract](EVALUATION.en.md).
