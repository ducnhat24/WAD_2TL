var fetchURL = process.env.FETCH_URL;
async function getCustomerID() {
    try {
        const response = await fetch(fetchURL + '/api/customer/id');
        if (!response.ok) {
            throw new Error(`Error fetching customer ID: ${response.status}`);
        }
        if (response.status == "error") {
            alert("Please login first to write a review!");
            return null;
        }
      const data = await response.json();
        return data.data._id; // Trả về dữ liệu customer ID từ API
    }
    catch (error) {
        console.error("Error fetching customer ID:", error);
        return null; // Trả về null nếu có lỗi
    }
}



window.addEventListener('load', async () => {
    // Lấy các tham số từ URL trả về từ VNPay
    const urlParams = new URLSearchParams(window.location.search);
    const vnpAmount = urlParams.get('vnp_Amount');
    const vnpBankCode = urlParams.get('vnp_BankCode');
    const vnpTransactionStatus = urlParams.get('vnp_TransactionStatus');
    const vnpTxnRef = urlParams.get('vnp_TxnRef');
    const vnpSecureHash = urlParams.get('vnp_SecureHash');

    // Lấy thông tin đơn hàng đã lưu trong localStorage
    const orderData = JSON.parse(localStorage.getItem('orderData')) || {};

    // Kiểm tra nếu không có dữ liệu đơn hàng trong localStorage
    if (!orderData.selectedProducts || orderData.selectedProducts.length === 0) {
        alert("No products selected.");
        return;
    }
    const customerID = await getCustomerID();
    // Tạo dữ liệu order cần gửi lên backend
    const orderDataToSend = {
        customerID: customerID,
        orderShippingAddress: orderData.orderShippingAddress || "123 Main St, City, Country", // Địa chỉ giao hàng
        orderShippingMethod: orderData.orderShippingMethod || "express", // Phương thức giao hàng
        orderShippingFee: orderData.orderShippingFee || 0, // Phí vận chuyển
        orderTotalPrice: orderData.orderTotalPrice, // Tổng tiền từ VNPay
        selectedProducts: orderData.selectedProducts || [], // Danh sách sản phẩm
        orderPayment: vnpTransactionStatus === "00" ? 1 : 0, // 1 = Paid, 0 = Unpaid (theo trạng thái giao dịch từ VNPay)
        orderStatus: "Processing", // Trạng thái đơn hàng
        orderListProduct: orderData.selectedProducts || [], // Danh sách sản phẩm
    };

    // Gửi dữ liệu để tạo order
    try {
        const response = await fetch(fetchURL + '/api/customer/create-order-after-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderDataToSend),
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Order created successfully:", result);
            // Hiển thị thông báo cho người dùng (hoặc chuyển hướng)
            alert("Order created successfully.");
            for (let i = 0; i < orderData.selectedProducts.length; i++) {
                handleDeleteCard(orderData.selectedProducts[i].productId);
            }
            window.location.href = fetchURL + "/customer/order";
        } else {
            const errorData = await response.json();
            console.error("Error creating order:", errorData.message);
            alert("Failed to create order.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("There was an error creating your order.");
    }
});


function handleDeleteCard(id) {
    if (isUserLoggedIn()) {
        // Delete from server
        fetch(fetchURL + "/api/customer/cart", {
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