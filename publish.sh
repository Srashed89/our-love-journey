#!/usr/bin/env bash
# Builds the app and publishes it to GitHub Pages at https://srashed89.github.io/our-love-journey/
# Run from this folder in Git Bash:  bash publish.sh
set -euo pipefail
cd "$(dirname "$0")"
REPO=Srashed89/our-love-journey

npm run build

# first run only: create the (public) repository and push the source
if ! gh repo view "$REPO" >/dev/null 2>&1; then
  gh repo create "$REPO" --public --description "A keepsake app for Cynthia" --source . --push
else
  git push origin main
fi

# push the built app to the gh-pages branch
TMP=$(mktemp -d)
cp -r dist/. "$TMP"
git -C "$TMP" init -q -b gh-pages
git -C "$TMP" config user.name "$(git config user.name)"
git -C "$TMP" config user.email "$(git config user.email)"
git -C "$TMP" add -A
git -C "$TMP" commit -q -m "Publish $(date +%Y-%m-%d)"
git -C "$TMP" push -q -f "https://github.com/$REPO.git" gh-pages
rm -rf "$TMP"

# first run only: switch GitHub Pages on for the gh-pages branch
gh api "repos/$REPO/pages" >/dev/null 2>&1 || \
  gh api -X POST "repos/$REPO/pages" -f "source[branch]=gh-pages" -f "source[path]=/" >/dev/null

echo "Published. It can take a minute or two to appear at https://srashed89.github.io/our-love-journey/"
