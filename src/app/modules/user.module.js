const jwt = require('jsonwebtoken');
const saltRounds = 10;
const bcrypt = require('bcrypt');
const { cloudinary } = require('../../config/cloudinary');

const constants = require('../constants');
const User = require('../models/User');
const Address = require('../models/Address');

module.exports = Object.freeze({
    register: function (req, res, role) {
        const username = req.body.username.toLowerCase();
        const password = req.body.password;

        bcrypt.hash(password, saltRounds, function (err, hash) {
            req.body.password = hash;
            User.findOne({
                username
            })
                .then(data => {
                    if (data) {
                        res.json({
                            isSuccess: false,
                            message: "Tài khoản này đã tồn tại!"
                        })
                    }
                    else {
                        req.body.role = role;
                        const user = User(req.body);
                        if (role === constants.ROLE.SHOP) {
                            user.image.path = "https://res.cloudinary.com/tome-ecommer/image/upload/v1638920949/Users/store_is7ufs.png";
                        }
                        user.save()
                            .then(() => res.json({
                                isSuccess: true,
                                message: "Đăng ký thành công!"
                            }))
                            .catch(err => {
                                return res.json({
                                    isSuccess: false,
                                    message: 'Đăng ký thất bại!'
                                })
                            });
                    }
                })
                .catch(err => {
                    return res.json({
                        isSuccess: false,
                        message: 'Đăng ký thất bại!'
                    })
                })

        });
    },

    login: function (req, res, role) {
        const username = req.body.username.toLowerCase();
        const password = req.body.password;
        let dataReturn = {};
        User.findOne({
            username: username
        })
            // .populate('addressId')
            .then(data => {
                if (!data) {
                    console.log("Tài khoản chưa đúng!");
                    return res.json({
                        isSuccess: false,
                        message: "Đăng nhập thất bại: tài khoản hoặc mật khẩu chưa đúng!"
                    });
                }

                if (data.role === constants.ROLE.SHOP && data.isApprove === false) {
                    return res.json({
                        isSuccess: false,
                        message: "Đăng nhập thất bại: tài khoản chưa được xác nhận!"
                    });
                }

                if (data.isLock === true) {
                    return res.json({
                        isSuccess: false,
                        message: "Đăng nhập thất bại: tài khoản đã bị khóa!"
                    });
                }

                bcrypt.compare(password, data.password, function (err, result) {
                    if (!result) {
                        console.log("Mật khẩu chưa đúng!");
                        return res.json({
                            isSuccess: false,
                            message: "Đăng nhập thất bại: tài khoản hoặc mật khẩu chưa đúng!"
                        });
                    }
                    console.log(data.role, role);
                    if (data.role !== role && role !== constants.ROLE.ALL) {
                        return res.json({
                            isSuccess: false,
                            message: "Bạn không có quyền truy cập vào trang này!"
                        });
                    }

                    const token = jwt.sign({ id: data._id, role: data.role }, constants.ACCESS_TOKEN_SECRET, {
                        expiresIn: '1h'
                    });

                    dataReturn = data;

                    Address.findById(data.addressId)
                        .then(data => {
                            dataReturn.addressId = data
                        })
                        .catch(err => {
                            console.log(err);
                        })
                        .finally(() => {
                            return res.json({
                                isSuccess: true,
                                message: "Bạn đã đăng nhập thành công!",
                                token,
                                user: dataReturn
                            });
                        })

                });

            })
            .catch(err => {
                console.log(err);
                res.json({
                    isSuccess: false,
                    message: 'Đăng nhập thất bại!'
                })
            })
    },

    changePassword: function (req, res) {
        const id = req.id;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;

        User.findOne({
            _id: id
        })
            .then(data => {

                if (data) {
                    bcrypt.compare(oldPassword, data.password, function (err, result) {
                        if (result) {
                            bcrypt.hash(newPassword, saltRounds, function (err, hash) {
                                req.body.password = hash;

                                User.updateOne({ _id: id }, req.body)
                                    .then(data => {
                                        console.log(data);
                                        res.json({
                                            isSuccess: true,
                                            message: "Cập nhật mật khẩu thành công",
                                        })
                                    })
                                    .catch(err => {
                                        res.json({
                                            isSuccess: false,
                                            message: 'Cập nhật thất bại!'
                                        })
                                    });
                            })
                        }
                        else {
                            return res.status(400).json({
                                isSuccess: false,
                                message: "Mật khẩu chưa đúng!"
                            });
                        }
                    });
                }
                else
                    return res.status(400).json({
                        isSuccess: false,
                        message: "Tài khoản chưa đúng!"
                    });
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
                    isSuccess: true,
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
                    res.json({
                        isSuccess: false,
                        message: 'Cập nhật thất bại!'
                    })
                })
        } catch (err) {
            res.status(500).json(constants.ERROR.SERVER);
        }
    },

    getUserById: function (req, res) {
        const id = req.params.id

        User.findOne({ _id: id })
            .then(data => {
                return res.json({
                    isSuccess: true,
                    data
                })
            })
            .catch(err => {
                return res.json({
                    isSuccess: false,
                    message: 'Không tìm thấy user này!'
                })
            })
    },

    getUserByToken: function (req, res) {
        const token = req.body.token;

        try {
            const verifyToken = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
            console.log(verifyToken);
            const id = verifyToken.id;

            User.findOne({ _id: id })
                .then(data => {
                    return res.json({
                        isSuccess: true,
                        data
                    })
                })
                .catch(err => {
                    return res.json({
                        isSuccess: false,
                        message: 'Không tìm thấy user này!'
                    })
                })
        }
        catch {
            return res.json({
                isSuccess: false,
                message: 'Không tìm thấy user này!'
            })
        }
    },

    getAllUserPaging: function (req, res, role) {
        console.log("//Get User Or Shop")

        // for shop
        let industryId = req.query.industryId;
        let isApprove = !req.query.isApprove ? '' : req.query.isApprove;
        // for user and shop
        let keyword = !req.query.keyword ? '' : req.query.keyword.toLocaleLowerCase();
        let isLock = !req.query.isLock ? '' : req.query.isLock;

        const page = !req.query.page || req.query.page < 1 ? 1 : parseInt(req.query.page);;
        let pageSize = !req.query.pageSize || req.query.pageSize < 1 ? 10 : parseInt(req.query.pageSize);
        let totalPage;
        let firstItem;
        let lastItem;

        firstItem = page === 1 ? 0 : (page - 1) * pageSize;
        lastItem = page === 1 ? pageSize - 1 : page * pageSize - 1;

        const skipNumber = (page - 1) * pageSize;

        User.find({ role })
            .then(data => {
                // Search
                if (keyword) {
                    data = data.filter((item) => {
                        let id = item._id.toHexString();
                        console.log('id:', id);
                        let fullname = item.fullname;
                        let email = item.email;
                        let phoneNumber = item.phoneNumber;
                        let username = item.username;

                        let shopName = item.shopName;
                        console.log(fullname, email, phoneNumber, username);

                        return fullname.toLowerCase().includes(keyword)
                            || email.toLowerCase().includes(keyword)
                            || phoneNumber.toLowerCase().includes(keyword)
                            || username.toLowerCase().includes(keyword)
                            || id.toLowerCase().includes(keyword)
                            || shopName.toLowerCase().includes(keyword)
                    });
                }

                // Filter
                if (isLock) {
                    isLock = isLock === 'true' ? true : false;
                    data = data.filter((item) => {
                        return item.isLock === isLock;
                    });
                }

                if (role == constants.ROLE.SHOP) {
                    if (isApprove) {
                        isApprove = isApprove === 'true' ? true : false;
                        data = data.filter((item) => {
                            return item.isApprove === isApprove;
                        });
                    }

                    if (industryId) {
                        data = data.filter((item) => {
                            return item.industryId === industryId;
                        });
                    }
                }

                return data;
            })
            // filter qua page
            .then(data => {
                totalPage = Math.ceil(data.length / pageSize);
                data = data.filter((item, index) => {
                    return index >= firstItem && index <= lastItem ? item : '';
                })

                res.json({
                    isSuccess: true,
                    data,
                    totalPage
                })
            })
            .catch(err => {
                res.json({
                    isSuccess: false,
                    message: 'Không tìm thấy sản phẩm!'
                })
            })

    },

    deleteUser: function (req, res) {
        const id = req.params.id;

        User.delete({ _id: id })
            .then(data => {
                console.log(data);
                if (data) {
                    res.json({
                        isSuccess: true,
                        message: 'Xóa thành công!'
                    })
                }
            })
            .catch(err => {
                return res.json({
                    isSuccess: false,
                    message: 'Xóa thất bại!'
                })
            })
    },

    isLockUser: function (req, res) {
        const id = req.params.id;
        const isLock = req.body.isLock;
        const notice = req.body.notice;
        console.log(id);
        User.updateOne({ _id: id }, { isLock: isLock, notice: notice })
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