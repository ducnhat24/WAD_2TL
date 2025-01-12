const Shipping = require('../../shipping/schema/Shipping.js');
const Order = require('../schema/Order.js');
const Customer = require('../../customer/schema/Customer.js');
const Product = require('../../product/schema/Product.js');
const Brand = require('../../brand/schema/Brand.js');

const mongoose = require('mongoose');
const CustomerService = require('./CustomerService.js');
const ProductService = require('../../product/model/ProductService.js');
const UserService = require('../../admin/model/UserService.js');
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
            const statusQuery = query.status ? { orderStatus: query.status } : {};
            const orders = await Order.find(statusQuery).exec();

            const newArray = await Promise.all(
                orders.map(async (order) => {
                    const customer = await CustomerService.getUserById(order.customerID);
                    const newArrayListProduct = await Promise.all(order.orderListProduct.map(async (item) => {
                        const product = await ProductService.getProductById(item.productId);
                        return {
                            product: {
                                _id: product.data._id,
                                productName: product.data.productName,
                                productBrand: product.data.productBrand,
                            },
                            quantity: item.quantity,
                            productPrice: item.productPrice,
                        }
                    }));

                    let shipper = null;
                    if (order.orderShipper) {
                        const data = await UserService.getUserByID(order.orderShipper);
                        shipper = {
                            _id: data.data._id,
                            userName: data.data.userName,
                            userEmail: data.data.userEmail,
                            userPhone: data.data.userPhone,
                            userDateOfBirth: data.data.userDateOfBirth,
                        };
                    }

                    let newOrder = {
                        _id: order._id,
                        orderCreatedDateTime: order.orderCreatedDateTime,
                        orderListProduct: newArrayListProduct,
                        orderShippingAddress: order.orderShippingAddress,
                        orderShippingMethod: order.orderShippingMethod,
                        orderShippingFee: order.orderShippingFee,
                        orderTotalPrice: order.orderTotalPrice,
                        orderStatus: order.orderStatus,
                        shipper: shipper,
                        customer: customer.data,
                    };

                    return newOrder;
                })
            );

            return {
                status: 'success',
                message: 'Get all orders successfully',
                data: newArray,
            }
        }
        catch (error) {
            return {
                status: 'error',
                message: error.message || "Internal Server Error",
            }
        }
    }

    async getOrderByID(orderID) {
        try {
            const order = await Order.findById(orderID).exec();
            console.log(order);
            const customer = await CustomerService.getUserById(order.customerID);
            const newArrayListProduct = await Promise.all(order.orderListProduct.map(async (item) => {
                const theChosenProduct = await ProductService.getProductById(item.productId);
                console.log(theChosenProduct);
                return {
                    product: {
                        _id: theChosenProduct.data._id,
                        productName: theChosenProduct.data.productName,
                        productBrand: theChosenProduct.data.productBrand,
                    },
                    quantity: item.quantity,
                    productPrice: item.productPrice,
                }
            }));


            // let shipper = null;
            // if (order.orderShipper) {
            //     const data = await UserService.getUserByID(order.orderShipper);
            //     shipper = data.data;
            // }

            const newOrder = {
                _id: order._id,
                orderCreatedDateTime: order.orderCreatedDateTime,
                orderListProduct: newArrayListProduct,
                orderShippingAddress: order.orderShippingAddress,
                orderShippingMethod: order.orderShippingMethod,
                orderShippingFee: order.orderShippingFee,
                orderTotalPrice: order.orderTotalPrice,
                orderStatus: order.orderStatus,
                shipper: {},
                customer: customer.data,
            };

            return {
                status: 'success',
                message: 'Get order successfully',
                data: newOrder,
            };
        } catch (error) {
            return {
                status: 'error',
                message: error.message || "Internal Server Error",
            }
        }
    }

    async updateOrder(orderID, updateInfo) {
        try {
            const status = updateInfo.orderStatus;
            const shipperID = updateInfo.shipperID;
            const order = await Order.findById(orderID).exec();
            console.log(order);
            if (!order) {
                return {
                    status: 'error',
                    message: 'Order not found',
                }
            }

            order.orderStatus = status;
            if (shipperID) {
                if (shipperID !== '') {
                    order.orderShipper = shipperID;
                }
            }
            await order.save();

            return {
                status: 'success',
                message: 'Update order status successfully',
            }
        } catch (error) {
            return {
                status: 'error',
                message: error.message || "Internal Server Error",
            }
        }
    }

    async addShipperOrder(orderID, shipperID) {
        try {
            const order = await Order.findById(orderID).exec();
            if (!order) {
                return {
                    status: 'error',
                    message: 'Order not found',
                }
            }

            order.orderStatus = 'Pending';
            order.orderShipper = shipperID;
            await order.save();

            return {
                status: 'success',
                message: 'Update order status successfully',
            }
        } catch (error) {
            return {
                status: 'error',
                message: error.message || "Internal Server Error",
            }
        }
    }
}
module.exports = new OrderService;