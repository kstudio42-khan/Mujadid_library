// ==================== APP CONFIG & STATE ====================
const IDB_NAME = 'GulshanLibraryDB';
const IDB_VERSION = 2;
const WHATSAPP_ADMIN_NUMBER = "+919921845486";

const APP = {
  language: 'en',
  currentUser: null,
  currentPage: 'home',
  readingProgress: {},
  bookmarks: {},
  orders: [],
  purchasedBooks: [],
  dbBooks: [],
  dbUsers: [
    { id: 'u1', name: 'Admin User', email: 'admin@gulshan.com', password: 'admin123', role: 'admin', joined: '2024-01-15' }
  ],
  initialized: false
};