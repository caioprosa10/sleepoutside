import {
  getCartItems,
  removeFromCart,
  getCartTotal,
  updateCartCount,
  formatPrice,
  qs,
} from "./utils.mjs";

function cartItemTemplate(item) {
  // support both the old local-JSON shape (item.Image) and the API shape (item.Images.PrimaryMedium)
  const image = item.Images?.PrimaryMedium ?? item.Image ?? "";
  const colorName = item.Colors?.[0]?.ColorName ?? "";
  const link = `/product_pages/index.html?product=${item.Id}`;
  return `<li class="cart-card divider">
  <button class="cart-card__remove" data-id="${item.Id}" aria-label="Remove ${item.Name} from cart" title="Remove">&times;</button>
  <a href="${link}" class="cart-card__image">
    <img src="${image}" alt="${item.Name}" />
  </a>
  <a href="${link}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${colorName}</p>
  <p class="cart-card__quantity">qty: ${item.Quantity}</p>
  <p class="cart-card__price">${formatPrice(item.FinalPrice * item.Quantity)}</p>
</li>`;
}

// show the cart total in the footer, or hide it when the cart is empty
function renderCartTotal(items) {
  const footer = qs(".cart-footer");
  const empty = qs(".cart-empty");
  if (items.length === 0) {
    footer.classList.add("hide");
    empty.hidden = false;
    return;
  }
  qs("#cartTotal").textContent = formatPrice(getCartTotal(items));
  footer.classList.remove("hide");
  empty.hidden = true;
}

function renderCartContents() {
  const items = getCartItems();
  const listElement = qs(".product-list");
  listElement.innerHTML = items.map(cartItemTemplate).join("");
  renderCartTotal(items);
  updateCartCount();
}

// one listener on the list handles every remove button (event delegation)
qs(".product-list").addEventListener("click", (event) => {
  const button = event.target.closest(".cart-card__remove");
  if (!button) return;
  removeFromCart(button.dataset.id);
  renderCartContents();
});

renderCartContents();
