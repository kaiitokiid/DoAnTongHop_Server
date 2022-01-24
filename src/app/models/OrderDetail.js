const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderDetail = new Schema({
    ortherId: {
        type: String,
        ref: 'order'
    },
    productId: {
        type: String,
        ref: 'product'
    },
    quantity: int,
}, {
    timestamps: true,
});

module.exports = mongoose.model('OrderDetail', OrderDetail);