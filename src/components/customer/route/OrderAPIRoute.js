const express = require('express');
const orderAPIRoute = express.Router();
const OrderController = require('../controller/OrderController');
const { verifyToken } = require('../../../middleware/JWTAction');


orderAPIRoute.post('/', OrderController.addOrder);
orderAPIRoute.get('/', verifyToken, OrderController.getOrders);

module.exports = orderAPIRoute;