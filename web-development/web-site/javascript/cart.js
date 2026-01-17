const cartItemsWrapper = document.getElementById("cart-items");
const totalPriceEl = document.getElementById("total-price");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// BO‘SH CART
if (cart.length === 0) {
  cartItemsWrapper.innerHTML = "<h3>Savat bo‘sh 🛒</h3>";
  totalPriceEl.textContent = "0 so'm";
} else {
  renderCart();
}

function renderCart() {
  cartItemsWrapper.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-info">
        <p class="cart-name">${item.name}</p>
        <p class="cart-price">${item.price.toLocaleString()} so'm</p>
      </div>

      <input type="number" min="1" value="${item.qty}" class="cart-qty" data-index="${index}">
      <span class="cart-remove" data-index="${index}">✖</span>
    `;

    cartItemsWrapper.appendChild(div);
  });

  totalPriceEl.textContent = total.toLocaleString() + " so'm";
}

// QTY O‘ZGARSA
cartItemsWrapper.addEventListener("input", e => {
  if (e.target.classList.contains("cart-qty")) {
    const index = e.target.dataset.index;
    cart[index].qty = Number(e.target.value);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
});

// REMOVE
cartItemsWrapper.addEventListener("click", e => {
  if (e.target.classList.contains("cart-remove")) {
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
});
