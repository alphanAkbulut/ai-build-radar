# Build Radar evaluation contract

**Status:** proposed product standard separated from implemented behavior as of 5 October 2026. [Türkçe](EVALUATION.md). The visitor should learn what exists, why it attracts attention, and what can be transferred into their own product. New models, unusual interaction design, and practical problem-solving can all matter; popularity alone is insufficient.

The **timely feed** is for discovery. It separates measured attention, new AI-development claims, and mentions; each has source and event/check time. A candidate in that feed has not necessarily had its demo tested. The **learning collection** requires a sourced purpose, tested interaction, actual preview, differentiator, and application steps. Research papers without a working public demo belong to a future research surface, which has no dedicated page yet.

| Stage | Required evidence | Current behavior and limit |
| --- | --- | --- |
| Discovery | Source URL, raw record, observation time, project URL | Exact URL/alias matching; ambiguous identities enter review. |
| Context | Builder README or official project page | Do not invent intent when it is not stated. |
| Attention | Platform trend, time-stamped votes/comments, or comparable star movement | No cross-platform total score; an article link is not praise. |
| Demo | Site and recorded interaction | HTTP 200 or a screenshot alone is insufficient. Reviews are editorial today. |
| Learning | Observed difference, sourced technical facts, Radar's own exercise and checks | Original method and Radar's alternative stay separate. |
| Publication | Dated checks and decision | **Target:** broken demos are re-reviewed. Today only the 30-day review age is automatically checked. |

`lib/evaluation.ts` currently supports matching Hacker News and AI/ML-tagged Lobsters discussions at **50 points or 20 comments**, real Hugging Face top-20 trend entries, and GitHub growth of **+25 stars** over at least 24 hours. These thresholds are attention signals, not quality scores. It requires a site URL and meaningful description; signal event within seven days and check within 48 hours. A newly seen direct AI-development statement is a discovery, not measured virality or a launch. Old articles are not republished as new mentions just because a scan ran today.

`lib/selection.ts` applies the five learning checks. It tests recorded material and age, not narrative quality. The editorial review data is in `content/lesson-reviews.json`. Preview creation, autonomous interaction review, comment sentiment, and autonomous publication are absent. No paid AI provider is connected. On 5 October, five of 23 lesson records passed the gate; all five had `ai=Unknown`. A product using AI is a separate fact from AI-assisted development. The selected count can change with review age.

**Next acceptance targets:** each feed card has a traceable why/when/source and a direct site action; each selected product has desktop/mobile interaction evidence and limits; each lesson separates builder tools from Radar's implementation proposal; adaptation is enabled only after a reproduction test; weekly audit reports false AI claims, broken demos, unsupported attention, missing context, and bad merges. No “90% success” claim without a measured representative test set.

Authoritative implementation detail: [architecture](ARCHITECTURE.en.md), [selection](SELECTION.en.md), and `/sources` for live scan health.
