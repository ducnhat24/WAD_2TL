const Product = require("../schema/Product");

class ProductService {
    async getAllProducts() {
        try {
            const products = await Product.find();
            // console.log(products);
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
            const product = await Product.find({ _id: id });
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

    // async searchProducts(keysearch, page, limit) {
    //     try {
    //         // Calculate skip value for pagination
    //         const skip = (page - 1) * limit;
    //         // console.log(keysearch);
    //         // Get total count
    //         const totalProducts = await Product.countDocuments({
    //             $or: [
    //                 { productName: { $regex: keysearch, $options: 'i' } },
    //                 { productDescription: { $regex: keysearch, $options: 'i' } }
    //             ]
    //         });
    //         // console.log(totalProducts);

    //         // Get paginated results
    //         const products = await Product.find({
    //             $or: [
    //                 { productName: { $regex: keysearch, $options: 'i' } },
    //                 { productDescription: { $regex: keysearch, $options: 'i' } },
    //                 // { productBrand: { $regex: keysearch, $options: 'i' } },
    //                 // { productMaterial: { $regex: keysearch, $options: 'i' } }
    //             ]
    //         })
    //             .skip(skip)
    //             .limit(limit);

    //         return {
    //             totalProducts,
    //             products
    //         };
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async getSameProduct(product) {
    //     try {
    //         const { brand, category } = product;
    //         const sameProducts = await ProductService.getSameProduct({
    //             brand: value.data.brandName,
    //             category: value.data.categoryName,
    //             _id: value.data._id, // Pass the original product's ID to exclude it
    //         });
    //         if (sameProducts.length > 3) {
    //             return sameProducts.slice(0, 3);
    //         }
    //         return sameProducts;
    //     }
    //     catch (error) {
    //         console.error(error);
    //         throw new Error("An error occurred while fetching similar products");
    //     }
    // }
    async getSameProduct(product) {
        try {
            const { brand, category, _id } = product;

            // Fetch all products with the same brand and category
            const allSameProducts = await Product.find({
                $or: [
                    { productBrand: brand },
                    { productCategory: category }
                ]
            });

            // Exclude the original product
            const filteredProducts = allSameProducts.filter((p) => !p._id.equals(_id));
            // Limit the number of returned products to 3
            if (filteredProducts.length > 3) {
                return filteredProducts.slice(0, 3);
            }

            return filteredProducts;
        } catch (error) {
            console.error(error);
            throw new Error("An error occurred while fetching similar products");
        }
    }


    async searchProducts(keysearch) {
        try {
            // Get all matching products without pagination
            const products = await Product.find({
                $or: [
                    { productName: { $regex: keysearch, $options: 'i' } },
                    { productDescription: { $regex: keysearch, $options: 'i' } }
                ]
            });

            return products;
        } catch (error) {
            throw error;
        }
    }


    async filterProduct(query) {
        try {
            const brandArray = query.brands || [];
            const categoryArray = query.categories || [];
            const sortBy = query.sortBy;
            const sortType = query.sortType;

            // console.log(query);

            const allProducts = await Product.find();

            if (allProducts && allProducts.length > 0) {
                let filteredByBrand = allProducts;

                // Filter by brand
                if (brandArray.length > 0) {
                    filteredByBrand = allProducts.filter((product) =>
                        brandArray.includes(product.productBrand.toString())
                    );
                }

                let filteredByCategory = filteredByBrand;

                // Filter by category
                if (categoryArray.length > 0) {
                    filteredByCategory = filteredByBrand.filter((product) =>
                        categoryArray.includes(product.productCategory.toString())
                    );
                }

                let searchResult = filteredByCategory;
                if (query.keySearch && query.keySearch !== "") {
                    searchResult = filteredByCategory.filter((product) =>
                        product.productName.toLowerCase().includes(query.keySearch.toLowerCase()) ||
                        product.productDescription.toLowerCase().includes(query.keySearch.toLowerCase())
                    );

                }

                let sortedProducts = searchResult;

                // Sort by field
                if (sortBy && sortType) {
                    sortedProducts = [...filteredByCategory].sort((a, b) => {
                        if (sortType === "asc") {
                            return a[sortBy] > b[sortBy] ? 1 : -1;
                        } else {
                            return a[sortBy] < b[sortBy] ? 1 : -1;
                        }
                    });
                }

                // console.log(sortedProducts);
                return {
                    status: "success",
                    message: "Filter successfully",
                    data: sortedProducts,
                };
            } else {
                return {
                    status: "error",
                    message: "Unavailable product",
                };
            }
        } catch (error) {
            return {
                status: "error",
                message: error.message,
            };
        }
    }

    // async filterProduct(query) {
    //     try {
    //         console.log("Product Service:");
    //         console.log(query);
    //         const brandArray = query.brands;
    //         const originArray = query.origins;
    //         const sortBy = query.sortBy;
    //         const sortType = query.sortType;

    //         let products = await Product.find();


    //         if (products) {
    //             if (brandArray.length > 0) {
    //                 products = products.filter((product) => brandArray.includes(product.productBrand));
    //             }

    //             if (originArray.length > 0) {
    //                 products = products.filter((product) => originArray.includes(product.productMadeIn));
    //             }

    //             if (sortBy && sortType) {
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

    async addProduct(product) {
        try {
            const findProduct = await Product.findOne({ productName: product.productName, productBrand: product.productBrand });
            if (!findProduct) {
                const newProduct = new Product({
                    productName: product.productName,
                    productBrand: product.productBrand,
                    productDescription: product.productDescription,
                    productPrice: product.productPrice,
                    productDetailInformation: {
                        productMaterial: product.productMaterial,
                        productSize: product.productColor,
                    },
                    productMainImage: product.productMainImage,
                    productRelatedImages: product.productRelatedImages,
                    productQuantity: product.productQuantity,
                    productCategory: product.productCategory,
                    productStatus: product.productStatus,
                });
                await newProduct.save();
                return {
                    status: "success",
                    message: "Product added successfully",
                }
            }

            findProduct.productQuantity = Number(findProduct.productQuantity) + Number(product.productQuantity);
            await findProduct.save();
            return {
                status: "success",
                message: "Product updated successfully",
            }

        } catch (error) {
            return {
                status: "error",
                message: error.message,
            }
        }
    }



    async updateProduct(productId, product) {
        try {
            const findProduct = await Product.findOne({ _id: productId });
            if (findProduct) {
                findProduct.productName = product.productName;
                findProduct.productBrand = product.productBrand;
                findProduct.productDescription = product.productDescription;
                findProduct.productPrice = product.productPrice;
                findProduct.productDetailInformation = {
                    productMaterial: product.productMaterial,
                    productSize: product.productColor,
                };
                findProduct.productMainImage = product.productMainImage;
                findProduct.productRelatedImages = product.productRelatedImages;
                findProduct.productQuantity = product.productQuantity;
                findProduct.productCategory = product.productCategory;
                findProduct.productStatus = product.productStatus;
                await findProduct.save();
                return {
                    status: "success",
                    message: "Product updated successfully",
                }
            }
            return {
                status: "error",
                message: "Product not found",
            }
        } catch (error) {
            return {
                status: "error",
                message: error.message,
            }
        }
    }

    async getProductsGroupByCategory() {
        try {
            const products = await Product.aggregate([
                {
                    $group: {
                        _id: "$productCategory",
                        products: { $push: "$$ROOT" }
                    }
                }
            ]);
            if (!products) {
                return {
                    status: "error",
                    message: "No product",
                }
            }
            return {
                status: "success",
                message: "Products fetched successfully",
                data: products,
            };
        } catch (error) {
            console.error(error);
            return {
                status: "error",
                message: error.message,
            }
        }
    }

    async discontinuedProduct(brandID) {
        try {
            const products = await Product.find({ productBrand: brandID });
            if (products) {
                products.forEach(async (product) => {
                    product.productStatus = "Discontinued";
                    await product.save();
                });
                return {
                    status: "success",
                    message: "Discontinued product successfully",
                }
            }
            return {
                status: "error",
                message: "No product",
            }
        } catch (error) {
            return {
                status: "error",
                message: error.message,
            }
        }
    }
}

module.exports = new ProductService;