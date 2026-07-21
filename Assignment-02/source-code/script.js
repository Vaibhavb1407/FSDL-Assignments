// Product Data
const products = [
    {
        id: 1,
        name: "Classic Oxford Shirt",
        category: "clothing",
        price: 89.00,
        image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80",
        description: "Timeless elegance with our premium cotton Oxford shirt."
    },
    {
        id: 2,
        name: "Minimalist Leather Watch",
        category: "accessories",
        price: 149.00,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=951&q=80",
        description: "Precision movement housed in a sleek stainless steel case."
    },
    {
        id: 3,
        name: "Premium Denim Jacket",
        category: "clothing",
        price: 129.00,
        image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        description: "Vintage wash denim jacket, perfect for layering."
    },
    {
        id: 4,
        name: "Urban Running Sneakers",
        category: "footwear",
        price: 110.00,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        description: "Lightweight, breathable, and designed for the city."
    },
    {
        id: 5,
        name: "Classic Aviator Sunglasses",
        category: "accessories",
        price: 120.00,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1480&auto=format&fit=crop",
        description: "Timeless aviator style for sunny days."
    },
    {
        id: 6,
        name: "Summer Linen Trousers",
        category: "clothing",
        price: 75.00,
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
        description: "Cool and comfortable linen trousers for warm days."
    },
    {
        id: 7,
        name: "Leather Crossbody Bag",
        category: "accessories",
        price: 195.00,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80",
        description: "Handcrafted Italian leather bag for everyday essentials."
    },
    {
        id: 8,
        name: "Chelsea Boots",
        category: "footwear",
        price: 160.00,
        image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?ixlib=rb-4.0.3&auto=format&fit=crop&w=735&q=80",
        description: "Classic suede boots that elevate any outfit."
    }
];

// State
let cart = [];
let displayedProducts = products;

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountElements = document.querySelectorAll('.cart-count, #cart-count-header');
const cartTotalElement = document.getElementById('cart-total-price');
const menuBtn = document.getElementById('menu-btn');
const closeMenuBtn = document.getElementById('close-menu');
const mobileMenu = document.getElementById('mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(displayedProducts);
    setupEventListeners();
    loadCartFromStorage();
});

// Event Listeners
function setupEventListeners() {
    // Cart Toggle
    cartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    // Mobile Menu
    menuBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);
    mobileNavLinks.forEach(link => link.addEventListener('click', toggleMenu));

    // Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active class
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Filter logic
            const category = e.target.dataset.filter;
            if (category === 'all') {
                displayedProducts = products;
            } else {
                displayedProducts = products.filter(p => p.category === category);
            }
            renderProducts(displayedProducts);
        });
    });

    // Sticky Header
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Category Links in Hero/Sections (delegation not strictly needed but good for dynamic content)
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            // Scroll to shop
            document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
            // Trigger filter
            const category = card.dataset.category;
            // Find corresponding button and click it
            const btn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
            if (btn) btn.click();
        });
    });
}

// Render Products
function renderProducts(items) {
    productsGrid.innerHTML = items.map(product => `
        <div class="product-card">
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-img">
                <button class="product-action-btn" onclick="addToCart(${product.id})" aria-label="Add to Cart">
                    <i data-feather="shopping-bag"></i>
                </button>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
            </div>
        </div>
    `).join('');

    // Re-initialize feather icons for new elements
    feather.replace();
}

// Cart Logic
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    saveCartToStorage();
    openCart(); // Optional: open cart when adding item
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCartToStorage();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartUI();
        saveCartToStorage();
    }
}

function updateCartUI() {
    // Update Counts
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => el.innerText = totalCount);

    // Update Items List
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your bag is empty. Start shopping!</div>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-action-row">
                        <div class="cart-quantity-controls">
                            <div class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</div>
                            <div class="qty-display">${item.quantity}</div>
                            <div class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</div>
                        </div>
                        <button class="remove-item-btn" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Update Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.innerText = '$' + total.toFixed(2);
}

// UI Toggles
function toggleCart() {
    cartOverlay.classList.toggle('active');
    cartSidebar.classList.toggle('active');
}

function openCart() {
    cartOverlay.classList.add('active');
    cartSidebar.classList.add('active');
}

function toggleMenu() {
    mobileMenu.classList.toggle('active');
}

// Local Storage
function saveCartToStorage() {
    localStorage.setItem('luminaCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const storedCart = localStorage.getItem('luminaCart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartUI();
    }
}
