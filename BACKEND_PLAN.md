# BACKEND_PLAN: Migration to Full-Stack (Node.js/Express/MongoDB)

This document outlines the architectural migration of the current client-side application to a production-ready full-stack architecture.

---

## 1. Proposed Folder Structure
```text
/backend
├── /config        # Database connection, env variables
├── /controllers   # Business logic for endpoints
├── /middleware    # Auth (JWT), error handling, file upload
├── /models        # Mongoose schemas (User, Book, Order, Post, Notice)
├── /routes        # REST API route definitions
├── /utils         # Helper functions
├── app.js         # Express app entry
└── server.js      # Server initialization
```

---

## 2. Database Schema (Mongoose/MongoDB)
- **User:** `{ name, email, password (hashed), role, joinedDate }`
- **Book:** `{ title, titleUr, author, authorUr, type, category, price, pages, desc, descUr, content, rating, readers, coverFileId (GridFS), pdfFileId (GridFS), featured }`
- **Order:** `{ userId, bookId, status, total, orderDate }`
- **Post (Community):** `{ title, titleUr, desc, descUr, type, authorId, likes (array), comments (array) }`
- **Notice:** `{ title, content, date, expiryDate, priority, pinned }`

---

## 3. API Endpoints (REST)
- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`
- **Users:** `GET /api/users/me`, `PUT /api/users/me`
- **Books:** `GET /api/books`, `POST /api/books` (Admin), `PUT /api/books/:id` (Admin), `DELETE /api/books/:id` (Admin)
- **Files:** `GET /api/files/:id` (GridFS stream)
- **Orders:** `POST /api/orders`, `GET /api/orders/me`
- **Community:** `GET /api/posts`, `POST /api/posts`, `POST /api/posts/:id/like`, `POST /api/posts/:id/comment`
- **Notices:** `GET /api/notices`, `POST /api/notices` (Admin)

---

## 4. Migration Order
1. **Infrastructure:** Set up Node.js/Express boilerplate and MongoDB Atlas connection.
2. **Models & API:** Implement Mongoose schemas and REST endpoints for all data entities.
3. **Authentication:** Integrate JWT and `bcrypt`. Update frontend to handle token storage and request headers.
4. **Data Sync:** Create a migration script to export data from browser IndexedDB and import into MongoDB.
5. **Frontend Integration:** Refactor client-side `fetch` calls to replace internal DB operations (`idbPut`/`idbGet`) with API calls.
6. **File Migration:** Move files from IndexedDB to GridFS.

---

## 5. Deployment Plan
- **Backend:** Host on a PaaS (e.g., Render, Railway, or Fly.io).
- **Frontend:** Serve static files via Express static middleware or deploy to a CDN (e.g., Vercel, Netlify).
- **Database:** MongoDB Atlas (M0/M10 Cluster).
- **Environment:** Use `.env` for secrets (JWT_SECRET, MONGO_URI).

---

## 6. GitHub Workflow
- **CI:** Automated testing (Unit/Integration) on PRs.
- **CD:** Automatic deployment to staging/production upon merge to `main` branch.
- **Branches:** `feature/*`, `develop`, `main`.

---

## 7. Security Checklist
- [ ] JWT implementation (short-lived tokens, secure storage).
- [ ] Password hashing (bcrypt).
- [ ] Input validation (Joi or express-validator).
- [ ] CORS configuration.
- [ ] Rate limiting (express-rate-limit).
- [ ] Sensitive keys in `.env` (not committed).
- [ ] Helmet.js for header security.
- [ ] Admin route protection (RBAC middleware).
- [ ] GridFS security (restrict access/file types).
