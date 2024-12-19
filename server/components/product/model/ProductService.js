const Product = require("../../../schemas/Product");

class ProductService {

    async getAllProducts() {
        try {
            const products = await Product.find();
            if (products) {
                return {
                    status: "success",
                    msg: "Products fetched successfully",
                    data: products
                }
            }

            return {
                status: "error",
                msg: "No product",
            }
        }
        catch (error) {
            console.error(error);
            return {
                status: "error",
                msg: error.message,
            }
        }
    }

    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            if (product) {
                return {
                    status: "success",
                    msg: "Product fetched successfully",
                    data: product,
                }
            }
            return {
                status: "error",
                msg: "Not found product",
            }

        } catch (error) {
            return {
                status: "error",
                msg: error.message,
            }
        }
    }

    async getAllBrands() {
        try {
            const brands = await Product.find().distinct('brand');
            if (brands) {
                return {
                    status: "success",
                    msg: "Brands fetched successfully",
                    data: brands
                }
            }

            return {
                status: "error",
                msg: "No brand",
            }
        } catch (error) {
            console.error(error);
            return {
                status: "error",
                msg: error.message,
            }
        }
    }

    async getAllModels() {
        try {
            const models = await Product.find().distinct('model');
            if (models) {
                return {
                    status: "success",
                    msg: "Models fetched successfully",
                    data: models
                }
            }
            return {
                status: "error",
                msg: "No model",
            }
        } catch (error) {
            return {
                status: "error",
                msg: error.message,
            }
        }
    }

    async searchProducts(keysearch, page, limit) {
        try {
            // Calculate skip value for pagination
            const skip = (page - 1) * limit;

            // Get total count
            const totalProducts = await Product.countDocuments({
                $or: [
                    { name: { $regex: keysearch, $options: 'i' } },
                    { description: { $regex: keysearch, $options: 'i' } }
                ]
            });

            // Get paginated results
            const products = await Product.find({
                $or: [
                    { name: { $regex: keysearch, $options: 'i' } },
                    { description: { $regex: keysearch, $options: 'i' } }
                ]
            })
            .skip(skip)
            .limit(limit);

            return {
                totalProducts,
                products
            };
        } catch (error) {
            throw error;
        }
    }

    // async searchProduct(query) {

    //     try {
    //         const products = await Product.find({
    //             $or: [
    //                 { name: { $regex: query, $options: 'i' } },
    //                 { description: { $regex: query, $options: 'i' } },
    //                 { brand: { $regex: query, $options: 'i' } },
    //                 { model: { $regex: query, $options: 'i' } }
    //             ]
    //         });
    //         return products;
    //     } catch (error) {
    //         console.error(error);
    //         throw new Error("An error occurred while searching for products");
    //     }
    // }

    async getSameProduct(product) {
        try {
            const { _id, brand, model } = product;
            const allSameProducts = await Product.find({ model });
            const sameProducts = allSameProducts.filter((p) => !p._id.equals(_id));
            if (sameProducts.length > 3) {
                return sameProducts.slice(0, 3);
            }
            return sameProducts;
        }
        catch (error) {
            console.error(error);
            throw new Error("An error occurred while fetching similar products");
        }
    }

    // async filterProduct(query) {
    //     try {
    //         console.log(query)
    //         const brandArray = query.brands ? query.brands.split(",") : [];
    //         const modelArray = query.models ? query.models.split(",") : [];
    //         const sortBy = query.sortby;
    //         const sortType = query.sorttype;
    //         let products = await Product.find();
    //         // console.log("-----------------------")
    //         // products.map((product) => {
    //         //     console.log(product._id + ": " + product.price)
    //         // })
    //         // console.log("-----------------------")
    //         if (products) {
    //             if (brandArray.length > 0) {
    //                 products = products.filter((product) => brandArray.includes(product.brand));
    //             }

    //             if (modelArray.length > 0) {
    //                 products = products.filter((product) => modelArray.includes(product.model));
    //             }

    //             if (sortBy && sortType) {
    //                 // console.log("Access sortBy sortType")
    //                 if (sortType === "asc") {
    //                     products.sort((a, b) => (a[sortBy] > b[sortBy]) ? 1 : -1);
    //                 } else {
    //                     products.sort((a, b) => (a[sortBy] < b[sortBy]) ? 1 : -1);
    //                 }
    //             }
    //             return {
    //                 status: "success",
    //                 message: "Filter successfully",
    //                 data: products,
    //             }

    //         } else {
    //             return {
    //                 status: "error",
    //                 message: "Unavailable product",
    //             }
    //         }
    //     } catch (error) {
    //         return {
    //             status: "error",
    //             message: error.message,
    //         }

    //     }
    // }

    async filterProduct(query) {
        try {
            console.log("Product Service:");
            console.log(query);
            const brandArray = query.brands;
            const modelArray = query.models;
            const sortBy = query.sortBy;
            const sortType = query.sortType;

            let products = await Product.find();
    
            if (products) {
                if (brandArray.length > 0) {
                    products = products.filter((product) => brandArray.includes(product.brand));
                }
    
                if (modelArray.length > 0) {
                    products = products.filter((product) => modelArray.includes(product.model));
                }
    
                if (sortBy && sortType) {
                    if (sortType === "asc") {
                        products.sort((a, b) => (a[sortBy] > b[sortBy]) ? 1 : -1);
                    } else {
                        products.sort((a, b) => (a[sortBy] < b[sortBy]) ? 1 : -1);
                    }
                }
                return {
                    status: "success",
                    message: "Filter successfully",
                    data: products,
                }
            } else {
                return {
                    status: "error",
                    message: "Unavailable product",
                }
            }
        } catch (error) {
            return {
                status: "error",
                message: error.message,
            }
        }
    }
}

module.exports = ProductService;