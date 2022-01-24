const express = require('express');
const router = express.Router();

const constants = require('../constants');
const verifyUserToken = require('../middlewares/verifyUserToken');

const userController = require('../controllers/UsersController');

router.get('/shop', userController.getAllShopPaging);

router.get('/user', (req, res, next) => {
    verifyUserToken(req, res, next, constants.ROLE.ADMIN)
}, userController.getAllUserPaging);

router.get('/:id', userController.getUserById);

router.patch('/change-password', (req, res, next) => {
    verifyUserToken(req, res, next, constants.ROLE.ALL)
}, userController.changePassword);

router.put('/change-info', (req, res, next) => {
    verifyUserToken(req, res, next, constants.ROLE.ALL)
}, userController.changeInfo);

router.put('/is-lock/:id', (req, res, next) => {
    verifyUserToken(req, res, next, constants.ROLE.ADMIN)
}, userController.isLockUser);

router.patch('/change-image', (req, res, next) => {
    verifyUserToken(req, res, next, constants.ROLE.ALL)
}, userController.changeImage);

router.delete('/:id', (req, res, next) => {
    verifyUserToken(req, res, next, constants.ROLE.ADMIN)
}, userController.deleteUser);


router.post('/shop-register', userController.registerShop);
router.post('/register', userController.register);
router.post('/login', userController.userLogin);
router.post('/shop-login', userController.shopLogin);
router.post('/admin-login', userController.adminLogin);
router.post('/token', userController.getUserByToken);

module.exports = router;