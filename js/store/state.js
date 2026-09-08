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
        return {
          ...initialData,
          ...parsed,
          appearance: { ...initialData.appearance, ...(parsed.appearance || {}) },
          siteSettings: { ...initialData.siteSettings, ...(parsed.siteSettings || {}) },
          home: { ...initialData.home, ...(parsed.home || {}) },
          channelStats: { ...initialData.channelStats, ...(parsed.channelStats || {}) },
          about: { ...initialData.about, ...(parsed.about || {}) },
          socialLinks: { ...initialData.socialLinks, ...(parsed.socialLinks || {}) },
          projects: Array.isArray(parsed.projects) ? parsed.projects : initialData.projects,
          videos: Array.isArray(parsed.videos) ? parsed.videos : initialData.videos,
          portfolio: Array.isArray(parsed.portfolio) ? parsed.portfolio : initialData.portfolio,
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
   * Apply live design system tokens directly to DOM root
   */
  applyAppearanceTokens() {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const appearance = this.getAppearance();

    root.setAttribute("data-accent", appearance.accentColor || "cyan");
    root.setAttribute("data-glow", appearance.ambientGlow || "off");
    root.setAttribute("data-pattern", appearance.bgPattern || "none");
    root.setAttribute("data-card-style", appearance.cardStyle || "solid");
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

  getProjectById(id) {
    return (this.state.projects || []).find(p => p.id === id || p.slug === id);
  }

  getFeaturedProjects() {
    return (this.state.projects || []).filter(p => p.isFeatured);
  }

  getVideos() {
    return this.state.videos || [];
  }

  getVideoById(id) {
    return (this.state.videos || []).find(v => v.id === id);
  }

  getFeaturedVideos() {
    return (this.state.videos || []).filter(v => v.isFeatured);
  }

  getPortfolio() {
    return this.state.portfolio || [];
  }

  getFeaturedPortfolio() {
    return (this.state.portfolio || []).filter(item => item.isFeatured);
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
     MUTATIONS: HOME
     ========================================================================== */

  updateHome(updates) {
    this.state.home = {
      ...this.state.home,
      ...updates
    };
    this.saveState();
    return this.state.home;
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
      devDate: new Date().getFullYear().toString(),
      shortDesc: "",
      fullDesc: "",
      thumbnail: "",
      screenshots: [],
      technologies: [],
      features: [],
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

  /* ==========================================================================
     MUTATIONS: VIDEOS
     ========================================================================== */

  addVideo(videoData) {
    const id = "vid-" + Date.now();
    let youtubeId = "";
    if (videoData.youtubeUrl) {
      const match = videoData.youtubeUrl.match(/(?:v=|\/embed\/|youtu\.be\/|\/v\/)([^&#?]+)/);
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
        const match = updates.youtubeUrl.match(/(?:v=|\/embed\/|youtu\.be\/|\/v\/)([^&#?]+)/);
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

// Global Singleton Store instance
export const store = new StateStore();
