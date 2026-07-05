// ==================== NAVIGATION (SPA) ====================
function navigateTo(page) {
    window.location.hash = page;
    document.getElementById('mobileMenu').classList.remove('open');
}

function getPageFromHash() {
    const hash = window.location.hash.replace('#', '');
    const validPages = ['home', 'books', 'about', 'contact', 'settings', 'admin', 'notices'];
    return validPages.includes(hash) ? hash : 'home';
}

function renderCurrentPage() {
    const page = getPageFromHash();
    APP.currentPage = page;
    updateActiveNavLink(page);
    const contentDiv = document.getElementById('pageContent');
    if (!contentDiv) return;
    switch (page) {
        case 'home': renderHome(contentDiv); break;
        case 'books': renderBooksPage(contentDiv); break;
        // Competitions and Articles removed
        case 'about': renderAboutPage(contentDiv); break;
        case 'contact': renderContactPage(contentDiv); break;
        case 'settings': renderSettings(contentDiv); break;
        case 'admin': renderAdmin(contentDiv); break;
        case 'notices': renderNoticesPage(contentDiv); break;
    }
    syncMobileMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateActiveNavLink(page) {
    document.querySelectorAll('#navLinks a').forEach(link => {
        const pageAttr = link.getAttribute('data-page');
        if (pageAttr === page) link.classList.add('active');
        else link.classList.remove('active');
    });
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('open');
    if (menu.classList.contains('open')) syncMobileMenu();
}

function syncMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (!menu) return;
    const pages = [
        { key: 'home', label: t('navHome'), file: '#home' },
        { key: 'books', label: t('navBooks'), file: '#books' },
        // Competitions and Articles removed from mobile menu
        { key: 'about', label: t('navAbout'), file: '#about' },
        { key: 'notices', label: t('navNotices'), file: '#notices' },
        { key: 'contact', label: t('navContact'), file: '#contact' }
    ];
    menu.innerHTML = pages.map(p => `<a href="${p.file}">${p.label}</a>`).join('');
    if (APP.currentUser && APP.currentUser.role === 'admin') {
        menu.innerHTML += `<a href="#admin" style="color:var(--accent);">${t('adminTitle')}</a>`;
    }
    menu.innerHTML += `<a href="#settings" style="color:var(--gray-500);">${t('settingsTitle')}</a>`;
}