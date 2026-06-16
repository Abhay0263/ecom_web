// E-Commerce Client Application Logic
document.addEventListener('DOMContentLoaded', () => {
    // API Endpoint config (relative path allows Nginx proxying in Docker environment)
    const API_BASE = '/api';

    // State Variables
    let products = [];
    let cart = JSON.parse(localStorage.getItem('kasa_cart')) || [];
    let currentCategory = 'all';

    // DOM Elements
    const productsGrid = document.getElementById('products-grid');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');
    const retryBtn = document.getElementById('retry-btn');
    const searchInput = document.getElementById('search-input');
    const categoryFilters = document.getElementById('category-filters');
    
    // Cart DOM Elements
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountBadge = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Status DOM Elements
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');

    // --- Server Connection & Health Checking ---
    async function checkServerHealth() {
        try {
            const response = await fetch(`${API_BASE}/health`);
            if (response.ok) {
                const health = await response.json();
                if (health.status === 'UP') {
                    statusIndicator.className = 'status-indicator online';
                    statusText.textContent = 'Server Connected';
                    return true;
                }
            }
            throw new Error('Server issues');
        } catch (err) {
            statusIndicator.className = 'status-indicator offline';
            statusText.textContent = 'Server Offline';
            return false;
        }
    }

    // Run connection checks periodically (every 10 seconds)
    checkServerHealth();
    setInterval(checkServerHealth, 10000);

    // --- Product Loading & Rendering ---
    async function fetchProducts() {
        loader.classList.remove('hidden');
        productsGrid.classList.add('hidden');
        errorMessage.classList.add('hidden');

        try {
            const response = await fetch(`${API_BASE}/products`);
            if (!response.ok) {
                throw new Error('API server returned error');
            }
            products = await response.json();
            renderProducts(products);
            checkServerHealth();
        } catch (err) {
            console.error('Error fetching products:', err);
            errorMessage.classList.remove('hidden');
            loader.classList.add('hidden');
            statusIndicator.className = 'status-indicator offline';
            statusText.textContent = 'Server Error';
        }
    }

    function renderProducts(productsToRender) {
        productsGrid.innerHTML = '';
        loader.classList.add('hidden');

        if (productsToRender.length === 0) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 40px;">
                    <i class="fa-solid fa-magnifying-glass" style="font-size: 24px; margin-bottom: 12px; display: block;"></i>
                    <p>No products found matching your criteria.</p>
                </div>
            `;
            productsGrid.classList.remove('hidden');
            return;
        }

        productsToRender.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-img-wrapper">
                    <img src="${product.image_url}" alt="${product.name}" class="product-img" loading="lazy">
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-purchase">
                        <span class="product-price">$${parseFloat(product.price).toFixed(2)}</span>
                        <button class="add-cart-icon-btn" data-id="${product.id}" aria-label="Add ${product.name} to cart">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
            `;

            // Dynamic mouse-tracking light effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });

            // Add Event Listener to the add cart button inside card
            card.querySelector('.add-cart-icon-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                addToCart(product.id);
            });

            productsGrid.appendChild(card);
        });

        productsGrid.classList.remove('hidden');
    }

    // --- Search & Filter Logic ---
    function filterAndSearchProducts() {
        let filtered = products;

        // Apply category filter
        if (currentCategory !== 'all') {
            filtered = filtered.filter(p => p.category === currentCategory);
        }

        // Apply search query
        const query = searchInput.value.toLowerCase().trim();
        if (query !== '') {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.description.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query)
            );
        }

        renderProducts(filtered);
    }

    // Filter Buttons listeners
    categoryFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            // Remove active from all
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            // Add active to current
            e.target.classList.add('active');
            
            currentCategory = e.target.getAttribute('data-category');
            filterAndSearchProducts();
        }
    });

    // Search Input listener (debounce search slightly for responsiveness)
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(filterAndSearchProducts, 150);
    });

    // Retry Button listener
    retryBtn.addEventListener('click', fetchProducts);

    // --- Shopping Cart Drawer Logic ---
    function toggleCart() {
        cartDrawer.classList.toggle('open');
        cartOverlay.classList.toggle('open');
    }

    cartToggleBtn.addEventListener('click', toggleCart);
    cartCloseBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    // --- Cart Actions ---
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity += 1;
            showToast(`Increased quantity of ${product.name}`, 'info');
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image_url: product.image_url,
                quantity: 1
            });
            showToast(`${product.name} added to bag`, 'success');
        }

        saveCart();
        updateCartUI();
    }

    function changeQuantity(productId, delta) {
        const item = cart.find(item => item.id === productId);
        if (!item) return;

        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
            const product = products.find(p => p.id === productId);
            showToast(`${product ? product.name : 'Item'} removed from bag`, 'info');
        }

        saveCart();
        updateCartUI();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        const product = products.find(p => p.id === productId);
        showToast(`${product ? product.name : 'Item'} removed from bag`, 'info');
        
        saveCart();
        updateCartUI();
    }

    function saveCart() {
        localStorage.setItem('kasa_cart', JSON.stringify(cart));
    }

    function updateCartUI() {
        // Update Cart Badge Count
        const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountBadge.textContent = totalItemsCount;

        // Populate items in Drawer
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-msg">
                    <i class="fa-solid fa-bag-shopping empty-icon"></i>
                    <p>Your bag is currently empty.</p>
                </div>
            `;
            cartTotalElement.textContent = '$0.00';
            checkoutBtn.disabled = true;
            return;
        }

        let totalSum = 0;
        cart.forEach(item => {
            const itemCost = item.price * item.quantity;
            totalSum += itemCost;

            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <img src="${item.image_url}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    <div class="cart-item-qty">
                        <button class="qty-btn dec-qty" data-id="${item.id}">-</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn inc-qty" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            `;

            // Attach event listeners to quantity buttons and remove button
            itemEl.querySelector('.dec-qty').addEventListener('click', () => changeQuantity(item.id, -1));
            itemEl.querySelector('.inc-qty').addEventListener('click', () => changeQuantity(item.id, 1));
            itemEl.querySelector('.cart-item-remove').addEventListener('click', () => removeFromCart(item.id));

            cartItemsContainer.appendChild(itemEl);
        });

        cartTotalElement.textContent = `$${totalSum.toFixed(2)}`;
        checkoutBtn.disabled = false;
    }

    // --- Checkout Processing ---
    checkoutBtn.addEventListener('click', async () => {
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'Processing...';

        const totalSum = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        try {
            const response = await fetch(`${API_BASE}/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    total: totalSum.toFixed(2)
                })
            });

            const result = await response.json();
            if (response.ok && result.success) {
                // Checkout success
                showToast(`Checkout successful! Order ID: ${result.orderId}`, 'success');
                cart = [];
                saveCart();
                updateCartUI();
                toggleCart();
            } else {
                showToast(result.error || 'Checkout failed. Please try again.', 'error');
            }
        } catch (err) {
            console.error('Checkout error:', err);
            showToast('Unable to complete checkout. Server unreachable.', 'error');
        } finally {
            checkoutBtn.textContent = 'Proceed to Checkout';
            checkoutBtn.disabled = cart.length === 0;
        }
    });

    // --- Toast Notification Display System ---
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let iconClass = 'fa-circle-info';
        if (type === 'success') iconClass = 'fa-circle-check';
        if (type === 'error') iconClass = 'fa-circle-exclamation';

        toast.innerHTML = `
            <i class="fa-solid ${iconClass}"></i>
            <span>${message}</span>
            <div class="toast-progress"></div>
        `;

        container.appendChild(toast);

        // Remove toast automatically after 4 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // Initial load
    fetchProducts();
    updateCartUI();
});
