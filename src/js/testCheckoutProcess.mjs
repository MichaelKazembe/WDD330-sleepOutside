import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

class CheckoutProcess {
  constructor() {
    this.cartItems = getLocalStorage("so-cart") || [];
    this.subtotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.total = 0;
    this.init();
  }

  init() {
    this.calculateOrderSummary();
    this.renderOrderSummary();
    this.setupFormValidation();
  }

  // Calculate cart totals
  calculateOrderSummary() {
    // Calculate subtotal from cart items
    this.subtotal = this.cartItems.reduce((total, item) => {
      const quantity = item.quantity || 1;
      return total + item.FinalPrice * quantity;
    }, 0);

    // Calculate tax (6%)
    this.tax = this.subtotal * 0.06;

    // Calculate shipping (use $10 for the first item plus $2 for each additional item)
    const itemCount = this.cartItems.reduce((count, item) => count + (item.quantity || 1), 0);
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;

    // Calculate total
    this.total = this.subtotal + this.tax + this.shipping;
  }

  // Render order summary to DOM
  renderOrderSummary() {
    document.getElementById("subtotal").textContent =
      `$${this.subtotal.toFixed(2)}`;
    document.getElementById("tax").textContent = `$${this.tax.toFixed(2)}`;
    document.getElementById("shipping").textContent =
      `$${this.shipping.toFixed(2)}`;
    document.getElementById("order-total").textContent =
      `$${this.total.toFixed(2)}`;
  }

  // Setup form validation
  setupFormValidation() {
    const form = document.getElementById("checkout-form");
    const submitButton = form.querySelector(".checkout-btn");

    // Add event listeners for real-time validation
    const inputs = form.querySelectorAll("input[required]");
    inputs.forEach((input) => {
      input.addEventListener("input", () => this.validateForm());
      input.addEventListener("blur", () => this.validateField(input));
    });

    // Handle form submission
    form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Initial validation check
    this.validateForm();
  }

  // Validate individual field
  validateField(input) {
    const isValid = input.checkValidity();

    if (!isValid) {
      input.classList.add("error");
    } else {
      input.classList.remove("error");
    }

    return isValid;
  }

  // Validate entire form
  validateForm() {
    const form = document.getElementById("checkout-form");
    const submitButton = form.querySelector(".checkout-btn");
    const inputs = form.querySelectorAll("input[required]");

    let allValid = true;
    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        allValid = false;
      }
    });

    // Enable/disable submit button based on validation
    submitButton.disabled = !allValid;
    return allValid;
  }

  // Handle form submission
  handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      alert("Please fill out all required fields correctly.");
      return;
    }

    // Get form data
    const formData = new FormData(e.target);
    const orderData = {
      customer: {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
      },
      address: {
        street: formData.get("streetAddress"),
        city: formData.get("city"),
        state: formData.get("state"),
        zip: formData.get("zipCode"),
      },
      payment: {
        cardNumber: formData.get("cardNumber"),
        expiryDate: formData.get("expiryDate"),
        securityCode: formData.get("securityCode"),
      },
      order: {
        items: this.cartItems,
        subtotal: this.subtotal,
        tax: this.tax,
        shipping: this.shipping,
        total: this.total,
      },
    };

    // Simulate order processing
    this.processOrder(orderData);
  }

  // Process the order (simulation)
  processOrder(orderData) {
    // Show loading state
    const submitButton = document.querySelector(".checkout-btn");
    const originalText = submitButton.textContent;
    submitButton.textContent = "Processing...";
    submitButton.disabled = true;

    // Simulate API call delay
    setTimeout(() => {
      // Clear cart
      localStorage.removeItem("so-cart");

      // Show success message
      alert(
        `Thank you, ${orderData.customer.firstName}! Your order has been placed successfully. Order total: $${orderData.order.total.toFixed(2)}`,
      );

      // Redirect to home page
      window.location.href = "../index.html";
    }, 2000);
  }
}

// Initialize checkout process when page loads
document.addEventListener("DOMContentLoaded", () => {
  new CheckoutProcess();
});
