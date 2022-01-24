const express = require('express');
const router = express.Router();

const constants = require('../constants');
const verifyUserToken = require('../middlewares/verifyUserToken');
const productController = require('../controllers/ProductController');

router.get('/', productController.getAllProductPaging);

router.get('/for-admin', productController.getAllProductPagingAdmin);

router.get('/shop-product/:id', productController.getAllShopProductPaging);

router.get('/shop-product-for-shop/:id', productController.getAllShopProductPagingShop);

router.get('/featured', productController.getFeaturedProducts);
router.get('/most-search', productController.getMostSearchProducts);
router.get('/:id', productController.getProductById);

router.post('/similar', productController.getSimilarProducts);
router.post('/create', (req, res, next) => {
    verifyUserToken(req, res, next, constants.ROLE.SHOP)
}, productController.createProduct);

router.put('/viewcount', productController.changeViewCount);

router.put('/is-lock/:id', (req, res, next) => {
    verifyUserToken(req, res, next, constants.ROLE.ADMIN)
}, productController.isLockProduct);
// router.post('/register', userController.register);
router.put('/edit/:id', (req, res, next) => {
    verifyUserToken(req, res, next, constants.ROLE.SHOP)
}, productController.editProduct);

router.patch('/stock/:id', (req, res, next) => {
    verifyUserToken(req, res, next, constants.ROLE.SHOP)
}, productController.stock);

router.delete('/delete/:id', (req, res, next) => {
    verifyUserToken(req, res, next, constants.ROLE.SHOP)
}, productController.deleteProduct);

module.exports = router;