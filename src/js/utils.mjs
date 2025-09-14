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

// URL parameter to get product
export function getParam(param) {
  const urlParams = new URLSearchParams(queryString); // Provides methods to work with the query string of a URL
  return urlParams.get(param); // returns the first value associated with the given search parameter
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  // Clears out the parentElement if requested
  if (clear) {
    parentElement.innerHTML = "";
  }

  // Converts the data list to HTML using the template function
  const htmlString = list.map(templateFn);

  // Insert the combined HTML into the parentElement
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}
