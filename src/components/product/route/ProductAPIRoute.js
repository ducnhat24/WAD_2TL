const express = require('express');
const productAPIRouter = express.Router();
const ProductController = require('../controller/ProductController');

productAPIRouter.get('/category', ProductController.getProductsGroupByCategory);
productAPIRouter.post('/search', ProductController.searchProduct);
// productAPIRouter.get('/filter', ProductController.filterProduct);
// productAPIRouter.get('/someproduct', ProductController.getSomeProduct);
productAPIRouter.get('/filter', ProductController.filterProduct);
productAPIRouter.post('/limitation', ProductController.getSomeProduct);
productAPIRouter.delete('/:id', ProductController.deleteProduct);
productAPIRouter.put('/:id', ProductController.updateProduct);
productAPIRouter.get('/:id', ProductController.getProductDetails);
productAPIRouter.post('/', ProductController.addProduct);
productAPIRouter.get('/', ProductController.getProduct);
// Lấy danh sách review
productAPIRouter.get('/:id/reviews', ProductController.getReviews);
// Thêm review
productAPIRouter.post('/:id/reviews', ProductController.createReview);


module.exports = productAPIRouter;

