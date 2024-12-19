const CustomerService = require('../model/CustomerService');
const jwt = require('jsonwebtoken');
const CartService = require('../model/CartService');

class CustomerController {
    async addUser(req, res) {
        const { username, email, password } = req.body;
        const status = await CustomerService.addUser({ username, email, password });
        res.json(status);
    }

    async getUsers(req, res) {
        const users = await CustomerService.getUsers();
        res.json(users);
    }

    async login(req, res) {
        const { useraccount, password } = req.body;
        const user = await CustomerService.login({ useraccount, password });
        const options = {
            sameSite: "none",
            secure: true,
        };
        res.cookie('accessToken', user.accessToken, options);
        res.cookie('refreshToken', user.refreshToken, options);
        res.json(user);
    }

    async logout(req, res) {
        const refreshToken = req.cookies.refreshToken;
        console.log(refreshToken);
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        const user = await CustomerService.logout(refreshToken);

        return res.json({
            status: 'success',
            msg: 'Logged out'
        });
    }

    async auth(req, res) {
        return res.json({
            status: 'success',
            user: req.user,
            msg: 'Authenticated'
        });

    }

    async addProductToCart(req, res) {
        try {
            const { productID, quantity } = req.body;
            const accessToken = req.cookies.accessToken;

            if (!accessToken) {
                return res.json({ status: "warning", msg: "Please login first!" });
            }

            const token = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
            const result = await CartService.addProductToCart({ userID: token.id, productID, quantity });
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
            const result = await CartService.removeProductFromCart({ userID: token.id, productID: productId });
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
            const result = await CartService.updateProductInCart({ userID: token.id, productID: productId, quantity });
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

            const result = await CartService.getCart(token.id);
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

module.exports = new CustomerController;