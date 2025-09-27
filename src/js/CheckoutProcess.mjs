// CheckoutProcess.mjs
import { getLocalStorage } from "./utils.mjs"; // Make sure you have a helper to get items from localStorage

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key; // localStorage key for cart items
    this.outputSelector = outputSelector; // selector for the order summary container
    this.list = [];
    this.itemTotal = 0; // subtotal
    this.tax = 0;
    this.shipping = 0;
    this.orderTotal = 0;
  }

  // Initialize: load cart items and calculate subtotal
  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  // Calculate subtotal based on cart items
  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    // Display subtotal and number of items
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

  // Calculate tax, shipping, and total (call after zip code is entered)
  calculateOrderTotal() {
    const totalItems = this.list.reduce(
      (count, item) => count + item.quantity,
      0,
    );

    // Tax: 6% of subtotal
    this.tax = this.itemTotal * 0.06;

    // Shipping: $10 for first item + $2 for each additional item
    if (totalItems > 0) {
      this.shipping = 10 + (totalItems - 1) * 2;
    } else {
      this.shipping = 0;
    }

    // Order total
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    // Display all totals
    this.displayOrderTotals();
  }

  // Display all values in the order summary
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
}
