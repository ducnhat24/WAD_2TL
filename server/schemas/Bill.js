const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
    orderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    billCreatedDateTime: {
        type: Date,
        default: new Date(),
    },
    billTotalPrice: {
        type: Number,
        required: true,
    },
});

const Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;
