const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Product = new Schema({
    name: { type: String },
    stock: { type: Number, default: 0 },
    originalPrice: { type: Number, default: 0 },
    salePrice: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    viewcount: { type: Number, default: 0 },
    image: { type: Object, default: { path: "", title: "" } },
    categoryId: {
        type: String,
        ref: "Category",
        default: ''
    },
    sold: { type: Number, default: 0 },
    shopId: { type: String, default: '' },
    shopName: { type: String, default: '' },
    branch: { type: String, default: '' },
    originCountry: { type: String, default: '' },
    otherInfo: { type: String, default: '' },
    isLock: { type: Boolean, default: false },
    notice: { type: String, default: '' }
}, {
    timestamps: true,
    strict: false
});

module.exports = mongoose.model('Product', Product);