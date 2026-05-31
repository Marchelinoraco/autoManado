---
name: run-manarent
description: Build, run, screenshot, and smoke-test the ManaRent Next.js app. Use when asked to start ManaRent, run the dev server, verify pages, take a screenshot, check a feature works, or confirm a change in the running app.
---

ManaRent is a Next.js 14 (App Router) web app. An agent drives it by launching
the dev server and probing pages with `curl` (smoke script) or `chromium-cli`
(for screenshots / interactive flows). All paths below are relative to the
project root.

## Prerequisites

Node 20+ and npm — already present in this project.

```bash
node -v   # v20+
npm -v    # 10+
```

No OS packages beyond Node are required.

## Setup

```bash
npm install
```

## Build

```bash
npm run build   # type-checks + generates .next/
```

Expected output ends with `✓ Generating static pages (17/17)`.

## Run (agent path)

### Option A — smoke script (no browser needed)

Runs the dev server, probes every public route, and exits cleanly.
This is what you should use for verifying that a code change doesn't break rendering.

```bash
bash .claude/skills/run-manarent/smoke.sh
```

Expected output ends with `[smoke] All checks passed.`

The script handles start/stop internally. If it fails, it prints which check
failed and exits 1. Dev-server logs go to `/tmp/manarent_dev.log`.

### Option B — dev server + chromium-cli (for screenshots / UI flows)

Start the server (the smoke script can do it, or manually):

```bash
pkill -f "next dev" 2>/dev/null; sleep 1
npm run dev > /tmp/manarent_dev.log 2>&1 &
echo $! > /tmp/manarent.pid
for i in $(seq 1 60); do curl -sf http://localhost:3000/ >/dev/null 2>&1 && break; sleep 1; done
echo "ready"
```

Then drive with `chromium-cli`:

```bash
chromium-cli --session manarent <<'EOF'
nav http://localhost:3000
wait-for text=Terbaik
screenshot
nav http://localhost:3000/katalog
wait-for text=Toyota Avanza
screenshot
nav http://localhost:3000/mobil/toyota-avanza
wait-for text=Kalkulator Sewa
screenshot
console --errors
EOF
```

Screenshots land in `chromium_cli/sessions/manarent/screenshots/`.

Stop the server when done:

```bash
kill $(cat /tmp/manarent.pid)
```

## Run (human path)

```bash
npm run dev   # → http://localhost:3000. Stop with Ctrl-C.
```

## Gotchas

- **Port already in use** — run `pkill -f "next dev"` before relaunching; the smoke script does this automatically.
- **Next.js 14.2.35 required** — earlier 14.x had a CVE; the project pins 14.2.35 in `package.json`.
- **Mock data only (Phase 1)** — `lib/data.ts` is static; there is no database. Supabase integration is a future phase. All 8 cars and 3 testimonials are hardcoded.
- **`chromium-cli` not available on macOS** — use the smoke script (`Option A`) for CI/verification. Use `chromium-cli` only inside a headless Linux container.
- **Slow first compile** — Next.js compiles routes on demand; the first `nav` to a new route can take 5–10 s. Use `wait-for` instead of `sleep` in `chromium-cli` scripts.

## Troubleshooting

- **`[smoke] Server did not start`**: check `/tmp/manarent_dev.log` — usually a missing `node_modules` (run `npm install`) or port conflict (run `pkill -f "next dev"`).
- **`EADDRINUSE :3000`**: another process is on port 3000 — `pkill -f "next dev"` or `lsof -ti:3000 | xargs kill`.
- **Build fails with `Cannot find module`**: run `npm install` first.
- **`curl: (7) Failed to connect`**: server not up yet — poll with the loop in Option B rather than using a fixed `sleep`.
