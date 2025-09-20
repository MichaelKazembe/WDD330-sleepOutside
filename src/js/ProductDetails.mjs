import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import Alert from "./alert.js";
const alert = new Alert();

// ProductDetails class manages displaying a product's details and adding it to the cart
export default class ProductDetails {
  // Constructor sets up the productId, a placeholder for product data, and the data source
  constructor(productId, dataSource) {
    this.productId = productId; // The ID of the product to display
    this.product = {}; // Will hold the product details once loaded
    this.dataSource = dataSource; // Data source to fetch product info
  }

  // Initializes the product details: fetches product data and renders it
  async init() {
    const product = await this.dataSource.findProductById(this.productId); // Fetch product by ID
    this.product = product; // Store product details for later use
    this.renderProductDetails(); // Render the product details to the page
    // Set up event listener for the Add to Cart button
    const addToCartButton = document.getElementById("addToCart");
    if (addToCartButton) {
      addToCartButton.addEventListener(
        "click",
        this.addProductToCart.bind(this),
      );
    }
  }

  // Adds the current product to the shopping cart in localStorage
  addProductToCart() {
    let cartItems = getLocalStorage("so-cart"); // Get cart array from local storage
    // If cart is empty or not an array, start with an empty array
    if (!Array.isArray(cartItems)) {
      cartItems = [];
    }
    cartItems.push(this.product); // Add the current product to the cart
    setLocalStorage("so-cart", cartItems); // Save updated cart back to local storage
    // Show Success alert
    alert.show(`${this.product.Name} was added to your cart!`, "success");
  }

  // Renders the product details using a template function
  renderProductDetails() {
    ProductDetailsTemplate(this.product); // Call the template to update the HTML
  }
}

// Template function to render product details into the page
function ProductDetailsTemplate(product) {
  const productDetailsElement = document.querySelector(".product-detail"); // Find the container for product details
  if (!productDetailsElement) return; // If not found, do nothing

  // Fill the container with product info and an Add to Cart button
  productDetailsElement.innerHTML = `
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img
      class="divider"
      src="${product.Image}"
      alt="${product.Name}"
      loading="lazy"
    />
    <p class="product-card__price">$${product.ListPrice}</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">
      ${product.DescriptionHtmlSimple}</p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
    `;
}
