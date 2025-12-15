const productContainer = document.querySelector(".product-list");
const isProductDetailPage = document.querySelector(".product-detail");
const isCartPage = document.querySelector(".cart");

if(productContainer){
    displayProducts();
}else if (isProductDetailPage) {
    displayProductDetail();
}else if (isCartPage){
    displayCart();
}

function displayProducts(){
    products.forEach(product =>{
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
            <div class="img-box">
                <img src="${product.mainImage}">
            </div>
            <h2 class="title">${product.title}</h2>
            <span class="price">${product.price}</span>
        `;
        productContainer.appendChild(productCard);

        const imgBox = productCard.querySelector(".img-box");
        imgBox.addEventListener("click", () => {
            sessionStorage.setItem("selectedProduct", JSON.stringify(product));
            window.location.href = "product-details.html"
        })
    })
}

function displayProductDetail(){
    const productData = JSON.parse(sessionStorage.getItem("selectedProduct"));

    const titleE1 = document.querySelector(".title");
    const priceE1 = document.querySelector(".price");
    const categoryE1 = document.querySelector(".category");
    const dimensionsE1 = document.querySelector(".dimensions");
    const descriptionE1 = document.querySelector(".description");
    const amount = document.querySelector(".amount");
    const input = document.querySelector(".input-amount");
    const mainImageContainer = document.querySelector(".main-img");
    const thumbnailContainer = document.querySelector(".thumbnail-list");
    const addToCartBtn = document.querySelector("#add-cart-btn");

    function updateProductDisplay(){
        mainImageContainer.innerHTML = `<img src="${productData.mainImage}">`;

        thumbnailContainer.innerHTML = "";
        const allThumbnails = [productData.mainImage].concat(productData.thumbnails.slice(0,3));
        allThumbnails.forEach(thumb=> {
            const img = document.createElement("img");
            img.src = thumb;
            thumbnailContainer.appendChild(img);

            img.addEventListener("click", ()=> {
                mainImageContainer.innerHTML = `<img src="${thumb}">`;
            });
        });
    }

    titleE1.textContent = productData.title;
    priceE1.textContent = productData.price;
    descriptionE1.textContent = productData.description;
    categoryE1.textContent = productData.category;
    dimensionsE1.textContent = productData.dimensions;

    updateProductDisplay();

    addToCartBtn.addEventListener("click", () => {
        const quantity = parseInt(input.value, 10);

        addToCart({
            ...productData,
            quantity: quantity
        });
    });


}

function addToCart(product){
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += product.quantity;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            category: product.category,
            dimensions: product.dimensions,
            price: product.price,
            image: product.mainImage,
            quantity: product.quantity
        });
    }

    sessionStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
}

function displayCart(){
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    const cartItemsContainer =document.querySelector(".cart-items");
    const subtotalE1 = document.querySelector(".subtotal");
    const grandTotalE1 = document.querySelector(".grand-total");

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.<p/>";
        subtotalE1.textContent = "0€";
        grandTotalE1.textContent = "0€";
        return;
    }

    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = parseFloat(item.price.replace("€", "").replace(",", ".")) * item.quantity;
        subtotal += itemTotal;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <div class="product">
                    <img src="${item.image}">
                    <div class="item-detail">
                        <p>${item.title}</p>
                        <div class="category-dimensions-box">
                            <span class="category">${item.category}</span>
                            <span class="dimensions">${item.dimensions}</span>
                        </div>
                    </div>
                </div>
                <span class="price">${item.price}</span>
                <div class="quantity"><input type="number" value="${item.quantity}" min="1" data-index="${index}"></div>
                <span class="total-price">${itemTotal}€</span>
                <button class="remove" data-index="${index}"><img src="img/delete.png"></img></button>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    subtotalE1.textContent = `$${subtotal.toFixed(2)}`;
    grandTotalE1.textContent = `$${subtotal.toFixed(2)}`;

    removeCartItem();
    updateCartQuantity();
}

function removeCartItem() {
    document.querySelectorAll(".remove").forEach(button => {
        button.addEventListener("click", function () {
            let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
            const index = this.getAttribute("data-index");
            cart.splice(index, 1);
            sessionStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            updateCartBadge();
        });
    });
}

function updateCartQuantity() {
    document.querySelectorAll(".quantity input").forEach(input => {
        input.addEventListener("change", function (){
            let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
            const index = this.getAttribute("data-index");
            cart[index].quantity = parseInt(this.value);
            sessionStorage.setItem("cart", JSON.stringify(cart));
            displayCart();
            updateCartBadge();
        });
    });
}

function updateCartBadge(){
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.querySelector(".cart-item-count");

    if (badge) {
        if (cartCount >0) {
            badge.textContent = cartCount;
            badge.style.display = "block";
        }else{
            badge.style.display = "none";
        }
    }
}

updateCartBadge();