# On-demand summaries

**Status:** local implementation as of 5 October 2026. [Türkçe](SUMMARIES.md).

Provider deliberately disabled at the user's request. No credentials or paid calls are configured. Existing editorial Turkish summaries remain visible; selecting another language never relabels them as translations.

Prepared flow: authenticated same-origin POST with registered entry ID and supported language; source text is read only from that author's registered RSS feed. No arbitrary article URL fetching. Short/unavailable source text fails rather than summarizing a title. Partial RSS content is labeled. Output is plain React text, not executable HTML.

Generated storage is private local learning-data/summaries (gitignored). Cache is separated by article/language and retains source/version information. After 24h, fetch source and reuse unchanged content. Source hash and prompt version are not yet both part of the full cache key; complete this before provider activation. A cross-process lock prevents parallel generations. Ten attempts/day globally, 24,000 source characters, bounded output, no automatic retries. A crashed generation leaves a lock requiring operator inspection. This is a private PoC, not a distributed production quota service.

Before enabling: select provider/model, implement bounded request with untrusted source text isolated from system instructions, no tools, credentials server-only; validate actual output quality, language, provider errors and measured cost. Add storage/cache concurrency integration tests and live provider verification. Current tests cover input/output bounds, disabled provider, source matching, partial-source labeling and XML rejection; live AI generation is not tested.

UI interface remains Turkish. Summary language plumbing supports tr/en/ja/ko/zh; complete product localization is a separate future task.
