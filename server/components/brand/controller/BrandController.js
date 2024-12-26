const BrandService = require('../model/BrandService');

class BrandController {
    async getAllBrands(req, res) {
        try {
            const brands = await BrandService.getAllBrands();
            if (brands.status === 'success') {
                res.status(200).json(brands);
                return;
            }
            res.status(404).json(brands);
            return;
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async addBrand(req, res) {
        try {
            const brand = req.body;
            const result = await BrandService.addBrand(brand);
            if (result.status === 'success') {
                res.status(200).json(result);
                return;
            }
            res.status(400).json(result);
            return;
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new BrandController;