// ==================== DASHBOARD & SETTINGS ====================
function renderDashboard(container) {
    if (!APP.currentUser) {
        container.innerHTML = `<div style="text-align:center;padding:3rem;"><h3>Please log in to view your dashboard.</h3><button class="btn btn-primary btn-lg" onclick="showLoginModal()">🔐 Login</button></div>`;
        return;
    }
    const user = APP.currentUser;
    const purchased = APP.dbBooks.filter(b => APP.purchasedBooks.includes(b.id));
    const bookmarksList = Object.entries(APP.bookmarks).map(([bid, page]) => {
        const b = APP.dbBooks.find(bb => bb.id === bid);
        return b ? `<li>📖 ${escapeHTML(getBookTitle(b))} — Page ${page} <button class="btn btn-sm btn-outline" onclick="openPDFNewTab('${b.id}')">Open</button></li>` : '';
    }).join('');
    // Competition applications removed
    container.innerHTML = `
    <section class="page-section active">
      <h2 class="section-title">${t('dashboardTitle')}</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;">
        <div class="card"><h3>👤 Profile</h3><p><strong>Name:</strong> ${escapeHTML(user.name)}</p><p><strong>Email:</strong> ${escapeHTML(user.email)}</p><p><strong>Joined:</strong> ${escapeHTML(user.joined)}</p><p><strong>Role:</strong> ${escapeHTML(user.role)}</p><button class="btn btn-outline btn-sm" onclick="navigateTo('settings')">⚙️ Settings</button> <button class="btn btn-danger btn-sm" onclick="logout()">🚪 Logout</button></div>
        <div class="card"><h3>📚 Purchased Books</h3>${purchased.length?purchased.map(b=>`<p>📖 ${escapeHTML(getBookTitle(b))} <button class="btn btn-sm btn-primary" onclick="openPDFNewTab('${b.id}')">Read</button></p>`).join(''):'<p>No purchases yet.</p>'}</div>
        <div class="card"><h3>📦 Orders</h3>${APP.orders.length?APP.orders.map(o=>`<p>🛒 ${escapeHTML(o.id)} — Rs.${o.total} — ${escapeHTML(o.status)}</p>`).join(''):'<p>No orders yet.</p>'}</div>
        <div class="card"><h3>🔖 Bookmarks</h3>${bookmarksList||'<p>No bookmarks yet.</p>'}</div>
        <!-- Competition Applications and Submitted Articles removed -->
        ${user.role==='admin'?`<div class="card" style="border:2px solid var(--accent);"><h3>🔧 Admin</h3><button class="btn btn-accent" onclick="navigateTo('admin')">Open Admin Panel</button></div>`:''}
      </div>
    </section>`;
}

function renderSettings(container) {
    container.innerHTML = `
    <section class="page-section active">
      <h2 class="section-title">${t('settingsTitle')}</h2>
      <div class="form-container">
        <h3>🌐 Language</h3><p>Current: <strong>${APP.language==='en'?'English':'اردو'}</strong></p>
        <button class="btn btn-outline" onclick="setLanguage('en')">🇬🇧 English</button>
        <button class="btn btn-outline" onclick="setLanguage('ur')" style="font-family:var(--font-urdu);">🇵🇰 اردو</button>
        <hr style="margin:1.5rem 0;">
        <h3>👤 Profile Settings</h3>
        ${APP.currentUser?`
          <div class="form-group"><label>Name</label><input type="text" id="setName" value="${escapeHTML(APP.currentUser.name)}"></div>
          <div class="form-group"><label>Email</label><input type="email" id="setEmail" value="${escapeHTML(APP.currentUser.email)}"></div>
          <button class="btn btn-primary" onclick="updateProfile()">Update Profile</button>
        `:'<p>Login to update profile.</p>'}
        <hr style="margin:1.5rem 0;"><h3>🎨 Theme</h3><p>Reader dark mode is toggled inside the reader.</p>
        <hr style="margin:1.5rem 0;"><h3>🔒 Privacy</h3><p>Your data is stored locally in your browser using IndexedDB.</p>
      </div>
    </section>`;
}

function updateProfile() {
    if (!APP.currentUser) return;
    const nameInput = document.getElementById('setName');
    const emailInput = document.getElementById('setEmail');
    if (nameInput) APP.currentUser.name = nameInput.value.trim() || APP.currentUser.name;
    if (emailInput) APP.currentUser.email = emailInput.value.trim() || APP.currentUser.email;
    const userIndex = APP.dbUsers.findIndex(u => u.id === APP.currentUser.id);
    if (userIndex > -1) {
        APP.dbUsers[userIndex].name = APP.currentUser.name;
        APP.dbUsers[userIndex].email = APP.currentUser.email;
    }
    saveState();
    showToast('Profile updated!', 'success');
    renderCurrentPage();
}