// Product Data Array
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

// Function to render products to the page
function renderProducts() {
    const grid = document.getElementById('product-grid');
    
    products.forEach(product => {
        // Create card container
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Populate card HTML
        card.innerHTML = `
            <div class="product-image">[ Product Image Here ]</div>
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

// Function to handle adding items to the cart
function addToCart() {
    cartCount++;
    document.getElementById('cart-count').innerText = cartCount;
    
    // Optional: Add a small visual feedback animation here later
}

// Initialize the store when the page loads
window.onload = renderProducts;