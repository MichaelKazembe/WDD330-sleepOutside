// CheckoutProcess.mjs
import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs"; //

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key; // localStorage key for cart items
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.orderTotal = 0;
  }

  // Initialize: load cart items and calculate subtotal
  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const subtotalEl = document.querySelector(
      `${this.outputSelector} #subtotal`,
    );
    const itemCountEl = document.querySelector(
      `${this.outputSelector} #item-count`,
    );
    if (subtotalEl) subtotalEl.innerText = `$${this.itemTotal.toFixed(2)}`;
    if (itemCountEl)
      itemCountEl.innerText = this.list.reduce(
        (count, item) => count + item.quantity,
        0,
      );
  }

  calculateOrderTotal() {
    const totalItems = this.list.reduce(
      (count, item) => count + item.quantity,
      0,
    );
    this.tax = this.itemTotal * 0.06;
    this.shipping = totalItems > 0 ? 10 + (totalItems - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const taxEl = document.querySelector(`${this.outputSelector} #tax`);
    const shippingEl = document.querySelector(
      `${this.outputSelector} #shipping`,
    );
    const orderTotalEl = document.querySelector(
      `${this.outputSelector} #order-total`,
    );
    if (taxEl) taxEl.innerText = `$${this.tax.toFixed(2)}`;
    if (shippingEl) shippingEl.innerText = `$${this.shipping.toFixed(2)}`;
    if (orderTotalEl) orderTotalEl.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  /**
   * Convert cart items from localStorage into the simplified form required by the backend
   */
  packageItems(items) {
    return items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));
  }

  /**
   * Handle checkout when form is submitted
   * @param {HTMLFormElement} form
   */
  async checkout(form) {
    try {
      event.preventDefault(); // Prevent default form submission

      // Convert form data to JSON object
      const formData = new FormData(form);
      const orderData = {};
      formData.forEach((value, key) => {
        orderData[key] = value;
      });

      // Add required fields
      orderData.orderDate = new Date().toISOString();
      orderData.items = this.packageItems(this.list);
      orderData.orderTotal = this.orderTotal.toFixed(2);
      orderData.tax = this.tax.toFixed(2);
      orderData.shipping = this.shipping;

      // Prepare fetch options
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      };

      // Send POST request
      const response = await fetch(
        "https://wdd330-backend.onrender.com:3000/checkout",
        options,
      );
      const result = await response.json();
      console.log("Checkout response:", result);
      return result;
    } catch (err) {
      console.error("Error during checkout:", err);
      return null;
    }
  }
}
