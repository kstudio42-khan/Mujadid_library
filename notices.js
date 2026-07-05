// ==================== NOTICES ====================
// Ensure notices array exists
if (!APP.dbNotices) APP.dbNotices = [];

function renderNoticesPage(container) {
    const now = new Date();
    const notices = APP.dbNotices.filter(n => !n.expiryDate || new Date(n.expiryDate) > now);
    // Sort: pinned first, then by date descending
    notices.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.date) - new Date(a.date);
    });
    container.innerHTML = `
    <section class="page-section active">
      <h2 class="section-title">${t('noticesPageTitle')}</h2>
      <div style="display:flex; flex-direction:column; gap:1rem;">
        ${notices.length ? notices.map(notice => `
          <div class="card" style="padding:1.25rem; ${notice.priority === 'high' ? 'border-left:5px solid var(--red);' : ''}">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <h3>${notice.pinned ? '📌 ' : ''}${escapeHTML(notice.title)}</h3>
              ${notice.priority === 'high' ? `<span class="card-badge badge-important">${t('noticeImportant')}</span>` : ''}
            </div>
            <p style="color:var(--gray-500); margin:0.5rem 0;">📅 ${escapeHTML(notice.date)}</p>
            <p style="white-space:pre-wrap;">${escapeHTML(notice.content)}</p>
            ${notice.expiryDate ? `<p style="color:var(--gray-400); font-size:0.8rem;">${t('noticeExpired')}: ${escapeHTML(notice.expiryDate)}</p>` : ''}
            <button class="btn btn-sm btn-outline" onclick="openNoticeDetail('${notice.id}')">${t('noticeRead')}</button>
          </div>
        `).join('') : `<p style="color:gray;">${t('noticeNoNotices')}</p>`}
      </div>
    </section>`;
}

function openNoticeDetail(noticeId) {
    const notice = APP.dbNotices.find(n => n.id === noticeId);
    if (!notice) { showToast('Notice not found.', 'error'); return; }
    const modal = document.getElementById('modalBox');
    modal.innerHTML = `
    <button class="modal-close" onclick="closeModalDirect()">✕</button>
    <h2 style="font-family:var(--font-heading); color:var(--primary-dark);">${notice.pinned ? '📌 ' : ''}${escapeHTML(notice.title)}</h2>
    <p style="color:var(--gray-500);">📅 ${escapeHTML(notice.date)} ${notice.expiryDate ? ' | ' + t('noticeExpired') + ': ' + escapeHTML(notice.expiryDate) : ''}</p>
    ${notice.priority === 'high' ? `<p style="color:var(--red); font-weight:600;">⚠️ ${t('noticeImportant')}</p>` : ''}
    <hr>
    <div style="white-space:pre-wrap; line-height:1.8;">${escapeHTML(notice.content)}</div>`;
    document.getElementById('modalOverlay').style.display = 'flex';
}

// ==================== ADMIN NOTICE CRUD (called from admin panel) ====================
function showAddNoticeForm() {
    const modal = document.getElementById('modalBox');
    modal.innerHTML = `
    <button class="modal-close" onclick="closeModalDirect()">✕</button>
    <h2>Add Notice</h2>
    <div class="form-group"><label>Title</label><input type="text" id="newNoticeTitle"></div>
    <div class="form-group"><label>Content</label><textarea id="newNoticeContent" rows="6"></textarea></div>
    <div class="form-group"><label>Date</label><input type="text" id="newNoticeDate" value="${new Date().toISOString().split('T')[0]}"></div>
    <div class="form-group"><label>Expiry Date (optional)</label><input type="text" id="newNoticeExpiry" placeholder="YYYY-MM-DD"></div>
    <div class="form-group"><label>Priority</label><select id="newNoticePriority"><option value="normal">Normal</option><option value="high">High</option></select></div>
    <div class="form-group"><label><input type="checkbox" id="newNoticePinned"> Pinned</label></div>
    <button class="btn btn-primary btn-lg" style="width:100%;" onclick="addNewNotice()">Add Notice</button>`;
    document.getElementById('modalOverlay').style.display = 'flex';
}

function addNewNotice() {
    const newNotice = {
        id: generateId('notice'),
        title: document.getElementById('newNoticeTitle')?.value || 'Notice',
        content: document.getElementById('newNoticeContent')?.value || '',
        date: document.getElementById('newNoticeDate')?.value || new Date().toISOString().split('T')[0],
        expiryDate: document.getElementById('newNoticeExpiry')?.value || null,
        priority: document.getElementById('newNoticePriority')?.value || 'normal',
        pinned: document.getElementById('newNoticePinned')?.checked || false,
    };
    APP.dbNotices.push(newNotice);
    saveState(); // requires dbNotices to be included in storage.js (add to APP metadata)
    closeModalDirect();
    showToast('Notice added!', 'success');
    renderCurrentPage();
}

function editNotice(noticeId) {
    const notice = APP.dbNotices.find(n => n.id === noticeId);
    if (!notice) return;
    const modal = document.getElementById('modalBox');
    modal.innerHTML = `
    <button class="modal-close" onclick="closeModalDirect()">✕</button>
    <h2>Edit Notice</h2>
    <div class="form-group"><label>Title</label><input type="text" id="editNoticeTitle" value="${escapeHTML(notice.title)}"></div>
    <div class="form-group"><label>Content</label><textarea id="editNoticeContent" rows="6">${escapeHTML(notice.content)}</textarea></div>
    <div class="form-group"><label>Date</label><input type="text" id="editNoticeDate" value="${escapeHTML(notice.date)}"></div>
    <div class="form-group"><label>Expiry Date</label><input type="text" id="editNoticeExpiry" value="${escapeHTML(notice.expiryDate || '')}"></div>
    <div class="form-group"><label>Priority</label><select id="editNoticePriority">
        <option value="normal" ${notice.priority === 'normal' ? 'selected' : ''}>Normal</option>
        <option value="high" ${notice.priority === 'high' ? 'selected' : ''}>High</option></select></div>
    <div class="form-group"><label><input type="checkbox" id="editNoticePinned" ${notice.pinned ? 'checked' : ''}> Pinned</label></div>
    <button class="btn btn-primary btn-lg" style="width:100%;" onclick="saveEditNotice('${noticeId}')">Save Changes</button>`;
    document.getElementById('modalOverlay').style.display = 'flex';
}

function saveEditNotice(noticeId) {
    const notice = APP.dbNotices.find(n => n.id === noticeId);
    if (!notice) return;
    notice.title = document.getElementById('editNoticeTitle')?.value || notice.title;
    notice.content = document.getElementById('editNoticeContent')?.value || notice.content;
    notice.date = document.getElementById('editNoticeDate')?.value || notice.date;
    notice.expiryDate = document.getElementById('editNoticeExpiry')?.value || null;
    notice.priority = document.getElementById('editNoticePriority')?.value || 'normal';
    notice.pinned = document.getElementById('editNoticePinned')?.checked || false;
    saveState();
    closeModalDirect();
    showToast('Notice updated!', 'success');
    renderCurrentPage();
}

function deleteNotice(noticeId) {
    if (!confirm('Delete this notice?')) return;
    APP.dbNotices = APP.dbNotices.filter(n => n.id !== noticeId);
    saveState();
    showToast('Notice deleted.', 'info');
    renderCurrentPage();
}

function togglePinNotice(noticeId) {
    const notice = APP.dbNotices.find(n => n.id === noticeId);
    if (notice) {
        notice.pinned = !notice.pinned;
        saveState();
        showToast(notice.pinned ? 'Notice pinned!' : 'Notice unpinned.', 'info');
        renderCurrentPage();
    }
}