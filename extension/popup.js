/**
 * popup.js — PriceHawk Chrome Extension popup logic.
 * Reads product title from content.js via chrome.storage.session,
 * calls the Flask API at localhost:5000/api/search, renders results.
 */

const API_BASE = "http://localhost:5000";
const SOURCE_COLORS = {
  Amazon:   "#FF9900",
  Flipkart: "#2874f0",
  Myntra:   "#ff3f6c",
  Meesho:   "#f43397",
  Nykaa:    "#fc2779",
  Ajio:     "#000000",
  TataCLiQ: "#593fb6",
};
const SOURCE_ICONS = {
  Amazon:   "🛒",
  Flipkart: "🛍",
  Myntra:   "👗",
  Meesho:   "📦",
  Nykaa:    "💄",
  Ajio:     "✨",
  TataCLiQ: "🏷",
};

let _allResults = [];
let _activeFilter = "All";

// ─── DOM refs ────────────────────────────────────────────────────────────────
const $searchInput    = document.getElementById("searchInput");
const $searchBtn      = document.getElementById("searchBtn");
const $detectedLabel  = document.getElementById("detectedLabel");
const $stateLoading   = document.getElementById("stateLoading");
const $stateError     = document.getElementById("stateError");
const $stateEmpty     = document.getElementById("stateEmpty");
const $resultsSection = document.getElementById("resultsSection");
const $serverStatus   = document.getElementById("serverStatus");
const $statusText     = document.getElementById("statusText");
const $retryBtn       = document.getElementById("retryBtn");
const $productList    = document.getElementById("productList");
const $filterTabs     = document.getElementById("filterTabs");
const $bestDeal       = document.getElementById("bestDealBanner");
const $bestSource     = document.getElementById("bestSource");
const $bestTitle      = document.getElementById("bestTitle");
const $bestPrice      = document.getElementById("bestPrice");
const $bestLink       = document.getElementById("bestLink");
const $statCount      = document.getElementById("statCount");
const $statSites      = document.getElementById("statSites");
const $statCheapest   = document.getElementById("statCheapest");
const $statHighest    = document.getElementById("statHighest");
const $resultsFooter  = document.getElementById("resultsFooter");

// ─── Utilities ───────────────────────────────────────────────────────────────
function showState(name) {
  $stateLoading.style.display   = name === "loading"  ? "flex"  : "none";
  $stateError.style.display     = name === "error"    ? "flex"  : "none";
  $stateEmpty.style.display     = name === "empty"    ? "flex"  : "none";
  $resultsSection.style.display = name === "results"  ? "block" : "none";
}

function formatPrice(price) {
  if (!price && price !== 0) return "N/A";
  return "₹" + Number(price).toLocaleString("en-IN");
}

function truncate(str, n) {
  return str && str.length > n ? str.slice(0, n - 1) + "…" : str;
}

// ─── Server health check ─────────────────────────────────────────────────────
async function checkServer() {
  try {
    const r = await fetch(`${API_BASE}/api/status`, { signal: AbortSignal.timeout(3000) });
    if (r.ok) {
      $serverStatus.classList.add("online");
      $statusText.textContent = "Server online";
      return true;
    }
  } catch (_) {}
  $serverStatus.classList.remove("online");
  $statusText.textContent = "Server offline";
  return false;
}

// ─── Render results ───────────────────────────────────────────────────────────
function renderResults(results, query, fromCache) {
  _allResults = results;
  if (!results.length) { showState("empty"); return; }

  // Best deal
  const priced = results.filter(r => r.price);
  if (priced.length) {
    const best = priced[0];
    $bestDeal.style.display = "flex";
    $bestSource.textContent = (SOURCE_ICONS[best.source] || "🛒") + " " + best.source;
    $bestSource.style.color = SOURCE_COLORS[best.source] || "#6C63FF";
    $bestTitle.textContent  = truncate(best.title, 60);
    $bestPrice.textContent  = formatPrice(best.price);
    $bestLink.href          = best.link;
  }

  // Stats
  const prices = priced.map(r => r.price);
  const sites  = [...new Set(results.map(r => r.source))];
  $statCount.textContent    = results.length;
  $statSites.textContent    = sites.length;
  $statCheapest.textContent = prices.length ? "₹" + Math.min(...prices).toLocaleString("en-IN") : "—";
  $statHighest.textContent  = prices.length ? "₹" + Math.max(...prices).toLocaleString("en-IN") : "—";

  // Filter tabs
  $filterTabs.innerHTML = "";
  ["All", ...sites].forEach(site => {
    const tab = document.createElement("button");
    tab.className = "filter-tab" + (site === _activeFilter ? " active" : "");
    tab.textContent = site;
    if (SOURCE_COLORS[site]) tab.style.setProperty("--tab-color", SOURCE_COLORS[site]);
    tab.addEventListener("click", () => {
      _activeFilter = site;
      document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderCards();
    });
    $filterTabs.appendChild(tab);
  });

  renderCards();
  $resultsFooter.textContent = fromCache
    ? `⚡ Cached results • ${results.length} products across ${sites.length} sites`
    : `🔍 Live results • ${results.length} products across ${sites.length} sites`;

  showState("results");
}

function renderCards() {
  const filtered = _activeFilter === "All"
    ? _allResults
    : _allResults.filter(r => r.source === _activeFilter);

  $productList.innerHTML = "";
  filtered.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.animationDelay = `${i * 30}ms`;

    const color = SOURCE_COLORS[item.source] || "#6C63FF";
    const icon  = SOURCE_ICONS[item.source]  || "🛒";
    const priceStr = item.price ? formatPrice(item.price) : (item.price_raw || "—");

    card.innerHTML = `
      <div class="card-source" style="color:${color}">
        <span>${icon}</span>
        <span>${item.source}</span>
      </div>
      <div class="card-title">${truncate(item.title || "—", 72)}</div>
      <div class="card-footer">
        <span class="card-price">${priceStr}</span>
        <a class="card-link" href="${item.link}" target="_blank" rel="noopener">View →</a>
      </div>
    `;
    $productList.appendChild(card);
  });

  if (!filtered.length) {
    $productList.innerHTML = `<p class="no-filter">No results from ${_activeFilter}.</p>`;
  }
}

// ─── Main search ──────────────────────────────────────────────────────────────
async function doSearch(query) {
  if (!query.trim()) return;
  _activeFilter = "All";
  showState("loading");
  $bestDeal.style.display = "none";

  const online = await checkServer();
  if (!online) { showState("error"); return; }

  try {
    const url = new URL(`${API_BASE}/api/search`);
    url.searchParams.append("q", query);

    // Backend may take 30-90 seconds due to Playwright & Selenium
    const r = await fetch(url, { signal: AbortSignal.timeout(120000) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    if (data.error) throw new Error(data.error);
    renderResults(data.results || [], query, data.from_cache);
  } catch (err) {
    console.error("[PriceHawk]", err);
    showState("error");
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  // Check server health
  checkServer();

  // Try to read product title from current tab via content.js
  chrome.storage.session.get(["productTitle"], (data) => {
    if (data.productTitle) {
      $searchInput.value = data.productTitle;
      $detectedLabel.textContent = `📄 Detected: ${truncate(data.productTitle, 50)}`;
      // Auto-search when on a product page
      doSearch(data.productTitle);
    }
  });

  // Search button
  $searchBtn.addEventListener("click", () => doSearch($searchInput.value));
  $searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doSearch($searchInput.value);
  });

  // Retry button
  $retryBtn.addEventListener("click", () => doSearch($searchInput.value));
});
