const ProductService = require('../model/ProductService');
const productService = new ProductService();
// const { multipleMongooseToObject, mongooseToObject } = require('../utils/mongoose');
class ProductController {

    async getProduct(req, res) {
        try {
            const value = await productService.getAllProducts();
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
            const product = await productService.getProductById(productId);
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
            const { totalProducts, products } = await productService.searchProducts(keysearch, page, limit);

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

            const products = await productService.filterProduct(query);
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

            const allProducts = await productService.getAllProducts();

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
            const newProduct = await productService.addProduct(product);
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
            const updatedProduct = await productService.updateProduct(productId, product);
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
            const products = await productService.getProductsGroupByCategory();
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

/*We wish you a merry Christmas
We wish you a merry Christmas
We wish you a merry Christmas
And a happy new year
We wish you a merry Christmas
We wish you a merry Christmas
We wish you a merry Christmas
And a happy new year
Good tidings we bring
To you and your kin
Good tidings for Christmas
And a happy new year
We wish you a merry Christmas
We wish you a merry Christmas
We wish you a merry Christmas
And a happy new year
Now bring us a figgy pudding
Now bring us a figgy pudding
Now bring us a figgy pudding
And bring some out here
Now bring us a figgy pudding
Now bring us a figgy pudding
Now bring us a figgy pudding
Then bring some out here
Good tidings we bring
To you and your kin
Good tidings for Christmas
And a happy new year
Now bring us a figgy pudding
Now bring us a figgy pudding
Now bring us a figgy pudding
And bring some out here
For we all like figgy pudding
For we all like figgy pudding
For we all like figgy pudding
So bring some out here
For we all like figgy pudding
For we all like figgy pudding
For we all like figgy pudding
So bring some out here
Good tidings we bring
To you and your kin
Good tidings for Christmas
And a happy new year
For we all like figgy pudding
For we all like figgy pudding
For we all like figgy pudding
So bring some out here
And we won't go until we got some
And we won't go until we got some
And we won't go until we got some
So bring some out here
And we won't go until we got some
And we won't go until we got some
And we won't go until we got some
So bring some out here
Good tidings we bring
To you and your kin
Good tidings for Christmas
And a happy new year
Good tidings for Christmas
And a happy new year */