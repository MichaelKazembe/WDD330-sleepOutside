import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const dataSource = new ProductData("tents");
const category = "tents";
const listElement = document.querySelector(".product-list");

const productList = new ProductList(category, dataSource, listElement);
productList.init();
