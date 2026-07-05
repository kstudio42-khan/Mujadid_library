// ==================== MODAL & TOAST ====================
function closeModal(e) {
    if (e.target === document.getElementById('modalOverlay')) closeModalDirect();
}

function closeModalDirect() {
    if (window._pdfUrl) { URL.revokeObjectURL(window._pdfUrl); window._pdfUrl = null; }
    if (window._detailCoverUrl) { URL.revokeObjectURL(window._detailCoverUrl); window._detailCoverUrl = null; }
    document.getElementById('modalOverlay').style.display = 'none';
    document.getElementById('modalBox').innerHTML = '';
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; }, 3000);
    setTimeout(() => toast.remove(), 3500);
}