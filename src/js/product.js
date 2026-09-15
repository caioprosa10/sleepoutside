import ProductData from "./ProductData.mjs";
import ProductDetails from "./productDetail.mjs";
import { getParam } from "./utils.mjs";

// grab the product id that was passed in the URL (?product=ID)
const productId = getParam("product");

const dataSource = new ProductData();
const product = new ProductDetails(productId, dataSource);
product.init();
