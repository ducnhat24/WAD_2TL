const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
    brandName: {
        type: String,
        required: true,
    },
    brandDescription: {
        type: String,
        required: false,
    },
    brandImage: {
        type: String,
        required: false,
    },
    brandCountry: {
        type: String,
        required: false,
    },
    brandWebsite: {
        type: String,
        required: false,
    }
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
