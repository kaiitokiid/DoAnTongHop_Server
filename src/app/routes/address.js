const express = require('express');
const router = express.Router();

const addressController = require('../controllers/AddressController');

// router.get('/', verifyToken, checkUser, userController.getUser);

// router.post('/register', userController.register);
router.post('/add', addressController.add);

router.post('/test', addressController.test);


module.exports = router;