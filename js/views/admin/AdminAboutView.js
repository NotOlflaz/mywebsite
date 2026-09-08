import { store } from "../../store/state.js";
import { toast } from "../../components/Toast.js";
import { getIcon } from "../../utils/icons.js";
import { renderImageUploader, initImageUploader } from "../../components/ImageUploader.js";

export function renderAdminAboutView() {
  const about = store.getAbout();

  const skillsText = (about.skills || []).map(g => `${g.category}: ${g.items.join(", ")}`).join("\n");
  const interestsText = (about.interests || []).join("\n");
  const toolsText = (about.tools || []).join(", ");

  return `
    <div class="admin-about-page">
      
      <div class="admin-page-header">
        <div class="admin-page-header-info">
          <h1>About & Profile Editor</h1>
          <p>Customize your creator story, game development and Minecraft focus areas, skills list, and toolstack.</p>
        </div>
        <a href="#/about" target="_blank" class="btn btn-secondary btn-sm">
          ${getIcon('eye', 13)} Preview Public About Page
        </a>
      </div>

      <form id="admin-about-form">
        
        <!-- 1. IDENTITY & PROFILE -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>1. Creator Identity & Avatar</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="about-name">Creator Name *</label>
                <input type="text" class="form-input" id="about-name" value="${escapeHtml(about.name)}" required placeholder="e.g. Olflaz" />
              </div>

              <div class="form-group">
                <label class="form-label" for="about-identity">Identity / Tagline</label>
                <input type="text" class="form-input" id="about-identity" value="${escapeHtml(about.identity)}" placeholder="e.g. Minecraft Creator & Godot Game Dev" />
              </div>
            </div>

            ${renderImageUploader({
              id: "about-avatar",
              value: about.avatarUrl,
              label: "Creator Avatar / Profile Photo",
              helperText: "Upload an avatar from PC (Square 1:1 ratio) or paste image URL.",
              placeholder: "https://... or upload from PC",
              aspect: "1/1"
            })}
          </div>
        </div>

        <!-- 2. BIOGRAPHY -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>2. Biography & Story</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="form-group">
              <label class="form-label" for="about-shortbio">Short Bio (Sidebar & Hero previews)</label>
              <textarea class="form-textarea" id="about-shortbio" rows="2" placeholder="Brief summary of who you are...">${escapeHtml(about.shortBio)}</textarea>
            </div>

            <div class="form-group">
              <label class="form-label" for="about-fullbio">Full Biography & Journey</label>
              <textarea class="form-textarea" id="about-fullbio" rows="4" placeholder="Your full story, passions, background, and goals...">${escapeHtml(about.fullBio)}</textarea>
            </div>
          </div>
        </div>

        <!-- 3. SPECIALIZATION BLURBS -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>3. Focus Areas (Godot & Minecraft)</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="about-gamedev">Godot Game Development Deep Dive</label>
                <textarea class="form-textarea" id="about-gamedev" rows="3">${escapeHtml(about.gameDevBio)}</textarea>
              </div>

              <div class="form-group">
                <label class="form-label" for="about-minecraft">Minecraft & Content Creation Deep Dive</label>
                <textarea class="form-textarea" id="about-minecraft" rows="3">${escapeHtml(about.minecraftBio)}</textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. TOOLS, INTERESTS & SKILLS -->
        <div class="form-section">
          <div class="form-section-header">
            <div class="form-section-title">
              <span>4. Skills, Tools & Interests</span>
            </div>
          </div>
          <div class="form-section-body">
            <div class="form-group">
              <label class="form-label" for="about-tools">Tools & Software Stack (Comma-separated)</label>
              <input type="text" class="form-input" id="about-tools" value="${escapeHtml(toolsText)}" placeholder="Godot 4, Blender, DaVinci Resolve, VS Code, Blockbench" />
            </div>

            <div class="form-group">
              <label class="form-label" for="about-interests">Interests & Focus Areas (One per line)</label>
              <textarea class="form-textarea font-mono" id="about-interests" rows="3">${escapeHtml(interestsText)}</textarea>
            </div>

            <div class="form-group">
              <label class="form-label" for="about-skills">Categorized Skills (Format: Category Name: Item1, Item2, Item3)</label>
              <textarea class="form-textarea font-mono" id="about-skills" rows="4" placeholder="Game Engine: Godot 4.x, GDScript\n3D Modeling: Blender, Blockbench">${escapeHtml(skillsText)}</textarea>
              <span class="form-helper">Enter each category on a new line with a colon followed by comma-separated skills.</span>
            </div>
          </div>
        </div>

        <!-- Sticky Action & Save Bar -->
        <div class="admin-sticky-bar">
          <div class="admin-sticky-bar-left">
            <span style="color: var(--status-active-text);">${getIcon('sparkles', 14)}</span>
            <span>Profile and biography changes save persistently.</span>
          </div>
          <div class="admin-sticky-bar-right">
            <button type="button" class="btn btn-outline" id="discard-about-btn">
              Discard Changes
            </button>
            <button type="submit" class="btn btn-primary" id="save-about-btn">
              💾 Save About Information
            </button>
          </div>
        </div>

      </form>

    </div>
  `;
}

export function initAdminAboutEvents(reRenderCallback) {
  const form = document.getElementById("admin-about-form");
  if (form) {
    // Initialize Image Uploader for avatar
    initImageUploader(form, "about-avatar");

    // Discard Button
    const discardBtn = document.getElementById("discard-about-btn");
    if (discardBtn) {
      discardBtn.addEventListener("click", () => {
        if (reRenderCallback) reRenderCallback();
        toast.info("About page edits discarded.");
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById("save-about-btn");

      const name = document.getElementById("about-name").value.trim();
      const identity = document.getElementById("about-identity").value.trim();
      const avatarUrl = document.getElementById("about-avatar").value.trim();
      const shortBio = document.getElementById("about-shortbio").value.trim();
      const fullBio = document.getElementById("about-fullbio").value.trim();
      const gameDevBio = document.getElementById("about-gamedev").value.trim();
      const minecraftBio = document.getElementById("about-minecraft").value.trim();
      const toolsRaw = document.getElementById("about-tools").value;
      const interestsRaw = document.getElementById("about-interests").value;
      const skillsRaw = document.getElementById("about-skills").value;

      if (!name) {
        toast.error("Creator name is required");
        return;
      }

      saveBtn.disabled = true;
      saveBtn.textContent = "⏳ Saving...";

      const tools = toolsRaw.split(",").map(t => t.trim()).filter(Boolean);
      const interests = interestsRaw.split("\n").map(i => i.trim()).filter(Boolean);

      const skills = skillsRaw.split("\n").map(line => {
        const parts = line.split(":");
        if (parts.length >= 2) {
          const category = parts[0].trim();
          const items = parts.slice(1).join(":").split(",").map(s => s.trim()).filter(Boolean);
          return { category, items };
        }
        return null;
      }).filter(Boolean);

      setTimeout(() => {
        store.updateAbout({
          name,
          identity,
          avatarUrl,
          shortBio,
          fullBio,
          gameDevBio,
          minecraftBio,
          tools,
          interests,
          skills: skills.length > 0 ? skills : store.getAbout().skills
        });

        // Also update home avatar if set
        if (avatarUrl) {
          store.updateHome({ avatarUrl, heroTitle: name });
        }

        saveBtn.disabled = false;
        saveBtn.textContent = "💾 Save About Information";

        toast.success("About page & profile updated successfully!");
      }, 150);
    });
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
