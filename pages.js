// ==================== STATIC PAGE RENDERERS ====================
function renderHome(container) {
    const featured = APP.dbBooks.filter(b => b.featured).slice(0, 6);
    const latest = [...APP.dbBooks].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)).slice(0, 6);
    container.innerHTML = `
    <section class="page-section active" id="page-home">
      <div class="hero">
        <h1 id="heroTitle">${t('heroTitle')}</h1>
        <p id="heroDesc">${t('heroDesc')}</p>
        <div class="hero-buttons">
          <button class="btn btn-primary btn-lg" onclick="navigateTo('books')">${t('heroBrowseBtn')}</button>
        </div>
      </div>
      <div class="stats-row" id="statsRow">
        <div class="stat-card"><div class="stat-num">${APP.dbBooks.length}</div><div class="stat-label">${t('statBooks')}</div></div>
        <div class="stat-card"><div class="stat-num">${APP.dbUsers.length}</div><div class="stat-label">${t('statUsers')}</div></div>
        <div class="stat-card"><div class="stat-num">${APP.dbUsers.length}</div><div class="stat-label">${t('statUsers')}</div></div>
      </div>
      <h2 class="section-title">${t('featBooksTitle')}</h2>
      <div class="card-grid" id="featuredBooksGrid">${featured.length ? featured.map(b => bookCard(b)).join('') : '<p style="color:gray;">No featured books yet.</p>'}</div>
      <h2 class="section-title" style="margin-top:2rem;">${t('latestBooksTitle')}</h2>
      <div class="card-grid" id="latestBooksGrid">${latest.length ? latest.map(b => bookCard(b)).join('') : '<p style="color:gray;">No books added yet.</p>'}</div>
      <!-- Testimonials removed -->
      <div style="background:var(--primary-light);border-radius:var(--radius-xl);padding:2rem;text-align:center;margin-top:2rem;">
        <h3>${t('newsletterTitle')}</h3>
        <p style="color:var(--gray-600);">${t('newsletterDesc')}</p>
        <div style="display:flex;gap:0.5rem;max-width:450px;margin:1rem auto 0;flex-wrap:wrap;justify-content:center;">
          <input type="email" placeholder="your@email.com" id="newsletterEmail" style="flex:1;min-width:200px;padding:0.7rem;border:2px solid var(--gray-300);border-radius:var(--radius);font-family:inherit;">
          <button class="btn btn-primary" onclick="subscribeNewsletter()">${t('newsletterBtn')}</button>
        </div>
      </div>
    </section>`;
    setTimeout(lazyLoadCovers, 100);
}

function renderAboutPage(container) {
    container.innerHTML = `
    <section class="page-section active">
        <h2 class="section-title">${t('aboutTitle')}</h2>
        <div class="about-content" style="background:var(--white); padding:2rem; border-radius:var(--radius-lg); box-shadow:var(--shadow); line-height:1.8;">
            ${t('aboutContent')}
        </div>
    </section>`;
}

function renderContactPage(container) {
    container.innerHTML = `
    <section class="page-section active">
      <h2 class="section-title">${t('contactTitle')}</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;">
        <div style="background:var(--white);padding:1.5rem;border-radius:var(--radius-lg);box-shadow:var(--shadow);">
          <h3>📍 ${t('contactAddress')}</h3>
          <p>${t('contactAddressLine1')}<br>${t('contactAddressLine2')}<br>${t('contactAddressLine3')}<br>${t('contactAddressLine4')}<br>${t('contactAddressLine5')}</p>
        </div>
        <div style="background:var(--white);padding:1.5rem;border-radius:var(--radius-lg);box-shadow:var(--shadow);">
          <h3>📞 ${t('contactPhone')}</h3>
          <p>${t('contactPhone1')}</p>
        </div>
        <div style="background:var(--white);padding:1.5rem;border-radius:var(--radius-lg);box-shadow:var(--shadow);">
          <h3>💬 ${t('contactWhatsApp')}</h3>
          <p>${t('contactWhatsAppBusiness')}<br>${t('contactWhatsAppGroup')}: <a href="#" style="color:var(--primary);">${t('contactWhatsAppGroup')}</a></p>
        </div>
      </div>
      <div class="social-links" style="margin-top:1.5rem;flex-wrap:wrap;">
        <a href="https://www.facebook.com/share/18sHA7vtwL/" target="_blank" rel="noopener" style="background:#1877f2;">📘 Facebook</a>
        <a href="https://www.instagram.com/tamizuddin.shaikh?igsh=MXJkYWZ1NXRzZjVkdQ==" target="_blank" rel="noopener" style="background:#e4405f;">📷 Instagram</a>
        <a href="#" style="background:#ff0000;">▶️ YouTube</a>
      </div>
    </section>`;
}