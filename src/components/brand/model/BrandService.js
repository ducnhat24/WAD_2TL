const Brand = require('../schema/Brand');
const ProductService = require('../../product/model/ProductService');
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

    async addBrand(brand) {
        try {
            const newBrand = new Brand({
                brandName: brand.brandName,
                brandDescription: brand.brandDescription,
                brandImage: brand.brandImage,
                brandCountry: brand.brandCountry,
                brandWebsite: brand.brandWebsite,
            });
            const result = await newBrand.save();
            if (!result) {
                return {
                    status: 'error',
                    message: 'Failed to add brand',
                }
            }
            return {
                status: 'success',
                message: 'Brand added successfully',
                data: result,
            }
        } catch (error) {
            return {
                status: 'error',
                message: error.message,
            }
        }
    }

    async deleteBrand(id) {
        try {
            const result = await Brand.deleteOne({ _id: id });

            if (!result) {
                return {
                    status: 'error',
                    message: 'Failed to delete brand',
                }
            }

            const products = await ProductService.discontinuedProduct(id);
            if (products.status !== 'success') {
                return {
                    status: 'error',
                    message: 'Failed to delete brand',
                }
            }
            return {
                status: 'success',
                message: 'Brand deleted successfully',
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