/**
 * Lightweight Client-Side Hash Router
 * Supports static and parameterized routes with regex matching.
 */

export class Router {
  constructor() {
    this.routes = [];
    this.guards = [];
    this.currentRoute = null;
    this.currentParams = {};
    this.notFoundHandler = null;

    window.addEventListener("hashchange", () => this.handleRouteChange());
    window.addEventListener("load", () => this.handleRouteChange());
  }

  /**
   * Register a route with pattern and handler function
   * @param {string} path - e.g. "/", "/projects", "/project/:id", "/admin/videos"
   * @param {Function} handler - View render callback
   */
  addRoute(path, handler) {
    const paramNames = [];
    // Convert path pattern to regex: "/project/:id" -> /^\/project\/([^/]+)$/
    const pattern = path
      .replace(/:([a-zA-Z0-9_]+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return "([^/]+)";
      })
      .replace(/\//g, "\\/");

    const regex = new RegExp(`^#?${pattern}$`);

    this.routes.push({
      path,
      regex,
      paramNames,
      handler
    });
    return this;
  }

  /**
   * Add navigation guard hook
   * @param {Function} guard - (toHash, fromPath) => boolean | string (redirect path) | Promise<boolean|string>
   */
  beforeEach(guard) {
    this.guards.push(guard);
    return this;
  }

  setNotFound(handler) {
    this.notFoundHandler = handler;
    return this;
  }

  /**
   * Parse current window hash and execute matching route handler
   */
  async handleRouteChange() {
    let hash = window.location.hash || "#/";
    if (!hash.startsWith("#")) hash = "#" + hash;

    // Run beforeEach guards
    for (const guard of this.guards) {
      try {
        const guardResult = await guard(hash, this.currentRoute);
        if (guardResult === false) {
          // Cancel navigation
          return;
        } else if (typeof guardResult === "string" && guardResult !== hash) {
          // Redirect to target
          this.navigate(guardResult);
          return;
        }
      } catch (err) {
        console.error("Router guard execution error:", err);
      }
    }

    // Scroll to top on navigation
    window.scrollTo(0, 0);

    for (const route of this.routes) {
      const match = hash.match(route.regex);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, index) => {
          params[name] = decodeURIComponent(match[index + 1]);
        });
        this.currentRoute = route.path;
        this.currentParams = params;
        route.handler(params);
        return;
      }
    }

    if (this.notFoundHandler) {
      this.currentRoute = "404";
      this.currentParams = {};
      this.notFoundHandler(hash);
    }
  }

  /**
   * Programmatically navigate to a route
   */
  navigate(path) {
    let target = path;
    if (!target.startsWith("#")) {
      target = "#" + (target.startsWith("/") ? target : "/" + target);
    }
    if (window.location.hash === target) {
      this.handleRouteChange();
    } else {
      window.location.hash = target;
    }
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

  getParams() {
    return this.currentParams;
  }
}

export const router = new Router();
