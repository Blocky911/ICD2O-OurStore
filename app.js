/* ==========================================================================
   NovaStitch Core JavaScript Functional Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

// App State Core Storage Setup
let cart = JSON.parse(localStorage.getItem("ns_cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("ns_wishlist")) || [];
let currentUser = JSON.parse(localStorage.getItem("ns_user")) || null;
let currentTheme = localStorage.getItem("ns_theme") || "dark";

// System Config Framework Initialization
function initApp() {
    // Apply UI Theme Design System state
    document.documentElement.setAttribute("data-theme", currentTheme);
    updateBadges();
    renderUserState();

    // Hook Global Layout Components
    setupSearchBar();
    setupThemeToggle();

    // Context-Aware Page Routing Identification System
    const currentPath = window.location.pathname.split("/").pop();
    
    if (currentPath === "index.html" || currentPath === "") {
        renderHomepageProducts();
    } else if (currentPath === "shop.html") {
        initShopPage();
    } else if (currentPath === "product.html") {
        initProductDetailPage();
    } else if (currentPath === "auth.html") {
        initAuthPage();
    } else if (currentPath === "dashboard.html") {
        initDashboardPage();
    } else if (currentPath === "checkout.html") {
        initCheckoutPage();
    }
}

/* ==========================================================================
   Global UI Components & Helpers
   ========================================================================== */

function showToast(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <svg style="width:20px;height:20px;fill:var(--accent);" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = "slideIn 0.3s forwards reverse";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function updateBadges() {
    const cartBadges = document.querySelectorAll(".cart-count-badge");
    const wishBadges = document.querySelectorAll(".wish-count-badge");
    
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartBadges.forEach(b => b.textContent = cartCount);
    wishBadges.forEach(b => b.textContent = wishlist.length);
}

function setupThemeToggle() {
    const btn = document.getElementById("theme-toggle-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
        currentTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", currentTheme);
        localStorage.setItem("ns_theme", currentTheme);
        showToast(`Switched to ${currentTheme} mode`, "info");
    });
}

function setupSearchBar() {
    const inputs = document.querySelectorAll(".global-search-input");
    inputs.forEach(input => {
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && input.value.trim() !== "") {
                window.location.href = `shop.html?search=${encodeURIComponent(input.value.trim())}`;
            }
        });
    });
}

function renderUserState() {
    const authLinks = document.querySelectorAll('a[href="auth.html"]');
    if (!authLinks || authLinks.length === 0) return;

    authLinks.forEach(link => {
        if (currentUser) {
            const shortName = currentUser.firstName || currentUser.name?.split(" ")[0] || "Member";
            link.innerHTML = `👤 <span class="user-label">${shortName}</span>`;
            link.href = "dashboard.html";
            link.title = `Signed in as ${currentUser.name}`;
        } else {
            link.innerHTML = `👤`;
            link.href = "auth.html";
            link.title = "Sign in";
        }
    });
}

/* ==========================================================================
   E-Commerce Business Operations (Cart / Wishlist Systems)
   ========================================================================== */

window.addToCart = function(productId, size = "M", quantity = 1) {
    const prod = window.PRODUCTS_DB.find(p => p.id === productId);
    if (!prod) return;

    const existing = cart.find(item => item.id === productId && item.size === size);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ id: productId, size, quantity, price: prod.price });
    }
    localStorage.setItem("ns_cart", JSON.stringify(cart));
    updateBadges();
    showToast(`Added ${prod.name} (Size ${size}) to your cart!`);
};

window.toggleWishlist = function(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showToast("Removed from wishlist", "info");
    } else {
        wishlist.push(productId);
        showToast("Added to wishlist blueprint storage!");
    }
    localStorage.setItem("ns_wishlist", JSON.stringify(wishlist));
    updateBadges();
    // Re-render matching context nodes if available
    const path = window.location.pathname.split("/").pop();
    if (path === "shop.html") { filterAndRenderShop(); }
};

/* ==========================================================================
   Dynamic Visual Vector Graphic Generative Engine
   ========================================================================== */
function generateDynamicGraphic(type) {
    let pathData = "";
    if (type === "hoodie") {
        pathData = "M6 14 L10 6 L14 6 L18 14 L16 26 L8 26 Z M8 8 L12 2 L16 8";
    } else if (type === "shirt") {
        pathData = "M4 8 L8 4 L16 4 L20 8 L17 12 L15 10 L15 26 L9 26 L9 10 L7 12 Z";
    } else if (type === "pants") {
        pathData = "M6 4 L18 4 L20 26 L13 26 L12 12 L11 26 L4 26 Z";
    } else if (type === "jacket") {
        pathData = "M5 6 L8 4 L16 4 L19 6 L19 24 L15 24 L14 10 L10 10 L9 24 L5 24 Z M5 12 L19 12";
    } else if (type === "bag") {
        pathData = "M6 10 L18 10 L18 26 L6 26 Z M9 10 L9 6 C9 4, 15 4, 15 6 L15 10";
    } else if (type === "hat") {
        pathData = "M4 22 C4 12, 14 12, 16 14 L22 17 L22 22 Z";
    } else if (type === "socks") {
        pathData = "M6 4 L12 4 L12 18 L18 22 L14 26 L6 18 Z";
    } else { // sneaker
        pathData = "M2 20 L8 12 L18 12 L22 16 L22 22 L2 22 Z M14 12 L18 22";
    }

    return `
    <svg class="product-graphic-fallback" viewBox="0 0 24 28">
        <path d="${pathData}" />
        <circle cx="12" cy="16" r="1.5" fill="var(--accent)" />
    </svg>
    `;
}

function buildProductCardHTML(p) {
    const isWish = wishlist.includes(p.id) ? "active" : "";
    const badgeMarkup = p.tag ? `<div class="product-badge">${p.tag}</div>` : "";
    const oldPriceMarkup = p.oldPrice ? `<span class="price-old">$${p.oldPrice}</span>` : "";
    
    return `
    <div class="product-card" data-id="${p.id}">
        <div class="product-image-wrapper">
            <svg class="brand-stamp" viewBox="0 0 100 100"><path d="M50 15 L80 35 L80 70 L50 90 L20 70 L20 35 Z M50 35 L65 50 L50 65 L35 50 Z" /></svg>
            ${badgeMarkup}
            ${generateDynamicGraphic(p.graphicType)}
            <div class="product-actions-overlay">
                <button class="btn btn-accent" style="padding:0.5rem 1rem; font-size:0.75rem;" onclick="addToCart('${p.id}')">Quick Add</button>
                <a href="product.html?id=${p.id}" class="btn" style="padding:0.5rem 1rem; font-size:0.75rem;">View</a>
            </div>
        </div>
        <div class="product-info">
            <div class="product-meta">
                <span>${p.category}</span>
                <span>${p.gender}</span>
            </div>
            <h3 class="product-title"><a href="product.html?id=${p.id}">${p.name}</a></h3>
            <div class="product-price-row">
                <span class="price-current">$${p.price}</span>
                ${oldPriceMarkup}
                <button onclick="toggleWishlist('${p.id}')" style="margin-left:auto; color:${isWish ? 'var(--accent)' : 'inherit'}" class="icon-btn">★</button>
            </div>
        </div>
    </div>
    `;
}

/* ==========================================================================
   Page-Specific Business Controller Operations
   ========================================================================== */

// HOMEPAGE
function renderHomepageProducts() {
    const grid = document.getElementById("featured-products-grid");
    if (!grid) return;
    
    // Pick first 4 spotlight items from data
    const slice = window.PRODUCTS_DB.slice(0, 4);
    grid.innerHTML = slice.map(p => buildProductCardHTML(p)).join('');
}

// SHOP PAGE (SEARCH & MULTI-FILTERS ENGINE)
function initShopPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFilter = urlParams.get("category");
    const genderFilter = urlParams.get("gender");
    const searchFilter = urlParams.get("search");

    // Apply URL parameters into visual checkbox filters state
    if (categoryFilter) {
        const chk = document.querySelector(`.filter-category-chk[value="${categoryFilter}"]`);
        if (chk) chk.checked = true;
    }
    if (genderFilter) {
        const chk = document.querySelector(`.filter-gender-chk[value="${genderFilter}"]`);
        if (chk) chk.checked = true;
    }
    const searchBar = document.getElementById("shop-page-search-input");
    if (searchBar && searchFilter) {
        searchBar.value = searchFilter;
    }

    // Set Up DOM Event Handlers
    const filterInputs = document.querySelectorAll(".filter-category-chk, .filter-gender-chk, #price-sort-select");
    filterInputs.forEach(i => i.addEventListener("change", filterAndRenderShop));
    if (searchBar) searchBar.addEventListener("input", filterAndRenderShop);

    // Run primary evaluation
    filterAndRenderShop();
}

function filterAndRenderShop() {
    const grid = document.getElementById("shop-main-products-grid");
    if (!grid) return;

    // Collate selected constraints arrays
    const activeCats = Array.from(document.querySelectorAll(".filter-category-chk:checked")).map(c => c.value);
    const activeGenders = Array.from(document.querySelectorAll(".filter-gender-chk:checked")).map(g => g.value);
    const sortVal = document.getElementById("price-sort-select")?.value || "default";
    const searchVal = document.getElementById("shop-page-search-input")?.value.toLowerCase() || "";

    let filtered = [...window.PRODUCTS_DB];

    // Filter pipeline
    if (activeCats.length > 0) {
        filtered = filtered.filter(p => activeCats.includes(p.category));
    }
    if (activeGenders.length > 0) {
        filtered = filtered.filter(p => activeGenders.includes(p.gender) || p.gender === "unisex");
    }
    if (searchVal) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchVal) || p.description.toLowerCase().includes(searchVal));
    }

    // Sort Pipeline
    if (sortVal === "low-high") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortVal === "high-low") {
        filtered.sort((a, b) => b.price - a.price);
    }

    // Build outputs
    if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 4rem; color: var(--text-muted);">No luxury garments match the search parameters.</div>`;
    } else {
        grid.innerHTML = filtered.map(p => buildProductCardHTML(p)).join('');
    }
}

// PRODUCT DETAILS GENERATION ENGINE
function initProductDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const p = window.PRODUCTS_DB.find(item => item.id === id);

    if (!p) {
        document.getElementById("product-detail-container").innerHTML = "<h2>Garment Identity Lost. Check back later.</h2>";
        return;
    }

    // Track state into Local Recently Viewed array
    let recent = JSON.parse(localStorage.getItem("ns_recent")) || [];
    if (!recent.includes(p.id)) {
        recent.unshift(p.id);
        if (recent.length > 4) recent.pop();
        localStorage.setItem("ns_recent", JSON.stringify(recent));
    }

    // Bind item specifications dynamically directly to the DOM nodes
    document.getElementById("dp-graphic-target").innerHTML = generateDynamicGraphic(p.graphicType);
    document.getElementById("dp-title").textContent = p.name;
    document.getElementById("dp-category").textContent = `${p.gender} // ${p.category}`;
    document.getElementById("dp-price").textContent = `$${p.price}`;
    document.getElementById("dp-description").textContent = p.description;
    
    const stockMsg = document.getElementById("dp-stock");
    if (p.stock <= 4) {
        stockMsg.textContent = `CRITICAL AVAILABILITY: ONLY ${p.stock} UNITS REMAINING`;
        stockMsg.style.color = "var(--accent)";
    } else {
        stockMsg.textContent = "IN STOCK - PREMIUM LOGISTICS READY";
    }

    // Features list generation loop
    const featList = document.getElementById("dp-features-list");
    featList.innerHTML = p.features.map(f => `<li>${f}</li>`).join('');

    // Handle Size Choice Event
    let activeSize = "M";
    const sizeBoxes = document.querySelectorAll(".size-box");
    sizeBoxes.forEach(box => {
        box.addEventListener("click", () => {
            sizeBoxes.forEach(b => b.classList.remove("selected"));
            box.classList.add("selected");
            activeSize = box.dataset.size;
        });
    });

    // Wire Up Core CTA Add Button Actions
    const buyBtn = document.getElementById("dp-add-btn");
    buyBtn.onclick = () => {
        const qty = parseInt(document.getElementById("dp-qty-select")?.value) || 1;
        window.addToCart(p.id, activeSize, qty);
    };
}

// AUTHENTICATION SYSTEM CONTROLLER (MOCK LOGIN)
function initAuthPage() {
    if (currentUser) {
        window.location.href = "dashboard.html";
        return;
    }

    const signInTab = document.getElementById("auth-signin-tab");
    const registerTab = document.getElementById("auth-register-tab");
    const authForm = document.getElementById("auth-form");
    const formTitle = document.getElementById("auth-form-title");
    const submitBtn = document.getElementById("auth-submit-btn");
    const authMessage = document.getElementById("auth-message");
    const nameRow = document.getElementById("auth-name-row");
    const confirmRow = document.getElementById("auth-confirm-row");
    const googleButton = document.getElementById("google-oauth-trigger");

    if (!authForm || !signInTab || !registerTab) return;

    const users = JSON.parse(localStorage.getItem("ns_users")) || [];

    const setMode = (mode) => {
        authForm.dataset.mode = mode;
        if (mode === "register") {
            signInTab.classList.remove("active");
            registerTab.classList.add("active");
            formTitle.textContent = "Create Account";
            submitBtn.textContent = "Create Account";
            nameRow.style.display = "block";
            confirmRow.style.display = "block";
            authMessage.textContent = "";
        } else {
            signInTab.classList.add("active");
            registerTab.classList.remove("active");
            formTitle.textContent = "Sign In";
            submitBtn.textContent = "Request Clearance Token";
            nameRow.style.display = "none";
            confirmRow.style.display = "none";
            authMessage.textContent = "";
        }
    };

    const showAuthMessage = (text, isError = false) => {
        authMessage.textContent = text;
        authMessage.style.color = isError ? "#ff6b6b" : "var(--accent)";
    };

    const getUserByEmail = (email) => {
        return users.find(user => user.email.toLowerCase() === email.toLowerCase());
    };

    const saveUsers = () => {
        localStorage.setItem("ns_users", JSON.stringify(users));
    };

    const loginUser = (user) => {
        currentUser = user;
        localStorage.setItem("ns_user", JSON.stringify(user));
        updateBadges();
        showToast(`Welcome back, ${user.name}!`, "success");
        setTimeout(() => window.location.href = "dashboard.html", 1000);
    };

    const registerUser = (name, email, password) => {
        const [first, ...rest] = name.trim().split(" ");
        const last = rest.join(" ");
        const user = {
            name: name.trim(),
            firstName: first || "User",
            lastName: last || "",
            email: email.toLowerCase(),
            password,
            level: "Verified Member"
        };
        users.push(user);
        saveUsers();
        loginUser(user);
    };

    signInTab.addEventListener("click", () => setMode("login"));
    registerTab.addEventListener("click", () => setMode("register"));

    authForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("auth-email").value.trim().toLowerCase();
        const password = document.getElementById("auth-pass").value;
        if (!email || !password) {
            return showAuthMessage("Enter both email and password.", true);
        }
        if (authForm.dataset.mode === "register") {
            const displayName = document.getElementById("auth-name").value.trim();
            const confirmPassword = document.getElementById("auth-confirm").value;
            if (!displayName) {
                return showAuthMessage("Enter your full name.", true);
            }
            if (password.length < 6) {
                return showAuthMessage("Use at least 6 characters for your pass-string.", true);
            }
            if (password !== confirmPassword) {
                return showAuthMessage("Pass-string confirmation does not match.", true);
            }
            if (getUserByEmail(email)) {
                return showAuthMessage("An account already exists with that email.", true);
            }
            registerUser(displayName, email, password);
        } else {
            const user = getUserByEmail(email);
            if (!user || user.password !== password) {
                return showAuthMessage("Invalid email or pass-string.", true);
            }
            loginUser(user);
        }
    });

    googleButton?.addEventListener("click", () => {
        const mockUser = { name: "Google User", email: "google.user@novastitch.com", level: "Google Auth" };
        currentUser = mockUser;
        localStorage.setItem("ns_user", JSON.stringify(mockUser));
        showToast("Signed in with Google!", "success");
        setTimeout(() => window.location.href = "dashboard.html", 1000);
    });

    setMode("login");
}

// USER SYSTEM PROFILE DASHBOARD
function initDashboardPage() {
    const user = JSON.parse(localStorage.getItem("ns_user"));
    if (!user) {
        showToast("Unauthorized entry vector detected. Redirecting credentials portal.", "error");
        window.location.href = "auth.html";
        return;
    }

    document.getElementById("db-username").textContent = user.name.toUpperCase();
    document.getElementById("db-tier").textContent = user.level;
    document.getElementById("db-email").textContent = user.email;

    // Render Wishlist array items inside profile section 
    const wishGrid = document.getElementById("db-wishlist-grid");
    if (wishGrid) {
        const items = window.PRODUCTS_DB.filter(p => wishlist.includes(p.id));
        if (items.length === 0) {
            wishGrid.innerHTML = "<p style='color:var(--text-muted);'>No designs stored inside active directory.</p>";
        } else {
            wishGrid.innerHTML = items.map(p => buildProductCardHTML(p)).join('');
        }
    }

    // Setup Logout Trigger
    document.getElementById("logout-trigger")?.addEventListener("click", () => {
        currentUser = null;
        localStorage.removeItem("ns_user");
        renderUserState();
        showToast("De-authorized user session. Wiping credentials caching.", "info");
        setTimeout(() => window.location.href = "index.html", 1000);
    });
}

// CHECKOUT PAGE CONTROLLER
function initCheckoutPage() {
    const checkoutItemsList = document.getElementById("checkout-items-summary");
    if (!checkoutItemsList) return;

    let subtotal = 0;
    checkoutItemsList.innerHTML = cart.map(item => {
        const p = window.PRODUCTS_DB.find(prod => prod.id === item.id);
        if (!p) return "";
        const rowCost = p.price * item.quantity;
        subtotal += rowCost;
        return `
            <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem; font-size:0.9rem;">
                <span>${p.name} (x${item.quantity})</span>
                <span>$${rowCost}</span>
            </div>
        `;
    }).join("");

    let discount = 0;
    const updatePricesDisplay = () => {
        document.getElementById("co-subtotal").textContent = `$${subtotal}`;
        document.getElementById("co-discount").textContent = `-$${discount}`;
        document.getElementById("co-total").textContent = `$${subtotal - discount}`;
    };

    // Apply Coupon Logic
    document.getElementById("apply-promo-btn")?.addEventListener("click", () => {
        const code = document.getElementById("promo-input").value.toUpperCase();
        if (code === "ROAR20") {
            discount = Math.round(subtotal * 0.20);
            showToast("Promo Applied: 20% Off Order Total!", "success");
            updatePricesDisplay();
        } else {
            showToast("Invalid security clearance promo string.", "error");
        }
    });

    updatePricesDisplay();

    // Order Finalization Execution Block
    document.getElementById("checkout-form")?.addEventListener("submit", (e) => {
        e.preventDefault();
        showToast("Processing high-security mock logistics transmission transaction...", "info");
        setTimeout(() => {
            localStorage.removeItem("ns_cart");
            document.querySelector(".checkout-grid-layout-wrapper").innerHTML = `
                <div style="text-align:center; padding: 5rem 2rem; background: var(--bg-secondary); border-radius:var(--radius-md); grid-column: 1/-1;">
                    <svg style="width:80px; height:80px; fill:var(--accent); margin-bottom:2rem;" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    <h1 style="font-family:var(--font-display); margin-bottom:1rem;">ORDER MANIFEST SENT</h1>
                    <p style="color:var(--text-muted); margin-bottom:2rem;">Your transaction has cleared successfully. This simulation is complete.</p>
                    <a href="index.html" class="btn btn-accent">Return base station</a>
                </div>
            `;
            updateBadges();
        }, 2000);
    });
}