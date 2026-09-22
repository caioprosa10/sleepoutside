import {
  addToCart,
  animateCartIcon,
  getDiscountPercent,
  formatPrice,
} from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = {};
  }

  async init() {
    // query the API directly for this product based on the id parameter
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    // add listener to the Add to Cart button once the product is loaded
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    addToCart(this.product);
    animateCartIcon();
  }

  renderProductDetails() {
    const product = this.product;
    document.getElementById("productBrand").textContent =
      product.Brand?.Name ?? "";
    document.getElementById("productName").textContent = product.NameWithoutBrand;

    const image = document.getElementById("productImage");
    // use the PrimaryLarge image for the product detail view
    image.src = product.Images.PrimaryLarge;
    image.alt = product.Name;

    // show the discount (original price crossed out + % off badge)
    const priceElement = document.getElementById("productFinalPrice");
    const discount = getDiscountPercent(product);
    priceElement.innerHTML = discount
      ? `<span class="discount-badge">${discount}% OFF</span>
         <span class="price--original">${formatPrice(product.SuggestedRetailPrice)}</span>
         <span class="price--final">${formatPrice(product.FinalPrice)}</span>`
      : formatPrice(product.FinalPrice);
    document.getElementById("productColorName").textContent =
      product.Colors?.[0]?.ColorName ?? "";
    document.getElementById("productDesc").innerHTML =
      product.DescriptionHtmlSimple ?? "";

    const addButton = document.getElementById("addToCart");
    addButton.dataset.id = product.Id;
    addButton.textContent = "Add to Cart";
  }
}
