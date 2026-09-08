/**
 * Admin Minecraft Channel Settings & Visuals View
 * Dedicated editor for Minecraft YouTube channel identity, banner, avatar,
 * subscriber count, description, and public showcase card visibility.
 */

import { store } from "../../store/state.js";
import { toast } from "../../components/Toast.js";
import { getIcon } from "../../utils/icons.js";
import { renderImageUploader, initImageUploader } from "../../components/ImageUploader.js";

export function renderAdminMinecraftView() {
  const minecraft = store.getMinecraftChannel();

  return `
    <div class="admin-minecraft-page">
      
      <!-- Page Header -->
      <div class="admin-page-header">
        <div class="admin-page-header-info">
          <h1>Minecraft Channel Settings</h1>
          <p>Manage your dedicated Minecraft YouTube channel identity, upload custom profile & banner images, configure subscriber counts, and customize the public showcase card.</p>
        </div>
        <div class="flex gap-xs">
          ${minecraft.channelUrl ? `
            <a href="${escapeHtml(minecraft.channelUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="Open configured YouTube channel">
              ${getIcon("external", 13)} Open YouTube Channel ↗
            </a>
          ` : ''}
          <a href="#/" target="_blank" class="btn btn-secondary btn-sm" title="Preview on live homepage">
            ${getIcon("eye", 13)} Preview Live Site ↗
          </a>
        </div>
      </div>

      <form id="admin-minecraft-form" style="max-width: 900px;">
        
        <!-- 1. DISPLAY & VISIBILITY -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>1. Channel Section Visibility</span>
            </div>
            <span class="badge ${minecraft.enabled ? 'badge-published' : 'badge-draft'}">
              ${minecraft.enabled ? '● Active Publicly' : '○ Hidden Publicly'}
            </span>
          </div>
          <div class="form-section-body">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="flex items-center gap-sm" style="cursor: pointer; user-select: none;">
                <input 
                  type="checkbox" 
                  id="minecraft-enabled" 
                  ${minecraft.enabled ? 'checked' : ''} 
                  style="width: 18px; height: 18px; accent-color: var(--accent-primary); cursor: pointer;"
                />
                <div>
                  <strong style="color: var(--text-main); font-size: var(--text-sm);">Show Minecraft Channel Section on Public Website</strong>
                  <div class="text-xs text-muted" style="margin-top: 2px;">
                    When enabled, a dedicated Minecraft YouTube showcase card is displayed on the homepage. When disabled, the section is completely hidden.
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- 2. CHANNEL IDENTITY & LINK -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>2. Channel Identity & Information</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="minecraft-name">Channel Name *</label>
                <input 
                  type="text" 
                  class="form-input" 
                  id="minecraft-name" 
                  value="${escapeHtml(minecraft.channelName || '')}" 
                  required 
                  placeholder="e.g. Olflaz Gaming" 
                />
                <span class="form-helper">The primary name of your Minecraft YouTube channel.</span>
              </div>

              <div class="form-group">
                <label class="form-label" for="minecraft-url">YouTube Channel URL *</label>
                <input 
                  type="url" 
                  class="form-input" 
                  id="minecraft-url" 
                  value="${escapeHtml(minecraft.channelUrl || '')}" 
                  required 
                  placeholder="e.g. https://www.youtube.com/@olflaz" 
                />
                <span class="form-helper">Destination opened when visitors click the "Visit Channel" button.</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="minecraft-subscribers">Subscriber Count / Badge Text (Optional)</label>
              <input 
                type="text" 
                class="form-input" 
                id="minecraft-subscribers" 
                value="${escapeHtml(minecraft.subscribers || '')}" 
                placeholder="e.g. 1.2K Subscribers or 45K+ Subs" 
              />
              <span class="form-helper">Optional stat pill displayed next to the channel title.</span>
            </div>

            <div class="form-group">
              <label class="form-label" for="minecraft-description">Short Channel Description *</label>
              <textarea 
                class="form-textarea" 
                id="minecraft-description" 
                rows="3" 
                placeholder="e.g. Minecraft content featuring SMPs, PvP, challenges, and plenty of fun along the way."
              >${escapeHtml(minecraft.description || '')}</textarea>
              <span class="form-helper">Hook description highlighting the Minecraft focus, challenges, and community.</span>
            </div>
          </div>
        </div>

        <!-- 3. VISUAL MEDIA & IMAGES -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>3. Channel Profile & Banner Images</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="form-group" style="margin-bottom: var(--space-xl);">
              ${renderImageUploader({
                id: "minecraft-profile-img",
                value: minecraft.profileImage || "",
                label: "Channel Profile / Avatar Image (Square 1:1)",
                helperText: "Upload profile image from PC (1:1 square ratio) or paste URL.",
                placeholder: "https://... or upload avatar from PC",
                aspect: "1/1"
              })}
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              ${renderImageUploader({
                id: "minecraft-banner-img",
                value: minecraft.bannerImage || "",
                label: "Channel Banner Image (Optional, Wide 21:9 or 16:9)",
                helperText: "Upload panoramic banner image from PC or paste URL. Displayed across the top of the channel card.",
                placeholder: "https://... or upload banner from PC",
                aspect: "21/9"
              })}
            </div>
          </div>
        </div>

        <!-- Sticky Action & Save Bar -->
        <div class="admin-sticky-bar">
          <div class="admin-sticky-bar-left">
            <span style="color: var(--status-active-text);">${getIcon("sparkles", 14)}</span>
            <span>Minecraft Channel settings sync live to the public website.</span>
          </div>
          <div class="admin-sticky-bar-right">
            <button type="button" class="btn btn-outline" id="discard-minecraft-btn">
              Discard Changes
            </button>
            <button type="submit" class="btn btn-primary" id="save-minecraft-btn">
              💾 Save Minecraft Channel
            </button>
          </div>
        </div>

      </form>

    </div>
  `;
}

/**
 * Event handlers for Minecraft Channel settings form
 */
export function initAdminMinecraftEvents(reRenderCallback) {
  const form = document.getElementById("admin-minecraft-form");
  if (!form) return;

  // Initialize Image Uploaders
  initImageUploader(form, "minecraft-profile-img");
  initImageUploader(form, "minecraft-banner-img");

  // Discard Button
  const discardBtn = document.getElementById("discard-minecraft-btn");
  if (discardBtn) {
    discardBtn.addEventListener("click", () => {
      if (reRenderCallback) reRenderCallback();
      toast.info("Minecraft Channel edits discarded.");
    });
  }

  // Form Submit / Save
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const saveBtn = document.getElementById("save-minecraft-btn");
    const enabled = document.getElementById("minecraft-enabled").checked;
    const channelName = document.getElementById("minecraft-name").value.trim();
    const channelUrl = document.getElementById("minecraft-url").value.trim();
    const subscribers = document.getElementById("minecraft-subscribers").value.trim();
    const description = document.getElementById("minecraft-description").value.trim();
    const profileImage = document.getElementById("minecraft-profile-img").value.trim();
    const bannerImage = document.getElementById("minecraft-banner-img").value.trim();

    if (!channelName) {
      toast.error("Channel Name is required");
      return;
    }

    if (!channelUrl) {
      toast.error("YouTube Channel URL is required");
      return;
    }

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = "Saving...";
    }

    setTimeout(() => {
      store.updateMinecraftChannel({
        enabled,
        channelName,
        channelUrl,
        subscribers,
        description,
        profileImage,
        bannerImage
      });

      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = "💾 Save Minecraft Channel";
      }

      toast.success("Minecraft Channel settings saved successfully!");
      if (reRenderCallback) reRenderCallback();
    }, 150);
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
