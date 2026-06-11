/* =========================================================
   FruitStitch Main Application
   Fully Functional Version With Google Sign-In
   ========================================================= */

const GOOGLE_CLIENT_ID = "156945605485-gigtghcv55k55iej9um77egdq038l5ff.apps.googleusercontent.com";
let googleTokenClient;

document.addEventListener("DOMContentLoaded", initApp);

let cart = readJSON("fs_cart", []);
let wishlist = readJSON("fs_wishlist", []);
let currentUser = readJSON("fs_user", null);
let users = readJSON("fs_users", []);
let currentTheme = localStorage.getItem("fs_theme") || "dark";
let activePromo = readJSON("fs_promo", null);

function readJSON(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

function saveJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function products() {
    return Array.isArray(window.PRODUCTS_DB) ? window.PRODUCTS_DB : [];
}

function initApp() {
    document.documentElement.setAttribute("data-theme", currentTheme);

    setupThemeToggle();
    setupSearch();
    setupMobileMenu();
    updateBadges();

    const page = window.location.pathname.split("/").pop() || "index.html";

    if (page === "index.html") initHomePage();
    if (page === "shop.html") initShopPage();
    if (page === "product.html") initProductPage();
    if (page === "cart.html") initCartPage();
    if (page === "checkout.html") initCheckoutPage();
    if (page === "signin.html" || page === "auth.html") initAuthPage();
    if (page === "dashboard.html") initDashboardPage();

    setupNewsletter();
}

function showToast(message, type = "success", duration = 2400) {
    let container = document.getElementById("toast-container");

    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 250);
    }, duration);
}

window.showToast = showToast;

function setupThemeToggle() {
    const buttons = document.querySelectorAll("#theme-toggle-btn, .theme-toggle-btn, #theme-toggle");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            currentTheme = currentTheme === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", currentTheme);
            localStorage.setItem("fs_theme", currentTheme);
            showToast(`Switched to ${currentTheme} mode`, "info");
        });
    });
}

function setupSearch() {
    document.querySelectorAll(".global-search-input").forEach(input => {
        input.addEventListener("keydown", event => {
            if (event.key === "Enter" && input.value.trim()) {
                window.location.href = `shop.html?search=${encodeURIComponent(input.value.trim())}`;
            }
        });
    });
}

function setupMobileMenu() {
    const btn = document.getElementById("mobile-menu-btn");
    const nav = document.querySelector(".nav-menu");

    if (!btn || !nav) return;

    btn.addEventListener("click", () => {
        nav.classList.toggle("open");
        btn.classList.toggle("open");
    });
}

function updateBadges() {
    const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

    document.querySelectorAll(".cart-count-badge, #cart-count").forEach(el => {
        el.textContent = totalItems;
    });

    document.querySelectorAll(".wish-count-badge").forEach(el => {
        el.textContent = wishlist.length;
    });
}

function productVisual(product) {
    const accent = product.accent || "#ff1a4d";
    const emoji = product.emoji || "🍓";

    return `
        <div class="product-visual" style="--product-accent:${accent}">
            <div class="fruit-orbit one"></div>
            <div class="fruit-orbit two"></div>
            <div class="product-emoji">${emoji}</div>
            <div class="product-shape"></div>
        </div>
    `;
}

function starRating(product) {
    const rating = Number(product.rating || 4.5);
    return `
        <div class="rating-row">
            <span class="stars">★★★★★</span>
            <span>${rating.toFixed(1)} (${product.reviews || 0})</span>
        </div>
    `;
}

function buildProductCard(product) {
    const wished = wishlist.some(id => String(id) === String(product.id));
    const oldPrice = product.oldPrice ? `<span class="price-old">$${product.oldPrice}</span>` : "";

    return `
        <article class="product-card reveal-card" data-id="${product.id}">
            <a href="product.html?id=${product.id}" class="product-image-wrapper">
                ${product.tag ? `<span class="product-badge">${product.tag}</span>` : ""}
                ${productVisual(product)}
            </a>

            <div class="product-info">
                <div class="product-meta">
                    <span>${product.category}</span>
                    <span>${product.gender}</span>
                </div>

                <h3 class="product-title">
                    <a href="product.html?id=${product.id}">${product.name}</a>
                </h3>

                ${starRating(product)}

                <div class="product-price-row">
                    <div>
                        <span class="price-current">$${product.price}</span>
                        ${oldPrice}
                    </div>

                    <button class="icon-btn wishlist-btn ${wished ? "active" : ""}" onclick="toggleWishlist(${product.id})" title="Wishlist">
                        ${wished ? "♥" : "♡"}
                    </button>
                </div>

                <div class="card-actions">
                    <button class="btn btn-accent" onclick="addToCart(${product.id})">Add to Cart</button>
                    <a class="btn btn-soft" href="product.html?id=${product.id}">View</a>
                </div>
            </div>
        </article>
    `;
}

function initHomePage() {
    const grid = document.getElementById("featured-products-grid");

    if (grid) {
        grid.innerHTML = products().slice(0, 4).map(buildProductCard).join("");
    }

    animateCounters();
    setupRevealAnimations();
}

function animateCounters() {
    document.querySelectorAll("[data-count]").forEach(el => {
        const target = Number(el.dataset.count);
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 50));

        const timer = setInterval(() => {
            current += step;

            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            el.textContent = current.toLocaleString();
        }, 25);
    });
}

function setupRevealAnimations() {
    const items = document.querySelectorAll(".reveal-card, .section-title, .category-card");

    if (!("IntersectionObserver" in window)) {
        items.forEach(item => item.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    items.forEach(item => observer.observe(item));
}

function initShopPage() {
    const params = new URLSearchParams(window.location.search);

    const category = params.get("category");
    const gender = params.get("gender");
    const search = params.get("search");

    if (category) {
        const box = document.querySelector(`.filter-category-chk[value="${category}"]`);
        if (box) box.checked = true;
    }

    if (gender) {
        const box = document.querySelector(`.filter-gender-chk[value="${gender}"]`);
        if (box) box.checked = true;
    }

    const searchInput = document.getElementById("shop-page-search-input");
    if (searchInput && search) searchInput.value = search;

    document.querySelectorAll(".filter-category-chk, .filter-gender-chk, #price-sort-select").forEach(el => {
        el.addEventListener("change", renderShop);
    });

    if (searchInput) searchInput.addEventListener("input", renderShop);

    const clearBtn = document.getElementById("clear-filters-btn");

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            document.querySelectorAll(".filter-category-chk, .filter-gender-chk").forEach(box => box.checked = false);
            if (searchInput) searchInput.value = "";

            const sort = document.getElementById("price-sort-select");
            if (sort) sort.value = "default";

            renderShop();
        });
    }

    renderShop();
}

function renderShop() {
    const grid = document.getElementById("shop-main-products-grid");
    if (!grid) return;

    const selectedCategories = [...document.querySelectorAll(".filter-category-chk:checked")].map(el => el.value);
    const selectedGenders = [...document.querySelectorAll(".filter-gender-chk:checked")].map(el => el.value);
    const sort = document.getElementById("price-sort-select")?.value || "default";
    const search = document.getElementById("shop-page-search-input")?.value.trim().toLowerCase() || "";

    let list = [...products()];

    if (selectedCategories.length) {
        list = list.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedGenders.length) {
        list = list.filter(p => selectedGenders.includes(p.gender) || p.gender === "unisex");
    }

    if (search) {
        list = list.filter(p =>
            p.name.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search) ||
            p.category.toLowerCase().includes(search)
        );
    }

    if (sort === "low-high") list.sort((a, b) => a.price - b.price);
    if (sort === "high-low") list.sort((a, b) => b.price - a.price);

    const count = document.getElementById("product-count");
    if (count) count.textContent = `${list.length} product${list.length === 1 ? "" : "s"} found`;

    grid.innerHTML = list.length
        ? list.map(buildProductCard).join("")
        : `<div class="empty-state">No products match your filters.</div>`;

    setupRevealAnimations();
}

function initProductPage() {
    const id = new URLSearchParams(window.location.search).get("id");
    const product = products().find(p => String(p.id) === String(id));
    const container = document.getElementById("product-detail-container");

    if (!product) {
        if (container) container.innerHTML = `<div class="empty-state">Product not found.</div>`;
        return;
    }

    saveRecent(product.id);

    setHTML("dp-graphic-target", productVisual(product));
    setText("dp-category", `${product.category} // ${product.gender}`);
    setText("dp-title", product.name);
    setText("dp-price", `$${product.price}`);
    setText("dp-description", product.description);

    const stock = document.getElementById("dp-stock");

    if (stock) {
        stock.textContent = product.stock <= 5 ? `Only ${product.stock} left in stock` : "In stock and ready to ship";
        stock.className = product.stock <= 5 ? "stock-warning" : "stock-good";
    }

    const features = document.getElementById("dp-features-list");

    if (features) {
        features.innerHTML = product.features.map(item => `<li>${item}</li>`).join("");
    }

    let selectedSize = "M";

    document.querySelectorAll(".size-box").forEach(box => {
        if (box.dataset.size === "M" || box.textContent.trim() === "M") {
            box.classList.add("selected");
        }

        box.addEventListener("click", () => {
            document.querySelectorAll(".size-box").forEach(b => b.classList.remove("selected", "active"));
            box.classList.add("selected", "active");
            selectedSize = box.dataset.size || box.textContent.trim();
        });
    });

    const addBtn = document.getElementById("dp-add-btn") || document.getElementById("dp-add-cart-btn");

    if (addBtn) {
        addBtn.addEventListener("click", () => {
            const qty = Number(document.getElementById("dp-qty-select")?.value || 1);
            addToCart(product.id, selectedSize, qty);
        });
    }

    const wishBtn = document.getElementById("dp-wishlist-btn");

    if (wishBtn) {
        wishBtn.addEventListener("click", () => toggleWishlist(product.id));
    }

    renderRecommended(product);
}

function renderRecommended(currentProduct) {
    const grid = document.getElementById("recommended-products-grid") || document.getElementById("recently-viewed-grid");
    if (!grid) return;

    const related = products()
        .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
        .slice(0, 4);

    grid.innerHTML = related.map(buildProductCard).join("");
    setupRevealAnimations();
}

function saveRecent(id) {
    let recent = readJSON("fs_recent", []);
    recent = recent.filter(item => String(item) !== String(id));
    recent.unshift(id);
    recent = recent.slice(0, 6);
    saveJSON("fs_recent", recent);
}

window.addToCart = function addToCart(id, size = "M", quantity = 1) {
    const product = products().find(p => String(p.id) === String(id));

    if (!product) {
        showToast("Product not found", "error");
        return;
    }

    const existing = cart.find(item => String(item.id) === String(id) && item.size === size);

    if (existing) {
        existing.quantity += Number(quantity);
    } else {
        cart.push({
            id: product.id,
            size,
            quantity: Number(quantity),
            price: product.price,
            name: product.name
        });
    }

    saveJSON("fs_cart", cart);
    updateBadges();
    renderCartPage();
    renderCheckoutCart();
    showToast(`${product.name} added to cart`, "success");
};

window.removeFromCart = function removeFromCart(id, size = "M") {
    cart = cart.filter(item => !(String(item.id) === String(id) && item.size === size));
    saveJSON("fs_cart", cart);
    updateBadges();
    renderCartPage();
    renderCheckoutCart();
    showToast("Removed from cart", "info");
};

window.updateCartQuantity = function updateCartQuantity(id, size, quantity) {
    const item = cart.find(i => String(i.id) === String(id) && i.size === size);
    if (!item) return;

    item.quantity = Math.max(1, Number(quantity));
    saveJSON("fs_cart", cart);
    updateBadges();
    renderCartPage();
    renderCheckoutCart();
};

window.clearCart = function clearCart() {
    cart = [];
    activePromo = null;
    localStorage.removeItem("fs_promo");
    saveJSON("fs_cart", cart);
    updateBadges();
    renderCartPage();
    renderCheckoutCart();
    showToast("Cart cleared", "info");
};

window.checkout = function checkout() {
    if (!cart.length) {
        showToast("Your cart is empty", "error");
        return;
    }

    window.location.href = "checkout.html";
};

function initCartPage() {
    renderCartPage();
}

function renderCartPage() {
    const container = document.getElementById("cart");
    const totalEl = document.getElementById("total");

    if (!container) return;

    if (!cart.length) {
        container.innerHTML = `<div class="empty-state">Your cart is empty.</div>`;
        if (totalEl) totalEl.textContent = "";
        return;
    }

    let total = 0;

    container.innerHTML = cart.map(item => {
        const product = products().find(p => String(p.id) === String(item.id));
        if (!product) return "";

        const rowTotal = product.price * item.quantity;
        total += rowTotal;

        return `
            <div class="cart-row">
                <div class="mini-product">
                    ${productVisual(product)}
                </div>

                <div>
                    <h3>${product.name}</h3>
                    <p>Size: ${item.size}</p>
                    <p>$${product.price} each</p>
                </div>

                <div class="cart-controls">
                    <input type="number" min="1" value="${item.quantity}" onchange="updateCartQuantity(${item.id}, '${item.size}', this.value)">
                    <strong>$${rowTotal.toFixed(2)}</strong>
                    <button class="btn btn-soft" onclick="removeFromCart(${item.id}, '${item.size}')">Remove</button>
                </div>
            </div>
        `;
    }).join("");

    if (totalEl) totalEl.textContent = `Total: $${total.toFixed(2)}`;
}

window.toggleWishlist = function toggleWishlist(id) {
    const exists = wishlist.some(item => String(item) === String(id));

    if (exists) {
        wishlist = wishlist.filter(item => String(item) !== String(id));
        showToast("Removed from wishlist", "info");
    } else {
        wishlist.push(id);
        showToast("Added to wishlist", "success");
    }

    saveJSON("fs_wishlist", wishlist);
    updateBadges();

    renderShop();
    renderDashboardWishlist();
};

function initAuthPage() {
    if (currentUser) {
        window.location.href = "dashboard.html";
        return;
    }

    const form = document.getElementById("secure-auth-form");
    const signInTab = document.getElementById("auth-signin-tab");
    const registerTab = document.getElementById("auth-register-tab");
    const submitBtn = document.getElementById("auth-submit-btn");
    const nameRow = document.getElementById("auth-name-row");
    const confirmRow = document.getElementById("auth-confirm-row");
    const googleBtn = document.getElementById("google-oauth-trigger");
    const msgBox = document.getElementById("auth-message");

    function authMessage(message, isError = false) {
        if (!msgBox) return;
        msgBox.textContent = message;
        msgBox.style.color = isError ? "var(--accent-primary)" : "var(--accent-success)";
    }

    function setMode(mode) {
        if (!form) return;

        form.dataset.mode = mode;

        if (mode === "register") {
            signInTab?.classList.remove("active");
            registerTab?.classList.add("active");
            if (submitBtn) submitBtn.textContent = "Create Account";
            if (nameRow) nameRow.style.display = "block";
            if (confirmRow) confirmRow.style.display = "block";
        } else {
            signInTab?.classList.add("active");
            registerTab?.classList.remove("active");
            if (submitBtn) submitBtn.textContent = "Sign In";
            if (nameRow) nameRow.style.display = "none";
            if (confirmRow) confirmRow.style.display = "none";
        }

        authMessage("");
    }

    signInTab?.addEventListener("click", () => setMode("signin"));
    registerTab?.addEventListener("click", () => setMode("register"));

    form?.addEventListener("submit", event => {
        event.preventDefault();

        const mode = form.dataset.mode || "signin";
        const email = document.getElementById("auth-email")?.value.trim().toLowerCase();
        const password = document.getElementById("auth-password")?.value || "";
        const name = document.getElementById("auth-name")?.value.trim() || "";
        const confirm = document.getElementById("auth-confirm")?.value || "";

        if (!email || !password) {
            authMessage("Please enter your email and password.", true);
            return;
        }

        if (password.length < 4) {
            authMessage("Password must be at least 4 characters.", true);
            return;
        }

        if (mode === "register") {
            if (!name) {
                authMessage("Please enter your full name.", true);
                return;
            }

            if (password !== confirm) {
                authMessage("Passwords do not match.", true);
                return;
            }

            if (users.some(user => user.email === email)) {
                authMessage("This account already exists. Please sign in.", true);
                return;
            }

            const newUser = {
                name,
                email,
                password,
                provider: "local",
                level: "FruitStitch VIP Member"
            };

            users.push(newUser);
            saveJSON("fs_users", users);
            loginUser(newUser);
            return;
        }

        const foundUser = users.find(user => user.email === email && user.password === password);

        if (!foundUser) {
            authMessage("Account not found. Create an account first.", true);
            return;
        }

        loginUser(foundUser);
    });

    if (typeof google !== "undefined" && googleBtn) {
        googleTokenClient = google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
            callback: handleGoogleTokenResponse
        });

        googleBtn.addEventListener("click", () => {
            authMessage("Connecting to Google...");
            googleTokenClient.requestAccessToken();
        });
    } else if (googleBtn) {
        googleBtn.addEventListener("click", () => {
            authMessage("Google Sign-In failed to load. Use Live Server and check your Client ID.", true);
        });
    }

    setMode("signin");
}

function handleGoogleTokenResponse(tokenResponse) {
    const msgBox = document.getElementById("auth-message");

    if (!tokenResponse || !tokenResponse.access_token) {
        if (msgBox) msgBox.textContent = "Google sign-in was cancelled.";
        return;
    }

    fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`)
        .then(response => response.json())
        .then(profile => {
            const googleUser = {
                name: profile.name || "Google User",
                email: profile.email,
                picture: profile.picture,
                provider: "google",
                level: "Google Verified Member"
            };

            const existing = users.find(user => user.email === googleUser.email);

            if (!existing) {
                users.push(googleUser);
                saveJSON("fs_users", users);
            }

            loginUser(existing || googleUser);
        })
        .catch(error => {
            console.error(error);
            if (msgBox) {
                msgBox.textContent = "Could not load Google profile.";
                msgBox.style.color = "var(--accent-primary)";
            }
        });
}

function loginUser(user) {
    currentUser = {
        name: user.name,
        email: user.email,
        picture: user.picture || "",
        provider: user.provider || "local",
        level: user.level || "FruitStitch VIP Member"
    };

    saveJSON("fs_user", currentUser);
    showToast(`Welcome, ${currentUser.name}`, "success");

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 800);
}

window.continueWithGoogle = function continueWithGoogle() {
    const googleBtn = document.getElementById("google-oauth-trigger");
    if (googleBtn) googleBtn.click();
};

window.continueWithApple = function continueWithApple() {
    const appleUser = {
        name: "Apple User",
        email: "apple.user@fruitstitch.demo",
        provider: "apple",
        level: "Apple Demo Member"
    };

    const existing = users.find(user => user.email === appleUser.email);

    if (!existing) {
        users.push(appleUser);
        saveJSON("fs_users", users);
    }

    loginUser(existing || appleUser);
};

function initDashboardPage() {
    if (!currentUser) {
        window.location.href = "signin.html";
        return;
    }

    setText("user-name", currentUser.name);
    setText("db-username", currentUser.name);
    setText("db-email", currentUser.email);
    setText("db-tier", currentUser.level || "FruitStitch VIP Member");

    const logoutBtn = document.getElementById("logout-trigger");
    if (logoutBtn) logoutBtn.addEventListener("click", logout);

    renderDashboardWishlist();
}

function renderDashboardWishlist() {
    const container = document.getElementById("wishlist-items") || document.getElementById("db-wishlist-grid");
    if (!container) return;

    const items = wishlist
        .map(id => products().find(p => String(p.id) === String(id)))
        .filter(Boolean);

    container.innerHTML = items.length
        ? items.map(buildProductCard).join("")
        : `<div class="empty-state">Your wishlist is empty. Add some fresh picks from the shop.</div>`;

    setupRevealAnimations();
}

window.logout = function logout() {
    currentUser = null;
    localStorage.removeItem("fs_user");
    showToast("Signed out", "info");

    setTimeout(() => window.location.href = "index.html", 700);
};

function initCheckoutPage() {
    renderCheckoutCart();

    const promoBtn = document.getElementById("apply-promo-btn");
    if (promoBtn) promoBtn.addEventListener("click", applyPromo);

    const form = document.getElementById("checkout-form");
    if (form) form.addEventListener("submit", completeOrder);
}

function renderCheckoutCart() {
    const container = document.getElementById("checkout-items-summary");
    if (!container) return;

    if (!cart.length) {
        container.innerHTML = `<p>Your cart is empty.</p>`;
        updateCheckoutTotals(0, 0);
        return;
    }

    let subtotal = 0;

    container.innerHTML = cart.map(item => {
        const product = products().find(p => String(p.id) === String(item.id));
        if (!product) return "";

        const rowTotal = product.price * item.quantity;
        subtotal += rowTotal;

        return `
            <div class="checkout-item">
                <span>${product.name}<br><small>Size ${item.size} × ${item.quantity}</small></span>
                <strong>$${rowTotal.toFixed(2)}</strong>
            </div>
        `;
    }).join("");

    const discount = activePromo ? subtotal * activePromo.percent : 0;
    updateCheckoutTotals(subtotal, discount);
}

function applyPromo() {
    const code = document.getElementById("promo-input")?.value.trim().toUpperCase();

    const codes = {
        FRESH20: 0.20,
        FRUITY10: 0.10,
        SUMMER15: 0.15,
        ROAR20: 0.20
    };

    if (!code || !codes[code]) {
        activePromo = null;
        localStorage.removeItem("fs_promo");
        showToast("Invalid promo code", "error");
        renderCheckoutCart();
        return;
    }

    activePromo = {
        code,
        percent: codes[code]
    };

    saveJSON("fs_promo", activePromo);
    showToast(`${code} applied`, "success");
    renderCheckoutCart();
}

function updateCheckoutTotals(subtotal, discount) {
    const total = Math.max(0, subtotal - discount);

    setText("co-subtotal", `$${subtotal.toFixed(2)}`);
    setText("co-discount", `-$${discount.toFixed(2)}`);
    setText("co-total", `$${total.toFixed(2)}`);
}

function completeOrder(event) {
    event.preventDefault();

    if (!cart.length) {
        showToast("Your cart is empty", "error");
        return;
    }

    const firstName = document.querySelector("#first-name, input[placeholder*='John'], input[placeholder*='First']")?.value.trim();

    if (!firstName) {
        showToast("Please fill in your delivery details", "error");
        return;
    }

    const orderId = "FS-" + Math.floor(10000 + Math.random() * 90000);

    saveJSON("fs_last_order", {
        orderId,
        createdAt: new Date().toISOString(),
        items: cart
    });

    cart = [];
    activePromo = null;
    saveJSON("fs_cart", cart);
    localStorage.removeItem("fs_promo");

    updateBadges();

    const wrapper = document.querySelector(".checkout-grid-layout-wrapper");

    if (wrapper) {
        wrapper.innerHTML = `
            <div class="order-success">
                <div class="success-icon">✓</div>
                <h1>Order Complete</h1>
                <p>Thank you, ${firstName}. Your demo order was placed successfully.</p>
                <h3>Order ID: ${orderId}</h3>
                <a href="shop.html" class="btn btn-accent">Continue Shopping</a>
            </div>
        `;
    }

    showToast("Order completed", "success");
}

function setupNewsletter() {
    const form = document.getElementById("newsletter-form");
    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const email = form.querySelector("input")?.value.trim();
        if (!email) return;

        const list = readJSON("fs_newsletter", []);
        list.push(email);
        saveJSON("fs_newsletter", list);

        form.reset();
        showToast("Subscribed successfully", "success");
    });
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function setHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
}