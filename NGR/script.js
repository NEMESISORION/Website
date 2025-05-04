document.addEventListener('DOMContentLoaded', function() {
    // Product data
    const products = {
        mens: [
            { id: 1, name: "Graphic Tee", price: 500, image: "images/Graphic Tee.jpeg", category: "tees" },
            { id: 2, name: "Street Hoodie", price: 700, image: "images/Street Hoodie.jpeg", category: "hoodies" },
            { id: 3, name: "Denim Jacket", price: 2500, image: "images/Denim Jacket.jpeg", category: "jackets" },
            { id: 4, name: "Basic White Tee", price: 350, image: "images/mens collection.jpg", category: "tees" },
            { id: 5, name: "Jogger Pants", price: 600, image: "images/Jogger Pants.jpeg", category: "pants" },
            { id: 6, name: "Cargo Shorts", price: 450, image: "images/Cargo Shorts.jpg", category: "shorts" }
        ],
        womens: [
            { id: 7, name: "Cropped Hoodie", price: 650, image: "images/Cropped Hoodie.jpg", category: "hoodies" },
            { id: 8, name: "Yoga Pants", price: 600, image: "images/Yoga Pants.jpg", category: "pants" },
            { id: 9, name: "Summer Dress", price: 850, image: "images/Summer Dress.jpeg", category: "dresses" },
            { id: 10, name: "Crop Top", price: 400, image: "images/Crop Top.jpg", category: "tops" },
            { id: 11, name: "High-Waist Jeans", price: 750, image: "images/women collection.jpg", category: "jeans" }
        ],
        accessories: [
            { id: 12, name: "Urban Sneakers", price: 1200, image: "images/Urban Sneakers.jpg", category: "shoes" },
            { id: 13, name: "Baseball Cap", price: 300, image: "images/Baseball Cap.jpg", category: "hats" },
            { id: 14, name: "Canvas Backpack", price: 800, image: "images/Canvas Backpack.jpg", category: "bags" },
            { id: 15, name: "Leather Wallet", price: 450, image: "images/Leather Wallet.jpg", category: "wallets" },
            { id: 16, name: "Aviator Sunglasses", price: 550, image: "images/accessore collection.jpg", category: "sunglasses" }
        ]
    };
  
    const currency = 'EGP';
  
    // Helper Functions
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
  
    function showNotification(message) {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
  
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navRight = document.querySelector('.nav-right');
  
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navRight.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
  
    if (navLinks) {
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navRight.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
  
    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
  
    // Shopping Cart System
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('hustlz-cart')) || [];
    } catch (e) {
        showNotification('Error loading cart. Please try again.');
    }
    const cartIcon = document.querySelector('.fa-shopping-cart');
  
    // Create cart modal once
    const cartModal = document.createElement('div');
    cartModal.className = 'modal-overlay';
    cartModal.innerHTML = `
        <div class="modal-content cart-modal">
            <span class="close-modal">×</span>
            <h2>Your Cart</h2>
            <div class="cart-items"></div>
            <div class="cart-summary"></div>
        </div>
    `;
    document.body.appendChild(cartModal);
    cartModal.style.display = 'none';
  
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            e.preventDefault();
            const btn = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            const productCard = btn.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseInt(productCard.querySelector('p').textContent);
            const productImage = productCard.querySelector('img').src;
            const productCategory = productCard.dataset.category || '';
            
            addToCart(productName, productPrice, productImage, productCategory);
        }
    });
  
    if (cartIcon) {
        cartIcon.addEventListener('click', showCartModal);
    }
  
    function addToCart(name, price, image, category) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: name,
                price: price,
                image: image,
                category: category,
                quantity: 1
            });
        }
        updateCart();
        showNotification(`${name} added to cart!`);
    }
  
    function updateCart() {
        try {
            localStorage.setItem('hustlz-cart', JSON.stringify(cart));
        } catch (e) {
            showNotification('Error saving cart. Please try again.');
        }
        updateCartCount();
    }
  
    function updateCartCount() {
        if (!cartIcon) return;
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            cartIcon.classList.add('has-items');
            cartIcon.setAttribute('data-count', totalItems);
        } else {
            cartIcon.classList.remove('has-items');
        }
    }
  
    function showCartModal() {
        cartModal.style.display = 'flex';
        const cartItems = cartModal.querySelector('.cart-items');
        const cartSummary = cartModal.querySelector('.cart-summary');
        
        cartModal.querySelector('.close-modal').addEventListener('click', () => {
            cartModal.style.display = 'none';
        });
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty</p>';
            cartSummary.innerHTML = '';
        } else {
            cartItems.innerHTML = '';
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>${currency} ${item.price}</p>
                        <div class="quantity-controls">
                            <button class="decrease-qty">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-qty">+</button>
                        </div>
                    </div>
                    <button class="remove-item">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                
                itemElement.querySelector('.decrease-qty').addEventListener('click', () => {
                    updateItemQuantity(item, -1);
                    if (item.quantity < 1) {
                        cart = cart.filter(i => i.name !== item.name);
                    }
                    updateCart();
                    showCartModal();
                });
                
                itemElement.querySelector('.increase-qty').addEventListener('click', () => {
                    updateItemQuantity(item, 1);
                    updateCart();
                    showCartModal();
                });
                
                itemElement.querySelector('.remove-item').addEventListener('click', () => {
                    cart = cart.filter(i => i.name !== item.name);
                    updateCart();
                    showCartModal();
                });
                
                cartItems.appendChild(itemElement);
            });
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartSummary.innerHTML = `
                <div style="display:flex;justify-content:space-between;margin:20px 0;padding-top:20px;border-top:2px solid #eee">
                    <span style="font-weight:600">Total:</span>
                    <span style="font-weight:700;color:#00C4B4;font-size:20px">${currency} ${total}</span>
                </div>
                <button class="btn checkout-btn" style="width:100%" onclick="window.location.href='#checkout'">Proceed to Checkout</button>
            `;
        }
        
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });
    }
  
    function updateItemQuantity(item, change) {
        item.quantity += change;
    }
  
    updateCartCount();
  
    // Search Functionality
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
  
    if (searchInput && searchResults) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
  
    async function handleSearch() {
        const query = searchInput.value.trim();
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
  
        const allProducts = [
            ...products.mens,
            ...products.womens,
            ...products.accessories
        ];
        
        const results = allProducts.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        
        displaySearchResults(results);
    }
  
    function displaySearchResults(results) {
        searchResults.innerHTML = '';
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
            searchResults.style.display = 'block';
            return;
        }
        
        const sectionMap = {
            tees: 'mens-collection',
            hoodies: 'mens-collection',
            jackets: 'mens-collection',
            pants: 'mens-collection',
            shorts: 'mens-collection',
            dresses: 'womens-collection',
            tops: 'womens-collection',
            jeans: 'womens-collection',
            shoes: 'accessories-collection',
            hats: 'accessories-collection',
            bags: 'accessories-collection',
            wallets: 'accessories-collection',
            sunglasses: 'accessories-collection'
        };
  
        results.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p>${currency} ${item.price}</p>
                </div>
            `;
            resultItem.addEventListener('click', () => {
                window.location.href = `#${sectionMap[item.category] || 'products'}`;
                searchResults.style.display = 'none';
            });
            searchResults.appendChild(resultItem);
        });
        searchResults.style.display = 'block';
    }
  
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container') && searchResults) {
            searchResults.style.display = 'none';
        }
    });
  
    // User Account System
    const userDropdown = document.querySelector('.user-dropdown');
    const userInfoSection = document.querySelector('.user-info');
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    const logoutBtn = document.querySelector('.logout-btn');
  
    function checkLoginStatus() {
        const userData = JSON.parse(localStorage.getItem('hustlz-user'));
        if (userData && userInfoSection) {
            document.querySelector('.username').textContent = userData.name || 'User';
            document.querySelectorAll('.login-btn, .register-btn').forEach(el => {
                el.style.display = 'none';
            });
            userInfoSection.style.display = 'block';
        } else if (userInfoSection) {
            document.querySelectorAll('.login-btn, .register-btn').forEach(el => {
                el.style.display = 'block';
            });
            userInfoSection.style.display = 'none';
        }
    }
  
    checkLoginStatus();
  
    const loginModal = document.createElement('div');
    loginModal.className = 'modal-overlay';
    loginModal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">×</span>
            <h2>Login</h2>
            <form id="login-form" class="login-form">
                <div class="form-group">
                    <label for="login-email">Email</label>
                    <input type="email" id="login-email" placeholder="Email" required>
                </div>
                <div class="form-group">
                    <label for="login-password">Password</label>
                    <input type="password" id="login-password" placeholder="Password" required>
                </div>
                <button type="submit" class="btn">Login</button>
            </form>
        </div>
    `;
    document.body.appendChild(loginModal);
  
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'flex';
        });
    }
  
    if (loginModal) {
        loginModal.querySelector('.close-modal').addEventListener('click', () => {
            loginModal.style.display = 'none';
        });
    }
  
    if (loginModal) {
        loginModal.querySelector('#login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const userData = {
                name: "Hustler",
                email: "user@example.com"
            };
            try {
                localStorage.setItem('hustlz-user', JSON.stringify(userData));
            } catch (e) {
                showNotification('Error saving user data. Please try again.');
            }
            loginModal.style.display = 'none';
            checkLoginStatus();
            showNotification('Login successful!');
        });
    }
  
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('hustlz-user');
            checkLoginStatus();
            showNotification('Logged out successfully');
        });
    }
  
    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Registration form would appear here');
        });
    }
  
    // Load Products
    function loadProducts() {
        document.querySelectorAll('.product-grid').forEach(grid => {
            const section = grid.closest('section');
            let collectionType = '';
            if (section.id === 'mens-collection') collectionType = 'mens';
            else if (section.id === 'womens-collection') collectionType = 'womens';
            else if (section.id === 'accessories-collection') collectionType = 'accessories';
            else if (section.id === 'products') {
                const allProducts = [...products.mens, ...products.womens, ...products.accessories];
                allProducts.forEach(product => {
                    const productCard = createProductCard(product);
                    grid.appendChild(productCard);
                });
                return;
            }
  
            const currentProducts = products[collectionType] || [];
            currentProducts.forEach(product => {
                const productCard = createProductCard(product);
                grid.appendChild(productCard);
            });
        });
  
        document.querySelectorAll('.product-filters').forEach(filterContainer => {
            const categoryFilter = filterContainer.querySelector('.category-filter');
            const sortFilter = filterContainer.querySelector('.sort-filter');
            const productGrid = filterContainer.closest('section').querySelector('.product-grid');
  
            if (categoryFilter) {
                categoryFilter.addEventListener('change', function() {
                    const selectedCategory = this.value;
                    const allProducts = productGrid.querySelectorAll('.product-card');
                    allProducts.forEach(product => {
                        if (selectedCategory === '' || product.dataset.category === selectedCategory) {
                            product.style.display = 'block';
                        } else {
                            product.style.display = 'none';
                        }
                    });
                });
            }
  
            if (sortFilter) {
                sortFilter.addEventListener('change', function() {
                    const sortValue = this.value;
                    const visibleProducts = Array.from(productGrid.querySelectorAll('.product-card'))
                        .filter(p => p.style.display !== 'none');
                    visibleProducts.sort((a, b) => {
                        const priceA = parseInt(a.querySelector('.product-info p').textContent);
                        const priceB = parseInt(b.querySelector('.product-info p').textContent);
                        switch(sortValue) {
                            case 'price-low': return priceA - priceB;
                            case 'price-high': return priceB - priceA;
                            case 'newest': 
                            default: return 0;
                        }
                    });
                    visibleProducts.forEach(product => product.remove());
                    visibleProducts.forEach(product => productGrid.appendChild(product));
                });
            }
        });
    }
  
    function createProductCard(product) {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.category = product.category;
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
                <a href="#" class="btn add-to-cart">Add to Cart</a>
            </div>
        `;
        return productCard;
    }
  
    loadProducts();
  
    // Checkout Functionality
    const checkoutForm = document.querySelector('#checkout-form');
    const summaryItems = document.querySelector('.summary-items');
    const summaryTotal = document.querySelector('.summary-total');
  
    function updateCheckoutSummary() {
        if (!summaryItems || !summaryTotal) return;
        summaryItems.innerHTML = '';
        if (cart.length === 0) {
            summaryItems.innerHTML = '<p>Your cart is empty</p>';
            summaryTotal.innerHTML = '';
            return;
        }
  
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'summary-item';
            itemElement.innerHTML = `
                <div class="summary-item-details">
                    <h3>${item.name}</h3>
                    <p>${currency} ${item.price} x ${item.quantity}</p>
                </div>
            `;
            summaryItems.appendChild(itemElement);
        });
  
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        summaryTotal.innerHTML = `
            <div style="display:flex;justify-content:space-between;margin:20px 0;padding-top:20px;border-top:2px solid #eee">
                <span style="font-weight:600">Total:</span>
                <span style="font-weight:700;color:#00C4B4;font-size:20px">${currency} ${total}</span>
            </div>
        `;
    }
  
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (cart.length === 0) {
                showNotification('Your cart is empty!');
                return;
            }
            cart = [];
            try {
                localStorage.setItem('hustlz-cart', JSON.stringify(cart));
            } catch (e) {
                showNotification('Error saving cart. Please try again.');
            }
            updateCart();
            updateCheckoutSummary();
            showNotification('Purchase completed successfully!');
            checkoutForm.reset();
        });
    }
  
    updateCheckoutSummary();
  
    // Contact Form Submission
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Message sent successfully!');
            contactForm.reset();
        });
    }
  
    // Size Chart Modal
    const sizeChartBtn = document.querySelector('.size-chart-btn');
    const sizeChartModal = document.querySelector('#size-chart-modal');
    const closeSizeChart = document.querySelector('.close-size-chart');
    const tabButtons = document.querySelectorAll('.size-chart-tabs .tab-btn');
    const sizeChartTables = document.querySelectorAll('.size-chart-table');
  
    if (sizeChartBtn) {
        sizeChartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sizeChartModal.style.display = 'flex';
        });
    }
  
    if (closeSizeChart) {
        closeSizeChart.addEventListener('click', () => {
            sizeChartModal.style.display = 'none';
        });
    }
  
    if (sizeChartModal) {
        sizeChartModal.addEventListener('click', (e) => {
            if (e.target === sizeChartModal) {
                sizeChartModal.style.display = 'none';
            }
        });
    }
  
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            sizeChartTables.forEach(table => table.style.display = 'none');
            document.getElementById(button.dataset.tab).style.display = 'block';
        });
    });
  });