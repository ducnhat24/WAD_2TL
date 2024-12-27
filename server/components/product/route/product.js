const express = require('express');
const productRouter = express.Router();
const ProductController = require('../controller/ProductController');

productRouter.get('/category', ProductController.getProductsGroupByCategory);
productRouter.post('/search', ProductController.searchProduct);
productRouter.get('/filter', ProductController.filterProduct);
// productRouter.get('/someproduct', ProductController.getSomeProduct);
// productRouter.post('/filter', ProductController.filterProduct);
productRouter.post('/limitation', ProductController.getSomeProduct);
productRouter.put('/:id', ProductController.updateProduct);
productRouter.get('/:id', ProductController.getProductDetails);
productRouter.post('/', ProductController.addProduct);
productRouter.get('/', ProductController.getProduct);
module.exports = productRouter;

