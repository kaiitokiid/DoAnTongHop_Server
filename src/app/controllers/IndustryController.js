const userModule = require('../modules/user.module');

class IndustryController {

    // [POST] /user/register
    register(req, res, next) { 
        userModule.register(req, res, "user");
    }
}

module.exports = new IndustryController();
