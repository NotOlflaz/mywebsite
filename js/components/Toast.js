/**
 * Toast Notification System
 */

class ToastManager {
  constructor() {
    this.container = null;
    this.ensureContainer();
  }

  ensureContainer() {
    this.container = document.getElementById("toast-container");
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "toast-container";
      this.container.className = "toast-container";
      document.body.appendChild(this.container);
    }
  }

  /**
   * Display a floating toast message
   * @param {string} message - Text or HTML to show
   * @param {'success'|'error'|'info'} type - Toast type
   * @param {number} duration - Auto-dismiss ms (default: 3500)
   */
  show(message, type = "success", duration = 3500) {
    this.ensureContainer();
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";

    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: bold; font-family: var(--font-mono);">${icon}</span>
        <span>${message}</span>
      </div>
      <button style="background: none; border: none; color: inherit; cursor: pointer; font-size: 16px; padding: 0 4px;" aria-label="Close">✕</button>
    `;

    const dismiss = () => {
      if (!toast.classList.contains("toast-hiding")) {
        toast.classList.add("toast-hiding");
        setTimeout(() => {
          if (toast.parentElement) toast.remove();
        }, 140);
      }
    };

    const closeBtn = toast.querySelector("button");
    closeBtn.addEventListener("click", dismiss);

    this.container.appendChild(toast);

    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  }

  success(msg) { this.show(msg, "success"); }
  error(msg) { this.show(msg, "error"); }
  info(msg) { this.show(msg, "info"); }
}

export const toast = new ToastManager();
