// src/js/product-listing.js
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

// Load header and footer
loadHeaderFooter();

// Get category from query string (?category=tents)
const category = getParam("category") || "tents";

// Grab the list container
const listElement = document.querySelector(".product-list");

// Setup ProductData and ProductList
const dataSource = new ProductData(category);
const productList = new ProductList(category, dataSource, listElement);

// Initialize product listing
productList.init();
