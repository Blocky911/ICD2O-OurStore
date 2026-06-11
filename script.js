// Product Dataset
const products = [
    { id: 1, name: "Oversized Graphic Hoodie", price: 85.00 },
    { id: 2, name: "Minimalist Logo T-Shirt", price: 40.00 },
    { id: 3, name: "Cargo Pants w/ Utility Pockets", price: 95.00 },
    { id: 4, name: "Crossbody Sling Bag", price: 60.00 },
    { id: 5, name: "Canvas Dad Cap", price: 30.00 },
    { id: 6, name: "Ribbed Knit Beanie", price: 28.00 },
    { id: 7, name: "Vintage-Wash Denim Jacket", price: 120.00 },
    { id: 8, name: "Patterned Crew Socks (3-Pack)", price: 22.00 }
];

let cartCount = 0;

// Instantiate the Add-To-Cart UI Click sound (using an online lightweight synth beep as fallback)
const cartSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav");

// Load page layout
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    initThemeControl();
    initAuthSimulation();
});

// Build items on interface
function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">[ Image Pending ]</div>
            <div class="product-info">
                <div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart()">Add to Cart</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Increment Count & Fire Sound effect
function addToCart() {
    cartCount++;
    const countSpan = document.getElementById('cart-count');
    if (countSpan) countSpan.innerText = cartCount;
    
    // Play the audio cue cleanly even if tapped fast
    cartSound.currentTime = 0;
    cartSound.play().catch(err => console.log("Audio playback delayed until user interacting."));
}

// Theme Switcher Setup (Saves Preference via LocalStorage)
function initThemeControl() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;
    
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    toggleBtn.addEventListener('click', () => {
        let targetTheme = 'dark';
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            targetTheme = 'light';
        }
        document.documentElement.setAttribute('data-theme', targetTheme);
        localStorage.setItem('theme', targetTheme);
    });
}

// Sign-In Form simulation link 
function initAuthSimulation() {
    const signInForm = document.getElementById('signin-form');
    if (signInForm) {
        signInForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert(`Welcome back! Returning to shop.`);
            window.location.href = "index.html";
        });
    }
}