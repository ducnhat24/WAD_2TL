const express = require('express');
const orderAPIRoute = express.Router();
const OrderController = require('../controller/OrderController');


orderAPIRoute.post('/', OrderController.addOrder);
orderAPIRoute.get('/', OrderController.getOrders);
module.exports = orderAPIRoute;