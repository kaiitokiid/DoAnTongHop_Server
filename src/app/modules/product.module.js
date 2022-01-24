const { cloudinary } = require('../../config/cloudinary');

const constants = require('../constants');
const { create } = require('../models/Product');
const Product = require('../models/Product');
const User = require('../models/User');

module.exports = Object.freeze({

    createProduct: function (req, res) {
        const product = Product(req.body);
        product.shopId = req.id;
        try {
            const fileStr = req.body.image;
            const uploadResponse = cloudinary.uploader.upload(fileStr, {
                upload_preset: 'products',
            })
                .then(result => {
                    console.log(result);
                    product.image = {
                        path: result.url,
                        title: product.name
                    }

                    return User.findOne({ _id: req.id })
                })
                .then(data => {
                    product.shopName = data.shopName;

                    return product.save()
                })
                .then(data => {
                    return res.json({
                        isSuccess: true,
                        message: "Thêm sản phẩm thành công!"
                    })
                })
                .catch(err => {
                    return res.json({
                        isSuccess: false,
                        message: "Thêm sản phẩm thất bại!"
                    })
                })
        } catch (err) {
            res.status(500).json(constants.ERROR.SERVER);
        }
    },

    editProduct: function (req, res) {
        const id = req.params.id
        // console.log("id", id);
        // console.log("body", req.body);
        // res.json({
        //     isSuccess: true,
        //     message: "oke"
        // })
        // try {
        const fileStr = req.body.image;
        console.log("file ảnh client gửi lên", fileStr);
        Product.findOne({ _id: id })
            .then(data => {
                console.log("data", data);
                console.log("image", data.name);
                if (data.image.path !== fileStr) {
                    console.log("Có chỉnh sửa ảnh");
                    const uploadResponse = cloudinary.uploader.upload(fileStr, {
                        upload_preset: 'products',
                    })
                        .then(result => {
                            req.body.image = {
                                path: result.url,
                                title: req.body.name
                            }

                            return Product.updateOne({ _id: id }, req.body)
                        })
                        .then(data => {
                            console.log(data);
                            if (data.acknowledged)
                                return res.json({
                                    isSuccess: true,
                                    message: "Chỉnh sửa sản phẩm thành công!"
                                })
                        })
                        .catch(err => {
                            return res.json({
                                isSuccess: false,
                                message: "Chỉnh sửa sản phẩm thất bại!"
                            })
                        })
                }
                else {
                    console.log("Không chỉnh sửa ảnh");
                    req.body.image = {
                        path: fileStr,
                        title: req.body.name
                    }
                    Product.updateOne({ _id: id }, req.body)
                        .then(data => {
                            console.log(data);
                            if (data.acknowledged)
                                return res.json({
                                    isSuccess: true,
                                    message: "Chỉnh sửa sản phẩm thành công!"
                                })
                        })
                        .catch(err => {
                            return res.json({
                                isSuccess: false,
                                message: "Chỉnh sửa sản phẩm thất bại!"
                            })
                        })
                }
            })
            .catch(err => {
                console.log(err);
                res.json({
                    isSuccess: false,
                    message: "Lỗi"
                })
            })
    },

    stock: function (req, res) {
        const id = req.params.id
        const stock = Number(req.body.stock)

        Product.findOne({ _id: id })
            .then(data => {
                console.log(data);
                Product.updateOne({ _id: id }, { stock: (data.stock + stock) })
                    .then(data => {
                        console.log(data);
                        if (data.acknowledged)
                            return res.json({
                                isSuccess: true,
                                message: "Nhập hàng thành công!"
                            })
                    })
                    .catch(err => {
                        return res.json({
                            isSuccess: false,
                            message: "Nhập hàng thất bại!"
                        })
                    })

            })
            .catch(err => {
                console.log(err);
                res.json({
                    isSuccess: false,
                    message: "Lỗi"
                })
            })
    },

    changeInfo: function (req, res) {
        const id = req.id;
        User.updateOne({ _id: id }, req.body)
            .then(data => {
                res.json({
                    isSuccess: true,
                    message: 'Cập nhật thành công!'
                })
            })
            .catch(err => {
                res.json({
                    isSuccess: false,
                    message: 'Cập nhật thất bại!'
                })
            })
    },

    changeImage: function (req, res) {
        try {
            const id = req.id;
            const fileStr = req.body.data;
            const uploadResponse = cloudinary.uploader.upload(fileStr, {
                upload_preset: 'users',
            })
                .then(result => {
                    let imageData = {
                        imagePath: result.public_id,
                        title: 'avatar'
                    }

                    return User.updateOne({ _id: id }, { images: imageData })
                })
                .then(data => {
                    if (data.acknowledged) {
                        res.json({
                            isSuccess: true,
                            message: 'Cập nhật thành công!'
                        })
                    }
                })
                .catch(err => {
                    return res.json({
                        isSuccess: false,
                        message: 'Cập nhật thất bại!'
                    })
                })
        } catch (err) {
            res.status(500).json(constants.ERROR.SERVER);
        }
    },

    getProductById: function (req, res) {
        const id = req.params.id

        Product.findOne({ _id: id })
            .then(data => {
                return res.json({
                    isSuccess: true,
                    data
                });
            })
            .catch(err => {
                return res.json({
                    isSuccess: false,
                    message: 'Không tìm thấy sản phẩm này!'
                });
            })
    },

    getAllProductPaging: function (req, res) {
        const keyword = !req.query.keyword ? '' : req.query.keyword.toLocaleLowerCase();
        const minPrice = !req.query.minPrice || req.query.minPrice < 0 ? 0 : parseInt(req.query.minPrice);
        const maxPrice = !req.query.maxPrice || req.query.maxPrice < 0 ? 0 : parseInt(req.query.maxPrice);
        const priceOrder = !req.query.priceOrder ? 0 : parseInt(req.query.priceOrder);
        const categoryId = !req.query.categoryId || req.query.categoryId < 1 ? 0 : req.query.categoryId;
        let isLock = !req.query.isLock ? '' : req.query.isLock;

        const page = !req.query.page || req.query.page < 1 ? 1 : parseInt(req.query.page);
        let pageSize = !req.query.pageSize || req.query.pageSize < 1 ? 10 : parseInt(req.query.pageSize);

        let totalPage;
        let firstItem;
        let lastItem;

        firstItem = page === 1 ? 0 : (page - 1) * pageSize;
        lastItem = page === 1 ? pageSize - 1 : page * pageSize - 1;
        // console.log('firstItem: ', firstItem, 'lastItem: ', lastItem);

        const skipNumber = (page - 1) * pageSize;

        Product.find({ isLock: false })
            .then(data => {
                // console.log(data);
                // Search
                if (keyword) {
                    console.log("keyword");
                    data = data.filter((item) => {
                        let id = item._id.toHexString();
                        let name = item.name;
                        let shopName = item.shopName;

                        return name.toLowerCase().includes(keyword)
                            || id.toLowerCase().includes(keyword)
                            || shopName.toLowerCase().includes(keyword)
                    });
                    console.log("data = ", data);
                }

                // Filter
                if (minPrice && maxPrice && maxPrice >= minPrice) {
                    console.log("min && max");
                    data = data.filter((item) => {
                        return item.salePrice >= minPrice && item.salePrice <= maxPrice;
                    });
                    console.log(data);

                }
                if (minPrice && maxPrice == false) {
                    console.log("max == false");
                    data = data.filter((item) => {
                        return item.salePrice >= minPrice;
                    });
                    console.log(data);
                }
                if (minPrice == false && maxPrice) {
                    console.log("min == false");
                    data = data.filter((item) => {
                        return item.salePrice <= maxPrice;
                    });
                    console.log(data);

                }

                if (categoryId) {
                    // console.log("category");
                    data = data.filter((item) => {
                        return item.categoryId == categoryId;
                    });
                    // console.log(data);
                }

                if (priceOrder > 0) {
                    // console.log("priceOrder > 0");
                    data = data.sort((a, b) => {
                        return a.salePrice - b.salePrice
                    });
                    // console.log(data);
                }
                else if (priceOrder < 0) {
                    // console.log("priceOrder < 0");
                    data = data.sort((a, b) => {
                        return b.salePrice - a.salePrice
                    });
                    // console.log(data);
                }

                if (isLock) {
                    // console.log("isLock");
                    isLock = isLock === 'true' ? true : false;
                    data = data.filter((item) => {
                        return item.isLock === isLock;
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
                    message: 'Không tìm thấy sản phẩm nào!'
                })
            })

    },

    getAllProductPagingAdmin: function (req, res) {
        const keyword = !req.query.keyword ? '' : req.query.keyword.toLocaleLowerCase();
        const minPrice = !req.query.minPrice || req.query.minPrice < 0 ? 0 : parseInt(req.query.minPrice);
        const maxPrice = !req.query.maxPrice || req.query.maxPrice < 0 ? 0 : parseInt(req.query.maxPrice);
        const priceOrder = !req.query.priceOrder ? 0 : parseInt(req.query.priceOrder);
        const categoryId = !req.query.categoryId || req.query.categoryId < 1 ? 0 : req.query.categoryId;
        let isLock = !req.query.isLock ? '' : req.query.isLock;

        const page = !req.query.page || req.query.page < 1 ? 1 : parseInt(req.query.page);
        let pageSize = !req.query.pageSize || req.query.pageSize < 1 ? 10 : parseInt(req.query.pageSize);

        let totalPage;
        let firstItem;
        let lastItem;

        firstItem = page === 1 ? 0 : (page - 1) * pageSize;
        lastItem = page === 1 ? pageSize - 1 : page * pageSize - 1;
        // console.log('firstItem: ', firstItem, 'lastItem: ', lastItem);

        const skipNumber = (page - 1) * pageSize;

        Product.find({})
            .then(data => {
                // console.log(data);
                // Search
                if (keyword) {
                    console.log("keyword");
                    data = data.filter((item) => {
                        let id = item._id.toHexString();
                        let name = item.name;
                        let shopName = item.shopName;

                        return name.toLowerCase().includes(keyword)
                            || id.toLowerCase().includes(keyword)
                            || shopName.toLowerCase().includes(keyword)
                    });
                    console.log("data = ", data);
                }

                // Filter
                if (minPrice && maxPrice && maxPrice >= minPrice) {
                    console.log("min && max");
                    data = data.filter((item) => {
                        return item.salePrice >= minPrice && item.salePrice <= maxPrice;
                    });
                    console.log(data);

                }
                if (minPrice && maxPrice == false) {
                    console.log("max == false");
                    data = data.filter((item) => {
                        return item.salePrice >= minPrice;
                    });
                    console.log(data);
                }
                if (minPrice == false && maxPrice) {
                    console.log("min == false");
                    data = data.filter((item) => {
                        return item.salePrice <= maxPrice;
                    });
                    console.log(data);

                }

                if (categoryId) {
                    // console.log("category");
                    data = data.filter((item) => {
                        return item.categoryId == categoryId;
                    });
                    // console.log(data);
                }

                if (priceOrder > 0) {
                    // console.log("priceOrder > 0");
                    data = data.sort((a, b) => {
                        return a.salePrice - b.salePrice
                    });
                    // console.log(data);
                }
                else if (priceOrder < 0) {
                    // console.log("priceOrder < 0");
                    data = data.sort((a, b) => {
                        return b.salePrice - a.salePrice
                    });
                    // console.log(data);
                }

                if (isLock) {
                    // console.log("isLock");
                    isLock = isLock === 'true' ? true : false;
                    data = data.filter((item) => {
                        return item.isLock === isLock;
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
                    message: 'Không tìm thấy sản phẩm nào!'
                })
            })

    },

    getAllShopProductPaging: function (req, res) {
        const id = req.params.id;
        console.log("//Get All Product")
        const keyword = !req.query.keyword ? '' : req.query.keyword.toLocaleLowerCase();
        const minPrice = !req.query.minPrice || req.query.minPrice < 0 ? 0 : parseInt(req.query.minPrice);
        const maxPrice = !req.query.maxPrice || req.query.maxPrice < 0 ? 0 : parseInt(req.query.maxPrice);
        const priceOrder = !req.query.priceOrder ? 0 : parseInt(req.query.priceOrder);
        const categoryId = !req.query.categoryId || req.query.categoryId < 1 ? 0 : req.query.categoryId;
        let isLock = !req.query.isLock ? '' : req.query.isLock;

        const page = !req.query.page || req.query.page < 1 ? 1 : parseInt(req.query.page);
        let pageSize = !req.query.pageSize || req.query.pageSize < 1 ? 10 : parseInt(req.query.pageSize);

        let totalPage;
        let firstItem;
        let lastItem;

        firstItem = page === 1 ? 0 : (page - 1) * pageSize;
        lastItem = page === 1 ? pageSize - 1 : page * pageSize - 1;
        // console.log('firstItem: ', firstItem, 'lastItem: ', lastItem);

        const skipNumber = (page - 1) * pageSize;

        Product.find({ shopId: id, isLock: false })
            .then(data => {
                // console.log(data);
                // Search
                if (keyword) {
                    // console.log("keyword");
                    data = data.filter((item) => {
                        let id = item._id.toHexString();
                        let name = item.name;

                        return name.toLowerCase().includes(keyword)
                            || id.toLowerCase().includes(keyword)
                    });
                    // console.log(data);
                }

                // Filter
                if (minPrice && maxPrice && maxPrice >= minPrice) {
                    // console.log("min && max");
                    data = data.filter((item) => {
                        return item.salePrice >= minPrice && item.salePrice <= maxPrice;
                    });
                    // console.log(data);

                }
                if (minPrice && maxPrice == false) {
                    // console.log("max == false");
                    data = data.filter((item) => {
                        return item.salePrice >= minPrice;
                    });
                    // console.log(data);
                }
                if (minPrice == false && maxPrice) {
                    // console.log("min == false");
                    data = data.filter((item) => {
                        return item.salePrice <= maxPrice;
                    });
                    // console.log(data);

                }

                if (categoryId) {
                    // console.log("category");
                    data = data.filter((item) => {
                        return item.categoryId == categoryId;
                    });
                    // console.log(data);
                }

                if (priceOrder > 0) {
                    // console.log("priceOrder > 0");
                    data = data.sort((a, b) => {
                        return a.salePrice - b.salePrice
                    });
                    // console.log(data);
                }
                else if (priceOrder < 0) {
                    // console.log("priceOrder < 0");
                    data = data.sort((a, b) => {
                        return b.salePrice - a.salePrice
                    });
                    // console.log(data);
                }

                if (isLock) {
                    // console.log("isLock");
                    isLock = isLock === 'true' ? true : false;
                    data = data.filter((item) => {
                        return item.isLock === isLock;
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
                    message: 'Không tìm thấy sản phẩm nào!'
                })
            })

    },

    getAllShopProductPagingShop: function (req, res) {
        const id = req.params.id;
        console.log("//Get All Product")
        const keyword = !req.query.keyword ? '' : req.query.keyword.toLocaleLowerCase();
        const minPrice = !req.query.minPrice || req.query.minPrice < 0 ? 0 : parseInt(req.query.minPrice);
        const maxPrice = !req.query.maxPrice || req.query.maxPrice < 0 ? 0 : parseInt(req.query.maxPrice);
        const priceOrder = !req.query.priceOrder ? 0 : parseInt(req.query.priceOrder);
        const categoryId = !req.query.categoryId || req.query.categoryId < 1 ? 0 : req.query.categoryId;
        let isLock = !req.query.isLock ? '' : req.query.isLock;

        const page = !req.query.page || req.query.page < 1 ? 1 : parseInt(req.query.page);
        let pageSize = !req.query.pageSize || req.query.pageSize < 1 ? 10 : parseInt(req.query.pageSize);

        let totalPage;
        let firstItem;
        let lastItem;

        firstItem = page === 1 ? 0 : (page - 1) * pageSize;
        lastItem = page === 1 ? pageSize - 1 : page * pageSize - 1;
        // console.log('firstItem: ', firstItem, 'lastItem: ', lastItem);

        const skipNumber = (page - 1) * pageSize;

        Product.find({ shopId: id })
            .then(data => {
                // console.log(data);
                // Search
                if (keyword) {
                    // console.log("keyword");
                    data = data.filter((item) => {
                        let id = item._id.toHexString();
                        let name = item.name;

                        return name.toLowerCase().includes(keyword)
                            || id.toLowerCase().includes(keyword)
                    });
                    // console.log(data);
                }

                // Filter
                if (minPrice && maxPrice && maxPrice >= minPrice) {
                    // console.log("min && max");
                    data = data.filter((item) => {
                        return item.salePrice >= minPrice && item.salePrice <= maxPrice;
                    });
                    // console.log(data);

                }
                if (minPrice && maxPrice == false) {
                    // console.log("max == false");
                    data = data.filter((item) => {
                        return item.salePrice >= minPrice;
                    });
                    // console.log(data);
                }
                if (minPrice == false && maxPrice) {
                    // console.log("min == false");
                    data = data.filter((item) => {
                        return item.salePrice <= maxPrice;
                    });
                    // console.log(data);

                }

                if (categoryId) {
                    // console.log("category");
                    data = data.filter((item) => {
                        return item.categoryId == categoryId;
                    });
                    // console.log(data);
                }

                if (priceOrder > 0) {
                    // console.log("priceOrder > 0");
                    data = data.sort((a, b) => {
                        return a.salePrice - b.salePrice
                    });
                    // console.log(data);
                }
                else if (priceOrder < 0) {
                    // console.log("priceOrder < 0");
                    data = data.sort((a, b) => {
                        return b.salePrice - a.salePrice
                    });
                    // console.log(data);
                }

                if (isLock) {
                    // console.log("isLock");
                    isLock = isLock === 'true' ? true : false;
                    data = data.filter((item) => {
                        return item.isLock === isLock;
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
                    message: 'Không tìm thấy sản phẩm nào!'
                })
            })

    },

    getSearchShop: function (req, res) {
        const id = req.id;
        console.log("//Get All Product")
        const keyword = !req.query.keyword ? '' : req.query.keyword.toLocaleLowerCase();
        const minPrice = !req.query.minPrice || req.query.minPrice < 0 ? 0 : parseInt(req.query.minPrice);
        const maxPrice = !req.query.maxPrice || req.query.maxPrice < 0 ? 0 : parseInt(req.query.maxPrice);
        const priceOrder = !req.query.priceOrder ? 0 : parseInt(req.query.priceOrder);
        const categoryId = !req.query.categoryId || req.query.categoryId < 1 ? 0 : req.query.categoryId;
        let isLock = !req.query.isLock ? '' : req.query.isLock;

        const page = !req.query.page || req.query.page < 1 ? 1 : parseInt(req.query.page);
        let pageSize = !req.query.pageSize || req.query.pageSize < 1 ? 10 : parseInt(req.query.pageSize);

        let totalPage;
        let firstItem;
        let lastItem;

        firstItem = page === 1 ? 0 : (page - 1) * pageSize;
        lastItem = page === 1 ? pageSize - 1 : page * pageSize - 1;
        // console.log('firstItem: ', firstItem, 'lastItem: ', lastItem);

        const skipNumber = (page - 1) * pageSize;

        Product.find({ shopId: id, isLock: false })
            .then(data => {
                // console.log(data);
                // Search
                if (keyword) {
                    // console.log("keyword");
                    data = data.filter((item) => {
                        let id = item._id.toHexString();
                        let name = item.name;

                        return name.toLowerCase().includes(keyword)
                            || id.toLowerCase().includes(keyword)
                    });
                    // console.log(data);
                }

                // Filter
                if (minPrice && maxPrice && maxPrice >= minPrice) {
                    // console.log("min && max");
                    data = data.filter((item) => {
                        return item.salePrice >= minPrice && item.salePrice <= maxPrice;
                    });
                    // console.log(data);

                }
                if (minPrice && maxPrice == false) {
                    // console.log("max == false");
                    data = data.filter((item) => {
                        return item.salePrice >= minPrice;
                    });
                    // console.log(data);
                }
                if (minPrice == false && maxPrice) {
                    // console.log("min == false");
                    data = data.filter((item) => {
                        return item.salePrice <= maxPrice;
                    });
                    // console.log(data);

                }

                if (categoryId) {
                    // console.log("category");
                    data = data.filter((item) => {
                        return item.categoryId == categoryId;
                    });
                    // console.log(data);
                }

                if (priceOrder > 0) {
                    // console.log("priceOrder > 0");
                    data = data.sort((a, b) => {
                        return a.salePrice - b.salePrice
                    });
                    // console.log(data);
                }
                else if (priceOrder < 0) {
                    // console.log("priceOrder < 0");
                    data = data.sort((a, b) => {
                        return b.salePrice - a.salePrice
                    });
                    // console.log(data);
                }

                if (isLock) {
                    // console.log("isLock");
                    isLock = isLock === 'true' ? true : false;
                    data = data.filter((item) => {
                        return item.isLock === isLock;
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
                    message: 'Không tìm thấy sản phẩm nào!'
                })
            })

    },

    getFeaturedProducts: function (req, res) {

        Product.find({ isLock: false })
            .limit(20)
            .sort({ createdAt: -1 })
            .then(data => {
                return res.json({
                    isSuccess: true,
                    data
                })
            })
            .catch(err => {
                return res.json({
                    isSuccess: false,
                    message: 'Không có dữ liệu sản phẩm nổi bật!'
                })
            })
    },

    getSimilarProducts: function (req, res) {
        console.log(req.body);
        const categoryId = req.body.categoryId;
        const id = req.body._id;

        console.log(categoryId, id);

        Product.find({ categoryId, _id: { $ne: id }, isLock: false })
            .limit(5)
            .then(data => {
                return res.json({
                    isSuccess: true,
                    data
                })
            })
            .catch(err => {
                return res.json({
                    isSuccess: false,
                    message: 'Không có dữ liệu sản phẩm tìm kiếm nhiều!'
                })
            })
    },

    getMostSearchProducts: function (req, res) {
        Product.find({ isLock: false })
            .limit(20)
            .sort({ viewcount: -1 })
            .then(data => {
                return res.json({
                    isSuccess: true,
                    data
                })
            })
            .catch(err => {
                return res.json({
                    isSuccess: false,
                    message: 'Không có dữ liệu sản phẩm tìm kiếm nhiều!'
                })
            })
    },

    changeViewCount: function (req, res) {
        const id = req.body.id;

        Product.findOne({ _id: id })
            .then(data => {
                return Product.updateOne({ _id: id }, { viewcount: data.viewcount + 1 })
            })
            .then(data => {
                return res.json({
                    isSuccess: true,
                    message: 'Tăng view thành công!'
                })
            })
            .catch(err => {
                return res.json({
                    isSuccess: true,
                    message: 'Tăng view không thành công!'
                })
            })
    },

    deleteProduct: function (req, res) {
        const id = req.params.id;
        console.log(id);
        Product.deleteOne({ _id: id })
            .then(data => {
                if (data) {
                    res.json({
                        isSuccess: true,
                        message: 'Xóa thành công!'
                    })
                }
            })
            .catch(err => {
                res.json({
                    isSuccess: false,
                    message: 'Xóa thất bại!'
                })
            })
    },

    isLockProduct: function (req, res) {
        const id = req.params.id;
        const isLock = req.body.isLock;
        const notice = req.body.notice;
        console.log(id);
        Product.updateOne({ _id: id }, { isLock: isLock, notice: notice })
            .then(data => {
                if (data) {
                    res.json({
                        isSuccess: true,
                        message: 'Cập nhật thành công!'
                    })
                }
            })
            .catch(err => {
                res.json({
                    isSuccess: false,
                    message: 'Cập nhật thất bại!'
                })
            })
    }

});