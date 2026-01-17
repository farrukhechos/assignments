const productsWrapper = document.getElementById("products");
const categoryCards = document.querySelectorAll(".category-card");

let allCategories = [];

// JSON yuklab olamiz
fetch("../json/products.json")
  .then(res => res.json())
  .then(data => {
    allCategories = data;
  })
  .catch(err => console.error("Xatolik:", err));

// Category bosilganda
categoryCards.forEach(card => {
  card.addEventListener("click", (e) => {
    e.preventDefault();

    const selectedCategory = card.dataset.category;
    showCategoryProducts(selectedCategory);
  });
});

function showCategoryProducts(categoryId) {
  productsWrapper.innerHTML = "";

  const category = allCategories.find(cat => cat.id === categoryId);
  if (!category) return;

  const productsHeader = document.createElement("div");
  productsHeader.className = "products-header";

  const title = document.createElement("h2");
  title.className = "products-title";
  title.textContent = category.title;

  const cardsWrapper = document.createElement("div");
  cardsWrapper.className = "father-cards";

  category.products.forEach(product => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img class="card-image" src="${product.image}" alt="${product.name}">
      <div class="card-chart">
        <div class="card-title-money">
          <span class="card-title">${product.name}</span>
          <span class="card-money">
            ${product.price.toLocaleString()} so'm
          </span>
        </div>
        <div class="chart-icon">
          <img src="../images/icons/chart.png" class="chart-icon-img">
        </div>
      </div>
    `;

    // 👉 RASM → DETAIL
    card.querySelector(".card-image").addEventListener("click", () => {
      window.location.href = `../pages/detail.html?id=${product.id}&cat=${category.id}`;
    });

    // 👉 SUMKA → CART
    card.querySelector(".chart-icon-img").addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(product, category.id);
    });

    cardsWrapper.appendChild(card);
  });

  productsHeader.appendChild(title);
  productsHeader.appendChild(cardsWrapper);
  productsWrapper.appendChild(productsHeader);
}

// CART FUNKSIYA (seniki bilan bir xil)
function addToCart(product, categoryId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const exists = cart.find(
    item => item.id === product.id && item.category === categoryId
  );

  if (exists) {
    exists.qty += 1;
  } else {
    cart.push({
      id: product.id,
      category: categoryId,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Mahsulot savatga qo‘shildi 🛒");
}
