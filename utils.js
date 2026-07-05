// ==================== UTILITY FUNCTIONS ====================
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function generateId(prefix = '') {
    return prefix + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function subscribeNewsletter() {
    const email = document.getElementById('newsletterEmail')?.value?.trim();
    if (email && email.includes('@')) {
        showToast('Subscribed successfully! 📧', 'success');
        document.getElementById('newsletterEmail').value = '';
    } else {
        showToast('Please enter a valid email.', 'error');
    }
}