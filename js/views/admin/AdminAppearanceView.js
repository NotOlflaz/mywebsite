/**
 * Admin Appearance & Comprehensive Theme Visual Control System
 * Full visual control over Colors, Background, Glows, Cards, Buttons, Typography,
 * Layout, Navbar, Footer, Animations, Decorative Shapes, Scroll Progress, and Presets.
 * Features live responsive preview (Desktop / Tablet / Mobile) and JSON theme export/import.
 */

import { store } from "../../store/state.js";
import { toast } from "../../components/Toast.js";
import { getIcon } from "../../utils/icons.js";

// Active Tab state inside Appearance view
let currentActiveTab = "presets";
let currentViewport = "desktop";

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ==========================================================================
   HELPER RENDERERS FOR CONTROLS
   ========================================================================== */

function renderColorRow(label, sublabel, pickerId, hexId, value, defaultVal) {
  const rawVal = value !== undefined && value !== null ? String(value) : (defaultVal || "#ffffff");
  const val = String(rawVal);
  return `
    <div class="theme-color-row" data-color-control="${pickerId}">
      <div>
        <strong style="font-size: var(--text-xs); color: var(--text-main);">${label}</strong>
        ${sublabel ? `<div class="text-xs text-muted">${sublabel}</div>` : ''}
      </div>
      <div class="theme-color-input-group">
        <input type="color" class="theme-color-picker" id="${pickerId}" value="${val.startsWith('#') && val.length === 7 ? val : '#38bdf8'}" />
        <input type="text" class="form-input theme-hex-input" id="${hexId}" value="${val}" spellcheck="false" />
        <button type="button" class="btn-text-action reset-color-btn" data-picker="${pickerId}" data-hex="${hexId}" data-default="${defaultVal}" title="Reset to default">
          ${getIcon('refresh', 12)}
        </button>
      </div>
    </div>
  `;
}

function renderSliderRow(label, inputId, valId, value, min, max, step, unit = "") {
  const numericVal = (value !== undefined && value !== null && !isNaN(parseFloat(value))) ? parseFloat(value) : min;
  return `
    <div class="theme-slider-group">
      <div class="theme-slider-header">
        <span style="font-weight: 600; color: var(--text-main);">${label}</span>
        <span class="theme-slider-val" id="${valId}">${numericVal}${unit}</span>
      </div>
      <input type="range" class="theme-slider-input" id="${inputId}" min="${min}" max="${max}" step="${step}" value="${numericVal}" data-unit="${unit}" data-val-id="${valId}" />
    </div>
  `;
}

/* ==========================================================================
   MAIN RENDER FUNCTION
   ========================================================================== */

export function renderAdminAppearanceView() {
  const app = store.getAppearance();
  const presets = store.getPresets();
  const currentPreset = app.themePreset || "default";
  const shapes = store.getDecorativeShapes();
  const lightPoints = store.getBackgroundLightPoints();

  return `
    <div class="admin-appearance-page">
      
      <!-- Top Page Header -->
      <div class="admin-page-header">
        <div class="admin-page-header-info">
          <h1>Visual Theme & Appearance Control System</h1>
          <p>Control every visual aspect of the Olflaz website in real time: colors, atmosphere, glows, typography, cards, buttons, navbar, animations, and background shapes.</p>
        </div>
        <div class="flex items-center gap-xs">
          <button type="button" class="btn btn-outline btn-sm" id="btn-export-theme" title="Export Theme JSON">
            ${getIcon('download', 13)} Export JSON
          </button>
          <label class="btn btn-outline btn-sm" style="cursor: pointer; margin: 0;" title="Import Theme JSON">
            ${getIcon('upload', 13)} Import JSON
            <input type="file" id="input-import-theme-file" accept=".json" style="display: none;" />
          </label>
          <button type="button" class="btn btn-danger btn-sm" id="btn-reset-entire-theme" title="Reset all theme settings">
            ${getIcon('trash', 13)} Reset All
          </button>
        </div>
      </div>

      <!-- LIVE RESPONSIVE PREVIEW SYSTEM -->
      <div class="form-section" style="margin-bottom: var(--space-xl);">
        <div class="form-section-header">
          <div class="form-section-title">
            <span class="flex items-center gap-xs">
              <span style="color: var(--accent-primary);">${getIcon('sparkles', 16)}</span>
              <span>Live Website Component Preview</span>
            </span>
          </div>
          
          <!-- Viewport Switcher -->
          <div class="flex items-center gap-2xs">
            <button type="button" class="theme-viewport-btn ${currentViewport === 'desktop' ? 'active' : ''}" data-viewport="desktop" title="Desktop View (100%)">
              Desktop
            </button>
            <button type="button" class="theme-viewport-btn ${currentViewport === 'tablet' ? 'active' : ''}" data-viewport="tablet" title="Tablet View (768px)">
              Tablet (768px)
            </button>
            <button type="button" class="theme-viewport-btn ${currentViewport === 'mobile' ? 'active' : ''}" data-viewport="mobile" title="Mobile View (380px)">
              Mobile (380px)
            </button>
          </div>
        </div>

        <div class="theme-preview-frame-wrapper">
          <div class="theme-preview-viewport is-${currentViewport}" id="theme-live-preview-box">
            <div style="background: var(--bg-page); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: var(--space-md); display: flex; flex-direction: column; gap: var(--space-md); position: relative; overflow: hidden;">
              
              <!-- Mock Header / Navbar -->
              <div style="background: var(--nav-bg, var(--bg-surface)); border-bottom: 1px solid rgba(255, 255, 255, var(--nav-border-opacity, 0.08)); border-radius: var(--radius-sm); padding: 8px 14px; display: flex; align-items: center; justify-content: space-between; height: var(--nav-height, 48px);">
                <div class="flex items-center gap-xs">
                  <strong style="font-size: var(--nav-logo-size, 16px); color: #ffffff;">Olflaz</strong>
                  <span class="badge" style="font-size: 9px;">CREATOR</span>
                </div>
                <div class="flex items-center gap-xs">
                  <span style="font-size: 11px; color: var(--nav-active-color, var(--accent-primary)); font-weight: 700; box-shadow: var(--glow-nav-active); padding: 2px 6px; border-radius: 4px;">Projects</span>
                  <span style="font-size: 11px; color: var(--nav-text-color, var(--text-muted));">Videos</span>
                  <span style="font-size: 11px; color: var(--nav-text-color, var(--text-muted));">About</span>
                </div>
              </div>

              <!-- Mock Hero Area -->
              <div style="padding: var(--space-md) 0; border-bottom: 1px solid var(--border-subtle);">
                <span class="badge" style="font-size: 10px; margin-bottom: 4px; background: var(--badge-bg); color: var(--badge-text);">MINECRAFT & GODOT DEVELOPER</span>
                <h1 style="font-size: var(--hero-font-size, 26px); font-weight: var(--hero-font-weight, 800); color: var(--heading-main-color, var(--text-main)); margin: 4px 0 8px 0; line-height: var(--hero-line-height, 1.25);">
                  Crafting Games & <span style="color: var(--accent-primary);">Digital Worlds</span>
                </h1>
                <p style="font-size: var(--body-font-size, 13px); color: var(--text-muted); line-height: var(--body-line-height, 1.6); margin-bottom: 12px;">
                  Indie game development in Godot 4 and creative custom mechanics for Minecraft.
                </p>
                <div class="flex items-center gap-xs flex-wrap">
                  <button type="button" class="btn btn-primary btn-sm">Primary CTA</button>
                  <button type="button" class="btn btn-secondary btn-sm">Secondary Action</button>
                  <button type="button" class="btn btn-outline btn-sm">Outline</button>
                </div>
              </div>

              <!-- Mock Card Grid -->
              <div class="grid grid-cols-3 gap-sm">
                <!-- Project Card -->
                <div class="card card-hover" style="padding: 10px; border-radius: var(--card-radius); background: var(--card-project-bg, var(--card-bg)); border: var(--card-border-width, 1px) solid var(--card-border);">
                  <div style="height: 60px; background: #000; border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-bottom: 6px; font-size: 10px; color: var(--text-light);">
                    [ Project Media ]
                  </div>
                  <span class="badge" style="font-size: 9px; align-self: flex-start;">Godot 4</span>
                  <h3 style="font-size: var(--card-title-size, 13px); margin-top: 4px; color: var(--text-main);">Shadow Realm</h3>
                  <p style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">2D action platformer.</p>
                </div>

                <!-- Video Card -->
                <div class="card card-hover" style="padding: 10px; border-radius: var(--card-radius); background: var(--card-video-bg, var(--card-bg)); border: var(--card-border-width, 1px) solid var(--card-border);">
                  <div style="height: 60px; background: #000; border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-bottom: 6px; font-size: 10px; color: var(--text-light);">
                    [ Video Thumbnail ]
                  </div>
                  <span class="badge badge-featured" style="font-size: 9px; align-self: flex-start;">Tutorial</span>
                  <h3 style="font-size: var(--card-title-size, 13px); margin-top: 4px; color: var(--text-main);">Godot 4 Mechanics</h3>
                  <p style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Custom player controllers.</p>
                </div>

                <!-- Featured Card -->
                <div class="card card-hover card-featured" style="padding: 10px; border-radius: var(--card-radius); background: var(--card-featured-bg, var(--card-bg)); border: var(--card-border-width, 1px) solid var(--accent-primary); box-shadow: var(--glow-card);">
                  <div class="flex items-center justify-between" style="margin-bottom: 4px;">
                    <span class="badge badge-featured" style="font-size: 9px;">SPOTLIGHT</span>
                    <span style="font-size: 9px; color: var(--accent-primary); font-family: var(--font-mono);">GODOT</span>
                  </div>
                  <h3 style="font-size: var(--card-title-size, 13px); color: var(--text-main);">Dimension Runner</h3>
                  <p style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Featured highlight release.</p>
                </div>
              </div>

              <!-- Mock Footer Area -->
              <div style="background: var(--footer-bg, #050608); border-top: 1px solid var(--footer-border, var(--border-color)); border-radius: var(--radius-sm); padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--footer-text-color, var(--text-muted));">
                <div>&copy; ${new Date().getFullYear()} Olflaz &bull; Developer & Creator</div>
                <div style="color: var(--footer-accent-color, var(--accent-primary)); font-weight: 600;">Built with Pure Vanilla CSS</div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- NAVIGATION TABS FOR 13 SECTIONS -->
      <nav class="theme-editor-nav" aria-label="Theme Editor Sections">
        <button type="button" class="theme-tab-btn ${currentActiveTab === 'presets' ? 'active' : ''}" data-tab="presets">
          ${getIcon('palette', 14)} Presets
        </button>
        <button type="button" class="theme-tab-btn ${currentActiveTab === 'colors' ? 'active' : ''}" data-tab="colors">
          ${getIcon('sparkles', 14)} Colors
        </button>
        <button type="button" class="theme-tab-btn ${currentActiveTab === 'background' ? 'active' : ''}" data-tab="background">
          ${getIcon('eye', 14)} Background
        </button>
        <button type="button" class="theme-tab-btn ${currentActiveTab === 'glows' ? 'active' : ''}" data-tab="glows">
          ${getIcon('sparkles', 14)} Glows & Effects
        </button>
        <button type="button" class="theme-tab-btn ${currentActiveTab === 'cards' ? 'active' : ''}" data-tab="cards">
          ${getIcon('projects', 14)} Cards
        </button>
        <button type="button" class="theme-tab-btn ${currentActiveTab === 'buttons' ? 'active' : ''}" data-tab="buttons">
          ${getIcon('gamepad', 14)} Buttons
        </button>
        <button type="button" class="theme-tab-btn ${currentActiveTab === 'typography' ? 'active' : ''}" data-tab="typography">
          ${getIcon('pencil', 14)} Typography
        </button>
        <button type="button" class="theme-tab-btn ${currentActiveTab === 'layout' ? 'active' : ''}" data-tab="layout">
          ${getIcon('settings', 14)} Layout & Spacing
        </button>
        <button type="button" class="theme-tab-btn ${currentActiveTab === 'navbar' ? 'active' : ''}" data-tab="navbar">
          ${getIcon('link', 14)} Navbar
        </button>
        <button type="button" class="theme-tab-btn ${currentActiveTab === 'footer' ? 'active' : ''}" data-tab="footer">
          ${getIcon('folder', 14)} Footer
        </button>
        <button type="button" class="theme-tab-btn ${currentActiveTab === 'animations' ? 'active' : ''}" data-tab="animations">
          ${getIcon('videos', 14)} Animations
        </button>
        <button type="button" class="theme-tab-btn ${currentActiveTab === 'shapes' ? 'active' : ''}" data-tab="shapes">
          ${getIcon('sparkles', 14)} Decorative Shapes
        </button>
        <button type="button" class="theme-tab-btn ${currentActiveTab === 'progress' ? 'active' : ''}" data-tab="progress">
          ${getIcon('arrowRight', 14)} Scroll Progress
        </button>
      </nav>

      <!-- 1. PRESETS TAB CONTENT -->
      <section class="theme-tab-content ${currentActiveTab === 'presets' ? 'active' : ''}" id="tab-content-presets">
        <div class="form-section">
          <div class="theme-section-header">
            <div class="theme-section-title">
              <span>Curated Aesthetic Presets</span>
            </div>
            <span class="badge">${currentPreset.toUpperCase()}</span>
          </div>

          <div class="grid grid-cols-3 gap-md" style="margin-bottom: var(--space-lg);">
            ${Object.entries(presets).map(([key, preset]) => `
              <div class="theme-preset-card ${currentPreset === key ? 'active' : ''}" data-preset-key="${key}">
                <div class="flex items-center justify-between">
                  <strong style="font-size: var(--text-sm); color: var(--text-main);">${preset.name}</strong>
                  <div style="width: 14px; height: 14px; border-radius: 50%; background: ${preset.accentPrimary || '#38bdf8'}; box-shadow: 0 0 8px ${preset.accentPrimary || '#38bdf8'};"></div>
                </div>
                <p class="text-xs text-muted" style="margin: 0; line-height: 1.5;">${preset.description || preset.desc || ''}</p>
                <button type="button" class="btn btn-secondary btn-sm" style="margin-top: 8px; width: 100%;">
                  Apply Preset
                </button>
              </div>
            `).join("")}
          </div>

          <div class="flex items-center justify-between gap-sm p-md bg-surface-alt rounded border">
            <div>
              <strong style="font-size: var(--text-sm);">Preset Actions</strong>
              <div class="text-xs text-muted">Save your current visual tweaks or revert back to original default look.</div>
            </div>
            <div class="flex gap-xs">
              <button type="button" class="btn btn-outline btn-sm" id="btn-save-as-custom">
                💾 Save as Custom
              </button>
              <button type="button" class="btn btn-secondary btn-sm" id="btn-revert-olflaz-dark">
                🔄 Reset to Olflaz Dark
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. COLORS TAB CONTENT -->
      <section class="theme-tab-content ${currentActiveTab === 'colors' ? 'active' : ''}" id="tab-content-colors">
        
        <!-- Core Colors -->
        <div class="form-section">
          <div class="theme-section-header">
            <div class="theme-section-title">Core Surfaces & Foundation Colors</div>
            <button type="button" class="btn btn-outline btn-sm reset-section-btn" data-section="colors">Reset Colors</button>
          </div>
          <div class="grid grid-cols-2 gap-sm">
            ${renderColorRow("Page Background", "Deep base canvas", "picker-bgPage", "hex-bgPage", app.bgPage, "#08090c")}
            ${renderColorRow("Secondary Background", "Alternative section background", "picker-bgPageAlt", "hex-bgPageAlt", app.bgPageAlt, "#0c0e13")}
            ${renderColorRow("Surface Color", "Base panel / container background", "picker-bgSurface", "hex-bgSurface", app.bgSurface, "#11141b")}
            ${renderColorRow("Elevated Surface", "Modal & dropdown overlay surfaces", "picker-bgSurfaceElevated", "hex-bgSurfaceElevated", app.bgSurfaceElevated, "#212737")}
            ${renderColorRow("Border Color", "Subtle divider lines & strokes", "picker-borderColor", "hex-borderColor", app.borderColor, "rgba(255, 255, 255, 0.08)")}
            ${renderColorRow("Border Subtle", "Very soft hairline boundaries", "picker-borderSubtle", "hex-borderSubtle", app.borderSubtle, "rgba(255, 255, 255, 0.04)")}
          </div>
        </div>

        <!-- Text Colors -->
        <div class="form-section">
          <div class="theme-section-header">
            <div class="theme-section-title">Typography & Text Contrast Hierarchy</div>
          </div>
          <div class="grid grid-cols-2 gap-sm">
            ${renderColorRow("Main Heading", "H1, H2, hero title and punchy headers", "picker-headingMainColor", "hex-headingMainColor", app.headingMainColor, "#f1f4f9")}
            ${renderColorRow("Secondary Heading", "H3, H4, section card titles", "picker-headingSecondaryColor", "hex-headingSecondaryColor", app.headingSecondaryColor, "#f1f4f9")}
            ${renderColorRow("Body Text", "Standard paragraphs & general reading text", "picker-textMain", "hex-textMain", app.textMain, "#f1f4f9")}
            ${renderColorRow("Muted Text", "Descriptions, meta details, and subtitles", "picker-textMuted", "hex-textMuted", app.textMuted, "#94a0b5")}
            ${renderColorRow("Disabled / Extra Muted", "Subdued captions and placeholders", "picker-textDisabled", "hex-textDisabled", app.textDisabled, "#4b5563")}
            ${renderColorRow("Link Text", "Hyperlinks and text action anchors", "picker-textLink", "hex-textLink", app.textLink, "#38bdf8")}
          </div>
        </div>

        <!-- Accent Colors -->
        <div class="form-section">
          <div class="theme-section-header">
            <div class="theme-section-title">Accent & Signature Palette</div>
          </div>
          <div class="grid grid-cols-2 gap-sm">
            ${renderColorRow("Primary Accent", "Electric cyan signature color for primary CTAs and active states", "picker-accentPrimary", "hex-accentPrimary", app.accentPrimary, "#38bdf8")}
            ${renderColorRow("Secondary Accent", "Gradients, secondary highlights and borders", "picker-accentSecondary", "hex-accentSecondary", app.accentSecondary, "#0ea5e9")}
            ${renderColorRow("Accent Hover", "Color when hovering over accented elements", "picker-accentHover", "hex-accentHover", app.accentHover, "#7dd3fc")}
            ${renderColorRow("Accent Active", "Pressed / clicked state for accent buttons", "picker-accentActive", "hex-accentActive", app.accentActive, "#0284c7")}
          </div>
        </div>

        <!-- Component Colors -->
        <div class="form-section">
          <div class="theme-section-header">
            <div class="theme-section-title">Component Colors</div>
          </div>
          <div class="grid grid-cols-2 gap-sm">
            ${renderColorRow("Button Background (Primary)", "Fill color for primary action button", "picker-btnBg", "hex-btnBg", app.btnBg, "#f1f4f9")}
            ${renderColorRow("Button Text (Primary)", "Text color for primary action button", "picker-btnText", "hex-btnText", app.btnText, "#08090c")}
            ${renderColorRow("Input Background", "Form input field fill", "picker-inputBg", "hex-inputBg", app.inputBg, "#161923")}
            ${renderColorRow("Input Focus Border", "Stroke color when input is focused", "picker-inputFocusBorder", "hex-inputFocusBorder", app.inputFocusBorder, "#38bdf8")}
            ${renderColorRow("Tag / Badge Background", "Pills and status tags fill", "picker-badgeBg", "hex-badgeBg", app.badgeBg, "#161923")}
            ${renderColorRow("Tag / Badge Text", "Text color for tags and badges", "picker-badgeText", "hex-badgeText", app.badgeText, "#94a0b5")}
          </div>
        </div>
      </section>

      <!-- 3. BACKGROUND TAB CONTENT -->
      <section class="theme-tab-content ${currentActiveTab === 'background' ? 'active' : ''}" id="tab-content-background">
        <div class="form-section">
          <div class="theme-section-header">
            <div class="theme-section-title">Background Atmosphere & Vignette</div>
            <button type="button" class="btn btn-outline btn-sm reset-section-btn" data-section="background">Reset Background</button>
          </div>

          <div class="grid grid-cols-2 gap-md" style="margin-bottom: var(--space-md);">
            <div class="form-group">
              <label class="form-label" for="theme-bg-atmosphere-glow">Atmosphere Glow Preset</label>
              <select class="form-select" id="theme-bg-atmosphere-glow">
                <option value="off" ${app.bgAtmosphereGlow === 'off' ? 'selected' : ''}>Off (Completely Solid Surface)</option>
                <option value="low" ${app.bgAtmosphereGlow === 'low' ? 'selected' : ''}>Low</option>
                <option value="subtle" ${app.bgAtmosphereGlow === 'subtle' || !app.bgAtmosphereGlow ? 'selected' : ''}>Subtle (Default)</option>
                <option value="medium" ${app.bgAtmosphereGlow === 'medium' ? 'selected' : ''}>Medium</option>
                <option value="high" ${app.bgAtmosphereGlow === 'high' ? 'selected' : ''}>High</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="theme-bg-pattern">Background Pattern</label>
              <select class="form-select" id="theme-bg-pattern">
                <option value="none" ${app.bgPattern === 'none' ? 'selected' : ''}>None (Smooth Dark Space)</option>
                <option value="grid" ${app.bgPattern === 'grid' ? 'selected' : ''}>Blueprint Grid (48px Subtle Grid)</option>
                <option value="dots" ${app.bgPattern === 'dots' ? 'selected' : ''}>Dot Matrix (28px Subtle Dots)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-sm" style="margin-bottom: var(--space-md);">
            ${renderSliderRow("Atmosphere Opacity", "slider-bgAtmosphereOpacity", "val-bgAtmosphereOpacity", app.bgAtmosphereOpacity !== undefined ? app.bgAtmosphereOpacity : 0.035, 0, 0.2, 0.005)}
            ${renderSliderRow("Vignette Intensity", "slider-bgVignetteIntensity", "val-bgVignetteIntensity", app.bgVignetteIntensity !== undefined ? app.bgVignetteIntensity : 0.3, 0, 0.9, 0.05)}
          </div>

          <div class="flex items-center gap-sm p-sm bg-surface-alt rounded border" style="margin-bottom: var(--space-md);">
            <label class="flex items-center gap-xs" style="cursor: pointer;">
              <input type="checkbox" id="check-bgGradientEnabled" ${app.bgGradientEnabled ? 'checked' : ''} />
              <strong style="font-size: var(--text-xs);">Enable Ambient Canvas Gradient</strong>
            </label>
          </div>

          <!-- Light Points Manager -->
          <div class="theme-section-header" style="margin-top: var(--space-lg);">
            <div class="theme-section-title">Atmospheric Light Sources (${lightPoints.length})</div>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-add-light-point">
              + Add Light Source
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: var(--space-xs);" id="light-points-list-container">
            ${lightPoints.map((lp, idx) => `
              <div class="theme-shape-item" id="light-point-${lp.id}">
                <div style="width: 24px; height: 24px; border-radius: 50%; background: ${lp.color || '#38bdf8'}; opacity: ${lp.opacity || 0.04}; box-shadow: 0 0 12px ${lp.color || '#38bdf8'};"></div>
                <div class="grid grid-cols-4 gap-xs" style="font-size: 11px;">
                  <div>Pos: <strong>${lp.posX}%, ${lp.posY}%</strong></div>
                  <div>Size: <strong>${lp.size}px</strong></div>
                  <div>Opacity: <strong>${lp.opacity}</strong></div>
                  <div>Blur: <strong>${lp.blur}px</strong></div>
                </div>
                <button type="button" class="btn-text-action btn-delete-light-point" data-id="${lp.id}" style="color: var(--danger-text);">
                  ${getIcon('trash', 14)}
                </button>
              </div>
            `).join("")}
          </div>
        </div>
      </section>

      <!-- 4. GLOWS & EFFECTS TAB CONTENT -->
      <section class="theme-tab-content ${currentActiveTab === 'glows' ? 'active' : ''}" id="tab-content-glows">
        <div class="form-section">
          <div class="theme-section-header">
            <div class="theme-section-title">Glow Intensity & Spread Controls</div>
            <button type="button" class="btn btn-outline btn-sm reset-section-btn" data-section="glows">Reset Glows</button>
          </div>

          <div class="form-group" style="margin-bottom: var(--space-md);">
            <label class="form-label" for="theme-glow-level">Global Glow Level Preset</label>
            <select class="form-select" id="theme-glow-level">
              <option value="off" ${app.glowLevel === 'off' ? 'selected' : ''}>Off (Zero Glow - Sharp Contours)</option>
              <option value="low" ${app.glowLevel === 'low' ? 'selected' : ''}>Low (Minimal Soft Silhouette)</option>
              <option value="subtle" ${app.glowLevel === 'subtle' || !app.glowLevel ? 'selected' : ''}>Subtle (Default - Elegant Dark)</option>
              <option value="medium" ${app.glowLevel === 'medium' ? 'selected' : ''}>Medium (Vibrant Highlights)</option>
              <option value="high" ${app.glowLevel === 'high' ? 'selected' : ''}>High (Punchy Energy)</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-sm">
            ${renderSliderRow("Global Glow Intensity", "slider-glowIntensity", "val-glowIntensity", app.glowIntensity || 1, 0, 3, 0.1)}
            ${renderSliderRow("Button Glow Blur", "slider-glowButtonBlur", "val-glowButtonBlur", app.glowButtonBlur || 18, 0, 50, 1, "px")}
            ${renderSliderRow("Card Glow Opacity", "slider-glowCardOpacity", "val-glowCardOpacity", app.glowCardOpacity || 0.06, 0, 0.3, 0.01)}
            ${renderSliderRow("Navigation Active Glow", "slider-glowNavActiveBlur", "val-glowNavActiveBlur", app.glowNavActiveBlur || 12, 0, 30, 1, "px")}
          </div>
        </div>
      </section>

      <!-- 5. CARDS TAB CONTENT -->
      <section class="theme-tab-content ${currentActiveTab === 'cards' ? 'active' : ''}" id="tab-content-cards">
        <div class="form-section">
          <div class="theme-section-header">
            <div class="theme-section-title">Global Card Dimensions & Hover Physics</div>
            <button type="button" class="btn btn-outline btn-sm reset-section-btn" data-section="cards">Reset Cards</button>
          </div>

          <div class="grid grid-cols-2 gap-sm" style="margin-bottom: var(--space-md);">
            ${renderSliderRow("Border Radius", "slider-cardRadius", "val-cardRadius", app.cardRadius || 10, 0, 30, 1, "px")}
            ${renderSliderRow("Border Width", "slider-cardBorderWidth", "val-cardBorderWidth", app.cardBorderWidth || 1, 0, 4, 1, "px")}
            ${renderSliderRow("Hover Lift Distance", "slider-cardHoverLift", "val-cardHoverLift", app.cardHoverLift || 3, 0, 12, 1, "px")}
            ${renderSliderRow("Hover Scale Factor", "slider-cardHoverScale", "val-cardHoverScale", app.cardHoverScale || 1.0, 1.0, 1.05, 0.005)}
            ${renderSliderRow("Image Hover Zoom", "slider-cardImageZoom", "val-cardImageZoom", app.cardImageZoom || 1.025, 1.0, 1.1, 0.005)}
            ${renderSliderRow("Card Opacity", "slider-cardOpacity", "val-cardOpacity", app.cardOpacity || 1, 0.5, 1, 0.05)}
          </div>

          <div class="theme-section-header" style="margin-top: var(--space-md);">
            <div class="theme-section-title">Card Type Surface Overrides</div>
          </div>
          <div class="grid grid-cols-2 gap-sm">
            ${renderColorRow("Global Card Background", "Default surface for all cards", "picker-cardBg", "hex-cardBg", app.cardBg, "#11141b")}
            ${renderColorRow("Project Cards Background", "Custom tint for project catalog cards", "picker-cardProjectBg", "hex-cardProjectBg", app.cardProjectBg, "#11141b")}
            ${renderColorRow("Video Cards Background", "Custom tint for YouTube video cards", "picker-cardVideoBg", "hex-cardVideoBg", app.cardVideoBg, "#11141b")}
            ${renderColorRow("Featured Cards Background", "Custom tint for featured spotlight cards", "picker-cardFeaturedBg", "hex-cardFeaturedBg", app.cardFeaturedBg, "#161923")}
          </div>
        </div>
      </section>

      <!-- 6. BUTTONS TAB CONTENT -->
      <section class="theme-tab-content ${currentActiveTab === 'buttons' ? 'active' : ''}" id="tab-content-buttons">
        <div class="form-section">
          <div class="theme-section-header">
            <div class="theme-section-title">Button Metrics & Tactile Physics</div>
            <button type="button" class="btn btn-outline btn-sm reset-section-btn" data-section="buttons">Reset Buttons</button>
          </div>

          <div class="grid grid-cols-2 gap-sm">
            ${renderSliderRow("Button Border Radius", "slider-btnRadius", "val-btnRadius", app.btnRadius || 6, 0, 30, 1, "px")}
            ${renderSliderRow("Border Width", "slider-btnBorderWidth", "val-btnBorderWidth", app.btnBorderWidth || 1, 0, 3, 1, "px")}
            ${renderSliderRow("Hover Lift Distance", "slider-btnHoverLift", "val-btnHoverLift", app.btnHoverLift || 2, 0, 8, 1, "px")}
            ${renderSliderRow("Hover Scale Factor", "slider-btnHoverScale", "val-btnHoverScale", app.btnHoverScale || 1.01, 1.0, 1.06, 0.005)}
            ${renderSliderRow("Click Press-Down Scale", "slider-btnActiveScale", "val-btnActiveScale", app.btnActiveScale || 0.985, 0.92, 1.0, 0.005)}
            ${renderSliderRow("Transition Speed", "slider-btnTransitionSpeed", "val-btnTransitionSpeed", app.btnTransitionSpeed || 140, 50, 400, 10, "ms")}
          </div>
        </div>
      </section>

      <!-- 7. TYPOGRAPHY TAB CONTENT -->
      <section class="theme-tab-content ${currentActiveTab === 'typography' ? 'active' : ''}" id="tab-content-typography">
        <div class="form-section">
          <div class="theme-section-header">
            <div class="theme-section-title">Headings & Body Typography Hierarchy</div>
            <button type="button" class="btn btn-outline btn-sm reset-section-btn" data-section="typography">Reset Typography</button>
          </div>

          <div class="grid grid-cols-2 gap-sm" style="margin-bottom: var(--space-md);">
            ${renderSliderRow("Hero Title Size (H1)", "slider-heroFontSize", "val-heroFontSize", app.heroFontSize || 44, 28, 64, 1, "px")}
            ${renderSliderRow("Section Heading Size (H2)", "slider-sectionFontSize", "val-sectionFontSize", app.sectionFontSize || 24, 18, 36, 1, "px")}
            ${renderSliderRow("Card Title Size (H3)", "slider-cardTitleSize", "val-cardTitleSize", app.cardTitleSize || 20, 14, 28, 1, "px")}
            ${renderSliderRow("Body Text Size", "slider-bodyFontSize", "val-bodyFontSize", app.bodyFontSize || 16, 12, 20, 1, "px")}
          </div>

          <div class="grid grid-cols-2 gap-md">
            <div class="form-group">
              <label class="form-label" for="theme-heading-weight">Hero & Main Heading Weight</label>
              <select class="form-select" id="theme-heading-weight">
                <option value="600" ${app.heroFontWeight === '600' ? 'selected' : ''}>Semi-Bold (600)</option>
                <option value="700" ${app.heroFontWeight === '700' ? 'selected' : ''}>Bold (700)</option>
                <option value="800" ${app.heroFontWeight === '800' || !app.heroFontWeight ? 'selected' : ''}>Extra Bold (800 - Default)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="theme-body-line-height">Body Line Height</label>
              <select class="form-select" id="theme-body-line-height">
                <option value="1.4" ${app.bodyLineHeight === 1.4 ? 'selected' : ''}>Compact (1.4)</option>
                <option value="1.65" ${app.bodyLineHeight === 1.65 || !app.bodyLineHeight ? 'selected' : ''}>Normal / Balanced (1.65)</option>
                <option value="1.8" ${app.bodyLineHeight === 1.8 ? 'selected' : ''}>Spacious (1.8)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <!-- 8. LAYOUT & SPACING TAB CONTENT -->
      <section class="theme-tab-content ${currentActiveTab === 'layout' ? 'active' : ''}" id="tab-content-layout">
        <div class="form-section">
          <div class="theme-section-header">
            <div class="theme-section-title">Layout Constraints & Container Scaling</div>
            <button type="button" class="btn btn-outline btn-sm reset-section-btn" data-section="layout">Reset Layout</button>
          </div>

          <div class="grid grid-cols-2 gap-sm">
            ${renderSliderRow("Container Max Width", "slider-containerMaxWidth", "val-containerMaxWidth", app.containerMaxWidth || 1200, 960, 1600, 20, "px")}
            ${renderSliderRow("Section Padding Top & Bottom", "slider-sectionPaddingY", "val-sectionPaddingY", app.sectionPaddingY || 64, 24, 120, 4, "px")}
            ${renderSliderRow("Grid Column Gap", "slider-gridGap", "val-gridGap", app.gridGap || 24, 8, 48, 2, "px")}
            ${renderSliderRow("Container Side Padding", "slider-containerPaddingX", "val-containerPaddingX", app.containerPaddingX || 24, 12, 48, 2, "px")}
          </div>
        </div>
      </section>

      <!-- 9. NAVBAR TAB CONTENT -->
      <section class="theme-tab-content ${currentActiveTab === 'navbar' ? 'active' : ''}" id="tab-content-navbar">
        <div class="form-section">
          <div class="theme-section-header">
            <div class="theme-section-title">Navbar Styling & Elevation</div>
            <button type="button" class="btn btn-outline btn-sm reset-section-btn" data-section="navbar">Reset Navbar</button>
          </div>

          <div class="grid grid-cols-2 gap-sm" style="margin-bottom: var(--space-md);">
            ${renderSliderRow("Navbar Height", "slider-navHeight", "val-navHeight", app.navHeight || 64, 48, 90, 2, "px")}
            ${renderSliderRow("Logo Font Size", "slider-navLogoSize", "val-navLogoSize", app.navLogoSize || 18, 14, 28, 1, "px")}
            ${renderSliderRow("Backdrop Blur", "slider-navBlur", "val-navBlur", app.navBlur || 12, 0, 30, 1, "px")}
            ${renderSliderRow("Border Opacity", "slider-navBorderOpacity", "val-navBorderOpacity", app.navBorderOpacity || 0.08, 0, 0.4, 0.02)}
          </div>

          <div class="grid grid-cols-2 gap-sm">
            ${renderColorRow("Navbar Background Color", "Base fill color behind blur", "picker-navBg", "hex-navBg", app.navBg, "rgba(8, 9, 12, 0.92)")}
            ${renderColorRow("Link Color (Normal)", "Unselected nav links", "picker-navTextColor", "hex-navTextColor", app.navTextColor, "#94a0b5")}
            ${renderColorRow("Link Color (Active)", "Currently selected page pill", "picker-navActiveColor", "hex-navActiveColor", app.navActiveColor, "#38bdf8")}
            ${renderColorRow("Link Color (Hover)", "Mouse hover color", "picker-navHoverColor", "hex-navHoverColor", app.navHoverColor, "#ffffff")}
          </div>
        </div>
      </section>

      <!-- 10. FOOTER TAB CONTENT -->
      <section class="theme-tab-content ${currentActiveTab === 'footer' ? 'active' : ''}" id="tab-content-footer">
        <div class="form-section">
          <div class="theme-section-header">
            <div class="theme-section-title">Footer Visual Styling</div>
            <button type="button" class="btn btn-outline btn-sm reset-section-btn" data-section="footer">Reset Footer</button>
          </div>

          <div class="grid grid-cols-2 gap-sm" style="margin-bottom: var(--space-md);">
            ${renderSliderRow("Vertical Padding", "slider-footerSpacingY", "val-footerSpacingY", app.footerSpacingY || 48, 20, 100, 4, "px")}
          </div>

          <div class="grid grid-cols-2 gap-sm">
            ${renderColorRow("Footer Background", "Deep baseline grounding fill", "picker-footerBg", "hex-footerBg", app.footerBg, "#0c0e13")}
            ${renderColorRow("Footer Column Title Color", "Section headings like Navigation & Connect", "picker-footerHeadingColor", "hex-footerHeadingColor", app.footerHeadingColor, "#ffffff")}
            ${renderColorRow("Footer Link Color", "Subordinate navigation link text", "picker-footerLinkColor", "hex-footerLinkColor", app.footerLinkColor, "#94a0b5")}
            ${renderColorRow("Footer Accent Color", "Hover highlight color", "picker-footerAccentColor", "hex-footerAccentColor", app.footerAccentColor, "#38bdf8")}
          </div>
        </div>
      </section>

      <!-- 11. ANIMATIONS TAB CONTENT -->
      <section class="theme-tab-content ${currentActiveTab === 'animations' ? 'active' : ''}" id="tab-content-animations">
        <div class="form-section">
          <div class="theme-section-header">
            <div class="theme-section-title">Directional Scroll Reveal & Hover Physics</div>
            <button type="button" class="btn btn-outline btn-sm reset-section-btn" data-section="animations">Reset Animations</button>
          </div>

          <div class="flex items-center gap-md p-md bg-surface-alt rounded border" style="margin-bottom: var(--space-md);">
            <label class="flex items-center gap-xs" style="cursor: pointer;">
              <input type="checkbox" id="check-scrollRevealEnabled" ${app.scrollRevealEnabled !== false ? 'checked' : ''} />
              <strong style="font-size: var(--text-sm);">Enable Directional Scroll Reveal Engine</strong>
            </label>
            <label class="flex items-center gap-xs" style="cursor: pointer;">
              <input type="checkbox" id="check-hoverAnimationsEnabled" ${app.hoverAnimationsEnabled !== false ? 'checked' : ''} />
              <strong style="font-size: var(--text-sm);">Enable Card & Button Hover Lift</strong>
            </label>
          </div>

          <div class="grid grid-cols-2 gap-sm" style="margin-bottom: var(--space-md);">
            ${renderSliderRow("Scroll Slide Distance", "slider-scrollSlideDistance", "val-scrollSlideDistance", app.scrollSlideDistance || 80, 20, 160, 5, "px")}
            ${renderSliderRow("Scroll Animation Duration", "slider-scrollDuration", "val-scrollDuration", app.scrollDuration || 800, 300, 1500, 50, "ms")}
            ${renderSliderRow("Hover Lift Amount", "slider-animHoverLift", "val-animHoverLift", app.animHoverLift || 6, 0, 16, 1, "px")}
            ${renderSliderRow("Hover Scale Factor", "slider-animHoverScale", "val-animHoverScale", app.animHoverScale || 1.02, 1.0, 1.08, 0.005)}
          </div>
        </div>
      </section>

      <!-- 12. DECORATIVE SHAPES TAB CONTENT -->
      <section class="theme-tab-content ${currentActiveTab === 'shapes' ? 'active' : ''}" id="tab-content-shapes">
        <div class="form-section">
          <div class="theme-section-header">
            <div class="theme-section-title">Atmospheric Background Shapes (${shapes.length})</div>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-add-shape">
              + Add Decorative Shape
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: var(--space-xs);" id="shapes-list-container">
            ${shapes.map((shape) => `
              <div class="theme-shape-item ${shape.enabled === false ? 'is-hidden' : ''}" id="shape-item-${shape.id}">
                <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 4px; color: ${shape.color || 'var(--accent-primary)'}; font-size: 11px;">
                  ${shape.type || 'Circle'}
                </div>
                <div class="grid grid-cols-4 gap-xs" style="font-size: 11px;">
                  <div>Pos: <strong>${shape.posX}%, ${shape.posY}%</strong></div>
                  <div>Size: <strong>${shape.width}x${shape.height}px</strong></div>
                  <div>Opacity: <strong>${shape.opacity}</strong></div>
                  <div>Blur: <strong>${shape.blur}px</strong></div>
                </div>
                <div class="flex items-center gap-xs">
                  <button type="button" class="btn-text-action btn-toggle-shape" data-id="${shape.id}" title="${shape.enabled ? 'Hide Shape' : 'Show Shape'}">
                    ${getIcon(shape.enabled ? 'eye' : 'eyeOff', 14)}
                  </button>
                  <button type="button" class="btn-text-action btn-delete-shape" data-id="${shape.id}" style="color: var(--danger-text);" title="Delete Shape">
                    ${getIcon('trash', 14)}
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </section>

      <!-- 13. SCROLL PROGRESS TAB CONTENT -->
      <section class="theme-tab-content ${currentActiveTab === 'progress' ? 'active' : ''}" id="tab-content-progress">
        <div class="form-section">
          <div class="theme-section-header">
            <div class="theme-section-title">Vertical Scroll Progress Bar Indicator</div>
            <button type="button" class="btn btn-outline btn-sm reset-section-btn" data-section="progress">Reset Scroll Progress</button>
          </div>

          <div class="flex items-center gap-md p-md bg-surface-alt rounded border" style="margin-bottom: var(--space-md);">
            <label class="flex items-center gap-xs" style="cursor: pointer;">
              <input type="checkbox" id="check-scrollProgressEnabled" ${app.scrollProgressEnabled !== false ? 'checked' : ''} />
              <strong style="font-size: var(--text-sm);">Enable Scroll Progress Indicator</strong>
            </label>
            <label class="flex items-center gap-xs" style="cursor: pointer;">
              <input type="checkbox" id="check-scrollProgressMobile" ${app.scrollProgressMobile !== false ? 'checked' : ''} />
              <strong style="font-size: var(--text-sm);">Visible on Mobile Screens</strong>
            </label>
          </div>

          <div class="grid grid-cols-2 gap-sm" style="margin-bottom: var(--space-md);">
            ${renderSliderRow("Bar Width", "slider-scrollProgressWidth", "val-scrollProgressWidth", app.scrollProgressWidth || 3, 1, 10, 1, "px")}
            ${renderSliderRow("Right Offset", "slider-scrollProgressRight", "val-scrollProgressRight", app.scrollProgressRight || 10, 2, 30, 1, "px")}
            ${renderSliderRow("Bar Height (Max)", "slider-scrollProgressHeight", "val-scrollProgressHeight", app.scrollProgressHeight || 180, 80, 350, 10, "px")}
            ${renderSliderRow("Opacity", "slider-scrollProgressOpacity", "val-scrollProgressOpacity", app.scrollProgressOpacity !== undefined ? app.scrollProgressOpacity : 1, 0.2, 1, 0.05)}
          </div>

          <div class="grid grid-cols-2 gap-sm">
            ${renderColorRow("Progress Fill Color", "Color of the progressing bar", "picker-scrollProgressColor", "hex-scrollProgressColor", app.scrollProgressColor, "#38bdf8")}
            ${renderColorRow("Progress Glow Color", "Soft ambient aura around bar", "picker-scrollProgressGlow", "hex-scrollProgressGlow", app.scrollProgressGlow, "rgba(56, 189, 248, 0.3)")}
          </div>
        </div>
      </section>

      <!-- BOTTOM SAVE & PERSISTENCE BAR -->
      <div class="admin-sticky-bar">
        <div class="admin-sticky-bar-left">
          <span style="color: var(--status-active-text);">${getIcon('sparkles', 14)}</span>
          <span>Theme and appearance tweaks are active live and saved locally.</span>
        </div>
        <div class="admin-sticky-bar-right">
          <button type="button" class="btn btn-outline" id="btn-revert-all-changes">
            Discard Changes
          </button>
          <button type="button" class="btn btn-primary" id="btn-save-all-theme">
            💾 Save Theme Settings
          </button>
        </div>
      </div>

    </div>
  `;
}

/* ==========================================================================
   EVENT INITIALIZATION AND LIVE STATE BINDING
   ========================================================================== */

export function initAdminAppearanceEvents(reRenderCallback) {
  
  // 1. TAB SWITCHING
  document.querySelectorAll(".theme-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tabKey = btn.getAttribute("data-tab");
      currentActiveTab = tabKey;
      document.querySelectorAll(".theme-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      document.querySelectorAll(".theme-tab-content").forEach(content => {
        content.classList.remove("active");
        if (content.id === `tab-content-${tabKey}`) {
          content.classList.add("active");
        }
      });
    });
  });

  // 2. VIEWPORT TOGGLE
  document.querySelectorAll(".theme-viewport-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const vp = btn.getAttribute("data-viewport");
      currentViewport = vp;
      document.querySelectorAll(".theme-viewport-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const previewBox = document.getElementById("theme-live-preview-box");
      if (previewBox) {
        previewBox.className = `theme-preview-viewport is-${vp}`;
      }
    });
  });

  // 3. COLOR PICKER & HEX INPUT BINDINGS
  const setupColorBindings = () => {
    document.querySelectorAll("[data-color-control]").forEach(row => {
      const picker = row.querySelector(".theme-color-picker");
      const hexInput = row.querySelector(".theme-hex-input");
      const resetBtn = row.querySelector(".reset-color-btn");

      if (!picker || !hexInput) return;

      const apply = (val) => {
        if (!val.startsWith("#") && !val.startsWith("rgb") && val.length === 6) val = "#" + val;
        picker.value = val.startsWith("#") && val.length === 7 ? val : "#38bdf8";
        hexInput.value = val;

        const propKey = picker.id.replace("picker-", "");
        const updateObj = {};
        updateObj[propKey] = val;
        store.updateAppearance(updateObj);
      };

      picker.addEventListener("input", (e) => apply(e.target.value));
      hexInput.addEventListener("input", (e) => {
        if (e.target.value.length >= 3) apply(e.target.value);
      });

      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          const defVal = resetBtn.getAttribute("data-default");
          if (defVal) apply(defVal);
        });
      }
    });
  };
  setupColorBindings();

  // 4. RANGE SLIDER BINDINGS
  document.querySelectorAll(".theme-slider-input").forEach(slider => {
    slider.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      const unit = slider.getAttribute("data-unit") || "";
      const valId = slider.getAttribute("data-val-id");
      const valEl = document.getElementById(valId);
      if (valEl) valEl.textContent = `${val}${unit}`;

      const propKey = slider.id.replace("slider-", "");
      const updateObj = {};
      updateObj[propKey] = val;
      store.updateAppearance(updateObj);
    });
  });

  // 5. DROPDOWNS & SELECT BINDINGS
  const bindSelect = (id, propKey) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", (e) => {
        const val = e.target.value;
        const updateObj = {};
        updateObj[propKey] = isNaN(val) ? val : parseFloat(val);
        store.updateAppearance(updateObj);
      });
    }
  };
  bindSelect("theme-glow-level", "glowLevel");
  bindSelect("theme-heading-weight", "heroFontWeight");
  bindSelect("theme-bg-pattern", "bgPattern");
  bindSelect("theme-bg-atmosphere-glow", "bgAtmosphereGlow");
  bindSelect("theme-body-line-height", "bodyLineHeight");

  // 6. CHECKBOX BINDINGS
  const bindCheckbox = (id, propKey) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", (e) => {
        const updateObj = {};
        updateObj[propKey] = e.target.checked;
        store.updateAppearance(updateObj);
      });
    }
  };
  bindCheckbox("check-bgGradientEnabled", "bgGradientEnabled");
  bindCheckbox("check-scrollRevealEnabled", "scrollRevealEnabled");
  bindCheckbox("check-hoverAnimationsEnabled", "hoverAnimationsEnabled");
  bindCheckbox("check-scrollProgressEnabled", "scrollProgressEnabled");
  bindCheckbox("check-scrollProgressMobile", "scrollProgressMobile");

  // 7. PRESET CARD APPLY
  document.querySelectorAll(".theme-preset-card").forEach(card => {
    card.addEventListener("click", () => {
      const key = card.getAttribute("data-preset-key");
      store.applyThemePreset(key);
      toast.success(`Preset applied: ${key}`);
      if (reRenderCallback) reRenderCallback();
    });
  });

  // 8. PRESET BUTTONS
  const btnSaveCustom = document.getElementById("btn-save-as-custom");
  if (btnSaveCustom) {
    btnSaveCustom.addEventListener("click", () => {
      store.updateAppearance({ themePreset: "custom" });
      toast.success("Theme saved as Custom preset!");
      if (reRenderCallback) reRenderCallback();
    });
  }

  const btnRevertOlflaz = document.getElementById("btn-revert-olflaz-dark");
  if (btnRevertOlflaz) {
    btnRevertOlflaz.addEventListener("click", () => {
      store.applyThemePreset("default");
      toast.info("Reverted to Olflaz Dark default.");
      if (reRenderCallback) reRenderCallback();
    });
  }

  // 9. SECTION RESETS
  document.querySelectorAll(".reset-section-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const section = btn.getAttribute("data-section");
      store.resetThemeSection(section);
      toast.info(`Reset ${section} settings to default.`);
      if (reRenderCallback) reRenderCallback();
    });
  });

  // 10. RESET ENTIRE THEME
  const btnResetEntire = document.getElementById("btn-reset-entire-theme");
  if (btnResetEntire) {
    btnResetEntire.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset the ENTIRE theme to the original Olflaz Dark look? Your project/video content will NOT be touched.")) {
        store.resetEntireTheme();
        toast.success("Entire theme reset to Olflaz Dark default!");
        if (reRenderCallback) reRenderCallback();
      }
    });
  }

  // 11. EXPORT / IMPORT THEME JSON
  const btnExport = document.getElementById("btn-export-theme");
  if (btnExport) {
    btnExport.addEventListener("click", () => {
      const jsonStr = store.exportThemeJSON();
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `olflaz_theme_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Theme JSON exported!");
    });
  }

  const importFileInput = document.getElementById("input-import-theme-file");
  if (importFileInput) {
    importFileInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const res = store.importThemeJSON(ev.target.result);
          if (res.success) {
            toast.success("Theme JSON imported successfully!");
            if (reRenderCallback) reRenderCallback();
          } else {
            toast.error(res.error || "Failed to import theme.");
          }
        } catch (err) {
          toast.error("Invalid JSON file.");
        }
      };
      reader.readAsText(file);
    });
  }

  // 12. SHAPE ACTIONS (Add, Toggle, Delete)
  const btnAddShape = document.getElementById("btn-add-shape");
  if (btnAddShape) {
    btnAddShape.addEventListener("click", () => {
      const newShape = store.addDecorativeShape({
        type: "circle",
        posX: Math.floor(Math.random() * 80) + 10,
        posY: Math.floor(Math.random() * 80) + 10,
        width: 160,
        height: 160,
        rotation: 0,
        opacity: 0.04,
        blur: 40,
        color: "#38bdf8",
        enabled: true
      });
      toast.success("New decorative shape added!");
      if (reRenderCallback) reRenderCallback();
    });
  }

  document.querySelectorAll(".btn-toggle-shape").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      store.toggleDecorativeShape(id);
      if (reRenderCallback) reRenderCallback();
    });
  });

  document.querySelectorAll(".btn-delete-shape").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      store.deleteDecorativeShape(id);
      toast.info("Shape deleted.");
      if (reRenderCallback) reRenderCallback();
    });
  });

  // 13. LIGHT POINT ACTIONS (Add, Delete)
  const btnAddLightPoint = document.getElementById("btn-add-light-point");
  if (btnAddLightPoint) {
    btnAddLightPoint.addEventListener("click", () => {
      store.addBackgroundLightPoint({
        color: "#38bdf8",
        opacity: 0.03,
        blur: 100,
        size: 400,
        posX: 50,
        posY: 50
      });
      toast.success("Atmospheric light source added!");
      if (reRenderCallback) reRenderCallback();
    });
  }

  document.querySelectorAll(".btn-delete-light-point").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      store.deleteBackgroundLightPoint(id);
      toast.info("Light source removed.");
      if (reRenderCallback) reRenderCallback();
    });
  });

  // 14. SAVE ALL BUTTON
  const btnSaveAll = document.getElementById("btn-save-all-theme");
  if (btnSaveAll) {
    btnSaveAll.addEventListener("click", () => {
      toast.success("All theme settings persisted and active on the website!");
    });
  }

  const btnRevertAll = document.getElementById("btn-revert-all-changes");
  if (btnRevertAll) {
    btnRevertAll.addEventListener("click", () => {
      if (reRenderCallback) reRenderCallback();
      toast.info("View refreshed with saved theme settings.");
    });
  }
}
