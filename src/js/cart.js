import { getLocalStorage } from "./utils.mjs";

// Function to render the contents of the cart from localStorage
function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}
// Function to create HTML for a single cart item
function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();

// Function to update the cart total 
function updateCartTotal() {
  const cartItemsData = getLocalStorage("so-cart");
  let totalCartItems = 0;
  // If there are items in the cart, calculate the total
  if (Array.isArray(cartItemsData) && cartItemsData.length > 0) {
    cartItemsData.forEach((item) => {
      totalCartItems += item.FinalPrice;
    });
    // Update the total in the DOM and show the cart footer
    document.querySelector(".cart__total").textContent =
      `Total: $${totalCartItems.toFixed(2)}`;
    document.querySelector(".cart-footer").classList.remove("hide");
  } else {
    // If the cart is empty, hide the cart footer
    document.querySelector(".cart-footer").classList.add("hide");
  }
}

updateCartTotal();
