# AI Build Radar — private development archive

Evidence-based project discovery and a learning collection for people building with AI.

## Versions

- `v0.1.0`: preserved first private MVP in `outputs/ai-build-radar`.
- `v0.2.0`: current learning collection, People & Ideas, mobile layout and LAN launcher in `outputs/ai-build-radar-v2`.

These are snapshots versioned at the time this repository was created, not reconstructed historical commit dates. Future changes should be committed in focused increments; milestone tags should remain immutable.

## Restore

Install Node.js and pnpm. Run `pnpm install --frozen-lockfile` in the desired application directory. Copy `.env.example` to `.env.local` and configure a new private password and session secret; credentials are deliberately not backed up here.

The v2 environment can set `RADAR_DATA_DIR=../ai-build-radar/data` to share v1 ingestion data. Restore the public source snapshot by copying `snapshots/ingestion-initial.json` into `outputs/ai-build-radar/data/radar.json`, or run ingestion to collect fresh data. The snapshot is a point-in-time copy, not a continuously updated database backup. Start only one ingestion worker.

Run `pnpm build`, then `pnpm start`. v1 uses port 3100; v2 uses 3101. On macOS `Start-Radar.command` starts the selected UI; `Start-Radar-Mobile.command` in v2 additionally supports private same-Wi-Fi access on port 3102. See each application's documentation for details.

## Included and excluded

Source code, dependency lockfiles, migrations, schemas, documentation, curated public content, preview captures and an initial public ingestion snapshot are included. Secrets, local access files, installed packages, build caches, worker heartbeat, personal feedback inbox and scratch files are excluded. Screenshots and third-party metadata retain their original rights; this repository does not relicense external projects.

This repository is intended to remain private. No public deployment is configured.
