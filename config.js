// ==================== APP CONFIG & STATE ====================
const IDB_NAME = 'GulshanLibraryDB';
const IDB_VERSION = 2;
const WHATSAPP_ADMIN_NUMBER = "+919921845486";
const API_URL = (window.location.hostname === 'localhost') ? 'http://localhost:5000/api' : '/api';

const APP = {
  language: 'en',
  currentUser: null,
  currentPage: 'home',
  readingProgress: {},
  bookmarks: {},
  orders: [],
  purchasedBooks: [],
  dbBooks: [],
  initialized: false
};