const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    orderCreatedDateTime: {
        type: Date,
        default: new Date(),
    },
    orderListProduct: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
                default: 0,
            },
            productPrice: {
                type: Number,
                required: true,
            }
        },
    ],
    orderShippingAddress: {
        type: String,
        required: true,
    },
    orderShippingMethod: {
        type: String,
        required: true,
    },
    orderShippingFee: {
        type: Number,
        required: true,
    },
    orderTotalPrice: {
        type: Number,
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
    },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
