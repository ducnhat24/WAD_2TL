const Shipping = require('../schema/Shipping');

class ShippingService {
    async getAllShipping() {
        try {
            const shipping = await Shipping.find();
            if (!shipping) {
                return {
                    status: 'error',
                    message: 'Shipping not found'
                };
            }
            return {
                status: 'success',
                message: 'Shipping found',
                data: shipping
            };
        } catch (err) {
            return {
                status: 'error',
                message: err.message
            }
        }
    }
}

module.exports = new ShippingService;