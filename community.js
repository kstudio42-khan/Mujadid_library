// ==================== COMMUNITY PAGE ====================
const API_URL = 'http://localhost:5000/api';

async function fetchPosts() {
    try {
        const response = await fetch(`${API_URL}/posts`);
        return await response.json();
    } catch (e) {
        console.error('Error fetching posts:', e);
        return [];
    }
}

async function renderCommunityPage(container) {
    container.innerHTML = `<section class="page-section active"><h2 class="section-title">${t('communityTitle')}</h2><div id="communityUpdates" style="display:flex;flex-direction:column;gap:1rem;"></div></section>`;
    
    const posts = await fetchPosts();

    if (!posts.length) {
        document.getElementById('communityUpdates').innerHTML = '<p>No community updates yet.</p>';
        return;
    }
    
    document.getElementById('communityUpdates').innerHTML = posts.map(item => {
        const likes = item.likes ? item.likes.length : 0;
        const comments = item.comments || [];
        const isLiked = APP.currentUser && item.likes && item.likes.includes(APP.currentUser.id);
        return `
        <div class="card">
            <span style="color:var(--primary);">📌 ${escapeHTML(item.type||'Update')}</span>
            <h3>${escapeHTML(getCommTitle(item))}</h3>
            <p>📅 ${escapeHTML(new Date(item.date).toLocaleDateString())}</p>
            <p>${escapeHTML(getCommDesc(item))}</p>
            <div style="display:flex; gap:1rem; margin-top:0.5rem;">
                <button class="btn btn-sm ${isLiked?'btn-primary':'btn-outline'}" onclick="likeCommunityUpdate('${item._id}')">👍 ${likes}</button>
            </div>
            <div style="margin-top:1rem;">
                <h5>💬 Comments (${comments.length})</h5>
                <div style="max-height:200px; overflow-y:auto; margin-bottom:0.5rem;">
                    ${comments.map(c => `
                        <div style="display:flex; justify-content:space-between; align-items:start; padding:0.25rem 0; border-bottom:1px solid #eee;">
                            <span><strong>${escapeHTML(c.userName||'User')}:</strong> ${escapeHTML(c.text)}</span>
                        </div>`).join('')}
                </div>
                <div style="display:flex; gap:0.5rem;">
                    <input type="text" id="commComment_${item._id}" placeholder="${t('commentPlaceholder')}" style="flex:1; padding:0.4rem; border:1px solid #ccc; border-radius:4px;">
                    <button class="btn btn-sm btn-primary" onclick="addCommunityComment('${item._id}')">${t('commentAdd')}</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

async function addCommunityComment(updateId) {
    if (!APP.currentUser) { showToast(t('loginRequired'), 'error'); showLoginModal(); return; }
    const input = document.getElementById('commComment_' + updateId);
    if (!input || !input.value.trim()) return;
    
    try {
        const response = await fetchWithAuth(`${API_URL}/posts/${updateId}/comment`, {
            method: 'POST',
            body: JSON.stringify({ text: input.value.trim() })
        });
        if (response.ok) {
            renderCurrentPage();
        } else {
            showToast('Failed to add comment.', 'error');
        }
    } catch (e) { showToast('Connection error.', 'error'); }
}

async function likeCommunityUpdate(updateId) {
    if (!APP.currentUser) { showToast(t('loginRequired'), 'error'); showLoginModal(); return; }
    
    try {
        const response = await fetchWithAuth(`${API_URL}/posts/${updateId}/like`, { method: 'POST' });
        if (response.ok) {
            renderCurrentPage();
        } else {
            showToast('Failed to like post.', 'error');
        }
    } catch (e) { showToast('Connection error.', 'error'); }
}
