/**
 * Admin Site Settings & SEO Editor View
 * Handles Site metadata, SEO parameters, JSON backup export/import, and data reset.
 */

import { store } from "../../store/state.js";
import { authStore } from "../../store/auth.js";
import { router } from "../../router/router.js";
import { toast } from "../../components/Toast.js";
import { getIcon } from "../../utils/icons.js";
import { renderImageUploader, initImageUploader } from "../../components/ImageUploader.js";

export function renderAdminSettingsView() {
  const settings = store.getSiteSettings();

  return `
    <div class="admin-settings-page">
      
      <div class="admin-page-header">
        <div class="admin-page-header-info">
          <h1>Site Settings & SEO</h1>
          <p>Configure website metadata, identity branding, search engine optimization tags, and data backups.</p>
        </div>
      </div>

      <!-- 1. GENERAL SITE CONFIGURATION -->
      <form id="admin-settings-form">
        
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>1. General Branding & Identity</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="setting-sitename">Site / Identity Name *</label>
                <input type="text" class="form-input" id="setting-sitename" value="${escapeHtml(settings.siteName)}" required placeholder="Olflaz" />
              </div>

              <div class="form-group">
                <label class="form-label" for="setting-tagline">Tagline / Subheading</label>
                <input type="text" class="form-input" id="setting-tagline" value="${escapeHtml(settings.tagline)}" placeholder="Minecraft Creator & Godot Game Developer" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="setting-description">Site Summary Description</label>
              <textarea class="form-textarea" id="setting-description" rows="2">${escapeHtml(settings.siteDescription)}</textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="setting-logotext">Header Logo Badge Text</label>
                <input type="text" class="form-input" id="setting-logotext" value="${escapeHtml(settings.logoText)}" placeholder="OLFLAZ" />
              </div>

              <div class="form-group">
                <label class="form-label" for="setting-favicon">Favicon URL</label>
                <input type="text" class="form-input" id="setting-favicon" value="${escapeHtml(settings.faviconUrl)}" placeholder="https://... or favicon.ico" />
              </div>
            </div>
          </div>
        </div>

        <!-- 2. SEO META -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>2. Search Engine Optimization (SEO)</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="form-group">
              <label class="form-label" for="setting-seotitle">Default Page SEO Title</label>
              <input type="text" class="form-input" id="setting-seotitle" value="${escapeHtml(settings.seoTitle)}" placeholder="Olflaz | Minecraft Creator & Godot Game Developer" />
            </div>

            <div class="form-group">
              <label class="form-label" for="setting-seodesc">SEO Meta Description</label>
              <textarea class="form-textarea" id="setting-seodesc" rows="2">${escapeHtml(settings.seoDescription)}</textarea>
            </div>

            ${renderImageUploader({
              id: "setting-socialimage",
              value: settings.defaultSocialImage,
              label: "Default Social Share Image (Open Graph / Twitter Card)",
              helperText: "Upload a 1200x630 banner or paste an external image URL for social previews.",
              placeholder: "https://... or upload from PC",
              aspect: "16/9"
            })}
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-bottom: var(--space-2xl);">
          <button type="submit" class="btn btn-primary btn-lg" id="save-settings-btn">
            Save Settings & SEO
          </button>
        </div>
      </form>

      <!-- 3. DATA BACKUP, EXPORT & RESTORE -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>3. CMS Data Management & Backups</span>
          </div>
        </div>
        <div class="form-section-body">
          <p class="text-sm text-muted">
            All your content (Projects, Videos, Portfolio, About, Media, Settings) is saved in local browser storage. You can export a full JSON backup to transfer data or restore from a previous save.
          </p>

          <div class="flex gap-sm flex-wrap" style="margin-top: 8px;">
            <button class="btn btn-secondary" id="export-json-backup-btn">
              ${getIcon('download', 14)} Download Complete JSON Backup
            </button>
            
            <label class="btn btn-secondary" style="margin-bottom: 0; cursor: pointer;">
              ${getIcon('upload', 14)} Restore From JSON Backup File
              <input type="file" id="import-json-file-input" accept=".json" style="display: none;" />
            </label>

            <button class="btn btn-danger" id="reset-default-data-btn">
              Reset to Default Demo Data
            </button>
          </div>

          <div class="form-group" style="margin-top: var(--space-lg);">
            <label class="form-label" for="direct-json-import">Or Paste JSON Data Directly:</label>
            <textarea class="form-textarea font-mono" id="direct-json-import" rows="3" placeholder='{"projects": [...], "videos": [...]}'></textarea>
            <div style="margin-top: 8px;">
              <button class="btn btn-secondary btn-sm" id="apply-pasted-json-btn">Apply Pasted JSON</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. SECURITY & COMPLIANCE -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>4. Administrator Security & Active Session</span>
          </div>
        </div>
        <div class="form-section-body">
          <div class="grid grid-2 gap-md">
            <div style="background: var(--bg-surface-alt); padding: var(--space-md); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
              <div class="flex items-center gap-xs font-bold" style="color: #ffffff; margin-bottom: 4px;">
                <span class="text-primary">${getIcon("shield", 16)}</span>
                <span>Active Administrator</span>
              </div>
              <p class="text-sm text-muted font-mono" style="margin: 0;">User: <strong>olflaz</strong> (Verified Master Admin)</p>
              <p class="text-xs text-light" style="margin-top: 4px;">Protected by salted SHA-256 Web Crypto hashing & brute force lockout rate-limiting.</p>
            </div>

            <div style="background: var(--bg-surface-alt); padding: var(--space-md); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
              <div class="flex items-center gap-xs font-bold" style="color: #ffffff; margin-bottom: 4px;">
                <span class="text-success">${getIcon("lock", 16)}</span>
                <span>Session Status</span>
              </div>
              <p class="text-sm text-muted font-mono" style="margin: 0;">Status: <span style="color: #22c55e;">● Active & Encrypted</span></p>
              <div style="margin-top: 10px;">
                <button id="settings-logout-btn" class="btn btn-outline btn-sm admin-logout-btn">
                  ${getIcon("logOut", 14)}
                  <span>Sign Out Session</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
}

export function initAdminSettingsEvents(reRenderCallback) {
  // Initialize Image Uploader for Social Share Image
  initImageUploader(document, "setting-socialimage");

  // Settings Form Submit
  const form = document.getElementById("admin-settings-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById("save-settings-btn");

      const siteName = document.getElementById("setting-sitename").value.trim();
      const tagline = document.getElementById("setting-tagline").value.trim();
      const siteDescription = document.getElementById("setting-description").value.trim();
      const logoText = document.getElementById("setting-logotext").value.trim();
      const faviconUrl = document.getElementById("setting-favicon").value.trim();
      const seoTitle = document.getElementById("setting-seotitle").value.trim();
      const seoDescription = document.getElementById("setting-seodesc").value.trim();
      const defaultSocialImage = document.getElementById("setting-socialimage").value.trim();

      saveBtn.disabled = true;
      saveBtn.textContent = "⏳ Saving...";

      setTimeout(() => {
        store.updateSiteSettings({
          siteName,
          tagline,
          siteDescription,
          logoText,
          faviconUrl,
          seoTitle,
          seoDescription,
          defaultSocialImage
        });

        document.title = `Admin CMS - Site Settings | ${siteName}`;

        saveBtn.disabled = false;
        saveBtn.textContent = "💾 Save Settings & SEO";

        toast.success("Site & SEO settings saved successfully!");
      }, 150);
    });
  }

  // Export JSON Backup
  const exportBtn = document.getElementById("export-json-backup-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(store.exportDataAsJSON());
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `olflaz_cms_backup_${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success("JSON backup generated and downloaded!");
    });
  }

  // Import JSON File
  const fileInput = document.getElementById("import-json-file-input");
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = store.importDataFromJSON(event.target.result);
        if (result.success) {
          toast.success("Data restored successfully! Refreshing view...");
          if (reRenderCallback) reRenderCallback();
        } else {
          toast.error(`Import failed: ${result.error}`);
        }
      };
      reader.readAsText(file);
    });
  }

  // Apply Pasted JSON
  const pasteApplyBtn = document.getElementById("apply-pasted-json-btn");
  if (pasteApplyBtn) {
    pasteApplyBtn.addEventListener("click", () => {
      const text = document.getElementById("direct-json-import").value.trim();
      if (!text) {
        toast.error("Please paste valid JSON data into the text box");
        return;
      }

      const result = store.importDataFromJSON(text);
      if (result.success) {
        toast.success("JSON data imported successfully!");
        if (reRenderCallback) reRenderCallback();
      } else {
        toast.error(`Import error: ${result.error}`);
      }
    });
  }

  // Reset to Default Demo Data
  const resetBtn = document.getElementById("reset-default-data-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("WARNING: This will reset all projects, videos, portfolio, and settings back to the initial Olflaz seed data. Are you sure?")) {
        store.resetToDefaultData();
        toast.info("Database reset to initial demo state.");
        if (reRenderCallback) reRenderCallback();
      }
    });
  }

  // Security Sign Out Button
  const settingsLogoutBtn = document.getElementById("settings-logout-btn");
  if (settingsLogoutBtn) {
    settingsLogoutBtn.addEventListener("click", () => {
      authStore.logout();
      toast.info("Logged out successfully.");
      router.navigate("#/admin/login");
    });
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
