/**
 * Home Page View
 * Fully reactive & dynamic: respects Home Page Section Manager ordering and visibility.
 * Renders Hero, Channel Overview, Featured Projects, Featured Videos,
 * About Preview, Skills / What I Do, and Call To Action sections.
 */

import { store } from "../../store/state.js";
import { getIcon } from "../../utils/icons.js";
import { extractYouTubeVideoId, getYouTubeThumbnailUrl } from "../../utils/youtube.js";

function getVideoThumbnail(video) {
  if (video.thumbnail && video.thumbnail.trim()) return video.thumbnail;
  if (video.youtubeUrl) {
    const videoId = extractYouTubeVideoId(video.youtubeUrl);
    if (videoId) return getYouTubeThumbnailUrl(videoId, "high");
  }
  return "";
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderProjectActionButtons(project) {
  if (Array.isArray(project.actionButtons) && project.actionButtons.length > 0) {
    const activeBtns = project.actionButtons.filter(b => b.enabled !== false && b.url);
    if (activeBtns.length > 0) {
      return activeBtns.map(btn => `
        <a href="${btn.url}" target="_blank" rel="noopener noreferrer" class="btn btn-${btn.style || 'secondary'} btn-sm">
          ${escapeHtml(btn.label || 'Action')} ↗
        </a>
      `).join("");
    }
  }
  let buttons = [];
  if (project.githubUrl) {
    buttons.push(`<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm" title="View Source on GitHub">GitHub ↗</a>`);
  }
  if (project.demoUrl) {
    buttons.push(`<a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="Play / Download Demo">Demo ↗</a>`);
  }
  return buttons.join("");
}

/* ==========================================================================
   SECTION RENDERERS
   ========================================================================== */

function renderHeroSection(home, settings, about, cfg) {
  return `
    <section class="hero-section" aria-labelledby="hero-title" id="home-section-hero">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-content reveal-init">
            <div class="hero-identity-badge">
              <span>${home.heroTagline || settings.tagline || 'Minecraft Creator & Godot Game Developer'}</span>
            </div>
            <h1 class="hero-title" id="hero-title">
              ${home.heroTitle || settings.siteName || 'Olflaz'}
            </h1>
            <p class="hero-subtitle">
              ${home.heroSubtitle || 'Crafting indie games with Godot & exploring Minecraft through creative challenges & mechanics.'}
            </p>
            <p class="hero-bio">
              ${home.heroBio || about.shortBio || "Hey! I'm Olflaz. I develop indie games with Godot Engine and produce high-energy Minecraft content, map breakdowns, and game development tutorials."}
            </p>
            <div class="hero-cta-group">
              <a href="${home.primaryCtaLink || '#/projects'}" class="btn btn-primary btn-lg" id="hero-cta-projects">
                ${home.primaryCtaText || 'View My Projects'}
              </a>
              <a href="${home.secondaryCtaLink || '#/videos'}" class="btn btn-secondary btn-lg" id="hero-cta-videos">
                ${home.secondaryCtaText || 'Watch My Videos'}
              </a>
              <a href="#/about" class="btn btn-outline btn-lg" id="hero-cta-about">
                About Me
              </a>
            </div>
          </div>

          <div class="hero-avatar-container">
            <div class="hero-avatar-box reveal-init stagger-2">
              ${(home.avatarUrl || about.avatarUrl) ? `
                <img src="${home.avatarUrl || about.avatarUrl}" alt="${home.heroTitle || settings.siteName || 'Olflaz'} Avatar" />
              ` : `
                <div style="color: var(--accent-primary); margin-bottom: 12px;">${getIcon("user", 48)}</div>
                <strong style="font-size: var(--text-lg);">${home.heroTitle || settings.siteName || 'Olflaz'}</strong>
                <span style="font-size: var(--text-xs); color: var(--text-light); margin-top: 4px;">Game Developer & Creator</span>
              `}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderChannelSection(stats, social, cfg) {
  const sectionTitle = cfg.title || "Channel & Creator Overview";

  return `
    <section class="section section-alt" aria-labelledby="channel-overview-title" id="home-section-channel">
      <div class="container">
        <div class="section-header reveal-init">
          <h2 id="channel-overview-title">${sectionTitle}</h2>
          <p>Live metrics from YouTube, game development milestones, and community engagement.</p>
        </div>

        <div class="channel-overview-grid">
          <div class="channel-stat-card reveal-card stagger-1">
            <div class="channel-stat-value">${stats.subscribers || '45K+'}</div>
            <div class="channel-stat-label">YouTube Subscribers</div>
          </div>
          <div class="channel-stat-card reveal-card stagger-2">
            <div class="channel-stat-value">${stats.totalViews || '3.8M+'}</div>
            <div class="channel-stat-label">Total Video Views</div>
          </div>
          <div class="channel-stat-card reveal-card stagger-3">
            <div class="channel-stat-value">${stats.projectCount || '12+'}</div>
            <div class="channel-stat-label">Released Projects</div>
          </div>
          <div class="channel-stat-card reveal-card stagger-4">
            <div class="channel-stat-value">${stats.videoCount || '80+'}</div>
            <div class="channel-stat-label">Videos Published</div>
          </div>
        </div>

        <div class="channel-desc-box reveal-init stagger-2">
          <div style="max-width: 750px;">
            <h3 style="font-size: var(--text-lg); margin-bottom: 4px;">YouTube: ${stats.channelName || 'Olflaz'}</h3>
            <p style="font-size: var(--text-sm);">${stats.description || 'Creating entertaining Minecraft challenges, custom map breakdowns, and sharing in-depth Godot 4 game development tutorials and devlogs.'}</p>
          </div>
          <div class="flex gap-xs flex-wrap">
            <a href="${social.youtube || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              Visit Channel ↗
            </a>
            <a href="#/videos" class="btn btn-secondary">
              Browse Videos
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderFeaturedProjectsSection(cfg) {
  const sectionTitle = cfg.title || "Featured Projects";
  const featuredProjects = store.getPublishedFeaturedProjects();
  const allPublishedCount = store.getPublishedProjects().length;

  let contentHtml = "";

  if (featuredProjects.length === 0) {
    contentHtml = `
      <div style="text-align: center; padding: var(--space-2xl); background: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
        <div class="empty-state-icon" style="color: var(--accent-primary);">${getIcon("projects", 32)}</div>
        <p style="font-weight: 600; margin-top: 8px;">Projects in development</p>
        <p class="text-xs text-muted" style="margin-top: 4px;">New Godot games and Minecraft adventure maps are currently in production.</p>
        <a href="#/projects" class="btn btn-secondary btn-sm" style="margin-top: 12px;">Browse All Projects</a>
      </div>
    `;
  } else if (featuredProjects.length === 1) {
    const project = featuredProjects[0];
    contentHtml = `
      <div class="card reveal-card" style="padding: var(--space-xl); display: grid; grid-template-columns: 1.2fr 1fr; gap: var(--space-xl); align-items: center;" id="featured-project-spotlight">
        <div class="card-media" style="height: 280px; border-radius: var(--radius-sm); overflow: hidden;">
          ${project.thumbnail ? `
            <img src="${project.thumbnail}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;" />
          ` : `
            <div class="card-media-placeholder">
              ${getIcon("projects", 36)}
              <span>[ ${project.engine || 'Godot'} Project Spotlight ]</span>
            </div>
          `}
        </div>
        <div>
          <div class="flex items-center gap-xs" style="margin-bottom: 8px;">
            <span class="badge badge-featured">FEATURED PROJECT</span>
            <span class="badge">${project.category || 'Game'}</span>
            <span class="badge ${project.status === 'Completed' ? 'badge-status-completed' : 'badge-status-in-progress'}">${project.status}</span>
          </div>
          <h3 style="font-size: var(--text-2xl); margin-bottom: 8px;">${project.title}</h3>
          <p style="font-size: var(--text-sm); line-height: 1.6; color: var(--text-muted); margin-bottom: 16px;">${project.shortDesc}</p>
          
          <div class="flex items-center gap-xs flex-wrap" style="margin-bottom: 16px;">
            ${(project.technologies || []).map(t => `<span class="badge">${t}</span>`).join("")}
          </div>

          <div class="flex items-center gap-xs flex-wrap">
            <a href="#/project/${project.id}" class="btn btn-primary btn-sm">
              View Full Details &rarr;
            </a>
            ${renderProjectActionButtons(project)}
          </div>
        </div>
      </div>
    `;
  } else {
    contentHtml = `
      <div class="grid grid-cols-3 gap-lg scroll-reveal-grid">
        ${featuredProjects.slice(0, 6).map((project, idx) => `
          <article class="card card-hover reveal-card stagger-${(idx % 6) + 1}" id="featured-project-${project.id}">
            <div class="card-media">
              ${project.thumbnail ? `
                <img src="${project.thumbnail}" alt="${project.title} Screenshot" loading="lazy" />
              ` : `
                <div class="card-media-placeholder">
                  ${getIcon("projects", 28)}
                  <span>[ ${project.engine || 'Godot'} Project Thumbnail ]</span>
                </div>
              `}
            </div>
            <div class="card-body">
              <div class="flex items-center justify-between gap-xs flex-wrap">
                <span class="badge badge-featured">${project.category || 'Game'}</span>
                <span class="badge ${project.status === 'Completed' ? 'badge-status-completed' : 'badge-status-in-progress'}">
                  ${project.status}
                </span>
              </div>
              <h3 style="font-size: var(--text-xl); margin-top: 4px;">${project.title}</h3>
              <p style="font-size: var(--text-sm); line-height: 1.6; flex-grow: 1;">${project.shortDesc}</p>
              
              <div class="flex items-center gap-xs flex-wrap" style="margin-top: 8px;">
                ${(project.technologies || []).slice(0, 3).map(tech => `
                  <span class="badge">${tech}</span>
                `).join("")}
              </div>
            </div>
            <div class="card-footer">
              <div class="flex items-center gap-xs">
                ${renderProjectActionButtons(project)}
              </div>
              <a href="#/project/${project.id}" class="btn btn-primary btn-sm">
                Details &rarr;
              </a>
            </div>
          </article>
        `).join("")}
      </div>
    `;
  }

  return `
    <section class="section" aria-labelledby="featured-projects-title" id="home-section-projects">
      <div class="container">
        <div class="flex items-center justify-between gap-md flex-wrap reveal-init" style="margin-bottom: var(--space-2xl);">
          <div>
            <h2 id="featured-projects-title">${sectionTitle}</h2>
            <p>Highlighted Godot games, Minecraft adventure maps, and open-source tools.</p>
          </div>
          <a href="#/projects" class="btn btn-outline">
            View All Projects (${allPublishedCount}) &rarr;
          </a>
        </div>

        ${contentHtml}
      </div>
    </section>
  `;
}

function renderFeaturedVideosSection(cfg) {
  const sectionTitle = cfg.title || "Featured Videos & Tutorials";
  const featuredVideos = store.getPublishedFeaturedVideos();

  let contentHtml = "";

  if (featuredVideos.length === 0) {
    contentHtml = `
      <div style="text-align: center; padding: var(--space-2xl); background: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
        <div class="empty-state-icon" style="color: var(--accent-primary);">${getIcon("videos", 32)}</div>
        <p style="font-weight: 600; margin-top: 8px;">Videos coming soon</p>
        <p class="text-xs text-muted" style="margin-top: 4px;">New game development tutorials and Minecraft devlogs will be published here.</p>
        <a href="#/videos" class="btn btn-secondary btn-sm" style="margin-top: 12px;">Browse Video Archive</a>
      </div>
    `;
  } else if (featuredVideos.length === 1) {
    const video = featuredVideos[0];
    const thumbUrl = getVideoThumbnail(video);
    contentHtml = `
      <div class="card reveal-card" style="padding: var(--space-xl); display: grid; grid-template-columns: 1.2fr 1fr; gap: var(--space-xl); align-items: center;" id="featured-video-spotlight">
        <div class="card-media" style="height: 280px; border-radius: var(--radius-sm); overflow: hidden;">
          ${thumbUrl ? `
            <img 
              src="${thumbUrl}" 
              alt="${video.title} Thumbnail" 
              style="width: 100%; height: 100%; object-fit: cover;"
              onerror="this.onerror=null; if(this.src.includes('maxresdefault.jpg')) this.src=this.src.replace('maxresdefault.jpg', 'hqdefault.jpg');"
            />
          ` : `
            <div class="card-media-placeholder">
              ${getIcon("play", 36)}
              <span>[ YouTube Video Spotlight ]</span>
            </div>
          `}
        </div>
        <div>
          <div class="flex items-center gap-xs" style="margin-bottom: 8px;">
            <span class="badge badge-featured">FEATURED VIDEO</span>
            <span class="badge">${video.category || 'Tutorial'}</span>
            <span class="text-xs text-muted font-mono">${video.views || '0 views'}</span>
          </div>
          <h3 style="font-size: var(--text-2xl); margin-bottom: 8px;">${video.title}</h3>
          <p style="font-size: var(--text-sm); line-height: 1.6; color: var(--text-muted); margin-bottom: 16px;">${video.description}</p>
          
          <div class="flex items-center gap-xs flex-wrap">
            <a href="${video.youtubeUrl || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
              Watch on YouTube ↗
            </a>
            <a href="#/videos" class="btn btn-secondary btn-sm">
              All Videos &rarr;
            </a>
          </div>
        </div>
      </div>
    `;
  } else {
    contentHtml = `
      <div class="grid grid-cols-4 gap-lg scroll-reveal-grid">
        ${featuredVideos.slice(0, 4).map((video, idx) => {
          const thumbUrl = getVideoThumbnail(video);
          return `
            <article class="card card-hover reveal-card stagger-${(idx % 4) + 1}" id="featured-video-${video.id}">
              <div class="card-media">
                ${thumbUrl ? `
                  <img 
                    src="${thumbUrl}" 
                    alt="${video.title} Thumbnail" 
                    loading="lazy" 
                    onerror="this.onerror=null; if(this.src.includes('maxresdefault.jpg')) this.src=this.src.replace('maxresdefault.jpg', 'hqdefault.jpg');" 
                  />
                ` : `
                  <div class="card-media-placeholder">
                    ${getIcon("play", 24)}
                    <span>[ YouTube Video Preview ]</span>
                  </div>
                `}
              </div>
              <div class="card-body">
                <div class="flex items-center justify-between gap-xs">
                  <span class="badge">${video.category || 'Tutorial'}</span>
                  <span class="text-xs text-muted font-mono">${video.views || '0 views'}</span>
                </div>
                <h3 style="font-size: var(--text-base); margin-top: 4px; line-height: 1.4;">${video.title}</h3>
                <p style="font-size: var(--text-xs); line-height: 1.5; color: var(--text-muted); flex-grow: 1;">${video.description}</p>
              </div>
              <div class="card-footer">
                <span class="text-xs text-muted font-mono">${video.uploadDate || 'Recent'}</span>
                <a href="${video.youtubeUrl || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
                  Watch ↗
                </a>
              </div>
            </article>
          `;
        }).join("")}
      </div>
    `;
  }

  return `
    <section class="section section-alt" aria-labelledby="featured-videos-title" id="home-section-videos">
      <div class="container">
        <div class="flex items-center justify-between gap-md flex-wrap reveal-init" style="margin-bottom: var(--space-2xl);">
          <div>
            <h2 id="featured-videos-title">${sectionTitle}</h2>
            <p>Hand-picked YouTube tutorials, game devlogs, and Minecraft challenge videos.</p>
          </div>
          <a href="#/videos" class="btn btn-outline">
            View All Videos &rarr;
          </a>
        </div>

        ${contentHtml}
      </div>
    </section>
  `;
}

function renderAboutSection(about, cfg) {
  const sectionTitle = cfg.title || "About Olflaz";

  return `
    <section class="section" aria-labelledby="about-preview-title" id="home-section-about">
      <div class="container">
        <div class="card reveal-init" style="padding: var(--space-2xl);">
          <div class="grid grid-cols-2 gap-2xl items-center">
            <div>
              <div class="badge" style="margin-bottom: var(--space-xs);">CREATOR PROFILE</div>
              <h2 id="about-preview-title" style="margin-bottom: var(--space-sm);">
                ${about.name || 'Olflaz'} — ${about.identity || 'Game Developer & Content Creator'}
              </h2>
              <p style="margin-bottom: var(--space-md); color: var(--text-muted); line-height: 1.7;">
                ${about.fullBio ? about.fullBio.slice(0, 240) + '...' : 'Specializing in Godot Engine and custom Minecraft mechanics. Empowering creators and sharing game development journeys.'}
              </p>
              <div class="flex gap-sm flex-wrap">
                <a href="#/about" class="btn btn-primary">
                  Read Full Story & Bio &rarr;
                </a>
                <a href="#/portfolio" class="btn btn-secondary">
                  View Portfolio
                </a>
              </div>
            </div>

            <div style="background-color: var(--bg-surface-alt); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: var(--space-lg);">
              <h4 style="margin-bottom: var(--space-sm);">Core Focus Areas:</h4>
              <ul style="display: flex; flex-direction: column; gap: var(--space-xs); font-size: var(--text-sm); color: var(--text-main);">
                <li><strong>Godot 4 Development:</strong> GDScript, 2D/3D state machines, responsive movement.</li>
                <li><strong>Minecraft Creation:</strong> Datapacks, custom mob AI, dungeon & skyblock maps.</li>
                <li><strong>Open Source Tools:</strong> Tilemap generators, inventory UI plugins.</li>
                <li><strong>Educational Devlogs:</strong> Actionable YouTube tutorials & game jam breakdowns.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderSkillsSection(cfg) {
  const sectionTitle = cfg.title || "Skills & Core Stack";

  return `
    <section class="section section-alt" aria-labelledby="skills-title" id="home-section-skills">
      <div class="container">
        <div class="section-header reveal-init">
          <h2 id="skills-title">${sectionTitle}</h2>
          <p>Technologies, engines, and disciplines I work with across game dev and media creation.</p>
        </div>

        <div class="skills-grid scroll-reveal-grid">
          <div class="skill-card reveal-card stagger-1">
            <div class="skill-card-header">
              <div class="skill-icon-placeholder">${getIcon("godot", 20)}</div>
              <span>Godot Engine</span>
            </div>
            <p class="text-sm">2D & 3D game development in Godot 4.x, physics systems, node architecture, and custom viewport management.</p>
          </div>

          <div class="skill-card reveal-card stagger-2">
            <div class="skill-card-header">
              <div class="skill-icon-placeholder">${getIcon("code", 20)}</div>
              <span>GDScript</span>
            </div>
            <p class="text-sm">Writing clean, modular, typed GDScript code, Finite State Machines (FSM), signals, and custom editor plugins.</p>
          </div>

          <div class="skill-card reveal-card stagger-3">
            <div class="skill-card-header">
              <div class="skill-icon-placeholder">${getIcon("cube", 20)}</div>
              <span>Minecraft Systems</span>
            </div>
            <p class="text-sm">Custom datapack programming (mcfunction), boss mechanics, loot tables, adventure map building, and server modding.</p>
          </div>

          <div class="skill-card reveal-card stagger-4">
            <div class="skill-card-header">
              <div class="skill-icon-placeholder">${getIcon("gamepad", 20)}</div>
              <span>Game Design</span>
            </div>
            <p class="text-sm">Game feel, responsive character controllers, level design, game loops, game jams, and prototyping.</p>
          </div>

          <div class="skill-card reveal-card stagger-5">
            <div class="skill-card-header">
              <div class="skill-icon-placeholder">${getIcon("cube", 20)}</div>
              <span>3D & Blender</span>
            </div>
            <p class="text-sm">Low-poly 3D modeling, UV unwrapping, stylized texturing, basic rigging, Blockbench models for Minecraft.</p>
          </div>

          <div class="skill-card reveal-card stagger-6">
            <div class="skill-card-header">
              <div class="skill-icon-placeholder">${getIcon("videoEdit", 20)}</div>
              <span>Video Production</span>
            </div>
            <p class="text-sm">DaVinci Resolve video production, pacing, voiceover narrative structure, sound design, and OBS studio recording.</p>
          </div>

          <div class="skill-card reveal-card stagger-7">
            <div class="skill-card-header">
              <div class="skill-icon-placeholder">${getIcon("content", 20)}</div>
              <span>Content Strategy</span>
            </div>
            <p class="text-sm">YouTube channel management, high-CTR thumbnail creation, devlog storytelling, and Discord community management.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderCtaSection(social, cfg) {
  const sectionTitle = cfg.title || "Join The Community";

  return `
    <section class="section" aria-labelledby="cta-title" id="home-section-cta">
      <div class="container">
        <div class="cta-banner reveal-init">
          <div class="badge badge-featured" style="margin-bottom: var(--space-xs);">CONNECT & COLLABORATE</div>
          <h2 id="cta-title">${sectionTitle}</h2>
          <p>
            Whether you want to play my latest Godot prototypes, download Minecraft maps, watch game dev tutorials, or chat on Discord — you're welcome here!
          </p>
          <div class="flex gap-sm justify-center flex-wrap">
            <a href="#/projects" class="btn btn-primary btn-lg">
              Explore Projects
            </a>
            <a href="${social.youtube || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-lg">
              Subscribe on YouTube
            </a>
            <a href="${social.discord || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-lg">
              Join Discord Server
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}

/* ==========================================================================
   MAIN RENDER
   ========================================================================== */

export function renderHomeView() {
  const home = store.getHome();
  const settings = store.getSiteSettings();
  const stats = store.getChannelStats();
  const about = store.getAbout();
  const social = store.getSocialLinks();
  const sections = store.getHomeSections();

  const sectionMap = {
    hero: (cfg) => renderHeroSection(home, settings, about, cfg),
    channel: (cfg) => renderChannelSection(stats, social, cfg),
    projects: (cfg) => renderFeaturedProjectsSection(cfg),
    videos: (cfg) => renderFeaturedVideosSection(cfg),
    about: (cfg) => renderAboutSection(about, cfg),
    skills: (cfg) => renderSkillsSection(cfg),
    cta: (cfg) => renderCtaSection(social, cfg)
  };

  const renderedSectionsHtml = sections
    .filter(sec => sec.enabled !== false)
    .map(sec => {
      const renderFn = sectionMap[sec.id];
      return renderFn ? renderFn(sec) : "";
    })
    .join("");

  return `
    <div class="home-page-root">
      ${renderedSectionsHtml}
    </div>
  `;
}

