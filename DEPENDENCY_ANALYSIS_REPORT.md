# DEPENDENCY_ANALYSIS_REPORT.md

## 1. Files Related to User Registration
- `backend/routes/auth.js`: Contains `router.post('/register', register);`
- `backend/controllers/auth.js`: Contains `exports.register` function.
- `auth.js`: Contains frontend `register()` function and related form handling logic.
- `full_test_suite.py`: Contains registration API test cases.

## 2. Files Related to User Login
- `backend/routes/auth.js`: Contains `router.post('/login', login);`
- `backend/controllers/auth.js`: Contains `exports.login` function.
- `auth.js`: Contains frontend `login()` function and related form handling logic.
- `dashboard.js`: Relies on `APP.currentUser` populated by the login process.
- `admin.js`: Relies on `APP.currentUser` populated by the login process.

## 3. Files Required for Admin Login
- `backend/routes/auth.js`: Need to retain and modify `router.post('/login', login);`.
- `backend/controllers/auth.js`: Need to retain and modify `exports.login` (add role check).
- `auth.js`: Need to retain `login()` (with modified logic for Admin role check).
- `config.js`: Currently contains admin credentials (needs to be moved to ENV variables).

## 4. Backend Routes Safely Removable
- `POST /api/auth/register` (in `backend/routes/auth.js`)

## 5. Frontend UI Safely Removable
- Registration forms/buttons (in `auth.js` / HTML templates).
- Dashboard link/page (in `navigation.js`, `dashboard.js`, `index.html`).

## 6. Dependencies Affected by Removing Registration
- `backend/models/User.js`: Needs to be retained for Admin model, but registration-related validation logic can be cleaned up.
- `auth.js`: Frontend logic for registration.
- `index.html`: Navigation links to dashboard.
- `dashboard.js`: Entire file can be removed if user dashboard is fully eliminated.

## 7. Confirmation: Buy Now → WhatsApp
- The `Buy Now` → `WhatsApp` flow does not depend on the `auth` module. It is a client-side action that constructs a URL with the `WHATSAPP_ADMIN_NUMBER` from `config.js`. It will remain fully functional.

## 8. Confirmation: Admin Panel
- The Admin Panel will continue to work, provided the `login()` function in `auth.js` is updated to exclusively authorize the Admin user and properly populate `APP.currentUser` upon successful login.
