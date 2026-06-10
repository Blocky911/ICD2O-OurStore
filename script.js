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

let cart = [];
const cartSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav");

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    initThemeControl();
});

function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">[ Product Image ]</div>
            <div class="product-info">
                <div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('open');
    document.getElementById('cart-overlay').classList.toggle('open');
}

function addToCart(productId) {
    const targetItem = products.find(p => p.id === productId);
    cart.push(targetItem);
    
    cartSound.currentTime = 0;
    cartSound.play().catch(() => {});
    
    updateCartUI();
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const itemsContainer = document.getElementById('cart-items');
    itemsContainer.innerHTML = '';
    
    if(cart.length === 0) {
        itemsContainer.innerHTML = `<p class="empty-msg">Your cart is empty.</p>`;
        document.getElementById('cart-total-val').innerText = "0.00";
        return;
    }
    
    let totalSum = 0;
    cart.forEach((item, index) => {
        totalSum += item.price;
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <small>$${item.price.toFixed(2)}</small>
            </div>
            <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#ef4444; cursor:pointer;">Remove</button>
        `;
        itemsContainer.appendChild(row);
    });
    document.getElementById('cart-total-val').innerText = totalSum.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function initThemeControl() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    toggleBtn.addEventListener('click', () => {
        const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
    });
}