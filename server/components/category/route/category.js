const express = require('express');
const categoryRoute = express.Router();
const CategoryController = require('../controller/CategoryController');

categoryRoute.get('/', CategoryController.getAllCategories);


module.exports = categoryRoute;