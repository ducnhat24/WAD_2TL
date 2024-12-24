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
}

module.exports = new BrandController;