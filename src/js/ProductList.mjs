import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return ` 
    <li class="product-card">
        <a href="product_pages/?product=${product.Id}">
            <img
                src="${product.Images.PrimaryMedium}"
                alt="${product.Name}"
                loading="lazy"
            />
            <h3 class="card__brand">${product.Brand.Name}</h3>
            <h2 class="card__name">${product.NameWithoutBrand}</h2>
            <p class="product-card__price">$${product.ListPrice}</p>
        </a>
    </li>
    `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category; // The product category to display
    this.products = []; // Will hold the list of products once loaded
    this.dataSource = dataSource; // Data source to fetch product info
    this.listElement = listElement; // The DOM element where products will be rendered
  }

  async init() {
    const productList = await this.dataSource.getData(this.category); // Fetch products for the category
    this.renderList(productList); // Render the product list to the page
  }

  // Renders the product list using the template for each product and inserts it into the DOM
  renderList(productList) {
    if (!this.listElement) return; // If the list element is not found, do nothing
    // Use map to transform each product into an HTML string using the template
    // const productHTMLString = productList
    //   .map((product) => productCardTemplate(product))
    //   .join("");
    // Insert the combined HTML into the DOM
    // this.listElement.insertAdjacentHTML("afterbegin", productHTMLString);

    // Use the utility function to render the list
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      productList,
      "afterbegin",
      true,
    );
  }
}
