const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
    },
    categorySub: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: false,
        default: null,
    },
    categoryImage: {
        type: String,
        required: false,
        default: '',
    },
    categoryDescription: {
        type: String,
        required: false,
        default: '',
    },
    categoryActive: {
        type: String,
        default: "Visible",
    },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
