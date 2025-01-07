const ShippingService = require('../model/ShippingService');

class ShippingController {
    async getAllShipping(req, res) {
        // Get all shipping methods
        try {
            const shipping = await ShippingService.getAllShipping();
            if (shipping.status === 'error') {
                return res.status(404).json(shipping);
            }
            res.status(200).json(shipping);
            return;
        } catch (err) {
            res.status(400).json(err);
        }
    }
}

module.exports = new ShippingController;