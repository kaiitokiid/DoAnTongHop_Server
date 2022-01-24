const userModule = require('../modules/user.module');
const constants = require('../constants');

class UsersController {

    // [POST] /user/register
    register(req, res, next) {
        userModule.register(req, res, constants.ROLE.USER);
    }

    // [POST] /user/register/shop
    registerShop(req, res, next) {
        userModule.register(req, res, constants.ROLE.SHOP);
    }

    // [POST] /user/login
    userLogin(req, res, next) {
        userModule.login(req, res, constants.ROLE.USER);
    }

    // [POST] /user/shop-login
    shopLogin(req, res, next) {
        userModule.login(req, res, constants.ROLE.SHOP);
    }

    // [POST] /user/admin-login
    adminLogin(req, res, next) {
        userModule.login(req, res, constants.ROLE.ADMIN);
    }

    // [POST] /token
    getUserByToken(req, res, next) {
        userModule.getUserByToken(req, res);
    }

    // [GET] /:id
    getUserById(req, res, next) {
        userModule.getUserById(req, res);
    }

    // [GET] /
    getAllUserPaging(req, res, next) {
        userModule.getAllUserPaging(req, res, constants.ROLE.USER);
    }

    // [GET] /shop
    getAllShopPaging(req, res, next) {
        userModule.getAllUserPaging(req, res, constants.ROLE.SHOP);
    }

    // [PATCH] /user/change-password
    changePassword(req, res, next) {
        userModule.changePassword(req, res);
    }

    // [PATCH] /user/change-image
    changeImage(req, res, next) {
        userModule.changeImage(req, res);
    }

    // [PUT] /user/change-info
    changeInfo(req, res, next) {
        userModule.changeInfo(req, res);
    }

    // [PUT] /user/is-lock
    isLockUser(req, res, next) {
        userModule.isLockUser(req, res);
    }

    // [DELETE] /user/:id
    deleteUser(req, res, next) {
        userModule.deleteUser(req, res);
    }
}

module.exports = new UsersController();
