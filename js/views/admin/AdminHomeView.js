/**
 * Admin Home Page Content Editor View
 * Manage Hero section text, identity badges, CTA buttons, and avatar image.
 */

import { store } from "../../store/state.js";
import { toast } from "../../components/Toast.js";
import { getIcon } from "../../utils/icons.js";

export function renderAdminHomeView() {
  const home = store.getHome();

  return `
    <div class="admin-home-page">
      
      <div class="admin-page-header">
        <div class="admin-page-header-info">
          <h1>Home Page Editor</h1>
          <p>Customize the landing hero section, identity tagline, intro text, and action buttons displayed on the public Home page.</p>
        </div>
        <a href="#/" target="_blank" class="btn btn-secondary btn-sm">
          ${getIcon('eye', 13)} Preview Live Home Page
        </a>
      </div>

      <form id="admin-home-editor-form">
        
        <!-- 1. HERO HEADINGS & IDENTITY -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>1. Hero Identity & Headings</span>
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

        <!-- 2. AVATAR & MEDIA -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>2. Hero Avatar & Image</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="form-group">
              <label class="form-label" for="home-avatar-url">Avatar / Profile Image URL</label>
              <input type="text" class="form-input" id="home-avatar-url" value="${escapeHtml(home.avatarUrl)}" placeholder="https://... or copy URL from Media Library" />
              <span class="form-helper">Leave empty to display the stylish default gamer/developer icon placeholder.</span>
            </div>
          </div>
        </div>

        <!-- 3. CALL TO ACTION BUTTONS -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>3. Call To Action (CTA) Buttons</span>
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

export function initAdminHomeEvents() {
  const form = document.getElementById("admin-home-editor-form");
  if (form) {
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
        return;
      }

      // Save state feedback
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = "Saving...";
      }

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

        // Also sync about avatar if updated
        if (avatarUrl) {
          store.updateAbout({ avatarUrl });
        }

        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = "Save Home Page Content";
        }

        toast.success("Home page content saved and live on public site!");
      }, 200);
    });
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
