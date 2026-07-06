// ==================== AUTH ====================

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
            
            // Refresh navigation UI
            const navLinks = document.getElementById('navLinks');
            const navLogin = document.getElementById('navLogin');
            if (navLogin) navLogin.parentElement.remove();
            if (!document.getElementById('navAdminLink')) {
                const li = document.createElement('li');
                li.innerHTML = `<a href="#admin" id="navAdminLink" style="color:var(--accent);font-weight:600;">🔧 ${t('adminTitle')}</a>`;
                navLinks.appendChild(li);
            }
            
            updateAllTexts();
            renderCurrentPage();
        } else {
            showToast(data.message || 'Login failed.', 'error');
        }
    } catch (e) { showToast('Connection error.', 'error'); }
}

function logout() {
    APP.currentUser = null;
    localStorage.removeItem('token');
    
    // Restore login button
    const adminLink = document.getElementById('navAdminLink');
    if (adminLink) {
        adminLink.parentElement.remove();
        const li = document.createElement('li');
        li.innerHTML = `<a href="#" onclick="showLoginModal()" id="navLogin">Admin Login</a>`;
        document.getElementById('navLinks').appendChild(li);
    }
    
    saveState();
    showToast('Logged out successfully.', 'info');
    updateAllTexts();
    renderCurrentPage();
}
