const Shipping = require('../../shipping/schema/Shipping.js');
const Order = require('../schema/Order.js');

const mongoose = require('mongoose');

class OrderService {

// async createOrder(orderData) {
//         try {
//             // Kiểm tra dữ liệu cần thiết
//             const {
//                 customerID,
//                 orderListProduct,
//                 orderShippingAddress,
//                 orderShippingMethod,
//                 orderShippingFee,
//                 orderTotalPrice,
//                 orderPayment,
//                 orderStatus,
//             } = orderData;

//             if (!customerID || !orderListProduct || !orderShippingAddress || !orderShippingMethod) {
//                 throw new Error("Missing required fields.");
//             }

//             // Tạo đơn hàng mới
//             const newOrder = new Order({
//                 customerID,
//                 orderListProduct,
//                 orderShippingAddress,
//                 orderShippingMethod,
//                 orderShippingFee,
//                 orderTotalPrice,
//                 orderPayment,
//                 orderStatus,
//             });

//             // Lưu vào MongoDB
//             return await newOrder.save();
//         } catch (error) {
//             console.error("Error creating order:", error);
//             throw error;
//         }
    //     }
    
        async createOrder(orderData) {
        try {
            const {
                customerID,
                orderListProduct,
                orderShippingAddress,
                orderShippingMethod,
                orderShippingFee,
                orderTotalPrice,
                orderPayment,
                orderStatus,
            } = orderData;

            // Kiểm tra và chuyển đổi ObjectId
            if (!mongoose.Types.ObjectId.isValid(customerID)) {
                throw new Error("Invalid customerID.");
            }
            console.log(orderShippingMethod);
            if (!mongoose.Types.ObjectId.isValid(orderShippingMethod)) {
                throw new Error("Invalid orderShippingMethod.");
            }


            // Tạo đơn hàng mới
            const newOrder = new Order({
                customerID, // Chuyển đổi sang ObjectId
                orderListProduct,
                orderShippingAddress,
                orderShippingMethod, // Chuyển đổi sang ObjectId
                orderShippingFee,
                orderTotalPrice,
                orderPayment,
                orderStatus,
            });

            // Lưu vào MongoDB
            return await newOrder.save();
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    }
}
module.exports = new OrderService;