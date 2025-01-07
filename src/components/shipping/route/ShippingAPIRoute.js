const express = require('express');
const shippingAPIRoute = express.Router();
const ShippingController = require('../controller/ShippingController');

shippingAPIRoute.get('/', ShippingController.getAllShipping);

module.exports = shippingAPIRoute;