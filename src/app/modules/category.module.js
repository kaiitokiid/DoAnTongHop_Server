const { cloudinary } = require('../../config/cloudinary');

const constants = require('../constants');
const { create } = require('../models/Product');
const Product = require('../models/Product');
const Category = require('../models/Category');

module.exports = Object.freeze({

    createCategory: function (req, res) {
        const category = Category(req.body);
        category.save()
            .then(data => {
                return res.json({
                    isSuccess: true,
                    message: "Thêm thành công!"
                })
            })
            .catch(err => {
                return res.json({
                    isSuccess: false,
                    message: "Thêm thất bại!"
                })
            })
    },

    getAllCategories: function (req, res) {

        Category.find()
            // .sort({ createdAt: 1 })
            .then(data => {
                return res.json({
                    isSuccess: true,
                    data
                })
            })
            .catch(err => {
                return res.json({
                    isSuccess: false,
                    message: 'Không có dữ liệu!'
                })
            })
    },

    getCategoryById: function (req, res) {
        const id = req.params.id;

        Category.findOne({ _id: id })
            .then(data => {
                return res.json({
                    isSuccess: true,
                    data
                })
            })
            .catch(err => {
                return res.json({
                    isSuccess: false,
                    message: 'Không có dữ liệu!'
                })
            })
    },

});