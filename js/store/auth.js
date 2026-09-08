/**
 * Admin Authentication & Security State Manager
 * Web Crypto API SHA-256 Hashing, Salt Verification, Session Tokens, and Rate Limiter.
 */

const SALT = "olflaz_cms_v1_secure_salt";
// Precomputed SHA-256 hash for `olflaz:hamza18moza18:${SALT}`
const EXPECTED_HASH = "79efccdfaa5511b1bae98608d310bfbe2b2642112b49c869787ef71325641be1";

const STORAGE_SESSION_KEY = "olflaz_admin_auth_session";
const STORAGE_LOCKOUT_KEY = "olflaz_admin_auth_lockout";
const STORAGE_REDIRECT_KEY = "olflaz_admin_auth_redirect";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 1000; // 30 seconds

/**
 * Fallback SHA-256 implementation if crypto.subtle is not accessible
 */
function sha256Fallback(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i, j;
  let result = '';

  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  
  let hash = [];
  const k = [];
  let primeCounter = 0;

  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  
  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return;
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
  words[words[lengthProperty]] = (asciiBitLength) | 0;
  
  for (j = 0; j < words[lengthProperty];) {
    const w = words.slice(j, j += 16);
    const oldHash = hash;
    hash = hash.slice(0, 8);
    
    for (i = 0; i < 64; i++) {
      const i2 = i + j;
      const w15 = w[i - 15], w2 = w[i - 2];
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const temp1 = hash[7] + (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) + ch + k[i] + (w[i] = (i < 16) ? w[i] : (
        w[i - 16] + s0 + w[i - 7] + s1
      ) | 0);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = (rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) + maj;
      
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }
  
  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (8 * j)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

/**
 * Secure Hash Generation using Web Crypto API with fallback
 */
async function computeHash(username, password) {
  const normalizedUser = (username || "").trim().toLowerCase();
  const rawString = `${normalizedUser}:${password}:${SALT}`;

  if (typeof crypto !== "undefined" && crypto.subtle && crypto.subtle.digest) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(rawString);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    } catch (e) {
      console.warn("Web Crypto subtle failed, falling back to JS implementation:", e);
    }
  }

  return sha256Fallback(rawString);
}

/**
 * Generate cryptographic random token string
 */
function generateRandomToken() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint8Array(24);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, "0")).join("");
  }
  return "tok_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

class AuthStore {
  constructor() {
    this.session = null;
    this.listeners = new Set();
    this.initSession();
  }

  /**
   * Initialize session from sessionStorage or localStorage
   */
  initSession() {
    try {
      let raw = sessionStorage.getItem(STORAGE_SESSION_KEY);
      let isRemembered = false;

      if (!raw) {
        raw = localStorage.getItem(STORAGE_SESSION_KEY);
        if (raw) isRemembered = true;
      }

      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.expiresAt && Date.now() < parsed.expiresAt) {
          this.session = parsed;
          return;
        } else {
          this.logout();
        }
      }
    } catch (e) {
      this.logout();
    }
    this.session = null;
  }

  /**
   * Check if user is currently authenticated with a valid session
   */
  isAuthenticated() {
    if (!this.session) {
      this.initSession();
    }
    if (!this.session) return false;
    if (Date.now() >= this.session.expiresAt) {
      this.logout();
      return false;
    }
    return true;
  }

  /**
   * Get current authenticated user details
   */
  getUser() {
    return this.isAuthenticated() ? this.session : null;
  }

  /**
   * Rate limiting and lockout inspection
   */
  getLockoutStatus() {
    try {
      const raw = localStorage.getItem(STORAGE_LOCKOUT_KEY);
      if (!raw) return { isLocked: false, remainingSeconds: 0, failedCount: 0 };

      const data = JSON.parse(raw);
      const now = Date.now();

      if (data.lockedUntil && now < data.lockedUntil) {
        const remainingSeconds = Math.ceil((data.lockedUntil - now) / 1000);
        return { isLocked: true, remainingSeconds, failedCount: data.failedCount || MAX_FAILED_ATTEMPTS };
      }

      if (data.lockedUntil && now >= data.lockedUntil) {
        // Lockout expired, reset lockout lock but keep tracking
        localStorage.removeItem(STORAGE_LOCKOUT_KEY);
        return { isLocked: false, remainingSeconds: 0, failedCount: 0 };
      }

      return {
        isLocked: false,
        remainingSeconds: 0,
        failedCount: data.failedCount || 0
      };
    } catch (e) {
      return { isLocked: false, remainingSeconds: 0, failedCount: 0 };
    }
  }

  /**
   * Register a failed login attempt for brute force prevention
   */
  registerFailedAttempt() {
    try {
      const status = this.getLockoutStatus();
      const newCount = status.failedCount + 1;
      const now = Date.now();

      if (newCount >= MAX_FAILED_ATTEMPTS) {
        const lockoutData = {
          failedCount: newCount,
          lockedUntil: now + LOCKOUT_DURATION_MS,
          lastAttempt: now
        };
        localStorage.setItem(STORAGE_LOCKOUT_KEY, JSON.stringify(lockoutData));
        return { isLocked: true, remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000), attemptsLeft: 0 };
      } else {
        const lockoutData = {
          failedCount: newCount,
          lockedUntil: null,
          lastAttempt: now
        };
        localStorage.setItem(STORAGE_LOCKOUT_KEY, JSON.stringify(lockoutData));
        return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_FAILED_ATTEMPTS - newCount };
      }
    } catch (e) {
      return { isLocked: false, remainingSeconds: 0, attemptsLeft: 1 };
    }
  }

  /**
   * Clear failed attempt tracking on successful login
   */
  clearLockout() {
    try {
      localStorage.removeItem(STORAGE_LOCKOUT_KEY);
    } catch (e) {}
  }

  /**
   * Authenticate user with credentials
   * @param {string} username - Admin username (olflaz)
   * @param {string} password - Admin password (hamza18moza18)
   * @param {boolean} rememberMe - Whether to persist for 7 days
   */
  async login(username, password, rememberMe = false) {
    const lockout = this.getLockoutStatus();
    if (lockout.isLocked) {
      return {
        success: false,
        isLocked: true,
        remainingSeconds: lockout.remainingSeconds,
        error: `Security Lockout Active. Please wait ${lockout.remainingSeconds}s before retrying.`
      };
    }

    const cleanUser = (username || "").trim();
    const cleanPass = (password || "").trim();

    if (!cleanUser || !cleanPass) {
      return {
        success: false,
        error: "Please enter both username and password."
      };
    }

    const computed = await computeHash(cleanUser, cleanPass);

    if (computed === EXPECTED_HASH) {
      // Success! Clear any lockout records
      this.clearLockout();

      // Session Duration: 7 days if rememberMe, 24 hours otherwise
      const durationMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
      const now = Date.now();

      this.session = {
        username: "olflaz",
        displayName: "Olflaz Administrator",
        token: generateRandomToken(),
        loginTime: now,
        expiresAt: now + durationMs,
        rememberMe: Boolean(rememberMe)
      };

      const sessionStr = JSON.stringify(this.session);
      if (rememberMe) {
        localStorage.setItem(STORAGE_SESSION_KEY, sessionStr);
        sessionStorage.removeItem(STORAGE_SESSION_KEY);
      } else {
        sessionStorage.setItem(STORAGE_SESSION_KEY, sessionStr);
        localStorage.removeItem(STORAGE_SESSION_KEY);
      }

      this.notify();
      return {
        success: true,
        user: this.session
      };
    } else {
      // Invalid credentials
      const failInfo = this.registerFailedAttempt();
      if (failInfo.isLocked) {
        return {
          success: false,
          isLocked: true,
          remainingSeconds: failInfo.remainingSeconds,
          error: `Too many failed attempts. Security lockout active for ${failInfo.remainingSeconds}s.`
        };
      } else {
        return {
          success: false,
          isLocked: false,
          attemptsLeft: failInfo.attemptsLeft,
          error: `Invalid username or password. ${failInfo.attemptsLeft} attempt${failInfo.attemptsLeft === 1 ? '' : 's'} remaining.`
        };
      }
    }
  }

  /**
   * Terminate active authentication session
   */
  logout() {
    this.session = null;
    try {
      sessionStorage.removeItem(STORAGE_SESSION_KEY);
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch (e) {}
    this.notify();
  }

  /**
   * Redirect target handling for deep-linking
   */
  setRedirectTarget(url) {
    try {
      if (url && url !== "#/admin/login" && url !== "/admin/login") {
        sessionStorage.setItem(STORAGE_REDIRECT_KEY, url);
      }
    } catch (e) {}
  }

  getAndClearRedirectTarget() {
    try {
      const target = sessionStorage.getItem(STORAGE_REDIRECT_KEY);
      if (target) {
        sessionStorage.removeItem(STORAGE_REDIRECT_KEY);
        return target;
      }
    } catch (e) {}
    return "#/admin";
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.session);
      } catch (e) {
        console.error("Auth listener error:", e);
      }
    }
  }
}

export const authStore = new AuthStore();
