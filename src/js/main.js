import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

// form handling for newsletter signup
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#newsletterForm");
  const emailInput = document.querySelector("#newsletterEmail");
  const messageBox = document.querySelector("#newsletterMessage");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
      messageBox.textContent = "⚠ Please enter a valid email.";
      messageBox.style.color = "red";
      return;
    }

    // Fake success message (for now)
    messageBox.textContent = "✅ Thank you for subscribing!";
    messageBox.style.color = "green";

    // Clear the form
    form.reset();

    // Later: Send email to backend API
    // fetch('/newsletter', { method: 'POST', body: JSON.stringify({email}) })
  });
});
