// ==================== INITIALIZATION & STARTUP ====================
async function init() {
    await openIDB();
    await loadState();
    APP.initialized = true;
    const savedLang = localStorage.getItem('gulshan_language');
    if (savedLang) {
        APP.language = savedLang;
        document.getElementById('langScreen').classList.add('hidden');
        showApp();
    }
    updateAllTexts();
    window.addEventListener('hashchange', () => {
        if (APP.initialized) renderCurrentPage();
    });
    if (window.location.hash) {
        renderCurrentPage();
    } else {
        navigateTo('home');
    }
}

async function setLanguage(lang) {
    try {
        APP.language = lang;
        localStorage.setItem('gulshan_language', lang);
        const langScreen = document.getElementById('langScreen');
        if (!langScreen) return;
        langScreen.classList.add('hidden');
        if (lang === 'ur') {
            document.body.classList.add('rtl');
            document.body.dir = 'rtl';
            document.documentElement.lang = 'ur';
            document.documentElement.dir = 'rtl';
        } else {
            document.body.classList.remove('rtl');
            document.body.dir = 'ltr';
            document.documentElement.lang = 'en';
            document.documentElement.dir = 'ltr';
        }
        if (!APP.initialized) await init();
        if (document.getElementById('mainNav').style.display === 'flex') {
            updateAllTexts();
            renderCurrentPage();
            syncMobileMenu();
        } else {
            showApp();
        }
        await saveState();
    } catch (error) {
        console.error('Error in setLanguage:', error);
    }
}

function showApp() {
    document.getElementById('mainNav').style.display = 'flex';
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('mainFooter').style.display = 'block';
    if (APP.language === 'ur') {
        document.body.classList.add('rtl');
        document.body.dir = 'rtl';
        document.documentElement.lang = 'ur';
        document.documentElement.dir = 'rtl';
    }
    renderCurrentPage();
    syncMobileMenu();
}

// ==================== GLOBAL EVENT LISTENERS ====================
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeModalDirect();
        document.getElementById('mobileMenu').classList.remove('open');
    }
});

async function startApp() {
    document.getElementById('langBtnEn').addEventListener('click', () => setLanguage('en'));
    document.getElementById('langBtnUr').addEventListener('click', () => setLanguage('ur'));
    await init();
    setTimeout(lazyLoadCovers, 300);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}

document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor && anchor.getAttribute('href') !== '#') {
        e.preventDefault();
        const page = anchor.getAttribute('href').replace('#', '');
        navigateTo(page);
    }
});

setInterval(() => {
    if (APP.initialized) saveState();
}, 15000);