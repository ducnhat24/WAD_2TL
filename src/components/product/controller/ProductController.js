const ProductService = require('../model/ProductService');
// const { multipleMongooseToObject, mongooseToObject } = require('../utils/mongoose');
class ProductController {
    async showProducts(req, res) {
        try {
            const products = await ProductService.getAllProducts();
            res.render('product', { productItems: products.data });
        } catch (error) {
            console.error(error);
        }
    }

    async showProductDetails(req, res) {
        try {
            const id = req.params.id;
            const value = await ProductService.getProductById(id);
            if (value.status === 'success') {
                res.render('product_details', { product: value.data[0] });
            } else {
                console.log(value.message);
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    async getProduct(req, res) {
        try {
            const value = await ProductService.getAllProducts();
            res.json(value);
        }
        catch (error) {
            console.error(error);
            return {
                status: 'error',
                message: error.message,
            }
        }
    }

    async getProductDetails(req, res) {
        const productId = req.params.id;
        try {
            const product = await ProductService.getProductById(productId);
            res.json(product);
        } catch (error) {
            return {
                status: 'error',
                message: error.message,
            }
        }
    }

    async searchProduct(req, res) {
        console.log("Request body:", req.body);

        const { keysearch, page = 1, limit = 5 } = req.body;

        if (!keysearch) {
            return res.status(400).json({
                status: "error",
                msg: "Search query is required"
            });
        }

        try {
            // Get total count and products from service
            const { totalProducts, products } = await ProductService.searchProducts(keysearch, page, limit);

            // Calculate total pages
            const totalPages = Math.ceil(totalProducts / limit);

            res.json({
                status: "success",
                totalPages,
                item: products,
                currentPage: page,
                totalItems: totalProducts
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "error",
                msg: "An error occurred while searching for products"
            });
        }
    }

    async filterProduct(req, res) {
        try {
            const { page, limit, brands, origins, sortType, sortBy } = req.body;
            const query = {
                brands: brands,
                origins: origins,
                sortType: sortType,
                sortBy: sortBy
            };

            const products = await ProductService.filterProduct(query);
            const totalPages = Math.ceil(products.data.length / limit);
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const productToDisplay = products.data.slice(startIndex, endIndex);

            res.json({
                currentPage: page,
                totalPages: totalPages,
                item: productToDisplay,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while fetching products");
        }
    }

    async getSomeProduct(req, res) {
        try {
            console.log(req.body);
            const page = parseInt(req.body.page) || 1;
            const limit = parseInt(req.body.limit) || 1;
            console.log('Page:', page, 'Limit:', limit);
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            console.log('Start Index:', startIndex, 'End Index:', endIndex);

            const allProducts = await ProductService.getAllProducts();

            const productToDisplay = allProducts.data.slice(startIndex, endIndex);
            console.log('current page:', page);
            console.log('total pages:', Math.ceil(allProducts.data.length / limit));

            res.json({
                currentPage: page,
                totalPages: Math.ceil(allProducts.data.length / limit),
                item: productToDisplay,
            });

        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while fetching products");
        }
    }

    async addProduct(req, res) {
        try {
            const product = req.body;
            const newProduct = await ProductService.addProduct(product);
            if (newProduct.status === 'success') {
                res.status(201).json(newProduct);
                return;
            }
            res.status(400).json(newProduct);
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while adding product");
        }
    }

    async updateProduct(req, res) {
        try {
            const productId = req.params.id;
            const product = req.body;
            const updatedProduct = await ProductService.updateProduct(productId, product);
            if (updatedProduct.status === 'success') {
                res.status(201).json(updatedProduct);
                return;
            }
            res.status(400).json(updatedProduct);
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while updating product");
        }
    }

    async getProductsGroupByCategory(req, res) {
        try {
            const products = await ProductService.getProductsGroupByCategory();
            if (products.status !== 'success') {
                res.status(400).json(products);
                return;
            }
            res.status(200).json(products);
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while fetching products");
        }
    }
}

module.exports = new ProductController;
