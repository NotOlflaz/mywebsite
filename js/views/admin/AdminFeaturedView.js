/**
 * Admin Featured Content Curation View
 * Select and manage featured projects, videos, and portfolio items shown on the public Home page.
 */

import { store } from "../../store/state.js";
import { toast } from "../../components/Toast.js";
import { getIcon } from "../../utils/icons.js";

export function renderAdminFeaturedView() {
  const projects = store.getProjects();
  const videos = store.getVideos();
  const portfolio = store.getPortfolio();

  const featuredProjects = projects.filter(p => p.isFeatured);
  const featuredVideos = videos.filter(v => v.isFeatured);
  const featuredPortfolio = portfolio.filter(item => item.isFeatured);

  return `
    <div class="admin-featured-page">
      
      <!-- Page Header -->
      <div class="admin-page-header">
        <div class="admin-page-header-info">
          <h1>Featured Content Curation</h1>
          <p>Curate exactly which projects, tutorials, and portfolio items appear on the public Home page and spotlight sections.</p>
        </div>
        <a href="#/" target="_blank" class="btn btn-secondary btn-sm">
          ${getIcon('eye', 13)} Preview Home Page
        </a>
      </div>

      <!-- 1. FEATURED PROJECTS -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>Featured Projects (${featuredProjects.length} Selected)</span>
          </div>
          <span class="text-xs text-muted">Recommended: 3 to 6 items</span>
        </div>
        <div class="form-section-body">
          <p class="text-sm text-muted">Toggle the checkboxes below to add or remove projects from the Home page "Featured Projects" section:</p>
          ${projects.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: var(--space-xs); margin-top: 8px;">
              ${projects.map(p => `
                <label class="form-checkbox-label" style="padding: var(--space-sm); border-radius: var(--radius-md); border: 1px solid var(--border-color); background: ${p.isFeatured ? 'var(--bg-surface-alt)' : 'var(--bg-surface)'};">
                  <input type="checkbox" class="featured-project-toggle" data-id="${p.id}" ${p.isFeatured ? 'checked' : ''} />
                  <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                    <div>
                      <strong style="font-size: var(--text-sm);">${p.title}</strong>
                      <span class="badge" style="margin-left: 8px;">${p.category}</span>
                    </div>
                    <span class="font-mono text-xs text-muted">${p.engine} • ${p.status}</span>
                  </div>
                </label>
              `).join("")}
            </div>
          ` : `
            <p class="text-sm">No projects created yet. <a href="#/admin/projects">Add projects first</a>.</p>
          `}
        </div>
      </div>

      <!-- 2. FEATURED VIDEOS -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>Featured Videos & Spotlights (${featuredVideos.length} Selected)</span>
          </div>
          <span class="text-xs text-muted">Recommended: 2 to 4 items</span>
        </div>
        <div class="form-section-body">
          <p class="text-sm text-muted">Toggle the checkboxes below to select videos for the Home page and Videos top spotlight player:</p>
          ${videos.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: var(--space-xs); margin-top: 8px;">
              ${videos.map(v => `
                <label class="form-checkbox-label" style="padding: var(--space-sm); border-radius: var(--radius-md); border: 1px solid var(--border-color); background: ${v.isFeatured ? 'var(--bg-surface-alt)' : 'var(--bg-surface)'};">
                  <input type="checkbox" class="featured-video-toggle" data-id="${v.id}" ${v.isFeatured ? 'checked' : ''} />
                  <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                    <div>
                      <strong style="font-size: var(--text-sm);">${v.title}</strong>
                      <span class="badge" style="margin-left: 8px;">${v.category}</span>
                    </div>
                    <span class="font-mono text-xs text-muted">${v.views}</span>
                  </div>
                </label>
              `).join("")}
            </div>
          ` : `
            <p class="text-sm">No videos created yet. <a href="#/admin/videos">Add videos first</a>.</p>
          `}
        </div>
      </div>

      <!-- 3. FEATURED PORTFOLIO -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>Featured Portfolio Items (${featuredPortfolio.length} Selected)</span>
          </div>
          <span class="text-xs text-muted">High-priority case studies</span>
        </div>
        <div class="form-section-body">
          ${portfolio.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: var(--space-xs);">
              ${portfolio.map(item => `
                <label class="form-checkbox-label" style="padding: var(--space-sm); border-radius: var(--radius-md); border: 1px solid var(--border-color); background: ${item.isFeatured ? 'var(--bg-surface-alt)' : 'var(--bg-surface)'};">
                  <input type="checkbox" class="featured-portfolio-toggle" data-id="${item.id}" ${item.isFeatured ? 'checked' : ''} />
                  <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                    <div>
                      <strong style="font-size: var(--text-sm);">${item.title}</strong>
                      <span class="badge" style="margin-left: 8px;">${item.category}</span>
                    </div>
                    <span class="text-xs text-muted">${item.role || 'Creator'}</span>
                  </div>
                </label>
              `).join("")}
            </div>
          ` : `
            <p class="text-sm">No portfolio items created yet. <a href="#/admin/portfolio">Add portfolio items</a>.</p>
          `}
        </div>
      </div>

    </div>
  `;
}

export function initAdminFeaturedEvents(reRenderCallback) {
  // Project checkboxes
  const projCheckboxes = document.querySelectorAll(".featured-project-toggle");
  projCheckboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      const id = cb.getAttribute("data-id");
      const isFeatured = store.toggleProjectFeatured(id);
      toast.success(`Project featured status set to ${isFeatured ? 'Featured' : 'Standard'}`);
      if (reRenderCallback) reRenderCallback();
    });
  });

  // Video checkboxes
  const videoCheckboxes = document.querySelectorAll(".featured-video-toggle");
  videoCheckboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      const id = cb.getAttribute("data-id");
      const isFeatured = store.toggleVideoFeatured(id);
      toast.success(`Video featured status set to ${isFeatured ? 'Featured' : 'Standard'}`);
      if (reRenderCallback) reRenderCallback();
    });
  });

  // Portfolio checkboxes
  const portCheckboxes = document.querySelectorAll(".featured-portfolio-toggle");
  portCheckboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      const id = cb.getAttribute("data-id");
      const isFeatured = store.togglePortfolioFeatured(id);
      toast.success(`Portfolio featured status set to ${isFeatured ? 'Featured' : 'Standard'}`);
      if (reRenderCallback) reRenderCallback();
    });
  });
}
