import { loadHeaderFooter, updateCartCount } from "./utils.mjs";
import CheckoutProcess from "./checkoutProcess.mjs";

// Load header/footer first, then initialize cart count
loadHeaderFooter().then(() => {
  updateCartCount();
});

// Initialize checkout process when page loads
document.addEventListener("DOMContentLoaded", () => {
  const checkout = new CheckoutProcess("so-cart", ".order-summary");
  checkout.init();
  checkout.bindEvents();
});
