const express = require('express');
const categoryAPIRoute = express.Router();
const CategoryController = require('../controller/CategoryController');

categoryAPIRoute.delete('/:id', CategoryController.deleteCategory);
categoryAPIRoute.post('/', CategoryController.addCategory);
categoryAPIRoute.get('/', CategoryController.getAllCategories);


module.exports = categoryAPIRoute;