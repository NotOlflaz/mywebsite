/**
 * Admin CMS Layout Component
 * Logical Grouping: ADMIN, CONTENT, WEBSITE, MEDIA, SETTINGS (with Appearance controls).
 * Clean minimalist SVG icons and unified dark design system.
 */

import { store } from "../../store/state.js";
import { authStore } from "../../store/auth.js";
import { toast } from "../../components/Toast.js";
import { router } from "../../router/router.js";
import { getIcon } from "../../utils/icons.js";

export function renderAdminLayout(contentHtml, activeAdminRoute = "#/admin", breadcrumbTitle = "Dashboard") {
  const settings = store.getSiteSettings();
  const about = store.getAbout();
  const metrics = store.getDashboardMetrics();
  const user = authStore.getUser();

  const navSections = [
    {
      group: "ADMIN",
      items: [
        { label: "Overview", href: "#/admin", iconName: "chart" }
      ]
    },
    {
      group: "CONTENT",
      items: [
        { label: "Videos", href: "#/admin/videos", iconName: "videos", count: metrics.totalVideos },
        { label: "Projects", href: "#/admin/projects", iconName: "projects", count: metrics.totalProjects },
        { label: "Portfolio", href: "#/admin/portfolio", iconName: "portfolio", count: metrics.totalPortfolio }
      ]
    },
    {
      group: "WEBSITE",
      items: [
        { label: "Home Page", href: "#/admin/home", iconName: "home" },
        { label: "Minecraft Channel", href: "#/admin/minecraft", iconName: "cube" },
        { label: "About Page", href: "#/admin/about", iconName: "about" },
        { label: "Featured Content", href: "#/admin/featured", iconName: "star", count: metrics.featuredProjects + metrics.featuredVideos }
      ]
    },
    {
      group: "MEDIA",
      items: [
        { label: "Media Library", href: "#/admin/media", iconName: "media", count: metrics.totalMedia }
      ]
    },
    {
      group: "SETTINGS",
      items: [
        { label: "Appearance", href: "#/admin/appearance", iconName: "palette" },
        { label: "Channel Stats", href: "#/admin/channel", iconName: "stats" },
        { label: "Social Links", href: "#/admin/social", iconName: "social" },
        { label: "Site & SEO", href: "#/admin/settings", iconName: "settings" }
      ]
    }
  ];

  const navSectionsHtml = navSections.map(section => `
    <div class="admin-nav-group">
      <div class="admin-nav-group-title">${section.group}</div>
      ${section.items.map(item => {
        const isActive = activeAdminRoute === item.href;
        return `
          <a href="${item.href}" class="admin-nav-link ${isActive ? 'active' : ''}">
            <div class="admin-nav-link-left">
              <span class="admin-nav-icon">${getIcon(item.iconName, 16)}</span>
              <span>${item.label}</span>
            </div>
            ${item.count !== undefined ? `<span class="admin-nav-count-badge">${item.count}</span>` : ''}
          </a>
        `;
      }).join("")}
    </div>
  `).join("");

  return `
    <div class="admin-shell" id="admin-shell">
      
      <!-- Admin Sidebar -->
      <aside class="admin-sidebar" id="admin-sidebar">
        <div class="admin-sidebar-header">
          <a href="#/admin" class="admin-sidebar-brand" style="text-decoration: none;">
            <span style="color: var(--accent-primary);">${getIcon("gamepad", 20)}</span>
            <span>${settings.siteName || 'Olflaz'} CMS</span>
          </a>
          <button class="modal-close-btn admin-mobile-close" id="admin-sidebar-close-btn" style="display: none;" aria-label="Close Sidebar">✕</button>
        </div>

        <nav class="admin-sidebar-nav-container" aria-label="Admin CMS Navigation">
          ${navSectionsHtml}
        </nav>

        <!-- Admin Profile & Quick Jump -->
        <div class="admin-sidebar-footer">
          <div class="admin-profile-box">
            <div class="admin-profile-avatar">
              ${user && user.username ? user.username.charAt(0).toUpperCase() : (about.name ? about.name.charAt(0).toUpperCase() : 'O')}
            </div>
            <div class="admin-profile-info">
              <div class="flex items-center gap-xs">
                <span class="admin-profile-name">${user ? user.username : (about.name || 'Olflaz')}</span>
                <span style="width: 7px; height: 7px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 6px #22c55e;" title="Active authenticated session"></span>
              </div>
              <span class="admin-profile-role">Administrator</span>
            </div>
          </div>

          <a href="#/" target="_blank" class="btn btn-outline btn-sm btn-block" title="Open live public website in new tab">
            ${getIcon("external", 14)}
            <span>Preview Site ↗</span>
          </a>
          <button id="admin-logout-btn" class="btn btn-outline btn-sm btn-block admin-logout-btn" title="Sign out of Admin CMS">
            ${getIcon("logOut", 14)}
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <!-- Main Workspace -->
      <div class="admin-main">
        <!-- Admin Topbar -->
        <header class="admin-topbar">
          <div class="flex items-center gap-sm">
            <button class="admin-mobile-toggle" id="admin-mobile-toggle-btn" aria-label="Open CMS Menu">
              <span style="font-size: 18px; line-height: 1;">☰</span>
            </button>
            <div class="admin-breadcrumb">
              <span>Olflaz CMS</span>
              <span>/</span>
              <span class="admin-breadcrumb-current">${breadcrumbTitle}</span>
            </div>
          </div>

          <div class="admin-topbar-actions">
            <a href="#/admin/appearance" class="btn btn-outline btn-sm" title="Customize Theme & Visual Appearance">
              ${getIcon("palette", 14)}
              <span>Theme</span>
            </a>
            <a href="#/" target="_blank" class="btn btn-secondary btn-sm" title="Open live public site in new tab">
              <span>Preview Site ↗</span>
            </a>
            <button id="admin-topbar-logout-btn" class="btn btn-outline btn-sm admin-logout-btn" title="Sign Out of CMS">
              ${getIcon("logOut", 14)}
              <span>Logout</span>
            </button>
          </div>
        </header>

        <!-- Admin Content Area -->
        <main class="admin-content">
          ${contentHtml}
        </main>
      </div>

    </div>
  `;
}

export function initAdminLayoutEvents() {
  const toggleBtn = document.getElementById("admin-mobile-toggle-btn");
  const closeBtn = document.getElementById("admin-sidebar-close-btn");
  const sidebar = document.getElementById("admin-sidebar");
  const logoutBtn = document.getElementById("admin-logout-btn");
  const topbarLogoutBtn = document.getElementById("admin-topbar-logout-btn");

  const performLogout = () => {
    authStore.logout();
    toast.info("Session terminated securely.");
    router.navigate("#/admin/login");
  };

  if (logoutBtn) {
    logoutBtn.addEventListener("click", performLogout);
  }

  if (topbarLogoutBtn) {
    topbarLogoutBtn.addEventListener("click", performLogout);
  }

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.add("open");
      if (closeBtn) closeBtn.style.display = "block";
    });
  }

  if (closeBtn && sidebar) {
    closeBtn.addEventListener("click", () => {
      sidebar.classList.remove("open");
    });
  }

  // Close sidebar on mobile when navigating
  const links = sidebar ? sidebar.querySelectorAll(".admin-nav-link") : [];
  links.forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 900 && sidebar) {
        sidebar.classList.remove("open");
      }
    });
  });
}
