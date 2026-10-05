<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Discovery coverage

Keep at least 10 enabled independent discovery sources; preserve existing source coverage. The public-launch acceptance target is at least 25 working independent discovery sources. Multiple queries/adapters of one publication or platform do not count as multiple sources. Enrichment adapters do not count. A failed source must remain visible with its failure state, never silently removed to make coverage look healthy. Add a replacement if a source becomes permanently unavailable; do not lower the minimum. A configured source is not proof of a successful scan: verify run records. Independent author publications count separately, even when they link to projects hosted on the same platform.
