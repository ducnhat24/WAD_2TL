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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true,
    },
    productYear: {
        type: Number,
        default: new Date().getFullYear(),
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
    },
    productCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    productReviews: {
        customerID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: false,
            default: null,
        },
        productReviewContent: {
            type: String,
            required: false,
            default: "",
        },
        productReviewRating: {
            type: Number,
            required: false,
            default: 0,
        },
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
