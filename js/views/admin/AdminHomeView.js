/**
 * Admin Home Page Content & Sections Editor View
 * Features: Homepage Sections Manager (Drag-and-Drop Reorder, Enable/Disable, Custom Titles),
 * Hero Text, Taglines, CTA Buttons, and PC Avatar Image Uploader.
 */

import { store } from "../../store/state.js";
import { toast } from "../../components/Toast.js";
import { getIcon } from "../../utils/icons.js";
import { renderImageUploader, initImageUploader } from "../../components/ImageUploader.js";
import { initDraggableList } from "../../utils/drag-drop.js";

export function renderAdminHomeView() {
  const home = store.getHome();
  const sections = store.getHomeSections();

  const sectionsHtml = sections.map((sec, idx) => `
    <div class="home-section-card draggable-card ${sec.enabled ? '' : 'is-disabled'}" data-id="${sec.id}" data-index="${idx}" id="section-card-${sec.id}">
      <div class="flex items-center gap-sm" style="flex: 1;">
        <span class="drag-handle" title="Drag to reorder section sequence on homepage">
          ${getIcon('dragHandle', 16)}
        </span>
        <div style="flex: 1;">
          <div class="flex items-center gap-xs">
            <strong style="color: var(--text-main); font-size: var(--text-sm);">${sec.name}</strong>
            <span class="badge font-mono" style="font-size: 10px;">${sec.id}</span>
          </div>
          <div style="margin-top: 4px;">
            <input 
              type="text" 
              class="form-input section-title-input" 
              data-id="${sec.id}" 
              value="${escapeHtml(sec.title)}" 
              placeholder="Section Heading Title..." 
              style="padding: 4px 8px; font-size: var(--text-xs); max-width: 320px;" 
            />
          </div>
        </div>
      </div>

      <div class="flex items-center gap-xs">
        <label class="flex items-center gap-2xs" style="cursor: pointer; font-size: var(--text-xs);">
          <input type="checkbox" class="section-enabled-toggle" data-id="${sec.id}" ${sec.enabled ? 'checked' : ''} />
          <span class="font-bold">${sec.enabled ? 'Visible' : 'Hidden'}</span>
        </label>
      </div>
    </div>
  `).join("");

  return `
    <div class="admin-home-page">
      
      <div class="admin-page-header">
        <div class="admin-page-header-info">
          <h1>Home Page & Sections Editor</h1>
          <p>Manage the sequence and visibility of major homepage sections using drag & drop, customize landing copy, action buttons, and avatar image.</p>
        </div>
        <a href="#/" target="_blank" class="btn btn-secondary btn-sm">
          ${getIcon('eye', 13)} Preview Live Home Page ↗
        </a>
      </div>

      <!-- 1. HOMEPAGE SECTIONS MANAGER -->
      <div class="form-section" style="margin-bottom: var(--space-xl);">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>1. Homepage Sections Manager (Drag to Reorder)</span>
          </div>
          <span class="text-xs text-muted">Toggle visibility & edit headings</span>
        </div>
        <div class="form-section-body">
          <p class="text-xs text-muted" style="margin-bottom: var(--space-sm);">
            Drag sections using ⠿ to change the order they appear on the live homepage, or switch them off to hide completely:
          </p>
          <div style="display: flex; flex-direction: column; gap: var(--space-xs);" id="home-sections-draggable-container">
            ${sectionsHtml}
          </div>
        </div>
      </div>

      <form id="admin-home-editor-form">
        
        <!-- 2. HERO HEADINGS & IDENTITY -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>2. Hero Identity & Headings</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="home-hero-title">Main Identity / Name *</label>
                <input type="text" class="form-input" id="home-hero-title" value="${escapeHtml(home.heroTitle)}" required placeholder="e.g. Olflaz" />
                <span class="form-helper">The primary H1 title displayed on the landing hero.</span>
              </div>

              <div class="form-group">
                <label class="form-label" for="home-hero-tagline">Identity Tagline Badge *</label>
                <input type="text" class="form-input" id="home-hero-tagline" value="${escapeHtml(home.heroTagline)}" required placeholder="e.g. Minecraft Creator & Godot Game Developer" />
                <span class="form-helper">Pill badge shown above the main heading.</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="home-hero-subtitle">Hero Subheading</label>
              <input type="text" class="form-input" id="home-hero-subtitle" value="${escapeHtml(home.heroSubtitle)}" placeholder="Short hook describing what you do..." />
            </div>

            <div class="form-group">
              <label class="form-label" for="home-hero-bio">Hero Introduction Bio</label>
              <textarea class="form-textarea" id="home-hero-bio" rows="3" placeholder="Intro paragraph for visitors...">${escapeHtml(home.heroBio)}</textarea>
            </div>
          </div>
        </div>

        <!-- 3. AVATAR & MEDIA -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>3. Hero Avatar & Image</span>
            </div>
          </div>
          <div class="form-section-body">
            ${renderImageUploader({
              id: "home-avatar-url",
              value: home.avatarUrl,
              label: "Hero Profile / Avatar Image",
              helperText: "Upload avatar from PC (Square 1:1 ratio) or paste URL.",
              placeholder: "https://... or upload from PC",
              aspect: "1/1"
            })}
          </div>
        </div>

        <!-- 4. CALL TO ACTION BUTTONS -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>4. Call To Action (CTA) Buttons</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="home-cta-primary-text">Primary Button Label</label>
                <input type="text" class="form-input" id="home-cta-primary-text" value="${escapeHtml(home.primaryCtaText)}" placeholder="View My Projects" />
              </div>

              <div class="form-group">
                <label class="form-label" for="home-cta-primary-link">Primary Button Target Route / URL</label>
                <input type="text" class="form-input" id="home-cta-primary-link" value="${escapeHtml(home.primaryCtaLink)}" placeholder="#/projects" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="home-cta-secondary-text">Secondary Button Label</label>
                <input type="text" class="form-input" id="home-cta-secondary-text" value="${escapeHtml(home.secondaryCtaText)}" placeholder="Watch My Videos" />
              </div>

              <div class="form-group">
                <label class="form-label" for="home-cta-secondary-link">Secondary Button Target Route / URL</label>
                <input type="text" class="form-input" id="home-cta-secondary-link" value="${escapeHtml(home.secondaryCtaLink)}" placeholder="#/videos" />
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button Bar -->
        <div style="display: flex; justify-content: flex-end; gap: var(--space-sm); margin-top: var(--space-lg);">
          <button type="submit" class="btn btn-primary btn-lg" id="save-home-btn">
            Save Home Page Content
          </button>
        </div>

      </form>

    </div>
  `;
}

export function initAdminHomeEvents(reRenderCallback) {
  // Drag & drop for Home Sections
  const sectionsContainer = document.getElementById("home-sections-draggable-container");
  if (sectionsContainer) {
    initDraggableList({
      container: sectionsContainer,
      itemSelector: ".draggable-card",
      handleSelector: ".drag-handle",
      onReorder: (fromIdx, toIdx) => {
        store.reorderHomeSections(fromIdx, toIdx);
        toast.info("Homepage section order updated!");
        if (reRenderCallback) reRenderCallback();
      }
    });

    // Section Enabled Toggles
    sectionsContainer.querySelectorAll(".section-enabled-toggle").forEach(toggle => {
      toggle.addEventListener("change", (e) => {
        const id = toggle.getAttribute("data-id");
        const sections = store.getHomeSections().map(s => {
          if (s.id === id) return { ...s, enabled: e.target.checked };
          return s;
        });
        store.updateHomeSections(sections);
        toast.success(`Section visibility updated!`);
        if (reRenderCallback) reRenderCallback();
      });
    });

    // Section Custom Title Inputs
    sectionsContainer.querySelectorAll(".section-title-input").forEach(input => {
      input.addEventListener("change", (e) => {
        const id = input.getAttribute("data-id");
        const sections = store.getHomeSections().map(s => {
          if (s.id === id) return { ...s, title: e.target.value.trim() || s.name };
          return s;
        });
        store.updateHomeSections(sections);
        toast.success(`Section title saved!`);
      });
    });
  }

  const form = document.getElementById("admin-home-editor-form");
  if (form) {
    // Initialize Image Uploader for Home Hero Avatar
    initImageUploader(form, "home-avatar-url");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById("save-home-btn");

      const heroTitle = document.getElementById("home-hero-title").value.trim();
      const heroTagline = document.getElementById("home-hero-tagline").value.trim();
      const heroSubtitle = document.getElementById("home-hero-subtitle").value.trim();
      const heroBio = document.getElementById("home-hero-bio").value.trim();
      const avatarUrl = document.getElementById("home-avatar-url").value.trim();
      const primaryCtaText = document.getElementById("home-cta-primary-text").value.trim() || "View My Projects";
      const primaryCtaLink = document.getElementById("home-cta-primary-link").value.trim() || "#/projects";
      const secondaryCtaText = document.getElementById("home-cta-secondary-text").value.trim() || "Watch My Videos";
      const secondaryCtaLink = document.getElementById("home-cta-secondary-link").value.trim() || "#/videos";

      if (!heroTitle) {
        toast.error("Main identity title is required");
        document.getElementById("home-hero-title").focus();
        return;
      }

      saveBtn.disabled = true;
      saveBtn.textContent = "⏳ Saving...";

      setTimeout(() => {
        store.updateHome({
          heroTitle,
          heroTagline,
          heroSubtitle,
          heroBio,
          avatarUrl,
          primaryCtaText,
          primaryCtaLink,
          secondaryCtaText,
          secondaryCtaLink
        });

        saveBtn.disabled = false;
        saveBtn.textContent = "💾 Save Home Page Content";

        toast.success("Home page copy and CTA settings saved successfully!");
      }, 150);
    });
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
