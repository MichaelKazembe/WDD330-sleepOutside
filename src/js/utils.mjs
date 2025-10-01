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

export function alertMessage(message, scroll = true) {
  // create element to hold the alert
  const alert = document.createElement("div");
  // add a class to style the alert
  alert.classList.add("alert");
  // set the contents with message and close button
  alert.innerHTML = `
    <p>${message}</p>
    <button type="button" class="alert-close">&times;</button>
  `;

  // add a listener to the alert to see if they clicked on the X
  alert.addEventListener("click", function (e) {
    // check if they clicked on the close button (X)
    if (
      e.target.tagName === "BUTTON" ||
      e.target.classList.contains("alert-close")
    ) {
      // Remove from its parent container
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    }
  });

  // Try to find the best place to insert the alert for better UX
  let targetContainer;

  // First, try to find the checkout section (for checkout forms)
  const checkoutSection = document.querySelector(".checkout-section");
  if (checkoutSection) {
    targetContainer = checkoutSection;
    // Insert at the beginning of checkout section, after the h2
    const heading = checkoutSection.querySelector("h2");
    if (heading && heading.nextSibling) {
      checkoutSection.insertBefore(alert, heading.nextSibling);
    } else {
      checkoutSection.prepend(alert);
    }
  } else {
    // Fallback to main element
    const main = document.querySelector("main");
    if (main) {
      main.prepend(alert);
      targetContainer = main;
    }
  }

  // Scroll the alert into view for better visibility
  if (scroll && alert) {
    // Use a small delay to ensure the alert is rendered
    setTimeout(() => {
      alert.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }, 100);
  }
}
