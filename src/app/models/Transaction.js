const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Transaction = new Schema({
    userId: {
        type: String,
        ref: 'user'
    },
    shopId: {
        type: String,
        ref: 'user'
    },
    totalPrice: int,
    kindOfTransaction: int,
    status: int,
    notice: String,
}, {
    timestamps: true,
});

module.exports = mongoose.model('Transaction', Transaction);