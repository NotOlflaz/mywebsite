/**
 * Admin Channel Overview & Statistics Editor
 */

import { store } from "../../store/state.js";
import { toast } from "../../components/Toast.js";
import { getIcon } from "../../utils/icons.js";

export function renderAdminChannelView() {
  const stats = store.getChannelStats();

  return `
    <div class="admin-channel-page">
      
      <div class="admin-page-header">
        <div class="admin-page-header-info">
          <h1>Channel Overview & Statistics</h1>
          <p>Update live subscriber counts, total views, project milestones, and public channel descriptions.</p>
        </div>
        <a href="#/" target="_blank" class="btn btn-secondary btn-sm">
          ${getIcon('eye', 13)} Preview on Home Page
        </a>
      </div>

      <form id="admin-channel-form" style="max-width: 900px;">
        
        <!-- 1. LIVE METRICS -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>1. YouTube Metrics & Milestones</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="channel-name">YouTube Channel Name *</label>
                <input type="text" class="form-input" id="channel-name" value="${escapeHtml(stats.channelName)}" required placeholder="Olflaz" />
              </div>

              <div class="form-group">
                <label class="form-label" for="channel-subs">Subscriber Count String *</label>
                <input type="text" class="form-input" id="channel-subs" value="${escapeHtml(stats.subscribers)}" placeholder="e.g. 45.2K" required />
                <span class="form-helper">Displayed in the Channel Overview card on the Home page.</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="channel-views">Total Video Views String *</label>
                <input type="text" class="form-input" id="channel-views" value="${escapeHtml(stats.totalViews)}" placeholder="e.g. 3.8M+" required />
              </div>

              <div class="form-group">
                <label class="form-label" for="channel-videos-count">Total Videos Milestone</label>
                <input type="text" class="form-input" id="channel-videos-count" value="${escapeHtml(stats.videoCount)}" placeholder="e.g. 84+" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="channel-projects-count">Total Projects Milestone</label>
              <input type="text" class="form-input" id="channel-projects-count" value="${escapeHtml(stats.projectCount)}" placeholder="e.g. 12+" />
            </div>
          </div>
        </div>

        <!-- 2. CHANNEL BIO -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>2. Channel Description</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="form-group">
              <label class="form-label" for="channel-description">Channel Bio / Description</label>
              <textarea class="form-textarea" id="channel-description" rows="3">${escapeHtml(stats.description)}</textarea>
              <span class="form-helper">Summary shown in the Home Page Channel Overview box.</span>
            </div>
          </div>
        </div>

        <!-- Sticky Action & Save Bar -->
        <div class="admin-sticky-bar">
          <div class="admin-sticky-bar-left">
            <span style="color: var(--status-active-text);">${getIcon('sparkles', 14)}</span>
            <span>Channel metrics are displayed on the public Home page.</span>
          </div>
          <div class="admin-sticky-bar-right">
            <button type="button" class="btn btn-outline" id="discard-channel-btn">
              Discard Changes
            </button>
            <button type="submit" class="btn btn-primary" id="save-channel-btn">
              💾 Save Channel Statistics
            </button>
          </div>
        </div>

      </form>

    </div>
  `;
}

export function initAdminChannelEvents(reRenderCallback) {
  const form = document.getElementById("admin-channel-form");
  if (form) {
    const discardBtn = document.getElementById("discard-channel-btn");
    if (discardBtn) {
      discardBtn.addEventListener("click", () => {
        if (reRenderCallback) reRenderCallback();
        toast.info("Channel statistics edits discarded.");
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById("save-channel-btn");

      const channelName = document.getElementById("channel-name").value.trim();
      const subscribers = document.getElementById("channel-subs").value.trim();
      const totalViews = document.getElementById("channel-views").value.trim();
      const projectCount = document.getElementById("channel-projects-count").value.trim();
      const videoCount = document.getElementById("channel-videos-count").value.trim();
      const description = document.getElementById("channel-description").value.trim();

      if (!channelName || !subscribers) {
        toast.error("Channel name and subscriber count are required");
        return;
      }

      saveBtn.disabled = true;
      saveBtn.textContent = "Saving...";

      setTimeout(() => {
        store.updateChannelStats({
          channelName,
          subscribers,
          totalViews,
          projectCount,
          videoCount,
          description
        });

        saveBtn.disabled = false;
        saveBtn.textContent = "Save Channel Statistics";

        toast.success("Channel metrics & statistics updated successfully!");
      }, 150);
    });
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
