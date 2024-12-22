function renderOrderUser(user) {
    const orderUser = document.querySelector('.order__customer_details');
    orderUser.innerHTML = `
        <div class="order__summary">
            <div class="order__customer__detail">
                <h3>Customer Details</h3>
                <div class="order__customer__detail__content">
                    <div class="order__customer__detail__item">
                        <span>Name:</span>
                        <span>${user.username}</span>
                    </div>
                    <div class="order__customer__detail__item">
                        <span>Mail:</span>
                        <span>${user.useremail}</span>
                    </div>
                </div>
            </div>
        </div>
        `;
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
                        <button class="decrease-quantity" disable></button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" disable></button>
                    </div>
                </div>
            </div>

    `;
    return cartItemDiv;
}

function renderProductsInCart(productList) {
    const cartContainer = document.querySelector(".order__product_list"); // Replace with your container selector
    // cartContainer.innerHTML = ""; // Clear existing content
    productList.forEach((product) => {
        const cartElement = createCartItem(product);
        cartContainer.appendChild(cartElement);
    });
}

function renderOrderSummary(cart) {
    const orderSummary = document.querySelector('.order__count');
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = 10;
    const total = subtotal + shipping;
    orderSummary.innerHTML = `
        <div class="order__summary">
            <div class="order__summary__content">
                <h3>Order Summary</h3>
                <div class="order__summary__item">
                    <span>Subtotal:</span>
                    <span>${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(subtotal,)}</span>
                </div>
                <div class="order__summary__item">
                    <span>Shipping:</span>
                    <span>${shipping}</span>
                </div>
                <div class="order__summary__item">
                    <span>Total:</span>
                    <span>${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(total,)}</span>
                </div>
            </div>
        </div>
    `;
}

function showOrder() {
    fetch("http://localhost:3000/customer/cart", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // renderProductsInCart(data.cart);
            renderProductsInCart(data.cart);

            renderOrderUser(data.user);
            renderOrderSummary(data.cart);
        });
}

showOrder();
