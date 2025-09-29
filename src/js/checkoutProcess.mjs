import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSummary();
  }

  calculateItemSubTotal() {
    // calculate and display the total dollar amount of the items in the cart, and the number of items.
    this.itemTotal = this.list.reduce((total, item) => {
      const quantity = item.quantity || 1;
      return total + item.FinalPrice * quantity;
    }, 0);
  }

  calculateItemSummary() {
    // calculate subtotal and then calculate order totals
    this.calculateItemSubTotal();
    this.calculateOrderTotal();
  }

  calculateOrderTotal() {
    // calculate the tax and shipping amounts. Add those to the cart total to figure out the order total
    this.tax = this.itemTotal * 0.06;
    // Count total items in cart
    const itemCount = this.list.reduce(
      (count, item) => count + (item.quantity || 1),
      0,
    );
    // shipping is $10 for the first item and $2 for each additional item
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    // Calculate order total
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    // display the totals.
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    // once the totals are all calculated display them in the order summary page
    const subtotal = document.querySelector(`${this.outputSelector} #subtotal`);
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(
      `${this.outputSelector} #order-total`,
    );

    if (subtotal) subtotal.innerText = `$${this.itemTotal.toFixed(2)}`;
    if (tax) tax.innerText = `$${this.tax.toFixed(2)}`;
    if (shipping) shipping.innerText = `$${this.shipping.toFixed(2)}`;
    if (orderTotal) orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
  }
}

// Initialize checkout process when page loads
document.addEventListener("DOMContentLoaded", () => {
  const checkout = new CheckoutProcess("so-cart", ".order-summary");
  checkout.init();
});
