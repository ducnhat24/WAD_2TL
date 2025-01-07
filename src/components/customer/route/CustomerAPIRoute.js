const express = require('express');
const customerAPIRoute = express.Router();
const { verifyToken } = require('../../../middleware/JWTAction');
const CustomerController = require('../controller/CustomerController');
const CartController = require('../controller/CartController');
const { authenticateGoogle, handleGoogleCallback } = require('../../../middleware/GoogleOAuth');
const OrderController = require('../controller/OrderController');
const OrderAPIRoute = require('./OrderAPIRoute');

customerAPIRoute.put('/cart', verifyToken, CartController.updateProductInCart);
customerAPIRoute.delete('/cart', CartController.removeProductFromCart);
customerAPIRoute.post('/cart', CartController.addProductToCart);
customerAPIRoute.get('/cart', CartController.getCart);

customerAPIRoute.get('/filter', CustomerController.filterUser);
customerAPIRoute.put('/:id', CustomerController.updateStatusAccountUser);
customerAPIRoute.get('/', CustomerController.getAllUsers);
customerAPIRoute.get('/auth/google', authenticateGoogle);
customerAPIRoute.get('/auth/google/callback', handleGoogleCallback);
customerAPIRoute.post('/signup', CustomerController.addUser);
customerAPIRoute.post('/login', CustomerController.login);
customerAPIRoute.post('/logout', CustomerController.logout);
customerAPIRoute.post('/authentication', verifyToken, CustomerController.auth);

customerAPIRoute.use('/order', OrderAPIRoute);

module.exports = customerAPIRoute;