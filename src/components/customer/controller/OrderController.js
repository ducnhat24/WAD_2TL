const OrderService = require('../model/OrderService');
class OrderController {
    showOrder(req, res) {
        //call the service to create an order in the database
        OrderService.createOrder();


        res.render('order');
    }

    async getShippingMethods(req, res) {
        try {
            const result = await OrderService.getShippingMethods();
            if (result.status === 'success') {
                return res.status(200).json({ methods: result.methods });
            }
            return res.status(500).json({ message: "Error getting shipping methods" });
        }
        catch (err) {
            console.log(err.message);
        }
    }

    async updateShipping(req, res) {
        try {
            const { address, shippingMethod } = req.body;
            const result = await OrderService.updateShipping(address, shippingMethod);
            if (result.status === 'success') {
                return res.status(200).json({ success: true });
            }
            return res.status(500).json({ message: "Error updating shipping information" });
        }
        catch (err) {
            console.log(err.message);
        }
    }

    async updateStatusOrder(req, res) {
        try {
            const { status } = req.body;
            const result = await OrderService.updateStatusOrder(status);
            if (result.status === 'success') {
                return res.status(200).json({ success: true });
            }
            return res.status(500).json({ message: "Error updating order status" });
        }
        catch (err) {
            console.log(err.message);
        }
    }
}

module.exports = new OrderController;