// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// get a parameter value from the query string of the current URL
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// render a list of items into a parent element using a template function
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = true,
) {
  const htmlStrings = list.map(templateFn);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// briefly animate the cart (backpack) icon in the header
export function animateCartIcon() {
  const cart = qs(".cart");
  if (!cart) return;
  // restart the animation even if it is still running from a previous click
  cart.classList.remove("cart--bounce");
  void cart.offsetWidth;
  cart.classList.add("cart--bounce");
  cart.addEventListener(
    "animationend",
    () => cart.classList.remove("cart--bounce"),
    { once: true },
  );
}

// ---------- Cart helpers ----------
const CART_KEY = "so-cart";

// always return the cart as an array (older code saved a single object)
export function getCartItems() {
  const stored = getLocalStorage(CART_KEY);
  if (!stored) return [];
  const items = Array.isArray(stored) ? stored : [stored];
  // make sure every item has a quantity
  return items.map((item) => ({ ...item, Quantity: item.Quantity ?? 1 }));
}

export function saveCartItems(items) {
  setLocalStorage(CART_KEY, items);
}

// add a product to the cart; if it is already there, increase its quantity
export function addToCart(product) {
  const items = getCartItems();
  const existing = items.find((item) => item.Id === product.Id);
  if (existing) {
    existing.Quantity += 1;
  } else {
    items.push({ ...product, Quantity: 1 });
  }
  saveCartItems(items);
  updateCartCount();
}

// remove a product (all of its quantity) from the cart by id
export function removeFromCart(productId) {
  const items = getCartItems().filter((item) => item.Id !== productId);
  saveCartItems(items);
  updateCartCount();
  return items;
}

// total number of items in the cart (sums quantities)
export function getCartCount() {
  return getCartItems().reduce((sum, item) => sum + item.Quantity, 0);
}

// total price of everything in the cart
export function getCartTotal(items = getCartItems()) {
  return items.reduce((sum, item) => sum + item.FinalPrice * item.Quantity, 0);
}

// show a superscript number on the backpack icon with the item count
export function updateCartCount() {
  const cart = qs(".cart");
  if (!cart) return;
  let badge = qs(".cart-count", cart);
  if (!badge) {
    badge = document.createElement("span");
    badge.className = "cart-count";
    badge.setAttribute("aria-live", "polite");
    cart.appendChild(badge);
  }
  const count = getCartCount();
  badge.textContent = count;
  badge.setAttribute(
    "aria-label",
    `${count} ${count === 1 ? "item" : "items"} in cart`,
  );
  badge.hidden = count === 0;
}

// ---------- Discount helpers ----------
// returns the discount percentage (0 when there is no discount)
export function getDiscountPercent(product) {
  const retail = Number(product.SuggestedRetailPrice);
  const final = Number(product.FinalPrice);
  if (!retail || !final || final >= retail) return 0;
  return Math.round(((retail - final) / retail) * 100);
}

// format a number as US dollars
export function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}
