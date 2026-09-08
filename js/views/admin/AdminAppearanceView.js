/**
 * Admin Theme & Visual Appearance Editor View
 * Features: Curated Presets (Olflaz Dark, Pure Black, Dark Minimal, Custom),
 * Live Interactive Component Preview Card, Color Pickers & Hex Editors,
 * Atmospheric Glow & Gradient Controls, Typography Weights, and Real-time Persistence.
 */

import { store } from "../../store/state.js";
import { toast } from "../../components/Toast.js";
import { getIcon } from "../../utils/icons.js";

const PRESETS = {
  "default": {
    name: "Olflaz Dark (Default)",
    desc: "Signature dark charcoal surfaces with Electric Cyan accents & calm ambient glow.",
    accentColor: "cyan",
    accentPrimaryHex: "#38bdf8",
    accentSecondaryHex: "#0ea5e9",
    bgPage: "#08090c",
    bgSurface: "#11141b",
    bgSurfaceAlt: "#161923",
    borderColor: "rgba(255, 255, 255, 0.08)",
    textMain: "#f1f4f9",
    textMuted: "#94a0b5",
    textLight: "#5f687a",
    btnTextColor: "#08090c",
    glowLevel: "subtle",
    headingWeight: "700",
    bgAtmosphereGlow: "subtle",
    bgPattern: "none",
    cardStyle: "solid"
  },
  "pure-black": {
    name: "Pure Black (OLED)",
    desc: "True black background with deep surfaces and crisp high-contrast text.",
    accentColor: "cyan",
    accentPrimaryHex: "#38bdf8",
    accentSecondaryHex: "#0284c7",
    bgPage: "#000000",
    bgSurface: "#0a0a0a",
    bgSurfaceAlt: "#121212",
    borderColor: "rgba(255, 255, 255, 0.12)",
    textMain: "#ffffff",
    textMuted: "#a1a1aa",
    textLight: "#52525b",
    btnTextColor: "#000000",
    glowLevel: "subtle",
    headingWeight: "800",
    bgAtmosphereGlow: "low",
    bgPattern: "none",
    cardStyle: "solid"
  },
  "dark-minimal": {
    name: "Dark Minimal",
    desc: "Soft obsidian aesthetic with zero glow highlights and subtle slate borders.",
    accentColor: "emerald",
    accentPrimaryHex: "#34d399",
    accentSecondaryHex: "#059669",
    bgPage: "#0d0f12",
    bgSurface: "#15181e",
    bgSurfaceAlt: "#1c2028",
    borderColor: "rgba(255, 255, 255, 0.06)",
    textMain: "#f3f4f6",
    textMuted: "#9ca3af",
    textLight: "#6b7280",
    btnTextColor: "#0d0f12",
    glowLevel: "off",
    headingWeight: "600",
    bgAtmosphereGlow: "off",
    bgPattern: "none",
    cardStyle: "solid"
  }
};

export function renderAdminAppearanceView() {
  const appearance = store.getAppearance();
  const currentPreset = appearance.themePreset || "default";

  return `
    <div class="admin-appearance-page">
      
      <!-- Page Header -->
      <div class="admin-page-header">
        <div class="admin-page-header-info">
          <h1>Theme & Appearance Editor</h1>
          <p>Customize the website visual identity, dark color palette, atmospheric glow, typography, and preview all UI elements in real time.</p>
        </div>
        <a href="#/" target="_blank" class="btn btn-secondary btn-sm">
          ${getIcon('eye', 13)} Preview Live Site ↗
        </a>
      </div>

      <!-- 1. LIVE INTERACTIVE THEME PREVIEW CARD -->
      <div class="form-section" style="margin-bottom: var(--space-xl); position: sticky; top: var(--header-height); z-index: 10; backdrop-filter: blur(12px);">
        <div class="form-section-header">
          <div class="form-section-title">
            <span class="flex items-center gap-xs">
              <span class="text-primary">${getIcon('sparkles', 16)}</span>
              <span>Live Interactive Component Preview</span>
            </span>
          </div>
          <span class="text-xs text-muted">Updates in real time</span>
        </div>
        <div class="form-section-body" id="theme-live-preview-box">
          <div style="padding: var(--space-lg); background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: var(--space-md);">
            
            <div class="flex items-center justify-between gap-md flex-wrap">
              <div>
                <span class="badge" style="font-size: 10px; margin-bottom: 4px;">ACTIVE PREVIEW</span>
                <h2 style="font-size: var(--text-xl); color: var(--text-main); font-weight: var(--font-weight-heading, 700); margin: 0;">
                  Olflaz <span style="color: var(--accent-primary);">Game Studio</span>
                </h2>
              </div>

              <!-- Active Navigation Pill -->
              <div class="tabs" style="padding: 2px;">
                <button type="button" class="tab-btn active" style="font-size: 11px;">Active Tab</button>
                <button type="button" class="tab-btn" style="font-size: 11px;">Inactive Tab</button>
              </div>
            </div>

            <p style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.5; margin: 0;">
              Crafting high-octane indie games with Godot 4 and sharing custom Minecraft survival mechanics.
            </p>

            <div class="grid grid-cols-2 gap-sm">
              <!-- Standard Card -->
              <div style="background: var(--bg-surface-alt); padding: var(--space-sm); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                <span class="text-xs text-muted font-bold">Standard Card</span>
                <div style="font-size: 11px; color: var(--text-light); margin-top: 2px;">Default surface styling</div>
              </div>

              <!-- Featured Card -->
              <div style="background: var(--bg-surface-alt); padding: var(--space-sm); border-radius: var(--radius-sm); border: 1px solid var(--accent-primary); box-shadow: 0 0 12px var(--accent-surface);">
                <div class="flex items-center justify-between">
                  <span class="badge badge-featured" style="font-size: 9px; padding: 1px 6px;">FEATURED #1</span>
                  <span style="font-size: 10px; color: var(--accent-primary); font-family: var(--font-mono);">Godot 4.3</span>
                </div>
                <strong style="font-size: 12px; color: var(--text-main); margin-top: 4px; display: block;">Shadow Leap</strong>
              </div>
            </div>

            <!-- Action Buttons Row -->
            <div class="flex gap-xs items-center flex-wrap">
              <button type="button" class="btn btn-primary btn-sm">Primary Button</button>
              <button type="button" class="btn btn-secondary btn-sm">Secondary</button>
              <button type="button" class="btn btn-outline btn-sm">Outline</button>
            </div>
          </div>
        </div>
      </div>

      <form id="admin-theme-form" style="display: flex; flex-direction: column; gap: var(--space-xl);">
        
        <!-- 2. THEME PRESETS -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>1. Curated Theme Presets</span>
            </div>
            <span class="badge">${currentPreset.toUpperCase()}</span>
          </div>
          <div class="form-section-body">
            <div class="grid grid-cols-3 gap-md">
              ${Object.entries(PRESETS).map(([key, preset]) => `
                <div class="theme-preset-card ${currentPreset === key ? 'active' : ''}" data-preset="${key}">
                  <div class="flex items-center justify-between">
                    <strong style="font-size: var(--text-sm); color: var(--text-main);">${preset.name}</strong>
                    <div style="width: 14px; height: 14px; border-radius: 50%; background: ${preset.accentPrimaryHex}; box-shadow: 0 0 8px ${preset.accentPrimaryHex};"></div>
                  </div>
                  <p class="text-xs text-muted" style="margin: 0;">${preset.desc}</p>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <!-- 3. COLOR PALETTE CONTROLS -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>2. Core Color Palette</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="grid grid-cols-2 gap-sm">
              
              <!-- Primary Accent Color -->
              <div class="theme-color-row">
                <div>
                  <strong style="font-size: var(--text-xs); color: var(--text-main);">Primary Accent Color</strong>
                  <div class="text-xs text-muted">Buttons, active borders, key highlights</div>
                </div>
                <div class="theme-color-input-group">
                  <input type="color" class="theme-color-picker" id="picker-accent-primary" value="${appearance.accentPrimaryHex || '#38bdf8'}" />
                  <input type="text" class="form-input theme-hex-input" id="hex-accent-primary" value="${appearance.accentPrimaryHex || '#38bdf8'}" />
                </div>
              </div>

              <!-- Secondary Accent Color -->
              <div class="theme-color-row">
                <div>
                  <strong style="font-size: var(--text-xs); color: var(--text-main);">Secondary Accent Color</strong>
                  <div class="text-xs text-muted">Hover states and gradient blends</div>
                </div>
                <div class="theme-color-input-group">
                  <input type="color" class="theme-color-picker" id="picker-accent-secondary" value="${appearance.accentSecondaryHex || '#0ea5e9'}" />
                  <input type="text" class="form-input theme-hex-input" id="hex-accent-secondary" value="${appearance.accentSecondaryHex || '#0ea5e9'}" />
                </div>
              </div>

              <!-- Page Background Color -->
              <div class="theme-color-row">
                <div>
                  <strong style="font-size: var(--text-xs); color: var(--text-main);">Page Background</strong>
                  <div class="text-xs text-muted">Deep canvas foundation</div>
                </div>
                <div class="theme-color-input-group">
                  <input type="color" class="theme-color-picker" id="picker-bg-page" value="${appearance.bgPage || '#08090c'}" />
                  <input type="text" class="form-input theme-hex-input" id="hex-bg-page" value="${appearance.bgPage || '#08090c'}" />
                </div>
              </div>

              <!-- Surface / Card Color -->
              <div class="theme-color-row">
                <div>
                  <strong style="font-size: var(--text-xs); color: var(--text-main);">Card Surface Color</strong>
                  <div class="text-xs text-muted">Primary container backgrounds</div>
                </div>
                <div class="theme-color-input-group">
                  <input type="color" class="theme-color-picker" id="picker-bg-surface" value="${appearance.bgSurface || '#11141b'}" />
                  <input type="text" class="form-input theme-hex-input" id="hex-bg-surface" value="${appearance.bgSurface || '#11141b'}" />
                </div>
              </div>

              <!-- Main Heading Text Color -->
              <div class="theme-color-row">
                <div>
                  <strong style="font-size: var(--text-xs); color: var(--text-main);">Main Heading Color</strong>
                  <div class="text-xs text-muted">H1, H2, and high-priority titles</div>
                </div>
                <div class="theme-color-input-group">
                  <input type="color" class="theme-color-picker" id="picker-text-main" value="${appearance.textMain || '#f1f4f9'}" />
                  <input type="text" class="form-input theme-hex-input" id="hex-text-main" value="${appearance.textMain || '#f1f4f9'}" />
                </div>
              </div>

              <!-- Body / Muted Text Color -->
              <div class="theme-color-row">
                <div>
                  <strong style="font-size: var(--text-xs); color: var(--text-main);">Secondary / Body Text</strong>
                  <div class="text-xs text-muted">Paragraphs and descriptions</div>
                </div>
                <div class="theme-color-input-group">
                  <input type="color" class="theme-color-picker" id="picker-text-muted" value="${appearance.textMuted || '#94a0b5'}" />
                  <input type="text" class="form-input theme-hex-input" id="hex-text-muted" value="${appearance.textMuted || '#94a0b5'}" />
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- 4. GLOW, TYPOGRAPHY & ATMOSPHERE -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>3. Atmospheric Glow & Typography</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="theme-glow-level">Glow Intensity Level</label>
                <select class="form-select" id="theme-glow-level">
                  <option value="off" ${appearance.glowLevel === 'off' ? 'selected' : ''}>Off (Strict Minimalist Contrast)</option>
                  <option value="low" ${appearance.glowLevel === 'low' ? 'selected' : ''}>Low (Subtle Ambient Outline)</option>
                  <option value="subtle" ${appearance.glowLevel === 'subtle' || !appearance.glowLevel ? 'selected' : ''}>Subtle (Recommended — Balanced Dark)</option>
                  <option value="medium" ${appearance.glowLevel === 'medium' ? 'selected' : ''}>Medium (Warm Radiant Glow)</option>
                  <option value="vibrant" ${appearance.glowLevel === 'vibrant' ? 'selected' : ''}>Vibrant (High Impact Glow)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="theme-heading-weight">Heading Font Weight</label>
                <select class="form-select" id="theme-heading-weight">
                  <option value="600" ${appearance.headingWeight === '600' ? 'selected' : ''}>Semi-Bold (600)</option>
                  <option value="700" ${appearance.headingWeight === '700' || !appearance.headingWeight ? 'selected' : ''}>Bold (700 — Default)</option>
                  <option value="800" ${appearance.headingWeight === '800' ? 'selected' : ''}>Extra Bold (800 — Punchy)</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="theme-bg-pattern">Background Pattern</label>
                <select class="form-select" id="theme-bg-pattern">
                  <option value="none" ${appearance.bgPattern === 'none' ? 'selected' : ''}>None (Smooth Dark Surface)</option>
                  <option value="grid" ${appearance.bgPattern === 'grid' ? 'selected' : ''}>Blueprint Grid (Subtle 40px Grid)</option>
                  <option value="dots" ${appearance.bgPattern === 'dots' ? 'selected' : ''}>Dot Matrix Texture</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="theme-card-style">Card Surface Texture</label>
                <select class="form-select" id="theme-card-style">
                  <option value="solid" ${appearance.cardStyle === 'solid' ? 'selected' : ''}>Solid Dark Charcoal</option>
                  <option value="glass" ${appearance.cardStyle === 'glass' ? 'selected' : ''}>Translucent Glassmorphism</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button Bar -->
        <div style="display: flex; justify-content: flex-end; gap: var(--space-sm);">
          <button type="button" class="btn btn-outline btn-lg" id="reset-theme-btn">
            Reset to Default
          </button>
          <button type="submit" class="btn btn-primary btn-lg" id="save-theme-btn">
            Save Theme & Appearance
          </button>
        </div>

      </form>

    </div>
  `;
}

export function initAdminAppearanceEvents(reRenderCallback) {
  let activePreset = store.getAppearance().themePreset || "default";

  // Sync color pickers with hex inputs and live preview
  const bindColorSync = (pickerId, hexId, cssProp, stateKey) => {
    const picker = document.getElementById(pickerId);
    const hexInput = document.getElementById(hexId);

    if (picker && hexInput) {
      const applyColor = (val) => {
        if (!val.startsWith("#") && val.length === 6) val = "#" + val;
        picker.value = val;
        hexInput.value = val;

        // Apply immediately to CSS variables for live site & preview
        document.documentElement.style.setProperty(cssProp, val);
        if (cssProp === "--accent-primary") {
          document.documentElement.style.setProperty("--accent-text", val);
          document.documentElement.style.setProperty("--border-focus", val);
          document.documentElement.style.setProperty("--accent-surface", `${val}0f`);
          document.documentElement.style.setProperty("--accent-border", `${val}38`);
        }

        activePreset = "custom";
        document.querySelectorAll(".theme-preset-card").forEach(c => c.classList.remove("active"));
      };

      picker.addEventListener("input", (e) => applyColor(e.target.value));
      hexInput.addEventListener("input", (e) => {
        if (e.target.value.length >= 4) applyColor(e.target.value);
      });
    }
  };

  bindColorSync("picker-accent-primary", "hex-accent-primary", "--accent-primary", "accentPrimaryHex");
  bindColorSync("picker-accent-secondary", "hex-accent-secondary", "--accent-secondary", "accentSecondaryHex");
  bindColorSync("picker-bg-page", "hex-bg-page", "--bg-page", "bgPage");
  bindColorSync("picker-bg-surface", "hex-bg-surface", "--bg-surface", "bgSurface");
  bindColorSync("picker-text-main", "hex-text-main", "--text-main", "textMain");
  bindColorSync("picker-text-muted", "hex-text-muted", "--text-muted", "textMuted");

  // Preset Card Clicks
  document.querySelectorAll(".theme-preset-card").forEach(card => {
    card.addEventListener("click", () => {
      const presetKey = card.getAttribute("data-preset");
      const presetData = PRESETS[presetKey];
      if (!presetData) return;

      activePreset = presetKey;
      document.querySelectorAll(".theme-preset-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      // Update fields
      const updateField = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
      };

      updateField("picker-accent-primary", presetData.accentPrimaryHex);
      updateField("hex-accent-primary", presetData.accentPrimaryHex);
      updateField("picker-accent-secondary", presetData.accentSecondaryHex);
      updateField("hex-accent-secondary", presetData.accentSecondaryHex);
      updateField("picker-bg-page", presetData.bgPage);
      updateField("hex-bg-page", presetData.bgPage);
      updateField("picker-bg-surface", presetData.bgSurface);
      updateField("hex-bg-surface", presetData.bgSurface);
      updateField("picker-text-main", presetData.textMain);
      updateField("hex-text-main", presetData.textMain);
      updateField("picker-text-muted", presetData.textMuted);
      updateField("hex-text-muted", presetData.textMuted);
      updateField("theme-glow-level", presetData.glowLevel);
      updateField("theme-heading-weight", presetData.headingWeight);
      updateField("theme-bg-pattern", presetData.bgPattern);
      updateField("theme-card-style", presetData.cardStyle);

      // Apply live
      store.updateAppearance({
        themePreset: presetKey,
        ...presetData
      });

      toast.info(`Preset applied: ${presetData.name}`);
    });
  });

  // Glow level & typography live updates
  const glowSelect = document.getElementById("theme-glow-level");
  if (glowSelect) {
    glowSelect.addEventListener("change", (e) => {
      document.documentElement.setAttribute("data-glow", e.target.value);
    });
  }

  const weightSelect = document.getElementById("theme-heading-weight");
  if (weightSelect) {
    weightSelect.addEventListener("change", (e) => {
      document.documentElement.style.setProperty("--font-weight-heading", e.target.value);
    });
  }

  const patternSelect = document.getElementById("theme-bg-pattern");
  if (patternSelect) {
    patternSelect.addEventListener("change", (e) => {
      document.documentElement.setAttribute("data-pattern", e.target.value);
    });
  }

  const cardStyleSelect = document.getElementById("theme-card-style");
  if (cardStyleSelect) {
    cardStyleSelect.addEventListener("change", (e) => {
      document.documentElement.setAttribute("data-card-style", e.target.value);
    });
  }

  // Reset Button
  const resetBtn = document.getElementById("reset-theme-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const defaultPreset = PRESETS["default"];
      store.updateAppearance({
        themePreset: "default",
        ...defaultPreset
      });
      toast.info("Theme reset to Olflaz Dark default.");
      if (reRenderCallback) reRenderCallback();
    });
  }

  // Form Submit / Save
  const form = document.getElementById("admin-theme-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById("save-theme-btn");

      const accentPrimaryHex = document.getElementById("hex-accent-primary").value.trim();
      const accentSecondaryHex = document.getElementById("hex-accent-secondary").value.trim();
      const bgPage = document.getElementById("hex-bg-page").value.trim();
      const bgSurface = document.getElementById("hex-bg-surface").value.trim();
      const textMain = document.getElementById("hex-text-main").value.trim();
      const textMuted = document.getElementById("hex-text-muted").value.trim();
      const glowLevel = document.getElementById("theme-glow-level").value;
      const headingWeight = document.getElementById("theme-heading-weight").value;
      const bgPattern = document.getElementById("theme-bg-pattern").value;
      const cardStyle = document.getElementById("theme-card-style").value;

      saveBtn.disabled = true;
      saveBtn.textContent = "⏳ Saving Theme...";

      setTimeout(() => {
        store.updateAppearance({
          themePreset: activePreset,
          accentPrimaryHex,
          accentSecondaryHex,
          bgPage,
          bgSurface,
          textMain,
          textMuted,
          glowLevel,
          headingWeight,
          bgPattern,
          cardStyle
        });

        saveBtn.disabled = false;
        saveBtn.textContent = "💾 Save Theme & Appearance";

        toast.success("Theme settings saved successfully!");
        if (reRenderCallback) reRenderCallback();
      }, 150);
    });
  }
}
