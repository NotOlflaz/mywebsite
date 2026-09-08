/**
 * About Page View
 * Complete structure: Profile hero, story & background, Game Development focus,
 * Minecraft content creation focus, Interests, Tools & Software, Categorized Skills, Social Links.
 */

import { store } from "../../store/state.js";
import { getIcon } from "../../utils/icons.js";

export function renderAboutView() {
  const about = store.getAbout();
  const settings = store.getSiteSettings();
  const social = store.getSocialLinks();

  const skillsHtml = (about.skills || []).map((group, idx) => `
    <div class="reveal-card stagger-${(idx % 4) + 1}" style="background-color: var(--bg-surface-alt); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: var(--space-md);">
      <h4 style="font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; color: var(--accent-primary);">
        ${group.category}
      </h4>
      <div class="flex gap-xs flex-wrap">
        ${group.items.map(item => `<span class="badge font-mono">${item}</span>`).join("")}
      </div>
    </div>
  `).join("");

  const toolsHtml = (about.tools || []).map((tool, idx) => `
    <div class="tool-badge-box reveal-card stagger-${(idx % 6) + 1}">
      ${tool}
    </div>
  `).join("");

  const interestsHtml = (about.interests || []).map(interest => `
    <li style="margin-bottom: 8px;">${interest}</li>
  `).join("");

  return `
    <div class="about-page-root">
      <section class="section" style="padding-top: var(--space-3xl);">
        <div class="container">
          
          <div class="about-page-grid">
            
            <!-- Left Sidebar: Profile Card & Quick Stats -->
            <aside class="about-sidebar-card reveal-init">
              <div class="about-avatar-wrapper">
                ${about.avatarUrl ? `
                  <img src="${about.avatarUrl}" alt="${about.name}" />
                ` : `
                  <div style="color: var(--accent-primary);">${getIcon("user", 56)}</div>
                `}
              </div>
              <div>
                <h2 style="font-size: var(--text-2xl); color: #ffffff;">${about.name || 'Olflaz'}</h2>
                <p class="text-xs font-bold font-mono" style="color: var(--accent-primary); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em;">
                  ${about.identity || 'Minecraft Creator & Godot Game Dev'}
                </p>
              </div>
              
              <p style="font-size: var(--text-sm); line-height: 1.65; text-align: center; color: var(--text-muted);">
                ${about.shortBio || ''}
              </p>

              <!-- Social Links Hub -->
              <div style="width: 100%; border-top: 1px solid var(--border-subtle); padding-top: var(--space-md); display: flex; flex-direction: column; gap: var(--space-xs);">
                <a href="${social.youtube || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-youtube btn-block btn-sm">
                  ${getIcon("youtube", 15)}
                  <span>YouTube Channel ↗</span>
                </a>
                <a href="${social.discord || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-discord btn-block btn-sm">
                  ${getIcon("discord", 15)}
                  <span>Join Discord ↗</span>
                </a>
                <a href="${social.github || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-block btn-sm">
                  ${getIcon("github", 15)}
                  <span>GitHub Profile ↗</span>
                </a>
                <a href="${social.itch || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-block btn-sm">
                  ${getIcon("gamepad", 15)}
                  <span>itch.io Storefront ↗</span>
                </a>
              </div>
            </aside>

            <!-- Right Main Area: Comprehensive Bio, Game Dev, Minecraft & Tools -->
            <main class="about-content-card">
              
              <!-- Bio / Intro -->
              <div class="about-block reveal-init">
                <h2 class="about-block-title">About Me & My Background</h2>
                <p style="font-size: var(--text-base); line-height: 1.8; color: var(--text-main);">
                  ${about.fullBio || 'Passionate indie game developer and content creator dedicated to building memorable game experiences.'}
                </p>
              </div>

              <!-- Game Development Section -->
              <div class="about-block reveal-init">
                <h3 class="about-block-title">Godot Game Development</h3>
                <p style="font-size: var(--text-base); line-height: 1.8; color: var(--text-muted);">
                  ${about.gameDevBio || 'Focusing on Godot 4.x for both 2D action platformers and 3D roguelites. I love crafting tight controls, state machine architectures, and modular systems that make game feel satisfying.'}
                </p>
                <div style="margin-top: 8px;">
                  <a href="#/projects" class="btn btn-outline btn-sm">
                    View My Godot Projects &rarr;
                  </a>
                </div>
              </div>

              <!-- Minecraft / Content Creation Section -->
              <div class="about-block reveal-init">
                <h3 class="about-block-title">Minecraft & Content Creation</h3>
                <p style="font-size: var(--text-base); line-height: 1.8; color: var(--text-muted);">
                  ${about.minecraftBio || 'Designing custom adventure maps, unique survival challenges, and technical datapacks. Sharing the entire creative journey on YouTube with a vibrant community.'}
                </p>
                <div style="margin-top: 8px;">
                  <a href="#/videos" class="btn btn-outline btn-sm">
                    Watch Content on YouTube &rarr;
                  </a>
                </div>
              </div>

              <!-- Interests -->
              <div class="about-block reveal-init">
                <h3 class="about-block-title">Interests & Focus Areas</h3>
                <ul style="padding-left: 20px; font-size: var(--text-base); line-height: 1.8; color: var(--text-muted);">
                  ${interestsHtml}
                </ul>
              </div>

              <!-- Tools I Use -->
              <div class="about-block reveal-init">
                <h3 class="about-block-title">Tools & Technologies</h3>
                <div class="tools-grid scroll-reveal-grid">
                  ${toolsHtml}
                </div>
              </div>

              <!-- Categorized Skills -->
              <div class="about-block reveal-init">
                <h3 class="about-block-title">Core Competencies</h3>
                <div class="grid grid-cols-2 gap-md scroll-reveal-grid">
                  ${skillsHtml}
                </div>
              </div>

            </main>

          </div>

        </div>
      </section>
    </div>
  `;
}
