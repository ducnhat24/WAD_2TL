// const productRouter = require("../../../../server/routes/product");
const ProductDetailsService = require("../models/product_details_service");

class ProductDetailsController {
    async showProductDetails(req, res) {
        try {
            const id = req.params.id;
            const value = await ProductDetailsService.getProductDetails(id);
            const sameProducts = await ProductDetailsService.getSameProducts(value.data.brandName, value.data.categoryName);
            if (value.status === 'success') {
                // res.render('product_details', { product: value.data[0] });   
                res.render('product_details', { product: value.data[0], sameProducts: sameProducts });   

            } else {
                console.log(value.message);
            }
        } catch (err) {
            console.log(err.message)
        }
    }
}

module.exports = new ProductDetailsController;