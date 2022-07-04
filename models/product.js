const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String },
    price: { type: Number },
    title: { type: String },
    sellerName: { type: String },
    quantity: { type: String },
    description: { type: String },
    image: { type: String },
    isDeleted: { type: Boolean, default: "false" },
    deletedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
