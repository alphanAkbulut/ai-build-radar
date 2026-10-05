# AI Build Radar · phases and work order

**Status:** plan as of 5 October 2026; phases are not delivery-date promises. [Türkçe](ROADMAP.md) · [Product memory](PRODUCT-STRATEGY.en.md) · [Decisions](DECISIONS.en.md). This document defines **targets and acceptance criteria**. GitHub Issues tracks actual work; `/sources` verifies live collection. `Rxx` identifiers name work, not completed features.

## Priority

The first release value is **trustworthy discovery plus five genuinely instructive products**, not hundreds of records or more features. Correct false claims and empty cards before expanding volume. Limit active implementation to two issues, and close each against observable acceptance criteria.

| Phase | Visitor outcome | Exit gate |
| --- | --- | --- |
| **0 · Foundation (existing)** | Private local UI; Build/Evidence records; dedupe; source page; feed, candidates, lessons | Code and documentation exist. Autonomous human-level evaluation is **not complete**. |
| **1 · Trustworthy discovery (now)** | A card explains what/why/source/time; opens the product; first five selected cases have been reviewed | `R01–R06`, sampled error report, five complete reviewed cases |
| **2 · Depth and reach** | Broader global sources, dated product/model news, a quality-gated path toward 20–30 lessons | `R07–R11`; health, rights, and false-positive rates are visible for each new source |
| **3 · Private beta** | A secure, measurable invited experience that runs when the Mac is off and can scale across languages | `R12–R15`; hosted auth/worker, backup/restore, cost/privacy review |
| **4 · Public product (later decision)** | Research, feeds for external agents, community/showcase features | Demand, rights, and revenue hypotheses for `R16–R18` validated; publish separately authorized |

## Phase 1 · current work

| Work | Why / output | Done when |
| --- | --- | --- |
| **[R01](https://github.com/alphanAkbulut/ai-build-radar/issues/1) · Human-labeled quality sample** | Sample existing candidates, feed, and lessons for AI-development claims, live demos, explanations, interest, and duplicates. | Sampling method, counts, likely false positives/negatives, sources, and priorities documented. No 90% claim without measurement. |
| **[R02](https://github.com/alphanAkbulut/ai-build-radar/issues/2) · News event contract** | Separate discovery, actual launch, platform attention, mention, and official product/model news by source and time. | Tests show that rescans do not renew old news, developer Trending is not repo Trending, and one platform is not a global trend. |
| **[R03](https://github.com/alphanAkbulut/ai-build-radar/issues/3) · Demo checks and evidence** | Check priority URLs, load, mobile/desktop, and key interaction; capture image or short motion evidence. | Test time, outcome, limits stored; broken/gated demos are not featured as ready; automation failures visible. |
| **[R04](https://github.com/alphanAkbulut/ai-build-radar/issues/4) · Card and page narrative** | Clarify roles of feed, candidate pool, and learning collection; put what/why/source/learn/Try in order. | Five visitor scenarios tested on desktop/mobile; repo is secondary; duplicate listings have a clear reason. |
| **[R05](https://github.com/alphanAkbulut/ai-build-radar/issues/5) · Five flagship cases** | Choose truly distinctive, teachable cases with sourced story, interest, demo moment, and learning path. | Each has maker description, claim/source/date, real preview/interaction, original method versus Radar suggestion, and explicit limits. Weak examples do not fill quota. |
| **[R06](https://github.com/alphanAkbulut/ai-build-radar/issues/6) · Source health and coverage** | Distinguish registered, enabled, successful, and candidate-producing sources; expose failures. | Daily source report shows last success, fetched/filtered/new/matched, reason and errors; falling below ten is visible. |

**Phase 1 gate:** Five cases open under a real browser check and demonstrate at least one distinctive interaction; a visitor can understand each card and its inclusion reason. R01 reports evidence errors and high-risk false labels are corrected. Card count or clicks alone are not success.

## Phase 2 · learning capacity

| Work | Outcome and boundary |
| --- | --- |
| **[R07](https://github.com/alphanAkbulut/ai-build-radar/issues/7) · Global source expansion** | Target 25 **working independent** discovery sources: platforms, blogs, product sites, and sources in China, Japan, Korea, and Southeast Asia. Check rights, language, dates, access, and duplicates before claiming success. X/Product Hunt/Reddit/YouTube need separate official-access review. |
| **[R08](https://github.com/alphanAkbulut/ai-build-radar/issues/8) · Attention and people tracking** | Measured cross-platform signals and dated context for people's publications. Separate who *mentioned* a product, what they said, and whether they praised it. Preserve quote limits and links. YouTube reviews can provide evidence, not automatic endorsement. |
| **[R09](https://github.com/alphanAkbulut/ai-build-radar/issues/9) · Sourced multilingual summaries** | Cache by article, language, source version, and prompt version; link the original. Unavailable languages remain visible but disabled while the API is off. No paid generation before provider, security, and budget are approved. |
| **[R10](https://github.com/alphanAkbulut/ai-build-radar/issues/10) · Tested adaptation** | Test one feature's steps, starter prompt, and acceptance checks in a sample project. Another live chat/repository is not known automatically; the prompt first inspects it. Do not state unknown original code/model as fact. |
| **[R11](https://github.com/alphanAkbulut/ai-build-radar/issues/11) · Lesson production capacity** | After the first five, reach 20 then roughly 30 strong cases. Agents may prepare candidates and sources, but demo/teaching quality needs human review or measured reliable evaluation. Do not relax the gate. |

## Phase 3 · private beta operations

| Work | Outcome and boundary |
| --- | --- |
| **[R12](https://github.com/alphanAkbulut/ai-build-radar/issues/12) · Hosted private operation** | Supabase/alternative data backup, secrets, invited auth, durable worker/scheduler, alerting, and restore test. Do not blindly move today's local password or live data. |
| **[R13](https://github.com/alphanAkbulut/ai-build-radar/issues/13) · Language and accessibility** | Separate interface and content languages; accurately show missing translations; test responsive, keyboard, and screen-reader flows. |
| **[R14](https://github.com/alphanAkbulut/ai-build-radar/issues/14) · Usage and quality analytics** | Try → Learn → Adapt funnel, search, saving intent, exits; minimize data, define deletion/privacy. GitHub repo traffic is not website click analytics. |
| **[R15](https://github.com/alphanAkbulut/ai-build-radar/issues/15) · Pre-launch review** | Examine source/licensing terms, image rights, security, cost caps, claim retraction, and beta feedback. Do not launch publicly until [open risks](RISK-REGISTER.en.md), particularly GitHub Trending HTML, have evidence-backed decisions; public release remains a separate decision. |

## Phase 4 · only with validated demand

**[R16](https://github.com/alphanAkbulut/ai-build-radar/issues/16):** Research Gate and official model/feature news, separate from working builds. **[R17](https://github.com/alphanAkbulut/ai-build-radar/issues/17):** accounts, bookmark/follow/comments, maker showcases, and monetization hypotheses, with moderation and identity costs measured. **[R18](https://github.com/alphanAkbulut/ai-build-radar/issues/18):** dated sourced RSS/API for other agents and possibly geographic discovery, contingent on source rights and location evidence. A known country may use its capital solely as an explicitly labeled *map-position proxy*, never as the maker's or deployment's actual city.

## Work management

- **Repo docs = durable product memory.** This plan, [product memory](PRODUCT-STRATEGY.en.md), [decisions](DECISIONS.en.md), [architecture](ARCHITECTURE.en.md), and topic docs are versioned with code. Neither chat nor Notion is the only source of truth.
- **GitHub Issues = live tasks.** Each `Rxx` has an issue with problem, current evidence, scope, acceptance criteria, dependencies, and document links. Add test/screen/commit evidence at completion. Update affected docs in the same work item.
- **[Private GitHub board](https://github.com/users/alphanAkbulut/projects/2) = work view.** All 18 issues are on it with `phase/1`–`phase/4` labels and Todo / In Progress / Done states. Private visibility was verified by the lock icon. The board is a view of those issues, not a second memory.
- **No Notion yet.** Connect it if visual workshops, outside stakeholders, or a nontechnical team create a real need. The canonical product decisions stay in the repo. Do not maintain an unsynchronized duplicate roadmap.
- Weekly brief review: source health, one or two completed items, decisions changed by new evidence, next two tasks. Take current counts from `/sources` and tests rather than copying old numbers.

## Tools and free options

| Need | Recommended free option now | Revisit when |
| --- | --- | --- |
| Code and decision memory | Markdown and commit history in the [GitHub Free private repository](https://github.com/pricing). | External stakeholders demonstrably cannot use versioned repo docs. |
| Task tracking | Issues and [Projects](https://docs.github.com/en/issues/tracking-your-work-with-issues/learning-about-issues/planning-and-tracking-work-for-your-team-or-project) in the same free plan; the existing private board. | A larger team genuinely needs more complex planning. |
| Nontechnical knowledge sharing | No second tool now. [Notion Free](https://www.notion.com/pricing) is an individual-use option with free-plan upload/history limits. | Workshops, research archives, or stakeholder sharing become difficult in repo docs; keep one canonical copy. |
| Hosted private data | The current local build has no added service fee but depends on the Mac. [Supabase Free](https://supabase.com/pricing) is a trial candidate; inactivity pauses and lack of automatic backups make it an unsafe assumption for durable operations. | R12 measures actual data size, uptime, backups, and budget. |
| Scheduled jobs | The local worker adds no service bill today. [GitHub Actions](https://docs.github.com/en/actions/concepts/billing-and-usage) has a plan quota for private repos; its free quota is not an unlimited always-on worker. | R12 calculates polling frequency and execution time. |

**Separate backup boundary:** GitHub versions code and docs, not `.env.local`, the local password, or live ingestion data under `RADAR_DATA_DIR`. R12 requires a restore test. Provider plans and limits can change; verify official pages when making the deployment decision.
