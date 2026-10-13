#!/usr/bin/env bash
# Scaffold a new vox-video project folder from the skill template.
#   bash .claude/skills/vox-video/scripts/new-video.sh <project-dir>
set -euo pipefail

dest=${1:?usage: new-video.sh <project-dir>}
tpl="$(cd "$(dirname "$0")/../template" && pwd)"

if [ -e "$dest" ]; then echo "refusing: $dest already exists" >&2; exit 1; fi
mkdir -p "$dest/assets" "$dest/dbg"
cp "$tpl"/{promo.html,render.mjs,textures.mjs,package.json,package-lock.json} "$dest/"

cd "$dest"
npm ci --no-audit --no-fund --loglevel=error
node textures.mjs
echo "ready: $(pwd)"
