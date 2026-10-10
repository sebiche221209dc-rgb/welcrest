const products = [
  {
    id: 1,
    name: "AirPods Pro 2",
    category: "audio",
    price: 25.99,
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "AirPods Pro 3",
    category: "audio",
    price: 29.99,
    badge: "NUEVO",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Apple PowerBand",
    category: "fitness",
    price: 29.99,
    badge: "OFERTA",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Cable USB-C Premium",
    category: "audio",
    price: 12.99,
    badge: "POPULAR",
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "Funda de silicona",
    category: "audio",
    price: 8.99,
    badge: "ACCESORIO",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "PowerBand Pro",
    category: "fitness",
    price: 39.99,
    badge: "PREMIUM",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80"
  }
];

const cart = [];
let currentFilter = "all";

const productsGrid = document.getElementById("products-grid");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const cartButton = document.getElementById("cart-button");
const closeCartButton = document.getElementById("close-cart");
const checkoutButton = document.getElementById("checkout-btn");
const filterButtons = document.querySelectorAll(".filter");

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(value);
}

function renderProducts() {
  const filteredProducts = currentFilter === "all"
    ? products
    : products.filter(p => p.category === currentFilter);

  productsGrid.innerHTML = filteredProducts.map(product => `
    <div class="product-item">
      <div class="product-media">
        <span class="badge">${product.badge}</span>
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <div class="product-top">
          <h3>${product.name}</h3>
        </div>
        <div class="product-category">Audio Premium</div>
        <div class="product-bottom">
          <span class="price">${formatPrice(product.price)}</span>
          <button class="mini-btn" type="button" data-product-id="${product.id}">Agregar</button>
        </div>
      </div>
    </div>
  `).join("");

  document.querySelectorAll("[data-product-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      addToCart(Number(btn.getAttribute("data-product-id")));
    });
  });
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(p => p.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  openCart();
}

function removeFromCart(productId) {
  const index = cart.findIndex(p => p.id === productId);
  if (index >= 0) cart.splice(index, 1);
  renderCart();
}

function updateQty(productId, change) {
  const item = cart.find(p => p.id === productId);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) removeFromCart(productId);
  else renderCart();
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>';
    cartCount.textContent = "0";
    cartTotal.textContent = "$0.00";
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-content">
        <div class="cart-item-top">
          <h4>${item.name}</h4>
          <button class="remove-item" type="button" data-remove-id="${item.id}">Eliminar</button>
        </div>
        <div>${formatPrice(item.price)}</div>
        <div class="qty-control">
          <button type="button" data-qty-decrease="${item.id}">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button type="button" data-qty-increase="${item.id}">+</button>
        </div>
      </div>
    </div>
  `).join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartTotal.textContent = formatPrice(total);

  document.querySelectorAll("[data-remove-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      removeFromCart(Number(btn.getAttribute("data-remove-id")));
    });
  });

  document.querySelectorAll("[data-qty-increase]").forEach(btn => {
    btn.addEventListener("click", () => {
      updateQty(Number(btn.getAttribute("data-qty-increase")), 1);
    });
  });

  document.querySelectorAll("[data-qty-decrease]").forEach(btn => {
    btn.addEventListener("click", () => {
      updateQty(Number(btn.getAttribute("data-qty-decrease")), -1);
    });
  });
}

function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("visible");
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("visible");
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterButtons.forEach(b => b.classList.toggle("active", b === btn));
    renderProducts();
  });
});

cartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

checkoutButton.addEventListener("click", () => {
  if (!cart.length) {
    alert("Tu carrito está vacío.");
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = cart.map(item => `${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`).join("\n");
  const text = encodeURIComponent(`🎉 *PEDIDO WELCREST*\n\n${message}\n\n💰 *Total: ${formatPrice(total)}*\n\n¡Gracias por tu compra!`);
  window.open(`https://wa.me/593978641572?text=${text}`, "_blank");
});

renderProducts();
renderCart();