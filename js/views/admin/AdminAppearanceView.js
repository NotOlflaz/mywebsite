/**
 * Admin Appearance & Visual Design Controller View
 * Manage Accent Color, Ambient Glow Intensity, Background Patterns, and Card Glassmorphism.
 */

import { store } from "../../store/state.js";
import { toast } from "../../components/Toast.js";
import { getIcon } from "../../utils/icons.js";

export function renderAdminAppearanceView() {
  const appearance = store.getAppearance();

  const accentColors = [
    { id: "cyan", name: "Electric Cyan", color: "#00f2fe", desc: "Futuristic & Godot Blue" },
    { id: "emerald", name: "Neon Emerald", color: "#10b981", desc: "Minecraft & Matrix Green" },
    { id: "purple", name: "Cyber Purple", color: "#a855f7", desc: "Indie & Creative Violet" },
    { id: "amber", name: "Gold Amber", color: "#f59e0b", desc: "Hardcore Trophy Gold" },
    { id: "crimson", name: "Ruby Crimson", color: "#f43f5e", desc: "Action & YouTube Red" }
  ];

  return `
    <div class="admin-appearance-page">
      
      <div class="admin-page-header">
        <div class="admin-page-header-info">
          <h1>Visual Appearance & Theme</h1>
          <p>Customize the dark brand palette, primary accent colors, ambient glow intensity, and background blueprint patterns.</p>
        </div>
        <a href="#/" target="_blank" class="btn btn-secondary btn-sm">
          ${getIcon('eye', 13)} Preview Public Website
        </a>
      </div>

      <!-- 1. LIVE THEME PREVIEW CARD -->
      <div class="form-section">
        <div class="form-section-header">
          <div class="form-section-title">
            <span>Live Design System Preview</span>
          </div>
        </div>
        <div class="form-section-body">
          <div style="padding: var(--space-xl); background: var(--bg-page-secondary); border-radius: var(--radius-lg); border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: var(--space-md);">
            <div class="flex items-center justify-between gap-md flex-wrap">
              <div>
                <span class="hero-identity-badge">THEME PREVIEW</span>
                <h2 style="font-size: var(--text-2xl); color: #ffffff;">
                  Olflaz <span class="gradient-text">Design System</span>
                </h2>
              </div>
              <div class="flex gap-xs">
                <button type="button" class="btn btn-primary btn-sm">Primary Action</button>
                <button type="button" class="btn btn-secondary btn-sm">Secondary</button>
                <button type="button" class="btn btn-outline btn-sm">Outline</button>
              </div>
            </div>
            <p class="text-sm">
              This live preview reflects your selected accent color (<span class="font-mono text-accent" style="color: var(--accent-primary);">${appearance.accentColor}</span>), glow level (<span class="font-mono">${appearance.ambientGlow}</span>), and background pattern (<span class="font-mono">${appearance.bgPattern}</span>).
            </p>
          </div>
        </div>
      </div>

      <form id="admin-appearance-form" style="display: flex; flex-direction: column; gap: var(--space-xl);">
        
        <!-- 2. PRIMARY ACCENT PRESET -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>1. Primary Accent Color</span>
            </div>
          </div>
          <div class="form-section-body">
            <p class="text-sm text-muted">Select an accent color palette for buttons, badges, glowing borders, and gradient highlights:</p>
            
            <div class="grid grid-cols-3 gap-md" style="margin-top: 8px;">
              ${accentColors.map(c => `
                <label style="cursor: pointer; padding: var(--space-md); border-radius: var(--radius-md); border: 2px solid ${appearance.accentColor === c.id ? 'var(--accent-primary)' : 'var(--border-color)'}; background: var(--bg-surface-alt); display: flex; align-items: center; gap: var(--space-sm);">
                  <input type="radio" name="accent-color-radio" value="${c.id}" ${appearance.accentColor === c.id ? 'checked' : ''} style="accent-color: ${c.color};" />
                  <div style="width: 24px; height: 24px; border-radius: var(--radius-full); background: ${c.color}; box-shadow: 0 0 10px ${c.color}66; flex-shrink: 0;"></div>
                  <div>
                    <strong style="font-size: var(--text-sm); display: block; color: #ffffff;">${c.name}</strong>
                    <span class="text-xs text-muted">${c.desc}</span>
                  </div>
                </label>
              `).join("")}
            </div>
          </div>
        </div>

        <!-- 3. AMBIENT GLOW & PATTERNS -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>2. Ambient Lighting & Patterns</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="appearance-glow">Ambient Glow Intensity</label>
                <select class="form-select" id="appearance-glow">
                  <option value="subtle" ${appearance.ambientGlow === 'subtle' ? 'selected' : ''}>Subtle (Recommended — Calm & Premium)</option>
                  <option value="vibrant" ${appearance.ambientGlow === 'vibrant' ? 'selected' : ''}>Vibrant (High Glow Highlights)</option>
                  <option value="off" ${appearance.ambientGlow === 'off' ? 'selected' : ''}>Off (Pure Minimal Contrast)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="appearance-pattern">Background Overlay Pattern</label>
                <select class="form-select" id="appearance-pattern">
                  <option value="grid" ${appearance.bgPattern === 'grid' ? 'selected' : ''}>Developer Blueprint Grid (Subtle 40px Grid)</option>
                  <option value="dots" ${appearance.bgPattern === 'dots' ? 'selected' : ''}>Minimalist Dot Matrix</option>
                  <option value="none" ${appearance.bgPattern === 'none' ? 'selected' : ''}>Solid Dark (No Pattern)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="appearance-cardstyle">Card Surface Appearance</label>
              <select class="form-select" id="appearance-cardstyle">
                <option value="glass" ${appearance.cardStyle === 'glass' ? 'selected' : ''}>Dark Glassmorphism (Translucent with Blur)</option>
                <option value="solid" ${appearance.cardStyle === 'solid' ? 'selected' : ''}>Solid Dark Charcoal</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div style="display: flex; justify-content: flex-end;">
          <button type="submit" class="btn btn-primary btn-lg" id="save-appearance-btn">
            Apply & Save Appearance Settings
          </button>
        </div>

      </form>

    </div>
  `;
}

export function initAdminAppearanceEvents(reRenderCallback) {
  // Live Radio preview change
  const radioInputs = document.querySelectorAll('input[name="accent-color-radio"]');
  radioInputs.forEach(radio => {
    radio.addEventListener("change", (e) => {
      store.updateAppearance({ accentColor: e.target.value });
      if (reRenderCallback) reRenderCallback();
    });
  });

  const glowSelect = document.getElementById("appearance-glow");
  if (glowSelect) {
    glowSelect.addEventListener("change", (e) => {
      store.updateAppearance({ ambientGlow: e.target.value });
    });
  }

  const patternSelect = document.getElementById("appearance-pattern");
  if (patternSelect) {
    patternSelect.addEventListener("change", (e) => {
      store.updateAppearance({ bgPattern: e.target.value });
    });
  }

  const cardStyleSelect = document.getElementById("appearance-cardstyle");
  if (cardStyleSelect) {
    cardStyleSelect.addEventListener("change", (e) => {
      store.updateAppearance({ cardStyle: e.target.value });
    });
  }

  const form = document.getElementById("admin-appearance-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById("save-appearance-btn");

      const selectedRadio = document.querySelector('input[name="accent-color-radio"]:checked');
      const accentColor = selectedRadio ? selectedRadio.value : "cyan";
      const ambientGlow = document.getElementById("appearance-glow").value;
      const bgPattern = document.getElementById("appearance-pattern").value;
      const cardStyle = document.getElementById("appearance-cardstyle").value;

      saveBtn.disabled = true;
      saveBtn.textContent = "Applying Theme...";

      setTimeout(() => {
        store.updateAppearance({
          accentColor,
          ambientGlow,
          bgPattern,
          cardStyle
        });

        saveBtn.disabled = false;
        saveBtn.textContent = "Apply & Save Appearance Settings";

        toast.success("Visual design theme saved and applied across website!");
      }, 150);
    });
  }
}
