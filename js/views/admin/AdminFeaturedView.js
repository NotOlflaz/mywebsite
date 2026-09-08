/**
 * Admin Featured Content Curation View
 * Features: Explicit Sequencing (Project #1, #2... / Video #1, #2...),
 * Drag-and-Drop Reordering, Add/Remove controls, and Three-state curation.
 */

import { store } from "../../store/state.js";
import { toast } from "../../components/Toast.js";
import { getIcon } from "../../utils/icons.js";
import { initDraggableList } from "../../utils/drag-drop.js";

export function renderAdminFeaturedView() {
  const allProjects = store.getProjects();
  const allVideos = store.getVideos();

  const featuredProjects = store.getFeaturedProjects();
  const featuredVideos = store.getFeaturedVideos();
  const nonFeaturedProjects = allProjects.filter(p => !p.isFeatured);
  const nonFeaturedVideos = allVideos.filter(v => !v.isFeatured);

  const featuredProjectsListHtml = featuredProjects.length > 0 ? featuredProjects.map((p, idx) => `
    <div class="home-section-card draggable-card" data-id="${p.id}" data-index="${idx}" id="featured-proj-card-${p.id}">
      <div class="flex items-center gap-sm">
        <span class="drag-handle" title="Drag to change display sequence">
          ${getIcon('dragHandle', 16)}
        </span>
        <span class="badge badge-featured font-mono" style="font-size: 11px; padding: 2px 8px;">
          #${idx + 1}
        </span>
        <div>
          <strong style="color: var(--text-main); font-size: var(--text-sm);">${p.title}</strong>
          <div class="text-xs text-muted">${p.category} • ${p.engine}</div>
        </div>
      </div>

      <div class="flex items-center gap-xs">
        <button type="button" class="btn btn-outline btn-sm remove-featured-proj-btn" data-id="${p.id}" title="Remove from Home Featured spotlight">
          ${getIcon('close', 12)} Unfeature
        </button>
      </div>
    </div>
  `).join("") : `
    <div class="empty-state-card" style="padding: var(--space-lg);">
      <p class="text-xs text-muted">No projects currently featured on the homepage. Select from the available projects below.</p>
    </div>
  `;

  const featuredVideosListHtml = featuredVideos.length > 0 ? featuredVideos.map((v, idx) => `
    <div class="home-section-card draggable-card" data-id="${v.id}" data-index="${idx}" id="featured-vid-card-${v.id}">
      <div class="flex items-center gap-sm">
        <span class="drag-handle" title="Drag to change display sequence">
          ${getIcon('dragHandle', 16)}
        </span>
        <span class="badge badge-featured font-mono" style="font-size: 11px; padding: 2px 8px;">
          #${idx + 1}
        </span>
        <div>
          <strong style="color: var(--text-main); font-size: var(--text-sm);">${v.title}</strong>
          <div class="text-xs text-muted">${v.category} • ${v.views || '0 views'}</div>
        </div>
      </div>

      <div class="flex items-center gap-xs">
        <button type="button" class="btn btn-outline btn-sm remove-featured-vid-btn" data-id="${v.id}" title="Remove from Home Featured spotlight">
          ${getIcon('close', 12)} Unfeature
        </button>
      </div>
    </div>
  `).join("") : `
    <div class="empty-state-card" style="padding: var(--space-lg);">
      <p class="text-xs text-muted">No videos currently featured. Select from available videos below.</p>
    </div>
  `;

  return `
    <div class="admin-featured-page">
      
      <!-- Page Header -->
      <div class="admin-page-header">
        <div class="admin-page-header-info">
          <h1>Featured Content Sequencing</h1>
          <p>Curate and set the exact display order (Project #1, Project #2... / Video #1, Video #2...) for items shown in the homepage spotlights.</p>
        </div>
        <a href="#/" target="_blank" class="btn btn-secondary btn-sm">
          ${getIcon('eye', 13)} Preview Live Home Page ↗
        </a>
      </div>

      <!-- 1. FEATURED PROJECTS ORDERING -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>Featured Projects Order (${featuredProjects.length} Active)</span>
          </div>
          <span class="text-xs text-muted">Drag ⠿ to reorder positions</span>
        </div>
        <div class="form-section-body">
          <div style="display: flex; flex-direction: column; gap: var(--space-xs);" id="featured-projects-sortable-list">
            ${featuredProjectsListHtml}
          </div>

          ${nonFeaturedProjects.length > 0 ? `
            <div style="margin-top: var(--space-md); padding-top: var(--space-md); border-top: 1px dashed var(--border-color);">
              <label class="form-label" style="font-size: 12px;">+ Add Available Project to Featured Spotlight:</label>
              <div class="flex gap-xs flex-wrap">
                ${nonFeaturedProjects.map(p => `
                  <button type="button" class="btn btn-outline btn-sm add-to-featured-proj-btn" data-id="${p.id}">
                    + ${p.title}
                  </button>
                `).join("")}
              </div>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- 2. FEATURED VIDEOS ORDERING -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>Featured Videos Order (${featuredVideos.length} Active)</span>
          </div>
          <span class="text-xs text-muted">Drag ⠿ to reorder positions</span>
        </div>
        <div class="form-section-body">
          <div style="display: flex; flex-direction: column; gap: var(--space-xs);" id="featured-videos-sortable-list">
            ${featuredVideosListHtml}
          </div>

          ${nonFeaturedVideos.length > 0 ? `
            <div style="margin-top: var(--space-md); padding-top: var(--space-md); border-top: 1px dashed var(--border-color);">
              <label class="form-label" style="font-size: 12px;">+ Add Available Video to Featured Spotlight:</label>
              <div class="flex gap-xs flex-wrap">
                ${nonFeaturedVideos.map(v => `
                  <button type="button" class="btn btn-outline btn-sm add-to-featured-vid-btn" data-id="${v.id}">
                    + ${v.title}
                  </button>
                `).join("")}
              </div>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Sticky Action Bar -->
      <div class="admin-sticky-bar">
        <div class="admin-sticky-bar-left">
          <span style="color: var(--status-active-text);">${getIcon('sparkles', 14)}</span>
          <span>Featured spotlights sequence #1, #2... directly on the Home page.</span>
        </div>
        <div class="admin-sticky-bar-right">
          <a href="#/" target="_blank" class="btn btn-outline">
            ${getIcon('eye', 13)} Preview Live
          </a>
          <button type="button" class="btn btn-primary" id="btn-refresh-featured">
            💾 Save & Refresh Order
          </button>
        </div>
      </div>

    </div>
  `;
}

export function initAdminFeaturedEvents(reRenderCallback) {
  const refreshBtn = document.getElementById("btn-refresh-featured");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      toast.success("Featured curation confirmed and active on homepage!");
      if (reRenderCallback) reRenderCallback();
    });
  }
  // Drag & drop for Featured Projects
  const projContainer = document.getElementById("featured-projects-sortable-list");
  if (projContainer) {
    initDraggableList({
      container: projContainer,
      itemSelector: ".draggable-card",
      handleSelector: ".drag-handle",
      onReorder: (fromIdx, toIdx) => {
        store.reorderFeaturedProjects(fromIdx, toIdx);
        toast.info("Featured projects sequence updated!");
        if (reRenderCallback) reRenderCallback();
      }
    });
  }

  // Drag & drop for Featured Videos
  const vidContainer = document.getElementById("featured-videos-sortable-list");
  if (vidContainer) {
    initDraggableList({
      container: vidContainer,
      itemSelector: ".draggable-card",
      handleSelector: ".drag-handle",
      onReorder: (fromIdx, toIdx) => {
        store.reorderFeaturedVideos(fromIdx, toIdx);
        toast.info("Featured videos sequence updated!");
        if (reRenderCallback) reRenderCallback();
      }
    });
  }

  // Add / Remove Project Featured
  document.querySelectorAll(".add-to-featured-proj-btn, .remove-featured-proj-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      store.toggleProjectFeatured(id);
      toast.success("Featured projects updated!");
      if (reRenderCallback) reRenderCallback();
    });
  });

  // Add / Remove Video Featured
  document.querySelectorAll(".add-to-featured-vid-btn, .remove-featured-vid-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      store.toggleVideoFeatured(id);
      toast.success("Featured videos updated!");
      if (reRenderCallback) reRenderCallback();
    });
  });
}
