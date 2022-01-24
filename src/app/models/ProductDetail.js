const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductDetail = new Schema({
    productId: String,
    branch: String,
    originCountry: String,
    ortherInfo: String,
}, {
    timestamps: true,
    collection: 'productdetail'
});

module.exports = mongoose.model('ProductDetail', ProductDetail);