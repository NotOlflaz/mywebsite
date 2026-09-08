/**
 * Admin Social Media Links Editor
 */

import { store } from "../../store/state.js";
import { toast } from "../../components/Toast.js";

export function renderAdminSocialView() {
  const social = store.getSocialLinks();

  return `
    <div class="admin-social-page">
      
      <div class="admin-page-header">
        <div class="admin-page-header-info">
          <h1>Social Links & Community Hubs</h1>
          <p>Configure links to your YouTube channel, Discord community server, GitHub repositories, and game storefronts.</p>
        </div>
      </div>

      <form id="admin-social-form" style="max-width: 900px;">
        
        <!-- 1. MAIN COMMUNITY -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>1. Primary Community Hubs</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="form-group">
              <label class="form-label" for="social-youtube">YouTube Channel URL *</label>
              <input type="url" class="form-input" id="social-youtube" value="${escapeHtml(social.youtube)}" required placeholder="https://youtube.com/@olflaz" />
            </div>

            <div class="form-group">
              <label class="form-label" for="social-discord">Discord Server Invite URL *</label>
              <input type="url" class="form-input" id="social-discord" value="${escapeHtml(social.discord)}" required placeholder="https://discord.gg/olflaz" />
            </div>
          </div>
        </div>

        <!-- 2. CODE & GAMES -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>2. Code & Game Storefronts</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="form-group">
              <label class="form-label" for="social-github">GitHub Profile / Organization URL</label>
              <input type="url" class="form-input" id="social-github" value="${escapeHtml(social.github)}" placeholder="https://github.com/olflaz" />
            </div>

            <div class="form-group">
              <label class="form-label" for="social-itch">itch.io Page URL</label>
              <input type="url" class="form-input" id="social-itch" value="${escapeHtml(social.itch)}" placeholder="https://olflaz.itch.io" />
            </div>
          </div>
        </div>

        <!-- 3. ADDITIONAL PLATFORMS & EMAIL -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>3. Other Platforms & Contact Email</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="social-twitter">Twitter / X URL</label>
                <input type="url" class="form-input" id="social-twitter" value="${escapeHtml(social.twitter)}" placeholder="https://twitter.com/olflaz" />
              </div>

              <div class="form-group">
                <label class="form-label" for="social-twitch">Twitch Stream URL</label>
                <input type="url" class="form-input" id="social-twitch" value="${escapeHtml(social.twitch)}" placeholder="https://twitch.tv/olflaz" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="social-email">Public Inquiries / Business Email</label>
              <input type="email" class="form-input" id="social-email" value="${escapeHtml(social.email)}" placeholder="contact@olflaz.com" />
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: var(--space-lg);">
          <button type="submit" class="btn btn-primary btn-lg" id="save-social-btn">
            Save Social Links
          </button>
        </div>

      </form>

    </div>
  `;
}

export function initAdminSocialEvents() {
  const form = document.getElementById("admin-social-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById("save-social-btn");

      const youtube = document.getElementById("social-youtube").value.trim();
      const discord = document.getElementById("social-discord").value.trim();
      const github = document.getElementById("social-github").value.trim();
      const itch = document.getElementById("social-itch").value.trim();
      const twitter = document.getElementById("social-twitter").value.trim();
      const twitch = document.getElementById("social-twitch").value.trim();
      const email = document.getElementById("social-email").value.trim();

      saveBtn.disabled = true;
      saveBtn.textContent = "Saving...";

      setTimeout(() => {
        store.updateSocialLinks({
          youtube,
          discord,
          github,
          itch,
          twitter,
          twitch,
          email
        });

        saveBtn.disabled = false;
        saveBtn.textContent = "Save Social Links";

        toast.success("Social links updated and live across the website!");
      }, 150);
    });
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
