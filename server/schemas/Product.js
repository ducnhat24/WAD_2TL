const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number, // Using Number instead of BigInt for compatibility
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    madeIn: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    diameter: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    updateDate: {
      type: Date,
      default: Date.now,
    },
    createDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically handles createdAt and updatedAt
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
