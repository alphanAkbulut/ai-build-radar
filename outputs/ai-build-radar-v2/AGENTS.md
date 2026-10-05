<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Discovery coverage

Keep at least 10 enabled independent discovery sources; preserve existing source coverage. The public-launch acceptance target is at least 25 working independent discovery sources. Multiple queries/adapters of one publication or platform do not count as multiple sources. Enrichment adapters do not count. A failed source must remain visible with its failure state, never silently removed to make coverage look healthy. Add a replacement if a source becomes permanently unavailable; do not lower the minimum. A configured source is not proof of a successful scan: verify run records. Independent author publications count separately, even when they link to projects hosted on the same platform.

## Languages

Turkish is the initial interface language, not a permanent product constraint. Keep generated summaries keyed by article, language, source content version and prompt version. Never show content in one language as a translation into another. Provider integration remains disabled until explicitly configured; no paid API calls without authorization.

## Product memory and execution

Read `docs/PRODUCT-STRATEGY.md` and `docs/ROADMAP.md` before changing product behavior or choosing the next feature; English counterparts are adjacent. `docs/DECISIONS.md` records the reasons behind current choices, while `docs/ARCHITECTURE.md` describes implemented behavior. These versioned files are the durable product memory. The private GitHub project `https://github.com/users/alphanAkbulut/projects/2` and repository issues `R01`–`R18` track work; neither replaces those documents. For a task, verify the current code/data, update the affected Turkish and English docs, and close the issue only with acceptance evidence. Live ingestion status comes from `/sources`, not a dated document or chat claim. Do not claim an idea is implemented merely because it appears on the roadmap.

## Risk memory

Before adding an external source/provider, changing data use, or expanding access, read `docs/RISK-REGISTER.md` (English counterpart adjacent). Record material new or changed rights, reliability, cost, privacy, and false-claim risks with evidence, uncertainty, current safeguard, trigger, check, decision gate, and a linked issue in both languages. Keep an open risk open until the check and dated decision are evidenced. A local working source does not establish public permission. Maintain the relevant GitHub task as the execution record; do not treat a risk entry as proof that mitigation is implemented.
