const products = [
  { id: "bed", name: "Queen Bed + Mattress", category: "Furniture", price: 1199, deposit: 2400, tag: "Bedroom", stock: 17, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85", description: "Queen bed, orthopedic mattress, protector and installation." },
  { id: "desk", name: "Work Desk Setup", category: "Furniture", price: 699, deposit: 1400, tag: "Work from home", stock: 9, image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=85", description: "Compact desk and ergonomic chair for a comfortable workday." },
  { id: "sofa", name: "Three Seat Sofa", category: "Furniture", price: 899, deposit: 1800, tag: "Living room", stock: 24, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85", description: "Neutral fabric sofa sized for apartments and shared flats." },
  { id: "fridge", name: "Double Door Fridge", category: "Appliance", price: 1399, deposit: 3000, tag: "Kitchen", stock: 5, image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=900&q=85", description: "240L energy-efficient refrigerator with installation and service." },
  { id: "washer", name: "Fully Automatic Washer", category: "Appliance", price: 999, deposit: 2200, tag: "Laundry", stock: 13, image: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&w=900&q=85", description: "Top-load washing machine with relocation-ready pickup coverage." },
  { id: "tv", name: "43 inch Smart TV", category: "Appliance", price: 1099, deposit: 2500, tag: "Entertainment", stock: 8, image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=85", description: "Full HD smart TV with wall mount and setup included." },
  { id: "studio", name: "Studio Starter Pack", category: "Package", price: 3499, deposit: 7000, tag: "Best value", stock: 6, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=85", description: "Bed, wardrobe, study table, fridge and washer for a quicker move-in." },
];

const state = {
  activeView: "discover",
  category: "all",
  budget: 6000,
  duration: 6,
  city: "Bengaluru",
  cart: new Map(),
  rentals: [
    { name: "Queen Bed + Mattress", plan: "6 month plan", returnDate: "15 Nov 2026", status: "Active" },
    { name: "Work Desk Setup", plan: "6 month plan", returnDate: "15 Nov 2026", status: "Active" },
    { name: "Double Door Fridge", plan: "12 month plan", returnDate: "15 May 2027", status: "Active" },
  ],
  tickets: [
    { id: "RE-1842", item: "Double Door Fridge", type: "Repair request", note: "Cooling is inconsistent in the evening.", status: "Visit scheduled", when: "Tomorrow, 11:00" },
  ],
};

const formatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const money = (value) => formatter.format(value).replace(String.fromCharCode(0x20b9), "Rs. ");
const productGrid = $("#productGrid");
const cartItems = $("#cartItems");
const checkoutDialog = $("#checkoutDialog");
const toast = $("#toast");

function totals() {
  return [...state.cart.values()].reduce((sum, product) => ({ rent: sum.rent + product.price, deposit: sum.deposit + product.deposit }), { rent: 0, deposit: 0 });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3200);
}

function renderProducts() {
  const categoryProducts = products.filter((product) => state.category === "all" || product.category === state.category);
  const visibleProducts = state.budget ? categoryProducts.filter((product) => product.price <= state.budget) : categoryProducts;
  $("#catalogStatus").textContent = `${visibleProducts.length} item${visibleProducts.length === 1 ? "" : "s"} match your plan in ${state.city}.`;
  productGrid.innerHTML = visibleProducts.length ? visibleProducts.map((product) => {
    const added = state.cart.has(product.id);
    return `<article class="product-card"><div class="product-media" style="background-image:url('${product.image}')"><span>${product.tag}</span></div><div class="product-body"><div><h3>${product.name}</h3><p>${product.description}</p></div><div class="product-meta"><span class="price">${money(product.price)}/mo</span><button class="primary-button ${added ? "is-added" : ""}" type="button" data-add="${product.id}">${added ? "In plan" : "Add"}</button></div></div></article>`;
  }).join("") : '<p class="catalog-status">No items match this budget. Choose a higher budget to see more options.</p>';
}

function renderCart() {
  const selected = [...state.cart.values()];
  const summary = totals();
  $("#cartCount").textContent = selected.length;
  $("#topCartCount").textContent = selected.length;
  $("#monthlyTotal").textContent = money(summary.rent);
  $("#depositTotal").textContent = money(summary.deposit);
  $("#summaryRent").textContent = money(summary.rent);
  $("#summaryDeposit").textContent = money(summary.deposit);
  $("#summaryFirst").textContent = money(summary.rent + summary.deposit);
  cartItems.innerHTML = selected.length ? selected.map((product) => `<div class="cart-item"><div><strong>${product.name}</strong><span>${money(product.price)}/mo for ${state.duration} months</span></div><button class="remove-button" type="button" data-remove="${product.id}" aria-label="Remove ${product.name}">x</button></div>`).join("") : '<div class="cart-empty">Your move-in list is empty. Add essentials to estimate your rental plan.</div>';
}

function renderRentals() {
  $("#activeItemCount").textContent = state.rentals.length;
  $("#rentalList").innerHTML = state.rentals.map((rental) => `<article class="rental-row"><div><strong>${rental.name}</strong><small>${rental.plan} in ${state.city}</small></div><div class="rental-meta">Return by<br><strong>${rental.returnDate}</strong></div><span class="status">${rental.status}</span><div class="row-actions"><button class="row-action" type="button" data-extend="${rental.name}">Extend</button><button class="row-action" type="button" data-return="${rental.name}">Return</button></div></article>`).join("");
  $("#supportItem").innerHTML = state.rentals.map((rental) => `<option>${rental.name}</option>`).join("");
}

function ticketRows() {
  return state.tickets.map((ticket) => `<article class="ticket-row"><div><strong>${ticket.item}</strong><small>${ticket.id} - ${ticket.type}</small></div><div class="rental-meta">${ticket.when}<br><small>${ticket.note}</small></div><span class="status ${ticket.status === "New" ? "pending" : ""}">${ticket.status}</span><button class="row-action" type="button" data-ticket="${ticket.id}">View</button></article>`).join("");
}

function renderTickets() {
  const rows = ticketRows();
  $("#ticketList").innerHTML = rows || '<p class="catalog-status">No support requests yet.</p>';
  $("#adminRequestList").innerHTML = rows || '<p class="catalog-status">The maintenance queue is clear.</p>';
}

function renderInventory() {
  const inventory = [...products].sort((a, b) => a.stock - b.stock);
  $("#inventoryTable").innerHTML = `<div class="inventory-head"><span>Item</span><span>Available</span><span>Action</span></div>${inventory.map((product) => `<div class="inventory-row"><div><strong>${product.name}</strong><small>${product.category}</small></div><span class="${product.stock < 8 ? "stock-low" : "stock-good"}">${product.stock} units</span><button class="row-action" type="button" data-stock="${product.id}">${product.stock < 8 ? "Restock" : "View"}</button></div>`).join("")}`;
}

function switchView(view) {
  state.activeView = view;
  $$("[data-view-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.viewPanel === view));
  $$(".nav-link").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  const titles = {
    discover: ["Move-in made easy", "Rent your home essentials, on your terms."],
    rentals: ["Your account", "Everything you are renting, in one place."],
    support: ["Here to help", "Quick support for the things you use every day."],
    admin: ["Operations center", "RentEase across every city, at a glance."],
  };
  $("#pageEyebrow").textContent = titles[view][0];
  $("#pageTitle").textContent = titles[view][1];
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openCheckout() {
  const selected = [...state.cart.values()];
  if (!selected.length) {
    showToast("Add at least one item before scheduling delivery.");
    return;
  }
  const summary = totals();
  $("#deliverySummary").innerHTML = `<strong>${selected.length} item${selected.length === 1 ? "" : "s"} for ${state.duration} months</strong><br>${money(summary.rent)}/month + ${money(summary.deposit)} refundable deposit`;
  $("#deliveryCity").value = state.city;
  checkoutDialog.showModal();
}

function bindEvents() {
  $$("[data-view]").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.view)));
  $$("[data-open-checkout]").forEach((button) => button.addEventListener("click", openCheckout));
  $$(".filter").forEach((button) => button.addEventListener("click", () => {
    state.category = button.dataset.filter;
    $$(".filter").forEach((filter) => filter.classList.toggle("active", filter === button));
    renderProducts();
  }));
  productGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");
    if (!button) return;
    const product = products.find((item) => item.id === button.dataset.add);
    if (!product) return;
    if (state.cart.has(product.id)) {
      state.cart.delete(product.id);
      showToast(`${product.name} removed from your plan.`);
    } else {
      state.cart.set(product.id, product);
      showToast(`${product.name} added to your plan.`);
    }
    renderProducts();
    renderCart();
  });
  cartItems.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    state.cart.delete(button.dataset.remove);
    renderProducts();
    renderCart();
  });
  $("#rentalPlanner").addEventListener("submit", (event) => {
    event.preventDefault();
    state.duration = Number($("#durationSelect").value);
    state.budget = Number($("#budgetSelect").value);
    renderProducts();
    renderCart();
    showToast("Your catalog now matches the tenure and budget you selected.");
  });
  $("#citySelect").addEventListener("change", () => {
    state.city = $("#citySelect").value;
    renderProducts();
    renderRentals();
    showToast(`Showing availability in ${state.city}.`);
  });
  $("#rentalList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-extend]");
    if (button) showToast(`Extension options for ${button.dataset.extend} are ready for review.`);
    const returnButton = event.target.closest("[data-return]");
    if (returnButton) showToast(`Pickup scheduling for ${returnButton.dataset.return} is ready to confirm.`);
  });
  $("#supportForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const note = $("#supportNote").value.trim() || "Customer requested support.";
    state.tickets.unshift({ id: `RE-${1843 + state.tickets.length}`, item: $("#supportItem").value, type: $("#supportType").value, note, status: "New", when: "Submitted just now" });
    $("#supportNote").value = "";
    renderTickets();
    showToast("Your request is in the maintenance queue.");
  });
  $("#closeDialog").addEventListener("click", () => checkoutDialog.close());
  $("#cancelDialog").addEventListener("click", () => checkoutDialog.close());
  $("#checkoutForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const date = $("#deliveryDate").value;
    if (!date) return;
    [...state.cart.values()].forEach((product) => state.rentals.unshift({ name: product.name, plan: `${state.duration} month plan`, returnDate: "To be confirmed", status: "Scheduled" }));
    state.cart.clear();
    renderProducts();
    renderCart();
    renderRentals();
    checkoutDialog.close();
    const displayDate = new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    showToast(`Delivery confirmed for ${displayDate}.`);
    switchView("rentals");
  });
  $("#reportButton").addEventListener("click", () => showToast("Operations report prepared for download."));
  $("#restockButton").addEventListener("click", () => showToast("Low-stock products were sent to the procurement queue."));
  $("#inventoryTable").addEventListener("click", (event) => {
    const button = event.target.closest("[data-stock]");
    if (!button) return;
    const product = products.find((item) => item.id === button.dataset.stock);
    if (product && product.stock < 8) {
      product.stock += 12;
      renderInventory();
      showToast(`${product.name} has been restocked.`);
    }
  });
}

function initialize() {
  state.cart.set("bed", products[0]);
  state.cart.set("desk", products[1]);
  state.cart.set("fridge", products[3]);
  $("#deliveryDate").min = new Date().toISOString().slice(0, 10);
  renderProducts();
  renderCart();
  renderRentals();
  renderTickets();
  renderInventory();
  bindEvents();
}

initialize();

