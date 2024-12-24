const Category = require('../schema/Category');

class CategoryService {
    async getAllCategories() {
        try {
            const categories = await Category.find();
            if (!categories) {
                return {
                    status: 'error',
                    message: 'No categories found',
                }
            }
            return {
                status: 'success',
                message: 'Categories fetched successfully',
                data: categories,
            }

        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new CategoryService;