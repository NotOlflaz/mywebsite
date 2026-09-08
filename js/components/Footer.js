/**
 * Public Semantic Footer Component
 * Dark, elegant footer with social badges, quick navigation columns, and copyright.
 */

import { store } from "../store/state.js";
import { getIcon } from "../utils/icons.js";

export function renderFooter() {
  const settings = store.getSiteSettings();
  const social = store.getSocialLinks();
  const currentYear = new Date().getFullYear();

  return `
    <footer class="public-footer" role="contentinfo">
      <div class="container">
        <div class="footer-grid">
          
          <!-- Col 1: Identity & Bio -->
          <div>
            <div class="nav-brand" style="margin-bottom: var(--space-sm);">
              <span>${settings.siteName || 'Olflaz'}</span>
              <span class="nav-brand-tag">PORTFOLIO</span>
            </div>
            <p style="font-size: var(--text-sm); max-width: 320px; margin-bottom: var(--space-md); color: var(--text-muted); line-height: 1.6;">
              ${settings.siteDescription || 'Indie game developer focusing on Godot Engine and creator of custom Minecraft adventures.'}
            </p>
            <div class="flex gap-xs flex-wrap">
              <a href="${social.youtube || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-youtube btn-sm">
                ${getIcon("youtube", 14)}
                <span>YouTube</span>
              </a>
              <a href="${social.discord || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-discord btn-sm">
                ${getIcon("discord", 14)}
                <span>Discord</span>
              </a>
              <a href="${social.github || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
                ${getIcon("github", 14)}
                <span>GitHub</span>
              </a>
            </div>
          </div>

          <!-- Col 2: Navigation Links -->
          <div>
            <h4 class="footer-col-title">Navigation</h4>
            <ul class="footer-nav-list">
              <li><a href="#/" class="footer-nav-link">Home</a></li>
              <li><a href="#/projects" class="footer-nav-link">Projects & Games</a></li>
              <li><a href="#/videos" class="footer-nav-link">Videos & Tutorials</a></li>
              <li><a href="#/about" class="footer-nav-link">About Olflaz</a></li>
              <li><a href="#/portfolio" class="footer-nav-link">Work Portfolio</a></li>
            </ul>
          </div>

          <!-- Col 3: Community & Socials -->
          <div>
            <h4 class="footer-col-title">Connect & Play</h4>
            <ul class="footer-nav-list">
              <li><a href="${social.youtube || '#'}" target="_blank" rel="noopener noreferrer" class="footer-nav-link">YouTube Channel ↗</a></li>
              <li><a href="${social.discord || '#'}" target="_blank" rel="noopener noreferrer" class="footer-nav-link">Discord Server ↗</a></li>
              <li><a href="${social.github || '#'}" target="_blank" rel="noopener noreferrer" class="footer-nav-link">GitHub Repositories ↗</a></li>
              <li><a href="${social.itch || '#'}" target="_blank" rel="noopener noreferrer" class="footer-nav-link">itch.io Games ↗</a></li>
              <li><a href="${social.twitter || '#'}" target="_blank" rel="noopener noreferrer" class="footer-nav-link">Twitter / X ↗</a></li>
            </ul>
          </div>

          <!-- Col 4: Platform & Management -->
          <div>
            <h4 class="footer-col-title">CMS Management</h4>
            <ul class="footer-nav-list">
              <li><a href="#/admin" class="footer-nav-link" style="color: var(--accent-primary); font-weight: 700;">Admin Dashboard</a></li>
              <li><a href="#/admin/appearance" class="footer-nav-link">Theme & Appearance</a></li>
              <li><a href="#/admin/projects" class="footer-nav-link">Manage Projects</a></li>
              <li><a href="#/admin/videos" class="footer-nav-link">Manage Videos</a></li>
              <li><a href="#/admin/settings" class="footer-nav-link">Site Settings & Backup</a></li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="footer-bottom">
          <div>
            ${settings.footerText || `&copy; ${currentYear} ${settings.siteName || 'Olflaz'}. All rights reserved.`}
          </div>
          <div>
            ${settings.footerSubtext || 'Built with Vanilla JavaScript & Modern Dark Design System'}
          </div>
        </div>
      </div>
    </footer>
  `;
}
