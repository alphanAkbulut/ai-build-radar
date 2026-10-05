# Phase 1 validation — dated snapshot

**Historical measurement:** 2026-10-04T17:04:38.263138Z. [Türkçe](VALIDATION.md). This is not a current dashboard report; the scheduler and product code have changed since. See `/sources` and the architecture for current implementation.

The initial PoC accepted 40 GitHub, 11 Hacker News, and 120 One’s Vibe records: 171 Build Entities, 1,390 historical evidence observations, 1,045 current observations, ten explicit AI-tool claims, 161 Unknown tool fields, and no identity reviews at that time. There was no natural cross-source duplicate in that sample, so entity-resolution precision/recall was **not** measured. Offline reprocessing of the same 40 GitHub payloads gave 40 matches, 40 unchanged, and no new entity/evidence.

A first extractor falsely read “checks for apps built with Lovable” as this project's own tool statement. The deterministic-v2 correction rejected third-party/negative wording, reducing 13 tool labels to ten. Historic claims were retained; current projections used the new rule. This is a single observed false positive and correction, not a measured overall accuracy rate.

At that phase, 12 automated tests, a local PostgreSQL-compatible migration/RLS/import check, TypeScript, production build, private-route redirects, and key browser flows passed. These counts and the then-current three enabled/twelve registered sources are **historical**. Real hosted Supabase Auth, worldwide coverage, independently exercised product behavior, and representative human-labeled precision/recall were not verified. Subsequent changes require current tests; they do not retroactively alter this record.
