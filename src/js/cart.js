import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  // support both a single stored product object and an array of products
  const items = Array.isArray(cartItems)
    ? cartItems
    : cartItems
      ? [cartItems]
      : [];
  if (items.length === 0) return;
  const htmlItems = items.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  // support both the old local-JSON shape (item.Image) and the API shape (item.Images.PrimaryMedium)
  const image = item.Images?.PrimaryMedium ?? item.Image ?? "";
  const colorName = item.Colors?.[0]?.ColorName ?? "";
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${colorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

// only render if there is something in the cart to avoid a crash on an empty cart
if (getLocalStorage("so-cart")) {
  renderCartContents();
}
