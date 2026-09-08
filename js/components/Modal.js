/**
 * Accessible Reusable Modal Dialog Component
 */

class ModalManager {
  constructor() {
    this.modalEl = null;
    this.backdropEl = null;
    this.closeCallback = null;
    this.init();
  }

  init() {
    let backdrop = document.getElementById("global-modal-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "global-modal-backdrop";
      backdrop.className = "modal-backdrop";
      backdrop.innerHTML = `
        <div class="modal-dialog" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h3 class="modal-title" id="global-modal-title">Modal Title</h3>
            <button class="modal-close-btn" id="global-modal-close-btn" aria-label="Close modal">✕</button>
          </div>
          <div class="modal-body" id="global-modal-body"></div>
          <div class="modal-footer" id="global-modal-footer"></div>
        </div>
      `;
      document.body.appendChild(backdrop);
    }

    this.backdropEl = backdrop;
    this.modalEl = backdrop.querySelector(".modal-dialog");

    // Close on backdrop click (outside modal content)
    this.backdropEl.addEventListener("click", (e) => {
      if (e.target === this.backdropEl) {
        this.close();
      }
    });

    // Close on ESC key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen()) {
        this.close();
      }
    });

    const closeBtn = backdrop.querySelector("#global-modal-close-btn");
    closeBtn.addEventListener("click", () => this.close());
  }

  isOpen() {
    return this.backdropEl && this.backdropEl.classList.contains("active");
  }

  /**
   * Open the modal with custom configuration
   * @param {Object} options
   * @param {string} options.title - Header title
   * @param {string} options.bodyHtml - Inner body HTML
   * @param {string} [options.footerHtml] - Footer buttons HTML
   * @param {boolean} [options.isLarge] - Set wider width
   * @param {Function} [options.onOpen] - Callback after DOM rendered in modal
   * @param {Function} [options.onClose] - Callback when closed
   */
  open({ title, bodyHtml, footerHtml = "", isLarge = false, onOpen = null, onClose = null }) {
    if (!this.backdropEl) this.init();

    this.closeCallback = onClose;

    const titleEl = document.getElementById("global-modal-title");
    const bodyEl = document.getElementById("global-modal-body");
    const footerEl = document.getElementById("global-modal-footer");

    titleEl.textContent = title || "Dialog";
    bodyEl.innerHTML = bodyHtml || "";
    
    if (footerHtml) {
      footerEl.innerHTML = footerHtml;
      footerEl.style.display = "flex";
    } else {
      footerEl.innerHTML = "";
      footerEl.style.display = "none";
    }

    if (isLarge) {
      this.modalEl.classList.add("modal-dialog-lg");
    } else {
      this.modalEl.classList.remove("modal-dialog-lg");
    }

    this.backdropEl.classList.add("active");
    document.body.style.overflow = "hidden";

    if (typeof onOpen === "function") {
      onOpen(this.modalEl);
    }
  }

  /**
   * Close the active modal
   */
  close() {
    if (this.backdropEl) {
      this.backdropEl.classList.remove("active");
      document.body.style.overflow = "";
      if (typeof this.closeCallback === "function") {
        this.closeCallback();
        this.closeCallback = null;
      }
    }
  }
}

export const modal = new ModalManager();
