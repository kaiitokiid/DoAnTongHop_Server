const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Industry = new Schema({
    name: { type: String },
}, {
    timestamps: true,
    collection: 'industry',
});

module.exports = mongoose.model('Industry', Industry);