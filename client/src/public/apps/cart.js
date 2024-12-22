function handleDeleteCard(id) {
    const productId = id;
    console.log(productId);
    fetch("http://localhost:3000/cart", {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            location.reload();
            // showCart();
        })
}

function increaseQuantity(quantity) {
    quantity = Number(quantity) + 1;
    return quantity;
}

function decreaseQuantity(quantity) {
    quantity = Number(quantity) - 1;
    if (quantity < 0) {
        quantity = 0;
    }
    return quantity;
}

function handleUpdateQuantity(id, quantity) {
    const productId = id;

    fetch("http://localhost:3000/customer/cart", {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId, quantity })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            location.reload();
            // showCart();
        })
}

function createCartItem(item) {
    // Create container div
    const cartItemDiv = document.createElement("div");
    cartItemDiv.classList.add("cart__item");
    cartItemDiv.id = item._id;

    cartItemDiv.innerHTML = `
            <div class="cart__left" >
                <img src="data:image/png;base64,${item.productMainImage}" class="card-img-top" alt="${item.productName}">
            </div>

            <div class="card__right">
                <div class="cart__item__title">
                    <div class="cart__product__name">
                        <span>${item.productName}</span>
                    </div>
                    <div class="cart__product__description">
                        <span>${item.productDescription}</span>
                    </div>
                </div>

                <div class="card__item__footer">
                    <div class="card__product__price">
                        <span>${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(item.productPrice,)}</span>
                    </div>

                    <div class="cart__item__btn">
                        <button class="decrease-quantity">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity">+</button>
                    </div>
                </div>

            </div>
            <button class="delete-product" onclick="handleDeleteCard(event)">X</button>
            <button class="edit-quantity" onclick="">?</button>
    `;

    cartItemDiv.querySelector('.delete-product').addEventListener("click", () => handleDeleteCard(item._id));
    cartItemDiv.querySelector('.edit-quantity').addEventListener("click", () => handleUpdateQuantity(item._id, item.quantity));

    cartItemDiv.querySelector('.increase-quantity').addEventListener("click", () => {
        item.quantity = increaseQuantity(item.quantity);
        const quantitySpan = cartItemDiv.querySelector('.cart__item__btn span');
        quantitySpan.textContent = item.quantity;
    });
    cartItemDiv.querySelector('.decrease-quantity').addEventListener("click", () => {
        item.quantity = decreaseQuantity(item.quantity);
        const quantitySpan = cartItemDiv.querySelector('.cart__item__btn span');
        quantitySpan.textContent = item.quantity;
    });

    return cartItemDiv;
}

function renderDetailUser(user) {
    const customerDetailContainer = document.querySelector(".cart__customer__detail");
    customerDetailContainer.innerHTML = `
        <div class="cart__customer__detail__title">
                <span>Customer Details</span>
            </div>
            <div class="cart__customer__detail__content">
                <div class="cart__customer__detail__item">
                    <span>Name:</span>
                    <span>${user.username}</span>
                </div>
                <div class="cart__customer__detail__item">
                    <span>Email:</span>
                    <span>${user.useremail}</span>
                </div>
            </div>
    `;
}

function renderProductsDetail(productList) {
    let totalPrice = 0;
    productList.forEach((product) => {
        totalPrice += Number(product.productPrice) * Number(product.productQuantity);
    });
    const productDetailContainer = document.querySelector(".cart__products__detail"); // Replace with your container selector
    productDetailContainer.innerHTML = `
    <div class="cart__products__detail__title">
                <span>Products Details</span>
            </div>
            <div class="cart__products__detail__content">
                <div class="cart__products__detail__item">
                    <span>Amount:</span>
                    <span>${productList.length}</span>
                </div>
                <div class="cart__products__detail__item">
                    <span>Total:</span>
                    <span>${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
                </div>
            </div>
    `; // Clear existing content
}

function renderProductsInCart(productList) {
    const cartContainer = document.querySelector(".cart .cart__body"); // Replace with your container selector
    cartContainer.innerHTML = ""; // Clear existing content
    productList.forEach((product) => {
        const cartElement = createCartItem(product);
        cartContainer.appendChild(cartElement);
    });
}

// function showCart() {
//     // Show cart
//     location.href = "/user/cart";
// }
function showCart() {
    // Show cart
    fetch("http://localhost:3000/customer/cart", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'

    })
        .then(response => response.json())
        .then(data => {
            renderProductsInCart(data.cart);
            renderDetailUser(data.user);
            renderProductsDetail(data.cart);
        })
}


showCart();
