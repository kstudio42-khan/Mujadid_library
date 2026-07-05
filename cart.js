// ==================== CART ====================
function addToCart(bookId) {
    const book = APP.dbBooks.find(b => b.id === bookId);
    if (!book) return;
    // Physical books are now ordered directly via WhatsApp – block them from cart
    if (book.type === 'physical') {
        showToast('Physical books are ordered via WhatsApp. Please use the Order button.', 'info');
        return;
    }
    // Keep cart logic for future non-physical items (if any)
    const existing = APP.cart.find(c => c.bookId === bookId);
    if (existing) existing.quantity++;
    else APP.cart.push({ bookId, quantity: 1 });
    saveState();
    updateCartBadge();
    showToast(`"${escapeHTML(getBookTitle(book))}" added to cart!`, 'success');
}

function removeFromCart(bookId) { APP.cart = APP.cart.filter(c => c.bookId !== bookId); saveState(); updateCartBadge(); renderCurrentPage(); }

function updateCartQuantity(bookId, qty) {
    const item = APP.cart.find(c => c.bookId === bookId);
    if (item) { item.quantity = Math.max(1, qty); saveState(); renderCurrentPage(); }
}

function renderCartPage(container) {
    if (APP.cart.length === 0) {
        container.innerHTML = `<p style="text-align:center;padding:3rem;color:var(--gray-500);">${t('emptyCart')}</p>`;
        return;
    }
    let total = 0;
    const itemsHTML = APP.cart.map(c => {
        const book = APP.dbBooks.find(b => b.id === c.bookId);
        if (!book) return '';
        const subtotal = book.price * c.quantity;
        total += subtotal;
        return `
        <div class="card" style="flex-direction:row;align-items:center;padding:1rem;gap:1rem;flex-wrap:wrap;display:flex;">
          <span style="font-size:3rem;">${book.coverEmoji || '📖'}</span>
          <div style="flex:1;min-width:150px;">
            <strong>${escapeHTML(getBookTitle(book))}</strong>
            <p style="color:var(--gray-500);">Rs.${book.price} x ${c.quantity} = <strong>Rs.${subtotal}</strong></p>
          </div>
          <div style="display:flex;gap:0.5rem;align-items:center;">
            <button class="btn btn-sm btn-outline" onclick="updateCartQuantity('${book.id}',${c.quantity-1})">-</button>
            <span>${c.quantity}</span>
            <button class="btn btn-sm btn-outline" onclick="updateCartQuantity('${book.id}',${c.quantity+1})">+</button>
            <button class="btn btn-sm btn-danger" onclick="removeFromCart('${book.id}')">🗑</button>
          </div>
        </div>`;
    }).join('');
    container.innerHTML = `
    <section class="page-section active">
      <h2 class="section-title">${t('cartTitle')}</h2>
      ${itemsHTML}
      <div style="background:var(--white);padding:1.5rem;border-radius:var(--radius-lg);box-shadow:var(--shadow);text-align:right;">
        <h3>${t('totalLabel')}: <span style="color:var(--primary-dark);">Rs.${total}</span></h3>
        <button class="btn btn-primary btn-lg" onclick="checkout()" style="margin-top:0.5rem;">${t('checkout')} 💳</button>
      </div>
    </section>`;
}

function checkout() {
    if (!APP.currentUser) { showToast(t('loginRequired'), 'error'); showLoginModal(); return; }
    if (APP.cart.length === 0) return;
    let total = APP.cart.reduce((s, c) => {
        const b = APP.dbBooks.find(bb => bb.id === c.bookId);
        return s + (b ? b.price * c.quantity : 0);
    }, 0);
    const modal = document.getElementById('modalBox');
    modal.innerHTML = `
    <button class="modal-close" onclick="closeModalDirect()">✕</button>
    <h2 style="text-align:center;">💳 ${t('checkout')}</h2>
    <p style="text-align:center;">Total: <strong>Rs.${total}</strong></p>
    <div class="form-group"><label>Delivery Address</label><textarea id="deliveryAddress" rows="2" placeholder="Enter your full address..."></textarea></div>
    <div class="form-group"><label>Payment Method</label><select id="paymentMethod"><option>Easypaisa</option><option>JazzCash</option><option>UPI</option><option>Debit Card</option><option>Credit Card</option></select></div>
    <div class="form-group"><label>Phone Number</label><input type="tel" id="checkoutPhone" placeholder="03XX-XXXXXXX"></div>
    <button class="btn btn-primary btn-lg" style="width:100%;" onclick="processCheckout(${total})">Pay Rs.${total}</button>
    <p style="text-align:center;font-size:0.8rem;color:var(--gray-500);margin-top:0.5rem;">🔒 Demo payment simulation.</p>`;
    document.getElementById('modalOverlay').style.display = 'flex';
}
function processCheckout(total) {
    const address = document.getElementById('deliveryAddress')?.value || 'Default Address';
    const method = document.getElementById('paymentMethod')?.value || 'Easypaisa';
    const phone = document.getElementById('checkoutPhone')?.value || '0300-0000000';
    const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    const order = { id: orderId, items: [...APP.cart], total, address, method, phone, date: new Date().toISOString(), status: 'Confirmed' };
    APP.orders.push(order);
    APP.cart = [];
    saveState();
    updateCartBadge();
    closeModalDirect();
    showToast(`Order ${orderId} placed successfully!`, 'success');
    renderCurrentPage();
}