import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import Alert from "./alert.js";

// Load header/footer first, then initialize cart count
loadHeaderFooter().then(() => {
  updateCartCount();
});

// Helper to get cart items as a map of productId to item with quantity
function getCartMap() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartMap = new Map();
  cartItems.forEach((item) => {
    if (cartMap.has(item.Id)) {
      cartMap.get(item.Id).quantity += item.quantity || 1;
    } else {
      cartMap.set(item.Id, { ...item, quantity: item.quantity || 1 });
    }
  });
  return cartMap;
}

// Function to render the contents of the cart from localStorage
function renderCartContents() {
  const cartMap = getCartMap();
  const htmlItems = Array.from(cartMap.values()).map((item) =>
    cartItemTemplate(item),
  );
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

// Function to create HTML for a single cart item
function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="../product_pages/?product=${item.Id}" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="../product_pages/?product=${item.Id}" class="cart-card__details">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${item.quantity}</p>
  <p class="cart-card__price">$${(item.FinalPrice * item.quantity).toFixed(2)}</p>
</li>`;
  return newItem;
}

// Function to update the cart total
function updateCartTotal() {
  const cartMap = getCartMap();
  let totalCartItems = 0;
  let totalQuantity = 0;
  cartMap.forEach((item) => {
    totalCartItems += item.FinalPrice * item.quantity;
    totalQuantity += item.quantity;
  });
  if (cartMap.size > 0) {
    document.querySelector(".cart__total").textContent =
      `Total: $${totalCartItems.toFixed(2)} (${totalQuantity} items)`;
    document.querySelector(".cart-footer").classList.remove("hide");
  } else {
    document.querySelector(".cart-footer").classList.add("hide");
  }
}

renderCartContents();
updateCartTotal();

// Initialize alert system
const alert = new Alert("#alert-container");

// Example: show an alert when cart loads
alert.show("Welcome to your cart!", "info");

// Patch: When adding to cart, increment quantity if product exists
export function addProductToCart(product) {
  let cartItems = getLocalStorage("so-cart") || [];
  let found = false;
  cartItems = cartItems.map((item) => {
    if (item.Id === product.Id) {
      found = true;
      return { ...item, quantity: (item.quantity || 1) + 1 };
    }
    return item;
  });
  if (!found) {
    cartItems.push({ ...product, quantity: 1 });
  }
  setLocalStorage("so-cart", cartItems);

  // Update cart count in header
  updateCartCount();
}
