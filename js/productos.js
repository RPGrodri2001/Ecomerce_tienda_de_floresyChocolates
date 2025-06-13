// ===== PRODUCTOS PAGE JAVASCRIPT =====

// Global variables for products page
let filteredProducts = [];
let currentFilter = 'todos';
let currentSort = 'featured';
let currentView = 'grid';
let maxPriceFilter = 100;
let searchQuery = '';

// Initialize products page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('productos') || document.getElementById('productsGrid')) {
        initializeProductsPage();
    }
});

function initializeProductsPage() {
    // Load all products initially
    filteredProducts = [...window.ThreeSenses.products];
    
    // Set max price filter based on actual max price
    const maxPrice = Math.max(...window.ThreeSenses.products.map(p => p.price));
    maxPriceFilter = maxPrice;
    document.getElementById('maxPrice').textContent = Math.ceil(maxPrice);
    document.getElementById('priceRange').max = Math.ceil(maxPrice);
    document.getElementById('priceRange').value = Math.ceil(maxPrice);
    
    // Load products
    displayProducts();
    updateResultsCount();
    
    // Add additional CSS for products page
    addProductsPageStyles();
    
    console.log('Products page initialized');
}

// ===== PRODUCT DISPLAY =====
function displayProducts() {
    const container = document.getElementById('productsGrid');
    const loading = document.getElementById('productsLoading');
    const noResults = document.getElementById('noResults');
    
    if (!container) return;
    
    // Show loading
    showLoading(true);
    
    setTimeout(() => {
        if (filteredProducts.length === 0) {
            container.innerHTML = '';
            showNoResults(true);
        } else {
            container.innerHTML = filteredProducts.map(product => 
                createProductCard(product, currentView)
            ).join('');
            showNoResults(false);
        }
        
        showLoading(false);
        updateResultsCount();
    }, 300);
}

function createProductCard(product, view = 'grid') {
    const stockStatus = product.stock < 10 ? 'low' : 'normal';
    const stockText = product.stock < 10 ? `¡Solo quedan ${product.stock}!` : `${product.stock} disponibles`;
    
    if (view === 'list') {
        return `
            <div class="product-card product-card--list" data-id="${product.id}">
                <div class="product__image" onclick="showProductDetails(${product.id})">
                    ${product.image}
                </div>
                <div class="product__info">
                    <div class="product__main-info">
                        <h3 class="product__name">${product.name}</h3>
                        <p class="product__description">${product.description}</p>
                        <div class="product__meta">
                            <div class="product__rating">
                                ${'⭐'.repeat(Math.floor(product.rating))} 
                                <span class="rating-number">${product.rating}</span>
                            </div>
                            <div class="product__category">${product.category}</div>
                        </div>
                    </div>
                    <div class="product__actions">
                        <div class="product__price">$${product.price.toFixed(2)}</div>
                        <div class="product__stock product__stock--${stockStatus}">
                            ${stockText}
                        </div>
                        <button class="btn btn--primary" onclick="addToCart(${product.id})" 
                                ${product.stock === 0 ? 'disabled' : ''}>
                            ${product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product__image" onclick="showProductDetails(${product.id})">
                    ${product.image}
                    ${product.featured ? '<div class="product__badge">Destacado</div>' : ''}
                    ${product.stock === 0 ? '<div class="product__badge product__badge--sold">Agotado</div>' : ''}
                </div>
                <div class="product__info">
                    <h3 class="product__name">${product.name}</h3>
                    <p class="product__description">${product.description}</p>
                    <div class="product__details">
                        <div class="product__rating">
                            ${'⭐'.repeat(Math.floor(product.rating))} 
                            <span class="rating-number">${product.rating}</span>
                        </div>
                        <div class="product__stock product__stock--${stockStatus}">
                            ${stockText}
                        </div>
                    </div>
                    <div class="product__price">$${product.price.toFixed(2)}</div>
                    <button class="btn btn--primary" onclick="addToCart(${product.id})" 
                            ${product.stock === 0 ? 'disabled' : ''}>
                        ${product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                    </button>
                </div>
            </div>
        `;
    }
}

// ===== FILTERING =====
function filterProducts(category) {
    currentFilter = category;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${category}"]`).classList.add('active');
    
    applyFilters();
}

function filterByPrice() {
    const priceRange = document.getElementById('priceRange');
    maxPriceFilter = parseFloat(priceRange.value);
    document.getElementById('maxPrice').textContent = maxPriceFilter.toFixed(0);
    
    applyFilters();
}

function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    searchQuery = searchInput.value.toLowerCase();
    
    applyFilters();
}

function applyFilters() {
    let filtered = [...window.ThreeSenses.products];
    
    // Apply category filter
    if (currentFilter !== 'todos') {
        filtered = filtered.filter(product => product.category === currentFilter);
    }
    
    // Apply price filter
    filtered = filtered.filter(product => product.price <= maxPriceFilter);
    
    // Apply search filter
    if (searchQuery) {
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchQuery) ||
            product.description.toLowerCase().includes(searchQuery)
        );
    }
    
    filteredProducts = filtered;
    
    // Apply current sorting
    applySorting();
    
    displayProducts();
}

function clearFilters() {
    // Reset all filters
    currentFilter = 'todos';
    searchQuery = '';
    maxPriceFilter = Math.max(...window.ThreeSenses.products.map(p => p.price));
    
    // Update UI
    document.querySelector('[data-filter="todos"]').classList.add('active');
    document.querySelectorAll('.filter-btn:not([data-filter="todos"])').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById('searchInput').value = '';
    document.getElementById('priceRange').value = maxPriceFilter;
    document.getElementById('maxPrice').textContent = Math.ceil(maxPriceFilter);
    
    // Apply filters
    applyFilters();
}

// ===== SORTING =====
function sortProducts() {
    const sortSelect = document.getElementById('sortSelect');
    currentSort = sortSelect.value;
    
    applySorting();
    displayProducts();
}

function applySorting() {
    switch (currentSort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'featured':
        default:
            filteredProducts.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return b.rating - a.rating;
            });
            break;
    }
}

// ===== VIEW CHANGE =====
function changeView(view) {
    currentView = view;
    
    // Update active view button
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('view-btn--active');
    });
    document.querySelector(`[data-view="${view}"]`).classList.add('view-btn--active');
    
    // Update grid class
    const grid = document.getElementById('productsGrid');
    if (view === 'list') {
        grid.classList.add('products-grid--list');
    } else {
        grid.classList.remove('products-grid--list');
    }
    
    displayProducts();
}

// ===== PRODUCT DETAILS MODAL =====
function showProductDetails(productId) {
    const product = window.ThreeSenses.products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('productModalBody');
    
    modalBody.innerHTML = `
        <div class="product-details">
            <div class="product-details__image">
                <div class="product-image-large">${product.image}</div>
                ${product.featured ? '<div class="product__badge">Destacado</div>' : ''}
                ${product.stock === 0 ? '<div class="product__badge product__badge--sold">Agotado</div>' : ''}
            </div>
            <div class="product-details__info">
                <div class="product-details__category">${product.category}</div>
                <h2 class="product-details__name">${product.name}</h2>
                <div class="product-details__rating">
                    ${'⭐'.repeat(Math.floor(product.rating))} 
                    <span class="rating-number">${product.rating}</span>
                    <span class="rating-reviews">(${Math.floor(Math.random() * 100) + 20} reseñas)</span>
                </div>
                <p class="product-details__description">${product.description}</p>
                
                <div class="product-details__features">
                    <h4>Características:</h4>
                    <ul>
                        ${product.category === 'chocolates' ? 
                            '<li>Chocolate artesanal premium</li><li>Ingredientes naturales</li><li>Sin conservantes artificiales</li>' :
                            '<li>Flores frescas de temporada</li><li>Arreglo profesional</li><li>Garantía de frescura</li>'
                        }
                    </ul>
                </div>
                
                <div class="product-details__price">
                    <span class="price-current">$${product.price.toFixed(2)}</span>
                    ${Math.random() > 0.5 ? `<span class="price-original">$${(product.price * 1.2).toFixed(2)}</span>` : ''}
                </div>
                
                <div class="product-details__stock">
                    ${product.stock < 10 ? 
                        `<span class="stock-warning">⚠️ Solo quedan ${product.stock} unidades</span>` :
                        `<span class="stock-normal">✅ ${product.stock} disponibles</span>`
                    }
                </div>
                
                <div class="product-details__actions">
                    <div class="quantity-selector">
                        <label>Cantidad:</label>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
                            <input type="number" id="productQuantity" value="1" min="1" max="${product.stock}">
                            <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
                        </div>
                    </div>
                    <button class="btn btn--primary btn--large" onclick="addToCartWithQuantity(${product.id})" 
                            ${product.stock === 0 ? 'disabled' : ''}>
                        ${product.stock === 0 ? 'Producto Agotado' : 'Agregar al Carrito'}
                    </button>
                </div>
                
                <div class="product-details__delivery">
                    <h4>🚚 Información de entrega:</h4>
                    <p>Entrega gratuita en pedidos mayores a $50</p>
                    <p>Tiempo estimado: 2-4 días hábiles</p>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function changeQuantity(delta) {
    const quantityInput = document.getElementById('productQuantity');
    let newValue = parseInt(quantityInput.value) + delta;
    
    if (newValue < 1) newValue = 1;
    if (newValue > parseInt(quantityInput.max)) newValue = parseInt(quantityInput.max);
    
    quantityInput.value = newValue;
}

function addToCartWithQuantity(productId) {
    const quantityInput = document.getElementById('productQuantity');
    const quantity = parseInt(quantityInput.value);
    
    for (let i = 0; i < quantity; i++) {
        window.ThreeSenses.addToCart(productId);
    }
    
    closeProductModal();
}

// ===== UTILITY FUNCTIONS =====
function updateResultsCount() {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        countElement.textContent = filteredProducts.length;
    }
}

function showLoading(show) {
    const loading = document.getElementById('productsLoading');
    if (loading) {
        loading.classList.toggle('hidden', !show);
    }
}

function showNoResults(show) {
    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.classList.toggle('hidden', !show);
    }
}

// ===== ADDITIONAL STYLES FOR PRODUCTS PAGE =====
function addProductsPageStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Products page specific styles */
        .page-header {
            padding: 8rem 0 4rem;
            background: var(--surface);
            text-align: center;
        }
        
        .breadcrumb {
            margin-bottom: 1rem;
            color: var(--text-muted);
        }
        
        .breadcrumb a {
            color: var(--accent-gold);
        }
        
        .page-title {
            color: var(--text-primary);
            margin-bottom: 1rem;
        }
        
        .page-description {
            color: var(--text-secondary);
            max-width: 600px;
            margin: 0 auto;
        }
        
        .product-filters {
            padding: 3rem 0;
            background: var(--background);
            border-bottom: 1px solid var(--surface-light);
        }
        
        .filters-bar {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 3rem;
            margin-bottom: 2rem;
        }
        
        .filter-group h3 {
            color: var(--text-primary);
            margin-bottom: 1rem;
            font-size: 1rem;
        }
        
        .filter-buttons {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        
        .filter-btn {
            background: var(--surface);
            border: 1px solid var(--surface-light);
            color: var(--text-secondary);
            padding: 0.5rem 1rem;
            border-radius: var(--border-radius);
            cursor: pointer;
            transition: var(--transition-normal);
        }
        
        .filter-btn.active,
        .filter-btn:hover {
            background: var(--accent-gold);
            color: var(--primary-dark);
            border-color: var(--accent-gold);
        }
        
        .sort-select {
            width: 100%;
            background: var(--surface);
            border: 1px solid var(--surface-light);
            color: var(--text-secondary);
            padding: 0.75rem;
            border-radius: var(--border-radius);
        }
        
        .price-range {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .price-display {
            color: var(--text-muted);
            font-size: 0.9rem;
        }
        
        .search-bar {
            display: flex;
            max-width: 400px;
            margin: 0 auto;
        }
        
        .search-bar input {
            flex: 1;
            background: var(--surface);
            border: 1px solid var(--surface-light);
            color: var(--text-primary);
            padding: 0.75rem 1rem;
            border-radius: var(--border-radius) 0 0 var(--border-radius);
        }
        
        .search-submit {
            background: var(--accent-gold);
            border: 1px solid var(--accent-gold);
            color: var(--primary-dark);
            padding: 0.75rem 1rem;
            border-radius: 0 var(--border-radius) var(--border-radius) 0;
            cursor: pointer;
        }
        
        .products-section {
            padding: 3rem 0;
        }
        
        .products-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        
        .results-info {
            color: var(--text-secondary);
        }
        
        .view-options {
            display: flex;
            gap: 0.5rem;
        }
        
        .view-btn {
            background: var(--surface);
            border: 1px solid var(--surface-light);
            color: var(--text-secondary);
            padding: 0.5rem;
            border-radius: var(--border-radius);
            cursor: pointer;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .view-btn--active {
            background: var(--accent-gold);
            color: var(--primary-dark);
            border-color: var(--accent-gold);
        }
        
        .products-grid--list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .product-card--list {
            display: flex;
            background: var(--surface);
            border-radius: var(--border-radius);
            padding: 1.5rem;
            align-items: center;
            gap: 2rem;
        }
        
        .product-card--list .product__image {
            width: 120px;
            height: 120px;
            flex-shrink: 0;
        }
        
        .product-card--list .product__info {
            display: flex;
            flex: 1;
            justify-content: space-between;
            align-items: center;
            padding: 0;
        }
        
        .product__badge {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: var(--accent-gold);
            color: var(--primary-dark);
            padding: 0.25rem 0.5rem;
            border-radius: var(--border-radius);
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .product__badge--sold {
            background: var(--error);
            color: white;
        }
        
        .product__stock--low {
            color: var(--warning);
        }
        
        .rating-number {
            color: var(--text-muted);
            font-size: 0.9rem;
            margin-left: 0.25rem;
        }
        
        .products-loading {
            text-align: center;
            padding: 4rem 0;
            color: var(--text-secondary);
        }
        
        .loading-spinner {
            font-size: 2rem;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .no-results {
            text-align: center;
            padding: 4rem 0;
        }
        
        .no-results__icon {
            font-size: 4rem;
            opacity: 0.5;
            margin-bottom: 1rem;
        }
        
        .no-results h3 {
            color: var(--text-primary);
            margin-bottom: 1rem;
        }
        
        .no-results p {
            color: var(--text-secondary);
            margin-bottom: 2rem;
        }
        
        /* Product Modal Styles */
        .product-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .product-modal__backdrop {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }
        
        .product-modal__content {
            position: relative;
            background: var(--surface);
            border-radius: var(--border-radius-large);
            width: 90%;
            max-width: 900px;
            max-height: 90vh;
            overflow-y: auto;
            border: 1px solid var(--surface-light);
        }
        
        .product-modal__close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: var(--surface-light);
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            color: var(--text-secondary);
            cursor: pointer;
            font-size: 1.2rem;
            z-index: 10;
            transition: var(--transition-normal);
        }
        
        .product-modal__close:hover {
            background: var(--accent-gold);
            color: var(--primary-dark);
        }
        
        .product-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            padding: 2rem;
        }
        
        .product-details__image {
            position: relative;
        }
        
        .product-image-large {
            width: 100%;
            height: 400px;
            background: linear-gradient(135deg, var(--primary-medium), var(--primary-light));
            border-radius: var(--border-radius-large);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8rem;
            color: var(--accent-cream);
        }
        
        .product-details__category {
            color: var(--accent-gold);
            font-size: 0.9rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 0.5rem;
        }
        
        .product-details__name {
            color: var(--text-primary);
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        
        .product-details__rating {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        }
        
        .rating-reviews {
            color: var(--text-muted);
            font-size: 0.9rem;
        }
        
        .product-details__description {
            color: var(--text-secondary);
            line-height: 1.7;
            margin-bottom: 2rem;
        }
        
        .product-details__features {
            margin-bottom: 2rem;
        }
        
        .product-details__features h4 {
            color: var(--text-primary);
            margin-bottom: 1rem;
        }
        
        .product-details__features ul {
            list-style: none;
            padding: 0;
        }
        
        .product-details__features li {
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
            padding-left: 1.5rem;
            position: relative;
        }
        
        .product-details__features li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--accent-gold);
            font-weight: bold;
        }
        
        .product-details__price {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .price-current {
            font-size: 2rem;
            font-weight: 700;
            color: var(--accent-gold);
        }
        
        .price-original {
            font-size: 1.2rem;
            color: var(--text-muted);
            text-decoration: line-through;
        }
        
        .product-details__stock {
            margin-bottom: 2rem;
        }
        
        .stock-warning {
            color: var(--warning);
            font-weight: 500;
        }
        
        .stock-normal {
            color: var(--success);
            font-weight: 500;
        }
        
        .product-details__actions {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .quantity-selector {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .quantity-selector label {
            color: var(--text-primary);
            font-weight: 500;
        }
        
        .quantity-controls {
            display: flex;
            align-items: center;
            border: 1px solid var(--surface-light);
            border-radius: var(--border-radius);
            overflow: hidden;
        }
        
        .quantity-btn {
            background: var(--surface-light);
            border: none;
            width: 40px;
            height: 40px;
            color: var(--text-secondary);
            cursor: pointer;
            transition: var(--transition-normal);
        }
        
        .quantity-btn:hover {
            background: var(--accent-gold);
            color: var(--primary-dark);
        }
        
        #productQuantity {
            background: var(--surface);
            border: none;
            width: 60px;
            height: 40px;
            text-align: center;
            color: var(--text-primary);
        }
        
        .product-details__delivery {
            background: var(--background);
            padding: 1.5rem;
            border-radius: var(--border-radius);
            border: 1px solid var(--surface-light);
        }
        
        .product-details__delivery h4 {
            color: var(--text-primary);
            margin-bottom: 1rem;
        }
        
        .product-details__delivery p {
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
        }
        
        /* Responsive Design for Products Page */
        @media (max-width: 1024px) {
            .filters-bar {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
            
            .product-details {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
            
            .product-image-large {
                height: 300px;
                font-size: 6rem;
            }
        }
        
        @media (max-width: 768px) {
            .products-header {
                flex-direction: column;
                gap: 1rem;
                align-items: stretch;
            }
            
            .product-card--list {
                flex-direction: column;
                gap: 1rem;
            }
            
            .product-card--list .product__info {
                flex-direction: column;
                align-items: stretch;
                gap: 1rem;
            }
            
            .product-modal__content {
                width: 95%;
                margin: 1rem;
            }
            
            .product-details {
                padding: 1rem;
            }
            
            .product-details__name {
                font-size: 1.5rem;
            }
            
            .product-image-large {
                height: 250px;
                font-size: 4rem;
            }
            
            .quantity-selector {
                flex-direction: column;
                align-items: stretch;
                gap: 0.5rem;
            }
        }
        
        @media (max-width: 480px) {
            .filter-buttons {
                flex-direction: column;
            }
            
            .filter-btn {
                text-align: center;
            }
            
            .price-current {
                font-size: 1.5rem;
            }
            
            .product-image-large {
                height: 200px;
                font-size: 3rem;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', function(e) {
    // Close product modal with Escape key
    if (e.key === 'Escape') {
        const productModal = document.getElementById('productModal');
        if (productModal && !productModal.classList.contains('hidden')) {
            closeProductModal();
        }
    }
    
    // Quick search with '/' key
    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// ===== ENHANCED CART INTEGRATION =====
function addToCart(productId) {
    // Use the main cart function but with enhanced feedback
    const originalFunction = window.ThreeSenses.addToCart;
    
    // Call original function
    originalFunction(productId);
    
    // Update displays if on products page
    updateProductCards();
}

function updateProductCards() {
    // Update stock displays in product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const productId = parseInt(card.dataset.id);
        const product = window.ThreeSenses.products.find(p => p.id === productId);
        
        if (product) {
            const stockElement = card.querySelector('.product__stock');
            if (stockElement) {
                const stockStatus = product.stock < 10 ? 'low' : 'normal';
                const stockText = product.stock < 10 ? 
                    `¡Solo quedan ${product.stock}!` : 
                    `${product.stock} disponibles`;
                
                stockElement.className = `product__stock product__stock--${stockStatus}`;
                stockElement.textContent = stockText;
                
                // Update button if out of stock
                const button = card.querySelector('button');
                if (product.stock === 0) {
                    button.disabled = true;
                    button.textContent = 'Agotado';
                    card.classList.add('product-card--sold-out');
                }
            }
        }
    });
}

// ===== SCROLL TO TOP BUTTON =====
function addScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const style = document.createElement('style');
    style.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: var(--accent-gold);
            color: var(--primary-dark);
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: var(--transition-normal);
            z-index: 1000;
        }
        
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .scroll-to-top:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-medium);
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(scrollBtn);
    
    // Show/hide scroll button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
}

// Initialize scroll to top when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('productos')) {
        addScrollToTop();
    }
});

console.log('🛍️ Products page JavaScript loaded successfully!');