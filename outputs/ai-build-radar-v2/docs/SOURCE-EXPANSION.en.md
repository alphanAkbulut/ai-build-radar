# Daily AI product prompt: source audit and integration order

**Status:** Evaluation of sources verified on 5 October 2026; candidates below are **not running collectors**. `/sources` is authoritative for live run history. [Türkçe](SOURCE-EXPANSION.md).

## Product decision from the prompt

Radar primarily discovers working AI products and, where possible, explains how they were built. An **AI-powered product**, an **AI-assisted build**, a **new launch**, and a **product drawing attention** are four different claims. A source contributes evidence only for the claim it actually supports. Research papers and lab announcements belong in a future separate news/research lane; they do not automatically become working-demo cards.

`/briefing` now separates measured attention, new discoveries with builder statements, and actual scan coverage for the last 48 hours or 7 days. A headline card requires attention measured on two independent platforms for the same product; single-platform observations remain in a smaller separate list. It does not invent five to eight highlights when the evidence is thin. Category movement excludes “Other” and needs at least three products with multi-source attention. Novelty, usefulness, product quality, and “wrapper” status are not scored automatically without product review.

## Verified source candidates

| Source | What was verified | Proper Radar use | Integration |
| --- | --- | --- | --- |
| [Product Hunt API](https://www.producthunt.com/v2/docs) | GraphQL requires a token; default API terms prohibit commercial use. | Launch and platform-specific votes/comments, not AI-development proof. | Disabled until commercial permission and token. |
| [Superpower Daily Tool Drop](https://superpowerdaily.com/tools/daily) | Publishes a daily editorial five and number of launches reviewed. | Editorial discovery lead; trace back to the original product/launch. | Check structured access and usage terms. |
| [AIToolDrop](https://aitooldrop.net/) | Says it aggregates Product Hunt, Hacker News, GitHub, and Reddit. | Secondary lead; deduplicate and retain original signal provenance. | Never treat as direct virality evidence. |
| [Launch AI Jam](https://launchaijam.com/) | Free listings and paid founder audits. | Launch candidate; placement/payment is not quality or popularity. | Sample duplicate rate before enabling. |
| [AI Launch Watch](https://ailaunchwatch.com/submit-ai) | Offers paid guaranteed placements. | Low-priority candidate; its “verified” badge is not Radar verification. | Remains disabled. |
| [New Site Radar](https://newsiteradar.com/methodology) | Tracks newly found sites and visibility signals. | Domain/product discovery; registration date is neither launch nor AI-development date. | Candidate only after source and demo checks. |
| [Futurepedia](https://www.futurepedia.io/) | Large curated AI-tool directory. | Category/product discovery; directory addition is not global launch. | Verify change feed and usage terms. |
| [OpenAI News](https://openai.com/news/), [Anthropic News](https://www.anthropic.com/news), [Google AI Blog](https://blog.google/innovation-and-ai/technology/ai/) | First-party model/product announcements. | Separate product/model/feature-release news; demo and build method remain separate. | Add with a distinct News Event contract. |
| [arXiv API](https://info.arxiv.org/help/api/index.html) | Public research metadata interface. | Research lane; independently check any linked working product. | Future Research Gate, not direct build ingestion. |

The prompt's `ai-tldr.dev`, `dailyaitools.ai`, and other directory names were not activated automatically: identity, access, usage terms, publication time, and original record links need individual verification. Multiple queries against one publication are not independent sources.

## Priority and acceptance criteria

1. Define a separate **News Event** contract for first-party lab/builder announcements: actual publication time, official URL, product/model/feature type, and an optional working demo. Link to a Build Entity only through verified URL identity.
2. Obtain explicit commercial-use permission and token for Product Hunt; use provider access for X/Reddit/YouTube. Preserve failed states instead of counting them as healthy sources.
3. Treat secondary directories as candidate feeds only. Deduplicate by URL and attribute votes/ranks to their original platforms.
4. Measure false launch dates, false AI-development attribution, broken sites, and duplicates on a human-labeled sample. Show records fetched/accepted/rejected and the last successful scan for every source.

**Open product decision:** how the broad AI-news lane should relate visually to the AI-assisted-build lane. Today's `/briefing` summarizes only existing build evidence; it does not claim to scan official lab news or the prompt's disabled platforms.
