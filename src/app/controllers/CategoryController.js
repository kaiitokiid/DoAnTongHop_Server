const categoryModule = require('../modules/category.module');

class CategoryController {

    // [GET] /categories/
    getAllCategories(req, res, next) {
        categoryModule.getAllCategories(req, res);
    }

    // [GET] /categories/
    getCategoryById(req, res, next) {
        categoryModule.getCategoryById(req, res);
    }

    // [POST] /categories/create
    createCategory(req, res, next) {
        categoryModule.createCategory(req, res);
    }
}

module.exports = new CategoryController();
