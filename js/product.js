import { PRODUCTS } from "./products.js";
import { addToCart, formatARS, syncCartCount } from "./cart.js";

function getId() {
  const url = new URL(location.href);
  return Number(url.searchParams.get("id"));
}

const id = getId();
const p = PRODUCTS.find(x => x.id === id);

const titleEl = document.getElementById("title");
const descEl = document.getElementById("desc");
const catEl = document.getElementById("cat");
const priceEl = document.getElementById("price");
const crumbEl = document.getElementById("crumb");
const qtyEl = document.getElementById("qty");
const addBtn = document.getElementById("add");

syncCartCount();

if (!p) {
  titleEl.textContent = "Product not found";
  descEl.textContent = "Go back to the shop and choose a product.";
  addBtn.disabled = true;
} else {
  titleEl.textContent = p.title;
  descEl.textContent = p.desc;
  catEl.textContent = p.category;
  priceEl.textContent = formatARS(p.price);
  crumbEl.textContent = `Shop / ${p.category} / #${p.id}`;

  addBtn.addEventListener("click", () => {
    const qty = Math.max(1, Number(qtyEl.value) || 1);
    addToCart(p.id, qty);
    syncCartCount();
    addBtn.textContent = "Added!";
    setTimeout(() => (addBtn.textContent = "Add to cart"), 800);
  });
}
