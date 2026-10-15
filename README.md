<p align="center"><img src="brand/lockup.svg" alt="Kiiri" height="72"></p>

# kiiri.app

Landing page, press kit and brand assets for [Kiiri](https://github.com/kiiri-app/kiiri), the little cat that lives on your desktop.

Plain HTML, CSS and a bit of JavaScript. No build step.

```
site/          static site (deployed as-is)
  index.html   landing page
  press.html   press kit  · privacy.html · terms.html · 404.html
  assets/      images used by the site
  brand/       downloadable logo files (served at /brand/*)
functions/     Cloudflare Pages Functions
  api/waitlist.js   POST /api/waitlist → KV
brand/         master brand files (SVG + exported PNGs)
```

## Run locally

```bash
cd site && python3 -m http.server 8787
# or, with Pages Functions:
npx wrangler pages dev site
```

## Deploy (Cloudflare Pages)

1. Cloudflare dashboard → Workers & Pages → Create → Pages → connect this repo.
2. Build command: *(none)* · Build output directory: `site`.
3. Settings → Functions → KV namespace bindings: `WAITLIST` → a new KV namespace.
4. Custom domains → `kiiri.app` (and `www.kiiri.app` → redirect to apex).

Export the waitlist:

```bash
npx wrangler kv key list --binding WAITLIST --preview false
```

## Brand

See [`brand/BRAND.md`](brand/BRAND.md). Logos are © Kiiri and are **not** covered by an open-source license.
