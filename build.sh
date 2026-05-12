#!/usr/bin/env bash
set -e

DIST="rdump"

rm -rf "$DIST"
mkdir -p "$DIST/icons"

cp manifest.json popup.html popup.css popup.js "$DIST/"
cp icons/*.png "$DIST/icons/"

echo "Build ready at ./$DIST/"
