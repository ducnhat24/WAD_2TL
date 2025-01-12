function isUserLoggedIn() {
    const cookies = document.cookie.split(';');
    return cookies.some(cookie => cookie.trim().startsWith('accessToken='));
}

// function handleDeleteCard(id) {
//     const productId = id;
//     fetch("http://localhost:5000/api/customer/cart", {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ productId })
//     })
//         .then(response => response.json())
//         .then(data => {
//             location.reload();
//             // showCart();
//         })
// }

function handleDeleteCard(id) {
    if (isUserLoggedIn()) {
        // Delete from server
        fetch("http://localhost:5000/api/customer/cart", {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ productId: id })
        })
        .then(response => response.json())
        .then(data => {
            location.reload();
        });
    } else {
        // Delete from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.productId !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        location.reload();
    }
}

// function increaseQuantity(quantity) {
//     quantity = Number(quantity) + 1;
//     return quantity;
// }

// function decreaseQuantity(quantity) {
//     quantity = Number(quantity) - 1;
//     if (quantity < 0) {
//         quantity = 0;
//     }
//     return quantity;
// }

// Modified increase/decrease quantity functions
function increaseQuantity(id, currentQuantity) {
    const newQuantity = Number(currentQuantity) + 1;
    handleQuantityChange(id, newQuantity);
    return newQuantity;
}

function decreaseQuantity(id, currentQuantity) {
    const newQuantity = Math.max(0, Number(currentQuantity) - 1);
    handleQuantityChange(id, newQuantity);
    return newQuantity;
}

// function handleUpdateQuantity(id, quantity) {
//     const productId = id;

//     fetch("http://localhost:5000/api/customer/cart", {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ productId, quantity })
//     })
//         .then(response => response.json())
//         .then(data => {
//             location.reload();
//             // showCart();
//         })
// }

// Function to update quantity in local storage
function updateLocalCartQuantity(productId, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item._id === productId);
    
    if (productIndex !== -1) {
        cart[productIndex].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
}


function handleUpdateQuantity(id, quantity) {
    if (isUserLoggedIn()) {
        // Update server cart
        fetch("http://localhost:5000/api/customer/cart", {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ productId: id, quantity })
        })
        .then(response => response.json())
        .then(data => {
            location.reload();
        });
    } else {
        // Update localStorage cart
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const item = cart.find(item => item.productId === id);
        if (item) {
            item.quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload();
        }
    }
}


// Handle quantity changes
function handleQuantityChange(id, newQuantity) {
    if (isUserLoggedIn()) {
        handleUpdateQuantity(id, newQuantity);
    } else {
        updateLocalCartQuantity(id, newQuantity);
        location.reload();
    }
}
function createCartItem(item) {
    const cartItemDiv = document.createElement("label");
    cartItemDiv.htmlFor = item._id;
    cartItemDiv.classList.add("cart__item");

    cartItemDiv.innerHTML = `
        <div class="cart__left">
            <img src="${item.productMainImage}" class="card-img-top" alt="${item.productName}">
        </div>

        <div class="card__right">
            <div class="cart__item__title">
                <div class="cart__product__name">
                    <span>${item.productName}</span>
                </div>
            </div>

            <div class="card__item__footer">
                <div class="card__product__price">
                    <span>${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(item.productPrice)}</span>
                </div>

                <div class="cart__item__btn">
                    <button class="decrease-quantity">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity">+</button>
                </div>
            </div>
        </div>
        
        <button class="delete-product">X</button>
        <button class="edit-quantity">?</button>
    `;

    // Add event listeners
    cartItemDiv.querySelector('.delete-product').addEventListener("click", () => 
        handleDeleteCard(isUserLoggedIn() ? item._id : item.productId)
    );
    
    cartItemDiv.querySelector('.edit-quantity').addEventListener("click", () => 
        handleUpdateQuantity(isUserLoggedIn() ? item._id : item.productId, item.quantity)
    );

    cartItemDiv.querySelector('.increase-quantity').addEventListener("click", () => {
        item.quantity = increaseQuantity(item.quantity);
        const quantitySpan = cartItemDiv.querySelector('.cart__item__btn span');
        quantitySpan.textContent = item.quantity;
        updateCartSummary();
    });
    
    cartItemDiv.querySelector('.decrease-quantity').addEventListener("click", () => {
        item.quantity = decreaseQuantity(item.quantity);
        const quantitySpan = cartItemDiv.querySelector('.cart__item__btn span');
        quantitySpan.textContent = item.quantity;
        updateCartSummary();
    });

    return cartItemDiv;
}

// function createCartItem(item) {
//     // Create container div
//     const cartItemDiv = document.createElement("label");
//     cartItemDiv.htmlFor = item._id;
//     cartItemDiv.classList.add("cart__item");
//     // cartItemDiv.id = item._id;

//     cartItemDiv.innerHTML = `
//             <div class="cart__left" >
//                 <img src="${item.productMainImage}" class="card-img-top" alt="${item.productName}">
//             </div>

//             <div class="card__right">
//                 <div class="cart__item__title">
//                     <div class="cart__product__name">
//                         <span>${item.productName}</span>
//                     </div>
//                 </div>

//                 <div class="card__item__footer">
//                     <div class="card__product__price">
//                         <span>${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(item.productPrice,)}</span>
//                     </div>

//                     <div class="cart__item__btn">
//                         <button class="decrease-quantity">-</button>
//                         <span>${item.quantity}</span>
//                         <button class="increase-quantity">+</button>
//                     </div>
//                 </div>

//             </div>
        
            
//             <button class="delete-product">X</button>
//             <button class="edit-quantity">?</button>
//     `;

//     cartItemDiv.querySelector('.delete-product').addEventListener("click", () => handleDeleteCard(item._id));
//     cartItemDiv.querySelector('.edit-quantity').addEventListener("click", () => handleUpdateQuantity(item._id, item.quantity));

//     cartItemDiv.querySelector('.increase-quantity').addEventListener("click", () => {
//         item.quantity = increaseQuantity(item.quantity);
//         const quantitySpan = cartItemDiv.querySelector('.cart__item__btn span');
//         quantitySpan.textContent = item.quantity;
//         updateCartSummary();
//     });
//     cartItemDiv.querySelector('.decrease-quantity').addEventListener("click", () => {
//         item.quantity = decreaseQuantity(item.quantity);
//         const quantitySpan = cartItemDiv.querySelector('.cart__item__btn span');
//         quantitySpan.textContent = item.quantity;
//         updateCartSummary();
//     });

//     return cartItemDiv;
// }

// function renderDetailUser(user) {
//     const customerDetailContainer = document.querySelector(".cart__customer__detail");
//     customerDetailContainer.innerHTML = `
//         <div class="cart__customer__detail__title">
//                 <span>Customer Details</span>
//             </div>
//             <div class="cart__customer__detail__content">
            
//                 <div class="cart__customer__detail__item">
//                     <span>Name:</span>
//                     <span>${user.username}</span>
//                 </div>
//                 <div class="cart__customer__detail__item">
//                     <span>Email:</span>
//                     <span>${user.useremail}</span>
//                 </div>
//             </div>
//     `;
// }

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
            ${!isUserLoggedIn() ? `
            <div class="cart__customer__detail__item">
                <a href="/customer/login" class="btn custom_button">Login to Checkout</a>
            </div>
            ` : ''}
        </div>
    `;
}

function renderProductsDetail(productList) {
    let totalPrice = 0;
    productList.forEach((product) => {
        totalPrice += Number(product.productPrice) * Number(product.quantity);
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

let productOrdered = [];
function renderProductsInCart(productList) {
    const cartContainer = document.querySelector(".cart .cart__body");
    cartContainer.innerHTML = "";
    
    productList.forEach((product) => {
        if (product !== null) {
            const checkbox = document.createElement("input");
            checkbox.id = product._id;
            checkbox.type = "checkbox";
            checkbox.onclick = () => {
                if (checkbox.checked) {
                    productOrdered.push(product);
                } else {
                    productOrdered = productOrdered.filter((item) => item._id !== product._id);
                }
                updateCartSummary();
            }

            const cartElement = createCartItem(product);
            cartContainer.appendChild(checkbox);
            cartContainer.appendChild(cartElement);
        }
    });
}
// function renderProductsInCart(productList) {
//     const cartContainer = document.querySelector(".cart .cart__body"); // Replace with your container selector

//     cartContainer.innerHTML = ""; // Clear existing content
//     productList.forEach((product) => {
//         if (product !== null) {
//             const checkbox = document.createElement("input");
//             checkbox.id = product._id;
//             checkbox.type = "checkbox";
//             checkbox.onclick = () => {
//                 if (checkbox.checked) {
//                     productOrdered.push(product);
//                 } else {
//                     productOrdered = productOrdered.filter((item) => item._id !== product._id);
//                 }
//                 updateCartSummary();
//                 console.log(productOrdered);
//             }

//             const cartElement = createCartItem(product);

//             cartContainer.appendChild(checkbox);
//             cartContainer.appendChild(cartElement);
//         }
//     });
// }

// function showCart() {
//     // Show cart
//     location.href = "/user/cart";
// }

// function showCart() {
//     // Show cart
//     fetch("http://localhost:5000/api/customer/cart", {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include'

//     })
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//             renderProductsInCart(data.cart);
//             renderDetailUser(data.user);

//             userInfor = data.user;
//             renderProductsDetail(data.cart);
//             fetchShippingMethodsInCart();
//         })
// }

// async function showCart() {
//     if (isUserLoggedIn()) {
//         // Fetch cart from server
//         try {
//             const response = await fetch("http://localhost:5000/api/customer/cart", {
//                 method: 'GET',
//                 headers: { 'Content-Type': 'application/json' },
//                 credentials: 'include'
//             });
//             const data = await response.json();
//             renderProductsInCart(data.cart);
//             renderDetailUser(data.user);
//             userInfor = data.user;
//             renderProductsDetail(data.cart);
//             fetchShippingMethodsInCart();
//         } catch (error) {
//             console.error('Error fetching cart:', error);
//         }
//     } else {
//         // Get cart from localStorage and fetch product details
//         try {
//             const localCart = JSON.parse(localStorage.getItem('cart')) || [];
//             const productsPromises = localCart.map(async (item) => {
//                 const response = await fetch(`http://localhost:5000/api/product/${item.productId}`);
//                 const product = await response.json();
//                 return {
//                     ...product,
//                     quantity: item.quantity
//                 };
//             });
            
//             const products = await Promise.all(productsPromises);
            
//             // Render cart with local storage data
//             renderProductsInCart(products);
//             renderDetailUser({ username: 'Guest User', useremail: 'Not logged in' });
//             renderProductsDetail(products);
//             fetchShippingMethodsInCart();
//         } catch (error) {
//             console.error('Error fetching product details:', error);
//         }
//     }
// }


// Function to show cart contents with complete product info
function showCart() {
    if (isUserLoggedIn()) {
        // Fetch cart from server
        fetch("http://localhost:5000/api/customer/cart", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            renderProductsInCart(data.cart);
            renderDetailUser(data.user);
            userInfor = data.user;
            renderProductsDetail(data.cart);
            fetchShippingMethodsInCart();
        })
        .catch(error => console.error('Error fetching cart:', error));
    } else {
        // Use local cart data
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        renderProductsInCart(localCart);
        renderDetailUser({ username: 'Guest User', useremail: 'Not logged in' });
        renderProductsDetail(localCart);
        fetchShippingMethodsInCart();
    }
}


showCart();
let cartData = {
    numberOfItems: 0,
    subtotal: 0,
    shipping: 0,
    total: 0,
};

function updateCartSummary() {
    let subtotal = 0;
    productOrdered.forEach((product) => {
        subtotal += Number(product.productPrice) * Number(product.quantity);
    });

    let total = subtotal;

    cartData.numberOfItems = productOrdered.length;
    cartData.subtotal = subtotal;
    cartData.total = total + cartData.shipping;


    document.getElementById("numberOfItems").textContent = cartData.numberOfItems;
    document.getElementById("subtotal").textContent = `${cartData.subtotal.toLocaleString('vi-VN')} ₫`;
    document.getElementById("shipping").textContent = `${cartData.shipping.toLocaleString('vi-VN')} ₫`;
    document.getElementById("total").textContent = `${cartData.total.toLocaleString('vi-VN')} ₫`;

}

function fetchShippingMethodsInCart() {
    fetch("http://localhost:5000/api/shipping", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Kiểm tra dữ liệu trả về từ API
        
        const shippingMethodSelect = document.getElementById('shipping-method');
        
        // Xóa tất cả các option cũ trừ option mặc định
        while (shippingMethodSelect.options.length > 1) {
            shippingMethodSelect.remove(1);
        }

        // Thêm các phương thức mới từ API
        data.data.forEach(method => {
            const option = document.createElement('option');
            option.value = method.shippingFee; // Giá phí vận chuyển
            option.setAttribute('data-shipping-id', method._id); // ID phương thức vận chuyển
            console.log("Method: ", method);
            option.textContent = `${method.shippingName} - ${method.shippingFee.toLocaleString('vi-VN')} ₫`; // Tên và giá
            shippingMethodSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error fetching shipping methods:', error);
    });
}

document.getElementById('shipping-method').addEventListener('change', (event) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    console.log("Selected Option: ",selectedOption.value);

    // Lấy giá trị phí vận chuyển từ `option`
    const selectedShippingFee = parseFloat(selectedOption.value) || 0;

    // Cập nhật `cartData` (hoặc bất kỳ state nào bạn đang dùng)
    cartData.shipping = selectedShippingFee;

    // Cập nhật giao diện
    updateCartSummary();
});

document.getElementById('pay-button').addEventListener('click', async () => {
    try {
        // Thu thập thông tin từ giao diện
        // const shippingMethod = document.getElementById('shipping-method').getAttribute('data-shipping-id');
        
        // Lấy phần tử select
        const shippingMethodSelect = document.getElementById('shipping-method');

        // Lấy option được chọn
        const selectedOption = shippingMethodSelect.options[shippingMethodSelect.selectedIndex];

        // Lấy giá trị data-shipping-id từ option được chọn
        const shippingMethod = selectedOption.getAttribute('data-shipping-id');


        const shippingAddress = document.querySelector('textarea').value;

        if (!shippingMethod || !shippingAddress) {
            alert("Please select a shipping method and provide an address.");
            return;
        }

        const listProduct = productOrdered.map((product) => {
            return {
                productId: product._id,
                quantity: product.quantity,
                productPrice: product.productPrice,
            };
        });

        // Tạo dữ liệu order
        const orderData = {
            customerID: userInfor._id, // Cập nhật ID khách hàng thật từ session hoặc context
            orderListProduct: listProduct, // Dữ liệu sản phẩm từ giỏ hàng
            orderShippingAddress: shippingAddress,
            orderShippingMethod: shippingMethod,
            orderShippingFee: parseFloat(shippingMethod), // Lấy từ value của option
            orderTotalPrice: cartData.total,
            orderPayment: 1, // 1 = Paid, 0 = Unpaid
            orderStatus: "Processing",
        };

        // Gửi dữ liệu đến backend
        const response = await fetch("http://localhost:5000/api/customer/order/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(orderData),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Order created successfully!");
            console.log(result);
            //for each product in the cart, delete it
            productOrdered.forEach((product) => {
                handleDeleteCard(product._id);
            });
        } else {
            throw new Error(result.message || "Failed to create order.");
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred while processing your order.");
    }
});


