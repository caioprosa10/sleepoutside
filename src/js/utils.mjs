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
