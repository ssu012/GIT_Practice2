/* ===========================================================
   Hamro Pasal — product data & interactivity
   =========================================================== */

const PRODUCTS = [
  // -------- Khaja (snacks) --------
  { id: "wai-wai-mama", name: "Wai Wai Ma Ma Noodles", brand: "CG Foods", category: "khaja",
    price: 1.49, oldPrice: 1.79, emoji: "🍜", tag: "Best Seller",
    desc: "Hot & Spicy instant noodles, chicken flavoured. Crushed for convenience." },
  { id: "furandana", name: "Furandana Snack Mix", brand: "Lekali Foods", category: "khaja",
    price: 6.99, emoji: "🍿", tag: "Traditional",
    desc: "Premium quality puffed-rice & bhuja trail mix, made in Nepal." },
  { id: "bhuja-mix", name: "Nepali Bhuja Mix", brand: "Hamro Kitchen", category: "khaja",
    price: 5.49, emoji: "🥨", desc: "Crunchy spiced beaten-rice snack mix." },

  // -------- Achar (pickles) --------
  { id: "dalle-katahar", name: "Dalle & Katahar Achar", brand: "Nepali Garden", category: "achar",
    price: 8.99, emoji: "🫙", tag: "Spicy", desc: "Red cherry pepper & jackfruit pickle, small-batch made." },
  { id: "lapsi-achar", name: "Lapsi Achar", brand: "Hamro Kitchen", category: "achar",
    price: 7.49, emoji: "🫙", desc: "Tangy Nepali hog-plum pickle with timur seasoning." },

  // -------- Chiura (beaten rice) --------
  { id: "thick-chiura", name: "Thick Chiura", brand: "Kathmandu Foods", category: "chiura",
    price: 4.99, emoji: "🍘", desc: "Coarse beaten rice, 2 lb bag — great for dahi chiura." },
  { id: "thin-chiura", name: "Thin Chiura", brand: "Kathmandu Foods", category: "chiura",
    price: 4.99, emoji: "🍘", desc: "Fine beaten rice, perfect for a quick khaja." },

  // -------- Chaamal (rice) --------
  { id: "mansuli-rice", name: "Mansuli Rice 10lb", brand: "Himalayan Harvest", category: "chaamal",
    price: 14.99, emoji: "🍚", tag: "Popular", desc: "Soft aromatic rice, everyday household favourite." },
  { id: "basmati-rice", name: "Basmati Rice 10lb", brand: "Himalayan Harvest", category: "chaamal",
    price: 17.99, emoji: "🍚", desc: "Extra-long grain aged basmati rice." },

  // -------- Sabji (vegetables) --------
  { id: "frozen-karela", name: "Frozen Karela (Bitter Gourd)", brand: "Farm Fresh Nepal", category: "sabji",
    price: 3.99, emoji: "🥒", desc: "Cleaned & sliced, ready to cook, 1 lb pack." },
  { id: "frozen-saag", name: "Frozen Mustard Saag", brand: "Farm Fresh Nepal", category: "sabji",
    price: 3.49, emoji: "🥬", desc: "Chopped mustard greens, flash-frozen for freshness." },

  // -------- Pau (bakery) --------
  { id: "pau-roti", name: "Pau Roti (6 pack)", brand: "Hamro Bakery", category: "pau",
    price: 3.99, emoji: "🥖", desc: "Soft Nepali dinner rolls, baked fresh daily." },
  { id: "sel-roti-mix", name: "Sel Roti Mix", brand: "Hamro Bakery", category: "pau",
    price: 5.99, emoji: "🍩", tag: "New", desc: "Ready-to-fry batter mix for traditional sel roti." },

  // -------- Tel (oil) --------
  { id: "mustard-oil", name: "Kachi Ghani Mustard Oil", brand: "Himalayan Harvest", category: "tel",
    price: 9.99, emoji: "🛢️", desc: "Cold-pressed mustard oil, 1 litre bottle." },
  { id: "sunflower-oil", name: "Sunflower Cooking Oil", brand: "Himalayan Harvest", category: "tel",
    price: 8.49, emoji: "🛢️", desc: "Light refined sunflower oil, 1 litre bottle." },

  // -------- Chhop (spice mixes) --------
  { id: "chhop-masala", name: "Chhop Masala Blend", brand: "Nepali Garden", category: "chhop",
    price: 4.49, emoji: "🌶️", desc: "House spice blend for pickled vegetable chhop." },
  { id: "timur-powder", name: "Timur (Sichuan Pepper) Powder", brand: "Nepali Garden", category: "chhop",
    price: 5.99, emoji: "🌶️", desc: "Ground Nepali timur pepper, sharp & aromatic." },

  // -------- Peetho (flour) --------
  { id: "makai-peetho", name: "Makai ko Peetho (Corn Flour)", brand: "Hamro Kitchen", category: "peetho",
    price: 4.99, emoji: "🌽", desc: "Stone-ground corn flour, 2 lb bag." },
  { id: "gahu-peetho", name: "Gahu ko Peetho (Wheat Flour)", brand: "Hamro Kitchen", category: "peetho",
    price: 4.49, emoji: "🌾", desc: "Whole wheat flour for roti & dhindo, 4 lb bag." },

  // -------- Chiya (tea) --------
  { id: "ilam-tea", name: "Ilam Orthodox Tea", brand: "Himalayan Harvest", category: "chiya",
    price: 7.99, emoji: "🍵", tag: "Best Seller", desc: "High-altitude Ilam leaf tea, rich aroma." },
  { id: "chiya-masala", name: "Chiya Masala", brand: "Himalayan Harvest", category: "chiya",
    price: 3.99, emoji: "🍵", desc: "Spice blend for authentic Nepali milk tea." },

  // -------- Kitabkhana (books) --------
  { id: "nepali-novel", name: "Selected Nepali Novel", brand: "Kitabkhana", category: "kitabkhana",
    price: 12.99, emoji: "📚", desc: "Popular contemporary Nepali fiction, paperback." },
  { id: "nepali-learn", name: "Learn Nepali Language Guide", brand: "Kitabkhana", category: "kitabkhana",
    price: 15.99, emoji: "📖", desc: "Beginner-friendly Nepali phrasebook & grammar guide." },

  // -------- Hand Made --------
  { id: "dhaka-topi", name: "Dhaka Topi", brand: "Hamro Handmade", category: "handmade",
    price: 19.99, emoji: "🎩", tag: "Handmade", desc: "Traditional hand-woven Nepali cap." },
  { id: "pashmina-shawl", name: "Pashmina Shawl", brand: "Hamro Handmade", category: "handmade",
    price: 39.99, emoji: "🧣", tag: "Handmade", desc: "Soft handwoven pashmina, made in Nepal." },
  { id: "copper-jug", name: "Handcrafted Copper Jug", brand: "Hamro Handmade", category: "handmade",
    price: 34.99, emoji: "🫖", desc: "Traditional embossed copper water jug." },
];

const CATEGORY_LABELS = {
  all: "All in One", pau: "Pau", chaamal: "Chaamal", sabji: "Sabji", chiura: "Chiura",
  khaja: "Khaja", tel: "Tel", chhop: "Chhop", peetho: "Peetho", achar: "Achar",
  chiya: "Chiya", kitabkhana: "Kitabkhana", handmade: "Hand Made",
};

let cartCount = 0;

function formatPrice(n) {
  return "$" + n.toFixed(2);
}

function renderProducts(filter) {
  const grid = document.getElementById("productGrid");
  const list = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);
  grid.innerHTML = "";

  const countEl = document.getElementById("resultCount");
  if (countEl) {
    countEl.textContent = `${list.length} item${list.length === 1 ? "" : "s"} in ${CATEGORY_LABELS[filter] || "All in One"}`;
  }

  if (list.length === 0) {
    grid.innerHTML = `<p class="empty-msg">No products in this category yet.</p>`;
    return;
  }

  list.forEach((p) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-media">
        <span class="product-emoji" aria-hidden="true">${p.emoji}</span>
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
      </div>
      <div class="product-body">
        <p class="product-brand">${p.brand}</p>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-footer">
          <div class="product-price">
            ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ""}
            <span class="price-now">${formatPrice(p.price)}</span>
          </div>
          <button class="btn-add" data-id="${p.id}" aria-label="Add ${p.name} to cart">Add</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function updateCartCount() {
  document.getElementById("cartCount").textContent = cartCount;
}

function initCategoryTabs() {
  const tabs = document.querySelectorAll(".category-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderProducts(tab.dataset.category);
      document.getElementById("shop").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initCartButtons() {
  document.getElementById("productGrid").addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-add");
    if (!btn) return;
    cartCount += 1;
    updateCartCount();
    btn.textContent = "Added ✓";
    btn.classList.add("added");
    setTimeout(() => {
      btn.textContent = "Add";
      btn.classList.remove("added");
    }, 900);
  });
}

function initTopBar() {
  const bar = document.getElementById("announcementBar");
  const closeBtn = document.getElementById("closeAnnouncement");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      bar.style.display = "none";
    });
  }
}

function initShopByCategoryIcons() {
  document.querySelectorAll(".sbc-item").forEach((item) => {
    item.addEventListener("click", () => {
      const cat = item.dataset.category;
      const tab = document.querySelector(`.category-tab[data-category="${cat}"]`);
      if (tab) tab.click();
    });
  });
}

function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    toggle.classList.toggle("open");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  renderProducts("all");
  initCategoryTabs();
  initCartButtons();
  initTopBar();
  initShopByCategoryIcons();
  initMobileNav();
});
