const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Comment = new Schema({
    content: String,
    parentId: {
        type: String,
        ref: 'comment'
    },
    userId: {
        type: String,
        ref: 'user'
    },
    productId: String,
}, {
    timestamps: true,
});

module.exports = mongoose.model('Comment', Comment);