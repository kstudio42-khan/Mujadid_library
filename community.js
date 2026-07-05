// ==================== COMMUNITY PAGE ====================
function renderCommunityPage(container) {
    container.innerHTML = `<section class="page-section active"><h2 class="section-title">${t('communityTitle')}</h2><div id="communityUpdates" style="display:flex;flex-direction:column;gap:1rem;"></div></section>`;
    if (!APP.dbCommunity.length) {
        document.getElementById('communityUpdates').innerHTML = '<p>No community updates yet.</p>';
        return;
    }
    document.getElementById('communityUpdates').innerHTML = APP.dbCommunity.map(item => {
        const likes = item.likes || 0;
        const likedBy = item.likedBy || [];
        const comments = item.comments || [];
        const isLiked = APP.currentUser && likedBy.includes(APP.currentUser.id);
        return `
        <div class="card">
            <span style="color:var(--primary);">📌 ${escapeHTML(item.type||'Update')}</span>
            <h3>${escapeHTML(getCommTitle(item))}</h3>
            <p>📅 ${escapeHTML(item.date||'')}</p>
            <p>${escapeHTML(getCommDesc(item))}</p>
            <div style="display:flex; gap:1rem; margin-top:0.5rem;">
                <button class="btn btn-sm ${isLiked?'btn-primary':'btn-outline'}" onclick="likeCommunityUpdate('${item.id}')">👍 ${likes}</button>
            </div>
            <div style="margin-top:1rem;">
                <h5>💬 Comments (${comments.length})</h5>
                <div style="max-height:200px; overflow-y:auto; margin-bottom:0.5rem;">
                    ${comments.map(c => `
                        <div style="display:flex; justify-content:space-between; align-items:start; padding:0.25rem 0; border-bottom:1px solid #eee;">
                            <span><strong>${escapeHTML(c.userName)}:</strong> ${escapeHTML(c.text)}</span>
                            ${APP.currentUser && APP.currentUser.role==='admin' ? `<button class="btn btn-sm" style="color:red; background:none; border:none; padding:0 0.3rem;" onclick="deleteCommunityComment('${item.id}', '${c.id}')">×</button>` : ''}
                        </div>`).join('')}
                </div>
                ${APP.currentUser && APP.currentUser.role === 'admin' ? `
                <div style="display:flex; gap:0.5rem;">
                    <input type="text" id="commComment_${item.id}" placeholder="${t('commentPlaceholder')}" style="flex:1; padding:0.4rem; border:1px solid #ccc; border-radius:4px;">
                    <button class="btn btn-sm btn-primary" onclick="addCommunityComment('${item.id}')">${t('commentAdd')}</button>
                </div>` : ''}
            </div>
        </div>`;
    }).join('');
}

function addCommunityComment(updateId) {
    if (!APP.currentUser || APP.currentUser.role !== 'admin') return;
    const input = document.getElementById('commComment_' + updateId);
    if (!input || !input.value.trim()) return;
    const item = APP.dbCommunity.find(u => u.id === updateId);
    if (!item) return;
    if (!item.comments) item.comments = [];
    item.comments.push({
        id: 'com-' + Date.now(),
        userId: APP.currentUser.id,
        userName: APP.currentUser.name,
        text: input.value.trim(),
        date: new Date().toISOString()
    });
    saveState();
    renderCurrentPage();
}

function deleteCommunityComment(updateId, commentId) {
    const item = APP.dbCommunity.find(u => u.id === updateId);
    if (!item) return;
    item.comments = (item.comments || []).filter(c => c.id !== commentId);
    saveState();
    renderCurrentPage();
}

function likeCommunityUpdate(updateId) {
    if (!APP.currentUser) { showToast(t('loginRequired'), 'error'); showLoginModal(); return; }
    const item = APP.dbCommunity.find(u => u.id === updateId);
    if (!item) return;
    if (!item.likedBy) item.likedBy = [];
    if (!item.likes) item.likes = 0;
    const idx = item.likedBy.indexOf(APP.currentUser.id);
    if (idx > -1) {
        item.likedBy.splice(idx, 1);
        item.likes--;
    } else {
        item.likedBy.push(APP.currentUser.id);
        item.likes++;
    }
    saveState();
    renderCurrentPage();
}