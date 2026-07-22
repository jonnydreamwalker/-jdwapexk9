(function () {
  var SITE = window.APEX_SITE || {};
  var CART_KEY = SITE.cartKey || "jdw_k9_cart";
  if (!localStorage.getItem(CART_KEY)) localStorage.setItem(CART_KEY, JSON.stringify([]));

  function cart() { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  function save(c) { localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartCount(); }

  window.updateCartCount = function () {
    var c = cart();
    document.querySelectorAll(".cart-count").forEach(function (b) {
      b.innerText = c.reduce(function (s, i) { return s + i.quantity; }, 0);
    });
  };
  document.addEventListener("DOMContentLoaded", window.updateCartCount);

  window.toggleMobileMenu = function () {
    var m = document.getElementById("mobile-menu");
    if (!m) return;
    var i = document.getElementById("hamburger-icon");
    var open = m.classList.contains("hidden");
    if (open) {
      m.classList.remove("hidden"); m.classList.add("flex");
      document.body.style.overflow = "hidden";
      if (i) i.className = "fas fa-times";
    } else {
      m.classList.add("hidden"); m.classList.remove("flex");
      document.body.style.overflow = "";
      if (i) i.className = "fas fa-bars";
    }
  };
  window.closeMobileMenu = function () {
    var m = document.getElementById("mobile-menu");
    var i = document.getElementById("hamburger-icon");
    if (m) { m.classList.add("hidden"); m.classList.remove("flex"); }
    document.body.style.overflow = "";
    if (i) i.className = "fas fa-bars";
  };
  window.toggleMobileCats = function () {
    var c = document.getElementById("mobile-cats");
    var a = document.getElementById("mobile-cat-arrow");
    if (!c) return;
    c.classList.toggle("hidden");
    if (a) a.innerText = c.classList.contains("hidden") ? "▼" : "▲";
  };
  window.toggleDropdown = function (e) {
    if (e) e.stopPropagation();
    var d = document.getElementById("category-dropdown");
    var a = document.getElementById("dropdown-arrow");
    if (!d) return;
    if (d.classList.contains("hidden")) {
      d.classList.remove("hidden");
      if (a) a.innerText = "▲";
    } else {
      d.classList.add("hidden");
      if (a) a.innerText = "▼";
    }
  };
  document.addEventListener("click", function (e) {
    var d = document.getElementById("category-dropdown");
    var a = document.getElementById("dropdown-arrow");
    if (!d) return;
    if (!d.contains(e.target) && !e.target.closest("[data-dropdown-toggle]")) {
      d.classList.add("hidden");
      if (a) a.innerText = "▼";
    }
  });

  window.addToCart = function (name, variant, price) {
    var c = cart();
    var ex = c.find(function (i) { return i.name === name && i.variant === variant; });
    if (ex) ex.quantity++;
    else c.push({ name: name, variant: variant, price: price, quantity: 1 });
    save(c);
    alert(name + " added");
  };
  window.openCartModal = function () {
    window.closeMobileMenu();
    var c = cart();
    var list = document.getElementById("cart-items-list");
    var totalEl = document.getElementById("cart-grand-total");
    if (!list) return;
    list.innerHTML = "";
    if (!c.length) {
      list.innerHTML = '<p class="text-zinc-500 text-center py-8">Your cart is currently empty.</p>';
      if (totalEl) totalEl.innerText = "$0.00";
    } else {
      var total = 0;
      c.forEach(function (item, i) {
        total += item.price * item.quantity;
        list.innerHTML +=
          '<div class="flex justify-between items-center bg-zinc-950 border border-zinc-800 p-4 rounded-xl"><div><h4 class="font-bold">' +
          item.name + '</h4><p class="text-xs text-emerald-400">$' + item.price.toFixed(2) + " × " + item.quantity +
          '</p></div><button type="button" onclick="removeSingleCartItem(' + i + ')" class="text-red-400"><i class="fas fa-trash-alt"></i></button></div>';
      });
      if (totalEl) totalEl.innerText = "$" + total.toFixed(2);
    }
    var modal = document.getElementById("cart-modal");
    if (modal) { modal.classList.remove("hidden"); modal.classList.add("flex"); }
  };
  window.closeCartModal = function () {
    var modal = document.getElementById("cart-modal");
    if (modal) { modal.classList.add("hidden"); modal.classList.remove("flex"); }
  };
  window.removeSingleCartItem = function (i) {
    var c = cart(); c.splice(i, 1); save(c); window.openCartModal();
  };
  window.populatePayPalFormFields = function () { return true; };
  window.startSquarePayment = function () { alert("Square checkout — wire via ApexFreePort."); };
  window.startStripePayment = function () { alert("Stripe checkout — wire via ApexFreePort."); };
})();
