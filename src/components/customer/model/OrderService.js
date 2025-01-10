const Shipping = require('../../shipping/schema/Shipping.js');
const Order = require('../schema/Order.js');
const Customer = require('../../customer/schema/Customer.js');
const Product = require('../../product/schema/Product.js');
const Brand = require('../../brand/schema/Brand.js');

const mongoose = require('mongoose');

class OrderService {


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

    async getOrders(customerID) {
        try {
            const orders = await Order.find({ customerID: customerID }).exec();
            
            //populate shipping method
            for (let i = 0; i < orders.length; i++) {
                const order = orders[i];
                const shippingMethod = await Shipping.findById(order.orderShippingMethod).exec();
                order.orderShippingMethod = shippingMethod;

                //populate customer
                const customer = await Customer.findById(order.customerID).exec();
                order.customerID = customer;

                //populate product
                for (let j = 0; j < order.orderListProduct.length; j++) {
                    const product = order.orderListProduct[j];
                    const productDetail = await Product.findById(product.productId).exec();
                    product.productId = productDetail;

                    //populate product brand
                    const productBrand = await Brand.findById(product.productId.productBrand).exec();
                    product.productId.productBrand = productBrand;
                }
            }

            return orders;
        } catch (error) {
            console.error("Error getting orders:", error);
            throw error;
        }
    }
}
module.exports = new OrderService;