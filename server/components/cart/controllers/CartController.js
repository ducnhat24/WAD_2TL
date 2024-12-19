

const CartService = require('../model/CartService.js');
const cartService = new CartService();
const jwt = require('jsonwebtoken');
const User = require("../../../schemas/Customer.js"); // Import model User
// const { multipleMongooseToObject, mongooseToObject } = require('../utils/mongoose');
class CartController {
    async addProductToCart(req, res) {
        try {
            const { productID, quantity } = req.body;
            const accessToken = req.cookies.accessToken;

            if (!accessToken) {
                return res.json({ status: "warning", msg: "Please login first!" });
            }

            const token = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
            const result = await cartService.addProductToCart({ userID: token.id, productID, quantity });
            if (result.status === 'success') {
                return res.status(200).json({ status: 'success', msg: 'Add succesfully' });
            }
            return res.status(500).json({ msg: "Error adding to cart" });
        }
        catch {
            console.log("Error adding to cart");
        }
    }

    async removeProductFromCart(req, res) {
        const { productId } = req.body;
        const accessToken = req.cookies.accessToken;
        const token = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
        try {
            const result = await cartService.removeProductFromCart({ userID: token.id, productID: productId });
            if (result.status === 'success') {
                return res.status(200).json({ message: "Product removed from cart" });
            }
            return res.status(500).json({ message: "Error removing from cart" });
        }
        catch (err) {
            console.log(err.message);
        }
    }

    async updateProductInCart(req, res) {
        const { productId, quantity } = req.body;
        const accessToken = req.cookies.accessToken;
        const token = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
        try {
            const result = await cartService.updateProductInCart({ userID: token.id, productID: productId, quantity });
            if (result.status === 'success') {
                return res.status(200).json({ status: 'success', message: "Product updated in cart" });
            }
            console.log(result.message);
            return res.status(500).json({ message: "Error updating in cart" });
        }
        catch (err) {
            console.log(err.message);
        }

    }

    async getCart(req, res) {

        try {
            const accessToken = req.cookies.accessToken;
            const token = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)

            const result = await cartService.getCart(token.id);
            if (result.status === 'success') {
                return res.status(200).json({ cart: result.cart, user: result.user });
            }
            return res.status(500).json({ message: "Error getting cart" });
        }
        catch (err) {
            console.log(err.message);
        }
    }
}

module.exports = new CartController;