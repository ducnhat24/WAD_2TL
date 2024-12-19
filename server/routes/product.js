const express = require('express');
const productRouter = express.Router();
const { verifyToken } = require('../middleware/JWTAction');
const ProductController = require('../components/product/controllers/ProductController');

productRouter.get('/brands', ProductController.getAllBrands);
productRouter.get('/models', ProductController.getAllModels);
productRouter.post('/search', ProductController.searchProduct);
productRouter.get('/filter', ProductController.filterProduct);
// productRouter.get('/someproduct', ProductController.getSomeProduct);
productRouter.post('/filter', ProductController.filterProduct);
productRouter.post('/', ProductController.getSomeProduct);
productRouter.get('/:id', ProductController.getProductDetails);
productRouter.get('/', ProductController.getProduct);
module.exports = productRouter;

