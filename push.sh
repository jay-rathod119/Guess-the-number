#!/bin/bash

# ── Push to GitHub ──
# Uses GITHUB_TOKEN env variable for authentication.
#
# Usage:
#   export GITHUB_TOKEN="your_token_here"
#   ./push.sh "your commit message"
#
# Or one-liner:
#   GITHUB_TOKEN="your_token" ./push.sh "commit message"

REPO="jay-rathod119/Guess-the-number"
BRANCH="main"

if [ -z "$GITHUB_TOKEN" ]; then
  echo "ERROR: GITHUB_TOKEN is not set."
  echo ""
  echo "Set it first:"
  echo "  export GITHUB_TOKEN=\"ghp_your_token_here\""
  echo ""
  exit 1
fi

MSG="${1:-Update}"

echo "→ Staging all changes..."
git add -A

echo "→ Committing: $MSG"
git commit -m "$MSG"

if [ $? -ne 0 ]; then
  echo "Nothing to commit."
  exit 0
fi

echo "→ Pushing to GitHub..."
git push "https://jay-rathod119:${GITHUB_TOKEN}@github.com/${REPO}.git" "$BRANCH"

if [ $? -eq 0 ]; then
  echo "✓ Pushed successfully to https://github.com/${REPO}"
else
  echo "✗ Push failed. Check your token and network."
  exit 1
fi
