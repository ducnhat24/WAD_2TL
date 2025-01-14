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

    async addCategory(req, res) {
        try {
            const data = req.body;
            const category = await CategoryService.addCategory(data);
            if (category.status === 'success') {
                res.status(200).json(category);
                return;
            }
            res.status(400).json(category);
            return;
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const category = await CategoryService.deleteCategory(id);
            if (category.status === 'success') {
                res.status(200).json(category);
                return;
            }
            res.status(400).json(category);
            return;
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateActivation(req, res) {
        try {
            const { id } = req.params;
            const category = await CategoryService.updateActivation(id);
            if (category.status === 'success') {
                res.status(200).json(category);
                return;
            }
            res.status(400).json(category);
            return;
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new CategoryController;