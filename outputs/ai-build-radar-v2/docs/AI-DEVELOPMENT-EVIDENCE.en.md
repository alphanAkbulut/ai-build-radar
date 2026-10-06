# Evidence for AI-assisted development: claims and limits

**Status:** Product decision and research note dated 6 October 2026. [Türkçe](AI-DEVELOPMENT-EVIDENCE.md) · [Data contract](MODEL.en.md) · [Decision log](DECISIONS.en.md). This distinguishes current Radar behavior from research targets; it does not claim a new collector or provider integration is running.

## The actual question

“Does the product use AI?”, “Did its builder use an AI tool?”, “Which agent made a particular code change?”, and “Was the entire product developed by AI?” are different claims. Evidence for one must not be promoted into another. Human and AI contributions may be mixed within a file and commit history, so Radar does not assign a binary human/AI authorship stamp to an entire product.

## What the research does and does not establish

[Suh et al.'s empirical study](https://arxiv.org/abs/2411.04299) reports poor performance and insufficient practical generalizability for the existing AI-code detectors it evaluated; even its own best approach reports F1=82.55. This does **not** mean every detector fails in every setting. [CoDet-M4](https://arxiv.org/abs/2503.13733) reports stronger discrimination across languages, generators, and domains; that research result still does not validate a calibrated product-level claim for any arbitrary open-source repository Radar encounters. Accordingly, code style, file names, comment patterns, or a guessed “secret AI signature” do not generate a public “built with AI” badge. A future classifier could only suggest **internal review candidates** until false positives are measured on human-labeled samples across tools, languages, and time.

## Direct traces also have limited scope

| Trace | Narrow claim it can support | Claim it cannot support / access limit |
| --- | --- | --- |
| An explicit README, site, or post statement by the project owner | The owner's stated development tool or method (`Builder-stated`) | Independent verification; that AI wrote every line; an unstated model. |
| A signed commit authored by [GitHub Copilot cloud agent](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents) and linked to its session log | An agent contribution to **that commit**, if the records are accessible and checked | Unrelated commits or the whole product. A generic GitHub “Verified” signature badge alone does not mean AI authorship. |
| [Cursor AI Code Tracking API](https://prod.cursor.com/docs/account/teams/ai-code-tracking-api) | The authorized team's recorded accepted changes and commit-level usage metrics | All IDEs, all human/AI effort, or every public repository. [Cursor's current product docs](https://prod.cursor.com/docs/enterprise) list it as an Enterprise feature; Radar has no access or integration today. |
| `.cursor`, `CLAUDE.md`, agent instructions, dependencies, or generated-file traces | A tool-related clue within that repository (`Derived`) | That the tool actually developed this product; files may be copied or unused. |
| GitHub stars/Trending, a Hugging Face Space, directory class, or an AI feature | A claim about attention, catalog placement, or functionality | Proof of AI-assisted development. |

## Radar's publication rule

1. An Evidence Object binds a specific **field + value + source + quote/locator + observation time**. `Verified` applies to the **narrow directly observed claim**, not the entire product. A repository URL may be `Verified` while `ai_tools` remains `Unknown` for that same build.
2. An explicit owner statement is `Builder-stated` with who, where, and when. A third-party catalog cannot speak on the owner's behalf. A removed statement leaves the current projection while its historical observation remains.
3. If authorized provider records become available, record their **commit/change scope** and provider. One agent-authored commit cannot imply that the whole product was AI-built. Private team telemetry requires access, privacy, cost, and permission decisions before collection.
4. Code similarity or a file clue may be an internal `Derived` review signal; it cannot replace an owner statement. Missing evidence remains `Unknown`, which does not mean “no AI was used.”
5. Built with AI, has AI functionality, model used, and amount of AI contribution are separate fields. Do not display a percentage contribution or “90% certain” badge without a defined sample and calibration.

## Cross-checking and claim manipulation · target rule

“Built with AI” in a README or project description is the owner's own claim, not independent verification. Hacker News, Product Hunt, and blogs repeating the same README or press release are **not three independent proofs**. Group sources by `original claim → dependent repetitions`; match product/repository/site identity and retain the original publication date and exact claim scope. An independent author trying the product may verify demo behavior, but repeating a tool name learned only from the builder does not verify the development method. Send conflicting sources and withdrawn statements to review.

Strong AI-development verification requires a direct trace tied to the relevant **change**, such as an accessible agent session, signed agent-authored commit, or authorized provider record; do not extend its scope to the entire product. The builder's statement remains useful `Builder-stated` evidence and must be labeled as such. Code similarity, agent-instruction files, and AI detectors can at most produce internal `Derived` review signals. Strong, dated attention across platforms can prioritize a product for **feed review**; it cannot move the product into a “built with AI” group without development evidence. With a working demo and sourced explanation it may appear separately as “attention in AI; development method unknown.”

The Instagram analogy has limits: Meta uses C2PA/IPTC indicators inserted by generation tools, invisible watermarks, and user disclosure for AI-content labels; it does not claim to identify all AI-generated content. It also explained that minor AI edits could trigger an overbroad “Made with AI” label. [Meta's explanation](https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/) and [C2PA's provenance limits](https://spec.c2pa.org/specifications/specifications/2.4/explainer/Explainer.html) show why an individual media asset's provenance cannot be projected onto all the code behind a software product. Radar has no universal, mandatory, portable generation marker for software.

**Before implementation:** R01 should label a sample covering owner statements, copied/echoed articles, independent demo observations, direct agent traces, and viral examples without development evidence. Record claim scope, original source, dependent repetitions, dates, and counter-evidence. Measure false positives before source-count-based promotion to `Verified` or automatic publication. This source-dependency graph and new gate are **not implemented today**.

**Current implementation:** A direct development-tool statement in a GitHub description or the first section of a linked README can produce `Builder-stated`. Radar currently runs no code-authorship detector, Copilot session verifier, or Cursor admin API integration. It does not automatically produce `Verified` AI-development-tool attribution. The first next step is [R01's labeled audit](https://github.com/alphanAkbulut/ai-build-radar/issues/1) of positive and negative examples, reporting false positives and claim scope by source. Further automation should follow that error measurement.

## Sources

- Suh et al., [*An Empirical Study on Automatically Detecting AI-Generated Source Code*](https://arxiv.org/abs/2411.04299), accepted at ICSE 2025.
- Orel et al., [*CoDet-M4*](https://arxiv.org/abs/2503.13733), 2025 research.
- GitHub, [Managing Copilot agent sessions and commits](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents).
- Cursor, [AI Code Tracking API](https://prod.cursor.com/docs/account/teams/ai-code-tracking-api) and [Enterprise features](https://prod.cursor.com/docs/enterprise).
