/* ===========================================================
   Hamro Pasal — storefront interactivity
   Products come from GET /api/products (server-side catalog).
   Checkout hands the cart to POST /api/create-checkout-session,
   which returns a Stripe-hosted payment page URL to redirect to.
   =========================================================== */

const CATEGORY_LABELS = {
  all: "All in One", pau: "Pau", chaamal: "Chaamal", sabji: "Sabji", chiura: "Chiura",
  khaja: "Khaja", tel: "Tel", chhop: "Chhop", peetho: "Peetho", achar: "Achar",
  chiya: "Chiya", kitabkhana: "Kitabkhana", handmade: "Hand Made",
};

let PRODUCTS = [];
let currentFilter = "all";

function formatPrice(cents) {
  return "$" + (cents / 100).toFixed(2);
}

async function loadProducts() {
  const grid = document.getElementById("productGrid");
  try {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("Failed to load products");
    PRODUCTS = await res.json();
  } catch (err) {
    grid.innerHTML = `<p class="empty-msg">Couldn't load products. Is the server running? (${err.message})</p>`;
    return;
  }
  renderProducts(currentFilter);
}

function renderProducts(filter) {
  currentFilter = filter;
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

function initAddToCartButtons() {
  document.getElementById("productGrid").addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-add");
    if (!btn) return;
    addToCart(btn.dataset.id, 1);
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

/* ---------------- Cart drawer ---------------- */

function renderCartDrawer() {
  const body = document.getElementById("cartDrawerBody");
  const footer = document.getElementById("cartDrawerFooter");
  const cart = getCart();
  const entries = Object.entries(cart);

  if (entries.length === 0) {
    body.innerHTML = `<p class="empty-msg">Your cart is empty.</p>`;
    footer.hidden = true;
    return;
  }

  let total = 0;
  body.innerHTML = entries
    .map(([id, qty]) => {
      const p = PRODUCTS.find((prod) => prod.id === id);
      if (!p) return "";
      total += p.price * qty;
      return `
        <div class="cart-line" data-id="${id}">
          <span class="cart-line-emoji">${p.emoji}</span>
          <div class="cart-line-info">
            <p class="cart-line-name">${p.name}</p>
            <p class="cart-line-price">${formatPrice(p.price)} each</p>
          </div>
          <div class="cart-line-qty">
            <button class="qty-btn" data-action="dec" data-id="${id}" aria-label="Decrease quantity">−</button>
            <span>${qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${id}" aria-label="Increase quantity">+</button>
          </div>
          <button class="cart-line-remove" data-action="remove" data-id="${id}" aria-label="Remove item">🗑</button>
        </div>
      `;
    })
    .join("");

  footer.hidden = false;
  document.getElementById("cartTotal").textContent = formatPrice(total);
}

function openCartDrawer() {
  renderCartDrawer();
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
}

function closeCartDrawer() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
}

function initCartDrawer() {
  document.querySelector(".icon-btn[aria-label='Cart']")?.addEventListener("click", openCartDrawer);
  document.getElementById("cartCloseBtn").addEventListener("click", closeCartDrawer);
  document.getElementById("cartOverlay").addEventListener("click", closeCartDrawer);

  document.getElementById("cartDrawerBody").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = btn.dataset.id;
    const cart = getCart();
    const current = cart[id] || 0;

    if (btn.dataset.action === "inc") setCartQty(id, current + 1);
    if (btn.dataset.action === "dec") setCartQty(id, current - 1);
    if (btn.dataset.action === "remove") removeFromCart(id);

    renderCartDrawer();
  });

  document.getElementById("checkoutBtn").addEventListener("click", startCheckout);
}

async function startCheckout() {
  const cart = getCart();
  const items = Object.entries(cart).map(([id, qty]) => ({ id, qty }));
  if (items.length === 0) return;

  const btn = document.getElementById("checkoutBtn");
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Redirecting to secure checkout…";

  try {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Checkout failed.");

    window.location.href = data.url; // Stripe-hosted payment page
  } catch (err) {
    alert(err.message);
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  loadProducts();
  initCategoryTabs();
  initAddToCartButtons();
  initTopBar();
  initShopByCategoryIcons();
  initMobileNav();
  initCartDrawer();
  renderCartBadge();
});
