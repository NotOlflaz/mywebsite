/**
 * Admin Project Management View
 * Features: Action Button Builder, PC Image Upload, Drag-and-Drop Reordering,
 * Draft/Published Publishing Workflow, Search, Category/Status Filtering, Live CRUD.
 */

import { store } from "../../store/state.js";
import { modal } from "../../components/Modal.js";
import { toast } from "../../components/Toast.js";
import { getIcon } from "../../utils/icons.js";
import { renderImageUploader, initImageUploader } from "../../components/ImageUploader.js";
import { initDraggableList } from "../../utils/drag-drop.js";

let projectSearchQuery = "";
let projectCategoryFilter = "All";
let projectStatusFilter = "All"; // "All", "published", "draft"

export function renderAdminProjectsView() {
  const allProjects = store.getProjects();
  const categories = ["All", ...new Set(allProjects.map(p => p.category).filter(Boolean))];

  const filteredProjects = allProjects.filter(p => {
    const matchesCat = projectCategoryFilter === "All" || p.category === projectCategoryFilter;
    const matchesStatus = projectStatusFilter === "All" || (p.publishStatus || "published") === projectStatusFilter;
    const matchesSearch = !projectSearchQuery ||
      p.title.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
      p.shortDesc.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
      (p.technologies || []).some(t => t.toLowerCase().includes(projectSearchQuery.toLowerCase())) ||
      (p.engine || '').toLowerCase().includes(projectSearchQuery.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  const tableRowsHtml = filteredProjects.length > 0 ? filteredProjects.map((project, idx) => {
    const isPublished = (project.publishStatus || "published") === "published";

    return `
      <tr class="draggable-row" data-id="${project.id}" data-index="${idx}" id="admin-proj-row-${project.id}">
        <td style="width: 38px; text-align: center;">
          <span class="drag-handle" title="Drag to reorder project display sequence">
            ${getIcon('dragHandle', 16)}
          </span>
        </td>
        <td>
          <div class="flex items-center gap-sm">
            <div style="width: 52px; height: 34px; background: var(--bg-surface-alt); border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0;">
              ${project.thumbnail ? `<img src="${project.thumbnail}" style="width:100%;height:100%;object-fit:cover;" loading="lazy" />` : getIcon('gamepad', 14)}
            </div>
            <div>
              <strong style="color: var(--text-main); font-size: var(--text-sm);">${project.title}</strong>
              <div class="text-xs text-muted" style="max-width: 280px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${project.shortDesc || 'No summary provided.'}
              </div>
            </div>
          </div>
        </td>
        <td><span class="badge">${project.category || 'Game'}</span></td>
        <td><span class="font-mono text-xs">${project.engine || 'Godot'}</span></td>
        <td>
          <button 
            type="button" 
            class="badge ${isPublished ? 'badge-published' : 'badge-draft'} toggle-proj-status-btn" 
            data-id="${project.id}"
            style="cursor: pointer; border-radius: var(--radius-xs);"
            title="Click to toggle Draft / Published status">
            ${isPublished ? '● Published' : '○ Draft'}
          </button>
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
    `;
  }).join("") : '';

  return `
    <div class="admin-projects-page">
      
      <!-- Page Header -->
      <div class="admin-page-header">
        <div class="admin-page-header-info">
          <h1>Projects Management</h1>
          <p>Create, edit, feature, and reorder indie games, custom Minecraft adventure maps, and interactive tools.</p>
        </div>
        <div class="flex gap-xs">
          <a href="#/projects" target="_blank" class="btn btn-secondary btn-sm">
            ${getIcon('eye', 13)} Preview Projects Page ↗
          </a>
          <button class="btn btn-primary btn-sm" id="admin-add-proj-btn">
            ${getIcon('plus', 14)} Add New Project
          </button>
        </div>
      </div>

      <!-- Search, Status Filter & Category Toolbar -->
      <div class="admin-table-toolbar">
        <div class="admin-search-filter-group flex-wrap">
          <input 
            type="text" 
            class="form-input" 
            id="admin-proj-search-input" 
            placeholder="Search projects by name, engine, or tags..." 
            value="${projectSearchQuery}" 
            style="max-width: 280px;"
          />
          <select class="form-select" id="admin-proj-category-filter" style="max-width: 170px;">
            ${categories.map(c => `<option value="${c}" ${c === projectCategoryFilter ? 'selected' : ''}>Category: ${c}</option>`).join("")}
          </select>
          <select class="form-select" id="admin-proj-status-filter" style="max-width: 150px;">
            <option value="All" ${projectStatusFilter === 'All' ? 'selected' : ''}>Status: All</option>
            <option value="published" ${projectStatusFilter === 'published' ? 'selected' : ''}>Status: Published</option>
            <option value="draft" ${projectStatusFilter === 'draft' ? 'selected' : ''}>Status: Draft</option>
          </select>
        </div>
        <div class="text-xs text-muted font-mono">
          Showing ${filteredProjects.length} of ${allProjects.length} projects • Drag ⠿ to reorder
        </div>
      </div>

      <!-- Projects Data Table or Empty State -->
      ${filteredProjects.length > 0 ? `
        <div class="table-responsive">
          <table class="data-table" id="admin-projects-table">
            <thead>
              <tr>
                <th style="width: 38px;"></th>
                <th>Project Name & Summary</th>
                <th>Category</th>
                <th>Engine</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="admin-projects-tbody">
              ${tableRowsHtml}
            </tbody>
          </table>
        </div>
      ` : `
        <div class="empty-state-card">
          <div class="empty-state-icon">${getIcon('projects', 32)}</div>
          <h3 class="empty-state-title">No Projects Found</h3>
          <p class="empty-state-desc">
            ${projectSearchQuery || projectCategoryFilter !== 'All' || projectStatusFilter !== 'All'
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
 * Event handlers for Project CRUD and Drag & Drop
 */
export function initAdminProjectsEvents(reRenderCallback) {
  // Initialize Drag & Drop Table Reordering
  const tbody = document.getElementById("admin-projects-tbody");
  if (tbody) {
    initDraggableList({
      container: tbody,
      itemSelector: "tr.draggable-row",
      handleSelector: ".drag-handle",
      onReorder: (fromIdx, toIdx) => {
        store.reorderProjects(fromIdx, toIdx);
        toast.info("Project display sequence updated!");
        if (reRenderCallback) reRenderCallback();
      }
    });
  }

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

  const statusSelect = document.getElementById("admin-proj-status-filter");
  if (statusSelect) {
    statusSelect.addEventListener("change", (e) => {
      projectStatusFilter = e.target.value;
      if (reRenderCallback) reRenderCallback();
    });
  }

  // Quick Toggle Published / Draft Status
  const statusToggleBtns = document.querySelectorAll(".toggle-proj-status-btn");
  statusToggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const project = store.getProjectById(id);
      if (project) {
        const nextStatus = (project.publishStatus || "published") === "published" ? "draft" : "published";
        store.updateProjectPublishStatus(id, nextStatus);
        toast.success(`Project "${project.title}" set to ${nextStatus === 'published' ? 'Published' : 'Draft'}`);
        if (reRenderCallback) reRenderCallback();
      }
    });
  });

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
      projectStatusFilter = "All";
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
      if (project && confirm(`Are you sure you want to delete project "${project.title}"?\nThis cannot be undone.`)) {
        store.deleteProject(id);
        toast.error(`Project "${project.title}" deleted.`);
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
    publishStatus: "published",
    devDate: new Date().getFullYear().toString() + " - Present",
    shortDesc: "",
    fullDesc: "",
    thumbnail: "",
    screenshots: [],
    technologies: ["Godot 4.3", "GDScript"],
    features: [],
    actionButtons: [
      { id: "btn-demo", label: "Play Demo", url: "", style: "primary", enabled: false },
      { id: "btn-github", label: "GitHub", url: "", style: "secondary", enabled: false }
    ],
    githubUrl: "",
    demoUrl: "",
    youtubeUrl: "",
    isFeatured: false
  };

  let localButtons = Array.isArray(project.actionButtons) && project.actionButtons.length > 0
    ? JSON.parse(JSON.stringify(project.actionButtons))
    : [
        ...(project.demoUrl ? [{ id: "btn-demo", label: "Play Demo", url: project.demoUrl, style: "primary", enabled: true }] : []),
        ...(project.githubUrl ? [{ id: "btn-github", label: "GitHub", url: project.githubUrl, style: "secondary", enabled: true }] : []),
        ...(project.youtubeUrl ? [{ id: "btn-youtube", label: "Watch Video", url: project.youtubeUrl, style: "outline", enabled: true }] : [])
      ];

  const renderButtonsList = () => {
    if (localButtons.length === 0) {
      return `<p class="text-xs text-muted" style="margin: 4px 0;">No custom action buttons configured. Click "+ Add Button" below.</p>`;
    }
    return localButtons.map((btn, index) => `
      <div class="action-button-item" data-index="${index}">
        <input 
          type="text" 
          class="form-input btn-label-input" 
          placeholder="Label (e.g. Play Demo)" 
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
        <button type="button" class="btn btn-danger btn-sm remove-action-btn" data-index="${index}" style="padding: 4px 8px;" title="Remove Button">
          ✕
        </button>
      </div>
    `).join("");
  };

  const bodyHtml = `
    <form id="project-crud-form" style="display: flex; flex-direction: column; gap: var(--space-lg);">
      
      <!-- 1. BASIC INFORMATION -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>1. Basic Project Information</span>
          </div>
        </div>
        <div class="form-section-body">
          <div class="form-group">
            <label class="form-label" for="proj-title">Project Name / Title *</label>
            <input type="text" class="form-input" id="proj-title" required value="${escapeHtml(project.title)}" placeholder="e.g. Shadow Leap" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="proj-category">Category *</label>
              <select class="form-select" id="proj-category">
                <option value="Godot Games" ${project.category === 'Godot Games' ? 'selected' : ''}>Godot Games</option>
                <option value="Minecraft" ${project.category === 'Minecraft' ? 'selected' : ''}>Minecraft</option>
                <option value="Tools & Plugins" ${project.category === 'Tools & Plugins' ? 'selected' : ''}>Tools & Plugins</option>
                <option value="Prototypes" ${project.category === 'Prototypes' ? 'selected' : ''}>Prototypes</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="proj-publish-status">Publishing Status *</label>
              <select class="form-select" id="proj-publish-status">
                <option value="published" ${(project.publishStatus || 'published') === 'published' ? 'selected' : ''}>● Published (Visible on Public Website)</option>
                <option value="draft" ${(project.publishStatus || 'published') === 'draft' ? 'selected' : ''}>○ Draft (Admin Only / Hidden Publicly)</option>
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

      <!-- 2. FULL STORY & FEATURES -->
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

      <!-- 3. ACTION BUTTONS MANAGER -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>3. Configurable Action Buttons</span>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="add-action-btn-trigger">
            ${getIcon('plus', 13)} Add Button
          </button>
        </div>
        <div class="form-section-body">
          <p class="text-xs text-muted">Configure custom call-to-action buttons (Play Demo, GitHub, Download, Itch.io, CurseForge, etc.) shown on the project card and detail page.</p>
          
          <div class="action-buttons-builder" id="action-buttons-builder-container" style="margin-top: 8px;">
            ${renderButtonsList()}
          </div>

          <div class="flex gap-xs flex-wrap" style="margin-top: 8px;">
            <button type="button" class="btn btn-outline btn-sm quick-add-btn" data-label="Play Demo" data-style="primary">
              + Play Demo
            </button>
            <button type="button" class="btn btn-outline btn-sm quick-add-btn" data-label="GitHub" data-style="secondary">
              + GitHub
            </button>
            <button type="button" class="btn btn-outline btn-sm quick-add-btn" data-label="Watch Video" data-style="outline">
              + Watch Video
            </button>
            <button type="button" class="btn btn-outline btn-sm quick-add-btn" data-label="Itch.io" data-style="secondary">
              + Itch.io
            </button>
            <button type="button" class="btn btn-outline btn-sm quick-add-btn" data-label="Download" data-style="primary">
              + Download
            </button>
          </div>
        </div>
      </div>

      <!-- 4. MEDIA & SCREENSHOTS -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>4. Media & Screenshots</span>
          </div>
        </div>
        <div class="form-section-body">
          ${renderImageUploader({
            id: "proj-thumbnail",
            value: project.thumbnail,
            label: "Main Cover / Thumbnail Image",
            helperText: "Upload a game banner, poster, or cover screenshot from PC.",
            placeholder: "https://... or upload from PC",
            aspect: "16/9"
          })}

          <div class="form-group" style="margin-top: var(--space-md);">
            <label class="form-label" for="proj-screenshots">Gallery Screenshots URLs (One URL per line or comma-separated)</label>
            <textarea class="form-textarea font-mono" id="proj-screenshots" rows="2" placeholder="https://.../screenshot1.png\nhttps://.../screenshot2.png">${escapeHtml((project.screenshots || []).join('\n'))}</textarea>
          </div>
        </div>
      </div>

      <!-- 5. TECHNICAL SPECIFICATIONS -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>5. Technical Specifications</span>
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

      <!-- 6. PUBLISHING & FEATURED -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>6. Featured Spotlight</span>
          </div>
        </div>
        <div class="form-section-body">
          <div class="form-group">
            <label class="form-checkbox-label">
              <input type="checkbox" id="proj-featured" ${project.isFeatured ? 'checked' : ''} />
              <span><strong>Mark as Featured Project</strong> (Featured in Home Page Spotlight Grid)</span>
            </label>
          </div>
        </div>
      </div>

    </form>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-outline" id="modal-proj-cancel-btn">Cancel</button>
    <button type="button" class="btn btn-primary" id="modal-save-proj-btn">${isEdit ? 'Save Changes' : 'Save Project'}</button>
  `;

  modal.open({
    title: isEdit ? `Edit Project: ${project.title}` : "Add New Project",
    bodyHtml,
    footerHtml,
    isLarge: true,
    onOpen: (modalEl) => {
      const cancelBtn = modalEl.querySelector("#modal-proj-cancel-btn");
      const saveBtn = modalEl.querySelector("#modal-save-proj-btn");
      const buttonsContainer = modalEl.querySelector("#action-buttons-builder-container");

      // Initialize Image Uploader for Project Thumbnail
      initImageUploader(modalEl, "proj-thumbnail");

      // Wire Action Buttons Builder Events
      const bindButtonsEvents = () => {
        buttonsContainer.innerHTML = renderButtonsList();

        // Update inputs on change
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

      const addBtnTrigger = modalEl.querySelector("#add-action-btn-trigger");
      if (addBtnTrigger) {
        addBtnTrigger.addEventListener("click", () => {
          localButtons.push({
            id: "btn-" + Date.now(),
            label: "Action Link",
            url: "https://",
            style: "secondary",
            enabled: true
          });
          bindButtonsEvents();
        });
      }

      modalEl.querySelectorAll(".quick-add-btn").forEach(quickBtn => {
        quickBtn.addEventListener("click", () => {
          const label = quickBtn.getAttribute("data-label");
          const style = quickBtn.getAttribute("data-style") || "primary";
          localButtons.push({
            id: "btn-" + Date.now(),
            label,
            url: "https://",
            style,
            enabled: true
          });
          bindButtonsEvents();
        });
      });

      bindButtonsEvents();

      cancelBtn.addEventListener("click", () => modal.close());

      saveBtn.addEventListener("click", () => {
        const title = modalEl.querySelector("#proj-title").value.trim();
        const category = modalEl.querySelector("#proj-category").value;
        const publishStatus = modalEl.querySelector("#proj-publish-status").value;
        const engine = modalEl.querySelector("#proj-engine").value.trim() || "Godot";
        const status = modalEl.querySelector("#proj-status").value;
        const devDate = modalEl.querySelector("#proj-devdate").value.trim() || new Date().getFullYear().toString();
        const thumbnail = modalEl.querySelector("#proj-thumbnail").value.trim();
        const shortDesc = modalEl.querySelector("#proj-shortdesc").value.trim();
        const fullDesc = modalEl.querySelector("#proj-fulldesc").value.trim();
        const featuresRaw = modalEl.querySelector("#proj-features").value;
        const techRaw = modalEl.querySelector("#proj-tech").value;
        const screenshotsRaw = modalEl.querySelector("#proj-screenshots").value;
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

        // Filter valid action buttons
        const actionButtons = localButtons.filter(b => b.label.trim() && b.url.trim());

        const payload = {
          title,
          category,
          publishStatus,
          engine,
          status,
          devDate,
          thumbnail,
          shortDesc: shortDesc || title,
          fullDesc: fullDesc || shortDesc || title,
          features,
          technologies,
          screenshots,
          actionButtons,
          isFeatured
        };

        setTimeout(() => {
          if (isEdit) {
            store.updateProject(project.id, payload);
            toast.success(`Project "${title}" updated successfully!`);
          } else {
            store.addProject(payload);
            toast.success(`New project "${title}" added successfully!`);
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
