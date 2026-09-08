/**
 * Admin Video Management View
 * Features: YouTube Metadata Auto-Fill, PC Custom Thumbnail Upload,
 * Drag-and-Drop Reordering, Draft/Published Publishing Workflow,
 * Search, Category Filtering, Live CRUD, and Toast Feedback.
 */

import { store } from "../../store/state.js";
import { modal } from "../../components/Modal.js";
import { toast } from "../../components/Toast.js";
import { getIcon } from "../../utils/icons.js";
import { extractYouTubeVideoId, getYouTubeThumbnailUrl, fetchYouTubeMetadata } from "../../utils/youtube.js";
import { renderImageUploader, initImageUploader } from "../../components/ImageUploader.js";
import { initDraggableList } from "../../utils/drag-drop.js";

let videoSearchQuery = "";
let videoCategoryFilter = "All";
let videoStatusFilter = "All"; // "All", "published", "draft"

export function renderAdminVideosView() {
  const allVideos = store.getVideos();
  const categories = ["All", ...new Set(allVideos.map(v => v.category).filter(Boolean))];

  const filteredVideos = allVideos.filter(v => {
    const matchesCat = videoCategoryFilter === "All" || v.category === videoCategoryFilter;
    const matchesStatus = videoStatusFilter === "All" || (v.publishStatus || "published") === videoStatusFilter;
    const matchesSearch = !videoSearchQuery ||
      v.title.toLowerCase().includes(videoSearchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(videoSearchQuery.toLowerCase()) ||
      (v.tags || []).some(t => t.toLowerCase().includes(videoSearchQuery.toLowerCase()));
    return matchesCat && matchesStatus && matchesSearch;
  });

  const tableRowsHtml = filteredVideos.length > 0 ? filteredVideos.map((video, idx) => {
    const displayThumb = video.thumbnail || (video.youtubeId ? getYouTubeThumbnailUrl(video.youtubeId) : (video.youtubeUrl ? getYouTubeThumbnailUrl(video.youtubeUrl) : ''));
    const isPublished = (video.publishStatus || "published") === "published";

    return `
      <tr class="draggable-row" data-id="${video.id}" data-index="${idx}" id="admin-video-row-${video.id}">
        <td style="width: 38px; text-align: center;">
          <span class="drag-handle" title="Drag to reorder video display sequence">
            ${getIcon('dragHandle', 16)}
          </span>
        </td>
        <td>
          <div class="flex items-center gap-sm">
            <div style="width: 54px; height: 34px; background: var(--bg-surface-alt); border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 10px; position: relative; flex-shrink: 0;">
              ${displayThumb ? `<img src="${displayThumb}" style="width:100%;height:100%;object-fit:cover;" loading="lazy" />` : getIcon('play', 12)}
              ${video.thumbnail ? `<span style="position: absolute; bottom: 1px; right: 1px; width: 6px; height: 6px; border-radius: 50%; background: var(--accent-primary);" title="Custom uploaded thumbnail"></span>` : ''}
            </div>
            <div>
              <div class="flex items-center gap-xs">
                <strong style="color: var(--text-main); font-size: var(--text-sm);">${video.title}</strong>
              </div>
              <div class="text-xs text-muted" style="max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${video.description || 'No description provided.'}
              </div>
            </div>
          </div>
        </td>
        <td><span class="badge">${video.category || 'General'}</span></td>
        <td>
          <button 
            type="button" 
            class="badge ${isPublished ? 'badge-published' : 'badge-draft'} toggle-video-status-btn" 
            data-id="${video.id}"
            style="cursor: pointer; border-radius: var(--radius-xs);"
            title="Click to toggle Draft / Published status">
            ${isPublished ? '● Published' : '○ Draft'}
          </button>
        </td>
        <td class="font-mono text-xs">${video.views || '0 views'}</td>
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
    `;
  }).join("") : '';

  return `
    <div class="admin-videos-page">
      
      <!-- Page Header -->
      <div class="admin-page-header">
        <div class="admin-page-header-info">
          <h1>Videos Management</h1>
          <p>Add, edit, feature, and reorder YouTube tutorials, Minecraft devlogs, and game development videos with instant metadata auto-fill.</p>
        </div>
        <div class="flex gap-xs">
          <a href="#/videos" target="_blank" class="btn btn-secondary btn-sm">
            ${getIcon('eye', 13)} Preview Videos Page ↗
          </a>
          <button class="btn btn-primary btn-sm" id="admin-add-video-btn">
            ${getIcon('plus', 14)} Add New Video
          </button>
        </div>
      </div>

      <!-- Search, Status Filter & Category Toolbar -->
      <div class="admin-table-toolbar">
        <div class="admin-search-filter-group flex-wrap">
          <input 
            type="text" 
            class="form-input" 
            id="admin-video-search-input" 
            placeholder="Search videos by title, description, or tags..." 
            value="${videoSearchQuery}" 
            style="max-width: 280px;"
          />
          <select class="form-select" id="admin-video-category-filter" style="max-width: 170px;">
            ${categories.map(c => `<option value="${c}" ${c === videoCategoryFilter ? 'selected' : ''}>Category: ${c}</option>`).join("")}
          </select>
          <select class="form-select" id="admin-video-status-filter" style="max-width: 150px;">
            <option value="All" ${videoStatusFilter === 'All' ? 'selected' : ''}>Status: All</option>
            <option value="published" ${videoStatusFilter === 'published' ? 'selected' : ''}>Status: Published</option>
            <option value="draft" ${videoStatusFilter === 'draft' ? 'selected' : ''}>Status: Draft</option>
          </select>
        </div>
        <div class="text-xs text-muted font-mono">
          Showing ${filteredVideos.length} of ${allVideos.length} videos • Drag ⠿ to reorder
        </div>
      </div>

      <!-- Videos Table or Empty State -->
      ${filteredVideos.length > 0 ? `
        <div class="table-responsive">
          <table class="data-table" id="admin-videos-table">
            <thead>
              <tr>
                <th style="width: 38px;"></th>
                <th>Video Title & Details</th>
                <th>Category</th>
                <th>Status</th>
                <th>Views</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="admin-videos-tbody">
              ${tableRowsHtml}
            </tbody>
          </table>
        </div>
      ` : `
        <div class="empty-state-card">
          <div class="empty-state-icon">${getIcon('videos', 32)}</div>
          <h3 class="empty-state-title">No Videos Found</h3>
          <p class="empty-state-desc">
            ${videoSearchQuery || videoCategoryFilter !== 'All' || videoStatusFilter !== 'All'
              ? 'No videos match your current search or filter criteria. Try clearing filters or add a new video.'
              : 'You have not added any videos yet. Add your YouTube tutorials or devlogs to showcase them.'}
          </p>
          <button class="btn btn-primary" id="empty-state-add-video-btn">
            ${getIcon('plus', 14)} Add Your First Video
          </button>
        </div>
      `}

      <!-- Sticky Quick Action Bar -->
      <div class="admin-sticky-bar">
        <div class="admin-sticky-bar-left">
          <span style="color: var(--status-active-text);">${getIcon('sparkles', 14)}</span>
          <span>${allVideos.length} total videos (${filteredVideos.length} shown) &bull; Drag ⠿ rows to reorder.</span>
        </div>
        <div class="admin-sticky-bar-right">
          <a href="#/videos" target="_blank" class="btn btn-outline">
            ${getIcon('eye', 13)} View Public Videos
          </a>
          <button type="button" class="btn btn-primary" id="sticky-add-video-btn">
            ${getIcon('plus', 14)} Add New Video
          </button>
        </div>
      </div>

    </div>
  `;
}

/**
 * Event handlers for video CRUD and Drag & Drop
 */
export function initAdminVideosEvents(reRenderCallback) {
  // Sticky Add Video button
  const stickyAddBtn = document.getElementById("sticky-add-video-btn");
  if (stickyAddBtn) {
    stickyAddBtn.addEventListener("click", () => {
      openVideoFormModal(null, reRenderCallback);
    });
  }

  // Initialize Drag & Drop Table Reordering
  const tbody = document.getElementById("admin-videos-tbody");
  if (tbody) {
    initDraggableList({
      container: tbody,
      itemSelector: "tr.draggable-row",
      handleSelector: ".drag-handle",
      onReorder: (fromIdx, toIdx) => {
        store.reorderVideos(fromIdx, toIdx);
        toast.info("Video sequence updated!");
        if (reRenderCallback) reRenderCallback();
      }
    });
  }

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

  const statusSelect = document.getElementById("admin-video-status-filter");
  if (statusSelect) {
    statusSelect.addEventListener("change", (e) => {
      videoStatusFilter = e.target.value;
      if (reRenderCallback) reRenderCallback();
    });
  }

  // Quick Toggle Published / Draft Status
  const statusToggleBtns = document.querySelectorAll(".toggle-video-status-btn");
  statusToggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const video = store.getVideoById(id);
      if (video) {
        const nextStatus = (video.publishStatus || "published") === "published" ? "draft" : "published";
        store.updateVideoPublishStatus(id, nextStatus);
        toast.success(`Video "${video.title}" set to ${nextStatus === 'published' ? 'Published' : 'Draft'}`);
        if (reRenderCallback) reRenderCallback();
      }
    });
  });

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
      videoStatusFilter = "All";
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
    publishStatus: "published",
    tags: ["Godot", "Tutorial"],
    isFeatured: false
  };

  const bodyHtml = `
    <form id="video-crud-form" style="display: flex; flex-direction: column; gap: var(--space-lg);">
      
      <!-- 1. BASIC INFORMATION & YOUTUBE AUTO-FILL -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>1. YouTube Link & Instant Auto-Fill</span>
          </div>
          <span class="text-xs text-accent" id="yt-autofill-status" style="display: none;">
            ${getIcon('wand', 13)} Auto-filling metadata...
          </span>
        </div>
        <div class="form-section-body">
          <div class="form-group">
            <label class="form-label" for="video-url">YouTube URL *</label>
            <div class="flex gap-xs">
              <input 
                type="url" 
                class="form-input" 
                id="video-url" 
                required 
                value="${escapeHtml(video.youtubeUrl)}" 
                placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..." 
                style="flex: 1;"
              />
              <button type="button" class="btn btn-secondary btn-sm" id="yt-manual-fetch-btn" title="Fetch video title & thumbnail from YouTube">
                ${getIcon('wand', 14)} Auto-Fill
              </button>
            </div>
            <span class="form-helper">Supports youtube.com/watch?v=, youtu.be/, and youtube.com/shorts/.</span>
          </div>

          <div class="form-group">
            <label class="form-label" for="video-title">Video Title *</label>
            <input type="text" class="form-input" id="video-title" required value="${escapeHtml(video.title)}" placeholder="e.g. Building a 2D Platformer in Godot 4" />
          </div>

          <div class="form-row">
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

            <div class="form-group">
              <label class="form-label" for="video-publish-status">Publishing Status *</label>
              <select class="form-select" id="video-publish-status">
                <option value="published" ${(video.publishStatus || 'published') === 'published' ? 'selected' : ''}>● Published (Visible on Public Website)</option>
                <option value="draft" ${(video.publishStatus || 'published') === 'draft' ? 'selected' : ''}>○ Draft (Admin Only / Hidden Publicly)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. METRICS & TIMELINE -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>2. Metrics & Display Timeline</span>
          </div>
        </div>
        <div class="form-section-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="video-views">Views Display String</label>
              <input type="text" class="form-input" id="video-views" value="${escapeHtml(video.views)}" placeholder="e.g. 142.5K views" />
            </div>

            <div class="form-group">
              <label class="form-label" for="video-date">Upload Date Display</label>
              <input type="text" class="form-input" id="video-date" value="${escapeHtml(video.uploadDate)}" placeholder="e.g. 2 weeks ago" />
            </div>
          </div>
        </div>
      </div>

      <!-- 3. THUMBNAIL & SUMMARY -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>3. Video Thumbnail & Details</span>
          </div>
        </div>
        <div class="form-section-body">
          
          <!-- Auto-Detected YouTube Thumbnail Banner -->
          <div id="youtube-auto-thumb-container" style="background: var(--bg-surface-alt); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: var(--space-md); margin-bottom: var(--space-sm);">
            <div class="flex items-center justify-between" style="margin-bottom: 8px;">
              <span class="text-xs font-bold flex items-center gap-xs text-main">
                <span style="color: #ef4444;">${getIcon("youtube", 16)}</span>
                <span>Automatic YouTube Thumbnail</span>
              </span>
              <span class="badge" id="yt-detect-status-badge" style="background: var(--accent-surface); color: var(--accent-text); border-color: var(--accent-border);">
                No Video Detected
              </span>
            </div>

            <div id="yt-thumb-preview-box" style="width: 100%; max-height: 200px; aspect-ratio: 16/9; background: #000; border-radius: var(--radius-sm); overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative;">
              <img id="yt-auto-thumb-img" src="" alt="YouTube Thumbnail Preview" style="width: 100%; height: 100%; object-fit: cover; display: none;" />
              <div id="yt-no-url-placeholder" class="text-xs text-muted text-center" style="padding: var(--space-md);">
                ${getIcon("play", 24)}
                <div style="margin-top: 6px;">Enter a YouTube URL above to automatically generate the thumbnail.</div>
              </div>
            </div>
            <div class="text-xs text-light" style="margin-top: 6px; font-size: 11px;">
              This official high-definition thumbnail is used across the site unless overridden below.
            </div>
          </div>

          <!-- Custom Thumbnail Upload (Optional Override) -->
          <div style="margin-top: var(--space-md);">
            ${renderImageUploader({
              id: "video-thumbnail",
              value: video.thumbnail,
              label: "Custom Thumbnail Override (Optional)",
              helperText: "Upload a custom PNG/JPG/WEBP from PC to override the default YouTube thumbnail.",
              placeholder: "https://... or upload from PC",
              aspect: "16/9"
            })}
          </div>

          <div class="form-group" style="margin-top: var(--space-md);">
            <label class="form-label" for="video-description">Video Summary Description</label>
            <textarea class="form-textarea" id="video-description" rows="3" placeholder="Summary of topics covered in this video...">${escapeHtml(video.description)}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="video-tags">Tags (Comma-separated)</label>
            <input type="text" class="form-input" id="video-tags" value="${escapeHtml((video.tags || []).join(', '))}" placeholder="Godot, Tutorial, Minecraft, GDScript" />
          </div>
        </div>
      </div>

      <!-- 4. FEATURED SPOTLIGHT -->
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
    <button type="button" class="btn btn-primary" id="modal-save-video-btn">${isEdit ? 'Save Changes' : 'Save Video'}</button>
  `;

  modal.open({
    title: isEdit ? `Edit Video: ${video.title}` : "Add New Video",
    bodyHtml,
    footerHtml,
    isLarge: true,
    onOpen: (modalEl) => {
      const cancelBtn = modalEl.querySelector("#modal-cancel-btn");
      const saveBtn = modalEl.querySelector("#modal-save-video-btn");
      const urlInput = modalEl.querySelector("#video-url");
      const titleInput = modalEl.querySelector("#video-title");
      const descInput = modalEl.querySelector("#video-description");
      const autoFillBtn = modalEl.querySelector("#yt-manual-fetch-btn");
      const autoFillStatus = modalEl.querySelector("#yt-autofill-status");
      const ytAutoImg = modalEl.querySelector("#yt-auto-thumb-img");
      const ytPlaceholder = modalEl.querySelector("#yt-no-url-placeholder");
      const ytStatusBadge = modalEl.querySelector("#yt-detect-status-badge");

      let userModifiedTitle = isEdit && Boolean(video.title);
      let userModifiedDesc = isEdit && Boolean(video.description);

      titleInput.addEventListener("input", () => { userModifiedTitle = true; });
      descInput.addEventListener("input", () => { userModifiedDesc = true; });

      // Initialize Reusable Image Uploader for custom thumbnail
      initImageUploader(modalEl, "video-thumbnail");

      // YouTube Auto-Fill Function
      const performYouTubeAutoFill = async (url) => {
        const videoId = extractYouTubeVideoId(url);
        if (!videoId) {
          if (ytAutoImg) ytAutoImg.style.display = "none";
          if (ytPlaceholder) ytPlaceholder.style.display = "block";
          if (ytStatusBadge) ytStatusBadge.textContent = "No Video Detected";
          return;
        }

        // Live preview of thumbnail
        const autoThumb = getYouTubeThumbnailUrl(videoId, "maxres");
        if (ytAutoImg) {
          ytAutoImg.src = autoThumb;
          ytAutoImg.style.display = "block";
          ytAutoImg.onerror = () => {
            ytAutoImg.src = getYouTubeThumbnailUrl(videoId, "hq");
          };
        }
        if (ytPlaceholder) ytPlaceholder.style.display = "none";
        if (ytStatusBadge) ytStatusBadge.textContent = `ID: ${videoId}`;

        // Fetch title & metadata
        if (autoFillStatus) autoFillStatus.style.display = "inline-flex";
        try {
          const meta = await fetchYouTubeMetadata(url);
          if (meta && meta.title) {
            // Only auto-fill if title is empty or not manually typed by user
            if (!titleInput.value.trim() || !userModifiedTitle) {
              titleInput.value = meta.title;
              userModifiedTitle = false;
            }
            if (meta.description && (!descInput.value.trim() || !userModifiedDesc)) {
              descInput.value = meta.description;
              userModifiedDesc = false;
            }
            toast.success(`Detected YouTube: "${meta.title}"`);
          }
        } catch (err) {
          // Graceful fallback
        } finally {
          if (autoFillStatus) autoFillStatus.style.display = "none";
        }
      };

      if (urlInput) {
        let debounceTimer = null;
        urlInput.addEventListener("input", () => {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            performYouTubeAutoFill(urlInput.value.trim());
          }, 350);
        });

        urlInput.addEventListener("paste", () => {
          setTimeout(() => performYouTubeAutoFill(urlInput.value.trim()), 50);
        });
      }

      if (autoFillBtn) {
        autoFillBtn.addEventListener("click", () => {
          const url = urlInput.value.trim();
          if (!url) {
            toast.error("Please enter a YouTube URL first.");
            urlInput.focus();
            return;
          }
          performYouTubeAutoFill(url);
        });
      }

      // Initial check on modal open
      if (video.youtubeUrl) {
        const videoId = extractYouTubeVideoId(video.youtubeUrl);
        if (videoId && ytAutoImg) {
          ytAutoImg.src = getYouTubeThumbnailUrl(videoId, "maxres");
          ytAutoImg.style.display = "block";
          if (ytPlaceholder) ytPlaceholder.style.display = "none";
          if (ytStatusBadge) ytStatusBadge.textContent = `ID: ${videoId}`;
        }
      }

      cancelBtn.addEventListener("click", () => modal.close());

      saveBtn.addEventListener("click", () => {
        const title = modalEl.querySelector("#video-title").value.trim();
        const youtubeUrl = modalEl.querySelector("#video-url").value.trim();
        const category = modalEl.querySelector("#video-category").value;
        const publishStatus = modalEl.querySelector("#video-publish-status").value;
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
        const youtubeId = extractYouTubeVideoId(youtubeUrl);

        const payload = {
          title,
          youtubeUrl,
          youtubeId,
          category,
          publishStatus,
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
