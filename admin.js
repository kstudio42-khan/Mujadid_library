// ==================== ADMIN PANEL ====================
function renderAdmin(container) {
    if (!APP.currentUser || APP.currentUser.role !== 'admin') {
        container.innerHTML = '<p>🔒 Access denied. Please login as admin.</p>';
        return;
    }
    // Competition requests removed

    container.innerHTML = `
    <section class="page-section active">
      <h2 class="section-title">${t('adminTitle')}</h2>
      <h3>📚 Manage Books (${APP.dbBooks.length})</h3>
      <button class="btn btn-primary btn-sm" onclick="showAddBookForm()">+ Add Book</button>
      <div class="table-wrap"><table><thead><tr><th>${t('adminId')}</th><th>${t('adminTitleCol')}</th><th>${t('adminType')}</th><th>${t('adminPrice')}</th><th>${t('adminPdf')}</th><th>${t('adminActions')}</th></tr></thead><tbody>${APP.dbBooks.map(b=>`<tr><td>${b.id}</td><td>${escapeHTML(getBookTitle(b))}</td><td>${escapeHTML(b.type)}</td><td>Rs.${b.price||0}</td><td>${b.hasPdf&&b.pdfFileId?'✅':'❌'}</td><td><button class="btn btn-sm btn-outline" onclick="editBook('${b.id}')">✏️</button> <button class="btn btn-sm btn-danger" onclick="deleteBook('${b.id}')">🗑</button></td></tr>`).join('')}</tbody></table></div>

      <h3 style="margin-top:2rem;">📢 Manage Notices (${APP.dbNotices ? APP.dbNotices.length : 0})</h3>
      <button class="btn btn-primary btn-sm" onclick="showAddNoticeForm()">${t('adminAddNotice')}</button>
      <div class="table-wrap"><table><thead><tr><th>Title</th><th>Date</th><th>Priority</th><th>Pinned</th><th>Actions</th></tr></thead><tbody>${APP.dbNotices && APP.dbNotices.length ? APP.dbNotices.map(n=>`<tr><td>${escapeHTML(n.title)}</td><td>${escapeHTML(n.date)}</td><td>${escapeHTML(n.priority)}</td><td>${n.pinned ? '✅' : '❌'}</td><td>
        <button class="btn btn-sm btn-outline" onclick="editNotice('${n.id}')">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="deleteNotice('${n.id}')">🗑</button>
        <button class="btn btn-sm btn-accent" onclick="togglePinNotice('${n.id}')">📌</button>
      </td></tr>`).join('') : '<tr><td colspan="5">No notices yet.</td></tr>'}</tbody></table></div>

      <h3 style="margin-top:2rem;">📦 Orders (${APP.orders.length})</h3>${APP.orders.length?APP.orders.map(o=>`<p>${escapeHTML(o.id)} - Rs.${o.total} - ${escapeHTML(o.status)}</p>`).join(''):'<p>No orders.</p>'}
    </section>`;
    if (APP.currentUser && APP.currentUser.role === 'admin') {
        const navLinks = document.getElementById('navLinks');
        if (!document.getElementById('navAdminLink')) {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#admin" id="navAdminLink" style="color:var(--accent);font-weight:600;">🔧 ${t('adminTitle')}</a>`;
            navLinks.appendChild(li);
        }
    }
}

// Article approval functions removed

// ---- Books ----
function togglePdfField(type) {
    const container = document.getElementById('pdfUploadContainer');
    if (type === 'physical') {
        container.style.display = 'none';
    } else {
        container.style.display = 'block';
    }
}
function showAddBookForm() {
    const modal = document.getElementById('modalBox');
    modal.innerHTML = `
    <button class="modal-close" onclick="closeModalDirect()">✕</button>
    <h2>Add New Book</h2>
    <div class="form-group"><label>Title (English) *</label><input type="text" id="newBookTitle" placeholder="Book title"></div>
    <div class="form-group"><label>Title (Urdu)</label><input type="text" id="newBookTitleUr" placeholder="اردو عنوان"></div>
    <div class="form-group"><label>Author</label><input type="text" id="newBookAuthor" placeholder="Author name"></div>
    <div class="form-group"><label>Author (Urdu)</label><input type="text" id="newBookAuthorUr" placeholder="اردو نام"></div>
    <div class="form-group"><label>Description</label><textarea id="newBookDesc" rows="3"></textarea></div>
    <div class="form-group"><label>Description (Urdu)</label><textarea id="newBookDescUr" rows="3"></textarea></div>
    <div class="form-group"><label>📷 Cover Photo (JPEG, PNG, WebP - any size)</label><input type="file" id="newBookPhoto" accept="image/*" onchange="previewBookPhoto(this)"><div id="photoPreview" style="margin-top:0.5rem;"></div></div>
    <div class="form-group" id="pdfUploadContainer"><label>📄 PDF File (any size, optional)</label><input type="file" id="newBookPdf" accept=".pdf" onchange="previewBookPdf(this)"><div id="pdfInfo" style="margin-top:0.5rem;color:var(--gray-500);"></div></div>
    <div class="form-group"><label>📝 Book Content (for text reader, separate pages with ---PAGE---)</label><textarea id="newBookContent" rows="8" placeholder="Enter book content here. Use ---PAGE--- to separate pages."></textarea></div>
    <div class="form-group"><label>Type</label><select id="newBookType" onchange="togglePdfField(this.value)"><option value="free">free</option><option value="physical">physical</option></select></div>
    <div class="form-group"><label>Price (Rs.)</label><input type="number" id="newBookPrice" value="0"></div>
    <div class="form-group"><label>Pages</label><input type="number" id="newBookPages" value="1"></div>
    <div class="form-group"><label>Category</label><input type="text" id="newBookCategory" value="General"></div>
    <div class="form-group"><label>Cover Emoji (fallback)</label><input type="text" id="newBookEmoji" value="📖" maxlength="4"></div>
    <div class="form-group"><label><input type="checkbox" id="newBookFeatured"> Featured Book</label></div>
    <button class="btn btn-primary btn-lg" style="width:100%;" onclick="addNewBook()">Add Book</button>`;
    document.getElementById('modalOverlay').style.display = 'flex';
}
function previewBookPhoto(input) {
    const preview = document.getElementById('photoPreview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => preview.innerHTML = `<img src="${e.target.result}" style="max-width:200px;max-height:300px;border-radius:var(--radius);">`;
        reader.readAsDataURL(input.files[0]);
    } else preview.innerHTML = '';
}
function previewBookPdf(input) {
    const info = document.getElementById('pdfInfo');
    if (input.files && input.files[0]) {
        const sizeMB = input.files[0].size / 1024 / 1024;
        info.innerHTML = `📄 ${input.files[0].name} (${sizeMB >= 1 ? sizeMB.toFixed(2) + ' MB' : (input.files[0].size/1024).toFixed(1) + ' KB'})`;
    } else info.innerHTML = '';
}
async function addNewBook() {
    const photoFile = document.getElementById('newBookPhoto').files[0];
    const type = document.getElementById('newBookType')?.value || 'free';
    const pdfFile = type === 'physical' ? null : document.getElementById('newBookPdf').files[0];
    let coverPhotoFileId = null;
    let pdfFileId = null;
    const bookId = generateId('b');
    if (photoFile) { coverPhotoFileId = 'cover-' + bookId; await storeFile(coverPhotoFileId, photoFile); }
    if (pdfFile) { pdfFileId = 'pdf-' + bookId; await storeFile(pdfFileId, pdfFile); }
    const newBook = {
        id: bookId,
        title: document.getElementById('newBookTitle')?.value || 'New Book',
        titleUr: document.getElementById('newBookTitleUr')?.value || '',
        author: document.getElementById('newBookAuthor')?.value || 'Unknown',
        authorUr: document.getElementById('newBookAuthorUr')?.value || '',
        type: type,
        category: document.getElementById('newBookCategory')?.value || 'General',
        price: parseInt(document.getElementById('newBookPrice')?.value || 0),
        pages: parseInt(document.getElementById('newBookPages')?.value || 1),
        desc: document.getElementById('newBookDesc')?.value || '',
        descUr: document.getElementById('newBookDescUr')?.value || '',
        content: document.getElementById('newBookContent')?.value || '',
        rating: 0, readers: 0,
        coverPhotoFileId, pdfFileId, hasPdf: !!pdfFileId,
        coverEmoji: document.getElementById('newBookEmoji')?.value || '📖',
        dateAdded: new Date().toISOString().split('T')[0],
        featured: document.getElementById('newBookFeatured')?.checked || false,
    };
    APP.dbBooks.push(newBook);
    await saveState();
    closeModalDirect();
    showToast('Book added successfully!', 'success');
    renderCurrentPage();
}
async function editBook(bookId) {
    const book = APP.dbBooks.find(b => b.id === bookId);
    if (!book) return;
    const modal = document.getElementById('modalBox');
    modal.innerHTML = `
    <button class="modal-close" onclick="closeModalDirect()">✕</button>
    <h2>Edit Book: ${escapeHTML(getBookTitle(book))}</h2>
    <div class="form-group"><label>Title</label><input type="text" id="editBookTitle" value="${escapeHTML(book.title)}"></div>
    <div class="form-group"><label>Title (Urdu)</label><input type="text" id="editBookTitleUr" value="${escapeHTML(book.titleUr||'')}"></div>
    <div class="form-group"><label>Author</label><input type="text" id="editBookAuthor" value="${escapeHTML(book.author||'')}"></div>
    <div class="form-group"><label>Description</label><textarea id="editBookDesc" rows="3">${escapeHTML(book.desc||'')}</textarea></div>
    <div class="form-group"><label>📷 New Cover Photo (optional)</label><input type="file" id="editBookPhoto" accept="image/*"><div id="editPhotoPreview" style="margin-top:0.5rem;"></div></div>
    <div class="form-group" id="pdfUploadContainer"><label>📄 New PDF File (optional)</label><input type="file" id="editBookPdf" accept=".pdf"><div id="editPdfInfo" style="margin-top:0.5rem;"></div></div>
    <div class="form-group"><label>📝 Book Content</label><textarea id="editBookContent" rows="8">${escapeHTML(book.content||'')}</textarea></div>
    <div class="form-group"><label>Type</label><select id="editBookType" onchange="togglePdfField(this.value)"><option value="free" ${book.type==='free'?'selected':''}>Free</option><option value="physical" ${book.type==='physical'?'selected':''}>Physical</option></select></div>
    <div class="form-group"><label>Price (Rs.)</label><input type="number" id="editBookPrice" value="${book.price||0}"></div>
    <div class="form-group"><label>Pages</label><input type="number" id="editBookPages" value="${book.pages||1}"></div>
    <div class="form-group"><label>Category</label><input type="text" id="editBookCategory" value="${escapeHTML(book.category||'')}"></div>
    <div class="form-group"><label><input type="checkbox" id="editBookFeatured" ${book.featured?'checked':''}> Featured</label></div>
    <button class="btn btn-primary btn-lg" style="width:100%;" onclick="saveEditBook('${bookId}')">Save Changes</button>`;
    document.getElementById('modalOverlay').style.display = 'flex';
    togglePdfField(book.type);
    if (book.coverPhotoFileId) {
        try {
            const blob = await getFile(book.coverPhotoFileId);
            if (blob) {
                const url = URL.createObjectURL(blob);
                document.getElementById('editPhotoPreview').innerHTML = `<img src="${url}" style="max-width:150px;border-radius:8px;"><br><small>Current cover</small>`;
            }
        } catch (e) {}
    }
    document.getElementById('editBookPhoto').addEventListener('change', function() {
        if (this.files[0]) {
            const reader = new FileReader();
            reader.onload = e => document.getElementById('editPhotoPreview').innerHTML = `<img src="${e.target.result}" style="max-width:150px;border-radius:8px;"><br><small>New cover</small>`;
            reader.readAsDataURL(this.files[0]);
        }
    });
    document.getElementById('editBookPdf').addEventListener('change', function() {
        if (this.files[0]) document.getElementById('editPdfInfo').textContent = '📄 New PDF: ' + this.files[0].name;
    });
}
async function saveEditBook(bookId) {
    const book = APP.dbBooks.find(b => b.id === bookId);
    if (!book) return;
    const type = document.getElementById('editBookType')?.value || book.type;
    book.title = document.getElementById('editBookTitle')?.value || book.title;
    book.titleUr = document.getElementById('editBookTitleUr')?.value || book.titleUr;
    book.author = document.getElementById('editBookAuthor')?.value || book.author;
    book.desc = document.getElementById('editBookDesc')?.value || book.desc;
    book.type = type;
    book.price = parseInt(document.getElementById('editBookPrice')?.value || book.price);
    book.pages = parseInt(document.getElementById('editBookPages')?.value || book.pages);
    book.category = document.getElementById('editBookCategory')?.value || book.category;
    book.content = document.getElementById('editBookContent')?.value || book.content;
    book.featured = document.getElementById('editBookFeatured')?.checked || false;
    const newPhoto = document.getElementById('editBookPhoto').files[0];
    if (newPhoto) {
        if (book.coverPhotoFileId) await deleteFile(book.coverPhotoFileId);
        const newFileId = 'cover-' + bookId + '-' + Date.now();
        await storeFile(newFileId, newPhoto);
        book.coverPhotoFileId = newFileId;
    }
    const newPdf = type === 'physical' ? null : document.getElementById('editBookPdf').files[0];
    if (newPdf) {
        if (book.pdfFileId) await deleteFile(book.pdfFileId);
        const newPdfId = 'pdf-' + bookId + '-' + Date.now();
        await storeFile(newPdfId, newPdf);
        book.pdfFileId = newPdfId;
        book.hasPdf = true;
    } else if (type === 'physical') {
        if (book.pdfFileId) { await deleteFile(book.pdfFileId); book.pdfFileId = null; book.hasPdf = false; }
    }
    await saveState();
    closeModalDirect();
    showToast('Book updated!', 'success');
    renderCurrentPage();
}
async function deleteBook(bookId) {
    if (!confirm('Delete this book permanently?')) return;
    const book = APP.dbBooks.find(b => b.id === bookId);
    if (book) {
        if (book.coverPhotoFileId) await deleteFile(book.coverPhotoFileId);
        if (book.pdfFileId) await deleteFile(book.pdfFileId);
    }
    APP.dbBooks = APP.dbBooks.filter(b => b.id !== bookId);
    await saveState();
    showToast('Book deleted.', 'info');
    renderCurrentPage();
}

// Competitions, Testimonials and related admin functions removed

// Articles and competition request handlers removed

