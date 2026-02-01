import { PRODUCTS } from "./products.js";
import { addToCart, formatARS, syncCartCount } from "./cart.js";

const grid = document.getElementById("grid");
const qEl = document.getElementById("q");
const catEl = document.getElementById("cat");
const sortEl = document.getElementById("sort");

function getParams() {
  const url = new URL(location.href);
  return {
    q: (url.searchParams.get("q") || "").trim(),
    cat: (url.searchParams.get("cat") || "").trim(),
  };
}

function setParams({ q, cat }) {
  const url = new URL(location.href);
  if (q) url.searchParams.set("q", q); else url.searchParams.delete("q");
  if (cat) url.searchParams.set("cat", cat); else url.searchParams.delete("cat");
  history.replaceState({}, "", url.toString());
}

function renderCategories() {
  const cats = [...new Set(PRODUCTS.map(p => p.category))].sort();
  catEl.innerHTML = `<option value="">All categories</option>` + cats.map(c => `<option value="${c}">${c}</option>`).join("");
}

function applyFilters(list) {
  const q = qEl.value.trim().toLowerCase();
  const cat = catEl.value.trim();

  let out = list.filter(p => {
    const matchQ = !q || p.title.toLowerCase().includes(q);
    const matchCat = !cat || p.category === cat;
    return matchQ && matchCat;
  });

  const sort = sortEl.value;
  if (sort === "price_asc") out.sort((a,b) => a.price - b.price);
  if (sort === "price_desc") out.sort((a,b) => b.price - a.price);
  if (sort === "title_asc") out.sort((a,b) => a.title.localeCompare(b.title));

  return out;
}

function card(p) {
  return `
  <article class="card">
    <a href="product.html?id=${p.id}">
      <div class="img">${p.image?.includes(".") ? "Image" : "Product"}</div>
    </a>
    <div class="body">
      <p class="title">${p.title}</p>
      <div class="meta">
        <span>${p.category}</span>
        <span>${formatARS(p.price)}</span>
      </div>
      <div class="actions">
        <a class="btn" href="product.html?id=${p.id}">Details</a>
        <button class="btn primary" data-add="${p.id}">Add to cart</button>
      </div>
    </div>
  </article>`;
}

function render() {
  const filtered = applyFilters([...PRODUCTS]);
  if (!filtered.length) {
    grid.innerHTML = `<div class="panel">No results.</div>`;
    return;
  }
  grid.innerHTML = filtered.map(card).join("");
}

function initFromQueryString() {
  const { q, cat } = getParams();
  qEl.value = q;
  catEl.value = cat;
}

function wire() {
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    const id = Number(btn.dataset.add);
    addToCart(id, 1);
    syncCartCount();
    btn.textContent = "Added";
    setTimeout(() => (btn.textContent = "Add to cart"), 700);
  });

  const onChange = () => {
    setParams({ q: qEl.value.trim(), cat: catEl.value.trim() });
    render();
  };

  qEl.addEventListener("input", onChange);
  catEl.addEventListener("change", onChange);
  sortEl.addEventListener("change", render);
}

renderCategories();
initFromQueryString();
syncCartCount();
wire();
render();
