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

    async getTotalPurchase(query) {
        try {
            const dateNow = new Date();
            const dateFrom = {
                day: query.dayFrom ? (query.dayFrom === '' ? 1 : query.dayFrom) : 1,
                month: query.monthFrom ? (query.monthFrom === '' ? 0 : query.monthFrom - 1) : 0,
                year: query.yearFrom ? (query.yearFrom === '' ? dateNow.getFullYear() : query.yearFrom) : dateNow.getFullYear(),
            }

            const dateTo = {
                day: query.dayTo ? (query.dayTo === '' ? dateNow.getDate() : query.dayTo) : dateNow.getDate(),
                month: query.monthTo ? (query.monthTo === '' ? dateNow.getMonth() : query.monthTo - 1) : dateNow.getMonth(),
                year: query.yearTo ? (query.yearTo === '' ? dateNow.getFullYear() : query.yearTo) : dateNow.getFullYear(),
            }

            // const dateTest = new Date(dateFrom.year, dateFrom.month, dateFrom.day);
            // console.log(dateTest < dateNow);
            // console.log(dateFrom);
            // console.log(dateTo);

            const orders = await Order.find({
                orderStatus: "Completed",
                orderCreatedDateTime: {
                    $gte: new Date(dateFrom.year, dateFrom.month, dateFrom.day),
                    $lt: new Date(dateTo.year, dateTo.month, dateTo.day),
                }
            }).exec();

            const ordersBeginning = await Order.find({
                orderStatus: "Completed",
                orderCreatedDateTime: {
                    $lt: new Date(dateFrom.year, dateFrom.month, dateFrom.day),
                }
            }).exec();


            let totalPurchaseBeginning = 0;
            for (let i = 0; i < ordersBeginning.length; i++) {
                totalPurchaseBeginning += Number(ordersBeginning[i].orderTotalPrice);
            }

            let totalPurchaseAfter = 0;
            for (let i = 0; i < orders.length; i++) {
                totalPurchaseAfter += Number(orders[i].orderTotalPrice);
            }

            return {
                status: 'success',
                message: 'Get total purchase successfully',
                data: {
                    totalPurchaseBeginning,
                    totalPurchaseAfter,
                },
            }

        } catch (error) {
            return {
                status: 'error',
                message: error.message || "Internal Server Error",
            }
        }

    }

    async getTotalPurchaseByEachProduct(query) {
        try {
            const dateNow = new Date();
            const dateFrom = {
                day: query.dayFrom ? (query.dayFrom === '' ? 1 : query.dayFrom) : 1,
                month: query.monthFrom ? (query.monthFrom === '' ? 0 : query.monthFrom - 1) : 0,
                year: query.yearFrom ? (query.yearFrom === '' ? dateNow.getFullYear() : query.yearFrom) : dateNow.getFullYear(),
            }

            const dateTo = {
                day: query.dayTo ? (query.dayTo === '' ? dateNow.getDate() : query.dayTo) : dateNow.getDate(),
                month: query.monthTo ? (query.monthTo === '' ? dateNow.getMonth() : query.monthTo - 1) : dateNow.getMonth(),
                year: query.yearTo ? (query.yearTo === '' ? dateNow.getFullYear() : query.yearTo) : dateNow.getFullYear(),
            }

            // const dateTest = new Date(dateFrom.year, dateFrom.month, dateFrom.day);
            // console.log(dateTest < dateNow);
            // console.log(dateFrom);
            // console.log(dateTo);

            const orders = await Order.find({
                orderStatus: "Completed",
                orderCreatedDateTime: {
                    $gte: new Date(Number(dateFrom.year), Number(dateFrom.month), Number(dateFrom.day)),
                    $lt: new Date(Number(dateTo.year), Number(dateTo.month), Number(dateTo.day)),
                }
            }).exec();

            let listProduct = [];
            for (let i = 0; i < orders.length; i++) {
                const order = orders[i];
                for (let j = 0; j < order.orderListProduct.length; j++) {
                    const product = order.orderListProduct[j];
                    const index = listProduct.findIndex(item => item.productId == product.productId);
                    if (index == -1) {
                        listProduct.push({
                            productID: product.productId,
                            totalPurchase: Number(product.productPrice) * Number(product.quantity),
                        });
                    } else {
                        listProduct[index].totalPurchase += (Number(product.productPrice) * Number(product.quantity));
                    }
                }
            }


            return {
                status: 'success',
                message: 'Get total purchase each product successfully',
                data: listProduct,
            }

        } catch (error) {
            return {
                status: 'error',
                message: error.message || "Internal Server Error",
            }
        }
    }

    async getAllOrders(query) {
        try {
            console.log(query);
            const statusQuery = query.status ? { orderStatus: query.status } : {};
            const orders = await Order.find(statusQuery).exec();

            return {
                status: 'success',
                message: 'Get all orders successfully',
                orders: orders,
            }
        }
        catch (error) {
            return {
                status: 'error',
                message: error.message || "Internal Server Error",
            }
        }
    }
}
module.exports = new OrderService;