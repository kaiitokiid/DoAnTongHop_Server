const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Address = new Schema({
    addressInfo: { type: String },
    wardId: Number,
    wardName: String,
    districtId: Number,
    districtName: String,
    provinceId: Number,
    provinceName: String,
    userId: String,
}, {
    timestamps: true,
    collection: 'address',
    strict: false
});

module.exports = mongoose.model('Address', Address);