const express = require('express');
const customerRoute = express.Router();
const { verifyToken } = require('../../../middleware/JWTAction');
const CustomerController = require('../controller/CustomerController');
const CartController = require('../controller/CartController');
const OrderController = require('../controller/OrderController');

customerRoute.get('/', verifyToken, CustomerController.showProfile);
customerRoute.get('/signup', CustomerController.showSignup);
customerRoute.get('/login', CustomerController.showLogin);
customerRoute.get('/cart', CartController.showCart);
customerRoute.get('/order', OrderController.showOrder);

module.exports = customerRoute;