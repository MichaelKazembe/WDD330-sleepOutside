// main.js
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

//  Create an instance of ProductData
const dataSource = new ProductData();

// Get all products
const productListData = dataSource.getProducts();

//  Create a ProductList instance (pass data + target list container ID)
const productList = new ProductList(dataSource);

// Render the products on the page
productList.renderList(productListData);
