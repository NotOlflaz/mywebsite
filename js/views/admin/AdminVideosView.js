/**
 * Admin Video Management View
 * Features: Structured Add/Edit Sections, Search, Filter, Live CRUD, Save Feedback, and Empty States.
 */

import { store } from "../../store/state.js";
import { modal } from "../../components/Modal.js";
import { toast } from "../../components/Toast.js";
import { getIcon } from "../../utils/icons.js";

let videoSearchQuery = "";
let videoCategoryFilter = "All";

export function renderAdminVideosView() {
  const allVideos = store.getVideos();
  const categories = ["All", ...new Set(allVideos.map(v => v.category).filter(Boolean))];

  const filteredVideos = allVideos.filter(v => {
    const matchesCat = videoCategoryFilter === "All" || v.category === videoCategoryFilter;
    const matchesSearch = !videoSearchQuery ||
      v.title.toLowerCase().includes(videoSearchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(videoSearchQuery.toLowerCase()) ||
      (v.tags || []).some(t => t.toLowerCase().includes(videoSearchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const tableRowsHtml = filteredVideos.length > 0 ? filteredVideos.map(video => `
    <tr id="admin-video-row-${video.id}">
      <td>
        <div class="flex items-center gap-sm">
          <div style="width: 48px; height: 28px; background: var(--bg-surface-alt); border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 10px;">
            ${video.thumbnail ? `<img src="${video.thumbnail}" style="width:100%;height:100%;object-fit:cover;" />` : getIcon('play', 12)}
          </div>
          <div>
            <strong style="color: var(--text-main); font-size: var(--text-sm);">${video.title}</strong>
            <div class="text-xs text-muted" style="max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${video.description}
            </div>
          </div>
        </div>
      </td>
      <td><span class="badge">${video.category || 'General'}</span></td>
      <td class="font-mono text-xs">${video.views || '0'}</td>
      <td class="text-xs">${video.uploadDate || '-'}</td>
      <td>
        <button 
          class="badge ${video.isFeatured ? 'badge-featured' : ''} toggle-video-featured-btn" 
          data-id="${video.id}"
          style="cursor: pointer;"
          title="Click to toggle featured on Home page & Spotlight">
          ${video.isFeatured ? 'Featured' : 'Standard'}
        </button>
      </td>
      <td>
        <div class="table-actions">
          <a href="${video.youtubeUrl || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="Watch on YouTube">
            ${getIcon('external', 13)}
          </a>
          <button class="btn btn-secondary btn-sm edit-video-btn" data-id="${video.id}" title="Edit Video">
            ${getIcon('edit', 13)} Edit
          </button>
          <button class="btn btn-danger btn-sm delete-video-btn" data-id="${video.id}" title="Delete Video">
            ${getIcon('trash', 13)}
          </button>
        </div>
      </td>
    </tr>
  `).join("") : '';

  return `
    <div class="admin-videos-page">
      
      <!-- Page Header -->
      <div class="admin-page-header">
        <div class="admin-page-header-info">
          <h1>Videos Management</h1>
          <p>Add, edit, feature, and organize YouTube tutorials, Minecraft challenge videos, and Godot devlogs.</p>
        </div>
        <button class="btn btn-primary" id="admin-add-video-btn">
          ${getIcon('plus', 14)} Add New Video
        </button>
      </div>

      <!-- Search & Filter Toolbar -->
      <div class="admin-table-toolbar">
        <div class="admin-search-filter-group">
          <input 
            type="text" 
            class="form-input" 
            id="admin-video-search-input" 
            placeholder="Search videos by title, description, or tags..." 
            value="${videoSearchQuery}" 
            style="max-width: 300px;"
          />
          <select class="form-select" id="admin-video-category-filter" style="max-width: 200px;">
            ${categories.map(c => `<option value="${c}" ${c === videoCategoryFilter ? 'selected' : ''}>${c}</option>`).join("")}
          </select>
        </div>
        <div class="text-xs text-muted font-mono">
          Showing ${filteredVideos.length} of ${allVideos.length} videos
        </div>
      </div>

      <!-- Videos Table or Empty State -->
      ${filteredVideos.length > 0 ? `
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Video Title & Details</th>
                <th>Category</th>
                <th>Views</th>
                <th>Date</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${tableRowsHtml}
            </tbody>
          </table>
        </div>
      ` : `
        <div class="empty-state-card">
          <div class="empty-state-icon">${getIcon('videos', 32)}</div>
          <h3 class="empty-state-title">No Videos Found</h3>
          <p class="empty-state-desc">
            ${videoSearchQuery || videoCategoryFilter !== 'All' 
              ? 'No videos match your current search or category filter. Try clearing filters or add a new video.'
              : 'You have not added any videos yet. Add your YouTube tutorials or devlogs to showcase them.'}
          </p>
          <button class="btn btn-primary" id="empty-state-add-video-btn">
            ${getIcon('plus', 14)} Add Your First Video
          </button>
        </div>
      `}

    </div>
  `;
}

/**
 * Event handlers for video CRUD
 */
export function initAdminVideosEvents(reRenderCallback) {
  // Search & Filter
  const searchInput = document.getElementById("admin-video-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      videoSearchQuery = e.target.value;
      if (reRenderCallback) reRenderCallback();
    });
  }

  const categorySelect = document.getElementById("admin-video-category-filter");
  if (categorySelect) {
    categorySelect.addEventListener("change", (e) => {
      videoCategoryFilter = e.target.value;
      if (reRenderCallback) reRenderCallback();
    });
  }

  // Toggle Featured
  const toggleBtns = document.querySelectorAll(".toggle-video-featured-btn");
  toggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const isFeatured = store.toggleVideoFeatured(id);
      toast.success(`Video featured status set to ${isFeatured ? 'Featured' : 'Standard'}`);
      if (reRenderCallback) reRenderCallback();
    });
  });

  // Add Video Button
  const addBtn = document.getElementById("admin-add-video-btn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      openVideoFormModal(null, reRenderCallback);
    });
  }

  const emptyAddBtn = document.getElementById("empty-state-add-video-btn");
  if (emptyAddBtn) {
    emptyAddBtn.addEventListener("click", () => {
      videoSearchQuery = "";
      videoCategoryFilter = "All";
      openVideoFormModal(null, reRenderCallback);
    });
  }

  // Edit Video Buttons
  const editBtns = document.querySelectorAll(".edit-video-btn");
  editBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const video = store.getVideoById(id);
      if (video) {
        openVideoFormModal(video, reRenderCallback);
      }
    });
  });

  // Delete Video Buttons
  const deleteBtns = document.querySelectorAll(".delete-video-btn");
  deleteBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const video = store.getVideoById(id);
      if (video && confirm(`Are you sure you want to delete video "${video.title}"?\nThis action cannot be undone.`)) {
        store.deleteVideo(id);
        toast.error(`Video "${video.title}" was deleted`);
        if (reRenderCallback) reRenderCallback();
      }
    });
  });
}

function openVideoFormModal(videoToEdit = null, onSaved = null) {
  const isEdit = !!videoToEdit;
  const video = videoToEdit || {
    title: "",
    youtubeUrl: "",
    thumbnail: "",
    description: "",
    views: "0 views",
    uploadDate: "Just now",
    category: "Godot Tutorials",
    tags: ["Godot", "Tutorial"],
    isFeatured: false
  };

  const bodyHtml = `
    <form id="video-crud-form" style="display: flex; flex-direction: column; gap: var(--space-lg);">
      
      <!-- 1. BASIC INFORMATION -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>1. Basic Video Information</span>
          </div>
        </div>
        <div class="form-section-body">
          <div class="form-group">
            <label class="form-label" for="video-title">Video Title *</label>
            <input type="text" class="form-input" id="video-title" required value="${escapeHtml(video.title)}" placeholder="e.g. Building a 2D Platformer in Godot 4" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="video-url">YouTube URL *</label>
              <input type="url" class="form-input" id="video-url" required value="${escapeHtml(video.youtubeUrl)}" placeholder="https://www.youtube.com/watch?v=..." />
            </div>

            <div class="form-group">
              <label class="form-label" for="video-category">Category *</label>
              <select class="form-select" id="video-category">
                <option value="Godot Tutorials" ${video.category === 'Godot Tutorials' ? 'selected' : ''}>Godot Tutorials</option>
                <option value="Minecraft" ${video.category === 'Minecraft' ? 'selected' : ''}>Minecraft</option>
                <option value="Devlogs" ${video.category === 'Devlogs' ? 'selected' : ''}>Devlogs</option>
                <option value="Gameplay" ${video.category === 'Gameplay' ? 'selected' : ''}>Gameplay</option>
                <option value="Shorts" ${video.category === 'Shorts' ? 'selected' : ''}>Shorts</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. METRICS & DATES -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>2. Display Metrics & Timeline</span>
          </div>
        </div>
        <div class="form-section-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="video-views">Views Display String</label>
              <input type="text" class="form-input" id="video-views" value="${escapeHtml(video.views)}" placeholder="e.g. 142.5K views" />
            </div>

            <div class="form-group">
              <label class="form-label" for="video-date">Upload Date Label</label>
              <input type="text" class="form-input" id="video-date" value="${escapeHtml(video.uploadDate)}" placeholder="e.g. 2 weeks ago" />
            </div>
          </div>
        </div>
      </div>

      <!-- 3. MEDIA & DETAILS -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>3. Thumbnail & Summary</span>
          </div>
        </div>
        <div class="form-section-body">
          <div class="form-group">
            <label class="form-label" for="video-thumbnail">Custom Thumbnail Image URL (Optional)</label>
            <input type="text" class="form-input" id="video-thumbnail" value="${escapeHtml(video.thumbnail)}" placeholder="https://... or copy asset URL from Media Library" />
            <span class="form-helper">If empty, YouTube default thumbnail placeholder will be used.</span>
          </div>

          <div class="form-group">
            <label class="form-label" for="video-description">Video Summary Description</label>
            <textarea class="form-textarea" id="video-description" rows="3" placeholder="Summary of topics covered in this video...">${escapeHtml(video.description)}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="video-tags">Tags (Comma-separated)</label>
            <input type="text" class="form-input" id="video-tags" value="${escapeHtml((video.tags || []).join(', '))}" placeholder="Godot, Tutorial, Minecraft, GDScript" />
          </div>
        </div>
      </div>

      <!-- 4. PUBLISHING & FEATURED -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>4. Featured Spotlight</span>
          </div>
        </div>
        <div class="form-section-body">
          <div class="form-group">
            <label class="form-checkbox-label">
              <input type="checkbox" id="video-featured" ${video.isFeatured ? 'checked' : ''} />
              <span><strong>Mark as Featured Video</strong> (Featured on Home Page & Videos Spotlight banner)</span>
            </label>
          </div>
        </div>
      </div>

    </form>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-outline" id="modal-cancel-btn">Cancel</button>
    <button type="button" class="btn btn-primary" id="modal-save-video-btn">${isEdit ? 'Save Changes' : 'Publish Video'}</button>
  `;

  modal.open({
    title: isEdit ? `Edit Video: ${video.title}` : "Add New Video",
    bodyHtml,
    footerHtml,
    onOpen: (modalEl) => {
      const cancelBtn = modalEl.querySelector("#modal-cancel-btn");
      const saveBtn = modalEl.querySelector("#modal-save-video-btn");

      cancelBtn.addEventListener("click", () => modal.close());

      saveBtn.addEventListener("click", () => {
        const title = modalEl.querySelector("#video-title").value.trim();
        const youtubeUrl = modalEl.querySelector("#video-url").value.trim();
        const category = modalEl.querySelector("#video-category").value;
        const views = modalEl.querySelector("#video-views").value.trim() || "0 views";
        const uploadDate = modalEl.querySelector("#video-date").value.trim() || "Recently";
        const thumbnail = modalEl.querySelector("#video-thumbnail").value.trim();
        const description = modalEl.querySelector("#video-description").value.trim();
        const tagsRaw = modalEl.querySelector("#video-tags").value;
        const isFeatured = modalEl.querySelector("#video-featured").checked;

        if (!title) {
          toast.error("Video title is required");
          modalEl.querySelector("#video-title").focus();
          return;
        }

        if (!youtubeUrl) {
          toast.error("YouTube URL is required");
          modalEl.querySelector("#video-url").focus();
          return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = "⏳ Saving...";

        const tags = tagsRaw.split(",").map(t => t.trim()).filter(Boolean);

        const payload = {
          title,
          youtubeUrl,
          category,
          views,
          uploadDate,
          thumbnail,
          description,
          tags,
          isFeatured
        };

        setTimeout(() => {
          if (isEdit) {
            store.updateVideo(video.id, payload);
            toast.success(`Video "${title}" updated successfully!`);
          } else {
            store.addVideo(payload);
            toast.success(`New video "${title}" added successfully!`);
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
