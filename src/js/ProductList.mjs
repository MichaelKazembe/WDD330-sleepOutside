export default class ProductList {
    constructor(category, dataSource, listElement){
        this.category = category; // The product category to display
        this.products = []; // Will hold the list of products once loaded
        this.dataSource = dataSource; // Data source to fetch product info
        this.listElement = listElement; // The DOM element where products will be rendered
    }

    async init() {
        const productList = await this.dataSource.getData(); // Fetch products for the category
        this.products = productList; // Store products for later use
        this.renderProductList(); // Render the product list to the page
    }
}