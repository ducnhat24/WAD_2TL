const express = require('express');
const productRouter = express.Router();
const ProductController = require('../controller/ProductController');

productRouter.get('/:id', ProductController.showProductDetails);
productRouter.get('/', ProductController.showProducts);

module.exports = productRouter;

