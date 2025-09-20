// src/js/alert.js
// Handles loading alerts from alerts.json and displaying them.

export default class Alert {
  constructor(jsonFile) {
    this.jsonFile = jsonFile; // Path to alerts.json
  }

  // Fetch alerts from the JSON file
  async loadAlerts() {
    try {
      const response = await fetch(this.jsonFile);
      const alerts = await response.json();

      if (alerts.length > 0) {
        this.buildAlerts(alerts);
      }
    } catch (err) {
      console.error("❌ Error loading alerts:", err);
    }
  }

  // Build the alerts and add them to the DOM
  buildAlerts(alerts) {
    const section = document.createElement("section");
    section.classList.add("alert-list");

    alerts.forEach((alert) => {
      // Create alert message container
      const p = document.createElement("p");
      p.textContent = alert.message;
      p.style.background = alert.background;
      p.style.color = alert.color;
      p.style.padding = "10px";
      p.style.marginBottom = "8px";
      p.style.borderRadius = "6px";
      p.style.position = "relative";

      // Close ❌ button
      const closeBtn = document.createElement("span");
      closeBtn.textContent = "❌";
      closeBtn.style.cursor = "pointer";
      closeBtn.style.position = "absolute";
      closeBtn.style.right = "10px";
      closeBtn.style.top = "5px";

      // Remove alert when ❌ clicked
      closeBtn.addEventListener("click", () => p.remove());

      p.appendChild(closeBtn);
      section.appendChild(p);
    });

    // Insert alerts section at the top of <main>
    const main = document.querySelector("main");
    if (main) {
      main.prepend(section);
    }
  }
}
