const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ShopInfoTransaction = new Schema({
    shopId: String,
    momoSecretKey: String,
}, {
    timestamps: true,
    collection: 'shopinfotransaction'
});

module.exports = mongoose.model('ShopInfoTransaction', ShopInfoTransaction);