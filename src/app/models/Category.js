const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const Category = new Schema({
    name: { type: String },
    parentId: { type: Number, default: 0 },
}, {
    _id: false,
    timestamps: true,
});


Category.plugin(AutoIncrement);

module.exports = mongoose.model('Category', Category);