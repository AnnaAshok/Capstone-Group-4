const mongoose = require("mongoose");

const PaymentModel = new mongoose.Schema({
    cardNumber: { type: Number, required: true},
    cvv: { type: Number, required: true },
    expiryDate: { type: Date, required:true },
    amount: { type: Number, required:true },
    },
    { timestamps: true });

module.exports = mongoose.model("payment", PaymentModel);