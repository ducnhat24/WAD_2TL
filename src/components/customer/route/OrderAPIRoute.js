const express = require('express');
const orderAPIRoute = express.Router();
const OrderController = require('../controller/OrderController');


orderAPIRoute.get('/shipping-methods', OrderController.getShippingMethods);
orderAPIRoute.post('/update-shipping', OrderController.updateShipping);
orderAPIRoute.post('/update-status', OrderController.updateStatusOrder);
module.exports = orderAPIRoute;