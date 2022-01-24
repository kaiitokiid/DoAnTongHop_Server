const express = require('express');
const router = express.Router();

const constants = require('../constants');
const verifyUserToken = require('../middlewares/verifyUserToken');


const orderController = require('../controllers/OrderController');

router.get('/shop-order', (req, res, next) => {
    verifyUserToken(req, res, next, constants.ROLE.SHOP)
}, orderController.getAllShopOrderPaging);

router.get('/get-all-order', orderController.getAllOrderPaging);

router.get('/get-order-by-id/:id', orderController.getOrderById);

router.get('/get-order-by-user-id/:id', orderController.getOrdersByUserId);

router.get('/count-confirm/:id', orderController.countConfirmOrderByShopId);

router.get('/count-delivery/:id', orderController.countDeliveryByShopId);

router.get('/count-order-month/:id', orderController.countOrderThisMonthByShopId);

router.get('/get-turnover-month/:id', orderController.getTurnoverThisMonthByShopId);

router.post('/change-state/:id', orderController.changeStateById);

// router.post('/register', userController.register);
// router.post('/login', userController.login);

module.exports = router;