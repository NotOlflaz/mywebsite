/**
 * Centralized Reactive State Store with LocalStorage Persistence & Theme Engine
 * Handles public data, CMS state, and real-time visual appearance tokens.
 */

import { initialData } from "../data/initial-data.js";

const STORAGE_KEY = "olflaz_website_cms_data_v1";

class StateStore {
  constructor() {
    this.listeners = new Set();
    this.state = this.loadState();
    this.applyAppearanceTokens();
  }

  /**
   * Load state from localStorage or seed initialData
   */
  loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Migrate projects with publishStatus & actionButtons
        const rawProjects = Array.isArray(parsed.projects) ? parsed.projects : initialData.projects;
        const migratedProjects = rawProjects.map(p => ({
          ...p,
          publishStatus: p.publishStatus || "published",
          actionButtons: Array.isArray(p.actionButtons) && p.actionButtons.length > 0 ? p.actionButtons : [
            ...(p.demoUrl ? [{ id: "btn-demo", label: "Play Demo", url: p.demoUrl, style: "primary", enabled: true }] : []),
            ...(p.githubUrl ? [{ id: "btn-github", label: "GitHub", url: p.githubUrl, style: "secondary", enabled: true }] : []),
            ...(p.youtubeUrl ? [{ id: "btn-youtube", label: "Watch Video", url: p.youtubeUrl, style: "outline", enabled: true }] : [])
          ]
        }));

        // Migrate videos with publishStatus
        const rawVideos = Array.isArray(parsed.videos) ? parsed.videos : initialData.videos;
        const migratedVideos = rawVideos.map(v => ({
          ...v,
          publishStatus: v.publishStatus || "published"
        }));

        // Migrate portfolio with publishStatus & actionButtons
        const rawPortfolio = Array.isArray(parsed.portfolio) ? parsed.portfolio : initialData.portfolio;
        const migratedPortfolio = rawPortfolio.map(item => ({
          ...item,
          publishStatus: item.publishStatus || "published",
          actionButtons: Array.isArray(item.actionButtons) ? item.actionButtons : []
        }));

        // Migrate home sections
        const homeObj = { ...initialData.home, ...(parsed.home || {}) };
        if (!Array.isArray(homeObj.sections) || homeObj.sections.length === 0) {
          homeObj.sections = initialData.home.sections;
        }

        // Migrate appearance with deep merge for new comprehensive design tokens
        const mergedAppearance = {
          ...initialData.appearance,
          ...(parsed.appearance || {})
        };
        if (!Array.isArray(mergedAppearance.shapes) || mergedAppearance.shapes.length === 0) {
          mergedAppearance.shapes = initialData.appearance.shapes;
        }
        if (!Array.isArray(mergedAppearance.bgLightPoints) || mergedAppearance.bgLightPoints.length === 0) {
          mergedAppearance.bgLightPoints = initialData.appearance.bgLightPoints;
        }

        return {
          ...initialData,
          ...parsed,
          appearance: mergedAppearance,
          siteSettings: { ...initialData.siteSettings, ...(parsed.siteSettings || {}) },
          home: homeObj,
          channelStats: { ...initialData.channelStats, ...(parsed.channelStats || {}) },
          about: { ...initialData.about, ...(parsed.about || {}) },
          socialLinks: { ...initialData.socialLinks, ...(parsed.socialLinks || {}) },
          projects: migratedProjects,
          videos: migratedVideos,
          portfolio: migratedPortfolio,
          media: Array.isArray(parsed.media) ? parsed.media : initialData.media
        };
      }
    } catch (e) {
      console.warn("Could not load from localStorage, falling back to initial seed data:", e);
    }
    return JSON.parse(JSON.stringify(initialData));
  }

  /**
   * Persist state to localStorage and notify all subscribers
   */
  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error("Failed to save state to localStorage:", e);
    }
    this.applyAppearanceTokens();
    this.notify();
  }

  /**
   * Apply comprehensive design system tokens directly to DOM root & CSS variables
   */
  applyAppearanceTokens() {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const app = this.getAppearance();

    // 1. DATA ATTRIBUTES FOR PRESETS & MODES
    root.setAttribute("data-theme", app.themePreset || "default");
    root.setAttribute("data-glow", app.glowGlobalPreset || "subtle");

    // 2. CORE & ACCENT COLORS
    if (app.accentPrimaryHex) {
      root.style.setProperty("--accent-primary", app.accentPrimaryHex);
      root.style.setProperty("--accent-text", app.accentPrimaryHex);
      root.style.setProperty("--border-focus", app.accentPrimaryHex);
      root.style.setProperty("--accent-surface", `${app.accentPrimaryHex}${Math.round(parseFloat(app.accentSurfaceOpacity || 0.06) * 255).toString(16).padStart(2, '0')}`);
      root.style.setProperty("--accent-border", `${app.accentPrimaryHex}${Math.round(parseFloat(app.accentBorderOpacity || 0.22) * 255).toString(16).padStart(2, '0')}`);
    }
    if (app.accentSecondaryHex) root.style.setProperty("--accent-secondary", app.accentSecondaryHex);
    if (app.accentHoverHex) root.style.setProperty("--accent-hover", app.accentHoverHex);
    if (app.accentActiveHex) root.style.setProperty("--accent-active", app.accentActiveHex);

    if (app.bgPage) root.style.setProperty("--bg-page", app.bgPage);
    if (app.bgPageAlt) root.style.setProperty("--bg-page-alt", app.bgPageAlt);
    if (app.bgSurface) root.style.setProperty("--bg-surface", app.bgSurface);
    if (app.bgCard) root.style.setProperty("--bg-card", app.bgCard);
    if (app.bgSurfaceAlt) root.style.setProperty("--bg-surface-alt", app.bgSurfaceAlt);
    if (app.bgSurfaceElevated) root.style.setProperty("--bg-surface-elevated", app.bgSurfaceElevated);

    if (app.borderColor) root.style.setProperty("--border-color", app.borderColor);
    if (app.borderSubtle) root.style.setProperty("--border-subtle", app.borderSubtle);
    if (app.borderHover) root.style.setProperty("--border-hover", app.borderHover);
    if (app.borderDivider) root.style.setProperty("--border-divider", app.borderDivider);

    // 3. TEXT HIERARCHY
    if (app.textHeading) root.style.setProperty("--text-heading", app.textHeading);
    if (app.textHeadingSecondary) root.style.setProperty("--text-heading-secondary", app.textHeadingSecondary);
    if (app.textMain) root.style.setProperty("--text-main", app.textMain);
    if (app.textMuted) root.style.setProperty("--text-muted", app.textMuted);
    if (app.textLight) root.style.setProperty("--text-light", app.textLight);
    if (app.textLink) root.style.setProperty("--text-link", app.textLink);
    if (app.textInverse) root.style.setProperty("--text-inverse", app.textInverse);

    // 4. BUTTONS & INPUTS
    if (app.btnPrimaryBg) root.style.setProperty("--btn-primary-bg", app.btnPrimaryBg);
    if (app.btnPrimaryText) root.style.setProperty("--btn-primary-text", app.btnPrimaryText);
    if (app.btnPrimaryHoverBg) root.style.setProperty("--btn-primary-hover-bg", app.btnPrimaryHoverBg);
    if (app.btnSecondaryBg) root.style.setProperty("--btn-secondary-bg", app.btnSecondaryBg);
    if (app.btnSecondaryText) root.style.setProperty("--btn-secondary-text", app.btnSecondaryText);
    if (app.btnSecondaryBorder) root.style.setProperty("--btn-secondary-border", app.btnSecondaryBorder);
    if (app.btnBorderRadius) root.style.setProperty("--btn-radius", app.btnBorderRadius);
    if (app.btnPaddingY) root.style.setProperty("--btn-padding-y", app.btnPaddingY);
    if (app.btnPaddingX) root.style.setProperty("--btn-padding-x", app.btnPaddingX);
    if (app.btnHoverLift) root.style.setProperty("--btn-hover-lift", `-${app.btnHoverLift}`);
    if (app.btnHoverScale) root.style.setProperty("--btn-hover-scale", app.btnHoverScale);
    if (app.btnActiveScale) root.style.setProperty("--btn-active-scale", app.btnActiveScale);
    if (app.btnTransitionSpeed) root.style.setProperty("--btn-transition-speed", app.btnTransitionSpeed);

    if (app.inputBg) root.style.setProperty("--input-bg", app.inputBg);
    if (app.inputBorder) root.style.setProperty("--input-border", app.inputBorder);
    if (app.inputFocus) root.style.setProperty("--input-focus", app.inputFocus);
    if (app.badgeBg) root.style.setProperty("--badge-bg", app.badgeBg);
    if (app.badgeText) root.style.setProperty("--badge-text", app.badgeText);

    // 5. CARDS & ELEVATIONS
    if (app.cardBg) root.style.setProperty("--card-bg", app.cardBg);
    if (app.cardBorderRadius) root.style.setProperty("--card-radius", app.cardBorderRadius);
    if (app.cardBorderColor) root.style.setProperty("--card-border-color", app.cardBorderColor);
    if (app.cardBorderWidth) root.style.setProperty("--card-border-width", app.cardBorderWidth);
    if (app.cardHoverLift) root.style.setProperty("--card-hover-lift", `-${app.cardHoverLift}`);
    if (app.cardHoverScale) root.style.setProperty("--card-hover-scale", app.cardHoverScale);
    if (app.cardImageZoom) root.style.setProperty("--card-image-zoom", app.cardImageZoom);

    // 6. TYPOGRAPHY
    if (app.fontHeadingWeight) root.style.setProperty("--font-weight-heading", app.fontHeadingWeight);
    if (app.heroHeadingSize) root.style.setProperty("--hero-heading-size", app.heroHeadingSize);
    if (app.heroHeadingWeight) root.style.setProperty("--hero-heading-weight", app.heroHeadingWeight);
    if (app.heroHeadingColor) root.style.setProperty("--hero-heading-color", app.heroHeadingColor);
    if (app.heroHeadingLetterSpacing) root.style.setProperty("--hero-heading-spacing", app.heroHeadingLetterSpacing);
    if (app.heroHeadingLineHeight) root.style.setProperty("--hero-heading-line-height", app.heroHeadingLineHeight);

    if (app.sectionHeadingSize) root.style.setProperty("--section-heading-size", app.sectionHeadingSize);
    if (app.sectionHeadingWeight) root.style.setProperty("--section-heading-weight", app.sectionHeadingWeight);
    if (app.sectionHeadingColor) root.style.setProperty("--section-heading-color", app.sectionHeadingColor);
    if (app.sectionHeadingLetterSpacing) root.style.setProperty("--section-heading-spacing", app.sectionHeadingLetterSpacing);

    if (app.cardHeadingSize) root.style.setProperty("--card-heading-size", app.cardHeadingSize);
    if (app.cardHeadingWeight) root.style.setProperty("--card-heading-weight", app.cardHeadingWeight);
    if (app.cardHeadingColor) root.style.setProperty("--card-heading-color", app.cardHeadingColor);

    if (app.bodyTextSize) root.style.setProperty("--body-text-size", app.bodyTextSize);
    if (app.bodyTextWeight) root.style.setProperty("--body-text-weight", app.bodyTextWeight);
    if (app.bodyTextColor) root.style.setProperty("--body-text-color", app.bodyTextColor);
    if (app.bodyLineHeight) root.style.setProperty("--body-line-height", app.bodyLineHeight);
    if (app.bodyLetterSpacing) root.style.setProperty("--body-letter-spacing", app.bodyLetterSpacing);

    if (app.mutedTextColor) root.style.setProperty("--muted-text-color", app.mutedTextColor);
    if (app.mutedTextOpacity) root.style.setProperty("--muted-text-opacity", app.mutedTextOpacity);

    // 7. LAYOUT & SPACING
    if (app.containerMaxWidth) root.style.setProperty("--container-max-width", app.containerMaxWidth);
    if (app.sectionSpacing) root.style.setProperty("--section-spacing", app.sectionSpacing);
    if (app.sectionPaddingY) root.style.setProperty("--section-padding-y", app.sectionPaddingY);
    if (app.gridGap) root.style.setProperty("--grid-gap", app.gridGap);
    if (app.cardGap) root.style.setProperty("--card-gap", app.cardGap);
    if (app.navbarHeight) root.style.setProperty("--navbar-height", app.navbarHeight);
    if (app.containerPaddingX) root.style.setProperty("--container-padding-x", app.containerPaddingX);

    // 8. NAVBAR & FOOTER
    if (app.navbarBg) root.style.setProperty("--navbar-bg", app.navbarBg);
    if (app.navbarBgOpacity) root.style.setProperty("--navbar-opacity", app.navbarBgOpacity);
    if (app.navbarBackdropBlur) root.style.setProperty("--navbar-blur", app.navbarBackdropBlur);
    if (app.navbarLogoSize) root.style.setProperty("--navbar-logo-size", app.navbarLogoSize);
    if (app.navbarTextColor) root.style.setProperty("--navbar-text-color", app.navbarTextColor);
    if (app.navbarActiveColor) root.style.setProperty("--navbar-active-color", app.navbarActiveColor);
    if (app.navbarHoverColor) root.style.setProperty("--navbar-hover-color", app.navbarHoverColor);

    if (app.footerBg) root.style.setProperty("--footer-bg", app.footerBg);
    if (app.footerBorderColor) root.style.setProperty("--footer-border-color", app.footerBorderColor);
    if (app.footerHeadingColor) root.style.setProperty("--footer-heading-color", app.footerHeadingColor);
    if (app.footerTextColor) root.style.setProperty("--footer-text-color", app.footerTextColor);
    if (app.footerMutedColor) root.style.setProperty("--footer-muted-color", app.footerMutedColor);
    if (app.footerLinkColor) root.style.setProperty("--footer-link-color", app.footerLinkColor);
    if (app.footerAccentColor) root.style.setProperty("--footer-accent-color", app.footerAccentColor);
    if (app.footerSpacing) root.style.setProperty("--footer-spacing", app.footerSpacing);

    // 9. ANIMATIONS & SCROLL ENGINE
    if (app.scrollSlideDistance) root.style.setProperty("--scroll-slide-distance", app.scrollSlideDistance);
    if (app.scrollDuration) root.style.setProperty("--scroll-duration", app.scrollDuration);
    if (app.scrollEasing) root.style.setProperty("--scroll-ease", app.scrollEasing);
    if (app.hoverLiftDistance) root.style.setProperty("--hover-lift", `-${app.hoverLiftDistance}`);
    if (app.hoverScaleAmount) root.style.setProperty("--hover-scale", app.hoverScaleAmount);
    if (app.hoverTransitionSpeed) root.style.setProperty("--hover-transition-speed", app.hoverTransitionSpeed);

    // 10. SCROLL PROGRESS INDICATOR
    if (app.scrollProgressColor) root.style.setProperty("--scroll-bar-color", app.scrollProgressColor);
    if (app.scrollProgressWidth) root.style.setProperty("--scroll-bar-width", app.scrollProgressWidth);
    if (app.scrollProgressOpacity) root.style.setProperty("--scroll-bar-opacity", app.scrollProgressOpacity);
    if (app.scrollProgressGlow) root.style.setProperty("--scroll-bar-glow", app.scrollProgressGlow);
    if (app.scrollProgressRight) root.style.setProperty("--scroll-bar-right", app.scrollProgressRight);
    if (app.scrollProgressBorderRadius) root.style.setProperty("--scroll-bar-radius", app.scrollProgressBorderRadius);
    if (app.scrollProgressTransitionSpeed) root.style.setProperty("--scroll-bar-transition-speed", app.scrollProgressTransitionSpeed);

    // 11. DYNAMIC DOM RENDER: AMBIENT BACKDROP & DECORATIVE SHAPES
    this.renderDynamicAtmosphere(app);
  }

  /**
   * Render dynamic background light points and geometric decorative shapes into the DOM
   */
  renderDynamicAtmosphere(app) {
    if (typeof document === "undefined") return;

    // Ambient Backdrop
    let backdropEl = document.getElementById("site-ambient-backdrop");
    if (!backdropEl) {
      backdropEl = document.createElement("div");
      backdropEl.id = "site-ambient-backdrop";
      backdropEl.setAttribute("aria-hidden", "true");
      document.body.prepend(backdropEl);
    }

    if (backdropEl) {
      let bgStyle = "";
      if (app.bgGradientEnabled) {
        bgStyle += `background: linear-gradient(${app.bgGradientAngle || '135deg'}, ${app.bgGradientStart || '#08090c'} 0%, ${app.bgGradientEnd || '#0c0e13'} 100%); opacity: ${app.bgGradientOpacity || '1'};`;
      } else {
        bgStyle += `background-color: ${app.bgPage || '#08090c'};`;
      }
      backdropEl.style.cssText = `position: fixed; inset: 0; pointer-events: none; z-index: -2; ${bgStyle}`;

      // Render Light Points inside Backdrop
      if (Array.isArray(app.bgLightPoints)) {
        const lightHtml = app.bgLightPoints
          .filter(lp => lp.enabled !== false)
          .map(lp => `
            <div style="position: absolute; left: ${lp.posX}; top: ${lp.posY}; width: ${lp.size}; height: ${lp.size}; border-radius: 50%; background: ${lp.color}; opacity: ${lp.opacity}; filter: blur(${lp.blur}); transform: translate(-50%, -50%); pointer-events: none;"></div>
          `).join("");

        // Add vignette layer if enabled
        const vignetteHtml = app.bgVignetteEnabled ? `
          <div style="position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${app.bgVignetteIntensity || '0.4'}) 100%); pointer-events: none;"></div>
        ` : "";

        backdropEl.innerHTML = lightHtml + vignetteHtml;
      }
    }

    // Decorative Shapes Container
    let shapesEl = document.getElementById("site-decorative-shapes");
    if (!shapesEl) {
      shapesEl = document.createElement("div");
      shapesEl.id = "site-decorative-shapes";
      shapesEl.setAttribute("aria-hidden", "true");
      document.body.prepend(shapesEl);
    }

    if (shapesEl) {
      shapesEl.style.cssText = "position: fixed; inset: 0; pointer-events: none; z-index: -1; overflow: hidden;";
      if (app.shapesEnabled && Array.isArray(app.shapes)) {
        shapesEl.innerHTML = app.shapes
          .filter(s => s.enabled !== false)
          .map(s => {
            let shapeGeometry = "";
            if (s.shapeType === "circle") {
              shapeGeometry = "border-radius: 50%;";
            } else if (s.shapeType === "rounded-rect") {
              shapeGeometry = "border-radius: 24px;";
            } else if (s.shapeType === "line") {
              shapeGeometry = `height: 2px; border-radius: 1px;`;
            } else if (s.shapeType === "ring") {
              shapeGeometry = `border-radius: 50%; background: transparent !important; border: ${s.border || '2px solid rgba(56, 189, 248, 0.2)'};`;
            } else if (s.shapeType === "subtle-geometric") {
              shapeGeometry = "clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);";
            } else {
              shapeGeometry = "border-radius: 6px;";
            }

            const animationStyle = s.animated ? `animation: shapeFloat ${s.animationSpeed || '20s'} infinite ease-in-out alternate;` : '';

            return `
              <div 
                id="dec-shape-${s.id}" 
                style="position: absolute; left: ${s.posX}; top: ${s.posY}; width: ${s.width}; height: ${s.height}; transform: translate(-50%, -50%) rotate(${s.rotation || '0deg'}); opacity: ${s.opacity || '0.1'}; filter: blur(${s.blur || '0px'}); background: ${s.color || 'var(--accent-primary)'}; ${s.border && s.shapeType !== 'ring' ? `border: ${s.border};` : ''} ${shapeGeometry} ${animationStyle} z-index: ${s.layer || '-1'};">
              </div>
            `;
          }).join("");
      } else {
        shapesEl.innerHTML = "";
      }
    }
  }

  /**
   * Subscribe to state updates
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all registered listeners
   */
  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (err) {
        console.error("Error in state subscriber:", err);
      }
    }
  }

  /* ==========================================================================
     GETTERS
     ========================================================================== */

  getState() {
    return this.state;
  }

  getAppearance() {
    return this.state.appearance || initialData.appearance;
  }

  getSiteSettings() {
    return this.state.siteSettings;
  }

  getHome() {
    return this.state.home || initialData.home;
  }

  getHomeSections() {
    return (this.state.home && Array.isArray(this.state.home.sections))
      ? this.state.home.sections
      : (initialData.home.sections || []);
  }

  getChannelStats() {
    return this.state.channelStats;
  }

  getAbout() {
    return this.state.about;
  }

  getSocialLinks() {
    return this.state.socialLinks;
  }

  getProjects() {
    return this.state.projects || [];
  }

  getPublishedProjects() {
    return (this.state.projects || []).filter(p => (p.publishStatus || "published") === "published");
  }

  getProjectById(id) {
    return (this.state.projects || []).find(p => p.id === id || p.slug === id);
  }

  getFeaturedProjects() {
    return (this.state.projects || []).filter(p => p.isFeatured);
  }

  getPublishedFeaturedProjects() {
    return this.getPublishedProjects().filter(p => p.isFeatured);
  }

  getVideos() {
    return this.state.videos || [];
  }

  getPublishedVideos() {
    return (this.state.videos || []).filter(v => (v.publishStatus || "published") === "published");
  }

  getVideoById(id) {
    return (this.state.videos || []).find(v => v.id === id);
  }

  getFeaturedVideos() {
    return (this.state.videos || []).filter(v => v.isFeatured);
  }

  getPublishedFeaturedVideos() {
    return this.getPublishedVideos().filter(v => v.isFeatured);
  }

  getPortfolio() {
    return this.state.portfolio || [];
  }

  getPublishedPortfolio() {
    return (this.state.portfolio || []).filter(item => (item.publishStatus || "published") === "published");
  }

  getFeaturedPortfolio() {
    return (this.state.portfolio || []).filter(item => item.isFeatured);
  }

  getPublishedFeaturedPortfolio() {
    return this.getPublishedPortfolio().filter(item => item.isFeatured);
  }

  getMedia() {
    return this.state.media || [];
  }

  getDashboardMetrics() {
    const projects = this.state.projects || [];
    const videos = this.state.videos || [];
    const portfolio = this.state.portfolio || [];
    const media = this.state.media || [];

    return {
      totalVideos: videos.length,
      featuredVideos: videos.filter(v => v.isFeatured).length,
      totalProjects: projects.length,
      featuredProjects: projects.filter(p => p.isFeatured).length,
      totalPortfolio: portfolio.length,
      featuredPortfolio: portfolio.filter(item => item.isFeatured).length,
      totalMedia: media.length,
      subscriberCount: this.state.channelStats.subscribers,
      totalViews: this.state.channelStats.totalViews
    };
  }

  /* ==========================================================================
     MUTATIONS: APPEARANCE
     ========================================================================== */

  updateAppearance(updates) {
    this.state.appearance = {
      ...this.state.appearance,
      ...updates
    };
    this.saveState();
    return this.state.appearance;
  }

  /* ==========================================================================
     MUTATIONS: HOME & SECTIONS
     ========================================================================== */

  updateHome(updates) {
    this.state.home = {
      ...this.state.home,
      ...updates
    };
    this.saveState();
    return this.state.home;
  }

  reorderHomeSections(fromIndex, toIndex) {
    const sections = [...this.getHomeSections()];
    if (fromIndex < 0 || fromIndex >= sections.length || toIndex < 0 || toIndex >= sections.length) return;
    const [moved] = sections.splice(fromIndex, 1);
    sections.splice(toIndex, 0, moved);
    if (!this.state.home) this.state.home = {};
    this.state.home.sections = sections;
    this.saveState();
    return this.state.home.sections;
  }

  updateHomeSections(sections) {
    if (!this.state.home) this.state.home = {};
    this.state.home.sections = sections;
    this.saveState();
    return this.state.home.sections;
  }

  /* ==========================================================================
     MUTATIONS: PROJECTS
     ========================================================================== */

  addProject(projectData) {
    const id = "proj-" + Date.now();
    const slug = (projectData.title || "project")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newProject = {
      id,
      slug: slug + "-" + Math.floor(Math.random() * 1000),
      title: "Untitled Project",
      category: "Godot Games",
      engine: "Godot 4",
      status: "In Development",
      publishStatus: "published",
      devDate: new Date().getFullYear().toString(),
      shortDesc: "",
      fullDesc: "",
      thumbnail: "",
      screenshots: [],
      technologies: [],
      features: [],
      actionButtons: [
        ...(projectData.demoUrl ? [{ id: "btn-demo", label: "Play Demo", url: projectData.demoUrl, style: "primary", enabled: true }] : []),
        ...(projectData.githubUrl ? [{ id: "btn-github", label: "GitHub", url: projectData.githubUrl, style: "secondary", enabled: true }] : [])
      ],
      githubUrl: "",
      demoUrl: "",
      youtubeUrl: "",
      tags: [],
      isFeatured: false,
      ...projectData
    };

    if (!Array.isArray(this.state.projects)) this.state.projects = [];
    this.state.projects.unshift(newProject);
    this.saveState();
    return newProject;
  }

  updateProject(id, updates) {
    const index = this.state.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.state.projects[index] = {
        ...this.state.projects[index],
        ...updates
      };
      this.saveState();
      return this.state.projects[index];
    }
    return null;
  }

  updateProjectPublishStatus(id, publishStatus) {
    return this.updateProject(id, { publishStatus });
  }

  reorderProjects(fromIndex, toIndex) {
    if (!Array.isArray(this.state.projects)) return;
    const items = [...this.state.projects];
    if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) return;
    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);
    this.state.projects = items;
    this.saveState();
    return this.state.projects;
  }

  deleteProject(id) {
    const initialLen = this.state.projects.length;
    this.state.projects = this.state.projects.filter(p => p.id !== id);
    if (this.state.projects.length !== initialLen) {
      this.saveState();
      return true;
    }
    return false;
  }

  toggleProjectFeatured(id) {
    const project = this.getProjectById(id);
    if (project) {
      project.isFeatured = !project.isFeatured;
      this.saveState();
      return project.isFeatured;
    }
    return false;
  }

  reorderFeaturedProjects(fromIndex, toIndex) {
    const featured = this.getFeaturedProjects();
    if (fromIndex < 0 || fromIndex >= featured.length || toIndex < 0 || toIndex >= featured.length) return;
    const [moved] = featured.splice(fromIndex, 1);
    featured.splice(toIndex, 0, moved);

    const nonFeatured = (this.state.projects || []).filter(p => !p.isFeatured);
    this.state.projects = [...featured, ...nonFeatured];
    this.saveState();
    return this.getFeaturedProjects();
  }

  /* ==========================================================================
     MUTATIONS: VIDEOS
     ========================================================================== */

  addVideo(videoData) {
    const id = "vid-" + Date.now();
    let youtubeId = "";
    if (videoData.youtubeUrl) {
      const match = videoData.youtubeUrl.match(/(?:v=|\/embed\/|youtu\.be\/|\/v\/|\/shorts\/)([^&#?]+)/);
      if (match && match[1]) {
        youtubeId = match[1];
      }
    }

    const newVideo = {
      id,
      title: "Untitled Video",
      youtubeUrl: "",
      youtubeId,
      thumbnail: "",
      description: "",
      views: "0 views",
      uploadDate: "Just now",
      category: "Godot Tutorials",
      publishStatus: "published",
      tags: [],
      isFeatured: false,
      ...videoData
    };

    if (!Array.isArray(this.state.videos)) this.state.videos = [];
    this.state.videos.unshift(newVideo);
    this.saveState();
    return newVideo;
  }

  updateVideo(id, updates) {
    const index = this.state.videos.findIndex(v => v.id === id);
    if (index !== -1) {
      if (updates.youtubeUrl && !updates.youtubeId) {
        const match = updates.youtubeUrl.match(/(?:v=|\/embed\/|youtu\.be\/|\/v\/|\/shorts\/)([^&#?]+)/);
        if (match && match[1]) {
          updates.youtubeId = match[1];
        }
      }
      this.state.videos[index] = {
        ...this.state.videos[index],
        ...updates
      };
      this.saveState();
      return this.state.videos[index];
    }
    return null;
  }

  updateVideoPublishStatus(id, publishStatus) {
    return this.updateVideo(id, { publishStatus });
  }

  reorderVideos(fromIndex, toIndex) {
    if (!Array.isArray(this.state.videos)) return;
    const items = [...this.state.videos];
    if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) return;
    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);
    this.state.videos = items;
    this.saveState();
    return this.state.videos;
  }

  deleteVideo(id) {
    const initialLen = this.state.videos.length;
    this.state.videos = this.state.videos.filter(v => v.id !== id);
    if (this.state.videos.length !== initialLen) {
      this.saveState();
      return true;
    }
    return false;
  }

  toggleVideoFeatured(id) {
    const video = this.getVideoById(id);
    if (video) {
      video.isFeatured = !video.isFeatured;
      this.saveState();
      return video.isFeatured;
    }
    return false;
  }

  reorderFeaturedVideos(fromIndex, toIndex) {
    const featured = this.getFeaturedVideos();
    if (fromIndex < 0 || fromIndex >= featured.length || toIndex < 0 || toIndex >= featured.length) return;
    const [moved] = featured.splice(fromIndex, 1);
    featured.splice(toIndex, 0, moved);

    const nonFeatured = (this.state.videos || []).filter(v => !v.isFeatured);
    this.state.videos = [...featured, ...nonFeatured];
    this.saveState();
    return this.getFeaturedVideos();
  }

  /* ==========================================================================
     MUTATIONS: PORTFOLIO
     ========================================================================== */

  addPortfolioItem(itemData) {
    const id = "port-" + Date.now();
    const newItem = {
      id,
      title: "New Portfolio Item",
      category: "Game Development",
      technologies: "",
      role: "",
      result: "",
      description: "",
      image: "",
      links: "",
      publishStatus: "published",
      actionButtons: [],
      isFeatured: false,
      ...itemData
    };

    if (!Array.isArray(this.state.portfolio)) this.state.portfolio = [];
    this.state.portfolio.unshift(newItem);
    this.saveState();
    return newItem;
  }

  updatePortfolioItem(id, updates) {
    const index = this.state.portfolio.findIndex(item => item.id === id);
    if (index !== -1) {
      this.state.portfolio[index] = {
        ...this.state.portfolio[index],
        ...updates
      };
      this.saveState();
      return this.state.portfolio[index];
    }
    return null;
  }

  updatePortfolioPublishStatus(id, publishStatus) {
    return this.updatePortfolioItem(id, { publishStatus });
  }

  reorderPortfolio(fromIndex, toIndex) {
    if (!Array.isArray(this.state.portfolio)) return;
    const items = [...this.state.portfolio];
    if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) return;
    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);
    this.state.portfolio = items;
    this.saveState();
    return this.state.portfolio;
  }

  deletePortfolioItem(id) {
    const initialLen = this.state.portfolio.length;
    this.state.portfolio = this.state.portfolio.filter(item => item.id !== id);
    if (this.state.portfolio.length !== initialLen) {
      this.saveState();
      return true;
    }
    return false;
  }

  togglePortfolioFeatured(id) {
    const item = (this.state.portfolio || []).find(p => p.id === id);
    if (item) {
      item.isFeatured = !item.isFeatured;
      this.saveState();
      return item.isFeatured;
    }
    return false;
  }

  /* ==========================================================================
     MUTATIONS: APPEARANCE & THEME CONTROL SYSTEM
     ========================================================================== */

  updateAppearance(updates) {
    this.state.appearance = {
      ...this.state.appearance,
      ...updates
    };
    this.saveState();
    return this.state.appearance;
  }

  getDecorativeShapes() {
    return Array.isArray(this.state.appearance?.shapes) ? this.state.appearance.shapes : [];
  }

  addDecorativeShape(shapeData) {
    const id = "shape-" + Date.now();
    const newShape = {
      id,
      shapeType: "circle",
      posX: "50%",
      posY: "50%",
      width: "300px",
      height: "300px",
      rotation: "0deg",
      opacity: "0.1",
      blur: "60px",
      color: this.state.appearance?.accentPrimaryHex || "#38bdf8",
      border: "none",
      borderOpacity: "0",
      layer: "-1",
      animated: true,
      animationSpeed: "20s",
      enabled: true,
      ...shapeData
    };

    if (!Array.isArray(this.state.appearance.shapes)) {
      this.state.appearance.shapes = [];
    }
    this.state.appearance.shapes.push(newShape);
    this.saveState();
    return newShape;
  }

  updateDecorativeShape(id, updates) {
    if (!Array.isArray(this.state.appearance?.shapes)) return null;
    const idx = this.state.appearance.shapes.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.state.appearance.shapes[idx] = {
        ...this.state.appearance.shapes[idx],
        ...updates
      };
      this.saveState();
      return this.state.appearance.shapes[idx];
    }
    return null;
  }

  deleteDecorativeShape(id) {
    if (!Array.isArray(this.state.appearance?.shapes)) return false;
    const initialLen = this.state.appearance.shapes.length;
    this.state.appearance.shapes = this.state.appearance.shapes.filter(s => s.id !== id);
    if (this.state.appearance.shapes.length !== initialLen) {
      this.saveState();
      return true;
    }
    return false;
  }

  toggleDecorativeShape(id) {
    const shape = (this.state.appearance?.shapes || []).find(s => s.id === id);
    if (shape) {
      shape.enabled = !shape.enabled;
      this.saveState();
      return shape.enabled;
    }
    return false;
  }

  getBackgroundLightPoints() {
    return Array.isArray(this.state.appearance?.bgLightPoints) ? this.state.appearance.bgLightPoints : [];
  }

  addBackgroundLightPoint(data) {
    const id = "light-" + Date.now();
    const newPoint = {
      id,
      color: this.state.appearance?.accentPrimaryHex || "#38bdf8",
      opacity: "0.08",
      blur: "120px",
      size: "600px",
      posX: "50%",
      posY: "50%",
      enabled: true,
      ...data
    };
    if (!Array.isArray(this.state.appearance.bgLightPoints)) {
      this.state.appearance.bgLightPoints = [];
    }
    this.state.appearance.bgLightPoints.push(newPoint);
    this.saveState();
    return newPoint;
  }

  updateBackgroundLightPoint(id, updates) {
    if (!Array.isArray(this.state.appearance?.bgLightPoints)) return null;
    const idx = this.state.appearance.bgLightPoints.findIndex(lp => lp.id === id);
    if (idx !== -1) {
      this.state.appearance.bgLightPoints[idx] = {
        ...this.state.appearance.bgLightPoints[idx],
        ...updates
      };
      this.saveState();
      return this.state.appearance.bgLightPoints[idx];
    }
    return null;
  }

  deleteBackgroundLightPoint(id) {
    if (!Array.isArray(this.state.appearance?.bgLightPoints)) return false;
    const initLen = this.state.appearance.bgLightPoints.length;
    this.state.appearance.bgLightPoints = this.state.appearance.bgLightPoints.filter(lp => lp.id !== id);
    if (this.state.appearance.bgLightPoints.length !== initLen) {
      this.saveState();
      return true;
    }
    return false;
  }

  applyThemePreset(presetKey) {
    const preset = THEME_PRESETS[presetKey];
    if (!preset) return false;

    if (presetKey === "custom") {
      this.state.appearance.themePreset = "custom";
      this.saveState();
      return true;
    }

    this.state.appearance = {
      ...this.state.appearance,
      ...preset.tokens,
      themePreset: presetKey
    };
    this.saveState();
    return true;
  }

  resetThemeSection(sectionKey) {
    const defaultApp = initialData.appearance;
    const sectionMap = {
      colors: {
        bgPage: defaultApp.bgPage,
        bgPageAlt: defaultApp.bgPageAlt,
        bgSurface: defaultApp.bgSurface,
        bgCard: defaultApp.bgCard,
        bgSurfaceAlt: defaultApp.bgSurfaceAlt,
        bgSurfaceElevated: defaultApp.bgSurfaceElevated,
        borderColor: defaultApp.borderColor,
        borderSubtle: defaultApp.borderSubtle,
        borderHover: defaultApp.borderHover,
        borderDivider: defaultApp.borderDivider,
        textHeading: defaultApp.textHeading,
        textHeadingSecondary: defaultApp.textHeadingSecondary,
        textMain: defaultApp.textMain,
        textMuted: defaultApp.textMuted,
        textLight: defaultApp.textLight,
        textLink: defaultApp.textLink,
        textInverse: defaultApp.textInverse,
        accentPrimaryHex: defaultApp.accentPrimaryHex,
        accentSecondaryHex: defaultApp.accentSecondaryHex,
        accentHoverHex: defaultApp.accentHoverHex,
        accentActiveHex: defaultApp.accentActiveHex,
        accentSurfaceOpacity: defaultApp.accentSurfaceOpacity,
        accentBorderOpacity: defaultApp.accentBorderOpacity,
        btnPrimaryBg: defaultApp.btnPrimaryBg,
        btnPrimaryText: defaultApp.btnPrimaryText,
        btnPrimaryHoverBg: defaultApp.btnPrimaryHoverBg,
        btnSecondaryBg: defaultApp.btnSecondaryBg,
        btnSecondaryText: defaultApp.btnSecondaryText,
        btnSecondaryBorder: defaultApp.btnSecondaryBorder,
        inputBg: defaultApp.inputBg,
        inputBorder: defaultApp.inputBorder,
        inputFocus: defaultApp.inputFocus,
        badgeBg: defaultApp.badgeBg,
        badgeText: defaultApp.badgeText
      },
      background: {
        bgPage: defaultApp.bgPage,
        bgPageAlt: defaultApp.bgPageAlt,
        bgGradientEnabled: defaultApp.bgGradientEnabled,
        bgGradientStart: defaultApp.bgGradientStart,
        bgGradientEnd: defaultApp.bgGradientEnd,
        bgGradientAngle: defaultApp.bgGradientAngle,
        bgGradientOpacity: defaultApp.bgGradientOpacity,
        bgVignetteEnabled: defaultApp.bgVignetteEnabled,
        bgVignetteIntensity: defaultApp.bgVignetteIntensity,
        bgAmbientIntensity: defaultApp.bgAmbientIntensity,
        bgLightPoints: JSON.parse(JSON.stringify(defaultApp.bgLightPoints))
      },
      glows: {
        glowGlobalPreset: defaultApp.glowGlobalPreset,
        glowGlobalIntensity: defaultApp.glowGlobalIntensity,
        glowGlobalOpacity: defaultApp.glowGlobalOpacity,
        glowGlobalBlur: defaultApp.glowGlobalBlur,
        glowGlobalSpread: defaultApp.glowGlobalSpread,
        glowButtonIntensity: defaultApp.glowButtonIntensity,
        glowButtonBlur: defaultApp.glowButtonBlur,
        glowButtonOpacity: defaultApp.glowButtonOpacity,
        glowCardHover: defaultApp.glowCardHover,
        glowCardFeatured: defaultApp.glowCardFeatured,
        glowNavActive: defaultApp.glowNavActive,
        glowAmbientBlur: defaultApp.glowAmbientBlur,
        glowAmbientOpacity: defaultApp.glowAmbientOpacity
      },
      cards: {
        cardBg: defaultApp.cardBg,
        cardOpacity: defaultApp.cardOpacity,
        cardBorderColor: defaultApp.cardBorderColor,
        cardBorderOpacity: defaultApp.cardBorderOpacity,
        cardBorderWidth: defaultApp.cardBorderWidth,
        cardBorderRadius: defaultApp.cardBorderRadius,
        cardShadowIntensity: defaultApp.cardShadowIntensity,
        cardShadowBlur: defaultApp.cardShadowBlur,
        cardHoverLift: defaultApp.cardHoverLift,
        cardHoverScale: defaultApp.cardHoverScale,
        cardHoverBorderBrightness: defaultApp.cardHoverBorderBrightness,
        cardHoverGlow: defaultApp.cardHoverGlow,
        cardImageZoom: defaultApp.cardImageZoom,
        cardOverrideProjects: false,
        cardOverrideVideos: false,
        cardOverridePortfolio: false,
        cardOverrideFeatured: false
      },
      buttons: {
        btnPrimaryBg: defaultApp.btnPrimaryBg,
        btnPrimaryText: defaultApp.btnPrimaryText,
        btnPrimaryHoverBg: defaultApp.btnPrimaryHoverBg,
        btnSecondaryBg: defaultApp.btnSecondaryBg,
        btnSecondaryText: defaultApp.btnSecondaryText,
        btnSecondaryBorder: defaultApp.btnSecondaryBorder,
        btnBorderRadius: defaultApp.btnBorderRadius,
        btnPaddingY: defaultApp.btnPaddingY,
        btnPaddingX: defaultApp.btnPaddingX,
        btnHoverLift: defaultApp.btnHoverLift,
        btnHoverScale: defaultApp.btnHoverScale,
        btnHoverBrightness: defaultApp.btnHoverBrightness,
        btnActiveScale: defaultApp.btnActiveScale,
        btnTransitionSpeed: defaultApp.btnTransitionSpeed
      },
      typography: {
        fontHeadingWeight: defaultApp.fontHeadingWeight,
        heroHeadingSize: defaultApp.heroHeadingSize,
        heroHeadingWeight: defaultApp.heroHeadingWeight,
        heroHeadingColor: defaultApp.heroHeadingColor,
        heroHeadingLetterSpacing: defaultApp.heroHeadingLetterSpacing,
        heroHeadingLineHeight: defaultApp.heroHeadingLineHeight,
        sectionHeadingSize: defaultApp.sectionHeadingSize,
        sectionHeadingWeight: defaultApp.sectionHeadingWeight,
        sectionHeadingColor: defaultApp.sectionHeadingColor,
        sectionHeadingLetterSpacing: defaultApp.sectionHeadingLetterSpacing,
        sectionHeadingLineHeight: defaultApp.sectionHeadingLineHeight,
        cardHeadingSize: defaultApp.cardHeadingSize,
        cardHeadingWeight: defaultApp.cardHeadingWeight,
        cardHeadingColor: defaultApp.cardHeadingColor,
        bodyTextSize: defaultApp.bodyTextSize,
        bodyTextWeight: defaultApp.bodyTextWeight,
        bodyTextColor: defaultApp.bodyTextColor,
        bodyLineHeight: defaultApp.bodyLineHeight,
        bodyLetterSpacing: defaultApp.bodyLetterSpacing,
        mutedTextColor: defaultApp.mutedTextColor,
        mutedTextOpacity: defaultApp.mutedTextOpacity
      },
      layout: {
        containerMaxWidth: defaultApp.containerMaxWidth,
        sectionSpacing: defaultApp.sectionSpacing,
        sectionPaddingY: defaultApp.sectionPaddingY,
        gridGap: defaultApp.gridGap,
        cardGap: defaultApp.cardGap,
        navbarHeight: defaultApp.navbarHeight,
        containerPaddingX: defaultApp.containerPaddingX
      },
      navbar: {
        navbarBg: defaultApp.navbarBg,
        navbarBgOpacity: defaultApp.navbarBgOpacity,
        navbarBackdropBlur: defaultApp.navbarBackdropBlur,
        navbarBorderOpacity: defaultApp.navbarBorderOpacity,
        navbarLogoSize: defaultApp.navbarLogoSize,
        navbarTextColor: defaultApp.navbarTextColor,
        navbarActiveColor: defaultApp.navbarActiveColor,
        navbarHoverColor: defaultApp.navbarHoverColor,
        navbarActiveGlow: defaultApp.navbarActiveGlow,
        navbarTransitionSpeed: defaultApp.navbarTransitionSpeed
      },
      footer: {
        footerBg: defaultApp.footerBg,
        footerBorderColor: defaultApp.footerBorderColor,
        footerHeadingColor: defaultApp.footerHeadingColor,
        footerTextColor: defaultApp.footerTextColor,
        footerMutedColor: defaultApp.footerMutedColor,
        footerLinkColor: defaultApp.footerLinkColor,
        footerAccentColor: defaultApp.footerAccentColor,
        footerSpacing: defaultApp.footerSpacing
      },
      animations: {
        hoverAnimationsEnabled: defaultApp.hoverAnimationsEnabled,
        hoverLiftDistance: defaultApp.hoverLiftDistance,
        hoverScaleAmount: defaultApp.hoverScaleAmount,
        hoverTransitionSpeed: defaultApp.hoverTransitionSpeed,
        buttonPressAmount: defaultApp.buttonPressAmount,
        scrollRevealEnabled: defaultApp.scrollRevealEnabled,
        scrollSlideDistance: defaultApp.scrollSlideDistance,
        scrollDuration: defaultApp.scrollDuration,
        scrollEasing: defaultApp.scrollEasing,
        scrollTriggerDistance: defaultApp.scrollTriggerDistance
      },
      scrollProgress: {
        scrollProgressEnabled: defaultApp.scrollProgressEnabled,
        scrollProgressColor: defaultApp.scrollProgressColor,
        scrollProgressWidth: defaultApp.scrollProgressWidth,
        scrollProgressOpacity: defaultApp.scrollProgressOpacity,
        scrollProgressGlow: defaultApp.scrollProgressGlow,
        scrollProgressRight: defaultApp.scrollProgressRight,
        scrollProgressBorderRadius: defaultApp.scrollProgressBorderRadius,
        scrollProgressTransitionSpeed: defaultApp.scrollProgressTransitionSpeed,
        scrollProgressMobile: defaultApp.scrollProgressMobile
      },
      shapes: {
        shapesEnabled: defaultApp.shapesEnabled,
        shapes: JSON.parse(JSON.stringify(defaultApp.shapes))
      }
    };

    if (sectionMap[sectionKey]) {
      this.state.appearance = {
        ...this.state.appearance,
        ...sectionMap[sectionKey]
      };
      this.saveState();
      return true;
    }
    return false;
  }

  resetEntireTheme() {
    this.state.appearance = JSON.parse(JSON.stringify(initialData.appearance));
    this.saveState();
    return true;
  }

  exportThemeJSON() {
    return JSON.stringify({
      version: "2.0",
      type: "olflaz-theme-export",
      exportedAt: new Date().toISOString(),
      appearance: this.state.appearance
    }, null, 2);
  }

  importThemeJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      const appData = parsed.appearance || parsed;
      if (!appData || typeof appData !== "object") {
        throw new Error("Invalid theme JSON file structure.");
      }
      this.state.appearance = {
        ...initialData.appearance,
        ...appData
      };
      this.saveState();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  /* ==========================================================================
     MUTATIONS: ABOUT, CHANNEL, SOCIAL, SETTINGS
     ========================================================================== */

  updateAbout(updates) {
    this.state.about = {
      ...this.state.about,
      ...updates
    };
    this.saveState();
    return this.state.about;
  }

  updateChannelStats(updates) {
    this.state.channelStats = {
      ...this.state.channelStats,
      ...updates
    };
    this.saveState();
    return this.state.channelStats;
  }

  updateSocialLinks(updates) {
    this.state.socialLinks = {
      ...this.state.socialLinks,
      ...updates
    };
    this.saveState();
    return this.state.socialLinks;
  }

  updateSiteSettings(updates) {
    this.state.siteSettings = {
      ...this.state.siteSettings,
      ...updates
    };
    this.saveState();
    return this.state.siteSettings;
  }

  /* ==========================================================================
     MUTATIONS: MEDIA
     ========================================================================== */

  addMedia(mediaItem) {
    const id = "med-" + Date.now();
    const newMedia = {
      id,
      name: mediaItem.name || "media-asset.png",
      url: mediaItem.url || "",
      type: mediaItem.type || "image/png",
      size: mediaItem.size || "Unknown",
      uploadedAt: new Date().toISOString().split("T")[0],
      usageCount: 0,
      usageLocation: "Media Library",
      ...mediaItem
    };

    if (!Array.isArray(this.state.media)) this.state.media = [];
    this.state.media.unshift(newMedia);
    this.saveState();
    return newMedia;
  }

  deleteMedia(id) {
    this.state.media = (this.state.media || []).filter(m => m.id !== id);
    this.saveState();
    return true;
  }

  /* ==========================================================================
     IMPORT / EXPORT / RESET
     ========================================================================== */

  exportDataAsJSON() {
    return JSON.stringify(this.state, null, 2);
  }

  importDataFromJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== "object") throw new Error("Invalid JSON format");
      this.state = {
        ...initialData,
        ...parsed
      };
      this.saveState();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  resetToDefaultData() {
    this.state = JSON.parse(JSON.stringify(initialData));
    this.saveState();
    return true;
  }
}

export const THEME_PRESETS = {
  default: {
    name: "Olflaz Dark (Signature)",
    desc: "Carefully balanced dark atmosphere with crisp electric cyan accents, subtle ambient glows, and clean cards.",
    tokens: {
      themePreset: "default",
      bgPage: "#08090c",
      bgPageAlt: "#0c0e13",
      bgSurface: "#11141b",
      bgCard: "#11141b",
      bgSurfaceAlt: "#161923",
      bgSurfaceElevated: "#212737",
      borderColor: "rgba(255, 255, 255, 0.08)",
      borderSubtle: "rgba(255, 255, 255, 0.04)",
      borderHover: "rgba(255, 255, 255, 0.16)",
      borderDivider: "rgba(255, 255, 255, 0.08)",
      textHeading: "#f1f4f9",
      textHeadingSecondary: "#38bdf8",
      textMain: "#f1f4f9",
      textMuted: "#94a0b5",
      textLight: "#5f687a",
      textLink: "#38bdf8",
      textInverse: "#08090c",
      accentPrimaryHex: "#38bdf8",
      accentSecondaryHex: "#0ea5e9",
      accentHoverHex: "#0284c7",
      accentActiveHex: "#0369a1",
      accentSurfaceOpacity: "0.06",
      accentBorderOpacity: "0.22",
      btnPrimaryBg: "#38bdf8",
      btnPrimaryText: "#08090c",
      btnPrimaryHoverBg: "#0ea5e9",
      btnSecondaryBg: "rgba(255, 255, 255, 0.06)",
      btnSecondaryText: "#f1f4f9",
      btnSecondaryBorder: "rgba(255, 255, 255, 0.12)",
      inputBg: "#161923",
      inputBorder: "rgba(255, 255, 255, 0.08)",
      inputFocus: "#38bdf8",
      badgeBg: "rgba(56, 189, 248, 0.08)",
      badgeText: "#38bdf8",
      glowGlobalPreset: "subtle",
      glowGlobalIntensity: "1",
      glowButtonIntensity: "1",
      glowCardHover: "1",
      glowNavActive: "1",
      cardBg: "#11141b",
      cardBorderRadius: "10px",
      cardHoverLift: "6px",
      cardHoverScale: "1.02",
      btnBorderRadius: "6px",
      fontHeadingWeight: "700",
      heroHeadingSize: "3.5rem",
      sectionHeadingSize: "2rem",
      containerMaxWidth: "1200px",
      sectionSpacing: "88px",
      navbarBg: "#08090c",
      navbarBgOpacity: "0.85",
      footerBg: "#08090c",
      scrollRevealEnabled: true,
      scrollSlideDistance: "80px",
      scrollDuration: "800ms",
      scrollProgressEnabled: true,
      scrollProgressColor: "#38bdf8",
      shapesEnabled: true
    }
  },
  "pure-black": {
    name: "Pure Black (OLED Studio)",
    desc: "True absolute #000000 black canvas with high-contrast surfaces, razor-sharp borders, and minimal glow.",
    tokens: {
      themePreset: "pure-black",
      bgPage: "#000000",
      bgPageAlt: "#040406",
      bgSurface: "#08080a",
      bgCard: "#08080a",
      bgSurfaceAlt: "#101014",
      bgSurfaceElevated: "#18181e",
      borderColor: "rgba(255, 255, 255, 0.12)",
      borderSubtle: "rgba(255, 255, 255, 0.06)",
      borderHover: "rgba(255, 255, 255, 0.24)",
      borderDivider: "rgba(255, 255, 255, 0.12)",
      textHeading: "#ffffff",
      textHeadingSecondary: "#38bdf8",
      textMain: "#f8fafc",
      textMuted: "#8e9bb0",
      textLight: "#4e5668",
      textLink: "#38bdf8",
      textInverse: "#000000",
      accentPrimaryHex: "#38bdf8",
      accentSecondaryHex: "#0284c7",
      accentHoverHex: "#0369a1",
      accentActiveHex: "#075985",
      accentSurfaceOpacity: "0.08",
      accentBorderOpacity: "0.3",
      btnPrimaryBg: "#38bdf8",
      btnPrimaryText: "#000000",
      btnPrimaryHoverBg: "#0ea5e9",
      btnSecondaryBg: "rgba(255, 255, 255, 0.08)",
      btnSecondaryText: "#ffffff",
      btnSecondaryBorder: "rgba(255, 255, 255, 0.18)",
      inputBg: "#0a0a0e",
      inputBorder: "rgba(255, 255, 255, 0.12)",
      inputFocus: "#38bdf8",
      badgeBg: "rgba(56, 189, 248, 0.1)",
      badgeText: "#38bdf8",
      glowGlobalPreset: "low",
      glowGlobalIntensity: "0.6",
      glowButtonIntensity: "0.8",
      glowCardHover: "0.6",
      glowNavActive: "0.8",
      cardBg: "#08080a",
      cardBorderRadius: "8px",
      cardHoverLift: "4px",
      cardHoverScale: "1.01",
      btnBorderRadius: "4px",
      fontHeadingWeight: "700",
      heroHeadingSize: "3.5rem",
      sectionHeadingSize: "2rem",
      containerMaxWidth: "1200px",
      sectionSpacing: "88px",
      navbarBg: "#000000",
      navbarBgOpacity: "0.92",
      footerBg: "#000000",
      scrollRevealEnabled: true,
      scrollSlideDistance: "80px",
      scrollDuration: "800ms",
      scrollProgressEnabled: true,
      scrollProgressColor: "#38bdf8",
      shapesEnabled: false
    }
  },
  "dark-minimal": {
    name: "Dark Minimal (Architect Slate)",
    desc: "Muted slate and graphite tones with subdued typography, restrained contrast, and clean geometric focus.",
    tokens: {
      themePreset: "dark-minimal",
      bgPage: "#0e1117",
      bgPageAlt: "#12161f",
      bgSurface: "#181d27",
      bgCard: "#181d27",
      bgSurfaceAlt: "#1e2430",
      bgSurfaceElevated: "#262e3d",
      borderColor: "rgba(255, 255, 255, 0.06)",
      borderSubtle: "rgba(255, 255, 255, 0.03)",
      borderHover: "rgba(255, 255, 255, 0.12)",
      borderDivider: "rgba(255, 255, 255, 0.06)",
      textHeading: "#e6edf3",
      textHeadingSecondary: "#60a5fa",
      textMain: "#cbd5e1",
      textMuted: "#8492a6",
      textLight: "#546074",
      textLink: "#60a5fa",
      textInverse: "#0e1117",
      accentPrimaryHex: "#60a5fa",
      accentSecondaryHex: "#3b82f6",
      accentHoverHex: "#2563eb",
      accentActiveHex: "#1d4ed8",
      accentSurfaceOpacity: "0.05",
      accentBorderOpacity: "0.18",
      btnPrimaryBg: "#60a5fa",
      btnPrimaryText: "#0e1117",
      btnPrimaryHoverBg: "#3b82f6",
      btnSecondaryBg: "rgba(255, 255, 255, 0.04)",
      btnSecondaryText: "#e6edf3",
      btnSecondaryBorder: "rgba(255, 255, 255, 0.08)",
      inputBg: "#141821",
      inputBorder: "rgba(255, 255, 255, 0.06)",
      inputFocus: "#60a5fa",
      badgeBg: "rgba(96, 165, 250, 0.08)",
      badgeText: "#60a5fa",
      glowGlobalPreset: "off",
      glowGlobalIntensity: "0.2",
      glowButtonIntensity: "0.3",
      glowCardHover: "0.2",
      glowNavActive: "0.4",
      cardBg: "#181d27",
      cardBorderRadius: "6px",
      cardHoverLift: "3px",
      cardHoverScale: "1.005",
      btnBorderRadius: "4px",
      fontHeadingWeight: "600",
      heroHeadingSize: "3.25rem",
      sectionHeadingSize: "1.875rem",
      containerMaxWidth: "1160px",
      sectionSpacing: "80px",
      navbarBg: "#0e1117",
      navbarBgOpacity: "0.9",
      footerBg: "#0e1117",
      scrollRevealEnabled: true,
      scrollSlideDistance: "60px",
      scrollDuration: "700ms",
      scrollProgressEnabled: true,
      scrollProgressColor: "#60a5fa",
      shapesEnabled: false
    }
  },
  custom: {
    name: "Custom Workspace Theme",
    desc: "Your personalized visual style tailored with custom colors, glows, animations, and decorative shapes.",
    tokens: {}
  }
};

// Global Singleton Store instance
export const store = new StateStore();

