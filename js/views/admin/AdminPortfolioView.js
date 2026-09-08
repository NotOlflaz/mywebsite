/**
 * Admin Portfolio Management View
 * Features: Action Button Builder, PC Image Upload, Drag-and-Drop Reordering,
 * Draft/Published Publishing Workflow, Category & Status Tabs, Live CRUD.
 */

import { store } from "../../store/state.js";
import { modal } from "../../components/Modal.js";
import { toast } from "../../components/Toast.js";
import { getIcon } from "../../utils/icons.js";
import { renderImageUploader, initImageUploader } from "../../components/ImageUploader.js";
import { initDraggableList } from "../../utils/drag-drop.js";

let portfolioCategoryFilter = "All";
let portfolioStatusFilter = "All";

export function renderAdminPortfolioView() {
  const items = store.getPortfolio();
  const categories = ["All", "Game Development", "Minecraft", "Programming", "Content Creation", "Other Projects"];

  const filteredItems = items.filter(item => {
    const matchesCat = portfolioCategoryFilter === "All" || item.category === portfolioCategoryFilter;
    const matchesStatus = portfolioStatusFilter === "All" || (item.publishStatus || "published") === portfolioStatusFilter;
    return matchesCat && matchesStatus;
  });

  const rowsHtml = filteredItems.length > 0 ? filteredItems.map((item, idx) => {
    const isPublished = (item.publishStatus || "published") === "published";

    return `
      <tr class="draggable-row" data-id="${item.id}" data-index="${idx}" id="admin-port-row-${item.id}">
        <td style="width: 38px; text-align: center;">
          <span class="drag-handle" title="Drag to reorder portfolio display sequence">
            ${getIcon('dragHandle', 16)}
          </span>
        </td>
        <td>
          <div class="flex items-center gap-sm">
            <div style="width: 48px; height: 32px; background: var(--bg-surface-alt); border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0;">
              ${item.image ? `<img src="${item.image}" style="width:100%;height:100%;object-fit:cover;" />` : getIcon('portfolio', 14)}
            </div>
            <div>
              <strong>${item.title}</strong>
              <div class="text-xs text-muted font-mono">${item.technologies || '-'}</div>
            </div>
          </div>
        </td>
        <td><span class="badge">${item.category}</span></td>
        <td>
          <button 
            type="button" 
            class="badge ${isPublished ? 'badge-published' : 'badge-draft'} toggle-port-status-btn" 
            data-id="${item.id}"
            style="cursor: pointer; border-radius: var(--radius-xs);"
            title="Click to toggle Draft / Published status">
            ${isPublished ? '● Published' : '○ Draft'}
          </button>
        </td>
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
    `;
  }).join("") : '';

  return `
    <div class="admin-portfolio-page">
      
      <!-- Page Header -->
      <div class="admin-page-header">
        <div class="admin-page-header-info">
          <h1>Portfolio Management</h1>
          <p>Organize case studies, shipped projects, and milestones across Game Development, Minecraft, and Open-Source Programming.</p>
        </div>
        <div class="flex gap-xs">
          <a href="#/portfolio" target="_blank" class="btn btn-secondary btn-sm">
            ${getIcon('eye', 13)} Preview Portfolio Page ↗
          </a>
          <button class="btn btn-primary btn-sm" id="admin-add-port-btn">${getIcon('plus', 14)} Add Portfolio Item</button>
        </div>
      </div>

      <!-- Category Filter Tabs & Status Selector -->
      <div class="flex items-center justify-between gap-md flex-wrap" style="margin-bottom: var(--space-lg);">
        <div class="tabs">
          ${categories.map(cat => `
            <button class="tab-btn port-filter-tab ${cat === portfolioCategoryFilter ? 'active' : ''}" data-category="${cat}">
              ${cat} (${cat === 'All' ? items.length : items.filter(i => i.category === cat).length})
            </button>
          `).join("")}
        </div>

        <select class="form-select" id="admin-port-status-filter" style="max-width: 150px;">
          <option value="All" ${portfolioStatusFilter === 'All' ? 'selected' : ''}>Status: All</option>
          <option value="published" ${portfolioStatusFilter === 'published' ? 'selected' : ''}>Status: Published</option>
          <option value="draft" ${portfolioStatusFilter === 'draft' ? 'selected' : ''}>Status: Draft</option>
        </select>
      </div>

      <!-- Table or Empty State -->
      ${filteredItems.length > 0 ? `
        <div class="table-responsive">
          <table class="data-table" id="admin-portfolio-table">
            <thead>
              <tr>
                <th style="width: 38px;"></th>
                <th>Title & Tech</th>
                <th>Category</th>
                <th>Status</th>
                <th>Role</th>
                <th>Result / Milestone</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="admin-portfolio-tbody">
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      ` : `
        <div class="empty-state-card">
          <div class="empty-state-icon">${getIcon('portfolio', 32)}</div>
          <h3 class="empty-state-title">No Portfolio Items Found</h3>
          <p class="empty-state-desc">
            You have not added any portfolio case studies under this filter.
          </p>
          <button class="btn btn-primary" id="empty-state-add-port-btn">
            ${getIcon('plus', 14)} Add Portfolio Item
          </button>
        </div>
      `}

      <!-- Sticky Quick Action Bar -->
      <div class="admin-sticky-bar">
        <div class="admin-sticky-bar-left">
          <span style="color: var(--status-active-text);">${getIcon('sparkles', 14)}</span>
          <span>${items.length} total portfolio case studies (${filteredItems.length} shown) &bull; Drag ⠿ to reorder.</span>
        </div>
        <div class="admin-sticky-bar-right">
          <a href="#/portfolio" target="_blank" class="btn btn-outline">
            ${getIcon('eye', 13)} View Public Portfolio
          </a>
          <button type="button" class="btn btn-primary" id="sticky-add-port-btn">
            ${getIcon('plus', 14)} Add Portfolio Item
          </button>
        </div>
      </div>

    </div>
  `;
}

export function initAdminPortfolioEvents(reRenderCallback) {
  // Sticky Add Portfolio Item
  const stickyAddBtn = document.getElementById("sticky-add-port-btn");
  if (stickyAddBtn) {
    stickyAddBtn.addEventListener("click", () => {
      openPortfolioFormModal(null, reRenderCallback);
    });
  }

  // Initialize Drag & Drop Table Reordering
  const tbody = document.getElementById("admin-portfolio-tbody");
  if (tbody) {
    initDraggableList({
      container: tbody,
      itemSelector: "tr.draggable-row",
      handleSelector: ".drag-handle",
      onReorder: (fromIdx, toIdx) => {
        store.reorderPortfolio(fromIdx, toIdx);
        toast.info("Portfolio sequence updated!");
        if (reRenderCallback) reRenderCallback();
      }
    });
  }

  // Filter tabs
  const tabBtns = document.querySelectorAll(".port-filter-tab");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      portfolioCategoryFilter = btn.getAttribute("data-category");
      if (reRenderCallback) reRenderCallback();
    });
  });

  const statusSelect = document.getElementById("admin-port-status-filter");
  if (statusSelect) {
    statusSelect.addEventListener("change", (e) => {
      portfolioStatusFilter = e.target.value;
      if (reRenderCallback) reRenderCallback();
    });
  }

  // Quick Toggle Published / Draft Status
  const statusToggleBtns = document.querySelectorAll(".toggle-port-status-btn");
  statusToggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const item = store.getPortfolio().find(p => p.id === id);
      if (item) {
        const nextStatus = (item.publishStatus || "published") === "published" ? "draft" : "published";
        store.updatePortfolioPublishStatus(id, nextStatus);
        toast.success(`Portfolio item "${item.title}" set to ${nextStatus === 'published' ? 'Published' : 'Draft'}`);
        if (reRenderCallback) reRenderCallback();
      }
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
      if (item && confirm(`Delete portfolio item "${item.title}"?`)) {
        store.deletePortfolioItem(id);
        toast.error(`Item "${item.title}" deleted`);
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
    technologies: "",
    role: "Lead Developer",
    result: "",
    description: "",
    image: "",
    links: "",
    publishStatus: "published",
    actionButtons: [],
    isFeatured: false
  };

  let localButtons = Array.isArray(item.actionButtons) && item.actionButtons.length > 0
    ? JSON.parse(JSON.stringify(item.actionButtons))
    : (item.links ? [{ id: "btn-link", label: "View Project", url: item.links, style: "primary", enabled: true }] : []);

  const renderButtonsList = () => {
    if (localButtons.length === 0) {
      return `<p class="text-xs text-muted" style="margin: 4px 0;">No custom buttons configured. Click "+ Add Button" below.</p>`;
    }
    return localButtons.map((btn, index) => `
      <div class="action-button-item" data-index="${index}">
        <input 
          type="text" 
          class="form-input btn-label-input" 
          placeholder="Label (e.g. View Repo)" 
          value="${escapeHtml(btn.label)}" 
          style="width: 140px;" 
        />
        <input 
          type="text" 
          class="form-input btn-url-input" 
          placeholder="URL (https://...)" 
          value="${escapeHtml(btn.url)}" 
          style="flex: 1;" 
        />
        <select class="form-select btn-style-select" style="width: 110px;">
          <option value="primary" ${btn.style === 'primary' ? 'selected' : ''}>Primary</option>
          <option value="secondary" ${btn.style === 'secondary' ? 'selected' : ''}>Secondary</option>
          <option value="outline" ${btn.style === 'outline' ? 'selected' : ''}>Outline</option>
        </select>
        <label class="flex items-center gap-2xs" style="margin: 0 4px; font-size: 11px; cursor: pointer;">
          <input type="checkbox" class="btn-enabled-checkbox" ${btn.enabled ? 'checked' : ''} />
          <span>Active</span>
        </label>
        <button type="button" class="btn btn-danger btn-sm remove-action-btn" data-index="${index}" style="padding: 4px 8px;" title="Remove">
          ✕
        </button>
      </div>
    `).join("");
  };

  const bodyHtml = `
    <form id="portfolio-crud-form" style="display: flex; flex-direction: column; gap: var(--space-lg);">
      
      <!-- 1. BASIC INFO -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title"><span>1. Showcase Information</span></div>
        </div>
        <div class="form-section-body">
          <div class="form-group">
            <label class="form-label" for="port-title">Case Study / Project Title *</label>
            <input type="text" class="form-input" id="port-title" required value="${escapeHtml(item.title)}" placeholder="e.g. Godot 4 Fluid Physics Engine" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="port-category">Category *</label>
              <select class="form-select" id="port-category">
                <option value="Game Development" ${item.category === 'Game Development' ? 'selected' : ''}>Game Development</option>
                <option value="Minecraft" ${item.category === 'Minecraft' ? 'selected' : ''}>Minecraft</option>
                <option value="Programming" ${item.category === 'Programming' ? 'selected' : ''}>Programming</option>
                <option value="Content Creation" ${item.category === 'Content Creation' ? 'selected' : ''}>Content Creation</option>
                <option value="Other Projects" ${item.category === 'Other Projects' ? 'selected' : ''}>Other Projects</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="port-publish-status">Publishing Status *</label>
              <select class="form-select" id="port-publish-status">
                <option value="published" ${(item.publishStatus || 'published') === 'published' ? 'selected' : ''}>● Published (Visible Publicly)</option>
                <option value="draft" ${(item.publishStatus || 'published') === 'draft' ? 'selected' : ''}>○ Draft (Admin Only)</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="port-role">Role</label>
              <input type="text" class="form-input" id="port-role" value="${escapeHtml(item.role)}" placeholder="e.g. Lead Programmer & Designer" />
            </div>

            <div class="form-group">
              <label class="form-label" for="port-result">Result / Milestone</label>
              <input type="text" class="form-input" id="port-result" value="${escapeHtml(item.result)}" placeholder="e.g. 50K+ Downloads, Winner Game Jam" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="port-tech">Technologies & Tools (Comma-separated)</label>
            <input type="text" class="form-input" id="port-tech" value="${escapeHtml(item.technologies)}" placeholder="e.g. Godot 4, GDScript, Blender, C#" />
          </div>

          <div class="form-group">
            <label class="form-label" for="port-desc">Description & Highlights</label>
            <textarea class="form-textarea" id="port-desc" rows="3" placeholder="Summary of architecture, challenges solved, and outcomes...">${escapeHtml(item.description)}</textarea>
          </div>
        </div>
      </div>

      <!-- 2. ACTION BUTTONS BUILDER -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title"><span>2. Configurable Action Buttons</span></div>
          <button type="button" class="btn btn-secondary btn-sm" id="add-port-action-btn-trigger">
            ${getIcon('plus', 13)} Add Button
          </button>
        </div>
        <div class="form-section-body">
          <div class="action-buttons-builder" id="port-action-buttons-container">
            ${renderButtonsList()}
          </div>
        </div>
      </div>

      <!-- 3. MEDIA & FEATURED -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title"><span>3. Showcase Media & Spotlight</span></div>
        </div>
        <div class="form-section-body">
          ${renderImageUploader({
            id: "port-image",
            value: item.image,
            label: "Showcase Image / Banner",
            helperText: "Upload a screenshot, render, or graphic from PC.",
            placeholder: "https://... or upload from PC",
            aspect: "16/9"
          })}

          <div class="form-group" style="margin-top: var(--space-md);">
            <label class="form-checkbox-label">
              <input type="checkbox" id="port-featured" ${item.isFeatured ? 'checked' : ''} />
              <span><strong>Mark as Featured Portfolio Item</strong> (Highlighted prominently)</span>
            </label>
          </div>
        </div>
      </div>

    </form>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-outline" id="modal-port-cancel-btn">Cancel</button>
    <button type="button" class="btn btn-primary" id="modal-port-save-btn">${isEdit ? 'Save Changes' : 'Save Item'}</button>
  `;

  modal.open({
    title: isEdit ? `Edit Portfolio: ${item.title}` : "Add Portfolio Item",
    bodyHtml,
    footerHtml,
    isLarge: true,
    onOpen: (modalEl) => {
      const cancelBtn = modalEl.querySelector("#modal-port-cancel-btn");
      const saveBtn = modalEl.querySelector("#modal-port-save-btn");
      const buttonsContainer = modalEl.querySelector("#port-action-buttons-container");

      // Initialize Image Uploader
      initImageUploader(modalEl, "port-image");

      // Wire Action Buttons Builder
      const bindButtonsEvents = () => {
        buttonsContainer.innerHTML = renderButtonsList();

        buttonsContainer.querySelectorAll(".action-button-item").forEach(itemEl => {
          const idx = parseInt(itemEl.getAttribute("data-index"), 10);
          const labelInput = itemEl.querySelector(".btn-label-input");
          const urlInput = itemEl.querySelector(".btn-url-input");
          const styleSelect = itemEl.querySelector(".btn-style-select");
          const enabledCheck = itemEl.querySelector(".btn-enabled-checkbox");
          const removeBtn = itemEl.querySelector(".remove-action-btn");

          labelInput.addEventListener("input", (e) => { localButtons[idx].label = e.target.value; });
          urlInput.addEventListener("input", (e) => { localButtons[idx].url = e.target.value; });
          styleSelect.addEventListener("change", (e) => { localButtons[idx].style = e.target.value; });
          enabledCheck.addEventListener("change", (e) => { localButtons[idx].enabled = e.target.checked; });

          removeBtn.addEventListener("click", () => {
            localButtons.splice(idx, 1);
            bindButtonsEvents();
          });
        });
      };

      const addBtnTrigger = modalEl.querySelector("#add-port-action-btn-trigger");
      if (addBtnTrigger) {
        addBtnTrigger.addEventListener("click", () => {
          localButtons.push({
            id: "btn-" + Date.now(),
            label: "View Demo",
            url: "https://",
            style: "primary",
            enabled: true
          });
          bindButtonsEvents();
        });
      }

      bindButtonsEvents();

      cancelBtn.addEventListener("click", () => modal.close());

      saveBtn.addEventListener("click", () => {
        const title = modalEl.querySelector("#port-title").value.trim();
        const category = modalEl.querySelector("#port-category").value;
        const publishStatus = modalEl.querySelector("#port-publish-status").value;
        const role = modalEl.querySelector("#port-role").value.trim();
        const result = modalEl.querySelector("#port-result").value.trim();
        const technologies = modalEl.querySelector("#port-tech").value.trim();
        const description = modalEl.querySelector("#port-desc").value.trim();
        const image = modalEl.querySelector("#port-image").value.trim();
        const isFeatured = modalEl.querySelector("#port-featured").checked;

        if (!title) {
          toast.error("Portfolio title is required");
          modalEl.querySelector("#port-title").focus();
          return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = "⏳ Saving...";

        const actionButtons = localButtons.filter(b => b.label.trim() && b.url.trim());
        const primaryLink = actionButtons.length > 0 ? actionButtons[0].url : "";

        const payload = {
          title,
          category,
          publishStatus,
          role,
          result,
          technologies,
          description,
          image,
          links: primaryLink,
          actionButtons,
          isFeatured
        };

        setTimeout(() => {
          if (isEdit) {
            store.updatePortfolioItem(item.id, payload);
            toast.success(`Portfolio item "${title}" updated!`);
          } else {
            store.addPortfolioItem(payload);
            toast.success(`Portfolio item "${title}" added!`);
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
