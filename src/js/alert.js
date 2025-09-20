export default class Alert {
  constructor(jsonFile) {
    this.jsonFile = jsonFile;
  }

  // Show a runtime alert
  show(message, type = "info") {
    const container = document.getElementById("alert-container");
    if (!container) return;

    // Create alert element
    const p = document.createElement("p");
    p.textContent = message;

    // Style based on type
    p.style.padding = "10px";
    p.style.marginBottom = "8px";
    p.style.borderRadius = "6px";
    p.style.position = "relative";

    if (type === "success") {
      p.style.background = "#d4edda";
      p.style.color = "#155724";
    } else if (type === "error") {
      p.style.background = "#f8d7da";
      p.style.color = "#721c24";
    } else {
      p.style.background = "#cce5ff";
      p.style.color = "#004085";
    }

    // Close button
    const closeBtn = document.createElement("span");
    closeBtn.textContent = "❌";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.position = "absolute";
    closeBtn.style.right = "10px";
    closeBtn.style.top = "5px";

    closeBtn.addEventListener("click", () => p.remove());
    p.appendChild(closeBtn);

    // Append to container
    container.appendChild(p);

    // Auto-remove after 3 seconds
    setTimeout(() => p.remove(), 3000);
  }
}
