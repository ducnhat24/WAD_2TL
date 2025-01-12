const OrderService = require('../model/OrderService');
class OrderController {
    showOrder(req, res) {
        res.render('order');
    }

    async addOrder(req, res) {
        try {
            const {
                customerID,
                orderShippingMethod,
                orderListProduct,
                orderShippingAddress,
                orderShippingFee,
                orderTotalPrice,
                orderPayment,
                orderStatus,
            } = req.body;

            // Kiểm tra dữ liệu đầu vào
            if (!customerID || !orderListProduct || !orderShippingAddress || !orderShippingMethod) {
                return res.status(400).json({ message: "Missing required fields." });
            }

            // Gọi hàm trong service
            const savedOrder = await OrderService.createOrder(req.body);

            // Trả phản hồi thành công
            res.status(201).json({ message: "Order created successfully", order: savedOrder });
        } catch (error) {
            // Trả lỗi phản hồi
            res.status(500).json({ message: error.message || "Internal Server Error" });
        }
    }

    async getOrders(req, res) {
        try {
            const customerID = req.user.userID;
            console.log(req.user);

            // Gọi hàm trong service
            const orders = await OrderService.getOrders(customerID);

            // Trả phản hồi thành công
            res.status(200).json({ data: orders });
        } catch (error) {
            // Trả lỗi phản hồi
            res.status(500).json({ message: error.message || "Internal Server Error" });
        }
    }

    async getTotalPurchase(req, res) {
        try {
            const totalPurchase = await OrderService.getTotalPurchase(req.query);

            res.status(200).json(totalPurchase);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message || "Internal Server Error"
            });
        }
    }

    async getTotalPurchaseByEachProduct(req, res) {
        try {
            const totalPurchase = await OrderService.getTotalPurchaseByEachProduct(req.query);

            res.status(200).json(totalPurchase);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message || "Internal Server Error"
            });
        }
    }

    async getAllOrders(req, res) {
        try {
            const orders = await OrderService.getAllOrders(req.query);

            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message || "Internal Server Error"
            });

        }
    }

    async updateOrder(req, res) {
        try {
            const orderID = req.params.id;
            const updateInfo = req.body;

            const updatedOrder = await OrderService.updateOrder(orderID, updateInfo);

            res.status(200).json(updatedOrder);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message || "Internal Server Error"
            });
        }
    }
}
module.exports = new OrderController;