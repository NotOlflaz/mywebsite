/**
 * Admin Dashboard Home View
 * Metric counters, Quick Actions shortcuts, Content status, and Recent Activity list.
 */

import { store } from "../../store/state.js";
import { getIcon } from "../../utils/icons.js";

export function renderAdminDashboardView() {
  const metrics = store.getDashboardMetrics();
  const projects = store.getProjects().slice(0, 4);
  const videos = store.getVideos().slice(0, 4);

  return `
    <div class="admin-dashboard-page">
      
      <!-- Page Header -->
      <div class="admin-page-header">
        <div class="admin-page-header-info">
          <h1>Admin Overview</h1>
          <p>Real-time control center for your Olflaz portfolio, YouTube videos, Godot games, and channel metrics.</p>
        </div>
        <div class="flex gap-xs">
          <a href="#/admin/home" class="btn btn-secondary btn-sm">Edit Home Page</a>
          <a href="#/" target="_blank" class="btn btn-primary btn-sm">View Live Site ↗</a>
        </div>
      </div>

      <!-- 1. METRICS CARDS WITH JUMP LINKS -->
      <div class="admin-stats-grid">
        <a href="#/admin/projects" class="admin-stat-card" title="Manage Projects">
          <div class="admin-stat-top">
            <span class="admin-stat-title">Total Projects</span>
            <span class="admin-stat-icon">${getIcon("projects", 20)}</span>
          </div>
          <div class="admin-stat-num">${metrics.totalProjects}</div>
          <div class="admin-stat-footer">
            <span>${metrics.featuredProjects} Featured on Home</span>
            <span>Manage &rarr;</span>
          </div>
        </a>

        <a href="#/admin/videos" class="admin-stat-card" title="Manage Videos">
          <div class="admin-stat-top">
            <span class="admin-stat-title">Total Videos</span>
            <span class="admin-stat-icon">${getIcon("videos", 20)}</span>
          </div>
          <div class="admin-stat-num">${metrics.totalVideos}</div>
          <div class="admin-stat-footer">
            <span>${metrics.featuredVideos} Featured on Home</span>
            <span>Manage &rarr;</span>
          </div>
        </a>

        <a href="#/admin/portfolio" class="admin-stat-card" title="Manage Portfolio">
          <div class="admin-stat-top">
            <span class="admin-stat-title">Portfolio Items</span>
            <span class="admin-stat-icon">${getIcon("portfolio", 20)}</span>
          </div>
          <div class="admin-stat-num">${metrics.totalPortfolio}</div>
          <div class="admin-stat-footer">
            <span>${metrics.featuredPortfolio} Featured</span>
            <span>Manage &rarr;</span>
          </div>
        </a>

        <a href="#/admin/channel" class="admin-stat-card" title="Manage Channel Stats">
          <div class="admin-stat-top">
            <span class="admin-stat-title">Subscribers</span>
            <span class="admin-stat-icon">${getIcon("stats", 20)}</span>
          </div>
          <div class="admin-stat-num">${metrics.subscriberCount}</div>
          <div class="admin-stat-footer">
            <span>${metrics.totalViews} Total Views</span>
            <span>Update &rarr;</span>
          </div>
        </a>
      </div>

      <!-- 2. QUICK ACTIONS SECTION -->
      <div style="margin-bottom: var(--space-2xl);">
        <h3 style="font-size: var(--text-base); text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-light); margin-bottom: var(--space-md);">
          Quick Actions
        </h3>
        <div class="admin-quick-actions-grid">
          <a href="#/admin/projects" class="admin-action-btn-card" id="qa-add-project">
            <div class="admin-action-icon">${getIcon("plus", 16)}</div>
            <strong style="font-size: var(--text-sm);">Add Project</strong>
            <span class="text-xs text-muted">Publish Godot game or Minecraft map</span>
          </a>

          <a href="#/admin/videos" class="admin-action-btn-card" id="qa-add-video">
            <div class="admin-action-icon">${getIcon("videos", 16)}</div>
            <strong style="font-size: var(--text-sm);">Add Video</strong>
            <span class="text-xs text-muted">Add YouTube tutorial or devlog</span>
          </a>

          <a href="#/admin/portfolio" class="admin-action-btn-card" id="qa-add-portfolio">
            <div class="admin-action-icon">${getIcon("portfolio", 16)}</div>
            <strong style="font-size: var(--text-sm);">Add Portfolio Item</strong>
            <span class="text-xs text-muted">Add case study or work milestone</span>
          </a>

          <a href="#/admin/featured" class="admin-action-btn-card" id="qa-manage-featured">
            <div class="admin-action-icon">${getIcon("star", 16)}</div>
            <strong style="font-size: var(--text-sm);">Manage Featured</strong>
            <span class="text-xs text-muted">Curate homepage showcases</span>
          </a>

          <a href="#/admin/home" class="admin-action-btn-card" id="qa-edit-home">
            <div class="admin-action-icon">${getIcon("home", 16)}</div>
            <strong style="font-size: var(--text-sm);">Edit Home Page</strong>
            <span class="text-xs text-muted">Update hero title, bio, and CTA buttons</span>
          </a>

          <a href="#/admin/about" class="admin-action-btn-card" id="qa-edit-about">
            <div class="admin-action-icon">${getIcon("about", 16)}</div>
            <strong style="font-size: var(--text-sm);">Edit About & Skills</strong>
            <span class="text-xs text-muted">Update bio, toolstack, and competencies</span>
          </a>

          <a href="#/admin/channel" class="admin-action-btn-card" id="qa-channel-stats">
            <div class="admin-action-icon">${getIcon("chart", 16)}</div>
            <strong style="font-size: var(--text-sm);">Update Channel Stats</strong>
            <span class="text-xs text-muted">Update subscriber and view counts</span>
          </a>

          <a href="#/admin/media" class="admin-action-btn-card" id="qa-media-library">
            <div class="admin-action-icon">${getIcon("media", 16)}</div>
            <strong style="font-size: var(--text-sm);">Media Library</strong>
            <span class="text-xs text-muted">Browse and copy asset URLs</span>
          </a>
        </div>
      </div>

      <!-- 3. RECENT ACTIVITY & CONTENT STATUS -->
      <div class="grid grid-cols-2 gap-xl">
        
        <!-- Recent Projects -->
        <div class="card">
          <div class="card-header">
            <h3 style="font-size: var(--text-base);">Recent Projects</h3>
            <a href="#/admin/projects" class="btn btn-outline btn-sm">Manage All (${metrics.totalProjects})</a>
          </div>
          <div class="card-body" style="padding: 0;">
            ${projects.length > 0 ? `
              <div class="table-responsive" style="border: none; border-radius: 0;">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${projects.map(p => `
                      <tr>
                        <td>
                          <div class="flex items-center gap-xs">
                            <strong style="color: var(--text-main);">${p.title}</strong>
                            <span class="badge ${p.publishStatus === 'draft' ? 'badge-draft' : 'badge-published'}" style="font-size: 10px; padding: 1px 6px;">
                              ${p.publishStatus === 'draft' ? 'Draft' : 'Live'}
                            </span>
                          </div>
                          <div class="font-mono text-xs text-muted">${p.engine}</div>
                        </td>
                        <td><span class="badge">${p.category}</span></td>
                        <td>
                          <span class="badge ${p.status === 'Completed' ? 'badge-status-completed' : 'badge-status-in-progress'}">
                            ${p.status}
                          </span>
                        </td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            ` : `
              <div style="padding: var(--space-lg); text-align: center;">
                <p class="text-sm text-muted">No projects created yet.</p>
                <a href="#/admin/projects" class="btn btn-secondary btn-sm" style="margin-top: 8px;">+ Add Project</a>
              </div>
            `}
          </div>
        </div>

        <!-- Recent Videos -->
        <div class="card">
          <div class="card-header">
            <h3 style="font-size: var(--text-base);">Recent Videos</h3>
            <a href="#/admin/videos" class="btn btn-outline btn-sm">Manage All (${metrics.totalVideos})</a>
          </div>
          <div class="card-body" style="padding: 0;">
            ${videos.length > 0 ? `
              <div class="table-responsive" style="border: none; border-radius: 0;">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${videos.map(v => `
                      <tr>
                        <td>
                          <div class="flex items-center gap-xs">
                            <strong style="color: var(--text-main);">${v.title}</strong>
                            <span class="badge ${v.publishStatus === 'draft' ? 'badge-draft' : 'badge-published'}" style="font-size: 10px; padding: 1px 6px;">
                              ${v.publishStatus === 'draft' ? 'Draft' : 'Live'}
                            </span>
                          </div>
                          <div class="text-xs text-muted font-mono">${v.uploadDate}</div>
                        </td>
                        <td><span class="badge">${v.category}</span></td>
                        <td class="font-mono text-xs">${v.views}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            ` : `
              <div style="padding: var(--space-lg); text-align: center;">
                <p class="text-sm text-muted">No videos created yet.</p>
                <a href="#/admin/videos" class="btn btn-secondary btn-sm" style="margin-top: 8px;">+ Add Video</a>
              </div>
            `}
          </div>
        </div>

      </div>

      <!-- Sticky Quick Navigation Bar -->
      <div class="admin-sticky-bar">
        <div class="admin-sticky-bar-left">
          <span style="color: var(--status-active-text);">${getIcon('sparkles', 14)}</span>
          <span>System Status: Local CMS Store Active &bull; ${metrics.totalProjects} Projects &bull; ${metrics.totalVideos} Videos &bull; ${metrics.totalPortfolio} Portfolio items</span>
        </div>
        <div class="admin-sticky-bar-right">
          <a href="#/admin/appearance" class="btn btn-outline">
            ${getIcon('palette', 14)} Theme Settings
          </a>
          <a href="#/" target="_blank" class="btn btn-primary">
            ${getIcon('eye', 13)} View Live Site ↗
          </a>
        </div>
      </div>

    </div>
  `;
}
