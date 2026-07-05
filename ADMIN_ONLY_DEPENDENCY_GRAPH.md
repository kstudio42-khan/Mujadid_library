# ADMIN_ONLY_DEPENDENCY_GRAPH.md

## 1. Which files actually depend on `dashboard.js`?
- `index.html`: Contains the dashboard navigation button (`navDashboardBtn`).
- `navigation.js`: References `dashboard` in `getPageFromHash` and `renderCurrentPage` and `syncMobileMenu`.
- `app.js`: Routes to `dashboard` via `renderCurrentPage`.
- `auth.js`: Logic to handle login/logout updates.
- `storage.js`: Persists user state, including `dashboard` data.

## 2. Can `dashboard.js` be deleted safely?
Yes, provided `navigation.js` and `app.js` are updated to remove references to the dashboard and the user dashboard link is removed from `index.html`.

## 3. Is `APP.currentUser` used anywhere outside Admin?
Yes:
- `auth.js`: Stores user data upon login.
- `navigation.js`: Renders navigation links based on user role (Admin link).
- `dashboard.js`: Displays profile information.
- `admin.js`: Checks role to protect admin access.

## 4. Is login required anywhere except Admin?
No. Per client requirements, visitors must never log in.

## 5. Which code will break if `register()` is removed?
- `auth.js`: The frontend `register()` function (must be removed).
- `backend/routes/auth.js`: `router.post('/register', register);` (must be removed).
- `backend/controllers/auth.js`: `exports.register` (must be removed).

## 6. Which code will break if `dashboard.js` is removed?
- `navigation.js`: Routing for `dashboard` will cause a 404 or default to home.
- `index.html`: Dashboard button will be broken or point to non-existent route.

## 7. Which code will break if `APP.currentUser` only stores an Admin?
- `auth.js`: `login()` needs modification to only allow Admin login.
- `dashboard.js`: Will be irrelevant (as it's for non-admin users).

## 8. Is `config.js` still required after removing registration?
Yes. It stores the `WHATSAPP_ADMIN_NUMBER` and acts as a central configuration object for the application state (`APP`), which is essential for Admin panel functionality.

## 9. Is the Admin Panel dependent on the User model?
Yes. The Admin Panel in `admin.js` checks `APP.currentUser.role` to determine if it should render or display "Access denied". This data is populated from the MongoDB `User` model.

## 10. Can the User model be simplified instead of removed?
Yes. It should be simplified to support only the Admin user (or a limited set of admin-only users) and store secure hash of admin credentials, removing any user-specific fields that are not needed for Admin authentication.
