const Brand = require('../schema/Brand');

class BrandService {
    async getAllBrands() {
        try {
            const brands = await Brand.find();
            if (!brands) {
                return {
                    status: 'error',
                    message: 'No brands found',
                }
            }
            return {
                status: 'success',
                message: 'Brands fetched successfully',
                data: brands,
            }

        } catch (error) {
            return {
                status: 'error',
                message: error.message,
            }
        }
    }
}

module.exports = new BrandService;