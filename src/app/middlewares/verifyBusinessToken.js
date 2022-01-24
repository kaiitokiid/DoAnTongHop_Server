var constants = require('../constants');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = function verifyBusinessToken(req, res, next) {
    try {
        const token = req.headers.token;
        const verifyToken = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);
        User.findOne({ _id: verifyToken._id})
        .then(data => {
            if(data.role === 'business'){
                req.id = verifyToken._id;
                next();
            }
            else {
                res.status(400).json('Bạn không có quyền truy cập vào trang này!');
            }
        })
        .catch(err => {
            return res.json('Không có dữ liệu');
        })
    } catch (error) {
        return res.json('Xác thực doanh nghiệp không thành công!');
    }
}
