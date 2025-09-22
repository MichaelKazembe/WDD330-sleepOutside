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
  const fragment = document.createRange().createContextualFragment(template);
  parentElement.replaceChildre(template);
  // Insert the template into the parentElement
  parentElement.innerHTML = template;
  parentElement.insertAdjacentHTML("afterbegin, template");
  // If a callback is provided, it runs
  if (callback) {
    callback(data);
  }
}

// This asynchronous function fetches the content of the HTML file given a path
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

//  Loads and renders the header and footer templates into the DOM
export async function loadHeaderFooter() {
  try {
    // Load header and footer templates
    const headerTemplate = await loadTemplate("../partials/header.html");
    const footerTemplate = await loadTemplate("../partials/footer.html");

    // Grab header and footer placeholders in DOM
    const headerElement = document.querySelector("#main-header");
    const footerElement = document.querySelector("#main-footer");

    // Render header and footer
    if (headerElement) {
      renderWithTemplate(headerTemplate, headerElement);
    }
    if (footerElement) {
      renderWithTemplate(footerTemplate, footerElement);
    }
  } catch (err) {
    console.error("Error loading header or footer:", err);
  }
}
