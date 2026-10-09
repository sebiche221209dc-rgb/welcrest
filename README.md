const products = [
  {
    id: 1,
    name: "Pulse X",
    category: "audio",
    categoryLabel: "Audífonos",
    price: 249,
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    name: "Echo Air",
    category: "audio",
    categoryLabel: "Audífonos",
    price: 179,
    badge: "Nuevo",
    image:
      "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    name: "Core Band Pro",
    category: "fitness",
    categoryLabel: "Powerbands",
    price: 89,
    badge: "Popular",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    name: "Flex Loop",
    category: "fitness",
    categoryLabel: "Powerbands",
    price: 69,
    badge: "Oferta",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 5,
    name: "Boost Mini",
    category: "audio",
    categoryLabel: "Audífonos",
    price: 129,
    badge: "Premium",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 6,
    name: "Power Loop Max",
    category: "fitness",
    categoryLabel: "Powerbands",
    price: 109,
    badge: "Pro",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80",
  },
];

const WHATSAPP_NUMBER = "521234567890";
const cart = [];
let currentFilter = "all";

const productGrid = document.getElementById("product-grid");
const cartCount = document.getElementById("cart-count");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const filterButtons = document.querySelectorAll(".filter");
const checkoutButton = document.getElementById("checkout-btn");

function formatPrice(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

function renderProducts() {
  const filteredProducts =
    currentFilter === "all"
      ? products
      : products.filter((product) => product.category === currentFilter);

  productGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <article class="product-item" data-category="${product.category}">
          <div class="product-media">
            <span class="badge">${product.badge}</span>
            <img src="${product.image}" alt="${product.name}" />
          </div>
          <div class="product-info">
            <div class="product-top">
              <h3>${product.name}</h3>
            </div>
            <div class="product-category">${product.categoryLabel}</div>
            <div class="product-bottom">
              <span class="price">${formatPrice(product.price)}</span>
              <button class="mini-btn" type="button" data-product-id="${product.id}">Agregar</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  bindProductButtons();
}

function bindProductButtons() {
  document.querySelectorAll("[data-product-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number(button.getAttribute("data-product-id"));
      addToCart(productId);
    });
  });
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  openCart();
}

function removeFromCart(productId) {
  const index = cart.findIndex((item) => item.id === productId);
  if (index === -1) return;
  cart.splice(index, 1);
  renderCart();
}

function changeQuantity(productId, change) {
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  renderCart();
}

function getWhatsAppCheckoutLink() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = cart
    .map((item) => `${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`)
    .join(", ");

  const baseText = encodeURIComponent(
    `Hola Welcrest, quiero confirmar mi pedido.\n\n${message}\n\nTotal: ${formatPrice(subtotal)}`
  );

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${baseText}`;
}

function renderCart() {
  if (!cart.length) {
    cartItemsContainer.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>';
    cartCount.textContent = "0";
    cartTotal.textContent = "$0.00";
    return;
  }

  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div class="cart-item-content">
            <div class="cart-item-top">
              <h4>${item.name}</h4>
              <button class="remove-item" type="button" data-remove-id="${item.id}">Eliminar</button>
            </div>
            <div>${formatPrice(item.price)}</div>
            <div class="qty-control">
              <button type="button" data-qty-change="decrease" data-product-id="${item.id}">-</button>
              <span class="qty-value">${item.quantity}</span>
              <button type="button" data-qty-change="increase" data-product-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
    )
    .join("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = String(cart.reduce((sum, item) => sum + item.quantity, 0));
  cartTotal.textContent = formatPrice(subtotal);

  document.querySelectorAll("[data-remove-id]").forEach((button) => {
    button.addEventListener("click", () => {
      removeFromCart(Number(button.getAttribute("data-remove-id")));
    });
  });

  document.querySelectorAll("[data-qty-change]").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number(button.getAttribute("data-product-id"));
      const action = button.getAttribute("data-qty-change");
      changeQuantity(productId, action === "increase" ? 1 : -1);
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

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
    renderProducts();
  });
});

document.querySelector(".cart-btn").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
document.getElementById("cart-overlay").addEventListener("click", closeCart);
checkoutButton.addEventListener("click", () => {
  if (!cart.length) {
    alert("Tu carrito está vacío. Agrega al menos un producto antes de continuar.");
    return;
  }

  window.open(getWhatsAppCheckoutLink(), "_blank", "noopener,noreferrer");
});

renderProducts();
renderCart();
