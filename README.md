# Gas Price Tracker

A small static dashboard that turns the daily **Competitor Pricing Entry**
Google Sheets (used by store managers to enter morning competitor fuel
prices) into a readable tracking app.

Source data: the *"Weldon & Emporia Daily Competitor Pricing Entry"* folder
in Google Drive, containing one sheet per site:

- `Weldon Competitor Pricing Entry` — 0443 Weldon Family Fare
- `Emporia Competitor Pricing Entry` — 0615 Emporia Family Fare

For every competitor that has a **Website:** line in the sheet (e.g. the
7-11 and Sheetz store-locator pages), the app links directly to that URL so
whoever is reviewing prices can click through and verify against the
competitor's own site before matching a price.

## Running it

No build step or server-side code — it's a static site.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

or open `index.html` directly in a browser (the `fetch("data/pricing.json")`
call works from `file://` in most browsers, but a local server is more
reliable).

## How the data flows

```
Google Sheet (per site)
      │  File > Download > Comma Separated Values (.csv)
      ▼
data/raw/<site>.csv        (one raw CSV export per site sheet)
      │  scripts/build_data.py
      ▼
data/pricing.json          (structured data the app reads)
      │  fetch()
      ▼
index.html + assets/app.js (dashboard UI)
```

`data/raw/*.csv` is kept in the repo so the parsed `data/pricing.json` is
always reproducible and auditable against the original sheet export.

## Refreshing prices

1. Open each site sheet in Google Sheets and use **File → Download →
   Comma Separated Values (.csv)**.
2. Save each download over the matching file in `data/raw/` (e.g.
   `data/raw/weldon.csv`, `data/raw/emporia.csv`). To track a new site, add
   a new CSV file there — the filename becomes the site's id/tab.
3. Regenerate the data file:

   ```bash
   python3 scripts/build_data.py
   ```

4. Refresh the app — it reads `data/pricing.json` on every page load.

## What the dashboard shows, per site

- Site name, survey name, due-by time, and the day's pricing
  instructions/notes exactly as entered in the sheet.
- One row per competitor: spot-check time, a **source link** to that
  competitor's website (when the sheet lists one), address (when listed),
  and prices for Unleaded / Plus / Premium / Diesel.
- The store's own submitted price (**"Our price"** row), highlighted
  separately from competitors.
- The lowest non-skipped competitor price per fuel grade is highlighted, to
  make undercuts easy to spot at a glance.
- The per-fuel matching rules (e.g. "Match 7-11 or Sheetz (LOWER)") shown
  from the sheet, when present.

## Files

- `index.html`, `assets/style.css`, `assets/app.js` — the dashboard (vanilla
  HTML/CSS/JS, no build tools or dependencies).
- `data/pricing.json` — generated structured data, read by the app.
- `data/raw/*.csv` — raw CSV exports of each site sheet (source of truth for
  `pricing.json`).
- `scripts/build_data.py` — parses `data/raw/*.csv` into `data/pricing.json`.
