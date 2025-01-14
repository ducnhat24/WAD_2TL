const express = require('express');
const categoryAPIRoute = express.Router();
const CategoryController = require('../controller/CategoryController');

categoryAPIRoute.put('/activation/:id', CategoryController.updateActivation);
categoryAPIRoute.delete('/:id', CategoryController.deleteCategory);
categoryAPIRoute.post('/', CategoryController.addCategory);
categoryAPIRoute.get('/', CategoryController.getAllCategories);


module.exports = categoryAPIRoute;