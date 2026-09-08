/**
 * Admin Project Management View
 * Features: Structured Add/Edit Sections, Search, Filter, Live CRUD, Save Feedback, and Empty States.
 */

import { store } from "../../store/state.js";
import { modal } from "../../components/Modal.js";
import { toast } from "../../components/Toast.js";
import { getIcon } from "../../utils/icons.js";

let projectSearchQuery = "";
let projectCategoryFilter = "All";

export function renderAdminProjectsView() {
  const allProjects = store.getProjects();
  const categories = ["All", ...new Set(allProjects.map(p => p.category).filter(Boolean))];

  const filteredProjects = allProjects.filter(p => {
    const matchesCat = projectCategoryFilter === "All" || p.category === projectCategoryFilter;
    const matchesSearch = !projectSearchQuery ||
      p.title.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
      p.shortDesc.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
      (p.technologies || []).some(t => t.toLowerCase().includes(projectSearchQuery.toLowerCase())) ||
      (p.engine || '').toLowerCase().includes(projectSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const tableRowsHtml = filteredProjects.length > 0 ? filteredProjects.map(project => `
    <tr id="admin-proj-row-${project.id}">
      <td>
        <div class="flex items-center gap-sm">
          <div style="width: 48px; height: 32px; background: var(--bg-surface-alt); border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 10px;">
            ${project.thumbnail ? `<img src="${project.thumbnail}" style="width:100%;height:100%;object-fit:cover;" />` : getIcon('gamepad', 14)}
          </div>
          <div>
            <strong style="color: var(--text-main); font-size: var(--text-sm);">${project.title}</strong>
            <div class="text-xs text-muted" style="max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${project.shortDesc}
            </div>
          </div>
        </div>
      </td>
      <td><span class="badge">${project.category || 'Game'}</span></td>
      <td><span class="font-mono text-xs">${project.engine || 'Godot'}</span></td>
      <td>
        <span class="badge ${project.status === 'Completed' ? 'badge-status-completed' : 'badge-status-in-progress'}">
          ${project.status}
        </span>
      </td>
      <td>
        <button 
          class="badge ${project.isFeatured ? 'badge-featured' : ''} toggle-proj-featured-btn" 
          data-id="${project.id}"
          style="cursor: pointer;"
          title="Click to toggle featured on Home page">
          ${project.isFeatured ? 'Featured' : 'Standard'}
        </button>
      </td>
      <td>
        <div class="table-actions">
          <a href="#/project/${project.id}" target="_blank" class="btn btn-secondary btn-sm" title="Preview project page">
            ${getIcon('eye', 13)}
          </a>
          <button class="btn btn-secondary btn-sm edit-proj-btn" data-id="${project.id}" title="Edit Project">
            ${getIcon('edit', 13)} Edit
          </button>
          <button class="btn btn-danger btn-sm delete-proj-btn" data-id="${project.id}" title="Delete Project">
            ${getIcon('trash', 13)}
          </button>
        </div>
      </td>
    </tr>
  `).join("") : '';

  return `
    <div class="admin-projects-page">
      
      <!-- Page Header -->
      <div class="admin-page-header">
        <div class="admin-page-header-info">
          <h1>Projects Management</h1>
          <p>Create, edit, feature, and manage games, custom Minecraft adventure maps, plugins, and their public detail pages.</p>
        </div>
        <button class="btn btn-primary" id="admin-add-proj-btn">
          ${getIcon('plus', 14)} Add New Project
        </button>
      </div>

      <!-- Search & Category Filters -->
      <div class="admin-table-toolbar">
        <div class="admin-search-filter-group">
          <input 
            type="text" 
            class="form-input" 
            id="admin-proj-search-input" 
            placeholder="Search projects by name, engine, or tags..." 
            value="${projectSearchQuery}" 
            style="max-width: 300px;"
          />
          <select class="form-select" id="admin-proj-category-filter" style="max-width: 200px;">
            ${categories.map(c => `<option value="${c}" ${c === projectCategoryFilter ? 'selected' : ''}>${c}</option>`).join("")}
          </select>
        </div>
        <div class="text-xs text-muted font-mono">
          Showing ${filteredProjects.length} of ${allProjects.length} projects
        </div>
      </div>

      <!-- Projects Data Table or Empty State -->
      ${filteredProjects.length > 0 ? `
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Project Name & Summary</th>
                <th>Category</th>
                <th>Engine</th>
                <th>Status</th>
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
          <div class="empty-state-icon">${getIcon('projects', 32)}</div>
          <h3 class="empty-state-title">No Projects Found</h3>
          <p class="empty-state-desc">
            ${projectSearchQuery || projectCategoryFilter !== 'All' 
              ? 'No projects match your current search or category filter. Try clearing filters or create a new project.'
              : 'You have not created any projects yet. Add your first Godot game or Minecraft adventure map!'}
          </p>
          <button class="btn btn-primary" id="empty-state-add-proj-btn">
            ${getIcon('plus', 14)} Add Your First Project
          </button>
        </div>
      `}

    </div>
  `;
}

/**
 * Event handlers for Project CRUD
 */
export function initAdminProjectsEvents(reRenderCallback) {
  // Search & Filter
  const searchInput = document.getElementById("admin-proj-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      projectSearchQuery = e.target.value;
      if (reRenderCallback) reRenderCallback();
    });
  }

  const categorySelect = document.getElementById("admin-proj-category-filter");
  if (categorySelect) {
    categorySelect.addEventListener("change", (e) => {
      projectCategoryFilter = e.target.value;
      if (reRenderCallback) reRenderCallback();
    });
  }

  // Toggle Featured
  const toggleBtns = document.querySelectorAll(".toggle-proj-featured-btn");
  toggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const isFeatured = store.toggleProjectFeatured(id);
      toast.success(`Project featured status set to ${isFeatured ? 'Featured' : 'Standard'}`);
      if (reRenderCallback) reRenderCallback();
    });
  });

  // Add Project
  const addBtn = document.getElementById("admin-add-proj-btn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      openProjectFormModal(null, reRenderCallback);
    });
  }

  const emptyAddBtn = document.getElementById("empty-state-add-proj-btn");
  if (emptyAddBtn) {
    emptyAddBtn.addEventListener("click", () => {
      projectSearchQuery = "";
      projectCategoryFilter = "All";
      openProjectFormModal(null, reRenderCallback);
    });
  }

  // Edit Project
  const editBtns = document.querySelectorAll(".edit-proj-btn");
  editBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const project = store.getProjectById(id);
      if (project) {
        openProjectFormModal(project, reRenderCallback);
      }
    });
  });

  // Delete Project
  const deleteBtns = document.querySelectorAll(".delete-proj-btn");
  deleteBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const project = store.getProjectById(id);
      if (project && confirm(`Are you sure you want to delete project "${project.title}"?\nThis action cannot be undone.`)) {
        store.deleteProject(id);
        toast.error(`Project "${project.title}" was deleted`);
        if (reRenderCallback) reRenderCallback();
      }
    });
  });
}

function openProjectFormModal(projectToEdit = null, onSaved = null) {
  const isEdit = !!projectToEdit;
  const project = projectToEdit || {
    title: "",
    category: "Godot Games",
    engine: "Godot 4.3",
    status: "In Development",
    devDate: new Date().getFullYear().toString(),
    shortDesc: "",
    fullDesc: "",
    thumbnail: "",
    screenshots: [],
    technologies: ["Godot 4", "GDScript"],
    features: ["Smooth controls", "Modular state machines"],
    githubUrl: "",
    demoUrl: "",
    youtubeUrl: "",
    tags: ["Godot", "Indie Game"],
    isFeatured: false
  };

  const bodyHtml = `
    <form id="project-crud-form" style="display: flex; flex-direction: column; gap: var(--space-lg);">
      
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
              <label class="form-label" for="proj-title">Project Name *</label>
              <input type="text" class="form-input" id="proj-title" required value="${escapeHtml(project.title)}" placeholder="e.g. Shadow Leap" />
            </div>
            <div class="form-group">
              <label class="form-label" for="proj-category">Category *</label>
              <select class="form-select" id="proj-category">
                <option value="Godot Games" ${project.category === 'Godot Games' ? 'selected' : ''}>Godot Games</option>
                <option value="Minecraft" ${project.category === 'Minecraft' ? 'selected' : ''}>Minecraft</option>
                <option value="Tools & Utilities" ${project.category === 'Tools & Utilities' ? 'selected' : ''}>Tools & Utilities</option>
                <option value="Game Jams" ${project.category === 'Game Jams' ? 'selected' : ''}>Game Jams</option>
                <option value="Prototypes" ${project.category === 'Prototypes' ? 'selected' : ''}>Prototypes</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="proj-status">Development Status</label>
              <select class="form-select" id="proj-status">
                <option value="In Development" ${project.status === 'In Development' ? 'selected' : ''}>In Development</option>
                <option value="Completed" ${project.status === 'Completed' ? 'selected' : ''}>Completed</option>
                <option value="Active Beta" ${project.status === 'Active Beta' ? 'selected' : ''}>Active Beta</option>
                <option value="Planned" ${project.status === 'Planned' ? 'selected' : ''}>Planned</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="proj-devdate">Timeline / Date</label>
              <input type="text" class="form-input" id="proj-devdate" value="${escapeHtml(project.devDate)}" placeholder="e.g. 2024 - Present" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="proj-shortdesc">Short Description (Cards & Previews) *</label>
            <textarea class="form-textarea" id="proj-shortdesc" rows="2" placeholder="Brief 1-2 sentence overview for cards...">${escapeHtml(project.shortDesc)}</textarea>
          </div>
        </div>
      </div>

      <!-- 2. DESCRIPTION & FEATURES -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>2. Full Story & Key Features</span>
          </div>
        </div>
        <div class="form-section-body">
          <div class="form-group">
            <label class="form-label" for="proj-fulldesc">Full Project Description (Detail Page)</label>
            <textarea class="form-textarea" id="proj-fulldesc" rows="4" placeholder="Comprehensive description of gameplay, mechanics, architecture, and story...">${escapeHtml(project.fullDesc)}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="proj-features">Key Features (One feature per line)</label>
            <textarea class="form-textarea font-mono" id="proj-features" rows="3" placeholder="Dynamic shadow mechanics\n40+ challenge rooms\nSpeedrun replay system">${escapeHtml((project.features || []).join('\n'))}</textarea>
            <span class="form-helper">Enter one feature per line. They will be rendered with bullet checkmarks on the detail page.</span>
          </div>
        </div>
      </div>

      <!-- 3. MEDIA & SCREENSHOTS -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>3. Media & Screenshots</span>
          </div>
        </div>
        <div class="form-section-body">
          <div class="form-group">
            <label class="form-label" for="proj-thumbnail">Main Thumbnail Image URL</label>
            <input type="text" class="form-input" id="proj-thumbnail" value="${escapeHtml(project.thumbnail)}" placeholder="https://... or copy asset URL from Media Library" />
          </div>

          <div class="form-group">
            <label class="form-label" for="proj-screenshots">Gallery Screenshots URLs (One URL per line or comma-separated)</label>
            <textarea class="form-textarea font-mono" id="proj-screenshots" rows="2" placeholder="https://.../screenshot1.png\nhttps://.../screenshot2.png">${escapeHtml((project.screenshots || []).join('\n'))}</textarea>
          </div>
        </div>
      </div>

      <!-- 4. TECHNICAL SPECIFICATIONS -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>4. Technical Specifications</span>
          </div>
        </div>
        <div class="form-section-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="proj-engine">Engine / Platform</label>
              <input type="text" class="form-input" id="proj-engine" value="${escapeHtml(project.engine)}" placeholder="e.g. Godot 4.3, Minecraft Java 1.21" />
            </div>
            <div class="form-group">
              <label class="form-label" for="proj-tech">Technologies & Tools (Comma-separated)</label>
              <input type="text" class="form-input" id="proj-tech" value="${escapeHtml((project.technologies || []).join(', '))}" placeholder="Godot 4.3, GDScript, Blender, Aseprite" />
            </div>
          </div>
        </div>
      </div>

      <!-- 5. EXTERNAL LINKS & DEMOS -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>5. External Links & Demos</span>
          </div>
        </div>
        <div class="form-section-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="proj-github">GitHub Repository URL (Optional)</label>
              <input type="url" class="form-input" id="proj-github" value="${escapeHtml(project.githubUrl)}" placeholder="https://github.com/olflaz/..." />
            </div>
            <div class="form-group">
              <label class="form-label" for="proj-demo">Play / Download Demo URL (Optional)</label>
              <input type="url" class="form-input" id="proj-demo" value="${escapeHtml(project.demoUrl)}" placeholder="https://olflaz.itch.io/..." />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="proj-youtube">YouTube Video / Devlog Showcase URL (Optional)</label>
            <input type="url" class="form-input" id="proj-youtube" value="${escapeHtml(project.youtubeUrl)}" placeholder="https://youtube.com/watch?v=..." />
          </div>
        </div>
      </div>

      <!-- 6. PUBLISHING & FEATURED -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>6. Publishing Options</span>
          </div>
        </div>
        <div class="form-section-body">
          <div class="form-group">
            <label class="form-checkbox-label">
              <input type="checkbox" id="proj-featured" ${project.isFeatured ? 'checked' : ''} />
              <span><strong>Mark as Featured Project</strong> (Displays prominently on the Home page grid)</span>
            </label>
          </div>
        </div>
      </div>

    </form>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-outline" id="modal-proj-cancel-btn">Cancel</button>
    <button type="button" class="btn btn-primary" id="modal-save-proj-btn">${isEdit ? 'Save Project Changes' : 'Create Project'}</button>
  `;

  modal.open({
    title: isEdit ? `Edit Project: ${project.title}` : "Add New Project",
    bodyHtml,
    footerHtml,
    isLarge: true,
    onOpen: (modalEl) => {
      const cancelBtn = modalEl.querySelector("#modal-proj-cancel-btn");
      const saveBtn = modalEl.querySelector("#modal-save-proj-btn");

      cancelBtn.addEventListener("click", () => modal.close());

      saveBtn.addEventListener("click", () => {
        const title = modalEl.querySelector("#proj-title").value.trim();
        const category = modalEl.querySelector("#proj-category").value;
        const engine = modalEl.querySelector("#proj-engine").value.trim() || "Godot";
        const status = modalEl.querySelector("#proj-status").value;
        const devDate = modalEl.querySelector("#proj-devdate").value.trim() || new Date().getFullYear().toString();
        const thumbnail = modalEl.querySelector("#proj-thumbnail").value.trim();
        const shortDesc = modalEl.querySelector("#proj-shortdesc").value.trim();
        const fullDesc = modalEl.querySelector("#proj-fulldesc").value.trim();
        const featuresRaw = modalEl.querySelector("#proj-features").value;
        const techRaw = modalEl.querySelector("#proj-tech").value;
        const screenshotsRaw = modalEl.querySelector("#proj-screenshots").value;
        const githubUrl = modalEl.querySelector("#proj-github").value.trim();
        const demoUrl = modalEl.querySelector("#proj-demo").value.trim();
        const youtubeUrl = modalEl.querySelector("#proj-youtube").value.trim();
        const isFeatured = modalEl.querySelector("#proj-featured").checked;

        if (!title) {
          toast.error("Project name is required");
          modalEl.querySelector("#proj-title").focus();
          return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = "⏳ Saving...";

        const features = featuresRaw.split("\n").map(f => f.trim()).filter(Boolean);
        const technologies = techRaw.split(",").map(t => t.trim()).filter(Boolean);
        const screenshots = screenshotsRaw.split(/[\n,]/).map(s => s.trim()).filter(Boolean);

        const payload = {
          title,
          category,
          engine,
          status,
          devDate,
          thumbnail,
          shortDesc: shortDesc || title,
          fullDesc: fullDesc || shortDesc || title,
          features,
          technologies,
          screenshots,
          githubUrl,
          demoUrl,
          youtubeUrl,
          isFeatured
        };

        setTimeout(() => {
          if (isEdit) {
            store.updateProject(project.id, payload);
            toast.success(`Project "${title}" updated successfully!`);
          } else {
            store.addProject(payload);
            toast.success(`New project "${title}" published successfully!`);
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
