#!/bin/sh
# Builds the site, serves it on port 3100, runs the click-through test, then shuts the server down.
cd "$(dirname "$0")/.." || exit 1
npm run build >/tmp/site-build.log 2>&1 || { echo "Build failed. See /tmp/site-build.log"; tail -20 /tmp/site-build.log; exit 1; }
npx next start -p 3100 >/tmp/site-start.log 2>&1 & PID=$!
for i in $(seq 1 30); do curl -s -o /dev/null http://localhost:3100 && break; sleep 1; done
BASE_URL=http://localhost:3100 node tests/smoke.mjs; CODE=$?
kill $PID 2>/dev/null
exit $CODE
