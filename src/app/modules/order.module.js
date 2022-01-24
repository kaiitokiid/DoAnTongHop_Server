const { cloudinary } = require('../../config/cloudinary');

const constants = require('../constants');
const { create } = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');


module.exports = Object.freeze({

    getAllShopOrderPaging: function (req, res) {
        const id = req.id;

        const keyword = !req.query.keyword ? '' : req.query.keyword.toLocaleLowerCase();
        const minPrice = !req.query.minPrice || req.query.minPrice < 0 ? 0 : parseInt(req.query.minPrice);
        const maxPrice = !req.query.maxPrice || req.query.maxPrice < 0 ? 0 : parseInt(req.query.maxPrice);
        const priceOrder = !req.query.priceOrder ? 0 : parseInt(req.query.priceOrder);
        let kindOfTransaction = !req.query.kindOfTransaction ? 0 : 1;
        let status = !req.query.status ? '' : 1;

        const page = !req.query.page || req.query.page < 1 ? 1 : parseInt(req.query.page);
        let pageSize = !req.query.pageSize || req.query.pageSize < 1 ? 10 : parseInt(req.query.pageSize);

        let totalPage;
        let firstItem;
        let lastItem;

        firstItem = page === 1 ? 0 : (page - 1) * pageSize;
        lastItem = page === 1 ? pageSize - 1 : page * pageSize - 1;
        // console.log('firstItem: ', firstItem, 'lastItem: ', lastItem);

        const skipNumber = (page - 1) * pageSize;

        Order.find({ shopId: id })
            .sort({ createdAt: -1 })
            .then(data => {
                // console.log(data);
                // Search
                if (keyword) {
                    // console.log("keyword");
                    data = data.filter((item) => {
                        let id = item._id.toHexString();
                        let username = item.username;

                        return username.toLowerCase().includes(keyword)
                            || id.toLowerCase().includes(keyword)
                    });
                    // console.log(data);
                }

                // Filter
                if (minPrice && maxPrice && maxPrice >= minPrice) {
                    // console.log("min && max");
                    data = data.filter((item) => {
                        return item.totalPrice >= minPrice && item.totalPrice <= maxPrice;
                    });
                    // console.log(data);

                }
                if (minPrice && maxPrice == false) {
                    // console.log("max == false");
                    data = data.filter((item) => {
                        return item.totalPrice >= minPrice;
                    });
                    // console.log(data);
                }
                if (minPrice == false && maxPrice) {
                    // console.log("min == false");
                    data = data.filter((item) => {
                        return item.totalPrice <= maxPrice;
                    });
                    // console.log(data);

                }

                if (kindOfTransaction) {
                    kindOfTransaction = req.query.kindOfTransaction;
                    // console.log("category");
                    data = data.filter((item) => {
                        return item.kindOfTransaction == kindOfTransaction;
                    });
                    // console.log(data);
                }

                if (priceOrder > 0) {
                    // console.log("priceOrder > 0");
                    data = data.sort((a, b) => {
                        return a.totalPrice - b.totalPrice
                    });
                    // console.log(data);
                }
                else if (priceOrder < 0) {
                    // console.log("priceOrder < 0");
                    data = data.sort((a, b) => {
                        return b.totalPrice - a.totalPrice
                    });
                    // console.log(data);
                }

                if (status) {
                    status = req.query.status;
                    // console.log("status");
                    data = data.filter((item) => {
                        return item.status == status;
                    });
                    // console.log(data);
                }
                return data;
            })
            // filter qua page
            .then(data => {
                totalPage = Math.ceil(data.length / pageSize);
                data = data.filter((item, index) => {
                    return index >= firstItem && index <= lastItem ? item : '';
                })

                return res.json({
                    isSuccess: true,
                    data,
                    totalPage
                });
            })
            .then(data => {
                res.json({
                    isSuccess: true,
                    data,
                    totalPage
                })
            })
            .catch(err => {
                res.json({
                    isSuccess: false,
                    message: 'Không tìm thấy đơn hàng nào!'
                })
            })

    },

    getAllOrderPaging: function (req, res) {

        const keyword = !req.query.keyword ? '' : req.query.keyword.toLocaleLowerCase();
        const minPrice = !req.query.minPrice || req.query.minPrice < 0 ? 0 : parseInt(req.query.minPrice);
        const maxPrice = !req.query.maxPrice || req.query.maxPrice < 0 ? 0 : parseInt(req.query.maxPrice);
        const priceOrder = !req.query.priceOrder ? 0 : parseInt(req.query.priceOrder);
        let kindOfTransaction = !req.query.kindOfTransaction ? 0 : 1;
        let status = !req.query.status ? '' : 1;

        const page = !req.query.page || req.query.page < 1 ? 1 : parseInt(req.query.page);
        let pageSize = !req.query.pageSize || req.query.pageSize < 1 ? 10 : parseInt(req.query.pageSize);

        let totalPage;
        let firstItem;
        let lastItem;

        firstItem = page === 1 ? 0 : (page - 1) * pageSize;
        lastItem = page === 1 ? pageSize - 1 : page * pageSize - 1;
        // console.log('firstItem: ', firstItem, 'lastItem: ', lastItem);

        const skipNumber = (page - 1) * pageSize;

        Order.find({})
            .sort({ createdAt: -1 })
            .then(data => {
                // console.log(data);
                // Search
                if (keyword) {
                    // console.log("keyword");
                    data = data.filter((item) => {
                        let id = item._id.toHexString();
                        let username = item.username;

                        return username.toLowerCase().includes(keyword)
                            || id.toLowerCase().includes(keyword)
                    });
                    // console.log(data);
                }

                // Filter
                if (minPrice && maxPrice && maxPrice >= minPrice) {
                    // console.log("min && max");
                    data = data.filter((item) => {
                        return item.totalPrice >= minPrice && item.totalPrice <= maxPrice;
                    });
                    // console.log(data);

                }
                if (minPrice && maxPrice == false) {
                    // console.log("max == false");
                    data = data.filter((item) => {
                        return item.totalPrice >= minPrice;
                    });
                    // console.log(data);
                }
                if (minPrice == false && maxPrice) {
                    // console.log("min == false");
                    data = data.filter((item) => {
                        return item.totalPrice <= maxPrice;
                    });
                    // console.log(data);

                }

                if (kindOfTransaction) {
                    kindOfTransaction = req.query.kindOfTransaction;
                    // console.log("category");
                    data = data.filter((item) => {
                        return item.kindOfTransaction == kindOfTransaction;
                    });
                    // console.log(data);
                }

                if (priceOrder > 0) {
                    // console.log("priceOrder > 0");
                    data = data.sort((a, b) => {
                        return a.totalPrice - b.totalPrice
                    });
                    // console.log(data);
                }
                else if (priceOrder < 0) {
                    // console.log("priceOrder < 0");
                    data = data.sort((a, b) => {
                        return b.totalPrice - a.totalPrice
                    });
                    // console.log(data);
                }

                if (status) {
                    status = req.query.status;
                    // console.log("status");
                    data = data.filter((item) => {
                        return item.status == status;
                    });
                    // console.log(data);
                }
                return data;
            })
            // filter qua page
            .then(data => {
                totalPage = Math.ceil(data.length / pageSize);
                data = data.filter((item, index) => {
                    return index >= firstItem && index <= lastItem ? item : '';
                })

                return res.json({
                    isSuccess: true,
                    data,
                    totalPage
                });
            })
            .then(data => {
                res.json({
                    isSuccess: true,
                    data,
                    totalPage
                })
            })
            .catch(err => {
                res.json({
                    isSuccess: false,
                    message: 'Không tìm thấy đơn hàng nào!'
                })
            })

    },

    getOrdersByUserId: function (req, res) {
        const id = req.params.id;

        Order.find({ userId: id })
            .sort({ createdAt: -1 })
            .then(data => {
                res.json({
                    isSuccess: true,
                    data
                })
            })
            .catch(err => {
                console.log(err);
                res.json({
                    isSuccess: false,
                    message: 'Không có đơn hàng!'
                })
            })
    },

    getOrderById: function (req, res) {
        const id = req.params.id;

        Order.findOne({ _id: id })
            .then(data => {
                res.json({
                    isSuccess: true,
                    data
                })
            })
            .catch(err => {
                console.log(err);
                res.json({
                    isSuccess: false,
                    message: 'Không có đơn hàng!'
                })
            })
    },

    changeStateById: function (req, res) {
        const orderId = req.params.id;
        const status = req.body.status;

        Order.updateOne({ _id: orderId }, { status })
            .then(data => {
                res.json({
                    isSuccess: true,
                    message: 'Cập nhật trạng thái thành công!'
                })
            })
            .catch(err => {
                console.log(err);
                res.json({
                    isSuccess: false,
                    message: 'Cập nhật trạng thái thất bại!'
                })
            })
    },

    //count confirm and delivery
    countConfirmOrderByShopId: function (req, res) {
        const id = req.params.id;

        Order.count({ shopId: id, status: 0 })
            .then(countConfirm => {

                return Promise.all([countConfirm, Order.count({ shopId: id, status: 1 })])
            })
            .then(results => {
                const [countConfirm, countDelivery] = results;

                res.json({
                    isSuccess: true,
                    countConfirm,
                    countDelivery
                })


            })
            .catch(err => {
                console.log(err);
                res.json({
                    isSuccess: false,
                    message: 'Lỗi!'
                })
            })
    },

    countDeliveryByShopId: function (req, res) {
        const id = req.params.id;

        Order.count({ shopId: id, status: 2 })
            .then(data => {
                res.json({
                    isSuccess: true,
                    data
                })
            })
            .catch(err => {
                console.log(err);
                res.json({
                    isSuccess: false,
                    message: 'Lỗi!'
                })
            })
    },

    // count order and turnover
    countOrderThisMonthByShopId: function (req, res) {
        const id = req.params.id;

        var thisMonth = new Date().getMonth();
        var year = new Date().getFullYear();
        console.log(year, thisMonth);

        const date = new Date(year, thisMonth, 1);
        console.log(date);


        Order.count({
            shopId: id,
            createdAt: {
                $gte: date,
            }
        })
            .then(countOrder => {

                return Promise.all([
                    countOrder,
                    Order.find({
                        shopId: id,
                        createdAt: {
                            $gte: date,
                        },
                        status: 3
                    })
                ])
            })
            .then(results => {
                const [countOrder, data] = results;

                const turnover = data.reduce((total, item) => {
                    return total + item.totalPrice
                }, 0)

                res.json({
                    isSuccess: true,
                    countOrder,
                    turnover
                })
            })
            .catch(err => {
                console.log(err);
                res.json({
                    isSuccess: false,
                    message: 'Lỗi!'
                })
            })
    },

    getTurnoverThisMonthByShopId: function (req, res) {
        const id = req.params.id;

        var thisMonth = new Date().getMonth();
        var year = new Date().getYear();

        Order.find({
            shopId: id,
            createdAt: {
                $gte: new Date(year, thisMonth, 1),
            }
        })
            .then(data => {

                data = data.reduce((total, item) => {
                    return total + item.totalPrice
                }, 0)

                res.json({
                    isSuccess: true,
                    data
                })
            })
            .catch(err => {
                console.log(err);
                res.json({
                    isSuccess: false,
                    message: 'Lỗi!'
                })
            })
    },

    cancelOrder: function (req, res) {
        const id = req.body.id;

        Order.updateOne({ _id: id }, { status: 9 })
            .then(data => {
                res.json({
                    isSuccess: true,
                    message: 'Hủy đơn hàng thành công!'
                })
            })
            .catch(err => {
                console.log(err);
                res.json({
                    isSuccess: false,
                    message: 'Hủy đơn hàng thất bại!'
                })
            })

    },

});