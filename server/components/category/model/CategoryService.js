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

    async addCategory(data) {
        try {
            const category = new Category({
                categoryName: data.categoryName,
                categorySub: data.categorySub ? data.categorySub : null,
                categoryImage: data.categoryImage,
                categoryDescription: data.categoryDescription,
            });
            await category.save();
            return {
                status: 'success',
                message: 'Category added successfully',
                data: category,
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteCategory(id) {
        try {
            const category = await Category.deleteOne({ _id: id });
            if (!category) {
                return {
                    status: 'error',
                    message: 'Category not found',
                }
            }
            return {
                status: 'success',
                message: 'Category deleted successfully',
            }
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }
    }
}

module.exports = new CategoryService;