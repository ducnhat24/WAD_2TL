const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    productPrice: {
        type: Number, // Using Number instead of BigInt for compatibility
        required: true,
    },
    productDescription: {
        type: String,
        required: false,
    },
    productBrand: {
        type: String,
        required: true,
    },
    productDescription: {
        type: String,
        required: true,
    },
    productYear: {
        type: Number,
        required: true,
    },
    productMainImage: {
        type: String,
        required: true,
    },
    productUpdatedDateTime: {
        type: Date,
        default: new Date(),
    },
    productRelatedImages: {
        type: Array,
        required: false,
    },
    productQuantity: {
        type: Number,
        required: true,
    },
    productMadeIn: {
        type: String,
        required: false,
    },
    productDetailInformation: {
        productMaterial: {
            type: String,
            required: false,
        },
        productSize: {
            type: String,
            required: false,
        },
    },
    productStatus: {
        type: String,
        required: true,
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
