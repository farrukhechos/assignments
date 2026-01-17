let ALL_CATEGORIES = [];


  //  1️⃣ HOME / CATEGORY PAGE


const productsWrapper = document.getElementById("products");

if (productsWrapper) {
  fetch("../json/products.json")
    .then(res => res.json())
    .then(categories => {
      ALL_CATEGORIES = categories;
      renderProducts(categories);
    })
    .catch(err => console.error(err));
}

function renderProducts(categories) {
  productsWrapper.innerHTML = "";

  categories.forEach(category => {
    const productsHeader = document.createElement("div");
    productsHeader.className = "products-header";
    productsHeader.dataset.category = category.id;

    const title = document.createElement("h2");
    title.className = "products-title";
    title.textContent = category.title;

    const cardsWrapper = document.createElement("div");
    cardsWrapper.className = "father-cards";

    category.products.forEach(product => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.id = product.id;
      card.dataset.category = category.id;

      card.innerHTML = `
        <img class="card-image" src="${product.image}">
        <div class="card-chart">
          <div class="card-title-money">
            <span class="card-title">${product.name}</span>
            <span class="card-money">${product.price.toLocaleString()} so'm</span>
          </div>
          <div class="chart-icon">
            <img src="../images/icons/chart.png" class="chart-icon-img">
          </div>
        </div>
      `;

      cardsWrapper.appendChild(card);
    });

    productsHeader.appendChild(title);
    productsHeader.appendChild(cardsWrapper);
    productsWrapper.appendChild(productsHeader);
  });
}


  //  2️⃣ CARD CLICK (HOME / CATEGORY)


if (productsWrapper) {
  productsWrapper.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;

    const productId = card.dataset.id;
    const categoryId = card.dataset.category;

    if (e.target.classList.contains("card-image")) {
      window.location.href =
        `../pages/detail.html?id=${productId}&cat=${categoryId}`;
    }

    if (e.target.classList.contains("chart-icon-img")) {
      const category = ALL_CATEGORIES.find(c => c.id === categoryId);
      const product = category.products.find(p => p.id == productId);
      addToCart(product, categoryId);
    }
  });
}

  //  3️⃣ SAVATGA QO‘SHISH


function addToCart(product, categoryId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const exists = cart.find(
    item => item.id === product.id && item.category === categoryId
  );

  if (exists) exists.qty++;
  else {
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


  //  4️⃣ DETAIL PAGE


const detailTitle = document.getElementById("detailTitle");
const detailImage = document.getElementById("detailImage");
const detailPrice = document.getElementById("detailPrice");
const detailName = document.getElementById("detailName");
const addToCartBtn = document.getElementById("addToCartBtn");

if (detailTitle && detailImage && detailPrice) {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const categoryId = params.get("cat");

  fetch("../json/products.json")
    .then(res => res.json())
    .then(categories => {
      const category = categories.find(c => c.id === categoryId);
      if (!category) return;

      const product = category.products.find(p => p.id == productId);
      if (!product) return;

      detailTitle.textContent = product.name;
      detailName.textContent = product.name;
      detailImage.src = product.image;
      detailPrice.textContent =
        product.price.toLocaleString() + " so'm";

      addToCartBtn.addEventListener("click", () => {
        addToCart(product, categoryId);
      });
    });
}

  //  CATEGORY FILTER


document.querySelectorAll(".category-card").forEach(card => {
  card.addEventListener("click", (e) => {
    e.preventDefault();
    const selected = card.dataset.category;
    const filtered = ALL_CATEGORIES.filter(c => c.id === selected);
    renderProducts(filtered);
  });
});
document.getElementById("showAll").addEventListener("click", (e) => {
  e.preventDefault();
  renderProducts(ALL_CATEGORIES);
});

