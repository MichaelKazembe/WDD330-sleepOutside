// ProductList.mjs
// This class will fetch product data and render it into HTML cards.

import { renderListWithTemplate } from "./utils.mjs";

// Function to create an HTML card for each product dynamically
function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="product_pages/?product=${product.Id}">
        <!-- Product Image -->
        <img src="${product.Image}" alt="Image of ${product.Name}">
        
        <!-- Product Brand -->
        <h2 class="card__brand">${product.Brand}</h2>
        
        <!-- Product Name -->
        <h3 class="card__name">${product.Name}</h3>
        
        <!-- Product Price -->
        <p class="product-card__price">$${product.Price.toFixed(2)}</p>
      </a>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    // Store the category name (like "tents") for reference
    this.category = category;

    // The dataSource is an instance of ProductData (handles fetching JSON)
    this.dataSource = dataSource;

    // The listElement is the DOM element where the products will be displayed
    this.listElement = listElement;
  }

  // Initialize the product list: fetch the data and render it
  async init() {
    // Wait for the dataSource to return the array of products
    const list = await this.dataSource.getData(this.category);

    // Call the reusable render function
    this.renderList(list);
  }

  // Render an array of products to the page
  renderList(list) {
    // Use the reusable utility function
    renderListWithTemplate(
      productCardTemplate, // template function
      this.listElement, // parent element
      list, // array of products
      "afterbegin", // insert position
      true, // clear before inserting
    );
  }
}
