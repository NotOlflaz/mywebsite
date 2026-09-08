/**
 * Reusable Project Detail Page View
 * Shows full specifications, hero banner, gameplay overview, feature list,
 * screenshot gallery, development info, video demo, and configurable action buttons.
 */

import { store } from "../../store/state.js";
import { authStore } from "../../store/auth.js";
import { getIcon } from "../../utils/icons.js";

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderSidebarActionButtons(project) {
  if (Array.isArray(project.actionButtons) && project.actionButtons.length > 0) {
    const activeBtns = project.actionButtons.filter(b => b.enabled !== false && b.url);
    if (activeBtns.length > 0) {
      return activeBtns.map(btn => `
        <a href="${btn.url}" target="_blank" rel="noopener noreferrer" class="btn btn-${btn.style || 'primary'} btn-block">
          ${escapeHtml(btn.label || 'Action')} ↗
        </a>
      `).join("");
    }
  }
  let buttons = [];
  if (project.demoUrl) {
    buttons.push(`
      <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-block">
        Play / Download Demo ↗
      </a>
    `);
  }
  if (project.githubUrl) {
    buttons.push(`
      <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-block">
        View Source Code on GitHub ↗
      </a>
    `);
  }
  if (project.youtubeUrl) {
    buttons.push(`
      <a href="${project.youtubeUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-block">
        Watch Video Devlog ↗
      </a>
    `);
  }
  return buttons.join("");
}

export function renderProjectDetailView(params) {
  const projectId = params.id;
  const project = store.getProjectById(projectId);

  if (!project) {
    return `
      <div class="container section text-center" style="padding-top: var(--space-3xl);">
        <div class="card" style="max-width: 600px; margin: 0 auto; padding: var(--space-2xl);">
          <div class="empty-state-icon" style="margin-bottom: 12px;">${getIcon("search", 40)}</div>
          <h2>Project Not Found</h2>
          <p style="margin-top: 8px; margin-bottom: 24px;">The project you are looking for might have been moved or deleted.</p>
          <a href="#/projects" class="btn btn-primary">
            &larr; Back to All Projects
          </a>
        </div>
      </div>
    `;
  }

  // Check if draft and not admin
  const isDraft = (project.publishStatus || "published") === "draft";
  const isAdmin = authStore.isAuthenticated();
  if (isDraft && !isAdmin) {
    return `
      <div class="container section text-center" style="padding-top: var(--space-3xl);">
        <div class="card" style="max-width: 600px; margin: 0 auto; padding: var(--space-2xl);">
          <div class="empty-state-icon" style="margin-bottom: 12px;">${getIcon("draft", 40)}</div>
          <h2>Unpublished Project Draft</h2>
          <p style="margin-top: 8px; margin-bottom: 24px; color: var(--text-muted);">This project is currently saved as a draft and is not yet publicly visible.</p>
          <a href="#/projects" class="btn btn-primary">
            &larr; Back to Published Projects
          </a>
        </div>
      </div>
    `;
  }

  const featuresListHtml = (project.features && project.features.length > 0) ? `
    <div class="about-block">
      <h3 class="about-block-title">Key Features & Mechanics</h3>
      <ul style="display: flex; flex-direction: column; gap: 8px; font-size: var(--text-base); padding-left: 20px;">
        ${project.features.map(f => `<li>${escapeHtml(f)}</li>`).join("")}
      </ul>
    </div>
  ` : '';

  const techBadgesHtml = (project.technologies || []).map(t => `
    <span class="badge font-mono" style="font-size: var(--text-sm); padding: 6px 12px;">${escapeHtml(t)}</span>
  `).join("");

  const screenshotsHtml = (project.screenshots && project.screenshots.length > 0) ? `
    <div class="about-block">
      <h3 class="about-block-title">Screenshots & Media Gallery</h3>
      <div class="project-gallery-grid">
        ${project.screenshots.map((s, idx) => `
          <div class="gallery-thumbnail">
            ${s ? `<img src="${s}" alt="${project.title} Screenshot ${idx + 1}" loading="lazy" />` : `
              <div class="card-media-placeholder">
                ${getIcon("image", 24)}
                <span>[ Gallery Screenshot #${idx + 1} Placeholder ]</span>
              </div>
            `}
          </div>
        `).join("")}
      </div>
    </div>
  ` : '';

  return `
    <div class="project-detail-root">
      <div class="container section" style="padding-top: var(--space-xl);">
        
        <!-- Draft Notice if Admin -->
        ${isDraft ? `
          <div class="badge badge-draft" style="font-size: 13px; padding: 6px 14px; margin-bottom: var(--space-md); display: inline-flex; align-items: center; gap: 6px;">
            ${getIcon("draft", 14)} <strong>Admin Preview Mode:</strong> This project is currently in DRAFT status.
          </div>
        ` : ''}

        <!-- Breadcrumb & Back Navigation -->
        <nav class="flex items-center justify-between gap-md flex-wrap" style="margin-bottom: var(--space-lg);" aria-label="Breadcrumb">
          <a href="#/projects" class="btn btn-outline btn-sm">
            &larr; Back to Projects Catalog
          </a>
          <div class="flex items-center gap-xs">
            <span class="badge ${project.isFeatured ? 'badge-featured' : ''}">${project.category || 'Game'}</span>
            <span class="badge ${project.status === 'Completed' ? 'badge-status-completed' : 'badge-status-in-progress'}">
              ${project.status}
            </span>
          </div>
        </nav>

        <!-- Project Hero Header -->
        <div class="project-detail-header reveal-init">
          <h1 style="font-size: 2.75rem; margin-bottom: 8px;">${project.title}</h1>
          <p style="font-size: var(--text-xl); color: var(--text-muted); max-width: 800px;">
            ${project.shortDesc}
          </p>
        </div>

        <!-- Hero Media Banner -->
        <div class="project-detail-hero-media reveal-init stagger-1">
          ${project.thumbnail ? `
            <img src="${project.thumbnail}" alt="${project.title} Hero Banner" />
          ` : `
            <div class="card-media-placeholder">
              <div style="color: var(--accent-primary); margin-bottom: 8px;">${getIcon("projects", 44)}</div>
              <span style="font-size: var(--text-base);">[ ${project.title} Main Gameplay Banner / Hero Screenshot ]</span>
            </div>
          `}
        </div>

        <!-- Split Grid: Main Content & Sidebar Specs -->
        <div class="project-detail-grid">
          
          <!-- Main Content Column -->
          <div style="display: flex; flex-direction: column; gap: var(--space-2xl);">
            
            <!-- Overview & Story -->
            <div class="card reveal-init stagger-1" style="padding: var(--space-xl);">
              <h3 style="font-size: var(--text-xl); margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border-color);">
                Project Overview & Description
              </h3>
              <p style="font-size: var(--text-base); line-height: 1.8; color: var(--text-main);">
                ${project.fullDesc || project.shortDesc}
              </p>
            </div>

            <!-- Features -->
            <div class="card reveal-init stagger-2" style="padding: var(--space-xl);">
              ${featuresListHtml}
            </div>

            <!-- Screenshots Gallery -->
            <div class="card reveal-init stagger-2" style="padding: var(--space-xl);">
              ${screenshotsHtml}
            </div>

            <!-- Video / Demo Showcase -->
            ${project.youtubeUrl ? `
              <div class="card reveal-init stagger-3" style="padding: var(--space-xl);">
                <h3 class="about-block-title" style="margin-bottom: 16px;">Video Gameplay & Devlog</h3>
                <div style="background-color: var(--bg-surface-alt); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: var(--space-xl); text-align: center;">
                  <div style="color: var(--accent-primary); margin-bottom: 8px;">${getIcon("play", 32)}</div>
                  <p style="margin-bottom: 16px;">Watch the gameplay showcase and development breakdown on YouTube.</p>
                  <a href="${project.youtubeUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                    Watch Video Showcase on YouTube ↗
                  </a>
                </div>
              </div>
            ` : ''}

          </div>

          <!-- Sidebar Column: Specifications & Links -->
          <aside class="project-specs-card reveal-init stagger-2">
            <h3 style="font-size: var(--text-lg); padding-bottom: 8px; border-bottom: 1px solid var(--border-color);">
              Project Specifications
            </h3>

            <div class="spec-item">
              <span class="spec-label">Game Engine / Platform</span>
              <span class="spec-value">${project.engine || 'Godot Engine'}</span>
            </div>

            <div class="spec-item">
              <span class="spec-label">Development Status</span>
              <span class="spec-value">${project.status || 'Active'}</span>
            </div>

            <div class="spec-item">
              <span class="spec-label">Timeline / Dev Date</span>
              <span class="spec-value">${project.devDate || '2024'}</span>
            </div>

            <div class="spec-item">
              <span class="spec-label">Category</span>
              <span class="spec-value">${project.category || 'Game'}</span>
            </div>

            <div class="spec-item">
              <span class="spec-label">Technologies & Tools</span>
              <div class="flex gap-xs flex-wrap" style="margin-top: 6px;">
                ${techBadgesHtml}
              </div>
            </div>

            <!-- Configurable Action Links -->
            <div style="display: flex; flex-direction: column; gap: var(--space-xs); margin-top: var(--space-sm);">
              ${renderSidebarActionButtons(project)}
              <a href="#/projects" class="btn btn-outline btn-block" style="margin-top: 8px;">
                &larr; Return to All Projects
              </a>
            </div>

          </aside>

        </div>

      </div>
    </div>
  `;
}

