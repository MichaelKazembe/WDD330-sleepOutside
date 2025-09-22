// main.js;
import Alert from "../js/alert.js";

// Get all products
const productListData = dataSource.getProducts();
// Render the products on the page
productList.renderList(productListData);

// Load alerts from JSON
const alertSystem = new Alert("../json/alert.json");
alertSystem.loadAlerts();
