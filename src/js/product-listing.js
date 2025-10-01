import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam, updateCartCount } from "./utils.mjs";

// Load header/footer first, then initialize cart count
loadHeaderFooter().then(() => {
  updateCartCount();
});

const category = getParam("category");
const dataSource = new ExternalServices();
const listElement = document.querySelector(".product-list");

// Set the page title to include the category
const titleElement = document.querySelector(".products h2");
if (titleElement && category) {
  titleElement.textContent = `Top Products: ${category.charAt(0).toUpperCase() + category.slice(1)}`;
}

const productList = new ProductList(category, dataSource, listElement);
productList.init();
