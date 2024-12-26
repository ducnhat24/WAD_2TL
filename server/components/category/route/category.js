const express = require('express');
const categoryRoute = express.Router();
const CategoryController = require('../controller/CategoryController');

categoryRoute.delete('/:id', CategoryController.deleteCategory);
categoryRoute.post('/', CategoryController.addCategory);
categoryRoute.get('/', CategoryController.getAllCategories);


module.exports = categoryRoute;