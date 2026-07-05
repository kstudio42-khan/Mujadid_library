# ADMIN_AUTH_REPORT.md

## 1. Authentication Architecture Assessment
The current architecture includes general user registration and login endpoints in `backend/routes/auth.js` (`/register`, `/login`) and corresponding frontend logic in `auth.js`. These are not required by the client’s revised requirement, which mandates an admin-only authentication model. Visitors only need public access to browsing books and WhatsApp ordering.

## 2. Recommended Changes (Removal Plan)
### Frontend
- **Remove:** `register()` function in `auth.js`.
- **Remove:** Any UI elements (HTML buttons/forms) triggering registration.
- **Keep:** `login()` function in `auth.js`, but restrict its scope to Admin authentication only (or implement a single admin login path).
- **Remove:** User-related state from `APP.currentUser` or adjust to only support an Admin user object.

### Backend
- **Remove:** `POST /api/auth/register` route and its controller logic.
- **Remove:** `User` model dependency on general registration.
- **Keep:** `POST /api/auth/login` but ensure it only permits the defined Admin credentials.

## 3. Safe Removal Strategy
- Registration logic is entirely unused by the intended Admin-only workflow and can be safely deleted.
- Frontend registration forms can be removed without affecting public browsing or WhatsApp ordering.

## 4. Admin API Authorization
Currently, Admin-only APIs lack authorization middleware. The following endpoints must be protected:
- `POST /api/books`
- `PUT /api/books/:id`
- `DELETE /api/books/:id`
- Any future `notices` management API.

## 5. Public APIs
The following APIs should remain public:
- `GET /api/books`
- `GET /api/books/:id`
- `GET /api/health`

## 6. Actionable Steps
1. Delete registration routes (`backend/routes/auth.js`) and controllers (`backend/controllers/auth.js`).
2. Update `auth.js` (frontend) to remove registration UI and logic.
3. Add a new `adminAuth` middleware to the backend that verifies JWT AND the `admin` role.
4. Apply `adminAuth` to all book management routes in `backend/routes/book.js`.
5. Remove plaintext admin credentials from `config.js` and move to environment variables.
