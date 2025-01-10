// function renderOrderUser(user) {
//     const orderUser = document.querySelector('.order__customer_details');
//     orderUser.innerHTML = `
//         <div class="order__customer__details__content">
//             <div class="order__customer__detail">
//                 <h3>Customer Details</h3>
//                 <div class="order__customer__detail__content">
//                     <div class="order__customer__detail__item">
//                         <span>Name:</span>
//                         <span>${user.username}</span>
//                     </div>
//                     <div class="order__customer__detail__item">
//                         <span>Mail:</span>
//                         <span>${user.useremail}</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         `;
// }

// function createCartItem(item) {
//     // Create container div
//     const cartItemDiv = document.createElement("div");
//     cartItemDiv.classList.add("cart__item");
//     cartItemDiv.id = item._id;

//     cartItemDiv.innerHTML = `
//             <div class="cart__left" >
//                 <img src="${item.productMainImage}" class="card-img-top" alt="${item.productName}">
//             </div>

//             <div class="card__right">
//                 <div class="cart__item__title">
//                     <div class="cart__product__name">
//                         <span>${item.productName}</span>
//                     </div>
//                     <div class="cart__product__description">
//                         <span>${item.productDescription}</span>
//                     </div>
//                 </div>


//                 <div class="card__item__footer">
//                     <div class="card__product__price">
//                         <span>${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(item.productPrice,)}</span>
//                     </div>

//                     <div class="cart__item__btn">
//                         <button class="decrease-quantity" disable></button>
//                         <span>${item.quantity}</span>
//                         <button class="increase-quantity" disable></button>
//                     </div>
//                 </div>
//             </div>

//     `;
//     return cartItemDiv;
// }

// function renderProductsInCart(productList) {
//     const cartContainer = document.querySelector(".order__product_list"); // Replace with your container selector
//     // cartContainer.innerHTML = ""; // Clear existing content
//     productList.forEach((product) => {
//         if (product !== null) {
//             const cartElement = createCartItem(product);
//             cartContainer.appendChild(cartElement);
//         }
//     });
// }

// function renderOrderSummary(cart) {
//     cart = cart.filter(item => item !== null);
//     const orderSummary = document.querySelector('.order__count');
//     const subtotal = cart.reduce((acc, item) => acc + item.productPrice * item.quantity, 0);
//     const shippingMethodSelect = document.getElementById('shipping-method');
//     orderSummary.innerHTML = `
//         <div class="order__summary">
//             <div class="order__summary__content">
//                 <h3>Order Summary</h3>
//                 <div class="order__summary__item">
//                     <span>Subtotal:</span>
//                     <span id='shipping-sub-total-price'>${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(subtotal,)}</span>
//                 </div>
//                 <div class="order__summary__item">
//                     <span>Shipping:</span>
//                     <span id="shipping-fee">None</span>
//                 </div>
//                 <div class="order__summary__item">
//                     <span>Total:</span>
//                     <span id='shipping-total-price'>${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(subtotal,)}</span>
//                 </div>
//             </div>
//         </div>
//     `;
// }

// function showOrder() {
//     fetch("http://localhost:5000/api/customer/cart", {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include'
//     })
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//             // renderProductsInCart(data.cart);
//             renderProductsInCart(data.cart);
//             renderOrderUser(data.user);
//             renderOrderSummary(data.cart);
//         });
// }


// const shippingMethodSelect = document.getElementById('shipping-method');
// shippingMethodSelect.addEventListener('change', () => {
//     console.log("ShippingFEE: ", shippingMethodSelect.value);
//     const shippingFeeElement = document.getElementById('shipping-fee');
//     const formattedShippingFee = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(shippingMethodSelect.value);
//     shippingFeeElement.textContent = formattedShippingFee;
//     const shippingTotal = document.getElementById('shipping-total-price');
//     const shippingSubTotal = document.getElementById('shipping-sub-total-price');
//     const subTotal = Number(shippingSubTotal.textContent.replace(/\D/g, ''));
//     const total = subTotal + Number(shippingMethodSelect.value);
//     shippingTotal.textContent = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(total);
// });

// function fetchShippingMethods() {
//     fetch("http://localhost:5000/api/shipping", {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include'
//     })
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//             const shippingMethodSelect = document.getElementById('shipping-method');
//             data.data.forEach(method => {
//                 const option = document.createElement('option');
//                 option.value = method.shippingFee; // Hoặc giá trị unique của method
//                 option.textContent = method.shippingName; // Tên phương thức giao hàng
//                 shippingMethodSelect.appendChild(option);
//             });
//         });
// }


// //Xử lý khi người dùng gửi thông tin vận chuyển:
// document.getElementById('shipping-form').addEventListener('submit', (event) => {
//     event.preventDefault();

//     const address = document.getElementById('address').value;
//     const shippingMethod = document.getElementById('shipping-method').value;

//     fetch("http://localhost:5000/api/customer/order/update-shipping", {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ address, shippingMethod })
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 alert("Shipping information updated successfully!");
//             } else {
//                 alert("Failed to update shipping information.");
//             }
//         });
// });

//Cập nhật trạng thái đơn hàng
// function updateOrderStatus(status) {
//     const orderStatusElement = document.getElementById('order-status');
//     orderStatusElement.textContent = status;

//     fetch("http://localhost:5000/api/customer/order/update-status", {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ status })
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (!data.success) {
//                 alert("Failed to update order status.");
//             }
//         });
// }



// showOrder();
// fetchShippingMethods();


async function fetchOrders() {
    try {
        const response = await fetch('http://localhost:5000/api/customer/order');
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        renderOrders(data.data); // Gọi hàm để render dữ liệu
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}


function renderOrders(orders) {
    const orderTableData = document.querySelector('.order__table__data');
    orderTableData.innerHTML = ''; // Xóa dữ liệu cũ

    // Định nghĩa màu sắc cho từng trạng thái
    const statusColors = {
        Processing: 'blue',
        Pending: 'orange',
        Shipped: 'purple',
        Completed: 'green',
        Cancelled: 'red'
    };


    orders.forEach(order => {
        const totalProducts = order.orderListProduct.reduce((sum, product) => sum + product.quantity, 0);
        const statusColor = statusColors[order.orderStatus] || 'gray'; // Mặc định là 'gray' nếu không có trạng thái phù hợp

        const row = `
            <div class="order__table__items">
                <div class="order__table__item">${order._id }</div>
                <div class="order__table__item">${totalProducts}</div>
                <div class="order__table__item">${order.orderTotalPrice.toLocaleString('vi-VN')} đ</div>
                <div class="order__table__item">${new Date(order.orderCreatedDateTime).toLocaleString()}</div>
                <div class="order__table__item">
                    <div class="order__table__item__icon" style="background-color: ${statusColor};"></div>
                    <div class="order__table__item__status">${order.orderStatus}</div>
                </div>
            </div>
        `;

        orderTableData.insertAdjacentHTML('beforeend', row);
    });
}


fetchOrders(); // Gọi hàm fetchOrders để lấy dữ liệu đơn hàng từ server
