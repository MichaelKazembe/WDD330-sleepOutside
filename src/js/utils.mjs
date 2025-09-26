// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// Returns a param from URL query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  if (clear) parentElement.innerHTML = "";
  const productHTMLString = list.map((item) => templateFn(item)).join("");
  parentElement.insertAdjacentHTML(position, productHTMLString);
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

async function loadTemplate(path) {
  const response = await fetch(path);
  if (response.ok) {
    const template = await response.text();
    return template;
  } else {
    throw new Error(`Unable to load template: ${path}`);
  }
}

export async function loadHeaderFooter() {
  // load header & footer
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = qs("#main-header");
  const footerElement = qs("#main-footer");

  // insert into page
  renderWithTemplate(headerTemplate, headerElement, {});
  renderWithTemplate(footerTemplate, footerElement, {});
}

// Function to handle search form
export function initSearch() {
  const searchForm = document.querySelector("#search-form");
  const searchInput = document.querySelector("#search-input");

  if (!searchForm) return;

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();

    if (query) {
      // Redirect to product listing page with search parameter
      window.location.href = `/product_listing/index.html?search=${encodeURIComponent(query)}`;
    }
  });
}
