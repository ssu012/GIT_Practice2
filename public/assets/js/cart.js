/* ===========================================================
   Hamro Pasal — cart (client-side, per-browser via localStorage)
   Stores only { productId: quantity }. Prices are never stored
   here — the server looks them up fresh at checkout time.
   =========================================================== */

const CART_KEY = "hamro_pasal_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    /* localStorage unavailable (private mode, etc.) — cart just won't persist */
  }
}

function addToCart(id, qty = 1) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + qty;
  saveCart(cart);
  renderCartBadge();
}

function setCartQty(id, qty) {
  const cart = getCart();
  if (qty <= 0) delete cart[id];
  else cart[id] = qty;
  saveCart(cart);
  renderCartBadge();
}

function removeFromCart(id) {
  const cart = getCart();
  delete cart[id];
  saveCart(cart);
  renderCartBadge();
}

function cartItemCount() {
  return Object.values(getCart()).reduce((sum, qty) => sum + qty, 0);
}

function renderCartBadge() {
  const el = document.getElementById("cartCount");
  if (el) el.textContent = cartItemCount();
}
