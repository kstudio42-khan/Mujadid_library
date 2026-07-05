# Implementation Plan - Remove Community and Cart

## 1. Research & Analysis (Completed)
- Identified all files and references related to Community and Cart modules.
- Confirmed "Buy Now" (WhatsApp) logic is separate and will be preserved.

## 2. Frontend Removal
### Files to Delete
- `community.js`
- `cart.js`

### Files to Modify
- `index.html`:
    - Remove "Community" nav link.
    - Remove Cart button and badge.
    - Remove `<script>` tags for `community.js` and `cart.js`.
- `navigation.js`:
    - Remove `community` and `cart` from `validPages`.
    - Remove `community` and `cart` cases from `renderCurrentPage`.
    - Remove `community` and `cart` from `syncMobileMenu`.
    - Delete `updateCartBadge` function.
- `app.js`:
    - Remove calls to `updateCartBadge()`.
- `config.js`:
    - Remove `cart: []` and `dbCommunity: []` from `APP` object.
- `storage.js`:
    - Remove `cart` and `dbCommunity` from `saveState` and `loadState`.
- `admin.js`:
    - Remove "Manage Community Updates" section from `renderAdmin`.
    - Remove all community-related functions (`showAddCommunityForm`, `addNewCommunity`, `editCommunity`, `saveEditCommunity`, `deleteCommunity`).
- `translations.js`:
    - Remove keys: `navCommunity`, `communityTitle`, `addToCart`, `cartTitle`, `emptyCart`, `checkout`, `totalLabel`.
- `style.css`:
    - Remove `.nav-cart-btn` and `.cart-badge` styles.

## 3. Backend Removal
### Files to Delete
- `backend/routes/post.js`
- `backend/controllers/post.js`
- `backend/models/Post.js`
- `backend/test_community.py`
- `backend/test_community_final.py`

### Files to Modify
- `backend/app.js`:
    - Remove `postRoutes` import and `app.use("/api/posts", postRoutes)`.

## 4. Documentation & Miscellaneous Removal
- Delete `COMMUNITY_FINAL_TEST_REPORT.md`
- Delete `COMMUNITY_MIGRATION_REPORT.md`
- Update `PROJECT_ANALYSIS.md` (remove Cart/Community mentions)
- Update `BACKEND_PLAN.md` (remove Post mentions)

## 5. Verification
- Verify Home page loads.
- Verify Login/Registration works.
- Verify Books load.
- Verify "Buy Now" opens WhatsApp with correct number and message.
- Verify Admin panel works.
- Check browser console for errors.
- Run backend and check for startup errors.

## 6. Final Report
- Generate `PROJECT_CLEANUP_REPORT.md`.
- Create Git commit.
