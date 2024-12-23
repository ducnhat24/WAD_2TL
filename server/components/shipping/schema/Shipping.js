const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema({
    shippingName: {
        type: String,
        required: true,
    },
    shippingDescription: {
        type: String,
        required: true,
    },
    shippingFee: {
        type: Number,
        required: true,
    },
});

const Shipping = mongoose.model("Shipping", shippingSchema);

module.exports = Shipping;
