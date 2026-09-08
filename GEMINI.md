# Project Guidelines & Automation Rules

## 1. Automatic GitHub Sync
- **Repository Target**: `https://github.com/NotOlflaz/mywebsite`
- **Branch**: `main`
- **Rule**: Whenever any changes, features, or fixes are implemented in this repository, **ALWAYS automatically stage, commit, and push the changes** using the automated script or git command:
  ```powershell
  powershell -ExecutionPolicy Bypass -File .\push.ps1 -Message "feat: <description>"
  ```

## 2. Admin Authentication
- **Admin Username**: `olflaz`
- **Admin Password**: `hamza18moza18`
- **Route Guard**: All `#/admin/*` routes must remain guarded by `js/store/auth.js` and `js/router/router.js`.
