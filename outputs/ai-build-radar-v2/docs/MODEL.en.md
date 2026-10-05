# Data contract and evidence method

**Status:** implemented local PoC as of 5 October 2026, not a hosted production claim. [Türkçe](MODEL.md). Executable contracts: `lib/schema.ts` and `schemas/*.schema.json`. Live scan states: `/sources`.

The path is **source registry → immutable raw record and run → candidate → exact URL/explicit repository-homepage identity → Build Entity → versioned Evidence Objects**. Ambiguous matches create a resolution review, not an automatic merge. Daily snapshots and run counters describe processing, not worldwide coverage.

A **Build Entity** stores ID, name, description, creator/category, canonical URL/aliases, first and last Radar observation, optional evidenced public release, source IDs, and review flags. `firstSeenAt` is when Radar first accepted it, not a launch date. The `firstPublicRelease` field stays empty without direct evidence. Models, tools, roles, capabilities, and stack are not inserted as unsupported strings; each claim needs its own evidence.

An **Evidence Object** binds a field/value/status to a build, source and source-record IDs, URL, quote/locator, observation and optional publication time, raw record/hash, extractor version, supersession, and rationale. Raw JSON and prior observation sets remain; the current projection uses the latest applicable set for each source record. The content hash covers `JSON.stringify(payload)`, not original HTTP bytes. Reprocessing identical content and extractor is idempotent; A→B→A changes still create a new version. Removal of a statement removes its current projection without deleting history.

| Status | Meaning | Limit |
| --- | --- | --- |
| Verified | Specific directly observable metadata, such as a repository URL or stars. | Does not verify that AI developed the product. |
| Builder-stated | Explicit owner statement about the project's own development tool. | Not independently reproduced. |
| Derived | Directory classification or justified inference. | Not a proven fact. |
| Unknown | No adequate evidence for that field. | Not a negative claim. |

A general code-style detector cannot promote these statuses. An owner statement, a provider trace of a specific commit/change, and a product's use of AI have different evidentiary scope; see the [research, provider limits, and publication rule](AI-DEVELOPMENT-EVIDENCE.en.md).

Collectors may emit `ai_tools`, `tech_stack`, `primary_language`, `repository`, `github_stars`, `hn_mention`, `discovery_reason`, `catalog_membership`, `community_discussion`, `editorial_reference`, `platform_trending`, `platform_rank`, `github_trending_daily`, `github_trending_developer`, and metadata. A rank/star count is not AI-development evidence. There is no current collector producing reliable `models`, `ai_roles`, or `capabilities` claims. The model remains Unknown when unproven.

Identity accepts HTTP(S) URLs without credentials, strips fragments and tracking parameters, preserves identity-bearing query parameters, normalizes GitHub owner/repository paths, and refuses fuzzy name-only merges. Conflicting repository-homepage bridges enter review. Different sources retain separate claims; semantic truth arbitration is not automatic.

Registry HTTP requests have a 20-second timeout and an explicit host allowlist in `lib/http.ts`; it is **not** limited to three hosts. These requests reject redirects. Public project-page reading uses a separate `lib/public-page.ts` boundary: public-IP DNS check, socket pinning, and redirect revalidation. Provider rate limits/backoff delay future attempts. Invalid, filtered, partial, and failed are separate run states. A source can be enabled yet unsuccessful.

Local access uses a password and signed **180-day** HttpOnly/SameSite=Strict session. Desktop binds `127.0.0.1:3101`; a separate same-Wi-Fi launcher can bind private port `3102`. Local HTTP is not internet publication. Supabase migration/RLS preparation exists, but no hosted project is connected. A reader must be allowlisted in `private_members`; a service-role importer handles writes. These controls have been exercised in a local PostgreSQL-compatible test, not against hosted Supabase.

Run counters include fetched, filtered, invalid, accepted, created, matched, unchanged, evidence added, and conflicts. A high match rate is not measured entity-resolution precision. A representative human-labeled set is still required to estimate false AI attribution, false merges, or discovery recall. See [architecture](ARCHITECTURE.en.md) and the dated [Phase 1 validation](VALIDATION.en.md).
