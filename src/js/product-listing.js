import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

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

// Search Product Function
if (search) {
  // If search query exists → search API
  productList = new ProductList("search", dataSource, listElement);
  dataSource.searchProducts(search).then((data) => {
    productList.renderList(data);
  });
} else if (category) {
  // Else load by category
  productList = new ProductList(category, dataSource, listElement);
  productList.init();
}
