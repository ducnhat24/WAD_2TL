const Shipping = require('../../shipping/schema/Shipping.js');
const Order = require('../schema/Order.js');
class OrderService {

    async createOrder() {
        try {
            // Tạo đơn hàng mới
            // return { status: 'success' };
            const cart = await Cart.findOne({ customer: req.user._id });
            if (!cart) {
                return res.status(400).json({ message: 'Cart not found' });
            }
            const order = new Order({
                customer: req.user._id,
                items: cart.items,
                shippingAddress: req.body.address,
                shippingMethod: req.body.shippingMethod,
                status: 'pending',
            });
            await order.save();
            cart.items = [];
            await cart.save();
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }

    async getShippingMethods() {
        try {
            const shippingMethods = await Shipping.find();
            return { status: 'success', methods: shippingMethods };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }

    async updateShipping(address, shippingMethod) {
        try {
            // Cập nhật thông tin vận chuyển
            // return { status: 'success' };
            const order = await Order
                .findOne({ customer: req.user._id, status: 'pending' })
                .populate('items.product');
            if (!order) {
                return res.status(400).json({ message: 'Order not found' });
            }
            order.shippingAddress = address;
            order.shippingMethod = shippingMethod;
            await order.save();
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }

    async updateStatusOrder(status) {
        try {
            // Cập nhật trạng thái đơn hàng
            // return { status: 'success' };
            const order = await Order
                .findOne({ customer: req.user._id, status: 'pending' })
                .populate('items.product');
            if (!order) {
                return res.status(400).json({ message: 'Order not found' });
            }
            order.status = status;
            await order.save();
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }
}
module.exports = new OrderService;