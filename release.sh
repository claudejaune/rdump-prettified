#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

bash build.sh

zip -r rdump.zip rdump/

echo "Created rdump.zip ($(du -h rdump.zip | cut -f1))"

if [ -n "$1" ]; then
  gh release create "$1" rdump.zip \
    --title "$1" \
    --notes "Release $1"
  echo "Published release $1"
fi
