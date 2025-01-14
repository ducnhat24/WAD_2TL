const express = require('express');
const brandAPIRoute = express.Router();
const BrandController = require('../controller/BrandController');

brandAPIRoute.put('/activation/:id', BrandController.updateActivation);
brandAPIRoute.delete('/:id', BrandController.deleteBrand);
brandAPIRoute.post('/', BrandController.addBrand);
brandAPIRoute.get('/', BrandController.getAllBrands);


module.exports = brandAPIRoute;