/**
 * Main Application Bootstrap & Router Dispatcher
 * Connects Public Views, Admin CMS Dashboard, Reactive Store, and Client Router.
 */

import { router } from "./router/router.js";
import { store } from "./store/state.js";
import { authStore } from "./store/auth.js";

// Components
import { renderNavbar, initNavbarEvents } from "./components/Navbar.js";
import { renderFooter } from "./components/Footer.js";

// Public Views
import { renderHomeView } from "./views/public/HomeView.js";
import { renderProjectsView, initProjectsViewEvents } from "./views/public/ProjectsView.js";
import { renderProjectDetailView } from "./views/public/ProjectDetailView.js";
import { renderVideosView, initVideosViewEvents } from "./views/public/VideosView.js";
import { renderAboutView } from "./views/public/AboutView.js";
import { renderPortfolioView, initPortfolioViewEvents } from "./views/public/PortfolioView.js";

// Admin Views
import { renderAdminLoginView, initAdminLoginEvents } from "./views/admin/AdminLoginView.js";
import { renderAdminLayout, initAdminLayoutEvents } from "./views/admin/AdminLayout.js";
import { renderAdminDashboardView } from "./views/admin/AdminDashboardView.js";
import { renderAdminVideosView, initAdminVideosEvents } from "./views/admin/AdminVideosView.js";
import { renderAdminProjectsView, initAdminProjectsEvents } from "./views/admin/AdminProjectsView.js";
import { renderAdminPortfolioView, initAdminPortfolioEvents } from "./views/admin/AdminPortfolioView.js";
import { renderAdminHomeView, initAdminHomeEvents } from "./views/admin/AdminHomeView.js";
import { renderAdminAboutView, initAdminAboutEvents } from "./views/admin/AdminAboutView.js";
import { renderAdminFeaturedView, initAdminFeaturedEvents } from "./views/admin/AdminFeaturedView.js";
import { renderAdminChannelView, initAdminChannelEvents } from "./views/admin/AdminChannelView.js";
import { renderAdminMediaView, initAdminMediaEvents } from "./views/admin/AdminMediaView.js";
import { renderAdminSocialView, initAdminSocialEvents } from "./views/admin/AdminSocialView.js";
import { renderAdminSettingsView, initAdminSettingsEvents } from "./views/admin/AdminSettingsView.js";
import { renderAdminAppearanceView, initAdminAppearanceEvents } from "./views/admin/AdminAppearanceView.js";

// Scroll Engine
import { initScrollEngine, setupGlobalScrollListeners } from "./utils/scroll-engine.js";

const appRoot = document.getElementById("app");

/* ==========================================================================
   NAVIGATION GUARDS (ADMIN AUTHENTICATION)
   ========================================================================== */

router.beforeEach((toHash) => {
  const isAdminRoute = toHash.startsWith("#/admin") || toHash.startsWith("/admin");
  const isLoginPage = toHash === "#/admin/login" || toHash === "/admin/login";

  if (isAdminRoute && !isLoginPage) {
    if (!authStore.isAuthenticated()) {
      authStore.setRedirectTarget(toHash);
      return "#/admin/login";
    }
  }

  if (isLoginPage && authStore.isAuthenticated()) {
    return "#/admin";
  }

  return true;
});

/**
 * Render Public Website Wrapper
 */
function renderPublicPage(activeRoute, viewHtml, initEventsCallback = null) {
  const settings = store.getSiteSettings();
  document.title = settings.seoTitle || `${settings.siteName} | Minecraft Creator & Godot Game Dev`;

  appRoot.innerHTML = `
    ${renderNavbar(activeRoute)}
    <main id="main-content" class="page-enter" role="main" style="position: relative; z-index: 1;">
      ${viewHtml}
    </main>
    ${renderFooter()}
  `;

  initNavbarEvents();
  initScrollEngine();
  if (typeof initEventsCallback === "function") {
    initEventsCallback();
  }
}

/**
 * Render Admin Login Gate View
 */
function renderAdminLoginPage(viewHtml, initEventsCallback = null) {
  const settings = store.getSiteSettings();
  document.title = `Admin Authentication | ${settings.siteName || 'Olflaz'}`;

  appRoot.innerHTML = `
    <main id="main-content" class="page-enter" role="main">
      ${viewHtml}
    </main>
  `;

  if (typeof initEventsCallback === "function") {
    initEventsCallback();
  }
}

/**
 * Render Admin CMS Dashboard Wrapper
 */
function renderAdminPage(activeAdminRoute, breadcrumbTitle, viewHtml, initEventsCallback = null) {
  const settings = store.getSiteSettings();
  document.title = `Admin CMS - ${breadcrumbTitle} | ${settings.siteName}`;

  const adminHtml = renderAdminLayout(viewHtml, activeAdminRoute, breadcrumbTitle);
  appRoot.innerHTML = adminHtml;

  const adminContent = document.querySelector(".admin-content");
  if (adminContent) {
    adminContent.classList.add("page-enter");
  }

  initAdminLayoutEvents();
  if (typeof initEventsCallback === "function") {
    initEventsCallback();
  }
}

/* ==========================================================================
   PUBLIC ROUTES REGISTRATION
   ========================================================================== */

// Home Page
router.addRoute("/", () => {
  renderPublicPage("#/", renderHomeView());
});

// Projects Catalog
router.addRoute("/projects", () => {
  const render = () => {
    renderPublicPage("#/projects", renderProjectsView(), () => {
      initProjectsViewEvents(render);
    });
  };
  render();
});

// Project Detail Page
router.addRoute("/project/:id", (params) => {
  renderPublicPage("#/projects", renderProjectDetailView(params));
});

// Videos Page
router.addRoute("/videos", () => {
  const render = () => {
    renderPublicPage("#/videos", renderVideosView(), () => {
      initVideosViewEvents(render);
    });
  };
  render();
});

// About Page
router.addRoute("/about", () => {
  renderPublicPage("#/about", renderAboutView());
});

// Portfolio Page
router.addRoute("/portfolio", () => {
  const render = () => {
    renderPublicPage("#/portfolio", renderPortfolioView(), () => {
      initPortfolioViewEvents(render);
    });
  };
  render();
});

/* ==========================================================================
   ADMIN CMS ROUTES REGISTRATION (Grouped Structure)
   ========================================================================== */

// ADMIN AUTH: Login Gate
router.addRoute("/admin/login", () => {
  renderAdminLoginPage(renderAdminLoginView(), () => {
    initAdminLoginEvents();
  });
});

// ADMIN: Overview
router.addRoute("/admin", () => {
  renderAdminPage("#/admin", "Overview", renderAdminDashboardView());
});

// CONTENT: Videos Management
router.addRoute("/admin/videos", () => {
  const render = () => {
    renderAdminPage("#/admin/videos", "Videos", renderAdminVideosView(), () => {
      initAdminVideosEvents(render);
    });
  };
  render();
});

// CONTENT: Projects Management
router.addRoute("/admin/projects", () => {
  const render = () => {
    renderAdminPage("#/admin/projects", "Projects", renderAdminProjectsView(), () => {
      initAdminProjectsEvents(render);
    });
  };
  render();
});

// CONTENT: Portfolio Management
router.addRoute("/admin/portfolio", () => {
  const render = () => {
    renderAdminPage("#/admin/portfolio", "Portfolio", renderAdminPortfolioView(), () => {
      initAdminPortfolioEvents(render);
    });
  };
  render();
});

// WEBSITE: Home Page Editor
router.addRoute("/admin/home", () => {
  const render = () => {
    renderAdminPage("#/admin/home", "Home Page", renderAdminHomeView(), () => {
      initAdminHomeEvents(render);
    });
  };
  render();
});

// WEBSITE: About Page Editor
router.addRoute("/admin/about", () => {
  const render = () => {
    renderAdminPage("#/admin/about", "About Page", renderAdminAboutView(), () => {
      initAdminAboutEvents(render);
    });
  };
  render();
});

// WEBSITE: Featured Content Curation
router.addRoute("/admin/featured", () => {
  const render = () => {
    renderAdminPage("#/admin/featured", "Featured Content", renderAdminFeaturedView(), () => {
      initAdminFeaturedEvents(render);
    });
  };
  render();
});

// MEDIA: Media Library
router.addRoute("/admin/media", () => {
  const render = () => {
    renderAdminPage("#/admin/media", "Media Library", renderAdminMediaView(), () => {
      initAdminMediaEvents(render);
    });
  };
  render();
});

// SETTINGS: Appearance Theme Controller
router.addRoute("/admin/appearance", () => {
  const render = () => {
    renderAdminPage("#/admin/appearance", "Appearance & Theme", renderAdminAppearanceView(), () => {
      initAdminAppearanceEvents(render);
    });
  };
  render();
});

// SETTINGS: Channel Statistics
router.addRoute("/admin/channel", () => {
  const render = () => {
    renderAdminPage("#/admin/channel", "Channel Stats", renderAdminChannelView(), () => {
      initAdminChannelEvents(render);
    });
  };
  render();
});

// SETTINGS: Social Links
router.addRoute("/admin/social", () => {
  const render = () => {
    renderAdminPage("#/admin/social", "Social Links", renderAdminSocialView(), () => {
      initAdminSocialEvents(render);
    });
  };
  render();
});

// SETTINGS: Site Settings & SEO
router.addRoute("/admin/settings", () => {
  const render = () => {
    renderAdminPage("#/admin/settings", "Site & SEO", renderAdminSettingsView(), () => {
      initAdminSettingsEvents(render);
    });
  };
  render();
});

// 404 Fallback
router.setNotFound((requestedHash) => {
  renderPublicPage("404", `
    <div class="container section text-center" style="padding-top: var(--space-3xl);">
      <div class="card" style="max-width: 500px; margin: 0 auto; padding: var(--space-2xl);">
        <h1 style="font-size: 3rem; margin-bottom: 8px;">404</h1>
        <h2>Page Not Found</h2>
        <p style="margin-top: 8px; margin-bottom: 24px;">The route <code>${requestedHash}</code> does not exist.</p>
        <a href="#/" class="btn btn-primary">Return to Home</a>
      </div>
    </div>
  `);
});

// Bootstrap application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  store.applyAppearanceTokens();
  setupGlobalScrollListeners();
  router.handleRouteChange();
});
