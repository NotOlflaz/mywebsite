/**
 * Directional Cinematic Scroll Reveal Engine & Smooth Momentum System
 * 
 * THE EXACT EFFECT:
 * - Scrolling DOWN:
 *     Entrance: Starts at opacity: 0, translate3d(0, 80px, 0) -> Animates to opacity: 1, translate3d(0, 0, 0) [Fade IN + Big Slide UP]
 *     Exit TOP: Starts at opacity: 1, translate3d(0, 0, 0)   -> Animates to opacity: 0, translate3d(0, -80px, 0) [Fade OUT + Big Slide UP]
 * - Scrolling UP:
 *     Entrance: Starts at opacity: 0, translate3d(0, -80px, 0) -> Animates to opacity: 1, translate3d(0, 0, 0) [Fade IN + Big Slide DOWN]
 *     Exit BTM: Starts at opacity: 1, translate3d(0, 0, 0)    -> Animates to opacity: 0, translate3d(0, 80px, 0) [Fade OUT + Big Slide DOWN]
 * 
 * Rules:
 * - 800ms duration with cubic-bezier(0.16, 1, 0.3, 1)
 * - Zero scale, zero bounce, zero pop on scroll.
 * - Hover pop is strictly decoupled: translate3d(0, -6px, 0) scale(1.02).
 * - Continuous replay in both directions indefinitely.
 */

let scrollObserver = null;
let scrollIndicatorContainer = null;
let scrollIndicatorBar = null;

// Smooth Inertia Scroll State
let targetY = window.scrollY || 0;
let currentY = window.scrollY || 0;
let isAnimating = false;
let isScrollListenersInitialized = false;

// Ease factor: 0.16 provides immediate 1st-frame response with fluid momentum
const SMOOTH_EASE = 0.16;

/**
 * Initialize / Re-initialize Scroll Reveal on View Change
 */
export function initScrollEngine() {
  const isPublic = !window.location.hash.startsWith("#/admin");

  // Sync scroll positions
  currentY = window.scrollY || 0;
  targetY = window.scrollY || 0;

  // 1. Setup Custom Scroll Progress Indicator for Public Website
  if (isPublic) {
    ensureScrollIndicator();
  } else {
    removeScrollIndicator();
  }

  // 2. Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    document.querySelectorAll(
      ".scroll-reveal, .reveal-card, .reveal-init, .section-header, .cta-banner, .about-page-grid, .channel-stat-card, .skill-card, .tool-badge-box, .featured-video-spotlight, .project-specs-card, .about-block, .about-sidebar-card, .hero-content, .hero-avatar-box, .channel-desc-box, [data-reveal]"
    ).forEach(el => {
      el.classList.remove("reveal-state-below", "reveal-state-above");
      el.classList.add("reveal-state-visible");
    });
    return;
  }

  // 3. Disconnect previous observer
  if (scrollObserver) {
    scrollObserver.disconnect();
    scrollObserver = null;
  }

  // 4. Query all target elements across views
  const revealTargets = document.querySelectorAll(
    ".scroll-reveal, .reveal-card, .reveal-init, .section-header, .cta-banner, .about-page-grid, .channel-stat-card, .channel-desc-box, .skill-card, .tool-badge-box, .featured-video-spotlight, .project-detail-header, .project-detail-hero-media, .project-specs-card, .filter-toolbar, .about-block, .about-sidebar-card, .hero-content, .hero-avatar-box, [data-reveal]"
  );

  // Set initial position state based on current viewport position
  const vHeight = window.innerHeight;
  revealTargets.forEach(el => {
    const rect = el.getBoundingClientRect();
    el.classList.remove("reveal-state-visible", "reveal-state-below", "reveal-state-above");
    if (rect.top < vHeight && rect.bottom > 0) {
      el.classList.add("reveal-state-visible");
    } else if (rect.top >= vHeight) {
      el.classList.add("reveal-state-below");
    } else {
      el.classList.add("reveal-state-above");
    }
  });

  // 5. Setup Directional IntersectionObserver
  if (typeof IntersectionObserver !== "undefined") {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px 0px 0px", // Trigger the moment boundary touches viewport
      threshold: 0
    };

    scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const target = entry.target;
        if (entry.isIntersecting) {
          // In Viewport: Animate into visible position (0, 0, 0)
          target.classList.remove("reveal-state-below", "reveal-state-above");
          target.classList.add("reveal-state-visible");
        } else {
          // Out of Viewport: Determine if it exited through TOP or BOTTOM
          target.classList.remove("reveal-state-visible");
          const rect = entry.boundingClientRect;
          if (rect.top < 0) {
            // Above viewport -> ready for downward slide when scrolling UP
            target.classList.remove("reveal-state-below");
            target.classList.add("reveal-state-above");
          } else {
            // Below viewport -> ready for upward slide when scrolling DOWN
            target.classList.remove("reveal-state-above");
            target.classList.add("reveal-state-below");
          }
        }
      });
    }, observerOptions);

    revealTargets.forEach(el => scrollObserver.observe(el));
  }

  // 6. Initial scroll state calculation
  updateScrollState();
}

/**
 * Setup Global Window Scroll & Responsive Smooth Inertia Listeners
 */
export function setupGlobalScrollListeners() {
  if (isScrollListenersInitialized) return;
  isScrollListenersInitialized = true;

  // Wheel listener for responsive smooth inertia
  window.addEventListener("wheel", handleWheelInput, { passive: false });

  // Sync scroll targets on native scroll actions (scrollbar drag, keyboard arrows, touch)
  window.addEventListener("scroll", () => {
    if (!isAnimating) {
      targetY = window.scrollY || 0;
      currentY = window.scrollY || 0;
      updateScrollState();
    }
  }, { passive: true });

  window.addEventListener("resize", () => {
    targetY = Math.min(targetY, getMaxScroll());
    currentY = Math.min(currentY, getMaxScroll());
    updateScrollState();
  }, { passive: true });

  // Key navigation synchronization (PageUp, PageDown, Space, Arrows, Home, End)
  window.addEventListener("keydown", (e) => {
    const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Space", "Home", "End"];
    if (keys.includes(e.code) && !isFormElement(e.target)) {
      setTimeout(() => {
        targetY = window.scrollY || 0;
        currentY = window.scrollY || 0;
        updateScrollState();
      }, 10);
    }
  }, { passive: true });
}

/**
 * Handle mouse wheel input with immediate pickup & smooth momentum
 */
function handleWheelInput(e) {
  const isPublic = !window.location.hash.startsWith("#/admin");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!isPublic || prefersReducedMotion || isInsideScrollableContainer(e.target)) {
    return;
  }

  // Normalize delta across browsers and devices
  let delta = e.deltaY;
  if (e.deltaMode === 1) delta *= 30; // Lines mode
  if (e.deltaMode === 2) delta *= window.innerHeight; // Pages mode

  const maxScroll = getMaxScroll();
  if (maxScroll <= 0) return;

  // Prevent default native stepping to apply fluid momentum
  e.preventDefault();

  // Accumulate target scroll with immediate responsiveness
  targetY = Math.max(0, Math.min(targetY + delta, maxScroll));

  if (!isAnimating) {
    isAnimating = true;
    window.requestAnimationFrame(stepSmoothScroll);
  }
}

/**
 * Responsive animation loop: Immediate start, fluid momentum, gentle tail deceleration
 */
function stepSmoothScroll() {
  const maxScroll = getMaxScroll();
  targetY = Math.max(0, Math.min(targetY, maxScroll));

  const diff = targetY - currentY;

  // When close enough, snap and stop animation
  if (Math.abs(diff) < 0.4) {
    currentY = targetY;
    window.scrollTo(0, currentY);
    updateScrollState();
    isAnimating = false;
    return;
  }

  // Interpolate position
  currentY += diff * SMOOTH_EASE;
  window.scrollTo(0, currentY);
  updateScrollState();

  if (isAnimating) {
    window.requestAnimationFrame(stepSmoothScroll);
  }
}

/**
 * Programmatically smooth scroll to a target position
 */
export function smoothScrollTo(targetPosition) {
  const maxScroll = getMaxScroll();
  targetY = Math.max(0, Math.min(targetPosition, maxScroll));

  if (!isAnimating) {
    isAnimating = true;
    window.requestAnimationFrame(stepSmoothScroll);
  }
}

function getMaxScroll() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

function isFormElement(el) {
  if (!el) return false;
  const tag = el.tagName ? el.tagName.toLowerCase() : "";
  return tag === "input" || tag === "textarea" || tag === "select" || el.isContentEditable;
}

function isInsideScrollableContainer(el) {
  if (!el || el === document.body || el === document.documentElement) return false;
  if (isFormElement(el)) return true;

  let current = el;
  while (current && current !== document.body) {
    if (current.classList && (current.classList.contains("modal-body") || current.classList.contains("mobile-nav-drawer"))) {
      if (current.scrollHeight > current.clientHeight) return true;
    }
    const overflowY = window.getComputedStyle(current).overflowY;
    if ((overflowY === "auto" || overflowY === "scroll") && current.scrollHeight > current.clientHeight) {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}

/**
 * Ensure the Custom Vertical Scroll Indicator is in the DOM
 */
function ensureScrollIndicator() {
  scrollIndicatorContainer = document.getElementById("scroll-indicator-container");
  if (!scrollIndicatorContainer) {
    scrollIndicatorContainer = document.createElement("div");
    scrollIndicatorContainer.id = "scroll-indicator-container";
    scrollIndicatorContainer.className = "scroll-indicator-container";
    scrollIndicatorContainer.setAttribute("aria-hidden", "true");
    scrollIndicatorContainer.title = "Scroll progress (Click to jump)";

    scrollIndicatorBar = document.createElement("div");
    scrollIndicatorBar.id = "scroll-indicator-bar";
    scrollIndicatorBar.className = "scroll-indicator-bar";

    scrollIndicatorContainer.appendChild(scrollIndicatorBar);

    // Click on track to smoothly scroll via inertia engine
    scrollIndicatorContainer.addEventListener("click", (e) => {
      const rect = scrollIndicatorContainer.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const percentage = Math.max(0, Math.min(1, clickY / rect.height));
      const targetScroll = percentage * getMaxScroll();
      smoothScrollTo(targetScroll);
    });

    document.body.appendChild(scrollIndicatorContainer);
  } else {
    scrollIndicatorBar = document.getElementById("scroll-indicator-bar");
  }
}

/**
 * Remove the Custom Scroll Indicator (e.g. when in Admin CMS)
 */
function removeScrollIndicator() {
  const existing = document.getElementById("scroll-indicator-container");
  if (existing) {
    existing.remove();
    scrollIndicatorContainer = null;
    scrollIndicatorBar = null;
  }
}

/**
 * Update Navbar Elevation, Hero Parallax & Scroll Progress Indicator
 */
function updateScrollState() {
  const scrollY = window.scrollY || window.pageYOffset || 0;
  const docHeight = getMaxScroll();
  const header = document.getElementById("main-public-header");

  // 1. Update Custom Scroll Indicator Bar
  if (scrollIndicatorBar && docHeight > 0) {
    const progress = Math.min(Math.max(scrollY / docHeight, 0), 1);
    const progressPercent = (progress * 100).toFixed(2);
    scrollIndicatorBar.style.height = `${progressPercent}%`;

    // Make track visible when page has scrollable content
    if (docHeight > 50) {
      scrollIndicatorContainer.style.opacity = "1";
    } else {
      scrollIndicatorContainer.style.opacity = "0";
    }
  }

  // 2. Navbar elevation & compacting
  if (header) {
    if (scrollY > 20) {
      header.classList.add("nav-scrolled");
    } else {
      header.classList.remove("nav-scrolled");
    }
  }

  // 3. Hero subtle parallax response (opacity & vertical slide only, no scale)
  const heroGrid = document.querySelector(".hero-grid");
  if (heroGrid && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    if (scrollY >= 0 && scrollY <= 550) {
      const progress = scrollY / 550;
      const opacity = Math.max(1 - progress * 0.45, 0.55);
      const translateY = progress * 24;
      heroGrid.style.opacity = opacity.toFixed(3);
      heroGrid.style.transform = `translateY(${translateY.toFixed(1)}px)`;
    } else if (scrollY === 0) {
      heroGrid.style.opacity = "1";
      heroGrid.style.transform = "translateY(0px)";
    }
  }
}
