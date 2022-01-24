const productModule = require('../modules/product.module');

class ProductController {

    // [GET] /products?
    getAllProductPaging(req, res, next) {
        productModule.getAllProductPaging(req, res);
    }

    // [GET] /products/for-admin
    getAllProductPagingAdmin(req, res, next) {
        productModule.getAllProductPagingAdmin(req, res);
    }

    // [GET] /products/shop-product
    getAllShopProductPaging(req, res, next) {
        productModule.getAllShopProductPaging(req, res);
    }

    // [GET] /products/shop-product
    getAllShopProductPagingShop(req, res, next) {
        productModule.getAllShopProductPagingShop(req, res);
    }

    // [GET] /products/featured
    getFeaturedProducts(req, res, next) {
        productModule.getFeaturedProducts(req, res);
    }

    // [GET] /products/most-search
    getMostSearchProducts(req, res, next) {
        productModule.getMostSearchProducts(req, res);
    }

    // [GET] /products/similar
    getSimilarProducts(req, res, next) {
        productModule.getSimilarProducts(req, res);
    }

    // [GET] /products/:id
    getProductById(req, res, next) {
        productModule.getProductById(req, res);
    }

    // [POST] /product/create
    createProduct(req, res, next) {
        productModule.createProduct(req, res);
    }

    // [PUT] /product/viewcount
    changeViewCount(req, res, next) {
        productModule.changeViewCount(req, res);
    }

    // [PUT] /product/edit/:id
    editProduct(req, res, next) {
        productModule.editProduct(req, res);
    }

    // [PATCH] /product/stock/:id
    stock(req, res, next) {
        productModule.stock(req, res);
    }

    // [DELETE] /product/delete/:id
    deleteProduct(req, res, next) {
        productModule.deleteProduct(req, res);
    }

    // [PUT] /product/is-lock/:id
    isLockProduct(req, res, next) {
        productModule.isLockProduct(req, res);
    }
}

module.exports = new ProductController();
