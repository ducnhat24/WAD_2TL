const express = require('express');
const brandRoute = express.Router();
const BrandController = require('../controller/BrandController');

brandRoute.get('/', BrandController.getAllBrands);


module.exports = brandRoute;