# Project context rules

**Status:** implemented local behavior and curated content as of 5 October 2026. [Türkçe](PROJECT-CONTEXT.md).

Each editorial lesson has a sourced record in `content/project-context.json`. Card title, product kind, and short description come from that record, not the title of a learning exercise. `what` describes function/output; `why` summarizes a builder-stated personal motivation or product goal, distinguished by `whyBasis`. `source`, `checkedAt`, and `excerpt` retain the original trace. `audience` and `application` are **Radar suggestions**, never attributed to the builder. Search includes these fields.

Before selecting a new lesson, the builder README, official documentation, or project description must be read. No intent is invented from a name alone. On 5 October, 21 lesson descriptions were reviewed in a dated editorial pass; that is not proof that every demo works or that users like it. AI-assisted development is evaluated separately.

The automatic `project-context` enrichment checks up to 12 due builds every 15 minutes under the ingestion lock. New records lead. Successfully read or missing documents are due again after 24 hours; network failures retry after six hours. A repository uses the GitHub README API; other candidates can use a public project page. Hacker News/X/Reddit/YouTube posts are not automatically builder descriptions. Public-page access restricts IP addresses, pins DNS, revalidates redirects, and caps time and size. It executes no JavaScript and sends no private key to project sites.

Context states are `complete` (description plus purpose candidate), `partial` (description only), `missing`, `failed`, and `blocked`. `complete` is successful **text extraction**, not editorial approval. A temporary failure retains dated prior success. Source-language text is kept without pretending it was translated. Non-English explicit purpose statements can be missed by the deterministic patterns. Public HTML's relationship to a builder is not independently verified, so its claims are Derived; a repository owner's description is Builder-stated.

Raw source, hash, evidence IDs, URL, time, and extractor version are stored. Changed text produces a new evidence version; repeated identical text does not. Candidate and build-detail screens display the result, but automatic context never promotes a candidate into a course. Run `pnpm worker` for periodic work or `pnpm ingest --source=project-context --force` once; use one worker per shared data directory.
