import { loadHeaderFooter, updateCartCount } from "./utils.mjs";

// Load header/footer first, then initialize cart count
loadHeaderFooter().then(() => {
  updateCartCount();
});

// Initialize cart count and form handling when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Also call updateCartCount here as backup
  setTimeout(() => updateCartCount(), 100);

  // form handling for newsletter signup
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
