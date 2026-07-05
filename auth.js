// ==================== AUTH ====================
const API_URL = 'http://localhost:5000/api';

async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    return fetch(url, { ...options, headers });
}

async function login() {
    const email = document.getElementById('loginEmail')?.value?.trim();
    const password = document.getElementById('loginPassword')?.value?.trim();
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            APP.currentUser = data.user;
            saveState();
            closeModalDirect();
            showToast(`Welcome back, ${data.user.name}! 👋`, 'success');
            updateAllTexts();
            renderCurrentPage();
        } else {
            showToast(data.message || 'Login failed.', 'error');
        }
    } catch (e) { showToast('Connection error.', 'error'); }
}

async function register() {
    const name = document.getElementById('regName')?.value?.trim();
    const email = document.getElementById('regEmail')?.value?.trim();
    const password = document.getElementById('regPassword')?.value?.trim();
    if (!name || !email || !password) { showToast('Please fill all fields.', 'error'); return; }
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            APP.currentUser = data.user;
            saveState();
            closeModalDirect();
            showToast(`Welcome, ${name}! Account created. 🎉`, 'success');
            updateAllTexts();
            renderCurrentPage();
        } else {
            showToast(data.message || 'Registration failed.', 'error');
        }
    } catch (e) { showToast('Connection error.', 'error'); }
}

function logout() {
    APP.currentUser = null;
    localStorage.removeItem('token');
    const adminLink = document.getElementById('navAdminLink');
    if (adminLink) adminLink.parentElement.remove();
    saveState();
    showToast('Logged out successfully.', 'info');
    updateAllTexts();
    renderCurrentPage();
}
