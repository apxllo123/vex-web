#!/usr/bin/env bash
# GitHub answers 404 for a private repository to a request that carries no login, so a
# page that links one hands visitors a dead control. This checks the repository behind
# each GitHub link, not a path inside it. A repository the check cannot read counts as
# a failure, so an unverified control does not reach the published site.
set -uo pipefail

check_repo() {
  local repo="$1" attempt code

  for attempt in 1 2 3; do
    code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 \
      -H "Authorization: Bearer ${GITHUB_TOKEN:-}" \
      -H 'Accept: application/vnd.github+json' \
      "https://api.github.com/repos/$repo") || code=000

    case "$code" in
      200) return 0 ;;
      404)
        echo "::error::github.com/$repo returns 404 to a visitor who is not signed in. Point the link at a public address or remove it."
        return 1
        ;;
    esac

    if [ "$attempt" -lt 3 ]; then
      sleep 5
    fi
  done

  echo "::error::Could not verify github.com/$repo (HTTP $code) after 3 attempts. Re-run the job."
  return 1
}

fail=0

while read -r repo; do
  [ -n "$repo" ] || continue
  check_repo "$repo" || fail=1
done < <(grep -ohE 'https://github\.com/[A-Za-z0-9._-]+/[A-Za-z0-9._-]+' ./*.html \
  | sed 's|^https://github.com/||' | sort -u)

exit "$fail"
