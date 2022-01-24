const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/TransactionController');

router.get('/get-turnover/:id', transactionController.getTurnover);

// router.post('/register', userController.register);
router.post('/', transactionController.createTransaction);

router.post('/save', transactionController.saveTransaction);

module.exports = router;