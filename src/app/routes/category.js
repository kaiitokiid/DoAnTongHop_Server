const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/CategoryController');

// router.get('/', verifyToken, checkUser, userController.getUser);

// router.post('/register', userController.register);
router.get('/', categoryController.getAllCategories);

router.get('/:id', categoryController.getCategoryById);

router.post('/create', categoryController.createCategory);

module.exports = router;