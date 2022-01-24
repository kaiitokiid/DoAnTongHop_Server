const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const User = new Schema({
    username: { type: String },
    password: { type: String },
    fullname: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    birthday: { type: Date, default: '' },
    role: { type: String },
    isLock: { type: Boolean, default: false },
    notice: { type: String, default: '' },
    address: {
        type: Object,
        default: {
            addressInfo: '',
            provinceId: -1,
            provinceName: '',
            districtId: -1,
            districtName: '',
            wardId: -1,
            wardName: ''
        },
    },
    industryId: { type: Number, default: -1 },
    image: { type: Object, default: { path: 'https://res.cloudinary.com/tome-ecommer/image/upload/v1638920684/Users/username-icon-11_jtcbrb_aphzte.png', title: 'avatar' } },
    shopName: { type: String, default: '' },
    isApprove: { type: Boolean, default: false },

}, {
    timestamps: true
});


User.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('User', User);
