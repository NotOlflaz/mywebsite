/**
 * Public Portfolio Page View
 * Categorized showcase: Game Development, Minecraft, Programming, Content Creation, Other Projects.
 * Supports published-only filtering, custom action buttons, and polished empty states.
 */

import { store } from "../../store/state.js";
import { getIcon } from "../../utils/icons.js";

let selectedPortfolioCategory = "All";

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderPortfolioButtons(item) {
  if (Array.isArray(item.actionButtons) && item.actionButtons.length > 0) {
    const activeBtns = item.actionButtons.filter(b => b.enabled !== false && b.url);
    if (activeBtns.length > 0) {
      return activeBtns.map(btn => `
        <a href="${btn.url}" target="_blank" rel="noopener noreferrer" class="btn btn-${btn.style || 'primary'} btn-sm">
          ${escapeHtml(btn.label || 'View Resource')} ↗
        </a>
      `).join("");
    }
  }
  if (item.links) {
    return `<a href="${item.links}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm btn-block">View Project / Resource ↗</a>`;
  }
  return `<span class="text-xs text-muted font-mono">Internal Case Study</span>`;
}

export function renderPortfolioView() {
  const portfolioItems = store.getPublishedPortfolio();

  const standardCategories = [
    "All",
    "Game Development",
    "Minecraft",
    "Programming",
    "Content Creation",
    "Other Projects"
  ];

  const filteredItems = portfolioItems.filter(item => {
    return selectedPortfolioCategory === "All" || item.category === selectedPortfolioCategory;
  });

  const categoryTabsHtml = standardCategories.map(cat => {
    const count = cat === "All" ? portfolioItems.length : portfolioItems.filter(p => p.category === cat).length;
    return `
      <button 
        class="tab-btn portfolio-cat-btn ${cat === selectedPortfolioCategory ? 'active' : ''}" 
        data-category="${cat}"
        type="button">
        ${cat} (${count})
      </button>
    `;
  }).join("");

  let gridHtml = "";

  if (portfolioItems.length === 0) {
    gridHtml = `
      <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-3xl); background-color: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: var(--radius-lg);">
        <div class="empty-state-icon">${getIcon("portfolio", 36)}</div>
        <h3 style="margin-top: 12px; font-size: var(--text-xl);">Portfolio Entries Coming Soon</h3>
        <p style="margin-top: 6px; color: var(--text-muted); max-width: 500px; margin-left: auto; margin-right: auto;">
          Curated case studies, released game prototypes, and custom Minecraft creations will be published here.
        </p>
      </div>
    `;
  } else if (filteredItems.length === 0) {
    gridHtml = `
      <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-3xl); background-color: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: var(--radius-lg);">
        <div class="empty-state-icon">${getIcon("portfolio", 32)}</div>
        <h3 style="margin-top: 8px;">No portfolio entries found in this category</h3>
        <p style="margin-top: 8px; color: var(--text-muted);">Switch categories above or browse all items.</p>
      </div>
    `;
  } else if (filteredItems.length === 1 && selectedPortfolioCategory === "All") {
    const item = filteredItems[0];
    gridHtml = `
      <div style="grid-column: 1 / -1;">
        <article class="card reveal-card" style="padding: var(--space-xl); display: grid; grid-template-columns: 1.2fr 1fr; gap: var(--space-xl); align-items: center;" id="portfolio-item-${item.id}">
          <div class="card-media" style="height: 280px; border-radius: var(--radius-sm); overflow: hidden;">
            ${item.image ? `
              <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;" />
            ` : `
              <div class="card-media-placeholder">
                ${getIcon("portfolio", 36)}
                <span>[ Portfolio Item Preview ]</span>
              </div>
            `}
          </div>
          <div class="card-body" style="padding: 0;">
            <div class="flex items-center gap-xs">
              <span class="badge ${item.isFeatured ? 'badge-featured' : ''}">${item.category}</span>
              ${item.isFeatured ? '<span class="badge badge-featured">Featured Highlight</span>' : ''}
            </div>
            
            <h2 style="font-size: var(--text-2xl); margin-top: 6px;">${item.title}</h2>
            <p style="font-size: var(--text-sm); line-height: 1.6; color: var(--text-muted); margin-top: 8px;">${item.description}</p>
            
            <div style="background-color: var(--bg-surface-alt); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: var(--space-sm); margin-top: 12px; display: flex; flex-direction: column; gap: 4px; font-size: var(--text-xs);">
              <div><strong>Role:</strong> <span style="color: var(--text-main);">${item.role || 'Lead Creator'}</span></div>
              <div><strong>Result:</strong> <span style="color: var(--text-main);">${item.result || 'Released'}</span></div>
              <div><strong>Tech / Tools:</strong> <span class="font-mono" style="color: var(--text-light);">${item.technologies || 'Godot, GDScript'}</span></div>
            </div>

            <div class="flex items-center gap-xs flex-wrap" style="margin-top: 16px;">
              ${renderPortfolioButtons(item)}
            </div>
          </div>
        </article>
      </div>
    `;
  } else {
    gridHtml = filteredItems.map((item, idx) => `
      <article class="card card-hover reveal-card stagger-${(idx % 6) + 1}" id="portfolio-item-${item.id}">
        <div class="card-media">
          ${item.image ? `
            <img src="${item.image}" alt="${item.title}" loading="lazy" />
          ` : `
            <div class="card-media-placeholder">
              ${getIcon("portfolio", 28)}
              <span>[ Portfolio Item Preview ]</span>
            </div>
          `}
        </div>
        <div class="card-body">
          <div class="flex items-center justify-between gap-xs">
            <span class="badge ${item.isFeatured ? 'badge-featured' : ''}">${item.category}</span>
            ${item.isFeatured ? '<span class="badge badge-featured">Featured</span>' : ''}
          </div>
          
          <h3 style="font-size: var(--text-xl); margin-top: 4px;">${item.title}</h3>
          <p style="font-size: var(--text-sm); line-height: 1.6; color: var(--text-muted);">${item.description}</p>
          
          <div style="background-color: var(--bg-surface-alt); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: var(--space-sm); margin-top: 8px; display: flex; flex-direction: column; gap: 4px; font-size: var(--text-xs);">
            <div><strong>Role:</strong> <span style="color: var(--text-main);">${item.role || 'Lead Creator'}</span></div>
            <div><strong>Result / Status:</strong> <span style="color: var(--text-main);">${item.result || 'Released'}</span></div>
            <div><strong>Tech / Tools:</strong> <span class="font-mono" style="color: var(--text-light);">${item.technologies || 'Godot, GDScript'}</span></div>
          </div>
        </div>

        <div class="card-footer">
          <div class="flex items-center gap-xs flex-wrap" style="width: 100%;">
            ${renderPortfolioButtons(item)}
          </div>
        </div>
      </article>
    `).join("");
  }

  return `
    <div class="portfolio-page-root">
      <section class="section" style="padding-top: var(--space-2xl);">
        <div class="container">
          
          <div class="section-header section-header-left reveal-init" style="margin-bottom: var(--space-xl);">
            <div class="badge" style="margin-bottom: var(--space-2xs);">PROFESSIONAL WORK & SHOWCASE</div>
            <h1>Work & Portfolio</h1>
            <p>A curated record of shipped game prototypes, Minecraft community maps, open-source programming tools, and video content production.</p>
          </div>

          <!-- Category Filter Tabs -->
          <div class="tabs reveal-init stagger-1" style="margin-bottom: var(--space-2xl);">
            ${categoryTabsHtml}
          </div>

          <!-- Portfolio Grid -->
          <div class="grid grid-cols-3 gap-lg scroll-reveal-grid">
            ${gridHtml}
          </div>

        </div>
      </section>
    </div>
  `;
}

export function initPortfolioViewEvents(reRenderCallback) {
  const catButtons = document.querySelectorAll(".portfolio-cat-btn");
  catButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      selectedPortfolioCategory = btn.getAttribute("data-category");
      if (reRenderCallback) reRenderCallback();
    });
  });
}

