/**
 * Dedicated Dark Admin Login View
 * High-aesthetic cyber gate with Web Crypto verification, brute force lockout countdown, and password visibility toggle.
 */

import { authStore } from "../../store/auth.js";
import { router } from "../../router/router.js";
import { toast } from "../../components/Toast.js";
import { getIcon } from "../../utils/icons.js";

let lockoutTimerInterval = null;

export function renderAdminLoginView() {
  const lockout = authStore.getLockoutStatus();
  const isLocked = lockout.isLocked;

  return `
    <div class="admin-login-wrapper">
      <div class="admin-login-backdrop"></div>

      <div class="admin-login-card card" id="admin-login-card">
        
        <!-- Header Shield Badge -->
        <div class="auth-header text-center">
          <div class="auth-badge-icon">
            <span class="auth-badge-glow"></span>
            <span class="auth-badge-svg">${getIcon("shield", 32)}</span>
          </div>
          <h1 class="auth-title">Admin Access Gateway</h1>
          <p class="auth-subtitle">Olflaz Game Dev & Creator Content Management System</p>
        </div>

        <!-- Lockout Notice Banner (Hidden if not locked) -->
        <div id="auth-lockout-banner" class="auth-lockout-banner ${isLocked ? 'active' : ''}" style="${isLocked ? '' : 'display: none;'}">
          <div class="flex items-center gap-xs">
            <span class="text-danger">${getIcon("alert", 18)}</span>
            <span class="font-bold">Security Lockout Active</span>
          </div>
          <p style="font-size: var(--text-xs); margin-top: 4px;">
            Too many failed attempts. Try again in <span id="lockout-countdown" class="font-mono text-danger font-bold">${lockout.remainingSeconds}</span>s.
          </p>
        </div>

        <!-- Dynamic Error Banner -->
        <div id="auth-error-banner" class="auth-error-banner" style="display: none;">
          <span class="auth-error-icon">${getIcon("alert", 16)}</span>
          <span id="auth-error-text" class="auth-error-text"></span>
        </div>

        <!-- Login Form -->
        <form id="admin-login-form" class="auth-form" autocomplete="off">
          
          <!-- Username Input -->
          <div class="form-group">
            <label for="admin-username" class="form-label flex items-center justify-between">
              <span>Admin Username</span>
              <span class="auth-field-hint">Required</span>
            </label>
            <div class="auth-input-wrapper">
              <span class="auth-input-icon">${getIcon("user", 16)}</span>
              <input 
                type="text" 
                id="admin-username" 
                name="username" 
                class="form-control auth-input" 
                placeholder="Enter username" 
                required 
                autofocus 
                ${isLocked ? 'disabled' : ''}
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="form-group">
            <label for="admin-password" class="form-label flex items-center justify-between">
              <span>Password</span>
              <span class="auth-field-hint">SHA-256 Encrypted</span>
            </label>
            <div class="auth-input-wrapper">
              <span class="auth-input-icon">${getIcon("lock", 16)}</span>
              <input 
                type="password" 
                id="admin-password" 
                name="password" 
                class="form-control auth-input" 
                placeholder="••••••••••••" 
                required 
                ${isLocked ? 'disabled' : ''}
              />
              <button 
                type="button" 
                id="auth-toggle-password-btn" 
                class="auth-toggle-password" 
                title="Toggle password visibility" 
                tabindex="-1"
              >
                <span id="auth-toggle-eye-icon">${getIcon("eye", 16)}</span>
              </button>
            </div>
          </div>

          <!-- Remember Me Checkbox -->
          <div class="flex items-center justify-between" style="margin-top: 4px; margin-bottom: var(--space-md);">
            <label class="custom-checkbox" style="cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: var(--text-sm); color: var(--text-muted);">
              <input type="checkbox" id="admin-remember-me" name="remember" />
              <span>Keep me signed in (7 days)</span>
            </label>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            id="auth-submit-btn" 
            class="btn btn-primary btn-block btn-lg auth-submit-btn"
            ${isLocked ? 'disabled' : ''}
          >
            <span id="auth-submit-spinner" class="spinner" style="display: none; width: 16px; height: 16px; border-width: 2px;"></span>
            <span id="auth-submit-text" class="flex items-center gap-xs justify-center">
              <span>Unlock Dashboard</span>
              <span>${getIcon("arrowRight", 16)}</span>
            </span>
          </button>
        </form>

        <!-- Card Footer -->
        <div class="auth-footer text-center">
          <a href="#/" class="auth-back-link">
            <span>← Return to Public Website</span>
          </a>
          <div class="auth-security-badge">
            <span>${getIcon("lock", 12)}</span>
            <span>Client-side Web Crypto • Rate-Limited Authentication</span>
          </div>
        </div>

      </div>
    </div>
  `;
}

export function initAdminLoginEvents() {
  const form = document.getElementById("admin-login-form");
  const usernameInput = document.getElementById("admin-username");
  const passwordInput = document.getElementById("admin-password");
  const rememberCheckbox = document.getElementById("admin-remember-me");
  const togglePassBtn = document.getElementById("auth-toggle-password-btn");
  const toggleEyeIcon = document.getElementById("auth-toggle-eye-icon");
  const submitBtn = document.getElementById("auth-submit-btn");
  const submitText = document.getElementById("auth-submit-text");
  const submitSpinner = document.getElementById("auth-submit-spinner");
  const errorBanner = document.getElementById("auth-error-banner");
  const errorText = document.getElementById("auth-error-text");
  const lockoutBanner = document.getElementById("auth-lockout-banner");
  const lockoutCountdown = document.getElementById("lockout-countdown");
  const card = document.getElementById("admin-login-card");

  if (lockoutTimerInterval) {
    clearInterval(lockoutTimerInterval);
    lockoutTimerInterval = null;
  }

  // Check initial lockout state
  const checkInitialLockout = () => {
    const status = authStore.getLockoutStatus();
    if (status.isLocked) {
      startLockoutCountdown(status.remainingSeconds);
    }
  };

  const startLockoutCountdown = (seconds) => {
    let remaining = seconds;
    if (lockoutBanner) {
      lockoutBanner.style.display = "block";
      lockoutBanner.classList.add("active");
    }
    if (lockoutCountdown) lockoutCountdown.textContent = remaining;
    if (usernameInput) usernameInput.disabled = true;
    if (passwordInput) passwordInput.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
    if (errorBanner) errorBanner.style.display = "none";

    if (lockoutTimerInterval) clearInterval(lockoutTimerInterval);

    lockoutTimerInterval = setInterval(() => {
      remaining--;
      if (lockoutCountdown) lockoutCountdown.textContent = remaining;

      if (remaining <= 0) {
        clearInterval(lockoutTimerInterval);
        lockoutTimerInterval = null;
        if (lockoutBanner) {
          lockoutBanner.style.display = "none";
          lockoutBanner.classList.remove("active");
        }
        if (usernameInput) {
          usernameInput.disabled = false;
          usernameInput.focus();
        }
        if (passwordInput) passwordInput.disabled = false;
        if (submitBtn) submitBtn.disabled = false;
      }
    }, 1000);
  };

  // Toggle Password Visibility
  if (togglePassBtn && passwordInput && toggleEyeIcon) {
    togglePassBtn.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";
      toggleEyeIcon.innerHTML = isPassword ? getIcon("eyeOff", 16) : getIcon("eye", 16);
      passwordInput.focus();
    });
  }

  // Form Submit Handler
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = usernameInput ? usernameInput.value : "";
      const password = passwordInput ? passwordInput.value : "";
      const rememberMe = rememberCheckbox ? rememberCheckbox.checked : false;

      // Reset errors
      if (errorBanner) errorBanner.style.display = "none";

      // Set Loading state
      if (submitBtn) submitBtn.disabled = true;
      if (submitSpinner) submitSpinner.style.display = "inline-block";
      if (submitText) submitText.style.display = "none";

      try {
        // Small artificial micro-delay (150ms) to ensure smooth UX state transition
        await new Promise(r => setTimeout(r, 150));

        const result = await authStore.login(username, password, rememberMe);

        if (result.success) {
          toast.success("Welcome back, Olflaz!");
          const target = authStore.getAndClearRedirectTarget();
          router.navigate(target);
        } else {
          // Failure handling
          if (submitBtn) submitBtn.disabled = false;
          if (submitSpinner) submitSpinner.style.display = "none";
          if (submitText) submitText.style.display = "flex";

          if (result.isLocked) {
            startLockoutCountdown(result.remainingSeconds);
          } else {
            if (errorBanner && errorText) {
              errorText.textContent = result.error || "Authentication failed.";
              errorBanner.style.display = "flex";
              // Trigger shake animation
              if (card) {
                card.classList.remove("auth-shake");
                void card.offsetWidth; // Force reflow
                card.classList.add("auth-shake");
              }
            }
            if (passwordInput) {
              passwordInput.value = "";
              passwordInput.focus();
            }
          }
        }
      } catch (err) {
        if (submitBtn) submitBtn.disabled = false;
        if (submitSpinner) submitSpinner.style.display = "none";
        if (submitText) submitText.style.display = "flex";
        if (errorBanner && errorText) {
          errorText.textContent = "An unexpected error occurred. Please try again.";
          errorBanner.style.display = "flex";
        }
      }
    });
  }

  checkInitialLockout();
}
