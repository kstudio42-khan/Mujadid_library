// ==================== BOOKS ====================

async function fetchBooks() {
    try {
        const response = await fetch(`${API_URL}/books`);
        return await response.json();
    } catch (e) {
        console.error('Error fetching books:', e);
        return [];
    }
}

async function renderBooksPage(container) {
    const savedFilter = sessionStorage.getItem('bookFilter') || 'all';
    sessionStorage.removeItem('bookFilter');
    
    // Fetch from backend
    APP.dbBooks = await fetchBooks();
    
    container.innerHTML = `
    <section class="page-section active" id="page-books">
      <h2 class="section-title">${t('booksPageTitle')}</h2>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1.5rem;">
        <input type="text" id="bookSearchInput" placeholder="${t('searchPlaceholder')}" oninput="filterAndRenderBooks()" style="flex:1;min-width:200px;padding:0.7rem;border:2px solid var(--gray-300);border-radius:var(--radius);font-family:inherit;">
        <select id="bookFilterType" onchange="filterAndRenderBooks()" style="padding:0.7rem;border:2px solid var(--gray-300);border-radius:var(--radius);font-family:inherit;">
          <option value="all">${t('allTypes')}</option>
          <option value="free">${t('freeType')}</option>
          <option value="physical">${t('physicalType')}</option>
          <option value="pdf">${t('pdfType')}</option>
        </select>
      </div>
      <div class="card-grid" id="allBooksGrid"></div>
    </section>`;
    document.getElementById('bookFilterType').value = savedFilter;
    filterAndRenderBooks();
    setTimeout(lazyLoadCovers, 100);
}

function filterAndRenderBooks() {
    const search = (document.getElementById('bookSearchInput')?.value || '').toLowerCase();
    const filter = document.getElementById('bookFilterType')?.value || 'all';
    let books = APP.dbBooks;
    if (filter !== 'all') {
        if (filter === 'pdf') books = books.filter(b => b.hasPdf && b.pdfFileId);
        else books = books.filter(b => b.type === filter);
    }
    if (search) books = books.filter(b => getBookTitle(b).toLowerCase().includes(search) || getBookAuthor(b).toLowerCase().includes(search) || (b.category || '').toLowerCase().includes(search));
    const grid = document.getElementById('allBooksGrid');
    if (grid) grid.innerHTML = books.length ? books.map(b => bookCard(b)).join('') : `<p style="text-align:center;padding:2rem;color:var(--gray-500);">${t('noResults')}</p>`;
    setTimeout(lazyLoadCovers, 100);
}

function bookCard(book) {
    const title = escapeHTML(getBookTitle(book));
    const author = escapeHTML(getBookAuthor(book));
    let badge = '';
    let actionBtns = '';
    const coverDisplay = book.coverPhotoFileId ?
        `<img data-fileid="${book.coverPhotoFileId}" class="cover-photo lazy-cover" alt="${title}" style="display:none;width:100%;height:100%;object-fit:cover;position:absolute;inset:0;" onload="this.style.display='block';this.nextElementSibling.style.display='none';" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">` +
        `<span class="book-emoji">${book.coverEmoji || '📖'}</span>` :
        `<span class="book-emoji">${book.coverEmoji || '📖'}</span>`;

    if (book.type === 'free') {
        badge = `<span class="card-badge badge-free">${t('freeLabel')}</span>`;
        actionBtns = `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();openPDFNewTab('${book.id}')">${t('readNow')}</button>`;
        if (book.hasPdf && book.pdfFileId) {
            actionBtns += `<button class="btn btn-download btn-sm" onclick="event.stopPropagation();downloadPDF('${book.id}')">${t('downloadPDF')}</button>`;
        }
    } else {
        badge = `<span class="card-badge badge-physical">${t('physicalLabel')}</span>`;
        actionBtns = `<button class="btn btn-outline btn-sm" onclick="event.stopPropagation();orderPhysicalWhatsApp('${book.id}')">${t('orderNow')}</button>`;
    }
    const pdfIndicator = (book.hasPdf && book.pdfFileId) ? '<span class="card-badge badge-pdf">PDF</span>' : '';
    return `
    <div class="card" onclick="showBookDetail('${book.id}')" role="button" tabindex="0" aria-label="${title}">
      <div class="card-img" style="position:relative;">${coverDisplay}${badge}${pdfIndicator}</div>
      <div class="card-body">
        <h3>${title}</h3>
        <span class="author">${author}</span>
        <span class="price ${book.type==='free'?'free':''}">${book.type==='free'?t('freeLabel'):'Rs.'+book.price}</span>
        <p style="font-size:0.8rem;color:var(--gray-500);">⭐${book.rating||0} | ${book.readers||0} readers</p>
        <div class="card-actions">${actionBtns}</div>
      </div>
    </div>`;
}

async function lazyLoadCovers() {
    const imgs = document.querySelectorAll('img.lazy-cover[data-fileid]');
    for (const img of imgs) {
        const fileId = img.getAttribute('data-fileid');
        if (!fileId || img.dataset.loaded) continue;
        img.dataset.loaded = '1';
        try {
            // Need to change to fetch from /api/files/:id
            const response = await fetch(`${API_URL}/files/${fileId}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                img.src = url;
            } else {
                img.style.display = 'none';
                const emoji = img.nextElementSibling;
                if (emoji && emoji.classList.contains('book-emoji')) emoji.style.display = 'flex';
            }
        } catch (e) {
            img.style.display = 'none';
            const emoji = img.nextElementSibling;
            if (emoji && emoji.classList.contains('book-emoji')) emoji.style.display = 'flex';
        }
    }
}

async function showBookDetail(bookId) {
    const book = APP.dbBooks.find(b => b.id === bookId);
    if (!book) return;
    if (window._detailCoverUrl) URL.revokeObjectURL(window._detailCoverUrl);
    const title = escapeHTML(getBookTitle(book));
    const author = escapeHTML(getBookAuthor(book));
    const desc = escapeHTML(getBookDesc(book));
    let actionHTML = '';
    let coverHTML = '';
    if (book.coverPhotoFileId) {
        try {
            const response = await fetch(`${API_URL}/files/${book.coverPhotoFileId}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                window._detailCoverUrl = url;
                coverHTML = `<img src="${url}" alt="${title}" style="max-width:300px;max-height:400px;border-radius:var(--radius);margin:0 auto 1rem;display:block;border:1px solid var(--gray-200);">`;
            } else {
                coverHTML = `<div style="font-size:6rem;text-align:center;">${book.coverEmoji || '📖'}</div>`;
            }
        } catch (e) {
            coverHTML = `<div style="font-size:6rem;text-align:center;">${book.coverEmoji || '📖'}</div>`;
        }
    } else {
        coverHTML = `<div style="font-size:6rem;text-align:center;">${book.coverEmoji || '📖'}</div>`;
    }

    if (book.type === 'free') {
        actionHTML = `<button class="btn btn-primary btn-lg" onclick="openPDFNewTab('${book.id}')">📖 ${t('readNow')}</button>`;
        if (book.hasPdf && book.pdfFileId) {
            actionHTML += `<button class="btn btn-download btn-lg" style="margin-left:0.5rem;" onclick="downloadPDF('${book.id}')">${t('downloadPDF')}</button>`;
        }
    } else {
        actionHTML = `<button class="btn btn-outline btn-lg" onclick="orderPhysicalWhatsApp('${book.id}')">🛒 ${t('orderNow')}</button>`;
    }
    const modal = document.getElementById('modalBox');
    modal.innerHTML = `
    <button class="modal-close" onclick="closeModalDirect()">✕</button>
    ${coverHTML}
    <h2 style="font-family:var(--font-heading);color:var(--primary-dark);text-align:center;">${title}</h2>
    <p style="text-align:center;color:var(--gray-500);">${author} | ${escapeHTML(book.category||'General')} | ⭐${book.rating||0}</p>
    <p style="text-align:center;color:var(--gray-600);max-width:500px;margin:1rem auto;">${desc}</p>
    <p style="text-align:center;"><strong>Pages:</strong> ${book.pages||'N/A'} | <strong>Readers:</strong> ${book.readers||0}</p>
    ${book.hasPdf&&book.pdfFileId?'<p style="text-align:center;color:var(--blue);">📄 PDF Available</p>':''}
    <div style="text-align:center;margin-top:1rem;">${actionHTML}</div>`;
    document.getElementById('modalOverlay').style.display = 'flex';
}

// ==================== PHYSICAL BOOK WHATSAPP ORDERING ====================
function orderPhysicalWhatsApp(bookId) {
    if (!APP.currentUser) {
        APP.pendingPhysicalBookId = bookId;
        showLoginModal();
        return;
    }
    const book = APP.dbBooks.find(b => b.id === bookId);
    if (!book) return;

    if (APP.currentUser.phone) {
        sendPhysicalWhatsAppOrder(book, APP.currentUser.phone);
    } else {
        showPhysicalPhoneInputModal(bookId);
    }
}

function showPhysicalPhoneInputModal(bookId) {
    const book = APP.dbBooks.find(b => b.id === bookId);
    if (!book) return;
    const modal = document.getElementById('modalBox');
    modal.innerHTML = `
        <button class="modal-close" onclick="closeModalDirect()">✕</button>
        <h2>📞 Enter Your Phone Number</h2>
        <p>We need your contact number to complete the order.</p>
        <div class="form-group">
            <input type="tel" id="physicalOrderPhone" placeholder="+92XXXXXXXXXX" style="width:100%; padding:0.7rem; border:2px solid var(--gray-300); border-radius:var(--radius); font-family:inherit;">
        </div>
        <button class="btn btn-primary btn-lg" style="width:100%;" onclick="submitPhoneAndSendPhysicalWhatsApp('${bookId}')">Send Order via WhatsApp</button>
    `;
    document.getElementById('modalOverlay').style.display = 'flex';
}

function submitPhoneAndSendPhysicalWhatsApp(bookId) {
    const phoneInput = document.getElementById('physicalOrderPhone');
    const phone = phoneInput ? phoneInput.value.trim() : '';
    if (!phone) {
        showToast('Please enter a valid phone number.', 'error');
        return;
    }
    if (APP.currentUser) {
        APP.currentUser.phone = phone;
        saveState();
    }
    const book = APP.dbBooks.find(b => b.id === bookId);
    if (book) sendPhysicalWhatsAppOrder(book, phone);
    closeModalDirect();
}

function sendPhysicalWhatsAppOrder(book, phone) {
    const user = APP.currentUser;
    const message = `Assalamualaikum
I want to order a physical book.
Book Title: ${getBookTitle(book)}
Book ID: ${book.id}
Price: Rs.${book.price}
Customer Name: ${user.name}
Customer Email: ${user.email}
Customer Phone: ${phone}
Order Type: Physical Book Delivery
Please guide me regarding payment and delivery.`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_ADMIN_NUMBER}?text=${encoded}`;
    const newWindow = window.open(url, '_blank');
    if (!newWindow) {
        showToast('Unable to open WhatsApp. Please allow pop-ups or try again.', 'error');
    }
}

// ==================== PDF HANDLING (Read & Download) ====================
async function openPDFNewTab(bookId) {
    const book = APP.dbBooks.find(b => b.id === bookId);
    if (!book || !book.pdfFileId) { showToast(t('noPDFAvailable'), 'error'); return; }
    try {
        const response = await fetch(`${API_URL}/files/${book.pdfFileId}`);
        if (!response.ok) { showToast(t('noPDFAvailable'), 'error'); return; }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const newTab = window.open(url, '_blank');
        if (!newTab) showToast('Please allow pop-ups for this site.', 'info');
        setTimeout(() => URL.revokeObjectURL(url), 120000);
    } catch (e) {
        showToast('Error opening PDF.', 'error');
    }
}

async function downloadPDF(bookId) {
    const book = APP.dbBooks.find(b => b.id === bookId);
    if (!book || !book.pdfFileId) { showToast(t('noPDFAvailable'), 'error'); return; }
    try {
        const response = await fetch(`${API_URL}/files/${book.pdfFileId}`);
        if (!response.ok) { showToast(t('noPDFAvailable'), 'error'); return; }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = getBookTitle(book).replace(/[^a-zA-Z0-9]/g, '_') + '.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        showToast('PDF download started! 📥', 'success');
    } catch (e) {
        showToast('Error downloading PDF.', 'error');
    }
}
