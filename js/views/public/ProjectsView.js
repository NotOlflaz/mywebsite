/**
 * Public Projects Catalog Page View
 * Filterable by category, search by title/keywords, responsive project grid.
 */

import { store } from "../../store/state.js";
import { getIcon } from "../../utils/icons.js";

let selectedCategory = "All";
let searchQuery = "";

export function renderProjectsView() {
  const allProjects = store.getProjects();

  // Extract unique categories
  const categories = ["All", ...new Set(allProjects.map(p => p.category).filter(Boolean))];

  // Filter projects
  const filteredProjects = allProjects.filter(project => {
    const matchesCat = selectedCategory === "All" || project.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.technologies || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const categoriesHtml = categories.map(cat => `
    <button 
      class="tab-btn filter-cat-btn ${cat === selectedCategory ? 'active' : ''}" 
      data-category="${cat}"
      type="button">
      ${cat} (${cat === 'All' ? allProjects.length : allProjects.filter(p => p.category === cat).length})
    </button>
  `).join("");

  const projectsGridHtml = filteredProjects.length > 0 ? filteredProjects.map((project, idx) => `
    <article class="card card-hover reveal-card stagger-${(idx % 6) + 1}" id="project-card-${project.id}">
      <div class="card-media">
        ${project.thumbnail ? `
          <img src="${project.thumbnail}" alt="${project.title} Screenshot" loading="lazy" />
        ` : `
          <div class="card-media-placeholder">
            ${getIcon("projects", 28)}
            <span>[ ${project.engine || 'Godot'} Project Preview ]</span>
          </div>
        `}
      </div>
      <div class="card-body">
        <div class="flex items-center justify-between gap-xs flex-wrap">
          <span class="badge ${project.isFeatured ? 'badge-featured' : ''}">${project.category || 'Game'}</span>
          <span class="badge ${project.status === 'Completed' ? 'badge-status-completed' : 'badge-status-in-progress'}">
            ${project.status}
          </span>
        </div>
        <h3 style="font-size: var(--text-xl); margin-top: 4px;">${project.title}</h3>
        <p style="font-size: var(--text-sm); line-height: 1.6; flex-grow: 1;">${project.shortDesc}</p>
        
        <!-- Technologies -->
        <div class="flex items-center gap-xs flex-wrap" style="margin-top: 6px;">
          ${(project.technologies || []).slice(0, 4).map(tech => `
            <span class="badge">${tech}</span>
          `).join("")}
        </div>

        <!-- Key Features Preview -->
        ${(project.features && project.features.length > 0) ? `
          <div style="margin-top: 8px; font-size: var(--text-xs); color: var(--text-muted);">
            <strong>Key Features:</strong>
            <ul style="margin-top: 4px; padding-left: 16px;">
              ${project.features.slice(0, 2).map(f => `<li>${f}</li>`).join("")}
            </ul>
          </div>
        ` : ''}
      </div>
      
      <div class="card-footer">
        <div class="flex items-center gap-xs">
          ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm" title="View Source on GitHub">GitHub ↗</a>` : ''}
          ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="Play / Download Demo">Demo ↗</a>` : ''}
        </div>
        <a href="#/project/${project.id}" class="btn btn-primary btn-sm">
          View Project &rarr;
        </a>
      </div>
    </article>
  `).join("") : `
    <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-3xl); background-color: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: var(--radius-lg);">
      <div class="empty-state-icon">${getIcon("search", 32)}</div>
      <h3 style="margin-top: 8px;">No projects matched your filter</h3>
      <p style="margin-top: 8px;">Try clearing your search query or selecting a different category filter.</p>
      <button class="btn btn-secondary btn-sm" id="clear-project-filters-btn" style="margin-top: 16px;">Clear Filters</button>
    </div>
  `;

  return `
    <div class="projects-page-root">
      <section class="section" style="padding-top: var(--space-2xl);">
        <div class="container">
          
          <!-- Page Header -->
          <div class="section-header section-header-left reveal-init" style="margin-bottom: var(--space-xl);">
            <div class="badge" style="margin-bottom: var(--space-2xs);">CATALOG & CREATIONS</div>
            <h1>Games & Projects</h1>
            <p>Explore games made with Godot Engine, custom Minecraft adventure maps, datapacks, and developer utilities.</p>
          </div>

          <!-- Filter & Search Toolbar -->
          <div class="filter-toolbar reveal-init stagger-1">
            <div class="filter-categories">
              ${categoriesHtml}
            </div>
            
            <div class="filter-search-box">
              <input 
                type="text" 
                class="form-input" 
                id="projects-search-input" 
                placeholder="Search projects, tools, tags..." 
                value="${searchQuery}" 
                aria-label="Search projects"
              />
            </div>
          </div>

          <!-- Projects Grid -->
          <div class="grid grid-cols-3 gap-lg scroll-reveal-grid" id="projects-grid-container">
            ${projectsGridHtml}
          </div>

        </div>
      </section>
    </div>
  `;
}

/**
 * Initialize event handlers for filtering & searching
 */
export function initProjectsViewEvents(reRenderCallback) {
  // Category tab clicks
  const catButtons = document.querySelectorAll(".filter-cat-btn");
  catButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      selectedCategory = btn.getAttribute("data-category");
      if (reRenderCallback) reRenderCallback();
    });
  });

  // Search input change / keyup
  const searchInput = document.getElementById("projects-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      if (reRenderCallback) reRenderCallback();
    });
  }

  // Clear filters button
  const clearBtn = document.getElementById("clear-project-filters-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      selectedCategory = "All";
      searchQuery = "";
      if (reRenderCallback) reRenderCallback();
    });
  }
}
