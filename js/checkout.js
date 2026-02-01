import { PRODUCTS } from "./products.js";
import { getCart, getCartCount, clearCart, formatARS, syncCartCount } from "./cart.js";

const itemsEl = document.getElementById("items");
const totalEl = document.getElementById("total");
const form = document.getElementById("form");
const ok = document.getElementById("ok");

function computeTotal() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => {
    const p = PRODUCTS.find(x => x.id === item.id);
    return p ? sum + p.price * item.qty : sum;
  }, 0);
  const shipping = subtotal > 0 ? 2500 : 0;
  return subtotal + shipping;
}

function render() {
  syncCartCount();
  itemsEl.textContent = String(getCartCount());
  totalEl.textContent = formatARS(computeTotal());
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (getCartCount() === 0) return;

  // Demo "order"
  clearCart();
  syncCartCount();
  ok.style.display = "block";
  form.reset();
  render();
});

render();
