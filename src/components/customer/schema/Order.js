const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const orderSchema = new mongoose.Schema({
    customerID: {
        type: Schema.Types.ObjectId,
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
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                default: 0,
                required: true,
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
        type: Schema.Types.ObjectId,
        ref: 'Shipping',
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
    orderShipper: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
        default: null,
    }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
