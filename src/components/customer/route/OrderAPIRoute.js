const express = require('express');
const orderAPIRoute = express.Router();
const OrderController = require('../controller/OrderController');
const { verifyToken } = require('../../../middleware/JWTAction');


orderAPIRoute.post('/', OrderController.addOrder);
orderAPIRoute.get('/', verifyToken, OrderController.getOrders);
orderAPIRoute.get('/total-purchase', verifyToken, OrderController.getTotalPurchase);
orderAPIRoute.get('/total-purchase/list', verifyToken, OrderController.getTotalPurchaseByEachProduct);
orderAPIRoute.get('/list', verifyToken, OrderController.getAllOrders);

module.exports = orderAPIRoute;