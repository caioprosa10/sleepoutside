import {
  renderListWithTemplate,
  getDiscountPercent,
  formatPrice,
} from "./utils.mjs";

// template for a single product card in the list
function productCardTemplate(product) {
  const discount = getDiscountPercent(product);
  const priceHtml = discount
    ? `<span class="price--original">${formatPrice(product.SuggestedRetailPrice)}</span>
       <span class="price--final">${formatPrice(product.FinalPrice)}</span>`
    : formatPrice(product.FinalPrice);
  const badgeHtml = discount
    ? `<span class="discount-badge discount-badge--card">${discount}% OFF</span>`
    : "";
  return `<li class="product-card">
    ${badgeHtml}
    <a href="../product_pages/index.html?product=${product.Id}">
      <img
        src="${product.Images.PrimaryMedium}"
        alt="${product.Name}"
      />
      <h3 class="card__brand">${product.Brand?.Name ?? ""}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">${priceHtml}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    // get the list of products for this category from the data source
    const list = await this.dataSource.getData(this.category);
    // render the list into the page
    this.renderList(list);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
