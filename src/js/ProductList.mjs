export default class ProductList {
  constructor(listElementId, products) {
    this.listElement = document.getElementById(listElementId);
    this.products = products;
  }

  // Render products into the list
  renderList() {
    this.listElement.innerHTML = ""; // Clear existing items

    this.products.forEach((product) => {
      const item = document.createElement("li");
      item.classList.add("product-item");

      // Create product link (points to /product_pages/index.html)
      const link = document.createElement("a");
      link.href = "/product_pages/index.html";
      link.textContent = product.name;

      // Add click listener (alert + navigation)
      link.addEventListener("click", (event) => {
        event.preventDefault(); // stop immediate navigation
        alert(`You clicked on ${product.name}`);
        // Redirect after alert
        window.location.href = link.href;
      });

      item.appendChild(link);
      this.listElement.appendChild(item);
    });
  }
}
