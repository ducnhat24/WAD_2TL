function renderOrderUser(user) {
    const orderUser = document.querySelector('.order__customer_details');
    orderUser.innerHTML = `
        <div class="order__customer__details__content">
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
                <img src="${item.productMainImage}" class="card-img-top" alt="${item.productName}">
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
        if (product !== null) {
            const cartElement = createCartItem(product);
            cartContainer.appendChild(cartElement);
        }
    });
}

function renderOrderSummary(cart) {
    cart = cart.filter(item => item !== null);
    const orderSummary = document.querySelector('.order__count');
    const subtotal = cart.reduce((acc, item) => acc + item.productPrice * item.quantity, 0);
    const shipping = 100000;
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
    fetch("http://localhost:5000/api/customer/cart", {
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

function fetchShippingMethods() {
    fetch("http://localhost:5000/api/customer/order/shipping-methods", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => {
            const shippingMethodSelect = document.getElementById('shipping-method');
            data.methods.forEach(method => {
                const option = document.createElement('option');
                option.value = method._id; // Hoặc giá trị unique của method
                option.textContent = method.shippingName; // Tên phương thức giao hàng
                shippingMethodSelect.appendChild(option);
            });
        });
}

//Xử lý khi người dùng gửi thông tin vận chuyển:
document.getElementById('shipping-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const address = document.getElementById('address').value;
    const shippingMethod = document.getElementById('shipping-method').value;

    fetch("http://localhost:5000/api/customer/order/update-shipping", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ address, shippingMethod })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Shipping information updated successfully!");
            } else {
                alert("Failed to update shipping information.");
            }
        });
});

//Cập nhật trạng thái đơn hàng
function updateOrderStatus(status) {
    const orderStatusElement = document.getElementById('order-status');
    orderStatusElement.textContent = status;

    fetch("http://localhost:5000/api/customer/order/update-status", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
    })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                alert("Failed to update order status.");
            }
        });
}



showOrder();
fetchShippingMethods();
