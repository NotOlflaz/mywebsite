/**
 * Videos Page View
 * Features: Featured Video Spotlight, Category Filters, Best/Popular Videos, Latest Videos,
 * Reusable video cards with YouTube watch links.
 */

import { store } from "../../store/state.js";
import { getIcon } from "../../utils/icons.js";

let selectedVideoCategory = "All";

export function renderVideosView() {
  const allVideos = store.getVideos();
  const social = store.getSocialLinks();

  const categories = ["All", ...new Set(allVideos.map(v => v.category).filter(Boolean))];

  const featuredVideo = allVideos.find(v => v.isFeatured) || allVideos[0];

  const filteredVideos = allVideos.filter(v => {
    return selectedVideoCategory === "All" || v.category === selectedVideoCategory;
  });

  const categoriesHtml = categories.map(cat => `
    <button 
      class="tab-btn video-cat-btn ${cat === selectedVideoCategory ? 'active' : ''}" 
      data-category="${cat}"
      type="button">
      ${cat}
    </button>
  `).join("");

  const renderVideoCard = (video, idx) => `
    <article class="card card-hover reveal-card stagger-${(idx % 6) + 1}" id="video-card-${video.id}">
      <div class="card-media">
        ${video.thumbnail ? `
          <img src="${video.thumbnail}" alt="${video.title} Thumbnail" loading="lazy" />
        ` : `
          <div class="card-media-placeholder">
            ${getIcon("play", 24)}
            <span>[ YouTube Thumbnail ]</span>
          </div>
        `}
      </div>
      <div class="card-body">
        <div class="flex items-center justify-between gap-xs">
          <span class="badge ${video.isFeatured ? 'badge-featured' : ''}">${video.category || 'Video'}</span>
          <span class="text-xs text-muted font-mono">${video.views || '0 views'}</span>
        </div>
        <h3 style="font-size: var(--text-base); line-height: 1.4; margin-top: 4px;">${video.title}</h3>
        <p style="font-size: var(--text-xs); line-height: 1.5; color: var(--text-muted); flex-grow: 1;">${video.description}</p>
      </div>
      <div class="card-footer">
        <span class="text-xs text-muted font-mono">${video.uploadDate || 'Recent'}</span>
        <a href="${video.youtubeUrl || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
          Watch on YouTube ↗
        </a>
      </div>
    </article>
  `;

  return `
    <div class="videos-page-root">
      <section class="section" style="padding-top: var(--space-2xl);">
        <div class="container">
          
          <!-- Header -->
          <div class="flex items-center justify-between gap-md flex-wrap reveal-init" style="margin-bottom: var(--space-2xl);">
            <div class="section-header section-header-left" style="margin-bottom: 0;">
              <div class="badge" style="margin-bottom: var(--space-2xs);">YOUTUBE CONTENT & DEVLOGS</div>
              <h1>Videos & Tutorials</h1>
              <p>Game development tutorials in Godot 4, Minecraft mechanics breakdowns, and challenge videos.</p>
            </div>
            <a href="${social.youtube || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              Subscribe on YouTube ↗
            </a>
          </div>

          <!-- Featured Spotlight Video -->
          ${featuredVideo ? `
            <div class="featured-video-spotlight reveal-init stagger-1">
              <div class="featured-video-media">
                ${featuredVideo.thumbnail ? `
                  <img src="${featuredVideo.thumbnail}" alt="${featuredVideo.title}" style="width:100%; height:100%; object-fit:cover;" />
                ` : `
                  <div class="card-media-placeholder">
                    <div style="color: var(--accent-primary); margin-bottom: 8px;">${getIcon("play", 40)}</div>
                    <strong style="font-size: 15px;">FEATURED SPOTLIGHT VIDEO</strong>
                    <span style="font-size: 12px; color: var(--text-light);">[ Click to Watch on YouTube ]</span>
                  </div>
                `}
              </div>
              <div class="featured-video-content">
                <div class="flex items-center gap-xs">
                  <span class="badge badge-featured">FEATURED HIGHLIGHT</span>
                  <span class="badge">${featuredVideo.category || 'Tutorial'}</span>
                </div>
                <h2 style="font-size: var(--text-2xl); margin-top: 6px;">${featuredVideo.title}</h2>
                <p style="font-size: var(--text-sm); line-height: 1.6;">${featuredVideo.description}</p>
                
                <div class="flex items-center gap-md" style="margin-top: 12px; font-size: var(--text-xs); color: var(--text-light); font-family: var(--font-mono);">
                  <span>${featuredVideo.views || '0 views'}</span>
                  <span>&bull;</span>
                  <span>${featuredVideo.uploadDate || 'Recently'}</span>
                </div>

                <div style="margin-top: 16px;">
                  <a href="${featuredVideo.youtubeUrl || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                    Watch Full Video on YouTube ↗
                  </a>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Category Tabs -->
          <div class="tabs reveal-init stagger-1" style="margin-bottom: var(--space-xl);">
            ${categoriesHtml}
          </div>

          <!-- Latest & Filtered Videos Grid -->
          <div class="grid grid-cols-3 gap-lg scroll-reveal-grid">
            ${filteredVideos.length > 0 ? filteredVideos.map((v, i) => renderVideoCard(v, i)).join("") : `
              <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-2xl); background: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
                <div class="empty-state-icon">${getIcon("videos", 32)}</div>
                <p style="margin-top: 8px;">No videos found in this category.</p>
              </div>
            `}
          </div>

        </div>
      </section>
    </div>
  `;
}

export function initVideosViewEvents(reRenderCallback) {
  const catButtons = document.querySelectorAll(".video-cat-btn");
  catButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      selectedVideoCategory = btn.getAttribute("data-category");
      if (reRenderCallback) reRenderCallback();
    });
  });
}
