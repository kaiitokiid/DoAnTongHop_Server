const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Order = new Schema({
    username: { type: String },
    userId: { type: String },
    shopName: { type: String, default: 'VuTriShop' },
    shopId: { type: String },

    phoneNumber: { type: String, default: '' },
    address: { type: Object },
    products: { type: Array },
    totalPrice: Number,
    kindOfTransaction: Number,
    momoId: String,
    momoStatus: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
}, {
    timestamps: true,
    strict: false
});

module.exports = mongoose.model('Order', Order);