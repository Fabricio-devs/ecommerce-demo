const CART_KEY = "demo_cart_v1";

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

export function addToCart(productId, qty = 1) {
  const cart = getCart();
  const found = cart.find(i => i.id === productId);
  if (found) found.qty += qty;
  else cart.push({ id: productId, qty });
  saveCart(cart);
}

export function updateQty(productId, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty = Math.max(1, Number(qty) || 1);
  saveCart(cart);
}

export function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}

export function formatARS(value) {
  // Argentina formatting (simple)
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);
}

export function syncCartCount() {
  const el = document.getElementById("cartCount");
  if (el) el.textContent = String(getCartCount());
}
