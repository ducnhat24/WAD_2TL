const ProductService = require("../model/ProductService");

// const { multipleMongooseToObject, mongooseToObject } = require('../utils/mongoose');
class ProductController {
  async showProducts(req, res) {
    try {
      const products = await ProductService.getAllProducts();
      res.render("product", { products: products.data });
    } catch (error) {
      console.error(error);
    }
  }

  async showProductDetails(req, res) {
    try {
      const id = req.params.id;
      const value = await ProductService.getProductById(id);
      const sameProducts = await ProductService.getSameProduct({
        brand: value.data[0].productBrand,
        category: value.data[0].productCategory,
        _id: value.data[0]._id, // Pass the original product's ID to exclude it
      });

      if (value.status === "success") {
        // console.log(sameProducts);
        // res.render('product_details', { product: value.data[0] });
        res.render("product_details", {
          product: value.data[0],
          sameProducts: sameProducts,
        });
      } else {
        console.log(value.message);
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  async getProduct(req, res) {
    try {
      const value = await ProductService.getAllProducts();
      res.json(value);
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: error.message,
      };
    }
  }

  async getProductDetails(req, res) {
    const productId = req.params.id;
    try {
      const product = await ProductService.getProductById(productId);
      res.json(product);
    } catch (error) {
      return {
        status: "error",
        message: error.message,
      };
    }
  }

  // async searchProduct(req, res) {
  //     // console.log("Request body:", req.body);

  //     const { keysearch, page = 1, limit = 5 } = req.body;

  //     if (!keysearch) {
  //         return res.status(400).json({
  //             status: "error",
  //             msg: "Search query is required"
  //         });
  //     }

  //     try {
  //         // Get total count and products from service
  //         const { totalProducts, products } = await ProductService.searchProducts(keysearch, page, limit);

  //         // Calculate total pages
  //         const totalPages = Math.ceil(totalProducts / limit);

  //         res.json({
  //             status: "success",
  //             totalPages,
  //             item: products,
  //             currentPage: page,
  //             totalItems: totalProducts
  //         });
  //     } catch (error) {
  //         console.error(error);
  //         res.status(500).json({
  //             status: "error",
  //             msg: "An error occurred while searching for products"
  //         });
  //     }
  // }

  // ProductController.js
  async searchProduct(req, res) {
    const { keysearch, page = 1, limit = 5 } = req.body;

    if (!keysearch) {
      return res.status(400).json({
        status: "error",
        msg: "Search query is required",
      });
    }

    try {
      // Get all matching products from service
      const products = await ProductService.searchProducts(keysearch);

      // Apply pagination in the controller
      const totalProducts = products.length;
      const totalPages = Math.ceil(totalProducts / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const productsToDisplay = products.slice(startIndex, endIndex);

      res.json({
        status: "success",
        totalPages,
        item: productsToDisplay,
        currentPage: page,
        totalItems: totalProducts,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        msg: "An error occurred while searching for products",
      });
    }
  }

  async filterProduct(req, res) {
    try {
      const { page, limit, brands, categories, sortType, sortBy, keySearch } =
        req.query;
      const query = {
        brands: brands,
        categories: categories,
        sortType: sortType,
        sortBy: sortBy,
        keySearch: keySearch,
      };

      const products = await ProductService.filterProduct(query);
      if (!page) {
        res.json(products);
        return;
      }

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

  // async getSomeProduct(req, res) {
  //     try {
  //         const page = parseInt(req.body.page) || 1;
  //         const limit = parseInt(req.body.limit) || 1;
  //         const startIndex = (page - 1) * limit;
  //         const endIndex = page * limit;

  //         const allProducts = await ProductService.getAllProducts();

  //         const productToDisplay = allProducts.data.slice(startIndex, endIndex);
  //         console.log('current page:', page);
  //         console.log('total pages:', Math.ceil(allProducts.data.length / limit));

  //         res.json({
  //             currentPage: page,
  //             totalPages: Math.ceil(allProducts.data.length / limit),
  //             item: productToDisplay,
  //         });

  //     } catch (error) {
  //         console.error(error);
  //         res.status(500).send("An error occurred while fetching products");
  //     }
  // }

  async getSomeProduct(req, res) {
    try {
      // Extract page, limit, and filters from the request body
      const {
        page = 1,
        limit = 5,
        searchQuery = "",
        selectedBrands = [],
        selectedCategories = [],
        selectedSort = "",
      } = req.body;

      // Parse page and limit
      const currentPage = parseInt(page) || 1;
      const itemsPerPage = parseInt(limit) || 5;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = currentPage * itemsPerPage;

      // Fetch all products
      let products = await ProductService.getAllProducts();
      let allProducts = products.data;

      // Apply search query filter if provided
      if (searchQuery) {
        allProducts = allProducts.data.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        );
      }

      // Apply brand filter if selected
      if (selectedBrands.length > 0) {
        allProducts = allProducts.filter((product) =>
          selectedBrands.includes(product.brand)
        );
      }

      // Apply category filter if selected
      if (selectedCategories.length > 0) {
        allProducts = allProducts.filter((product) =>
          selectedCategories.includes(product.category)
        );
      }

      // Apply sort if selected
      if (selectedSort === "asc") {
        allProducts = allProducts.sort((a, b) => a.name.localeCompare(b.name)); // Sorting in ascending order
      } else if (selectedSort === "desc") {
        allProducts = allProducts.sort((a, b) => b.name.localeCompare(a.name)); // Sorting in descending order
      }

      // Paginate the products
      const productToDisplay = allProducts.slice(startIndex, endIndex);

      // Calculate total pages
      const totalPages = Math.ceil(allProducts.length / itemsPerPage);

      console.log("Current page:", currentPage);
      console.log("Total pages:", totalPages);

      // Send the response
      res.json({
        currentPage: currentPage,
        totalPages: totalPages,
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
      if (newProduct.status === "success") {
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
      const updatedProduct = await ProductService.updateProduct(
        productId,
        product
      );
      if (updatedProduct.status === "success") {
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


    async getReviews(req, res) {
        try {
            const productId = req.params.id;
            console.log("Product ID:", productId);
            const reviews = await ProductService.getProductReviews(productId);

            if (reviews.status === "success") {
                return res.status(200).json(reviews.data);
            } else {
                return res.status(404).json({ message: "No reviews found" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // Tạo review mới
    async createReview(req, res) {
        const productId = req.params.id;
        const {customerID, productReviewContent, productReviewRating } = req.body;

        if (!productReviewContent || !productReviewRating) {
            return res.status(400).json({ msg: 'Review content and rating are required' });
        }

        try {
            const result = await ProductService.addReview(productId, {
                productReviewContent,
                productReviewRating,
                customerID: customerID,
            });

            if (result) {
                res.status(200).json({ msg: 'Review added successfully' });
            } else {
                res.status(404).json({ msg: 'Product not found' });
            }
        } catch (error) {
            console.error('Error creating review:', error);
            res.status(500).json({ msg: 'Server error' });
        }
    }

    

}


module.exports = new ProductController();
