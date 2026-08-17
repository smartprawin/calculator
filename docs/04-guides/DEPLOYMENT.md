# Deployment Guide

How to build, host, and maintain this static calculator site on GitHub Pages
with the custom domain **`simplecalculator.in`**.

## Overview
- Fully static: plain HTML/CSS/JS, **no build step**.
- Hosted on **GitHub Pages** from the `smartprawin/calculator` repository, `main`
  branch, root.
- Published at the custom domain **`https://simplecalculator.in/`** (the
  project‑site URL `https://smartprawin.github.io/calculator/` also works until
  the custom domain is configured).

## Project files
| File | Purpose |
|------|---------|
| `index.html` | Landing page (hero + calculator cards) |
| `emi.html`, `emi.js` | EMI calculator |
| `ebbill.html`, `ebbill.js` | EB (electricity) bill calculator |
| `tax.html`, `tax.js` | Income tax calculator (FY 2025-26) |
| `common.js` | Shared engine: `$()`, `currency()`, `parseDigits()`, `groupIndian()`, i18n (en/ta) |
| `style.css` | All styling (uses `?v=2` cache-busting) |
| `robots.txt`, `sitemap.xml` | SEO crawl directives |
| `CNAME` | Custom-domain declaration for GitHub Pages |

## Deploy steps
1. Push changes to `main` (the site auto-publishes on push).
2. Repo **Settings → Pages → Build and deployment → Source: Deploy from a
   branch → Branch: `main`, Folder: `/ (root)` → Save**.
3. Wait ~1–2 minutes. The site is live.

## Custom domain: `simplecalculator.in`
1. **Buy** the domain at any registrar.
2. **DNS** (at the registrar): add A records for the apex pointing to the four
   GitHub Pages IP addresses:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
   (Optionally add a `www` CNAME to `smartprawin.github.io` and redirect it.)
3. The repo already contains a root **`CNAME`** file with `simplecalculator.in`
   (GitHub Pages reads this to bind the domain).
4. Repo **Settings → Pages → Custom domain** → enter `simplecalculator.in` →
   Save. Once DNS propagates, enable **Enforce HTTPS**.
5. Verify the site loads at `https://simplecalculator.in/`.

## SEO URLs (point to the custom domain)
All absolute URLs use `https://simplecalculator.in/` as the base:
- `<link rel="canonical">` on `index.html`, `emi.html`, `ebbill.html`,
  `tax.html`.
- `<loc>` entries in `sitemap.xml`.
- The `Sitemap:` line in `robots.txt`.

> If the domain ever changes, replace the base
> `https://simplecalculator.in/` in those six files (HTML canonicals,
> `sitemap.xml`, `robots.txt`). No code logic depends on the domain.

## Cache-busting
Stylesheet and script tags carry a `?v=2` query (`style.css?v=2`,
`common.js?v=2`, etc.) so browsers pick up updates instead of serving a stale
cached copy after a deploy. Bump the version when making CSS/JS changes that
users must see immediately.

## Notes / gotchas
- The language toggle is client-side (JS) on a single page + shared files;
  there are no separate `/ta/` URLs, so Tamil content relies on JS rendering.
- Ensure `CNAME` stays at the repo root; deleting it will drop the custom domain
  binding.
- Placeholder URLs (`https://your-username.github.io/your-repo/`) were replaced
  with `simplecalculator.in` in the initial custom-domain commit.
