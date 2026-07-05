// ==================== INDEXEDDB STORAGE ENGINE ====================
let idb = null;

function openIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(IDB_NAME, IDB_VERSION);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('files')) {
                db.createObjectStore('files', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('metadata')) {
                db.createObjectStore('metadata', { keyPath: 'key' });
            }
        };
        request.onsuccess = (e) => { idb = e.target.result; resolve(idb); };
        request.onerror = (e) => { console.error('IndexedDB error:', e.target.error); reject(e.target.error); };
    });
}

async function idbPut(storeName, data) {
    if (!idb) await openIDB();
    return new Promise((resolve, reject) => {
        const tx = idb.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.put(data);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

async function idbGet(storeName, key) {
    if (!idb) await openIDB();
    return new Promise((resolve, reject) => {
        const tx = idb.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

async function idbDelete(storeName, key) {
    if (!idb) await openIDB();
    return new Promise((resolve, reject) => {
        const tx = idb.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

async function idbGetAll(storeName) {
    if (!idb) await openIDB();
    return new Promise((resolve, reject) => {
        const tx = idb.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

async function storeFile(fileId, blob) {
    try {
        await idbPut('files', { id: fileId, blob: blob, timestamp: Date.now() });
        return fileId;
    } catch (e) {
        showToast('Storage full! Could not save file.', 'error');
        throw e;
    }
}

async function getFile(fileId) {
    try {
        const record = await idbGet('files', fileId);
        return record ? record.blob : null;
    } catch (e) {
        console.error('Error reading file:', e);
        return null;
    }
}

async function deleteFile(fileId) {
    await idbDelete('files', fileId);
}

async function saveState() {
    const metadata = {
        readingProgress: APP.readingProgress,
        bookmarks: APP.bookmarks,
        orders: APP.orders,
        purchasedBooks: APP.purchasedBooks,
        currentUser: APP.currentUser,
        language: APP.language,
        dbBooks: APP.dbBooks,
        dbUsers: APP.dbUsers,
        dbNotices: APP.dbNotices
    };
    try {
        await idbPut('metadata', { key: 'appState', data: metadata, timestamp: Date.now() });
    } catch (e) {
        try { localStorage.setItem('gulshan_state_backup', JSON.stringify(metadata)); } catch (e2) {}
    }
}

async function loadState() {
    try {
        const record = await idbGet('metadata', 'appState');
        if (record && record.data) {
            const state = record.data;
            APP.readingProgress = state.readingProgress || {};
            APP.bookmarks = state.bookmarks || {};
            APP.orders = state.orders || [];
            APP.purchasedBooks = state.purchasedBooks || [];
            // Articles/Competitions/Testimonials removed from persisted state
            APP.currentUser = state.currentUser || null;
            if (state.dbBooks) APP.dbBooks = state.dbBooks;
            // dbArticles and dbCompetitions removed
            if (state.dbUsers) APP.dbUsers = state.dbUsers;
            // dbTestimonials removed
            if (state.dbNotices) APP.dbNotices = state.dbNotices;
            if (state.language) APP.language = state.language;
            return;
        }
    } catch (e) {}
    try {
        const raw = localStorage.getItem('gulshan_state_backup');
        if (raw) {
            const state = JSON.parse(raw);
            APP.readingProgress = state.readingProgress || {};
            APP.bookmarks = state.bookmarks || {};
            APP.orders = state.orders || [];
            APP.purchasedBooks = state.purchasedBooks || [];
            // Articles/Competitions state fallback removed
            APP.currentUser = state.currentUser || null;
            if (state.dbBooks) APP.dbBooks = state.dbBooks;
            if (state.dbUsers) APP.dbUsers = state.dbUsers;
            if (state.dbNotices) APP.dbNotices = state.dbNotices;
            if (state.language) APP.language = state.language;
        }
    } catch (e) {}
}