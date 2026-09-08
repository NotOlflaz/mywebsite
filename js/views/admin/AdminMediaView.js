/**
 * Admin Media Library View
 * Manage uploaded assets, search, view usage locations, copy URLs, and upload/add assets.
 */

import { store } from "../../store/state.js";
import { modal } from "../../components/Modal.js";
import { toast } from "../../components/Toast.js";
import { getIcon } from "../../utils/icons.js";
import { renderImageUploader, initImageUploader } from "../../components/ImageUploader.js";

let mediaSearchQuery = "";

export function renderAdminMediaView() {
  const allMedia = store.getMedia();

  const filteredMedia = allMedia.filter(m => {
    return !mediaSearchQuery ||
      m.name.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
      (m.usageLocation || '').toLowerCase().includes(mediaSearchQuery.toLowerCase());
  });

  const mediaGridHtml = filteredMedia.length > 0 ? filteredMedia.map(item => `
    <div class="media-card" id="media-card-${item.id}">
      <div class="media-thumbnail">
        ${item.url ? `
          <img src="${item.url}" alt="${item.name}" loading="lazy" />
        ` : `
          <div style="font-size: 24px; color: var(--text-muted);">${getIcon('media', 32)}</div>
        `}
      </div>
      <div class="media-info">
        <div class="media-name" title="${item.name}">${item.name}</div>
        <div class="media-meta">${item.size} • ${item.uploadedAt}</div>
        
        <div style="font-size: 11px; margin-top: 4px; padding: 4px 6px; background: var(--bg-surface-alt); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
          <strong>Location:</strong> <span class="text-muted">${item.usageLocation || 'Media Library'}</span>
        </div>

        <div style="display: flex; gap: 4px; margin-top: 8px;">
          <button class="btn btn-secondary btn-sm copy-media-url-btn" data-url="${item.url || item.name}" style="flex: 1; font-size: 11px;">
            Copy URL
          </button>
          <button class="btn btn-danger btn-sm delete-media-btn" data-id="${item.id}" title="Delete asset" style="padding: 4px 8px;">
            ${getIcon('trash', 13)}
          </button>
        </div>
      </div>
    </div>
  `).join("") : '';

  return `
    <div class="admin-media-page">
      
      <!-- Page Header -->
      <div class="admin-page-header">
        <div class="admin-page-header-info">
          <h1>Media Library</h1>
          <p>Browse, register, and link visual assets for project screenshots, video thumbnails, avatars, and icons.</p>
        </div>
        <button class="btn btn-primary" id="admin-add-media-btn">
          ${getIcon('plus', 14)} Add Media Asset
        </button>
      </div>

      <!-- Search Toolbar -->
      <div class="admin-table-toolbar">
        <div class="admin-search-filter-group">
          <input 
            type="text" 
            class="form-input" 
            id="admin-media-search-input" 
            placeholder="Search media by filename or usage location..." 
            value="${mediaSearchQuery}" 
            style="max-width: 320px;"
          />
        </div>
        <div class="text-xs text-muted font-mono">
          Showing ${filteredMedia.length} of ${allMedia.length} Assets
        </div>
      </div>

      <!-- Media Grid or Empty State -->
      ${filteredMedia.length > 0 ? `
        <div class="admin-media-grid">
          ${mediaGridHtml}
        </div>
      ` : `
        <div class="empty-state-card">
          <div class="empty-state-icon">${getIcon('media', 32)}</div>
          <h3 class="empty-state-title">No Media Assets Found</h3>
          <p class="empty-state-desc">
            ${mediaSearchQuery 
              ? 'No media assets matched your search query. Try clearing the search box.' 
              : 'Your media library is currently empty. Register image URLs to use across projects and videos.'}
          </p>
          <button class="btn btn-primary" id="empty-state-add-media-btn">
            ${getIcon('plus', 14)} Add Your First Asset
          </button>
        </div>
      `}

      <!-- Sticky Quick Action Bar -->
      <div class="admin-sticky-bar">
        <div class="admin-sticky-bar-left">
          <span style="color: var(--status-active-text);">${getIcon('sparkles', 14)}</span>
          <span>${allMedia.length} total media assets (${filteredMedia.length} shown) stored locally.</span>
        </div>
        <div class="admin-sticky-bar-right">
          <button type="button" class="btn btn-primary" id="sticky-add-media-btn">
            ${getIcon('plus', 14)} Register New Asset
          </button>
        </div>
      </div>

    </div>
  `;
}

export function initAdminMediaEvents(reRenderCallback) {
  // Sticky Add Media button
  const stickyAddBtn = document.getElementById("sticky-add-media-btn");
  if (stickyAddBtn) {
    stickyAddBtn.addEventListener("click", () => {
      openMediaFormModal(null, reRenderCallback);
    });
  }

  // Search
  const searchInput = document.getElementById("admin-media-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      mediaSearchQuery = e.target.value;
      if (reRenderCallback) reRenderCallback();
    });
  }

  // Copy URL
  const copyBtns = document.querySelectorAll(".copy-media-url-btn");
  copyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const url = btn.getAttribute("data-url");
      navigator.clipboard.writeText(url).then(() => {
        toast.info("Media URL copied to clipboard!");
      }).catch(() => {
        toast.info(`Media URL: ${url}`);
      });
    });
  });

  // Delete Media
  const deleteBtns = document.querySelectorAll(".delete-media-btn");
  deleteBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const asset = store.getMedia().find(m => m.id === id);
      if (asset && confirm(`Are you sure you want to delete asset "${asset.name}"?`)) {
        store.deleteMedia(id);
        toast.error(`Asset "${asset.name}" removed from library`);
        if (reRenderCallback) reRenderCallback();
      }
    });
  });

  // Add Media Modal
  const addBtn = document.getElementById("admin-add-media-btn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      openAddMediaModal(reRenderCallback);
    });
  }

  const emptyAddBtn = document.getElementById("empty-state-add-media-btn");
  if (emptyAddBtn) {
    emptyAddBtn.addEventListener("click", () => {
      mediaSearchQuery = "";
      openAddMediaModal(reRenderCallback);
    });
  }
}

function openAddMediaModal(onSaved) {
  const bodyHtml = `
    <form id="add-media-form" style="display: flex; flex-direction: column; gap: var(--space-lg);">
      
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>Asset Upload & Details</span>
          </div>
        </div>
        <div class="form-section-body">
          ${renderImageUploader({
            id: "media-url",
            value: "",
            label: "Image / Asset File *",
            helperText: "Upload from PC (PNG, JPG, WEBP, GIF) or paste an image URL.",
            placeholder: "https://... or images/screenshot.png",
            aspect: "16/9"
          })}

          <div class="form-group" style="margin-top: var(--space-md);">
            <label class="form-label" for="media-name">Asset Name / Title *</label>
            <input type="text" class="form-input" id="media-name" required placeholder="e.g. shadow-leap-gameplay.png" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="media-usage">Usage Location</label>
              <input type="text" class="form-input" id="media-usage" placeholder="e.g. Shadow Leap Project, Hero Avatar" />
            </div>
            <div class="form-group">
              <label class="form-label" for="media-size">Estimated File Size</label>
              <input type="text" class="form-input" id="media-size" value="1.5 MB" placeholder="e.g. 800 KB" />
            </div>
          </div>
        </div>
      </div>

    </form>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-outline" id="modal-media-cancel-btn">Cancel</button>
    <button type="button" class="btn btn-primary" id="modal-media-save-btn">Add to Media Library</button>
  `;

  modal.open({
    title: "Add New Media Asset",
    bodyHtml,
    footerHtml,
    onOpen: (modalEl) => {
      const nameInput = modalEl.querySelector("#media-name");
      const sizeInput = modalEl.querySelector("#media-size");

      // Initialize ImageUploader with automatic name and size filling
      initImageUploader(modalEl, "media-url", {
        onChange: (val, meta) => {
          if (meta) {
            if (meta.name && nameInput && (!nameInput.value.trim() || nameInput.value === "image.png")) {
              nameInput.value = meta.name;
            }
            if (meta.size && sizeInput) {
              sizeInput.value = meta.size;
            }
          }
        }
      });

      modalEl.querySelector("#modal-media-cancel-btn").addEventListener("click", () => modal.close());
      const saveBtn = modalEl.querySelector("#modal-media-save-btn");

      saveBtn.addEventListener("click", () => {
        const name = modalEl.querySelector("#media-name").value.trim();
        const url = modalEl.querySelector("#media-url").value.trim();
        const usageLocation = modalEl.querySelector("#media-usage").value.trim() || "Unassigned";
        const size = modalEl.querySelector("#media-size").value.trim() || "Unknown";

        if (!name || !url) {
          toast.error("Please upload an image or provide a valid URL, and enter an asset name.");
          return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = "⏳ Adding...";

        setTimeout(() => {
          store.addMedia({ name, url, usageLocation, size });
          toast.success(`Asset "${name}" added to Media Library!`);
          modal.close();
          if (onSaved) onSaved();
        }, 150);
      });
    }
  });
}
