const transactionrModule = require('../modules/transaction.module');

class TransactionController {

    // [GET] /get-turnover-by-id
    getTurnover(req, res, next) {
        transactionrModule.getTurnover(req, res);
    }

    // [POST] /transaction
    createTransaction(req, res, next) {
        transactionrModule.createTransaction(req, res);
    }

    // [POST] /transaction/save
    saveTransaction(req, res, next) {
        transactionrModule.saveTransaction(req, res);
    }
}

module.exports = new TransactionController();
