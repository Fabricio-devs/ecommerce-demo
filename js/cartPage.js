import { PRODUCTS } from "./products.js";
import { getCart, updateQty, removeFromCart, clearCart, formatARS, syncCartCount } from "./cart.js";

const tbody = document.getElementById("tbody");
const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping");
const totalEl = document.getElementById("total");
const clearBtn = document.getElementById("clear");
const goCheckout = document.getElementById("goCheckout");

function compute(cart) {
  const lines = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    return p ? { ...item, p } : null;
  }).filter(Boolean);

  const subtotal = lines.reduce((sum, l) => sum + (l.p.price * l.qty), 0);
  const shipping = subtotal > 0 ? 2500 : 0; // demo
  const total = subtotal + shipping;
  return { lines, subtotal, shipping, total };
}

function render() {
  syncCartCount();
  const cart = getCart();
  const { lines, subtotal, shipping, total } = compute(cart);

  if (!lines.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="small">Your cart is empty.</td></tr>`;
    goCheckout.classList.add("btn");
    goCheckout.classList.remove("primary");
    goCheckout.setAttribute("aria-disabled", "true");
    goCheckout.style.pointerEvents = "none";
  } else {
    goCheckout.classList.add("primary");
    goCheckout.style.pointerEvents = "auto";
    goCheckout.removeAttribute("aria-disabled");
    tbody.innerHTML = lines.map(l => `
      <tr>
        <td><a href="product.html?id=${l.p.id}">${l.p.title}</a><div class="small">${l.p.category}</div></td>
        <td>${formatARS(l.p.price)}</td>
        <td>
          <input class="input qty" type="number" min="1" value="${l.qty}" data-qty="${l.p.id}">
        </td>
        <td>${formatARS(l.p.price * l.qty)}</td>
        <td><button class="btn" data-remove="${l.p.id}">Remove</button></td>
      </tr>
    `).join("");
  }

  subtotalEl.textContent = formatARS(subtotal);
  shippingEl.textContent = formatARS(shipping);
  totalEl.textContent = formatARS(total);
}

tbody.addEventListener("input", (e) => {
  const input = e.target.closest("[data-qty]");
  if (!input) return;
  const id = Number(input.dataset.qty);
  updateQty(id, input.value);
  render();
});

tbody.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-remove]");
  if (!btn) return;
  const id = Number(btn.dataset.remove);
  removeFromCart(id);
  render();
});

clearBtn.addEventListener("click", () => {
  clearCart();
  render();
});

render();
