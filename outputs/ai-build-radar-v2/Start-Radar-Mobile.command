#!/bin/zsh
set -e
unsetopt BGNICE
cd "${0:A:h}"
radar_runtime="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies"
if ! command -v node >/dev/null 2>&1 && [[ -x "$radar_runtime/node/bin/node" ]]; then
 export PATH="$radar_runtime/node/bin:$PATH"
fi
if command -v pnpm >/dev/null 2>&1; then radar_pnpm="$(command -v pnpm)";
elif [[ -x "$radar_runtime/bin/fallback/pnpm" ]]; then radar_pnpm="$radar_runtime/bin/fallback/pnpm";
else echo 'Node.js 22+ ve pnpm gereklidir. README.md dosyasına bakın.'; exit 1; fi
if [[ ! -f .env.local ]]; then echo 'Yerel erişim ayarları yok. README.md içindeki kurulum adımlarını uygulayın.'; exit 1; fi
if [[ ! -d node_modules ]]; then "$radar_pnpm" install --frozen-lockfile; fi
if [[ ! -f .next/BUILD_ID ]]; then "$radar_pnpm" build; fi
echo 'Aynı Wi-Fi üzerinde private telefon erişimi — mevcut parola LOCAL-ACCESS.txt dosyasında.'
node scripts/start-lan.mjs
