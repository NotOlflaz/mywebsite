/**
 * Public Portfolio Page View
 * Categorized showcase: Game Development, Minecraft, Programming, Content Creation, Other Projects.
 */

import { store } from "../../store/state.js";
import { getIcon } from "../../utils/icons.js";

let selectedPortfolioCategory = "All";

export function renderPortfolioView() {
  const portfolioItems = store.getPortfolio();

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

  const itemsGridHtml = filteredItems.length > 0 ? filteredItems.map((item, idx) => `
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
        ${item.links ? `
          <a href="${item.links}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm btn-block">
            View Project / Resource ↗
          </a>
        ` : `
          <span class="text-xs text-muted">Internal Case Study</span>
        `}
      </div>
    </article>
  `).join("") : `
    <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-3xl); background-color: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: var(--radius-lg);">
      <div class="empty-state-icon">${getIcon("portfolio", 32)}</div>
      <h3 style="margin-top: 8px;">No portfolio entries found in this category</h3>
      <p style="margin-top: 8px;">Switch tabs or create new portfolio entries in the Admin CMS.</p>
    </div>
  `;

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
            ${itemsGridHtml}
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
