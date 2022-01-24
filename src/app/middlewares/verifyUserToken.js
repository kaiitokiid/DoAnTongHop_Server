var constants = require('../constants');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = function verifyUserToken(req, res, next, role) {
    console.log(req.headers.origin);
    try {
        // const token = !req.headers.token;
        console.log(req.headers);
        // console.log(req.body);
        const token = !req.headers.token ? '' : req.headers.token;
        if (!token) {
            return res.json({
                isToken: false,
                isSuccess: false,
                message: 'Xác thực tài khoản không thành công!'
            });
        }
        const verifyToken = jwt.verify(token, constants.ACCESS_TOKEN_SECRET);

        if (verifyToken.role === role || role === constants.ROLE.ALL) {
            req.id = verifyToken.id;
            next();
        }
        else {
            res.json({
                isSuccess: false,
                message: 'Bạn không có quyền truy cập vào trang này!'
            });
        }
    } catch (error) {
        return res.json({
            isToken: false,
            isSuccess: false,
            message: 'Xác thực tài khoản không thành công!'
        });
        // return res.send(`${url}/login`);
        return res.redirect(`/login`);
        // return res.redirect(`http://localhost:3001/login`);
    }
}
