#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/snehasishroy/leetcode-companywise-interview-questions.git"
TMP_DIR="/tmp/leetcode-companywise-src"
DATA_DIR="/Users/ayoocare/Documents/Leetcode-Companywise/public/data"
PROJECT_DIR="/Users/ayoocare/Documents/Leetcode-Companywise"

echo "[1/3] Fetching latest data..."
if [ -d "$TMP_DIR/.git" ]; then
  git -C "$TMP_DIR" pull --ff-only
else
  rm -rf "$TMP_DIR"
  git clone --depth=1 "$REPO_URL" "$TMP_DIR"
fi

echo "[2/3] Syncing data..."
rsync -a --exclude='pom.xml' --exclude='README.md' --exclude='.gitignore' --exclude='.DS_Store' --exclude='.git' "$TMP_DIR/" "$DATA_DIR/"

echo "[3/3] Regenerating index..."
node "$PROJECT_DIR/generate_index.js"

echo "Done."
