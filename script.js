const products = [
  {
    id: "hoodie",
    name: "Oversized Signature Hoodie",
    category: "Essentials",
    price: 7399,
    badge: "Bestseller",
    color: "Carbon black",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "sneakers",
    name: "Aero Luxury Sneakers",
    category: "Footwear",
    price: 11999,
    badge: "New",
    color: "Bone white",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "jacket",
    name: "Premium Utility Jacket",
    category: "Outerwear",
    price: 18499,
    badge: "Limited",
    color: "Graphite",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "tee",
    name: "Heavyweight Street Tee",
    category: "Essentials",
    price: 4599,
    badge: "Hot",
    color: "Washed cream",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "pants",
    name: "Relaxed Cargo Trousers",
    category: "Essentials",
    price: 8899,
    badge: "Drop",
    color: "Moss grey",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "coat",
    name: "Wool Blend Long Coat",
    category: "Outerwear",
    price: 21999,
    badge: "Premium",
    color: "Camel",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "runner",
    name: "Mono Runner Sneakers",
    category: "Footwear",
    price: 9999,
    badge: "Fresh",
    color: "Stone",
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "shirt",
    name: "Resort Overshirt",
    category: "Outerwear",
    price: 6799,
    badge: "Edit",
    color: "Ink navy",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=900&auto=format&fit=crop"
  }
];

const state = {
  cart: JSON.parse(localStorage.getItem("felnathCart") || "[]"),
  wishlist: JSON.parse(localStorage.getItem("felnathWishlist") || "[]"),
  lastOrder: JSON.parse(localStorage.getItem("felnathLastOrder") || "null"),
  filter: "all",
  search: "",
  sort: "featured",
  couponApplied: false
};

const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const productGrid = document.getElementById("productGrid");
const emptyProducts = document.getElementById("emptyProducts");
const cartDrawer = document.getElementById("cartDrawer");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cart-count");
const wishlistCount = document.getElementById("wishlist-count");
const subtotalEl = document.getElementById("subtotal");
const discountEl = document.getElementById("discount");
const shippingEl = document.getElementById("shipping");
const totalEl = document.getElementById("total");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutItems = document.getElementById("checkoutItems");
const couponInput = document.getElementById("couponInput");
const couponMessage = document.getElementById("couponMessage");
const checkoutModal = document.getElementById("checkoutModal");
const toast = document.getElementById("toast");
const trackOrderId = document.getElementById("trackOrderId");
const trackContact = document.getElementById("trackContact");
const trackMessage = document.getElementById("trackMessage");
const trackResult = document.getElementById("trackResult");
const trackStatus = document.getElementById("trackStatus");
const trackTitle = document.getElementById("trackTitle");
const trackAmount = document.getElementById("trackAmount");
const trackTimeline = document.getElementById("trackTimeline");
const trackMeta = document.getElementById("trackMeta");

const saveState = () => {
  localStorage.setItem("felnathCart", JSON.stringify(state.cart));
  localStorage.setItem("felnathWishlist", JSON.stringify(state.wishlist));
  localStorage.setItem("felnathLastOrder", JSON.stringify(state.lastOrder));
};

const money = (value) => formatter.format(value).replace("₹", "Rs. ");

const getProduct = (id) => products.find((product) => product.id === id);

const cartTotals = () => {
  const subtotal = state.cart.reduce((sum, item) => sum + getProduct(item.id).price * item.qty, 0);
  const discount = state.couponApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal === 0 || subtotal >= 4999 ? 0 : 299;
  return {
    subtotal,
    discount,
    shipping,
    total: Math.max(subtotal - discount + shipping, 0)
  };
};

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
};

const renderProducts = () => {
  let visible = [...products];

  if (state.filter !== "all") {
    visible = visible.filter((product) => product.category === state.filter);
  }

  if (state.search.trim()) {
    const query = state.search.trim().toLowerCase();
    visible = visible.filter((product) =>
      [product.name, product.category, product.color].some((field) => field.toLowerCase().includes(query))
    );
  }

  if (state.sort === "low-high") {
    visible.sort((a, b) => a.price - b.price);
  }

  if (state.sort === "high-low") {
    visible.sort((a, b) => b.price - a.price);
  }

  productGrid.innerHTML = visible.map((product) => {
    const wished = state.wishlist.includes(product.id);
    return `
      <article class="product-card">
        <span class="badge">${product.badge}</span>
        <button class="wishlist-btn ${wished ? "active" : ""}" type="button" data-wishlist="${product.id}" aria-label="Add ${product.name} to wishlist">${wished ? "♥" : "♡"}</button>
        <div class="product-media">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="product-meta">
            <span>${product.category} · ${product.color}</span>
            <span class="price">${money(product.price)}</span>
          </div>
          <button class="primary-btn add-btn" type="button" data-add="${product.id}">Add to bag</button>
        </div>
      </article>
    `;
  }).join("");

  emptyProducts.hidden = visible.length > 0;
};

const renderCart = () => {
  const totals = cartTotals();
  const itemCount = state.cart.reduce((sum, item) => sum + item.qty, 0);

  cartCount.textContent = itemCount;
  wishlistCount.textContent = state.wishlist.length;
  subtotalEl.textContent = money(totals.subtotal);
  discountEl.textContent = money(totals.discount);
  shippingEl.textContent = totals.shipping === 0 ? "Free" : money(totals.shipping);
  totalEl.textContent = money(totals.total);
  checkoutTotal.textContent = money(totals.total);

  if (!state.cart.length) {
    cartItems.innerHTML = `
      <div class="empty-state">
        Your bag is empty. Add a premium piece from the collection.
      </div>
    `;
    checkoutItems.innerHTML = "<p>No items selected.</p>";
    saveState();
    return;
  }

  cartItems.innerHTML = state.cart.map((item) => {
    const product = getProduct(item.id);
    return `
      <article class="cart-item">
        <img src="${product.image}" alt="${product.name}">
        <div>
          <h3>${product.name}</h3>
          <p>${money(product.price)} · ${product.color}</p>
          <div class="quantity-row">
            <button class="qty-btn" type="button" data-decrease="${product.id}" aria-label="Decrease quantity">-</button>
            <strong>${item.qty}</strong>
            <button class="qty-btn" type="button" data-increase="${product.id}" aria-label="Increase quantity">+</button>
            <button class="remove-btn" type="button" data-remove="${product.id}">Remove</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  checkoutItems.innerHTML = state.cart.map((item) => {
    const product = getProduct(item.id);
    return `
      <div class="checkout-line">
        <span>${product.name} x ${item.qty}</span>
        <strong>${money(product.price * item.qty)}</strong>
      </div>
    `;
  }).join("");

  saveState();
};

const addToCart = (id) => {
  const existing = state.cart.find((item) => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ id, qty: 1 });
  }

  state.couponApplied = false;
  couponMessage.textContent = "";
  renderCart();
  openCart();
  showToast(`${getProduct(id).name} added to bag`);
};

const updateQty = (id, amount) => {
  const existing = state.cart.find((item) => item.id === id);
  if (!existing) return;

  existing.qty += amount;
  if (existing.qty <= 0) {
    state.cart = state.cart.filter((item) => item.id !== id);
  }

  if (!state.cart.length) {
    state.couponApplied = false;
    couponMessage.textContent = "";
  }

  renderCart();
};

const toggleWishlist = (id) => {
  if (state.wishlist.includes(id)) {
    state.wishlist = state.wishlist.filter((item) => item !== id);
    showToast("Removed from wishlist");
  } else {
    state.wishlist.push(id);
    showToast("Saved to wishlist");
  }

  saveState();
  renderProducts();
  renderCart();
};

const openCart = () => {
  cartDrawer.classList.add("active");
  cartDrawer.setAttribute("aria-hidden", "false");
};

const closeCart = () => {
  cartDrawer.classList.remove("active");
  cartDrawer.setAttribute("aria-hidden", "true");
};

const applyCoupon = () => {
  const code = couponInput.value.trim().toUpperCase();

  if (!state.cart.length) {
    couponMessage.textContent = "Add products before applying a coupon.";
    return;
  }

  if (code === "FELNATH10") {
    state.couponApplied = true;
    couponMessage.textContent = "Coupon applied. You saved 10%.";
    showToast("Coupon applied");
  } else {
    state.couponApplied = false;
    couponMessage.textContent = "Invalid code. Try FELNATH10.";
  }

  renderCart();
};

const orderSteps = [
  "Order confirmed",
  "Payment verified",
  "Packed for dispatch",
  "Out for delivery",
  "Delivered"
];

const renderTrackOrder = (order) => {
  if (!order) {
    trackResult.hidden = true;
    trackMessage.textContent = "No demo order found yet. Place an order first.";
    return;
  }

  trackResult.hidden = false;
  trackMessage.textContent = "Tracking details loaded.";
  trackStatus.textContent = order.status;
  trackTitle.textContent = `Order ${order.id}`;
  trackAmount.textContent = money(order.total);
  trackTimeline.innerHTML = orderSteps.map((step, index) => `
    <div class="track-step ${index <= order.currentStep ? "done" : ""}">
      <strong>${step}</strong>
      <span>${index <= order.currentStep ? "Completed" : "Pending"}</span>
    </div>
  `).join("");
  trackMeta.innerHTML = `
    <span>Placed on ${order.placedAt}</span>
    <span>${order.items.length} item${order.items.length > 1 ? "s" : ""} · ${order.paymentMethod}</span>
    <span>Ship to: ${order.customerName}</span>
  `;
};

const loadLastOrder = () => {
  if (!state.lastOrder) {
    renderTrackOrder(null);
    showToast("No order to track yet");
    return;
  }

  trackOrderId.value = state.lastOrder.id;
  trackContact.value = state.lastOrder.contact;
  renderTrackOrder(state.lastOrder);
  document.getElementById("track").scrollIntoView({ behavior: "smooth" });
};

document.addEventListener("click", (event) => {
  const addId = event.target.closest("[data-add]")?.dataset.add;
  const wishId = event.target.closest("[data-wishlist]")?.dataset.wishlist;
  const increaseId = event.target.closest("[data-increase]")?.dataset.increase;
  const decreaseId = event.target.closest("[data-decrease]")?.dataset.decrease;
  const removeId = event.target.closest("[data-remove]")?.dataset.remove;

  if (addId) addToCart(addId);
  if (wishId) toggleWishlist(wishId);
  if (increaseId) updateQty(increaseId, 1);
  if (decreaseId) updateQty(decreaseId, -1);
  if (removeId) {
    state.cart = state.cart.filter((item) => item.id !== removeId);
    renderCart();
    showToast("Item removed");
  }
});

document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.filter = button.dataset.filter;
    renderProducts();
  });
});

document.getElementById("sortProducts").addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

document.getElementById("searchToggle").addEventListener("click", () => {
  document.getElementById("searchPanel").classList.toggle("active");
  document.getElementById("searchInput").focus();
});

document.getElementById("clearSearch").addEventListener("click", () => {
  document.getElementById("searchInput").value = "";
  state.search = "";
  renderProducts();
});

document.getElementById("searchInput").addEventListener("input", (event) => {
  state.search = event.target.value;
  renderProducts();
});

document.getElementById("wishlistToggle").addEventListener("click", () => {
  if (!state.wishlist.length) {
    showToast("Wishlist is empty");
    return;
  }

  state.search = "";
  state.filter = "all";
  document.querySelectorAll(".filter-btn").forEach((item) => item.classList.toggle("active", item.dataset.filter === "all"));
  productGrid.innerHTML = products
    .filter((product) => state.wishlist.includes(product.id))
    .map((product) => `
      <article class="product-card">
        <span class="badge">Saved</span>
        <button class="wishlist-btn active" type="button" data-wishlist="${product.id}" aria-label="Remove ${product.name} from wishlist">♥</button>
        <div class="product-media"><img src="${product.image}" alt="${product.name}"></div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="product-meta"><span>${product.category} · ${product.color}</span><span class="price">${money(product.price)}</span></div>
          <button class="primary-btn add-btn" type="button" data-add="${product.id}">Add to bag</button>
        </div>
      </article>
    `).join("");
  emptyProducts.hidden = true;
  document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) closeCart();
});

document.getElementById("applyCoupon").addEventListener("click", applyCoupon);

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!state.cart.length) {
    showToast("Your bag is empty");
    return;
  }

  renderCart();
  checkoutModal.showModal();
});

document.getElementById("closeCheckout").addEventListener("click", () => checkoutModal.close());

document.getElementById("checkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const orderId = `FN-${Date.now().toString().slice(-6)}`;
  const paymentMethod = data.get("payment");
  const totals = cartTotals();
  const orderItems = state.cart.map((item) => ({
    ...item,
    name: getProduct(item.id).name,
    price: getProduct(item.id).price
  }));

  state.lastOrder = {
    id: orderId,
    status: "Confirmed",
    currentStep: 1,
    total: totals.total,
    items: orderItems,
    paymentMethod,
    customerName: data.get("fullName"),
    contact: data.get("phone") || data.get("email"),
    placedAt: new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    })
  };

  checkoutModal.close();
  closeCart();
  state.cart = [];
  state.couponApplied = false;
  couponInput.value = "";
  couponMessage.textContent = "";
  form.reset();
  renderCart();
  saveState();
  loadLastOrder();
  showToast(`Order ${orderId} placed via ${paymentMethod}`);
});

document.getElementById("trackForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = trackOrderId.value.trim().toUpperCase();

  if (state.lastOrder && query === state.lastOrder.id) {
    renderTrackOrder(state.lastOrder);
    showToast("Order tracking loaded");
    return;
  }

  trackResult.hidden = true;
  trackMessage.textContent = "Order not found in this demo browser. Place a demo order first.";
});

document.getElementById("loadLastOrder").addEventListener("click", loadLastOrder);

document.getElementById("newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  showToast("Subscribed successfully");
});

document.getElementById("contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  showToast("Message sent successfully");
});

document.getElementById("themeToggle").addEventListener("click", (event) => {
  document.body.classList.toggle("light-mode");
  event.currentTarget.textContent = document.body.classList.contains("light-mode") ? "Light" : "Dark";
});

document.querySelector(".menu-btn").addEventListener("click", (event) => {
  const nav = document.querySelector(".nav-links");
  nav.classList.toggle("active");
  event.currentTarget.setAttribute("aria-expanded", nav.classList.contains("active"));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".nav-links").classList.remove("active");
    document.querySelector(".menu-btn").setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("load", () => {
  window.setTimeout(() => document.querySelector(".loader").classList.add("hide"), 350);
});

renderProducts();
renderCart();
renderTrackOrder(state.lastOrder);
