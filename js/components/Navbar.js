/**
 * Public Navigation Bar Component
 * 3-Column Desktop Layout: Left Brand, Center Nav Pills, Right Social CTAs & Admin link.
 * Responsive mobile drawer with clean minimalist SVG icons.
 */

import { store } from "../store/state.js";
import { getIcon } from "../utils/icons.js";

export function renderNavbar(activeRoute = "") {
  const social = store.getSocialLinks();
  const settings = store.getSiteSettings();

  const links = [
    { label: "Home", href: "#/" },
    { label: "Projects", href: "#/projects" },
    { label: "Videos", href: "#/videos" },
    { label: "About", href: "#/about" },
    { label: "Portfolio", href: "#/portfolio" }
  ];

  const linksHtml = links.map(link => {
    const isActive = activeRoute === link.href || (link.href === "#/" && (activeRoute === "" || activeRoute === "#"));
    return `
      <li>
        <a href="${link.href}" class="nav-link ${isActive ? 'active' : ''}">
          ${link.label}
        </a>
      </li>
    `;
  }).join("");

  const mobileLinksHtml = links.map(link => {
    const isActive = activeRoute === link.href || (link.href === "#/" && (activeRoute === "" || activeRoute === "#"));
    return `
      <li>
        <a href="${link.href}" class="mobile-nav-link ${isActive ? 'active' : ''}">
          ${link.label}
        </a>
      </li>
    `;
  }).join("");

  return `
    <header class="public-header" id="main-public-header">
      <div class="container nav-container">
        
        <!-- LEFT: Brand Identity -->
        <a href="#/" class="nav-brand" title="${settings.siteName} Home">
          <span>${settings.siteName || 'Olflaz'}</span>
          <span class="nav-brand-tag">DEV & CREATOR</span>
        </a>

        <!-- CENTER: Navigation Links Segmented Pill Bar -->
        <div class="nav-center-wrapper">
          <nav aria-label="Main Navigation">
            <ul class="nav-links">
              ${linksHtml}
            </ul>
          </nav>
        </div>

        <!-- RIGHT: Action & Social Buttons -->
        <div class="nav-actions">
          <a href="${social.youtube || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-youtube btn-sm" title="Visit Olflaz YouTube Channel">
            ${getIcon("youtube", 14)}
            <span>YouTube</span>
          </a>
          <a href="${social.discord || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-discord btn-sm" title="Join Olflaz Discord Community">
            ${getIcon("discord", 14)}
            <span>Discord</span>
          </a>
          
          <!-- Mobile Hamburger Toggle -->
          <button class="hamburger-btn" id="mobile-menu-toggle-btn" aria-label="Toggle Navigation Menu">
            ${getIcon("gamepad", 18)}
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Drawer -->
      <div class="mobile-nav-drawer" id="mobile-nav-drawer">
        <div style="font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-light); font-weight: 700; padding: 0 var(--space-md);">
          Navigation
        </div>
        <ul class="mobile-nav-links">
          ${mobileLinksHtml}
        </ul>

        <div style="font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-light); font-weight: 700; padding: var(--space-md) var(--space-md) 0 var(--space-md); border-top: 1px solid var(--border-color);">
          Community & Channels
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px; padding: 0 var(--space-md);">
          <a href="${social.youtube || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-youtube btn-block">
            ${getIcon("youtube", 16)}
            <span>YouTube Channel</span>
          </a>
          <a href="${social.discord || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-discord btn-block">
            ${getIcon("discord", 16)}
            <span>Join Discord Community</span>
          </a>
        </div>
      </div>
    </header>
  `;
}

/**
 * Initialize navbar event handlers
 */
export function initNavbarEvents() {
  const toggleBtn = document.getElementById("mobile-menu-toggle-btn");
  const drawer = document.getElementById("mobile-nav-drawer");

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener("click", () => {
      drawer.classList.toggle("active");
    });

    // Close mobile drawer when any link is clicked
    const links = drawer.querySelectorAll("a");
    links.forEach(link => {
      link.addEventListener("click", () => {
        drawer.classList.remove("active");
      });
    });
  }
}
