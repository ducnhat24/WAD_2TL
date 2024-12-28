const express = require('express');
const customerAPIRoute = express.Router();
const { verifyToken } = require('../../../middleware/JWTAction');
const CustomerController = require('../controller/CustomerController');
const CartController = require('../controller/CartController');

customerAPIRoute.post('/signup', CustomerController.addUser);
customerAPIRoute.post('/login', CustomerController.login);
customerAPIRoute.post('/logout', CustomerController.logout);
customerAPIRoute.post('/authentication', verifyToken, CustomerController.auth);

customerAPIRoute.get('/cart', CartController.getCart);
customerAPIRoute.post('/cart', CartController.addProductToCart);
customerAPIRoute.put('/cart', CartController.updateProductInCart);
customerAPIRoute.delete('/cart', CartController.removeProductFromCart);

module.exports = customerAPIRoute;