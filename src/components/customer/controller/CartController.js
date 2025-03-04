const jwt = require('jsonwebtoken');
const CartService = require('../model/CartService');

class CartController {
    showCart(req, res) {
        res.render('cart');
    }

    // async addProductToCart(req, res) {
    //     try {
    //         const { productID, quantity } = req.body;
    //         const accessToken = req.cookies.accessToken;

    //         if (!accessToken) {
    //             return res.json({ status: "warning", msg: "Please login first!" });
    //         }

    //         const token = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
    //         const result = await CartService.addProductToCart({ userID: token.userID, productID, quantity });
    //         if (result.status === 'success') {
    //             return res.status(200).json({ status: 'success', msg: 'Add succesfully' });
    //         }
    //         return res.status(500).json({ msg: "Error adding to cart" });
    //     }
    //     catch {
    //         console.log("Error adding to cart");
    //     }
    // }

    async addProductToCart(req, res) {
        try {
            const { productID, quantity } = req.body;
            const accessToken = req.cookies.accessToken;

            if (!accessToken) {
                return res.json({ status: "warning", msg: "Please login first!" });
            }

            const token = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
            const result = await CartService.addProductToCart({ userID: token.userID, productID, quantity });
            if (result.status === 'success') {
                return res.status(200).json({ status: 'success', msg: 'Added successfully' });
            }
            return res.status(500).json({ msg: "Error adding to cart" });
        }
        catch (error) {
            console.log("Error adding to cart:", error);
            return res.status(500).json({ status: 'error', msg: "Server error" });
        }
    }

    async mergeCartAfterLogin(req, res) {
        try {
            const { localCart } = req.body;
            const accessToken = req.cookies.accessToken;

            if (!accessToken) {
                return res.json({ status: "error", msg: "Not authenticated" });
            }

            const token = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
            const result = await CartService.mergeCart({ userID: token.userID, localCart });
            
            return res.status(200).json(result);
        } catch (error) {
            console.log("Error merging cart:", error);
            return res.status(500).json({ status: 'error', msg: "Server error" });
        }
    }

    async removeProductFromCart(req, res) {
        const { productId } = req.body;
        const accessToken = req.cookies.accessToken;
        const token = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
        try {
            const result = await CartService.removeProductFromCart({ userID: token.userID, productID: productId });
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
            const result = await CartService.updateProductInCart({ userID: token.userID, productID: productId, quantity });
            if (result.status === 'success') {
                return res.status(200).json({ status: 'success', message: "Product updated in cart" });
            }
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
            const result = await CartService.getCart(token.userID);
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