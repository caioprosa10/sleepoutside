import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam } from "./utils.mjs";

// read the category that was passed in the URL (tents, backpacks, sleeping-bags, hammocks)
const category = getParam("category");

// first create an instance of the ProductData class.
const dataSource = new ProductData();
// then get the element you want the product list to render in
const listElement = document.querySelector(".product-list");
// then create an instance of the ProductList class and send it the correct information.
const myList = new ProductList(category, dataSource, listElement);
// finally call the init method to show the products
myList.init();

// update the page title to include the selected category, e.g. "Top Products: Sleeping Bags"
function prettyCategory(value) {
  if (!value) return "";
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const titleElement = document.querySelector(".products__title");
if (category && titleElement) {
  titleElement.textContent = `Top Products: ${prettyCategory(category)}`;
}
