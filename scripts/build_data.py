#!/usr/bin/env python3
"""
Build data/pricing.json from the raw "Competitor Pricing Entry" CSV exports
in data/raw/.

The source of truth is the "Weldon & Emporia Daily Competitor Pricing Entry"
Google Sheets folder in Google Drive. Each site (Weldon, Emporia, ...) has its
own sheet with a fixed layout:

    Site:,<site name>,...,Due by:,<time>
    Date:,<date>,...,Instructions:,<instruction line 1>
    Survey:,<survey name>,...,<instruction line 2>
                             ,<instruction line 3>
    ,Competitor Sites,,Skip,Spot Time,UNL,PLU,PRM,DSL
    ,<competitor>,,<skip>,<spot time>,<unl>,<plu>,<prm>,<dsl>
    ...
    ,Our Price (<site>),,<skip>,<spot time>,<unl>,<plu>,<prm>,<dsl>
    ,,,Rules:,,<UNL rule>,<PLU rule>,<PRM rule>,<DSL rule>
    ,<Competitor> Address: <address>
    ,<Competitor> Website: <url>
    ...

To refresh the data after the sheet changes:
  1. In Google Sheets, File > Download > Comma Separated Values (.csv) for
     each site sheet, saving over the matching file in data/raw/ (e.g.
     data/raw/weldon.csv, data/raw/emporia.csv). Add new files for new sites.
  2. Run:  python3 scripts/build_data.py
  3. Commit the updated data/raw/*.csv and data/pricing.json.
"""
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW_DIR = ROOT / "data" / "raw"
OUT_PATH = ROOT / "data" / "pricing.json"

FUEL_COLUMNS = ["UNL", "PLU", "PRM", "DSL"]
FUEL_LABELS = {
    "UNL": "Unleaded",
    "PLU": "Plus",
    "PRM": "Premium",
    "DSL": "Diesel",
}


def clean(value):
    return (value or "").strip()


def parse_price(value):
    value = clean(value)
    if not value:
        return None
    try:
        return round(float(value), 3)
    except ValueError:
        return None


def parse_site(csv_path: Path) -> dict:
    with csv_path.open(newline="", encoding="utf-8") as fh:
        rows = list(csv.reader(fh))

    site = {
        "id": csv_path.stem,
        "name": "",
        "date": "",
        "due_by": "",
        "survey": "",
        "instructions": [],
        "competitors": [],
        "our_price": None,
        "rules": {},
        "sources": {},  # competitor name -> {address, website}
    }

    header_col = None  # column index the "Competitor Sites" table starts at
    fuel_cols = {}  # fuel code -> column index
    table_start = None

    for i, row in enumerate(rows):
        row = [clean(c) for c in row]
        if not any(row):
            continue

        if row[0] == "Site:":
            site["name"] = row[1] if len(row) > 1 else ""
            for j, cell in enumerate(row):
                if cell == "Due by:" and j + 1 < len(row):
                    site["due_by"] = row[j + 1]
        elif row[0] == "Date:":
            site["date"] = row[1] if len(row) > 1 else ""
            for j, cell in enumerate(row):
                if cell == "Instructions:" and j + 1 < len(row):
                    text = row[j + 1]
                    if text:
                        site["instructions"].append(text)
        elif row[0] == "Survey:":
            site["survey"] = row[1] if len(row) > 1 else ""
            # any trailing non-empty cells beyond the survey name continue
            # the instructions text
            for cell in row[2:]:
                if cell:
                    site["instructions"].append(cell)
        elif "Competitor Sites" in row:
            header_col = row.index("Competitor Sites")
            for fuel in FUEL_COLUMNS:
                if fuel in row:
                    fuel_cols[fuel] = row.index(fuel)
            table_start = i + 1
        elif "Rules:" in row:
            for fuel, col in fuel_cols.items():
                if col < len(row):
                    site["rules"][fuel] = row[col]
            table_start = None  # competitor table ends here
        elif re.match(r"^(.*?)\s+(Address|Website):\s*(.+)$", next((c for c in row if c), "")):
            # Address / Website footer lines, e.g.:
            #   "7-11 Address: 1479 Julian R Allsbrook Hwy, ..."
            #   "Sheetz Website: https://..."
            text = next((c for c in row if c), "")
            m = re.match(r"^(.*?)\s+(Address|Website):\s*(.+)$", text)
            comp, kind, value = m.group(1).strip(), m.group(2), m.group(3).strip()
            site["sources"].setdefault(comp, {})
            site["sources"][comp]["address" if kind == "Address" else "website"] = value
        elif (
            table_start is not None
            and header_col is not None
            and header_col < len(row)
            and row[header_col]
        ):
            name = row[header_col]
            skip_col = header_col + 2
            spot_col = header_col + 3
            skip = row[skip_col] if skip_col < len(row) else ""
            spot_time = row[spot_col] if spot_col < len(row) else ""
            prices = {}
            for fuel, col in fuel_cols.items():
                prices[fuel] = parse_price(row[col]) if col < len(row) else None

            entry = {
                "name": name,
                "skip": skip.upper() == "TRUE",
                "spot_time": spot_time,
                "prices": prices,
            }

            if name.startswith("Our Price"):
                site["our_price"] = entry
            else:
                site["competitors"].append(entry)

    # Attach address/website to each competitor by matching name prefix.
    for entry in site["competitors"]:
        source = None
        for comp_name, info in site["sources"].items():
            if entry["name"] == comp_name or entry["name"].startswith(comp_name):
                source = info
                break
        entry["address"] = source.get("address") if source else None
        entry["website"] = source.get("website") if source else None

    del site["sources"]
    return site


def main():
    sites = []
    for csv_path in sorted(RAW_DIR.glob("*.csv")):
        sites.append(parse_site(csv_path))

    out = {
        "generated_note": "Parsed from Google Drive: 'Weldon & Emporia Daily Competitor Pricing Entry' sheets. Re-run scripts/build_data.py after refreshing data/raw/*.csv.",
        "fuel_labels": FUEL_LABELS,
        "sites": sites,
    }

    OUT_PATH.write_text(json.dumps(out, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUT_PATH} with {len(sites)} site(s).")


if __name__ == "__main__":
    main()
