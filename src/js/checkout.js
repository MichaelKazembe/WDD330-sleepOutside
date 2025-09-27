import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

const checkout = new CheckoutProcess("cart", "#order-summary");
checkout.init();
checkout.calculateOrderTotal();

const form = document.querySelector("#checkoutForm");
form.addEventListener("submit", (e) => {
  e.preventDefault(); // stop browser from submitting
  checkout.checkout(form); // JS handles sending data via fetch
});

loadHeaderFooter();
