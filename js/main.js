// ===== THREE SENSES - MAIN JAVASCRIPT =====

// Global variables
let cart = [];
let products = [];
let currentPage = 'home';

// ===== PRODUCT DATA =====
//***Productos destacados */
const productData = [
    // Chocolates Premium
    {
        id: 1,
        name: "Trufas de Chocolate Negro 70%",
        category: "chocolates",
        price: 28.99,
        description: "Exquisitas trufas de chocolate negro belga con 70% de cacao y relleno de ganache cremoso.",
        image: "🍫",
        featured: true,
        stock: 25,
        rating: 4.9
    },
    {
        id: 2,
        name: "Bombones Surtidos Premium",
        category: "chocolates",
        price: 45.99,
        description: "Elegante caja de bombones surtidos con diferentes sabores y texturas únicas.",
        image: "🍬",
        featured: true,
        stock: 18,
        rating: 4.8
    },
    {
        id: 3,
        name: "Chocolate Blanco con Fresas",
        category: "chocolates",
        price: 32.99,
        description: "Delicioso chocolate blanco artesanal con trozos de fresa deshidratada.",
        image: "🤍",
        featured: false,  //solo puse true, es mas facil para no tocar mas funciones
        stock: 22,
        rating: 4.7
    },
    {
        id: 4,
        name: "Tableta Origen Ecuador 85%",
        category: "chocolates",
        price: 24.99,
        description: "Chocolate negro de origen único de Ecuador con 85% de cacao puro.",
        image: "🍫",
        featured: true,
        stock: 30,
        rating: 4.9
    },
    // Flores Premium
    {
        id: 5,
        name: "Ramo de Rosas Rojas Premium",
        category: "flores",
        price: 65.99,
        description: "Hermoso ramo de 24 rosas rojas ecuatorianas, símbolo perfecto del amor.",
        image: "🌹",
        featured: true,
        stock: 12,
        rating: 4.8
    },
    {
        id: 6,
        name: "Arreglo de Girasoles Silvestres",
        category: "flores",
        price: 38.99,
        description: "Alegre arreglo de girasoles frescos en jarrón de cerámica artesanal.",
        image: "🌻",
        featured: true,  //Se cambia para mostrar a "true" y a no mostrar a "false"
        stock: 15,
        rating: 4.6
    },
    {
        id: 7,
        name: "Bouquet Mixto Primaveral",
        category: "flores",
        price: 42.99,
        description: "Colorido bouquet con flores de temporada y follaje verde exuberante.",
        image: "💐",
        featured: true,
        stock: 20,
        rating: 4.7
    },
    {
        id: 8,
        name: "Orquídeas Elegantes",
        category: "flores",
        price: 78.99,
        description: "Sofisticado arreglo de orquídeas blancas en maceta decorativa de bambú.",
        image: "🌺",
        featured: false,  //Se cambia para mostrar a "true" y a no mostrar a "false"
        stock: 8,
        rating: 4.9
    }
];

//----Cierre de Productos destacados----//

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    products = [...productData];
    loadCartFromStorage();
    updateCartDisplay();
    
    // Load featured products on home page
    if (document.getElementById('featuredProducts')) {
        loadFeaturedProducts();
    }
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize scroll effects
    initializeScrollEffects();
    
    // Add event listeners
    addEventListeners();
    
    console.log('Three Senses App initialized successfully!');
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('nav__menu--active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== PRODUCT MANAGEMENT =====
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    const featuredProducts = products.filter(product => product.featured);
    
    container.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product__image">
                ${product.image}
            </div>
            <div class="product__info">
                <h3 class="product__name">${product.name}</h3>
                <p class="product__description">${product.description}</p>
                <div class="product__details">
                    <div class="product__rating">
                        ${'⭐'.repeat(Math.floor(product.rating))} ${product.rating}
                    </div>
                    <div class="product__stock ${product.stock < 10 ? 'product__stock--low' : ''}">
                        ${product.stock < 10 ? '¡Pocas unidades!' : `${product.stock} disponibles`}
                    </div>
                </div>
                <div class="product__price">$${product.price.toFixed(2)}</div>
                <button class="btn btn--primary" onclick="addToCart(${product.id})">
                    Agregar al Carrito
                </button>
            </div>
        </div>
    `;
}

// ===== CART MANAGEMENT =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('Producto no encontrado', 'error');
        return;
    }
    
    if (product.stock <= 0) {
        showNotification('Producto agotado', 'warning');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            showNotification('No hay más stock disponible', 'warning');
            return;
        }
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Update product stock
    product.stock -= 1;
    
    updateCartDisplay();
    saveCartToStorage();
    showNotification('Producto agregado al carrito', 'success');
    
    // Update button temporarily
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '¡Agregado!';
    button.style.background = 'var(--success)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 1500);
}

function removeFromCart(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        // Return stock
        const product = products.find(p => p.id === productId);
        if (product) {
            product.stock += cartItem.quantity;
        }
        
        // Remove from cart
        cart = cart.filter(item => item.id !== productId);
        
        updateCartDisplay();
        saveCartToStorage();
        showNotification('Producto eliminado del carrito', 'success');
    }
}

function updateCartQuantity(productId, newQuantity) {
    const cartItem = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    
    if (!cartItem || !product) return;
    
    const difference = newQuantity - cartItem.quantity;
    
    if (difference > 0 && product.stock < difference) {
        showNotification('No hay suficiente stock', 'warning');
        return;
    }
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    // Update stock
    product.stock -= difference;
    cartItem.quantity = newQuantity;
    
    updateCartDisplay();
    saveCartToStorage();
}

function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-btn');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update cart count and total in button
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (cartCount) {
        cartCount.textContent = `🛒 $${totalPrice.toFixed(2)}`;
    }
    
    // Update cart modal
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <div class="cart-empty__icon">🛒</div>
                    <p>Tu carrito está vacío</p>
                    <a href="productos.html" class="btn btn--primary">Ver Productos</a>
                </div>
            `;
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item__image">${item.image}</div>
                    <div class="cart-item__details">
                        <h4 class="cart-item__name">${item.name}</h4>
                        <p class="cart-item__price">$${item.price.toFixed(2)}</p>
                        <div class="cart-item__quantity">
                            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="cart-item__total">
                        $${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button class="cart-item__remove" onclick="removeFromCart(${item.id})">
                        🗑️
                    </button>
                </div>
            `).join('');
        }
    }
    
    if (cartTotal) {
        cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`;
    }
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
        
        if (modal.style.display === 'block') {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

function clearCart() {
    // Return all stock
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            product.stock += item.quantity;
        }
    });
    
    cart = [];
    updateCartDisplay();
    saveCartToStorage();
    showNotification('Carrito vaciado', 'success');
}

// ===== CHECKOUT PROCESS =====
function checkout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'warning');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Simulate checkout process
    showNotification('Procesando pago...', 'info');
    
    setTimeout(() => {
        // Simulate successful payment
        const orderNumber = generateOrderNumber();
        
        showNotification(`¡Pago exitoso! Orden #${orderNumber}`, 'success');
        
        // Clear cart after successful checkout
        cart = [];
        updateCartDisplay();
        saveCartToStorage();
        toggleCart();
        
        // Show order confirmation
        showOrderConfirmation(orderNumber, total, itemCount);
    }, 2000);
}

function generateOrderNumber() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}

function showOrderConfirmation(orderNumber, total, itemCount) {
    const confirmation = `
        <div class="order-confirmation">
            <h3>¡Gracias por tu compra!</h3>
            <p><strong>Número de orden:</strong> ${orderNumber}</p>
            <p><strong>Total:</strong> $${total.toFixed(2)}</p>
            <p><strong>Productos:</strong> ${itemCount} items</p>
            <p>Recibirás un correo de confirmación en breve.</p>
        </div>
    `;
    
    // You could show this in a modal or redirect to a confirmation page
    console.log('Order confirmed:', { orderNumber, total, itemCount });
}

// ===== LOCAL STORAGE =====
function saveCartToStorage() {
    try {
        const cartData = {
            cart: cart,
            timestamp: Date.now()
        };
        localStorage.setItem('threeSensesCart', JSON.stringify(cartData));
    } catch (error) {
        console.error('Error saving cart to storage:', error);
    }
}

function loadCartFromStorage() {
    try {
        const stored = localStorage.getItem('threeSensesCart');
        if (stored) {
            const cartData = JSON.parse(stored);
            
            // Check if cart is not too old (24 hours)
            const hoursSinceStored = (Date.now() - cartData.timestamp) / (1000 * 60 * 60);
            
            if (hoursSinceStored < 24) {
                cart = cartData.cart || [];
                
                // Validate cart items still exist and have stock
                cart = cart.filter(item => {
                    const product = products.find(p => p.id === item.id);
                    return product && product.stock >= item.quantity;
                });
            }
        }
    } catch (error) {
        console.error('Error loading cart from storage:', error);
        cart = [];
    }
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('notification--show');
    }, 10);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('notification--show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    // Header scroll effect
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature, .product-card, .stat').forEach(el => {
        observer.observe(el);
    });
}

// ===== EVENT LISTENERS =====
function addEventListeners() {
    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        const cartModal = document.getElementById('cartModal');
        if (e.target === cartModal) {
            toggleCart();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const cartModal = document.getElementById('cartModal');
            if (cartModal && cartModal.style.display === 'block') {
                toggleCart();
            }
        }
    });
    
    // Search functionality (placeholder)
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            showNotification('Función de búsqueda próximamente', 'info');
        });
    }
    
    // User account (placeholder)
    const userBtn = document.querySelector('.user-btn');
    if (userBtn) {
        userBtn.addEventListener('click', function() {
            showNotification('Función de cuenta próximamente', 'info');
        });
    }
}

// ===== UTILITY FUNCTIONS =====
function formatPrice(price) {
    return new Intl.NumberFormat('es-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== EXPORT FOR OTHER PAGES =====
window.ThreeSenses = {
    products: products,
    cart: cart,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    updateCartQuantity: updateCartQuantity,
    toggleCart: toggleCart,
    checkout: checkout,
    clearCart: clearCart,
    showNotification: showNotification,
    formatPrice: formatPrice
};

// ===== CONSOLE WELCOME =====
console.log('%c🍫 Three Senses Premium Chocolates 🍫', 'color: #D4A574; font-size: 16px; font-weight: bold;');
console.log('%cWelcome to Three Senses! Enjoy our premium chocolate experience.', 'color: #6B3E2A; font-size: 12px;');