const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ShipInfo = new Schema({
    fullName: String,
    phoneNumber: String,
    addressInfo: String,
    wardId: int,
    wardName: String,
    districtId: int,
    districtName: String,
    provinceId: int,
    provinceName: String,
}, {
    timestamps: true,
    collection: 'shipinfo'
});

module.exports = mongoose.model('ShipInfo', ShipInfo);