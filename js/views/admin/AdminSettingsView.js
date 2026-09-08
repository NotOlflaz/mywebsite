/**
 * Admin Central Settings & Configuration View
 * Manages Site Name, Profile Image, Short Bio, Social Links, Footer Text, Appearance shortcut, SEO, and JSON Backups.
 */

import { store } from "../../store/state.js";
import { authStore } from "../../store/auth.js";
import { router } from "../../router/router.js";
import { toast } from "../../components/Toast.js";
import { getIcon } from "../../utils/icons.js";
import { renderImageUploader, initImageUploader } from "../../components/ImageUploader.js";

export function renderAdminSettingsView() {
  const settings = store.getSiteSettings();
  const about = store.getAbout();
  const social = store.getSocialLinks();
  const appearance = store.getAppearance();

  return `
    <div class="admin-settings-page">
      
      <div class="admin-page-header">
        <div class="admin-page-header-info">
          <h1>Global Site Settings</h1>
          <p>Centralized control for identity, profile media, social channels, footer, theme shortcuts, SEO metadata, and data backups.</p>
        </div>
        <div class="admin-page-header-actions">
          <a href="#/" target="_blank" class="btn btn-secondary btn-sm">
            <span>Preview Site ↗</span>
          </a>
        </div>
      </div>

      <form id="admin-settings-form">
        
        <!-- 1. CORE IDENTITY & BRANDING -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>1. Core Identity & Profile</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="setting-sitename">Site / Creator Name *</label>
                <input type="text" class="form-input" id="setting-sitename" value="${escapeHtml(settings.siteName || 'Olflaz')}" required placeholder="Olflaz" />
              </div>

              <div class="form-group">
                <label class="form-label" for="setting-tagline">Tagline / Identity</label>
                <input type="text" class="form-input" id="setting-tagline" value="${escapeHtml(settings.tagline || 'Minecraft Creator & Godot Game Developer')}" placeholder="Minecraft Creator & Godot Game Developer" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="setting-shortbio">Short Bio / Tagline Summary</label>
                <textarea class="form-textarea" id="setting-shortbio" rows="2" placeholder="Brief 1-2 sentence bio shown across public header and about teasers...">${escapeHtml(about.shortBio || settings.siteDescription || '')}</textarea>
              </div>

              <div class="form-group">
                <label class="form-label" for="setting-logotext">Header Logo Badge Text</label>
                <input type="text" class="form-input" id="setting-logotext" value="${escapeHtml(settings.logoText || 'OLFLAZ')}" placeholder="OLFLAZ" />
              </div>
            </div>

            <!-- Profile Avatar Uploader -->
            ${renderImageUploader({
              id: "setting-avatar",
              value: about.avatarUrl || "",
              label: "Creator Profile Avatar / Headshot",
              helperText: "Upload a clean profile avatar (1:1 ratio square or circle) or paste an image URL.",
              placeholder: "https://... or upload from PC",
              aspect: "1/1"
            })}
          </div>
        </div>

        <!-- 2. SOCIAL LINKS & COMMUNITY -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>2. Social Channels & Community URLs</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="setting-youtube">
                  ${getIcon("youtube", 14)} YouTube Channel URL
                </label>
                <input type="url" class="form-input font-mono" id="setting-youtube" value="${escapeHtml(social.youtube || '')}" placeholder="https://youtube.com/@olflaz" />
              </div>

              <div class="form-group">
                <label class="form-label" for="setting-discord">
                  ${getIcon("discord", 14)} Discord Server Invite
                </label>
                <input type="url" class="form-input font-mono" id="setting-discord" value="${escapeHtml(social.discord || '')}" placeholder="https://discord.gg/olflaz" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="setting-github">
                  ${getIcon("github", 14)} GitHub Profile / Repo
                </label>
                <input type="url" class="form-input font-mono" id="setting-github" value="${escapeHtml(social.github || '')}" placeholder="https://github.com/olflaz" />
              </div>

              <div class="form-group">
                <label class="form-label" for="setting-twitter">
                  ${getIcon("twitter", 14)} Twitter / X URL
                </label>
                <input type="url" class="form-input font-mono" id="setting-twitter" value="${escapeHtml(social.twitter || '')}" placeholder="https://twitter.com/olflaz" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="setting-itch">
                  ${getIcon("gamepad", 14)} itch.io Games URL
                </label>
                <input type="url" class="form-input font-mono" id="setting-itch" value="${escapeHtml(social.itch || '')}" placeholder="https://olflaz.itch.io" />
              </div>

              <div class="form-group">
                <label class="form-label" for="setting-twitch">
                  ${getIcon("twitch", 14)} Twitch Stream URL
                </label>
                <input type="url" class="form-input font-mono" id="setting-twitch" value="${escapeHtml(social.twitch || '')}" placeholder="https://twitch.tv/olflaz" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="setting-email">Public Inquiries / Contact Email</label>
              <input type="email" class="form-input font-mono" id="setting-email" value="${escapeHtml(social.email || '')}" placeholder="contact@olflaz.com" />
            </div>
          </div>
        </div>

        <!-- 3. THEME & APPEARANCE QUICK LINK -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>3. Global Theme & Visual Appearance</span>
            </div>
          </div>
          <div class="form-section-body">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-md); padding: var(--space-md); background: var(--bg-surface-alt); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
              <div class="flex items-center gap-md">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: ${appearance.accentPrimaryHex || 'var(--accent-primary)'}; box-shadow: 0 0 12px ${appearance.accentPrimaryHex || 'var(--accent-primary)'};"></div>
                <div>
                  <div class="font-bold text-sm" style="color: var(--text-main);">
                    Preset: <span style="text-transform: capitalize;">${appearance.themePreset || 'Default'}</span> | Accent: <span class="font-mono">${appearance.accentPrimaryHex || '#38bdf8'}</span>
                  </div>
                  <div class="text-xs text-muted" style="margin-top: 2px;">
                    Glow: ${appearance.glowLevel || 'subtle'} &bull; Heading Weight: ${appearance.headingWeight || '700'}
                  </div>
                </div>
              </div>

              <a href="#/admin/appearance" class="btn btn-secondary btn-sm">
                ${getIcon("palette", 14)}
                <span>Customize Colors, Glows & Theme ↗</span>
              </a>
            </div>
          </div>
        </div>

        <!-- 4. FOOTER & COPYRIGHT -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>4. Public Footer & Copyright</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="setting-footertext">Copyright Notice</label>
                <input type="text" class="form-input" id="setting-footertext" value="${escapeHtml(settings.footerText || `© ${new Date().getFullYear()} ${settings.siteName || 'Olflaz'}. All rights reserved.`)}" placeholder="© 2026 Olflaz. All rights reserved." />
              </div>

              <div class="form-group">
                <label class="form-label" for="setting-footersubtext">Footer Subtext / Tech Badge</label>
                <input type="text" class="form-input" id="setting-footersubtext" value="${escapeHtml(settings.footerSubtext || 'Crafted with passion for indie games & Minecraft.')}" placeholder="Crafted with passion for indie games & Minecraft." />
              </div>
            </div>
          </div>
        </div>

        <!-- 5. SEARCH ENGINE OPTIMIZATION (SEO) -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>5. Search Engine Optimization (SEO)</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="form-group">
              <label class="form-label" for="setting-seotitle">Default Page SEO Title</label>
              <input type="text" class="form-input" id="setting-seotitle" value="${escapeHtml(settings.seoTitle || '')}" placeholder="Olflaz | Minecraft Creator & Godot Game Developer" />
            </div>

            <div class="form-group">
              <label class="form-label" for="setting-seodesc">SEO Meta Description</label>
              <textarea class="form-textarea" id="setting-seodesc" rows="2">${escapeHtml(settings.seoDescription || '')}</textarea>
            </div>

            ${renderImageUploader({
              id: "setting-socialimage",
              value: settings.defaultSocialImage || "",
              label: "Default Social Share Image (Open Graph / Twitter Card)",
              helperText: "Upload a 1200x630 banner or paste an external image URL for social previews.",
              placeholder: "https://... or upload from PC",
              aspect: "16/9"
            })}
          </div>
        </div>

        <!-- Sticky Action & Save Bar -->
        <div class="admin-sticky-bar">
          <div class="admin-sticky-bar-left">
            <span style="color: var(--status-active-text);">${getIcon('sparkles', 14)}</span>
            <span>Site, SEO, and social settings update live across all pages.</span>
          </div>
          <div class="admin-sticky-bar-right">
            <button type="button" class="btn btn-outline" id="discard-settings-btn">
              Discard Changes
            </button>
            <button type="submit" class="btn btn-primary" id="save-settings-btn">
              💾 Save All Settings
            </button>
          </div>
        </div>

      </form>

      <!-- 6. CMS DATA MANAGEMENT & BACKUPS -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>6. CMS Data Management & Backups</span>
          </div>
        </div>
        <div class="form-section-body">
          <p class="text-sm text-muted">
            All content (Projects, Videos, Portfolio, About, Media, Settings, Themes) is persistently saved in local browser storage. You can export a full JSON backup to transfer data or restore from a previous save.
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

      <!-- 7. SECURITY & ACTIVE SESSION -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>7. Administrator Security & Active Session</span>
          </div>
        </div>
        <div class="form-section-body">
          <div class="grid grid-2 gap-md">
            <div style="background: var(--bg-surface-alt); padding: var(--space-md); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
              <div class="flex items-center gap-xs font-bold" style="color: #ffffff; margin-bottom: 4px;">
                <span class="text-primary">${getIcon("shield", 16)}</span>
                <span>Active Administrator</span>
              </div>
              <p class="text-sm text-muted font-mono" style="margin: 0;">User: <strong>olflaz</strong> (Master Admin)</p>
              <p class="text-xs text-light" style="margin-top: 4px;">Protected by salted SHA-256 Web Crypto hashing & lockout rate-limiting.</p>
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
  // Initialize Image Uploaders
  initImageUploader(document, "setting-avatar");
  initImageUploader(document, "setting-socialimage");

  // Discard Button
  const discardBtn = document.getElementById("discard-settings-btn");
  if (discardBtn) {
    discardBtn.addEventListener("click", () => {
      if (reRenderCallback) reRenderCallback();
      toast.info("Site settings edits discarded.");
    });
  }

  // Settings Form Submit
  const form = document.getElementById("admin-settings-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById("save-settings-btn");

      const siteName = document.getElementById("setting-sitename").value.trim();
      const tagline = document.getElementById("setting-tagline").value.trim();
      const shortBio = document.getElementById("setting-shortbio").value.trim();
      const logoText = document.getElementById("setting-logotext").value.trim();
      const avatarUrl = document.getElementById("setting-avatar").value.trim();

      const youtube = document.getElementById("setting-youtube").value.trim();
      const discord = document.getElementById("setting-discord").value.trim();
      const github = document.getElementById("setting-github").value.trim();
      const twitter = document.getElementById("setting-twitter").value.trim();
      const itch = document.getElementById("setting-itch").value.trim();
      const twitch = document.getElementById("setting-twitch").value.trim();
      const email = document.getElementById("setting-email").value.trim();

      const footerText = document.getElementById("setting-footertext").value.trim();
      const footerSubtext = document.getElementById("setting-footersubtext").value.trim();

      const seoTitle = document.getElementById("setting-seotitle").value.trim();
      const seoDescription = document.getElementById("setting-seodesc").value.trim();
      const defaultSocialImage = document.getElementById("setting-socialimage").value.trim();

      saveBtn.disabled = true;
      saveBtn.textContent = "⏳ Saving...";

      setTimeout(() => {
        store.updateSiteSettings({
          siteName,
          tagline,
          siteDescription: shortBio,
          logoText,
          footerText,
          footerSubtext,
          seoTitle,
          seoDescription,
          defaultSocialImage
        });

        store.updateAbout({
          avatarUrl,
          shortBio
        });

        store.updateHome({
          avatarUrl,
          heroBio: shortBio,
          heroTagline: tagline
        });

        store.updateSocialLinks({
          youtube,
          discord,
          github,
          twitter,
          itch,
          twitch,
          email
        });

        document.title = `Admin CMS - Site Settings | ${siteName}`;

        saveBtn.disabled = false;
        saveBtn.textContent = "💾 Save All Settings";

        toast.success("Global site settings updated successfully!");
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
      if (confirm("WARNING: This will reset all projects, videos, portfolio, and settings back to initial Olflaz demo seed. Are you sure?")) {
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

