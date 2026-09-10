(function () {
  "use strict";

  const FUEL_ORDER = ["UNL", "PLU", "PRM", "DSL"];

  const app = document.getElementById("app");
  const tabsEl = document.getElementById("site-tabs");
  const metaEl = document.getElementById("meta");

  let data = null;
  let activeSiteId = null;

  fetch("data/pricing.json", { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then((json) => {
      data = json;
      if (!data.sites || !data.sites.length) {
        renderError("No sites found in data/pricing.json.");
        return;
      }
      activeSiteId = data.sites[0].id;
      renderMeta();
      renderTabs();
      renderActiveSite();
    })
    .catch((err) => {
      renderError("Couldn't load data/pricing.json (" + err.message + "). Run scripts/build_data.py to generate it.");
    });

  function renderMeta() {
    metaEl.textContent = data.generated_note || "";
  }

  function renderTabs() {
    tabsEl.innerHTML = "";
    if (data.sites.length < 2) return; // no need for tabs with a single site
    data.sites.forEach((site) => {
      const btn = document.createElement("button");
      btn.textContent = site.name || site.id;
      btn.className = site.id === activeSiteId ? "active" : "";
      btn.addEventListener("click", () => {
        activeSiteId = site.id;
        renderTabs();
        renderActiveSite();
      });
      tabsEl.appendChild(btn);
    });
  }

  function renderActiveSite() {
    const site = data.sites.find((s) => s.id === activeSiteId);
    app.innerHTML = "";
    if (!site) {
      renderError("Site not found.");
      return;
    }
    app.appendChild(buildSiteCard(site));
  }

  function renderError(message) {
    app.innerHTML = '<p class="error">' + escapeHtml(message) + "</p>";
  }

  function buildSiteCard(site) {
    const card = document.createElement("section");
    card.className = "site-card";

    card.appendChild(buildHead(site));

    const instructions = (site.instructions || []).filter(Boolean);
    if (instructions.length) {
      const box = document.createElement("div");
      box.className = "instructions";
      const label = document.createElement("strong");
      label.textContent = "Pricing instructions";
      box.appendChild(label);
      const ul = document.createElement("ul");
      instructions.forEach((line) => {
        const li = document.createElement("li");
        li.textContent = line;
        ul.appendChild(li);
      });
      box.appendChild(ul);
      card.appendChild(box);
    }

    card.appendChild(buildTable(site));

    if (site.rules && Object.keys(site.rules).length) {
      card.appendChild(buildRules(site));
    }

    return card;
  }

  function buildHead(site) {
    const head = document.createElement("div");
    head.className = "site-card__head";

    const title = document.createElement("div");
    title.className = "site-card__title";
    const h2 = document.createElement("h2");
    h2.textContent = site.name || site.id;
    const p = document.createElement("p");
    p.textContent = site.survey || "Daily Fuel Prices";
    title.appendChild(h2);
    title.appendChild(p);
    head.appendChild(title);

    const stats = document.createElement("div");
    stats.className = "site-card__stats";
    stats.appendChild(buildStat("Date", site.date));
    stats.appendChild(buildStat("Due by", site.due_by));
    head.appendChild(stats);

    return head;
  }

  function buildStat(label, value) {
    const wrap = document.createElement("div");
    wrap.className = "stat";
    const l = document.createElement("span");
    l.className = "stat-label";
    l.textContent = label;
    const v = document.createElement("span");
    v.className = "stat-value";
    v.textContent = value || "—";
    wrap.appendChild(l);
    wrap.appendChild(v);
    return wrap;
  }

  function buildTable(site) {
    const wrap = document.createElement("div");
    wrap.className = "table-wrap";

    const table = document.createElement("table");
    table.className = "pricing";

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    ["Competitor", "Source", "Spot time", ...FUEL_ORDER].forEach((label) => {
      const th = document.createElement("th");
      th.textContent = label;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    const rows = [...(site.competitors || [])];
    if (site.our_price) rows.push(Object.assign({ isOurs: true }, site.our_price));

    // find the lowest price per fuel among non-skipped competitors, to highlight
    const mins = {};
    FUEL_ORDER.forEach((fuel) => {
      const values = (site.competitors || [])
        .filter((c) => !c.skip && c.prices && typeof c.prices[fuel] === "number")
        .map((c) => c.prices[fuel]);
      mins[fuel] = values.length ? Math.min(...values) : null;
    });

    rows.forEach((row) => {
      tbody.appendChild(buildRow(row, mins));
    });

    table.appendChild(tbody);
    wrap.appendChild(table);
    return wrap;
  }

  function buildRow(row, mins) {
    const tr = document.createElement("tr");
    const classes = [];
    if (row.isOurs) classes.push("our-price");
    if (row.skip) classes.push("skip");
    if (!row.skip && !row.isOurs) classes.push("low");
    tr.className = classes.join(" ");

    // Competitor name (+ "Us" badge + address)
    const nameTd = document.createElement("td");
    const nameWrap = document.createElement("div");
    nameWrap.className = "competitor-name";
    const nameLine = document.createElement("span");
    nameLine.textContent = row.name;
    nameWrap.appendChild(nameLine);
    if (row.isOurs) {
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = "Our price";
      nameWrap.appendChild(badge);
    }
    if (row.address) {
      const addr = document.createElement("span");
      addr.className = "address";
      addr.textContent = row.address;
      nameWrap.appendChild(addr);
    }
    nameTd.appendChild(nameWrap);
    tr.appendChild(nameTd);

    // Source link — pulled straight from the "<Competitor> Website:" line in the sheet
    const sourceTd = document.createElement("td");
    if (row.website) {
      const a = document.createElement("a");
      a.href = row.website;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "source-link";
      a.textContent = "Verify on site ↗";
      sourceTd.appendChild(a);
    } else {
      const span = document.createElement("span");
      span.className = "source-link none";
      span.textContent = row.isOurs ? "—" : "no website in sheet";
      sourceTd.appendChild(span);
    }
    tr.appendChild(sourceTd);

    const spotTd = document.createElement("td");
    spotTd.textContent = row.spot_time || "—";
    tr.appendChild(spotTd);

    FUEL_ORDER.forEach((fuel) => {
      const td = document.createElement("td");
      td.className = "fuel-cell";
      const value = row.prices ? row.prices[fuel] : null;
      if (row.skip) {
        td.textContent = "skipped";
      } else if (typeof value === "number") {
        td.textContent = "$" + value.toFixed(3);
        if (!row.isOurs && mins[fuel] !== null && value === mins[fuel]) {
          td.classList.add("is-min");
        }
      } else {
        td.textContent = "—";
      }
      tr.appendChild(td);
    });

    return tr;
  }

  function buildRules(site) {
    const box = document.createElement("div");
    box.className = "rules";
    const h3 = document.createElement("h3");
    h3.textContent = "Matching rules by fuel grade";
    box.appendChild(h3);
    const grid = document.createElement("div");
    grid.className = "rules-grid";
    FUEL_ORDER.forEach((fuel) => {
      const rule = site.rules[fuel];
      if (!rule) return;
      const line = document.createElement("div");
      const strong = document.createElement("span");
      strong.className = "rule-fuel";
      strong.textContent = fuel + ":";
      line.appendChild(strong);
      line.appendChild(document.createTextNode(rule));
      grid.appendChild(line);
    });
    box.appendChild(grid);
    return box;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
})();
