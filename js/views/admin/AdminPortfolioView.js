/**
 * Admin Portfolio Management View
 * Features: Structured Add/Edit Sections, Category tabs/filtering, Live CRUD, Save Feedback, and Empty States.
 */

import { store } from "../../store/state.js";
import { modal } from "../../components/Modal.js";
import { toast } from "../../components/Toast.js";
import { getIcon } from "../../utils/icons.js";
import { renderImageUploader, initImageUploader } from "../../components/ImageUploader.js";

let portfolioCategoryFilter = "All";

export function renderAdminPortfolioView() {
  const items = store.getPortfolio();
  const categories = ["All", "Game Development", "Minecraft", "Programming", "Content Creation", "Other Projects"];

  const filteredItems = items.filter(item => {
    return portfolioCategoryFilter === "All" || item.category === portfolioCategoryFilter;
  });

  const rowsHtml = filteredItems.length > 0 ? filteredItems.map(item => `
    <tr id="admin-port-row-${item.id}">
      <td>
        <strong>${item.title}</strong>
        <div class="text-xs text-muted font-mono">${item.technologies || '-'}</div>
      </td>
      <td><span class="badge">${item.category}</span></td>
      <td class="text-xs">${item.role || 'Creator'}</td>
      <td class="text-xs">${item.result || '-'}</td>
      <td>
        <button 
          class="badge ${item.isFeatured ? 'badge-featured' : ''} toggle-port-featured-btn" 
          data-id="${item.id}"
          style="cursor: pointer;"
          title="Click to toggle featured on Portfolio page">
          ${item.isFeatured ? 'Featured' : 'Standard'}
        </button>
      </td>
      <td>
        <div class="table-actions">
          ${item.links ? `<a href="${item.links}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="Open Link">${getIcon('external', 13)}</a>` : ''}
          <button class="btn btn-secondary btn-sm edit-port-btn" data-id="${item.id}">${getIcon('edit', 13)} Edit</button>
          <button class="btn btn-danger btn-sm delete-port-btn" data-id="${item.id}">${getIcon('trash', 13)}</button>
        </div>
      </td>
    </tr>
  `).join("") : '';

  return `
    <div class="admin-portfolio-page">
      
      <!-- Page Header -->
      <div class="admin-page-header">
        <div class="admin-page-header-info">
          <h1>Portfolio Management</h1>
          <p>Organize case studies, shipped projects, and milestones across Game Development, Minecraft, and Open-Source Programming.</p>
        </div>
        <button class="btn btn-primary" id="admin-add-port-btn">${getIcon('plus', 14)} Add Portfolio Item</button>
      </div>

      <!-- Category Filter Tabs -->
      <div class="tabs" style="margin-bottom: var(--space-lg);">
        ${categories.map(cat => `
          <button class="tab-btn port-filter-tab ${cat === portfolioCategoryFilter ? 'active' : ''}" data-category="${cat}">
            ${cat} (${cat === 'All' ? items.length : items.filter(i => i.category === cat).length})
          </button>
        `).join("")}
      </div>

      <!-- Table or Empty State -->
      ${filteredItems.length > 0 ? `
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Title & Tech</th>
                <th>Category</th>
                <th>Role</th>
                <th>Result / Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      ` : `
        <div class="empty-state-card">
          <div class="empty-state-icon">${getIcon('portfolio', 32)}</div>
          <h3 class="empty-state-title">No Portfolio Items in this Category</h3>
          <p class="empty-state-desc">
            You have not added any portfolio case studies under "${portfolioCategoryFilter}" yet.
          </p>
          <button class="btn btn-primary" id="empty-state-add-port-btn">
            ${getIcon('plus', 14)} Add Portfolio Item
          </button>
        </div>
      `}

    </div>
  `;
}

export function initAdminPortfolioEvents(reRenderCallback) {
  // Filter tabs
  const tabBtns = document.querySelectorAll(".port-filter-tab");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      portfolioCategoryFilter = btn.getAttribute("data-category");
      if (reRenderCallback) reRenderCallback();
    });
  });

  // Toggle Featured
  const toggleBtns = document.querySelectorAll(".toggle-port-featured-btn");
  toggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const isFeatured = store.togglePortfolioFeatured(id);
      toast.success(`Portfolio featured status set to ${isFeatured ? 'Featured' : 'Standard'}`);
      if (reRenderCallback) reRenderCallback();
    });
  });

  // Add Item
  const addBtn = document.getElementById("admin-add-port-btn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      openPortfolioModal(null, reRenderCallback);
    });
  }

  const emptyAddBtn = document.getElementById("empty-state-add-port-btn");
  if (emptyAddBtn) {
    emptyAddBtn.addEventListener("click", () => {
      openPortfolioModal(null, reRenderCallback);
    });
  }

  // Edit Item
  const editBtns = document.querySelectorAll(".edit-port-btn");
  editBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const item = store.getPortfolio().find(p => p.id === id);
      if (item) openPortfolioModal(item, reRenderCallback);
    });
  });

  // Delete Item
  const deleteBtns = document.querySelectorAll(".delete-port-btn");
  deleteBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const item = store.getPortfolio().find(p => p.id === id);
      if (item && confirm(`Are you sure you want to delete "${item.title}"?\nThis action cannot be undone.`)) {
        store.deletePortfolioItem(id);
        toast.error(`Portfolio item "${item.title}" was deleted`);
        if (reRenderCallback) reRenderCallback();
      }
    });
  });
}

function openPortfolioModal(itemToEdit = null, onSaved = null) {
  const isEdit = !!itemToEdit;
  const item = itemToEdit || {
    title: "",
    category: "Game Development",
    technologies: "Godot 4, GDScript",
    role: "Lead Developer",
    result: "Completed / Released",
    description: "",
    image: "",
    links: "",
    isFeatured: false
  };

  const bodyHtml = `
    <form id="portfolio-form" style="display: flex; flex-direction: column; gap: var(--space-lg);">
      
      <!-- 1. BASIC INFORMATION -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>1. Basic Information</span>
          </div>
        </div>
        <div class="form-section-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="port-title">Item / Case Study Title *</label>
              <input type="text" class="form-input" id="port-title" required value="${escapeHtml(item.title)}" placeholder="e.g. Shadow Leap — 2D Platformer" />
            </div>
            <div class="form-group">
              <label class="form-label" for="port-cat">Category *</label>
              <select class="form-select" id="port-cat">
                <option value="Game Development" ${item.category === 'Game Development' ? 'selected' : ''}>Game Development</option>
                <option value="Minecraft" ${item.category === 'Minecraft' ? 'selected' : ''}>Minecraft</option>
                <option value="Programming" ${item.category === 'Programming' ? 'selected' : ''}>Programming</option>
                <option value="Content Creation" ${item.category === 'Content Creation' ? 'selected' : ''}>Content Creation</option>
                <option value="Other Projects" ${item.category === 'Other Projects' ? 'selected' : ''}>Other Projects</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="port-role">My Role</label>
              <input type="text" class="form-input" id="port-role" value="${escapeHtml(item.role)}" placeholder="e.g. Solo Developer, Level Designer" />
            </div>
            <div class="form-group">
              <label class="form-label" for="port-result">Result / Milestone</label>
              <input type="text" class="form-input" id="port-result" value="${escapeHtml(item.result)}" placeholder="e.g. 50,000 downloads on Planet Minecraft" />
            </div>
          </div>
        </div>
      </div>

      <!-- 2. DETAILS & TECH -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>2. Details & Tech Stack</span>
          </div>
        </div>
        <div class="form-section-body">
          <div class="form-group">
            <label class="form-label" for="port-tech">Technologies / Tools Used</label>
            <input type="text" class="form-input" id="port-tech" value="${escapeHtml(item.technologies)}" placeholder="Godot 4.3, Blender, Blockbench" />
          </div>

          <div class="form-group">
            <label class="form-label" for="port-desc">Description & Responsibilities</label>
            <textarea class="form-textarea" id="port-desc" rows="3" placeholder="Summary of what was built, problem solved, and impact...">${escapeHtml(item.description)}</textarea>
          </div>
        </div>
      </div>

      <!-- 3. MEDIA & LINKS -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>3. Image & External Link</span>
          </div>
        </div>
        <div class="form-section-body">
          ${renderImageUploader({
            id: "port-image",
            value: item.image,
            label: "Portfolio Showcase Image",
            helperText: "Upload a showcase image from PC or link external URL.",
            aspect: "16/9"
          })}

          <div class="form-group" style="margin-top: var(--space-sm);">
            <label class="form-label" for="port-links">Project Link / Source URL</label>
            <input type="text" class="form-input" id="port-links" value="${escapeHtml(item.links)}" placeholder="https://..." />
          </div>
        </div>
      </div>

      <!-- 4. PUBLISHING -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>4. Featured Spotlight</span>
          </div>
        </div>
        <div class="form-section-body">
          <div class="form-group">
            <label class="form-checkbox-label">
              <input type="checkbox" id="port-featured" ${item.isFeatured ? 'checked' : ''} />
              <span>Mark as Featured Portfolio Item</span>
            </label>
          </div>
        </div>
      </div>

    </form>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-outline" id="modal-port-cancel-btn">Cancel</button>
    <button type="button" class="btn btn-primary" id="modal-port-save-btn">${isEdit ? 'Save Changes' : 'Add Item'}</button>
  `;

  modal.open({
    title: isEdit ? `Edit Portfolio Item: ${item.title}` : "Add Portfolio Item",
    bodyHtml,
    footerHtml,
    onOpen: (modalEl) => {
      // Initialize Image Uploader for Portfolio Item Image
      initImageUploader(modalEl, "port-image");

      modalEl.querySelector("#modal-port-cancel-btn").addEventListener("click", () => modal.close());
      const saveBtn = modalEl.querySelector("#modal-port-save-btn");

      saveBtn.addEventListener("click", () => {
        const title = modalEl.querySelector("#port-title").value.trim();
        const category = modalEl.querySelector("#port-cat").value;
        const role = modalEl.querySelector("#port-role").value.trim();
        const result = modalEl.querySelector("#port-result").value.trim();
        const technologies = modalEl.querySelector("#port-tech").value.trim();
        const description = modalEl.querySelector("#port-desc").value.trim();
        const image = modalEl.querySelector("#port-image").value.trim();
        const links = modalEl.querySelector("#port-links").value.trim();
        const isFeatured = modalEl.querySelector("#port-featured").checked;

        if (!title) {
          toast.error("Title is required");
          modalEl.querySelector("#port-title").focus();
          return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = "⏳ Saving...";

        const payload = { title, category, role, result, technologies, description, image, links, isFeatured };

        setTimeout(() => {
          if (isEdit) {
            store.updatePortfolioItem(item.id, payload);
            toast.success(`Portfolio item "${title}" updated!`);
          } else {
            store.addPortfolioItem(payload);
            toast.success(`New portfolio item "${title}" added!`);
          }

          modal.close();
          if (onSaved) onSaved();
        }, 150);
      });
    }
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
