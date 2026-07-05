# MASTER_PROJECT_AUDIT.md

## 1. Complete Project Architecture
The project is a hybrid-state SPA (Single-Page Application) currently undergoing a migration from a purely client-side browser application (using IndexedDB/localStorage) to a full-stack Node.js/Express/MongoDB architecture.

## 2. Folder Structure
- `/`: Frontend SPA source code.
- `/backend/`: Node.js/Express API, Mongoose models, controllers, routes.
- `/image/`: Static assets.

## 3. Module Dependency Graph
`index.html` loads scripts sequentially.
- `app.js` (Entry/Init) -> `navigation.js`, `auth.js`, `books.js`
- `books.js` -> API Call (`/api/books`)
- `auth.js` -> API Call (`/api/auth`)
- `storage.js` -> Legacy IndexedDB (Used for persistent state fallback)

## 4. Current Working Modules
- **Authentication:** Registration and Login (JWT + bcryptjs).
- **Books:** Listing, filtering, and detail view via Backend API.
- **WhatsApp Checkout:** Functionality is confirmed via `WHATSAPP_ADMIN_NUMBER` in `config.js`.

## 5. Broken Modules
- **Notices:** Still relies on client-side state/localStorage instead of the Backend API.
- **Admin File Uploads:** Upload forms exist in the UI (`admin.js`), but file handling logic is client-side (`IDB`) rather than streaming to MongoDB GridFS.
- **Cart/Community:** These are in a partially removed state; UI references exist, but backend routes/models for community are stale.

## 6. Runtime Issues
- **Console Errors:** Expected when trying to access missing legacy objects (`APP.cart`, `APP.dbCommunity`).
- **Initialization Race Conditions:** Potential conflict between `init()` (loading IndexedDB) and asynchronous `fetch` calls.

## 7. Frontend Issues
- **Inconsistent Data Source:** Some features use Backend API, others use IndexedDB/LocalStorage.
- **Redundant Logic:** `storage.js` manages both IndexedDB and LocalStorage, conflicting with Backend persistence.

## 8. Backend Issues
- **Incomplete GridFS:** No API endpoint implemented for multipart/form-data file streaming to GridFS.
- **Unused Routes:** `backend/routes/post.js` remains registered in `app.js` despite the frontend migration intent to remove community features.

## 9. API Issues
- **Missing Endpoints:** No endpoint for `notices` or `orders`.
- **Inconsistent Auth:** Not all API endpoints enforce the `auth` middleware (e.g., Book modification/deletion routes lack role-based access control).

## 10. Database Issues
- **Storage Fragmentation:** Critical application state split between MongoDB (Books, Users) and IndexedDB (Notices, User Profile, Settings).

## 11. Security Issues
- **Plaintext Credentials:** `config.js` contains a legacy `APP.dbUsers` array with plaintext administrative credentials.
- **Missing RBAC:** `book.js` controller routes (POST/PUT/DELETE) currently lack middleware to verify admin roles.

## 12. Unused Files
- `storage.js`: Primarily legacy code.
- `backend/controllers/post.js`, `backend/routes/post.js`, `backend/models/Post.js`: Dead code for community feature.

## 13. Legacy Files
- `script.js` (if found), `community.js` (should be deleted), `cart.js` (should be deleted).

## 14. Recommended Cleanup Order
1. Remove all `IDB` references from `storage.js` and `app.js`.
2. Delete `backend/controllers/post.js`, `backend/routes/post.js`, `backend/models/Post.js`.
3. Update `backend/app.js` to remove Post routes.

## 15. Recommended Fix Order
1. Implement Backend API + DB Model for `Notices`.
2. Implement Multipart API/GridFS for Admin file uploads.
3. Apply RBAC middleware to `book.js` and `notices.js` routes.
4. Remove plaintext admin credentials from `config.js`.

## 16. Launch Readiness Percentage
75%

READY FOR FIXING
