#!/bin/sh
# Push site/ + server/ to the box and (re)start the kiiri stack. Usage: server/deploy.sh [host]
set -eu
HOST="${1:-root@167.233.30.39}"
cd "$(dirname "$0")/.."
rsync -az --delete --exclude _headers --exclude _redirects site/ "$HOST:/opt/kiiri/site/"
rsync -az server/docker-compose.yml server/Caddyfile server/waitlist.js "$HOST:/opt/kiiri/"
ssh "$HOST" 'cd /opt/kiiri && docker compose up -d && docker compose exec -T web caddy reload --config /etc/caddy/Caddyfile 2>/dev/null || true'
