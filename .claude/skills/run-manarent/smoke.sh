#!/usr/bin/env bash
# ManaRent smoke test — starts dev server, probes all pages, then stops.
# Usage: bash .claude/skills/run-manarent/smoke.sh
# Requires: node/npm (already installed via project setup)

set -euo pipefail

PROJECT="$(cd "$(dirname "$0")/../../.." && pwd)"
PORT=3000
LOG=/tmp/manarent_dev.log
PID_FILE=/tmp/manarent.pid

# ── stop any running instance ──────────────────────────────────────────────
stop() {
  if [ -f "$PID_FILE" ]; then
    kill "$(cat "$PID_FILE")" 2>/dev/null || true
    rm -f "$PID_FILE"
  fi
  # belt-and-suspenders
  pkill -f "next dev" 2>/dev/null || true
}

trap stop EXIT

# ── start dev server ───────────────────────────────────────────────────────
stop  # clean up any leftover process
cd "$PROJECT"
echo "[smoke] Starting dev server (port $PORT)…"
npm run dev > "$LOG" 2>&1 &
echo $! > "$PID_FILE"

# poll until ready
for i in $(seq 1 60); do
  curl -sf "http://localhost:$PORT/" >/dev/null 2>&1 && break
  sleep 1
done
curl -sf "http://localhost:$PORT/" >/dev/null 2>&1 || { echo "[smoke] Server did not start. See $LOG"; exit 1; }
echo "[smoke] Server ready."

# ── page probes ────────────────────────────────────────────────────────────
FAIL=0
check() {
  local url="$1" pattern="$2" label="$3"
  if curl -sf "$url" | grep -q "$pattern"; then
    echo "[smoke] OK   $label"
  else
    echo "[smoke] FAIL $label  (pattern: $pattern)"
    FAIL=1
  fi
}

check "http://localhost:$PORT/"                    "Terbaik"                   "Beranda"
check "http://localhost:$PORT/katalog"             "Toyota Avanza"             "/katalog"
check "http://localhost:$PORT/mobil/toyota-avanza" "Kalkulator Sewa"           "/mobil/toyota-avanza"
check "http://localhost:$PORT/mobil/toyota-avanza" "application/ld+json"       "JSON-LD on detail page"
check "http://localhost:$PORT/mobil/toyota-avanza" "wa.me/6282348135155"       "WhatsApp link on detail page"
check "http://localhost:$PORT/promo"               "Diskon"                    "/promo"
check "http://localhost:$PORT/tentang"             "ManaRent"                  "/tentang"
check "http://localhost:$PORT/sitemap.xml"         "toyota-avanza"             "sitemap.xml"
check "http://localhost:$PORT/robots.txt"          "Disallow: /admin"          "robots.txt"

# all 8 car slugs return 200
for slug in toyota-avanza mitsubishi-xpander toyota-fortuner honda-brio \
            toyota-innova-reborn mitsubishi-pajero-sport daihatsu-xenia toyota-camry; do
  code=$(curl -sf -o /dev/null -w "%{http_code}" "http://localhost:$PORT/mobil/$slug")
  if [ "$code" = "200" ]; then
    echo "[smoke] OK   /mobil/$slug"
  else
    echo "[smoke] FAIL /mobil/$slug → $code"
    FAIL=1
  fi
done

# ── result ─────────────────────────────────────────────────────────────────
if [ "$FAIL" -eq 0 ]; then
  echo ""
  echo "[smoke] All checks passed."
else
  echo ""
  echo "[smoke] One or more checks FAILED. See output above."
  exit 1
fi
