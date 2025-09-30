import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  // convert the form data to a JSON object
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  // takes the items currently stored in the cart (localstorage) and returns them in a simplified form.
  // convert the list of products from localStorage to the simpler form required for the checkout process.
  const simplifiedItems = items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.quantity || 1,
  }));
  return simplifiedItems;
}

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

  async checkout(form) {
    // get the form element data by the form name
    const json = formDataToJSON(form);

    // convert the form data to a JSON order object using the formDataToJSON function
    // populate the JSON order object with the order Date, orderTotal, tax, shipping, and list of items
    const order = {
      orderDate: new Date().toISOString(),
      fname: json.fname,
      lname: json.lname,
      street: json.street,
      city: json.city,
      state: json.state,
      zip: json.zip,
      cardNumber: json.cardNumber,
      expiration: json.expiration,
      code: json.code,
      items: packageItems(this.list),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2),
    };

    // call the checkout method in the ExternalServices module and send it the JSON order data.
    return await services.checkout(order);
  }

  bindEvents() {
    // Setup expiry date formatting
    this.setupExpiryDateFormatting();

    // Handle form submission
    this.setupFormSubmission();
  }

  setupExpiryDateFormatting() {
    const expiryInput = document.getElementById("expiry-date");
    if (expiryInput) {
      expiryInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, ""); // Remove non-digits

        if (value.length >= 2) {
          value = value.substring(0, 2) + "/" + value.substring(2, 4);
        }

        e.target.value = value;
      });

      expiryInput.addEventListener("blur", (e) => {
        this.validateExpiryDate(e.target);
      });
    }
  }

  validateExpiryDate(input) {
    const value = input.value;
    const pattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;

    if (value && !pattern.test(value)) {
      input.setCustomValidity("Please enter a valid date in MM/YY format");
      return false;
    } else if (value) {
      // Check if date is not in the past
      const [month, year] = value.split("/");
      const fullYear = 2000 + parseInt(year, 10);
      const expiryDate = new Date(fullYear, parseInt(month, 10) - 1);
      const currentDate = new Date();
      currentDate.setDate(1); // Set to first day of current month

      if (expiryDate < currentDate) {
        input.setCustomValidity("Expiration date cannot be in the past");
        return false;
      } else {
        input.setCustomValidity("");
        return true;
      }
    }
    return true;
  }

  setupFormSubmission() {
    const form = document.getElementById("checkout-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent default form submission

        const submitButton = form.querySelector(".checkout-btn");
        const originalText = submitButton.textContent;

        try {
          // Show loading state
          submitButton.disabled = true;
          submitButton.textContent = "Processing...";

          // Call checkout process
          await this.checkout(form);

          // Handle success
          this.handleCheckoutSuccess();
        } catch (error) {
          // Handle error
          this.handleCheckoutError(submitButton, originalText);
        }
      });
    }
  }

  handleCheckoutSuccess() {
    alert("Order placed successfully! Thank you for your purchase.");

    // Clear cart and redirect
    localStorage.removeItem(this.key);
    window.location.href = "../index.html";
  }

  handleCheckoutError(submitButton, originalText) {
    alert("There was an error processing your order. Please try again.");

    // Reset button
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
}
