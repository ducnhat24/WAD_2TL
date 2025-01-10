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
            const customerID = req.user.id;
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
}

module.exports = new OrderController;