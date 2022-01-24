const orderModule = require('../modules/order.module');

class OrderController {

    // [GET] /orders/
    getAllOrderPaging(req, res, next) {
        orderModule.getAllOrderPaging(req, res);
    }

    // [GET] /orders/
    getAllShopOrderPaging(req, res, next) {
        orderModule.getAllShopOrderPaging(req, res);
    }

    // [GET] /orders/
    getOrdersByUserId(req, res, next) {
        orderModule.getOrdersByUserId(req, res);
    }

    // [GET] /orders/
    getOrderById(req, res, next) {
        orderModule.getOrderById(req, res);
    }

    // [GET] /orders/count-confirm/:id
    countConfirmOrderByShopId(req, res, next) {
        orderModule.countConfirmOrderByShopId(req, res);
    }

    // [GET] /orders/count-delivery/:id
    countDeliveryByShopId(req, res, next) {
        orderModule.countDeliveryByShopId(req, res);
    }

    // [GET] /orders/count-order-month/:id
    countOrderThisMonthByShopId(req, res, next) {
        orderModule.countOrderThisMonthByShopId(req, res);
    }

    // [GET] /orders/count-order-month/:id
    getTurnoverThisMonthByShopId(req, res, next) {
        orderModule.getTurnoverThisMonthByShopId(req, res);
    }

    // [POST] /orders/change-state
    changeStateById(req, res, next) {
        orderModule.changeStateById(req, res);
    }
}

module.exports = new OrderController();
