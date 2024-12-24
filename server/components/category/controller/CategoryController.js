const CategoryService = require('../model/CategoryService');

class CategoryController {
    async getAllCategories(req, res) {
        try {
            const categories = await CategoryService.getAllCategories();
            if (categories.status === 'success') {
                res.status(200).json(categories);
                return;
            }
            res.status(404).json(categories);
            return;
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new CategoryController;