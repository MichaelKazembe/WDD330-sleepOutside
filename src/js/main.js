// main.js
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "../js/alert.js";
// Get all products
const productListData = dataSource.getProducts();
// Render the products on the page
productList.renderList(productListData);

// Load alerts from JSON
const alertSystem = new Alert("../json/alert.json");
alertSystem.loadAlerts();

loadHeaderFooter();

if (document.querySelector("#product-list")) {
  const products = new ProductList("tents", "#product-list");
  products.init();
}

const dataSource = new ProductData("tents");
const category = "tents";
const listElement = document.querySelector(".product-list");

const productList = new ProductList(category, dataSource, listElement);
productList.init();
