// src/ShoppingCart.mjs
import { renderWithTemplate, loadTemplate } from "./utils.mjs";

export default class ShoppingCart {
  constructor(key, parentSelector) {
    this.key = key; // localStorage key where cart is saved
    this.parentElement = document.querySelector(parentSelector);
  }

  // Retrieve cart items from localStorage
  getCartItems() {
    const items = JSON.parse(localStorage.getItem(this.key)) || [];
    return items;
  }

  // Save updated cart back to localStorage
  saveCartItems(items) {
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  // Remove an item from the cart by id
  removeItem(id) {
    const items = this.getCartItems().filter((item) => item.Id !== id);
    this.saveCartItems(items);
    this.renderCartList();
  }

  // Calculate total price
  calculateTotal(items) {
    return items
      .reduce((total, item) => total + (item.FinalPrice || 0), 0)
      .toFixed(2);
  }

  // Render cart list
  async renderCartList() {
    const template = await loadTemplate("../partials/cartItem.html"); // template for each item
    const items = this.getCartItems();

    this.parentElement.innerHTML = ""; // clear cart

    if (items.length === 0) {
      this.parentElement.innerHTML = `<p>Your cart is empty.</p>`;
      return;
    }

    items.forEach((item) => {
      renderWithTemplate(template, this.parentElement, item, (data) => {
        // Example callback: attach event listener for remove button
        const removeBtn = this.parentElement.querySelector(
          `#remove-${data.Id}`,
        );
        if (removeBtn) {
          removeBtn.addEventListener("click", () => this.removeItem(data.Id));
        }
      });
    });

    // Render cart total
    const totalElement = document.querySelector("#cart-total");
    if (totalElement) {
      totalElement.textContent = `$${this.calculateTotal(items)}`;
    }
  }
}
